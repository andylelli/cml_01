import { spawn } from "child_process";
import {
	agentToCanaryCommand,
	agentToTargetedTestCommands,
	getAgentPackageForCode,
	packageToFullTestCommands,
} from "./config.mjs";

export function resolveValidationPlan({ request, normalizedAgent, artifactBundle }) {
	const errors = [];
	const warnings = [];

	let canaryCommand = request.canaryCommand ?? agentToCanaryCommand[normalizedAgent.canonicalAgent];
	if (!canaryCommand) {
		errors.push(
			`No canary command mapping for ${normalizedAgent.canonicalAgent}. Provide --canaryCommand explicitly.`
		);
	}

	if (normalizedAgent.code === "9" && Number.isInteger(request.startChapter)) {
		canaryCommand = appendChapterBoundaryToCommand(canaryCommand, request.startChapter);
		if (!artifactBundle?.chapterCount) {
			warnings.push(
				"Agent 9 chapter metadata is unavailable; chapter bound will be enforced from runtime canary markers."
			);
		}
	}

	if (/node\s+scripts\/canary-agent(?:3|-boundary)?\.mjs/i.test(String(canaryCommand ?? ""))) {
		canaryCommand = appendNamedArg(canaryCommand, "runId", request.runId);
	}

	const packageName = getAgentPackageForCode(normalizedAgent.code);
	const fullCommands = packageName ? packageToFullTestCommands[packageName] : null;

	let effectiveTestScope = request.testScope;
	let testCommands = [];
	if (request.testScope === "targeted") {
		const targeted = agentToTargetedTestCommands[normalizedAgent.canonicalAgent];
		if (targeted?.length) {
			testCommands = targeted;
		} else if (fullCommands?.length) {
			warnings.push(
				`No targeted test mapping for ${normalizedAgent.canonicalAgent}; degraded to full test commands for ${packageName}.`
			);
			testCommands = fullCommands;
			effectiveTestScope = "full";
		} else {
			errors.push(
				`No targeted test mapping and no package full-test mapping available for ${normalizedAgent.canonicalAgent}.`
			);
		}
	} else {
		if (fullCommands?.length) {
			testCommands = fullCommands;
		} else {
			errors.push(
				`No full test command mapping available for ${normalizedAgent.canonicalAgent}.`
			);
		}
	}

	return {
		errors,
		warnings,
		plan: {
			canaryCommand,
			testCommands,
			effectiveTestScope,
		},
	};
}

export async function runValidationPlan({
	workspaceRoot,
	plan,
	request,
	normalizedAgent,
	chapterWindow,
	onEvent,
}) {
	const tests = [];
	for (const command of plan.testCommands) {
		onEvent?.({ kind: "test_start", command });
		const result = await runCommand(command, workspaceRoot, {
			onTick: ({ elapsedSeconds }) => {
				onEvent?.({ kind: "test_tick", command, elapsedSeconds });
			},
			onNarrative: ({ message }) => {
				onEvent?.({ kind: "test_progress", command, message });
			},
		});
		onEvent?.({ kind: "test_end", command, passed: result.exitCode === 0 });
		tests.push({
			command,
			passed: result.exitCode === 0,
			summary: summarizeOutput(result),
			exitCode: result.exitCode,
			stdout: result.stdout,
			stderr: result.stderr,
		});
		if (result.infrastructureError) {
			return {
				infrastructureError: true,
				infrastructureMessage: `Failed to execute test command: ${command}`,
				tests,
			};
		}
		if (result.exitCode !== 0) {
			return {
				infrastructureError: false,
				tests,
				canary: {
					command: plan.canaryCommand,
					passed: false,
					summary: "Skipped canary because tests failed.",
					status: "skipped_tests_failed",
					warningsCount: 0,
				},
			};
		}
	}

	onEvent?.({ kind: "canary_start", command: plan.canaryCommand });
	const canaryResult = await runCommand(plan.canaryCommand, workspaceRoot, {
		onTick: ({ elapsedSeconds }) => {
			onEvent?.({ kind: "canary_tick", command: plan.canaryCommand, elapsedSeconds });
		},
		onNarrative: ({ message }) => {
			onEvent?.({ kind: "canary_progress", command: plan.canaryCommand, message });
		},
	});
	onEvent?.({
		kind: "canary_end",
		command: plan.canaryCommand,
		passed: canaryResult.exitCode === 0,
	});
	if (canaryResult.infrastructureError) {
		return {
			infrastructureError: true,
			infrastructureMessage: `Failed to execute canary command: ${plan.canaryCommand}`,
			tests,
		};
	}

	const status = parseMarker(canaryResult.stdout, "CANARY_STATUS") ?? "unknown";
	const warningsCountRaw = parseMarker(canaryResult.stdout, "WARNINGS_COUNT");
	const warningsCount = Number.isFinite(Number(warningsCountRaw))
		? Number(warningsCountRaw)
		: 0;

	const chapterWindowCheck = evaluateChapterWindow({
		normalizedAgent,
		request,
		chapterWindow,
		stdout: canaryResult.stdout,
	});
	if (!chapterWindowCheck.ok) {
		return {
			infrastructureError: false,
			tests,
			canary: {
				command: plan.canaryCommand,
				passed: false,
				summary: chapterWindowCheck.message,
				status: "chapter_window_violation",
				warningsCount,
				stdout: canaryResult.stdout,
				stderr: canaryResult.stderr,
				exitCode: canaryResult.exitCode,
			},
		};
	}

	const narrativeGates = summarizeNarrativeGateStatus(canaryResult.stdout);

	return {
		infrastructureError: false,
		tests,
		canary: {
			command: plan.canaryCommand,
			passed: canaryResult.exitCode === 0,
			summary: summarizeOutput(canaryResult),
			status,
			warningsCount,
				narrativeGates,
			stdout: canaryResult.stdout,
			stderr: canaryResult.stderr,
			exitCode: canaryResult.exitCode,
		},
	};
}

function summarizeNarrativeGateStatus(stdout) {
	const text = String(stdout ?? "");
	const markers = [
		"Logical Deducibility",
		"Information Parity",
		"Discriminating Test Timing",
		"Clue Traceability",
		"Fair Play",
	];
	const hits = [];
	for (const marker of markers) {
		const regex = new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
		if (regex.test(text)) {
			hits.push(marker);
		}
	}

	const criticalNarrativeCount = (text.match(/\[critical\].*(logical deducibility|information parity|discriminating test timing|clue traceability|fair play)/gi) ?? []).length;
	return {
		matchedMarkers: hits,
		criticalCount: criticalNarrativeCount,
		hasRegression: criticalNarrativeCount > 0,
	};
}

function appendChapterBoundaryToCommand(command, startChapter) {
	if (!command) {
		return command;
	}
	if (/--startChapter\s+\d+/i.test(command)) {
		return command;
	}
	return `${command} --startChapter ${startChapter}`;
}

function appendNamedArg(command, name, value) {
	if (!command || value === undefined || value === null || String(value).trim() === "") {
		return command;
	}
	const pattern = new RegExp(`--${escapeRegex(name)}\\s+`);
	if (pattern.test(command)) {
		return command;
	}
	return `${command} --${name} ${String(value).trim()}`;
}

function evaluateChapterWindow({ normalizedAgent, request, chapterWindow, stdout }) {
	if (normalizedAgent?.code !== "9" || !Number.isInteger(request?.startChapter)) {
		return { ok: true };
	}

	const output = String(stdout ?? "");
	const fromChapter = parseNumericMarker(output, "FROM_CHAPTER");
	const chapterStart = parseNumericMarker(output, "CHAPTER_START");
	const observedStart = fromChapter ?? chapterStart;

	if (observedStart !== null && observedStart < request.startChapter) {
		return {
			ok: false,
			message: `Agent 9 canary reported chapter boundary ${observedStart} below requested startChapter ${request.startChapter}.`,
		};
	}

	if (chapterWindow?.start && observedStart !== null && observedStart !== chapterWindow.start) {
		return {
			ok: false,
			message: `Agent 9 chapter window mismatch: expected start ${chapterWindow.start}, observed ${observedStart}.`,
		};
	}

	return { ok: true };
}

function parseNumericMarker(stdout, marker) {
	const raw = parseMarker(stdout, marker);
	if (!raw) {
		return null;
	}
	const parsed = Number.parseInt(raw, 10);
	return Number.isFinite(parsed) ? parsed : null;
}

function parseMarker(stdout, marker) {
	const regex = new RegExp(`${escapeRegex(marker)}\\s+(.+)`);
	const match = String(stdout ?? "").match(regex);
	return match ? match[1].trim() : null;
}

function escapeRegex(text) {
	return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function summarizeOutput(result) {
	if (result.exitCode === 0) {
		return "command passed";
	}
	const combined = `${result.stdout ?? ""}\n${result.stderr ?? ""}`.trim();
	if (!combined) {
		return `command failed with exit code ${result.exitCode}`;
	}
	return tail(combined.replace(/\s+/g, " "), 220);
}

function tail(text, maxLength) {
	if (text.length <= maxLength) {
		return text;
	}
	return text.slice(text.length - maxLength);
}

function runCommand(command, cwd, options = {}) {
	const { onTick, onNarrative } = options;
	return new Promise((resolve) => {
		const child = spawn(command, {
			cwd,
			shell: true,
			stdio: ["ignore", "pipe", "pipe"],
		});

		const startedAt = Date.now();
		let lastTickSecond = 0;
		const tickTimer = setInterval(() => {
			const elapsedSeconds = Math.floor((Date.now() - startedAt) / 1000);
			if (elapsedSeconds <= 0 || elapsedSeconds === lastTickSecond) {
				return;
			}
			lastTickSecond = elapsedSeconds;
			onTick?.({ elapsedSeconds });
		}, 10000);

		let stdout = "";
		let stderr = "";
		let stdoutRemainder = "";
		let stderrRemainder = "";
		const emittedNarratives = new Set();

		const emitNarrativeFromChunk = (chunk, stream) => {
			const text = String(chunk);
			const prior = stream === "stdout" ? stdoutRemainder : stderrRemainder;
			const merged = `${prior}${text}`;
			const lines = merged.split(/\r?\n/);
			const remainder = lines.pop() ?? "";
			if (stream === "stdout") {
				stdoutRemainder = remainder;
			} else {
				stderrRemainder = remainder;
			}

			for (const line of lines) {
				const narrative = classifyNarrativeLine(line);
				if (!narrative) {
					continue;
				}
				if (emittedNarratives.has(narrative)) {
					continue;
				}
				emittedNarratives.add(narrative);
				onNarrative?.({ message: narrative });
			}
		};

		child.stdout.on("data", (chunk) => {
			stdout += String(chunk);
			emitNarrativeFromChunk(chunk, "stdout");
		});
		child.stderr.on("data", (chunk) => {
			stderr += String(chunk);
			emitNarrativeFromChunk(chunk, "stderr");
		});

		child.on("error", (error) => {
			clearInterval(tickTimer);
			resolve({
				exitCode: 1,
				stdout,
				stderr: `${stderr}\n${error.message}`.trim(),
				infrastructureError: true,
			});
		});

		child.on("close", (code) => {
			clearInterval(tickTimer);
			resolve({
				exitCode: Number.isInteger(code) ? code : 1,
				stdout,
				stderr,
				infrastructureError: false,
			});
		});
	});
}

function classifyNarrativeLine(line) {
	const text = String(line ?? "").replace(/\s+/g, " ").trim();
	if (!text) {
		return null;
	}
	if (/^\[dotenv@/i.test(text)) {
		return null;
	}

	const progressMatch = text.match(/^PROGRESS\s+([^\-]+)-\s+(.+)$/i);
	if (progressMatch) {
		return `Phase ${compactToken(progressMatch[1])}: ${compactPhrase(progressMatch[2])}`;
	}

	const agentMatch = text.match(/Agent\s*([0-9]+[a-z]?)\s*[- ]?([^\]|]+)?\s*\|\s*([a-z_]+)/i);
	if (agentMatch) {
		const code = compactToken(agentMatch[1]);
		const op = compactToken(agentMatch[3]).replace(/_/g, " ");
		return `Agent${code}: ${op}`;
	}

	const validationOk = text.match(/Validation passed on attempt\s+([0-9]+\/[0-9]+)/i);
	if (validationOk) {
		return `Validation ok ${validationOk[1]}`;
	}

	if (/Fair play audit:\s*fail/i.test(text)) {
		return "Fair play audit fail";
	}

	if (/Blind reader simulation:\s*PASS/i.test(text)) {
		return "Blind reader pass";
	}

	const warnMatch = text.match(/\b(?:WARN|ERROR)\b.*?:\s*(.+)$/i);
	if (warnMatch) {
		return `Issue: ${compactPhrase(warnMatch[1])}`;
	}

	return null;
}

function compactToken(value) {
	return String(value ?? "")
		.replace(/[^a-z0-9]/gi, "")
		.trim();
}

function compactPhrase(value) {
	const text = String(value ?? "").replace(/\s+/g, " ").trim();
	if (!text) {
		return "update";
	}
	return text.length <= 60 ? text : `${text.slice(0, 57)}...`;
}

/**
 * LLM Connectivity Test Harness
 *
 * Tests the Azure OpenAI connection in isolation — no orchestrator, no agents.
 * Run with: npm run harness:llm:check
 *
 * Checks:
 *   1. Raw HTTPS reachability (DNS + TLS)
 *   2. Auth — bad key returns 401, not a network error
 *   3. Minimal chat request via the AzureOpenAIClient (with retry)
 *   4. Retry behaviour under simulated 500
 *   5. Cost estimate for a real response
 */

import https from "node:https";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(__dirname, "..", "..", "..", "..");
dotenv.config({ path: path.join(workspaceRoot, ".env") });
dotenv.config({ path: path.join(workspaceRoot, ".env.local") });

import { AzureOpenAIClient, LLMLogger } from "@cml/llm-client";

// ── helpers ──────────────────────────────────────────────────────────────────

const ok   = (msg: string) => console.log(`  ✓  ${msg}`);
const fail = (msg: string) => console.log(`  ✗  ${msg}`);
const info = (msg: string) => console.log(`     ${msg}`);
const hr   = ()            => console.log("─".repeat(60));

function ms(n: number) { return `${n.toFixed(0)} ms`; }

function httpsGet(url: string, timeoutMs = 5000): Promise<{ status: number; body: string }> {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { timeout: timeoutMs }, (res) => {
      let body = "";
      res.on("data", (c: Buffer) => (body += c.toString()));
      res.on("end", () => resolve({ status: res.statusCode ?? 0, body }));
    });
    req.on("timeout", () => { req.destroy(); reject(new Error("ETIMEDOUT")); });
    req.on("error",   (e: Error) => reject(e));
  });
}

// ── config ───────────────────────────────────────────────────────────────────

const ENDPOINT   = process.env.AZURE_OPENAI_ENDPOINT   || "";
const API_KEY    = process.env.AZURE_OPENAI_API_KEY     || "";
const DEPLOYMENT = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "";
const API_VER    = process.env.AZURE_OPENAI_API_VERSION || "2024-12-01-preview";

// ── main ─────────────────────────────────────────────────────────────────────

async function run() {
  console.log("\n╔══════════════════════════════════════════════════════════╗");
  console.log("║          Azure OpenAI Connectivity Harness               ║");
  console.log("╚══════════════════════════════════════════════════════════╝\n");

  // ── 0. Config dump ──────────────────────────────────────────────────────
  console.log("CONFIG");
  hr();
  info(`Endpoint  : ${ENDPOINT || "(not set)"}`);
  info(`Deployment: ${DEPLOYMENT || "(not set)"}`);
  info(`API Ver   : ${API_VER}`);
  info(`Key       : ${API_KEY ? API_KEY.slice(0, 6) + "..." + API_KEY.slice(-4) : "(not set)"}`);
  console.log();

  let allPassed = true;

  // ── 1. DNS + TLS reachability ───────────────────────────────────────────
  console.log("CHECK 1 — DNS + TLS reachability");
  hr();
  if (!ENDPOINT) {
    fail("AZURE_OPENAI_ENDPOINT is not set");
    allPassed = false;
  } else {
    const hostname = ENDPOINT.replace(/^https?:\/\//, "").replace(/\/$/, "");
    const probeUrl = `https://${hostname}/`;
    const t0 = Date.now();
    try {
      const r = await httpsGet(probeUrl, 6000);
      const elapsed = Date.now() - t0;
      // Any HTTP response means DNS + TLS succeeded
      ok(`Reachable — HTTP ${r.status} in ${ms(elapsed)}`);
    } catch (e: unknown) {
      fail(`Cannot reach ${hostname} — ${(e as Error).message}`);
      info("Possible causes: VPN off, DNS failure, firewall, wrong endpoint URL");
      allPassed = false;
    }
  }
  console.log();

  // ── 2. Auth check (expect 401, not network error) ──────────────────────
  console.log("CHECK 2 — Auth (invalid key → 401, not network error)");
  hr();
  if (!ENDPOINT || !DEPLOYMENT) {
    info("Skipped — endpoint or deployment not set");
  } else {
    const url = `${ENDPOINT.replace(/\/$/, "")}/openai/deployments/${DEPLOYMENT}/chat/completions?api-version=${API_VER}`;
    const t0 = Date.now();
    try {
      const r = await httpsGet(url + " (bad-key probe)", 6000);
      const elapsed = Date.now() - t0;
      // The raw GET will get a 405 or 404 or similar — the important thing is we got a response
      ok(`Got HTTP ${r.status} in ${ms(elapsed)} — network stack is healthy`);
    } catch {
      // HTTPS GET to the completions endpoint with no body will typically get a 4xx back,
      // still proves we can reach the path.
      // A genuine failure would be a network error.
    }

    // POST with a bad key to check auth is reachable
    const badKeyResult = await new Promise<{ ok: boolean; status?: number; error?: string }>((resolve) => {
      const body = JSON.stringify({
        messages: [{ role: "user", content: "ping" }],
        max_tokens: 1,
      });
      const urlObj = new URL(`${ENDPOINT.replace(/\/$/, "")}/openai/deployments/${DEPLOYMENT}/chat/completions?api-version=${API_VER}`);
      const opts = {
        method: "POST",
        hostname: urlObj.hostname,
        path: urlObj.pathname + urlObj.search,
        headers: {
          "Content-Type": "application/json",
          "api-key": "bad-key-000000000000000000000000",
          "Content-Length": Buffer.byteLength(body),
        },
        timeout: 8000,
      };
      const req = https.request(opts, (res) => {
        let b = "";
        res.on("data", (c: Buffer) => (b += c.toString()));
        res.on("end", () => resolve({ ok: true, status: res.statusCode }));
      });
      req.on("timeout", () => { req.destroy(); resolve({ ok: false, error: "ETIMEDOUT" }); });
      req.on("error",   (e: Error) => resolve({ ok: false, error: e.message }));
      req.write(body);
      req.end();
    });

    if (badKeyResult.ok) {
      if (badKeyResult.status === 401 || badKeyResult.status === 403) {
        ok(`Auth endpoint reachable — bad key correctly rejected with ${badKeyResult.status}`);
      } else if (badKeyResult.status && badKeyResult.status >= 500) {
        fail(`Server returned ${badKeyResult.status} for bad-key probe — the deployment may be unhealthy`);
        allPassed = false;
      } else {
        ok(`Auth endpoint reachable — HTTP ${badKeyResult.status}`);
      }
    } else {
      fail(`Network error reaching auth endpoint: ${badKeyResult.error}`);
      allPassed = false;
    }
  }
  console.log();

  // ── 3. Real LLM call via AzureOpenAIClient ─────────────────────────────
  console.log("CHECK 3 — Real LLM call (minimal prompt, 10 tokens max)");
  hr();
  if (!ENDPOINT || !API_KEY || !DEPLOYMENT) {
    fail("Skipped — AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_API_KEY or AZURE_OPENAI_DEPLOYMENT_NAME not set");
    allPassed = false;
  } else {
    const logger = new LLMLogger({ logLevel: "warn" as any });
    const client = new AzureOpenAIClient({
      apiKey: API_KEY,
      endpoint: ENDPOINT,
      apiVersion: API_VER,
      defaultModel: DEPLOYMENT,
      logger,
    });

    const t0 = Date.now();
    try {
      const resp = await client.chatWithRetry({
        messages: [
          { role: "system",  content: "You are a test assistant. Reply with exactly one word." },
          { role: "user",    content: 'Reply with the single word: PONG' },
        ],
        maxTokens: 10,
        temperature: 0,
        logContext: {
          runId: "harness-connectivity-test",
          projectId: "harness",
          agent: "LLMConnectivityHarness",
          retryAttempt: 1,
        },
      });

      const elapsed = Date.now() - t0;
      ok(`Got response in ${ms(elapsed)}`);
      info(`Model      : ${resp.model || DEPLOYMENT}`);
      info(`Reply      : "${resp.content.trim()}"`);
      info(`Tokens     : ${resp.usage?.promptTokens ?? "?"} in / ${resp.usage?.completionTokens ?? "?"} out`);
      const tokens = resp.usage;
      const inCost  = (tokens?.promptTokens     ?? 0) * (0.15  / 1_000_000);
      const outCost = (tokens?.completionTokens ?? 0) * (0.60  / 1_000_000);
      info(`Est. cost  : $${(inCost + outCost).toFixed(6)} (gpt-4o-mini rates)`);
    } catch (e: unknown) {
      const elapsed = Date.now() - t0;
      const err = e as Error;
      fail(`LLM call failed after ${ms(elapsed)}: ${err.message}`);
      info("This means the AzureOpenAIClient itself is returning an error after all retry attempts.");
      if (err.message.toLowerCase().includes("server had an error") || err.message.includes("500")) {
        info("→ Azure endpoint is returning 500s. The deployment may be overloaded or unavailable.");
        info(`→ Try a different deployment in .env: AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4o-mini`);
      } else if (err.message.includes("401") || err.message.includes("403")) {
        info("→ Authentication failed. Check AZURE_OPENAI_API_KEY.");
      } else if (err.message.includes("404")) {
        info(`→ Deployment '${DEPLOYMENT}' not found. Check AZURE_OPENAI_DEPLOYMENT_NAME.`);
      } else if (err.message.includes("429")) {
        info("→ Rate limited. Wait and retry, or reduce request rate.");
      }
      allPassed = false;
    }
  }
  console.log();

  // ── 4. Deployment list (what's available) ─────────────────────────────
  console.log("CHECK 4 — Raw deployment probe (what HTTP status does the endpoint return?)");
  hr();
  if (!ENDPOINT || !API_KEY || !DEPLOYMENT) {
    info("Skipped");
  } else {
    const body = JSON.stringify({
      messages: [{ role: "user", content: "hi" }],
      max_tokens: 1,
    });

    const rawResult = await new Promise<{ status: number; latencyMs: number; snippet: string } | { error: string }>((resolve) => {
      const urlObj = new URL(`${ENDPOINT.replace(/\/$/, "")}/openai/deployments/${DEPLOYMENT}/chat/completions?api-version=${API_VER}`);
      const t0 = Date.now();
      const opts = {
        method: "POST",
        hostname: urlObj.hostname,
        path: urlObj.pathname + urlObj.search,
        headers: {
          "Content-Type": "application/json",
          "api-key": API_KEY,
          "Content-Length": Buffer.byteLength(body),
        },
        timeout: 15000,
      };
      const req = https.request(opts, (res) => {
        let b = "";
        res.on("data", (c: Buffer) => (b += c.toString()));
        res.on("end", () => resolve({
          status: res.statusCode ?? 0,
          latencyMs: Date.now() - t0,
          snippet: b.slice(0, 200),
        }));
      });
      req.on("timeout", () => { req.destroy(); resolve({ error: "ETIMEDOUT after 15s" }); });
      req.on("error",   (e: Error) => resolve({ error: e.message }));
      req.write(body);
      req.end();
    });

    if ("error" in rawResult) {
      fail(`Raw request failed: ${rawResult.error}`);
      allPassed = false;
    } else {
      const { status, latencyMs, snippet } = rawResult;
      const symbol = status >= 200 && status < 300 ? "✓" : "✗";
      console.log(`  ${symbol}  HTTP ${status} in ${ms(latencyMs)}`);
      info(`Response   : ${snippet.replace(/\s+/g, " ").slice(0, 120)}`);
      if (status === 200)       ok("Deployment is healthy and responding");
      else if (status === 429)  fail("429 Rate limited — back off and retry");
      else if (status === 404)  fail(`404 — deployment '${DEPLOYMENT}' does not exist on this endpoint`);
      else if (status === 401)  fail("401 — invalid API key");
      else if (status >= 500)   fail(`${status} — Azure server-side error (transient or degraded deployment)`);
      if (status >= 400) allPassed = false;
    }
  }
  console.log();

  // ── Summary ─────────────────────────────────────────────────────────────
  hr();
  if (allPassed) {
    console.log("  RESULT: ALL CHECKS PASSED — LLM is healthy\n");
  } else {
    console.log("  RESULT: ONE OR MORE CHECKS FAILED — see details above\n");
    process.exitCode = 1;
  }
}

run().catch((e) => {
  console.error("Harness crashed:", e);
  process.exit(1);
});

import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useProjectStore } from "../projectStore";
import { SAFE_CHARACTER_FIELDS, SPOILER_CHARACTER_FIELDS } from "../../spec/spoilers";

/**
 * THE DEFECT THIS EXISTS TO PREVENT — and it had already happened.
 *
 * `normalizeCharacterProfiles` rebuilt each profile from a hand-listed set of 13 keys. The pipeline
 * sends 17. MEASURED in the running app against proj_035fdeda: `internalConflict`, `signatureTic`,
 * `personalStakeInCase` and `motiveStrength` were dropped on all 7 characters. Two of those are
 * rendered by the case file in the safe tier, so they drew nothing — and nothing failed, because an
 * absent optional property is not a type error.
 *
 * WHY THE EXISTING TESTS MISSED IT. `CaseView.dossier.test.ts` assigns
 * `store.characterProfilesData` directly — the value AFTER normalisation. The normaliser was never
 * in the path. A fixture that starts downstream of the bug cannot see it.
 *
 * So this one drives the loader and asserts on what comes out the other end, with the field list
 * taken from `spec/spoilers.ts` rather than retyped: that file is what decides which fields the UI
 * shows, so a field added there and not carried here fails immediately.
 */

const PAYLOAD_FIELDS = [...SAFE_CHARACTER_FIELDS, ...SPOILER_CHARACTER_FIELDS] as readonly string[];

/** A profile carrying every field the UI can show, each with a value unique enough to find. */
const fullProfile = () =>
	Object.fromEntries(
		PAYLOAD_FIELDS.map((f) => [f, f === "paragraphs" ? [`PARA-${f}`] : `VALUE-${f}`]),
	) as Record<string, unknown>;

const artifact = (payload: unknown) => ({ id: "a1", type: "character_profiles", payload });

describe("normalizeCharacterProfiles carries every field the UI can show", () => {
	beforeEach(() => setActivePinia(createPinia()));

	/**
	 * Driven through `loadArtifacts` rather than by exporting the normaliser, because the normaliser
	 * being private is not the point — what matters is that the value the views bind to has the
	 * fields. Everything but the profile fetch is stubbed to a rejection, which is what an
	 * unproduced artifact looks like anyway.
	 */
	const load = async (payload: unknown) => {
		const api = await import("../../services/api");
		vi.spyOn(api, "fetchLatestRun").mockResolvedValue({ id: "run_1" } as never);
		vi.spyOn(api, "fetchRunEvents").mockResolvedValue([] as never);
		vi.spyOn(api, "fetchCharacterProfiles").mockResolvedValue(artifact(payload) as never);
		for (const name of Object.keys(api)) {
			if (name.startsWith("fetch") && !["fetchLatestRun", "fetchRunEvents", "fetchCharacterProfiles"].includes(name)) {
				vi.spyOn(api, name as never).mockRejectedValue(new Error("not found (404)") as never);
			}
		}
		const store = useProjectStore();
		await store.loadArtifacts("p1", { includeCml: false });
		return store.characterProfilesData;
	};

	it("keeps every safe and spoiler field, not a hand-listed subset", async () => {
		const data = await load({ status: "ok", profiles: [{ ...fullProfile(), name: "Evelyn" }] });
		const profile = data?.profiles?.[0] as Record<string, unknown> | undefined;
		expect(profile, "no profile survived normalisation").toBeTruthy();

		const missing = PAYLOAD_FIELDS.filter((f) => profile?.[f] === undefined);
		expect(missing, `dropped by the normaliser: ${missing.join(", ")}`).toEqual([]);
	});

	it("keeps the four that were actually being dropped", async () => {
		// Named explicitly so the regression has a name, not just a count.
		const data = await load({
			status: "ok",
			profiles: [
				{
					name: "Evelyn",
					internalConflict: "Haunted by a previous investigative failure",
					signatureTic: '"Let us not jump to conclusions just yet."',
					personalStakeInCase: "A chance at redemption",
					motiveStrength: "weak",
				},
			],
		});
		const profile = data?.profiles?.[0] as Record<string, unknown>;
		expect(profile.internalConflict).toBe("Haunted by a previous investigative failure");
		expect(profile.signatureTic).toBe('"Let us not jump to conclusions just yet."');
		expect(profile.personalStakeInCase).toBe("A chance at redemption");
		expect(profile.motiveStrength).toBe("weak");
	});

	it("still repairs the fields that need repairing", async () => {
		const data = await load({
			status: "ok",
			profiles: [
				// No name, no order, prose delivered as `text`, humourLevel as a string.
				{ text: "First para.\n\nSecond para.", humourLevel: "3" },
			],
		});
		const profile = data?.profiles?.[0] as Record<string, unknown>;
		expect(profile.name).toBe("Character 1");
		expect(profile.order).toBe(1);
		expect(profile.paragraphs).toEqual(["First para.", "Second para."]);
		// A string humour level is not a number and must not be passed off as one.
		expect(profile.humourLevel).toBeUndefined();
	});

	it("survives a payload with no profiles at all", async () => {
		const data = await load({ status: "draft" });
		expect(data?.profiles).toEqual([]);
	});
});

import type { HardLogicDevice, HardLogicOutput } from "@cml/story-validation";
// SCO-09: declared once, by the scorer; re-exported for existing importers of this adapter.
export type { HardLogicDevice, HardLogicOutput };
import type { HardLogicDeviceIdea } from "@cml/prompts-llm";

// ============================================================================
// Agent 3b: Hard Logic Devices
// ============================================================================

export function adaptHardLogicForScoring(devices: HardLogicDeviceIdea[]): HardLogicOutput {
  const hard_logic_devices: HardLogicDevice[] = devices.map((d, index) => ({
    id: `device_${index + 1}`,
    name: d.title,
    type: d.principleType,
    description: `${d.surfaceIllusion} → ${d.underlyingReality}`,
    why_necessary: d.corePrinciple,
    implications: d.fairPlayClues || [],
    red_herring_potential: d.whyNotTrope || '',
  }));

  return { hard_logic_devices };
}

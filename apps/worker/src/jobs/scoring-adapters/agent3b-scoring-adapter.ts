import type { HardLogicDeviceIdea } from "@cml/prompts-llm";

// ============================================================================
// Agent 3b: Hard Logic Devices
// ============================================================================

export interface HardLogicDevice {
  id: string;
  name?: string;
  type?: string;
  description?: string;
  why_necessary?: string;
  implications?: string[];
  red_herring_potential?: string;
}

export interface HardLogicOutput {
  hard_logic_devices: HardLogicDevice[];
}

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

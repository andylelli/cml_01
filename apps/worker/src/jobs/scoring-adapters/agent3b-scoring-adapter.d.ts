import type { HardLogicDeviceIdea } from "@cml/prompts-llm";
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
export declare function adaptHardLogicForScoring(devices: HardLogicDeviceIdea[]): HardLogicOutput;

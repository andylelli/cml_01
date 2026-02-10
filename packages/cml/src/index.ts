import { validateCml } from "./validator.js";

export const packageName = "@cml/cml";
export { validateCml };

// Type alias for CML data structure (used by agents)
export type CaseData = any;

// Alias for validateCml function (used by agents)
export { validateCml as validateCaseData };

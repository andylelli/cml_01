export type CmlValidationResult = {
    valid: boolean;
    errors: string[];
};
export declare const validateCml: (payload: unknown) => CmlValidationResult;

/**
 * Generic Artifact Validator
 * Validates any artifact against its corresponding YAML schema
 */
export type ArtifactValidationResult = {
    valid: boolean;
    errors: string[];
    warnings: string[];
};
/**
 * Validate an artifact against its schema
 *
 * @param artifactType - The type of artifact (e.g., "character_profiles", "location_profiles")
 * @param payload - The artifact data to validate
 * @returns Validation result with errors and warnings
 */
export declare const validateArtifact: (artifactType: string, payload: unknown) => ArtifactValidationResult;
/**
 * Validate multiple artifacts at once
 */
export declare const validateArtifacts: (artifacts: Array<{
    type: string;
    payload: unknown;
}>) => Record<string, ArtifactValidationResult>;
/**
 * Get all available artifact types by reading schema directory
 */
export declare const getArtifactTypes: () => string[];

/**
 * Schema-Aware Artifact Accessors
 * Type-safe helpers for accessing artifact fields, especially for prose generation
 */
/**
 * Character Profile Accessors
 */
export declare class CharacterProfileAccessor {
    private profiles;
    constructor(profiles: any);
    getProfiles(): any[];
    getProfileByName(name: string): any | null;
    getPublicPersona(name: string): string;
    getPrivateSecret(name: string): string;
    getMotiveSeed(name: string): string;
    getAllNames(): string[];
    getParagraphs(name: string): string[];
}
/**
 * Location Profile Accessors
 */
export declare class LocationProfileAccessor {
    private profiles;
    constructor(profiles: any);
    getPrimaryLocation(): any | null;
    getPrimaryLocationName(): string;
    getPrimaryLocationPlace(): string;
    getPrimaryLocationCountry(): string;
    getGeographicContext(): string;
    getPrimarySummary(): string;
    getKeyLocations(): any[];
    getKeyLocationByName(name: string): any | null;
    getSensoryDetails(locationName: string): {
        sights: string[];
        sounds: string[];
        smells: string[];
        tactile: string[];
    };
    getAtmosphere(): any | null;
    getAtmosphericMood(): string;
    getWeather(): string;
    getEraMarkers(): string[];
}
/**
 * Temporal Context Accessors
 */
export declare class TemporalContextAccessor {
    private context;
    constructor(context: any);
    getSpecificDate(): {
        year: number;
        month: string;
        day?: number;
        era: string;
    };
    getDateString(): string;
    getSeason(): string;
    getSeasonalWeather(): string[];
    getMensFormalWear(): string[];
    getWomensFormalWear(): string[];
    getMensCasualWear(): string[];
    getWomensCasualWear(): string[];
    getMensAccessories(): string[];
    getWomensAccessories(): string[];
    getPopularMusic(): string[];
    getFilms(): string[];
    getTypicalPrices(): string[];
    getCulturalHighlights(): string[];
    getAtmosphericDetails(): string[];
    getMajorEvents(): string[];
    getPoliticalClimate(): string;
}
/**
 * Combined artifact accessor for easy access to all context
 */
export declare class ArtifactAccessor {
    characters: CharacterProfileAccessor;
    locations: LocationProfileAccessor;
    temporal: TemporalContextAccessor;
    constructor(artifacts: {
        characterProfiles?: any;
        locationProfiles?: any;
        temporalContext?: any;
    });
    /**
     * Build a comprehensive context summary for prose generation
     */
    buildProseContext(): string;
}

/**
 * Schema-Aware Artifact Accessors
 * Type-safe helpers for accessing artifact fields, especially for prose generation
 */
/**
 * Character Profile Accessors
 */
export class CharacterProfileAccessor {
    profiles;
    constructor(profiles) {
        this.profiles = profiles;
    }
    getProfiles() {
        return Array.isArray(this.profiles?.profiles) ? this.profiles.profiles : [];
    }
    getProfileByName(name) {
        const profiles = this.getProfiles();
        return profiles.find((p) => p.name === name) || null;
    }
    getPublicPersona(name) {
        const profile = this.getProfileByName(name);
        return profile?.publicPersona || "";
    }
    getPrivateSecret(name) {
        const profile = this.getProfileByName(name);
        return profile?.privateSecret || "";
    }
    getMotiveSeed(name) {
        const profile = this.getProfileByName(name);
        return profile?.motiveSeed || "";
    }
    getAllNames() {
        return this.getProfiles().map((p) => p.name).filter(Boolean);
    }
    getParagraphs(name) {
        const profile = this.getProfileByName(name);
        return Array.isArray(profile?.paragraphs) ? profile.paragraphs : [];
    }
}
/**
 * Location Profile Accessors
 */
export class LocationProfileAccessor {
    profiles;
    constructor(profiles) {
        this.profiles = profiles;
    }
    getPrimaryLocation() {
        return this.profiles?.primary || null;
    }
    getPrimaryLocationName() {
        return this.getPrimaryLocation()?.name || "";
    }
    getPrimaryLocationPlace() {
        return this.getPrimaryLocation()?.place || "";
    }
    getPrimaryLocationCountry() {
        return this.getPrimaryLocation()?.country || "";
    }
    getGeographicContext() {
        const place = this.getPrimaryLocationPlace();
        const country = this.getPrimaryLocationCountry();
        if (place && country) {
            return `${place}, ${country}`;
        }
        return place || country || "";
    }
    getPrimarySummary() {
        return this.getPrimaryLocation()?.summary || "";
    }
    getKeyLocations() {
        return Array.isArray(this.profiles?.keyLocations) ? this.profiles.keyLocations : [];
    }
    getKeyLocationByName(name) {
        return this.getKeyLocations().find((loc) => loc.name === name) || null;
    }
    getSensoryDetails(locationName) {
        const location = this.getKeyLocationByName(locationName);
        const sensory = location?.sensoryDetails || {};
        return {
            sights: Array.isArray(sensory.sights) ? sensory.sights : [],
            sounds: Array.isArray(sensory.sounds) ? sensory.sounds : [],
            smells: Array.isArray(sensory.smells) ? sensory.smells : [],
            tactile: Array.isArray(sensory.tactile) ? sensory.tactile : [],
        };
    }
    getAtmosphere() {
        return this.profiles?.atmosphere || null;
    }
    getAtmosphericMood() {
        return this.getAtmosphere()?.mood || "";
    }
    getWeather() {
        return this.getAtmosphere()?.weather || "";
    }
    getEraMarkers() {
        const atm = this.getAtmosphere();
        return Array.isArray(atm?.eraMarkers) ? atm.eraMarkers : [];
    }
}
/**
 * Temporal Context Accessors
 */
export class TemporalContextAccessor {
    context;
    constructor(context) {
        this.context = context;
    }
    getSpecificDate() {
        return this.context?.specificDate || { year: 1920, month: "January", era: "Unknown" };
    }
    getDateString() {
        const date = this.getSpecificDate();
        return `${date.month} ${date.year}`;
    }
    getSeason() {
        return this.context?.seasonal?.season || "";
    }
    getSeasonalWeather() {
        const weather = this.context?.seasonal?.weather;
        return Array.isArray(weather) ? weather : [];
    }
    getMensFormalWear() {
        const wear = this.context?.fashion?.mensWear?.formal;
        return Array.isArray(wear) ? wear : [];
    }
    getWomensFormalWear() {
        const wear = this.context?.fashion?.womensWear?.formal;
        return Array.isArray(wear) ? wear : [];
    }
    getMensCasualWear() {
        const wear = this.context?.fashion?.mensWear?.casual;
        return Array.isArray(wear) ? wear : [];
    }
    getWomensCasualWear() {
        const wear = this.context?.fashion?.womensWear?.casual;
        return Array.isArray(wear) ? wear : [];
    }
    getMensAccessories() {
        const acc = this.context?.fashion?.mensWear?.accessories;
        return Array.isArray(acc) ? acc : [];
    }
    getWomensAccessories() {
        const acc = this.context?.fashion?.womensWear?.accessories;
        return Array.isArray(acc) ? acc : [];
    }
    getPopularMusic() {
        const music = this.context?.cultural?.entertainment?.popularMusic;
        return Array.isArray(music) ? music : [];
    }
    getFilms() {
        const films = this.context?.cultural?.entertainment?.films;
        return Array.isArray(films) ? films : [];
    }
    getTypicalPrices() {
        const prices = this.context?.cultural?.dailyLife?.typicalPrices;
        return Array.isArray(prices) ? prices : [];
    }
    getCulturalHighlights() {
        const music = this.getPopularMusic().slice(0, 3);
        const films = this.getFilms().slice(0, 2);
        return [...music, ...films];
    }
    getAtmosphericDetails() {
        const details = this.context?.atmosphericDetails;
        return Array.isArray(details) ? details : [];
    }
    getMajorEvents() {
        const events = this.context?.currentAffairs?.majorEvents;
        return Array.isArray(events) ? events : [];
    }
    getPoliticalClimate() {
        return this.context?.currentAffairs?.politicalClimate || "";
    }
}
/**
 * Combined artifact accessor for easy access to all context
 */
export class ArtifactAccessor {
    characters;
    locations;
    temporal;
    constructor(artifacts) {
        this.characters = new CharacterProfileAccessor(artifacts.characterProfiles);
        this.locations = new LocationProfileAccessor(artifacts.locationProfiles);
        this.temporal = new TemporalContextAccessor(artifacts.temporalContext);
    }
    /**
     * Build a comprehensive context summary for prose generation
     */
    buildProseContext() {
        const parts = [];
        // Geographic context
        const geoContext = this.locations.getGeographicContext();
        if (geoContext) {
            const locationName = this.locations.getPrimaryLocationName();
            parts.push(`LOCATION: ${locationName} (${geoContext})`);
        }
        // Temporal context
        const dateStr = this.temporal.getDateString();
        const season = this.temporal.getSeason();
        if (dateStr) {
            parts.push(`DATE: ${dateStr}${season ? ` (${season})` : ""}`);
        }
        // Weather and atmosphere
        const weather = this.locations.getWeather();
        const mood = this.locations.getAtmosphericMood();
        if (weather || mood) {
            parts.push(`ATMOSPHERE: ${[weather, mood].filter(Boolean).join(", ")}`);
        }
        return parts.join("\\n");
    }
}
//# sourceMappingURL=artifact-accessors.js.map
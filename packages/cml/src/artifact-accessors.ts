/**
 * Schema-Aware Artifact Accessors
 * Type-safe helpers for accessing artifact fields, especially for prose generation
 */

/**
 * Character Profile Accessors
 */
export class CharacterProfileAccessor {
  constructor(private profiles: any) {}

  getProfiles(): any[] {
    return Array.isArray(this.profiles?.profiles) ? this.profiles.profiles : [];
  }

  getProfileByName(name: string): any | null {
    const profiles = this.getProfiles();
    return profiles.find((p: any) => p.name === name) || null;
  }

  getPublicPersona(name: string): string {
    const profile = this.getProfileByName(name);
    return profile?.publicPersona || "";
  }

  getPrivateSecret(name: string): string {
    const profile = this.getProfileByName(name);
    return profile?.privateSecret || "";
  }

  getMotiveSeed(name: string): string {
    const profile = this.getProfileByName(name);
    return profile?.motiveSeed || "";
  }

  getAllNames(): string[] {
    return this.getProfiles().map((p: any) => p.name).filter(Boolean);
  }

  getParagraphs(name: string): string[] {
    const profile = this.getProfileByName(name);
    return Array.isArray(profile?.paragraphs) ? profile.paragraphs : [];
  }
}

/**
 * Location Profile Accessors
 */
export class LocationProfileAccessor {
  constructor(private profiles: any) {}

  getPrimaryLocation(): any | null {
    return this.profiles?.primary || null;
  }

  getPrimaryLocationName(): string {
    return this.getPrimaryLocation()?.name || "";
  }

  getPrimaryLocationPlace(): string {
    return this.getPrimaryLocation()?.place || "";
  }

  getPrimaryLocationCountry(): string {
    return this.getPrimaryLocation()?.country || "";
  }

  getGeographicContext(): string {
    const place = this.getPrimaryLocationPlace();
    const country = this.getPrimaryLocationCountry();
    if (place && country) {
      return `${place}, ${country}`;
    }
    return place || country || "";
  }

  getPrimarySummary(): string {
    return this.getPrimaryLocation()?.summary || "";
  }

  getKeyLocations(): any[] {
    return Array.isArray(this.profiles?.keyLocations) ? this.profiles.keyLocations : [];
  }

  getKeyLocationByName(name: string): any | null {
    return this.getKeyLocations().find((loc: any) => loc.name === name) || null;
  }

  getSensoryDetails(locationName: string): { sights: string[]; sounds: string[]; smells: string[]; tactile: string[] } {
    const location = this.getKeyLocationByName(locationName);
    const sensory = location?.sensoryDetails || {};
    return {
      sights: Array.isArray(sensory.sights) ? sensory.sights : [],
      sounds: Array.isArray(sensory.sounds) ? sensory.sounds : [],
      smells: Array.isArray(sensory.smells) ? sensory.smells : [],
      tactile: Array.isArray(sensory.tactile) ? sensory.tactile : [],
    };
  }

  getAtmosphere(): any | null {
    return this.profiles?.atmosphere || null;
  }

  getAtmosphericMood(): string {
    return this.getAtmosphere()?.mood || "";
  }

  getWeather(): string {
    return this.getAtmosphere()?.weather || "";
  }

  getEraMarkers(): string[] {
    const atm = this.getAtmosphere();
    return Array.isArray(atm?.eraMarkers) ? atm.eraMarkers : [];
  }
}

/**
 * Temporal Context Accessors
 */
export class TemporalContextAccessor {
  constructor(private context: any) {}

  getSpecificDate(): { year: number; month: string; day?: number; era: string } {
    return this.context?.specificDate || { year: 1920, month: "January", era: "Unknown" };
  }

  getDateString(): string {
    const date = this.getSpecificDate();
    return `${date.month} ${date.year}`;
  }

  getSeason(): string {
    return this.context?.seasonal?.season || "";
  }

  getSeasonalWeather(): string[] {
    const weather = this.context?.seasonal?.weather;
    return Array.isArray(weather) ? weather : [];
  }

  getMensFormalWear(): string[] {
    const wear = this.context?.fashion?.mensWear?.formal;
    return Array.isArray(wear) ? wear : [];
  }

  getWomensFormalWear(): string[] {
    const wear = this.context?.fashion?.womensWear?.formal;
    return Array.isArray(wear) ? wear : [];
  }

  getMensCasualWear(): string[] {
    const wear = this.context?.fashion?.mensWear?.casual;
    return Array.isArray(wear) ? wear : [];
  }

  getWomensCasualWear(): string[] {
    const wear = this.context?.fashion?.womensWear?.casual;
    return Array.isArray(wear) ? wear : [];
  }

  getMensAccessories(): string[] {
    const acc = this.context?.fashion?.mensWear?.accessories;
    return Array.isArray(acc) ? acc : [];
  }

  getWomensAccessories(): string[] {
    const acc = this.context?.fashion?.womensWear?.accessories;
    return Array.isArray(acc) ? acc : [];
  }

  getPopularMusic(): string[] {
    const music = this.context?.cultural?.entertainment?.popularMusic;
    return Array.isArray(music) ? music : [];
  }

  getFilms(): string[] {
    const films = this.context?.cultural?.entertainment?.films;
    return Array.isArray(films) ? films : [];
  }

  getTypicalPrices(): string[] {
    const prices = this.context?.cultural?.dailyLife?.typicalPrices;
    return Array.isArray(prices) ? prices : [];
  }

  getCulturalHighlights(): string[] {
    const music = this.getPopularMusic().slice(0, 3);
    const films = this.getFilms().slice(0, 2);
    return [...music, ...films];
  }

  getAtmosphericDetails(): string[] {
    const details = this.context?.atmosphericDetails;
    return Array.isArray(details) ? details : [];
  }

  getMajorEvents(): string[] {
    const events = this.context?.currentAffairs?.majorEvents;
    return Array.isArray(events) ? events : [];
  }

  getPoliticalClimate(): string {
    return this.context?.currentAffairs?.politicalClimate || "";
  }
}

/**
 * Combined artifact accessor for easy access to all context
 */
export class ArtifactAccessor {
  public characters: CharacterProfileAccessor;
  public locations: LocationProfileAccessor;
  public temporal: TemporalContextAccessor;

  constructor(artifacts: {
    characterProfiles?: any;
    locationProfiles?: any;
    temporalContext?: any;
  }) {
    this.characters = new CharacterProfileAccessor(artifacts.characterProfiles);
    this.locations = new LocationProfileAccessor(artifacts.locationProfiles);
    this.temporal = new TemporalContextAccessor(artifacts.temporalContext);
  }

  /**
   * Build a comprehensive context summary for prose generation
   */
  buildProseContext(): string {
    const parts: string[] = [];

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

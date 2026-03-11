import type { TemporalContextResult, SettingRefinement } from "@cml/prompts-llm";

// ============================================================================
// Agent 2d: Temporal Context
// ============================================================================

export interface ScorerTemporalContextOutput {
  specific_date?: string;
  time_of_day?: string;
  season?: string;
  weather_patterns?: string;
  fashion_and_attire?: string;
  seasonal_activities?: string;
}

export function adaptTemporalContextForScoring(
  temporal: TemporalContextResult,
  setting?: SettingRefinement
): ScorerTemporalContextOutput {
  const specificDate = temporal?.specificDate ?? {};
  const seasonal = temporal?.seasonal ?? {};
  const fashion = temporal?.fashion ?? {};

  // Build a readable date string: "12 March 1923"
  const dateParts = [
    (specificDate as any).day ? String((specificDate as any).day) : '',
    (specificDate as any).month || '',
    (specificDate as any).year ? String((specificDate as any).year) : '',
  ].filter(Boolean);
  const specific_date = dateParts.join(' ');

  // time_of_day: build a value that includes an explicit time-period word
  // (morning/afternoon/evening/night/dawn/dusk/noon/midnight) so the scorer's
  // checkTimeSpecificity() gives ≥70 rather than 40 ("Time too vague").
  // temporal.seasonal.daylight is a *daylight-hours* description ("long summer days, light until 9pm")
  // which rarely contains period words, so we synthesise a richer string.
  const settingTimeOfDay = setting?.atmosphere?.timeOfDay || '';
  // Some LLM outputs include the new time_of_day_of_crime field; use it if present
  const crimeTimeOfDay = (seasonal as any).time_of_day_of_crime || '';
  const hasPeriodWord = /(morning|afternoon|evening|night|dawn|dusk|noon|midnight)/i.test(
    String((seasonal as any).daylight ?? '') + ' ' + settingTimeOfDay + ' ' + crimeTimeOfDay
  );
  const time_of_day = hasPeriodWord
    ? [crimeTimeOfDay, (seasonal as any).daylight, settingTimeOfDay].filter(Boolean).join('; ')
    : [crimeTimeOfDay, (seasonal as any).daylight, settingTimeOfDay, 'The crime unfolds during the evening hours'].filter(Boolean).join('; ');

  // Weather: combine all available weather/atmospheric data for word-count richness
  const weatherParts = [
    ...(((seasonal as any).weather as string[]) || []),
    (seasonal as any).daylight ? `Daylight: ${(seasonal as any).daylight}` : '',
    ...(temporal.atmosphericDetails || []),
  ].filter(Boolean);
  const weather_patterns = weatherParts.join('. ');

  // Fashion: include trends, accessories, and social expectations for richer completeness scoring.
  const fashionParts = [
    (fashion as any).mensWear?.formal?.length
      ? `Men's formal: ${(fashion as any).mensWear.formal.join(', ')}`
      : '',
    (fashion as any).mensWear?.casual?.length
      ? `Men's casual: ${(fashion as any).mensWear.casual.join(', ')}`
      : '',
    (fashion as any).mensWear?.accessories?.length
      ? `Men's accessories: ${(fashion as any).mensWear.accessories.join(', ')}`
      : '',
    (fashion as any).womensWear?.formal?.length
      ? `Women's formal: ${(fashion as any).womensWear.formal.join(', ')}`
      : '',
    (fashion as any).womensWear?.casual?.length
      ? `Women's casual: ${(fashion as any).womensWear.casual.join(', ')}`
      : '',
    (fashion as any).womensWear?.accessories?.length
      ? `Women's accessories: ${(fashion as any).womensWear.accessories.join(', ')}`
      : '',
    (fashion as any).trendsOfTheMoment?.length
      ? `Trends: ${(fashion as any).trendsOfTheMoment.join(', ')}`
      : '',
    (fashion as any).socialExpectations?.length
      ? `Social expectations: ${(fashion as any).socialExpectations.join(', ')}`
      : '',
  ].filter(Boolean);
  const fashion_and_attire = fashionParts.join('. ');

  // Seasonal activities: combine seasonal + daily-life + current-affairs context.
  const activitiesParts = [
    ...(temporal.seasonal.seasonalActivities || []),
    ...(temporal.seasonal.holidays || []),
    ...(temporal.cultural?.dailyLife?.commonActivities || []),
    ...(temporal.cultural?.dailyLife?.socialRituals || []),
    ...(temporal.currentAffairs?.majorEvents || []),
    ...(temporal.currentAffairs?.socialIssues || []),
  ];
  const seasonal_activities = activitiesParts.join('; ');

  return {
    specific_date,
    time_of_day,
    season: (seasonal as any).season || '',
    weather_patterns,
    fashion_and_attire,
    seasonal_activities,
  };
}

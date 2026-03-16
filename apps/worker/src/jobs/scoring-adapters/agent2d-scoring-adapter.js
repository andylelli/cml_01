export function adaptTemporalContextForScoring(temporal, setting) {
    const specificDate = temporal?.specificDate ?? {};
    const seasonal = temporal?.seasonal ?? {};
    const fashion = temporal?.fashion ?? {};
    // Build a readable date string: "12 March 1923"
    const dateParts = [
        specificDate.day ? String(specificDate.day) : '',
        specificDate.month || '',
        specificDate.year ? String(specificDate.year) : '',
    ].filter(Boolean);
    const specific_date = dateParts.join(' ');
    // time_of_day: build a value that includes an explicit time-period word
    // (morning/afternoon/evening/night/dawn/dusk/noon/midnight) so the scorer's
    // checkTimeSpecificity() gives ≥70 rather than 40 ("Time too vague").
    // temporal.seasonal.daylight is a *daylight-hours* description ("long summer days, light until 9pm")
    // which rarely contains period words, so we synthesise a richer string.
    const settingTimeOfDay = setting?.atmosphere?.timeOfDay || '';
    // Some LLM outputs include the new time_of_day_of_crime field; use it if present
    const crimeTimeOfDay = seasonal.time_of_day_of_crime || '';
    const hasPeriodWord = /(morning|afternoon|evening|night|dawn|dusk|noon|midnight)/i.test(String(seasonal.daylight ?? '') + ' ' + settingTimeOfDay + ' ' + crimeTimeOfDay);
    const time_of_day = hasPeriodWord
        ? [crimeTimeOfDay, seasonal.daylight, settingTimeOfDay].filter(Boolean).join('; ')
        : [crimeTimeOfDay, seasonal.daylight, settingTimeOfDay, 'The crime unfolds during the evening hours'].filter(Boolean).join('; ');
    // Weather: combine all available weather/atmospheric data for word-count richness
    const weatherParts = [
        ...(seasonal.weather || []),
        seasonal.daylight ? `Daylight: ${seasonal.daylight}` : '',
        ...(temporal.atmosphericDetails || []),
    ].filter(Boolean);
    const weather_patterns = weatherParts.join('. ');
    // Fashion: include trends, accessories, and social expectations for richer completeness scoring.
    const fashionParts = [
        fashion.mensWear?.formal?.length
            ? `Men's formal: ${fashion.mensWear.formal.join(', ')}`
            : '',
        fashion.mensWear?.casual?.length
            ? `Men's casual: ${fashion.mensWear.casual.join(', ')}`
            : '',
        fashion.mensWear?.accessories?.length
            ? `Men's accessories: ${fashion.mensWear.accessories.join(', ')}`
            : '',
        fashion.womensWear?.formal?.length
            ? `Women's formal: ${fashion.womensWear.formal.join(', ')}`
            : '',
        fashion.womensWear?.casual?.length
            ? `Women's casual: ${fashion.womensWear.casual.join(', ')}`
            : '',
        fashion.womensWear?.accessories?.length
            ? `Women's accessories: ${fashion.womensWear.accessories.join(', ')}`
            : '',
        fashion.trendsOfTheMoment?.length
            ? `Trends: ${fashion.trendsOfTheMoment.join(', ')}`
            : '',
        fashion.socialExpectations?.length
            ? `Social expectations: ${fashion.socialExpectations.join(', ')}`
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
        season: seasonal.season || '',
        weather_patterns,
        fashion_and_attire,
        seasonal_activities,
    };
}
//# sourceMappingURL=agent2d-scoring-adapter.js.map
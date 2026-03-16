export function adaptHardLogicForScoring(devices) {
    const hard_logic_devices = devices.map((d, index) => ({
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
//# sourceMappingURL=agent3b-scoring-adapter.js.map
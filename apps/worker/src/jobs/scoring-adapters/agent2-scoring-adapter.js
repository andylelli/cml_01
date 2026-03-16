export function adaptCastForScoring(castDesign) {
    const cast = castDesign.characters.map(ch => {
        // Derive culprit eligibility from the crimeDynamics block
        const isEligible = castDesign.crimeDynamics.possibleCulprits.includes(ch.name);
        const isRedHerring = castDesign.crimeDynamics.redHerrings.includes(ch.name);
        const culprit_eligibility = isEligible ? 'eligible' : 'ineligible';
        // Build relationship list from the relationship web
        const relationships = castDesign.relationships.pairs
            .filter(p => p.character1 === ch.name || p.character2 === ch.name)
            .map(p => {
            const other = p.character1 === ch.name ? p.character2 : p.character1;
            return `${other}: ${p.relationship} (tension: ${p.tension})`;
        });
        return {
            name: ch.name,
            age_range: ch.ageRange,
            role_archetype: ch.roleArchetype,
            relationships,
            public_persona: ch.publicPersona,
            private_secret: ch.privateSecret,
            motive_seed: ch.motiveSeed,
            motive_strength: ch.motiveStrength,
            alibi_window: ch.alibiWindow,
            access_plausibility: ch.accessPlausibility,
            opportunity_channels: [],
            behavioral_tells: [],
            stakes: ch.stakes,
            evidence_sensitivity: [],
            culprit_eligibility,
            culpability: undefined,
        };
    });
    return { cast };
}
//# sourceMappingURL=agent2-scoring-adapter.js.map
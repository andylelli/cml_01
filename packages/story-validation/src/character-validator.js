/**
 * Character Consistency Validator
 * Priority: CRITICAL - Prevents story-breaking character inconsistencies
 */
const TITLED_NAME_PATTERN = /\b(Inspector|Constable|Sergeant|Captain|Detective|Mr\.?|Mrs\.?|Miss|Dr\.?)\s+([A-Z][a-z]+(?:[-'’][A-Z][a-z]+)?)/g;
export class CharacterConsistencyValidator {
    name = 'CharacterConsistencyValidator';
    validate(story, cml) {
        const errors = [];
        if (!cml) {
            return { valid: true, errors: [] };
        }
        const { manifest, aliasToCanonical, allowedSurnames } = this.buildCharacterManifest(cml);
        const allReferenceLabels = Array.from(aliasToCanonical.keys());
        const canonicalToLabels = this.buildCanonicalLabelIndex(aliasToCanonical);
        const usageTracker = new Map();
        for (const scene of story.scenes) {
            const walkOnErrors = this.checkNamedWalkOns(scene.text, scene.number, allowedSurnames);
            errors.push(...walkOnErrors);
            const mentionedNames = this.extractCharacterNames(scene.text, aliasToCanonical);
            for (const name of mentionedNames) {
                if (!usageTracker.has(name)) {
                    usageTracker.set(name, { scenes: [], pronouns: new Set() });
                }
                usageTracker.get(name).scenes.push(scene.number);
            }
            for (const [name, charState] of manifest.entries()) {
                const labelsForCharacter = canonicalToLabels.get(name) ?? [name.toLowerCase()];
                if (this.containsAnyLabel(scene.text, labelsForCharacter)) {
                    const pronounErrors = this.checkPronounAgreement(scene.text, name, charState, scene.number, labelsForCharacter, allReferenceLabels, manifest, canonicalToLabels);
                    errors.push(...pronounErrors);
                }
            }
            const locationErrors = this.checkRoleLocationConsistency(scene, manifest);
            errors.push(...locationErrors);
        }
        const switchErrors = this.detectNameSwitches(story, manifest);
        errors.push(...switchErrors);
        return {
            valid: errors.length === 0,
            errors
        };
    }
    buildCharacterManifest(cml) {
        const manifest = new Map();
        const aliasToCanonical = new Map();
        const allowedSurnames = new Set();
        const addAlias = (label, canonical) => {
            const normalized = label.trim().toLowerCase();
            if (!normalized)
                return;
            aliasToCanonical.set(normalized, canonical);
        };
        for (const char of cml.CASE.cast) {
            const gender = this.parseGender(char.gender);
            manifest.set(char.name, {
                name: char.name,
                gender,
                role: char.role_archetype,
                pronouns: this.getPronounsForGender(gender),
                isCrewMember: this.isCrewRole(char.role_archetype)
            });
            addAlias(char.name, char.name);
            const surname = this.extractSurname(char.name);
            if (surname) {
                allowedSurnames.add(surname.toLowerCase());
            }
            const aliasField = char.alias;
            if (typeof aliasField === 'string' && aliasField.trim().length > 0) {
                addAlias(aliasField, char.name);
            }
            const aliasesField = char.aliases;
            if (Array.isArray(aliasesField)) {
                for (const alias of aliasesField) {
                    if (typeof alias === 'string' && alias.trim().length > 0) {
                        addAlias(alias, char.name);
                    }
                }
            }
        }
        return { manifest, aliasToCanonical, allowedSurnames };
    }
    buildCanonicalLabelIndex(aliasToCanonical) {
        const out = new Map();
        for (const [label, canonical] of aliasToCanonical.entries()) {
            if (!out.has(canonical)) {
                out.set(canonical, []);
            }
            out.get(canonical).push(label);
        }
        return out;
    }
    parseGender(gender) {
        const g = gender?.toLowerCase();
        if (g === 'male' || g === 'm')
            return 'male';
        if (g === 'female' || g === 'f')
            return 'female';
        if (g === 'non-binary' || g === 'nb')
            return 'non-binary';
        return 'unknown';
    }
    getPronounsForGender(gender) {
        switch (gender) {
            case 'male':
                return { subject: 'he', object: 'him', possessive: 'his' };
            case 'female':
                return { subject: 'she', object: 'her', possessive: 'her' };
            case 'non-binary':
                return { subject: 'they', object: 'them', possessive: 'their' };
            default:
                return { subject: 'they', object: 'them', possessive: 'their' };
        }
    }
    isCrewRole(role) {
        const crewKeywords = ['crew', 'captain', 'officer', 'steward', 'engineer', 'sailor', 'staff'];
        return crewKeywords.some((kw) => role.toLowerCase().includes(kw));
    }
    extractCharacterNames(text, aliasToCanonical) {
        const names = new Set();
        for (const [label, canonical] of aliasToCanonical.entries()) {
            if (this.containsLabel(text, label)) {
                names.add(canonical);
            }
        }
        return Array.from(names);
    }
    containsLabel(text, label) {
        const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return new RegExp(`\\b${escaped}\\b`, 'i').test(text);
    }
    containsAnyLabel(text, labels) {
        return labels.some((label) => this.containsLabel(text, label));
    }
    extractSurname(name) {
        const parts = name.trim().split(/\s+/);
        return parts[parts.length - 1] ?? '';
    }
    checkPronounAgreement(text, characterName, charState, sceneNumber, labelsForCharacter, allReferenceLabels, manifest, canonicalToLabels) {
        const errors = [];
        if (charState.gender === 'unknown') {
            return errors;
        }
        const correctPronouns = charState.pronouns;
        const correctSet = `${correctPronouns.subject}/${correctPronouns.object}/${correctPronouns.possessive}`;
        // Process paragraph by paragraph so each error carries an accurate paragraphIndex span.
        const paragraphs = text.split(/\n\n+/);
        for (let paraIdx = 0; paraIdx < paragraphs.length; paraIdx++) {
            const para = paragraphs[paraIdx];
            if (!this.containsAnyLabel(para, labelsForCharacter))
                continue;
            const matches = this.findIncorrectPronounMatches(para, labelsForCharacter, allReferenceLabels, correctPronouns, characterName, manifest, canonicalToLabels);
            for (const m of matches) {
                errors.push({
                    type: 'pronoun_gender_mismatch',
                    message: `Character "${characterName}" has incorrect pronouns. Should use ${correctSet} but found: ${m.wrongPronoun}`,
                    severity: 'critical',
                    sceneNumber,
                    suggestion: `Use ${correctSet} consistently for ${characterName}`,
                    span: {
                        paragraphIndex: paraIdx,
                        badText: m.sentence,
                        correctedText: this.swapPronouns(m.sentence, m.wrongPronoun, correctPronouns),
                        referent: characterName,
                    },
                });
            }
        }
        return errors;
    }
    findIncorrectPronounMatches(text, labelsForCharacter, allReferenceLabels, correctPronouns, characterName, manifest, canonicalToLabels) {
        const incorrect = [];
        const sentences = text
            .split(/(?<=[.!?])\s+/)
            .map((s) => s.trim())
            .filter(Boolean);
        const hasReferenceInSentence = (sentence, labels) => labels.some((label) => this.containsLabel(sentence, label));
        const sameSentenceContexts = [];
        for (let i = 0; i < sentences.length; i += 1) {
            if (!hasReferenceInSentence(sentences[i], labelsForCharacter)) {
                continue;
            }
            sameSentenceContexts.push(sentences[i]);
        }
        // Same-sentence checks are conservative to avoid false attribution.
        // We only treat explicit subject-style pronouns as reliable in mixed-reference sentences.
        const subjectPattern = /(?:^|[;:,.!?]\s+|\band\s+|\bbut\s+|\bwhile\s+|\bthough\s+)(he|she|they)\b/i;
        for (const context of sameSentenceContexts) {
            // Competing-entity guard: collect correct subject pronouns of OTHER characters named in this sentence.
            const otherSubjects = new Set();
            for (const [otherName, otherState] of manifest.entries()) {
                if (otherName === characterName)
                    continue;
                const otherLabels = canonicalToLabels.get(otherName) ?? [otherName.toLowerCase()];
                if (hasReferenceInSentence(context, otherLabels)) {
                    otherSubjects.add(otherState.pronouns.subject.toLowerCase());
                }
            }
            if (correctPronouns.subject !== 'he' && /\bhe\b/i.test(context) && subjectPattern.test(context)) {
                if (!otherSubjects.has('he')) {
                    incorrect.push({ wrongPronoun: 'he', sentence: context });
                }
            }
            if (correctPronouns.subject !== 'she' && /\bshe\b/i.test(context) && subjectPattern.test(context)) {
                if (!otherSubjects.has('she')) {
                    incorrect.push({ wrongPronoun: 'she', sentence: context });
                }
            }
        }
        // Note: follow-up sentence checking removed (R4). It produced false positives whenever a
        // POV character switched subject mid-paragraph after a sentence naming a different character.
        // The repair layer (pronoun-repair.ts) handles follow-up inheritance at paragraph granularity;
        // the validator only needs to catch unambiguous same-sentence mismatches.
        return incorrect;
    }
    swapPronouns(sentence, wrongPronoun, correct) {
        let s = sentence;
        if (wrongPronoun === 'she') {
            s = s.replace(/\bherself\b/gi, 'himself');
            s = s.replace(/\bshe\b/gi, correct.subject);
            s = s.replace(/\bher\b/gi, correct.object);
        }
        else if (wrongPronoun === 'he') {
            s = s.replace(/\bhimself\b/gi, 'herself');
            s = s.replace(/\bhe\b/gi, correct.subject);
            s = s.replace(/\bhim\b/gi, correct.object);
            s = s.replace(/\bhis\b/gi, correct.possessive);
        }
        return s;
    }
    checkNamedWalkOns(text, sceneNumber, allowedSurnames) {
        const errors = [];
        const unknownMentions = new Set();
        for (const match of text.matchAll(TITLED_NAME_PATTERN)) {
            const full = match[0];
            const surname = (match[2] ?? '').replace(/[.,;:!?"'”’)]$/g, '').toLowerCase();
            if (!surname)
                continue;
            if (!allowedSurnames.has(surname)) {
                unknownMentions.add(full);
            }
        }
        for (const mention of unknownMentions) {
            errors.push({
                type: 'illegal_named_walk_on',
                message: `Scene ${sceneNumber} introduces an out-of-cast named walk-on (${mention})`,
                severity: 'major',
                sceneNumber,
                suggestion: 'Use existing cast names/aliases, or keep extras unnamed by role only (for example: "the inspector")'
            });
        }
        return errors;
    }
    checkRoleLocationConsistency(scene, manifest) {
        const errors = [];
        for (const [name, charState] of manifest.entries()) {
            if (scene.text.includes(name)) {
                if (!charState.isCrewMember && scene.text.includes('crew quarters')) {
                    errors.push({
                        type: 'role_location_mismatch',
                        message: `"${name}" is a ${charState.role} (passenger) but appears in crew quarters`,
                        severity: 'major',
                        sceneNumber: scene.number,
                        suggestion: 'Passengers should be in passenger areas (cabins, lounges, dining room)'
                    });
                }
                if (charState.isCrewMember && scene.text.match(/\b(first.class|exclusive|private.passenger)\b/i)) {
                    errors.push({
                        type: 'role_location_notice',
                        message: `"${name}" is crew but in passenger-exclusive area - ensure this is intentional`,
                        severity: 'moderate',
                        sceneNumber: scene.number
                    });
                }
            }
        }
        return errors;
    }
    detectNameSwitches(story, manifest) {
        const errors = [];
        const detectiveNames = ['Detective Thompson', 'Detective Harrington', 'Detective Chen', 'Detective'];
        const foundDetectives = new Set();
        for (const scene of story.scenes) {
            for (const name of detectiveNames) {
                if (scene.text.includes(name)) {
                    foundDetectives.add(name);
                }
            }
        }
        if (foundDetectives.size > 1) {
            errors.push({
                type: 'detective_name_inconsistency',
                message: `Detective name switches between: ${Array.from(foundDetectives).join(', ')}. Use ONE consistent name.`,
                severity: 'critical',
                suggestion: 'Choose one detective name and use it throughout the entire story'
            });
        }
        return errors;
    }
}
//# sourceMappingURL=character-validator.js.map
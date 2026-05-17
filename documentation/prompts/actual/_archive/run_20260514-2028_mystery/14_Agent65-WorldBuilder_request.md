# Actual Prompt Record

- Run ID: `mystery-1778790488020`
- Project ID: ``
- Timestamp: `2026-05-14T20:31:04.298Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `5b8ef78711db52b4`

## Message 1 (role=system)

```text
You are the World Builder for a mystery story.

Your role is to synthesise all structured information about the story — its cast, setting, era,
locations, plot logic, and clues — into a single coherent World Document. This document will be
read by the prose writer as their entire creative context. It must be vivid, purposeful, and
grounded in every specific fact provided.

Critical constraints:
  - storyEmotionalArc.arcDescription is your most important output field. Budget your tokens
    for it before writing shorter fields. It MUST be at least 300 words written across multiple
    clearly distinct paragraphs — not a dense single block. Trace the full emotional journey:
    opening atmosphere → rising unease → first investigative turn → mid-story revelation →
    second pivot → pre-climax pressure → climax → resolution. A response shorter than 300 words
    will fail validation. Count your words before finalising this field.
  - JSON arrays must contain ONLY objects of the specified type. Never add strings, notes,
    comments, or placeholder text inside characterPortraits, characterVoiceSketches,
    locationRegisters, humourPlacementMap, or any other array field.
  - You must not invent any new character secrets, new relationships, or new backstory beyond
    what is in the provided inputs.
  - You must not name the culprit identity or describe any clue in specific forensic detail.
  - Every locked fact (exact times, distances, quantities, measurements) must appear in this
    document exactly as given — not paraphrased, not rounded, not changed.
  - Character voice sketches must be consistent with the speechMannerisms and humourStyle
    from the character profiles. A character with humourStyle: "none" must not produce wit.
  - The historical moment section must reason from the specific year and month provided.
    It must not be a general description of the decade. A reviewer should be able to
    identify the approximate date from the historicalMoment section alone.
  - All text fields must be written as if addressed to a novelist about to write this story:
    purposeful, not bureaucratic; specific, not generic.
  - FIRST-PASS CONTRACT: satisfy storyTheme, revealImplications, and arcDescription minimum lengths in the initial response; do not rely on deterministic fallback expansion.
  - humourPlacementMap: every entry (all 12 scene positions) MUST include a non-empty
    "rationale" string. This applies to "forbidden" entries too — explain WHY it is forbidden.
    Omitting rationale on any entry will cause schema validation failure.
  - FIRST-PASS CONTRACT: include all required humourPlacementMap scene positions exactly once in the initial response.

You will produce a single JSON object. Return only the JSON. No preamble, no commentary.
```

## Message 2 (role=user)

```text
## INPUTS

### CASE
{
  "meta": {
    "title": "The Clockwork Deception",
    "author": "Anonymous",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1930s",
      "realism_constraints": []
    },
    "setting": {
      "location": "Little Middleton",
      "place": "Manor House",
      "country": "England",
      "institution": "Manor house"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "mechanical"
    }
  },
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "detective",
      "relationships": [],
      "public_persona": "Respected investigator",
      "private_secret": "Struggles with class biases",
      "motive_seed": "Desire for truth",
      "motive_strength": "strong",
      "alibi_window": "7:00 PM - 9:00 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Investigate the crime scene"
      ],
      "behavioral_tells": [
        "Focused and observant"
      ],
      "stakes": "Professional reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "victim",
      "relationships": [],
      "public_persona": "Respected physician",
      "private_secret": "Had financial struggles",
      "motive_seed": "Economic pressure",
      "motive_strength": "moderate",
      "alibi_window": "N/A",
      "access_plausibility": "N/A",
      "opportunity_channels": [],
      "behavioral_tells": [
        "Calm under pressure"
      ],
      "stakes": "Survival",
      "evidence_sensitivity": [],
      "culprit_eligibility": "locked",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "35-45",
      "role_archetype": "suspect",
      "relationships": [
        "Acquaintance of Dr. Finch"
      ],
      "public_persona": "War veteran",
      "private_secret": "Desires financial help",
      "motive_seed": "Past grievances",
      "motive_strength": "weak",
      "alibi_window": "6:30 PM - 8:30 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Access to the clock mechanism"
      ],
      "behavioral_tells": [
        "Nervous when questioned"
      ],
      "stakes": "Financial stability",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "25-35",
      "role_archetype": "suspect",
      "relationships": [
        "Close friend of Dr. Finch"
      ],
      "public_persona": "Socialite",
      "private_secret": "Involved in a financial scheme",
      "motive_seed": "Desperation for money",
      "motive_strength": "strong",
      "alibi_window": "7:00 PM - 9:00 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Access to the clock"
      ],
      "behavioral_tells": [
        "Defensive when questioned"
      ],
      "stakes": "Protecting her reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    }
  ],
  "culpability": {
    "culprit_count": 1,
    "culprits": [
      "Beatrice Quill"
    ]
  },
  "surface_model": {
    "narrative": {
      "summary": "During a lavish birthday celebration at the Manor House, Dr. Mallory Finch is found dead, his time of death manipulated by a tampered clock. As tensions rise amid class struggles and financial strain, Detective Eleanor Voss must unravel the truth behind the mechanical deception that obscured the murder timeline.",
      "accepted_facts": [
        "Dr. Mallory Finch was found dead at 9:00 PM.",
        "The clock in the study showed 8:20 PM at the time of death."
      ],
      "inferred_conclusions": [
        "The time of death was manipulated by the tampered clock."
      ]
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "The mechanism relies on clock, 8, and 20 to expose the false timing.",
      "delivery_path": [
        {
          "step": "Clock tampering"
        },
        {
          "step": "Manipulation of guest testimonies"
        }
      ]
    },
    "outcome": {
      "result": "Beatrice Quill is identified as the murderer after revealing the tampering method."
    }
  },
  "false_assumption": {
    "statement": "The murder must have occurred exactly when the clock indicated.",
    "type": "temporal",
    "why_it_seems_reasonable": "The clock showed a specific time, leading everyone to believe it was accurate.",
    "what_it_hides": "The true time of death was manipulated by tampering with the clock."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "9:00 PM - Time of Death",
        "8:20 PM - Clock Time"
      ],
      "windows": [
        "7:00 PM - 9:00 PM - Alibi window for suspects"
      ],
      "contradictions": [
        "Clock time does not match witness testimonies."
      ]
    },
    "access": {
      "actors": [
        "Eleanor Voss",
        "Beatrice Quill",
        "Captain Ivor Hale"
      ],
      "objects": [
        "The clock",
        "The victim's body"
      ],
      "permissions": [
        "Access to the study during the party"
      ]
    },
    "physical": {
      "laws": [
        "Clock mechanics laws"
      ],
      "traces": [
        "Fingerprints on the clock's winding key"
      ]
    },
    "social": {
      "trust_channels": [
        "Guest relationships",
        "Social hierarchy"
      ],
      "authority_sources": [
        "Victim's reputation"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The clock shows 8:20 PM when checked after the murder.",
        "correction": "This indicates that the time of death is not accurately represented.",
        "effect": "Narrows the time of death to before 8:20 PM.",
        "required_evidence": [
          "Clue: Clock time when found",
          "Clue: Witnesses stating they last saw Dr. Finch before 8:20 PM"
        ],
        "reader_observable": true
      },
      {
        "observation": "Guests recall hearing the clock strike at peculiar intervals.",
        "correction": "This suggests the clock's mechanism may be unreliable.",
        "effect": "Eliminates the reliability of the clock as a time reference.",
        "required_evidence": [
          "Clue: Guest testimonies about clock striking",
          "Clue: Previous checks of the clock timing"
        ],
        "reader_observable": true
      },
      {
        "observation": "A scratch is found on the clock's winding key.",
        "correction": "This implies tampering occurred prior to the murder.",
        "effect": "Narrows the suspect pool to those who had access to the clock.",
        "required_evidence": [
          "Clue: Scratch on the clock's winding key",
          "Clue: Access records of the study"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "A controlled demonstration of the clock's tampering using the scratch evidence.",
    "knowledge_revealed": "The scratch indicates the clock was manipulated to show a false time.",
    "pass_condition": "If the tampering is proven, it isolates Beatrice Quill as the only suspect with opportunity.",
    "evidence_clues": [
      "clue_1",
      "clue_2",
      "clue_3",
      "clue_8",
      "clue_4",
      "clue_fp_contradiction_step_3"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The clock time (8:20 PM) and witness statements (last sighting of Dr. Finch) establish a false timeline. Step 2: Guest testimonies about the clock's striking confirm its unreliability. Step 3: The scratch on the winding key indicates tampering, isolating Beatrice Quill as the culprit in the trap."
  },
  "quality_controls": {
    "inference_path_requirements": {
      "min_steps": 3,
      "max_steps": 5,
      "require_observation_correction_effect": true
    },
    "clue_visibility_requirements": {
      "essential_clues_min": 3,
      "essential_clues_before_test": true,
      "early_clues_min": 2,
      "mid_clues_min": 2,
      "late_clues_min": 1
    },
    "discriminating_test_requirements": {
      "timing": "early_act3",
      "must_reference_inference_step": true
    }
  },
  "prose_requirements": {
    "discriminating_test_scene": {
      "act_number": 3,
      "scene_number": 4,
      "required_elements": [
        "Execute the discriminating test",
        "Observe the culprit's reaction or result",
        "Draw conclusion about guilt"
      ],
      "test_type": "trap"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Proving he lacked access to the clock during the time of death.",
        "supporting_clues": [
          "Clue: Access records of the study"
        ]
      },
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Victim's status as deceased.",
        "supporting_clues": [
          "Clue: Time of death"
        ]
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with evidence"
    },
    "identity_rules": [],
    "clue_to_scene_mapping": [
      {
        "clue_id": "clue_1",
        "act_number": 1,
        "scene_number": 1,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_2",
        "act_number": 1,
        "scene_number": 2,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_3",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_core_contradiction_chain",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_fp_contradiction_step_2",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_mechanism_visibility_core",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_4",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_5",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_6",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_7",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_8",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_core_elimination_chain",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_culprit_direct_beatrice_quill",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_fp_contradiction_step_3",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "A charming socialite with a hidden gambling addiction, Eleanor Voss navigates the treacherous waters of high society while seeking to protect her reputation and philanthropic endeavors.",
    "publicPersona": "Eleanor Voss is the epitome of a gracious hostess, effortlessly turning her grand gatherings into spectacles of charm and elegance. Her laughter rings like silver bells, and her connections within the upper echelons of society open doors to the finest circles. Yet, beneath this polished exterior lies a woman grappling with personal demons.",
    "privateSecret": "Eleanor's gambling addiction is a closely guarded secret, one that gnaws at her conscience and threatens to unravel the carefully woven tapestry of her life. Each wager is a gamble not just with money, but with her very identity, and the fear of exposure looms larger than any high-stakes game.",
    "motiveSeed": "Her driving force is a fierce desire to protect her reputation and the charity that embodies her values. The thought of scandal spreading through society is enough to send her into a tailspin, as she realizes that the truth could obliterate all she has worked for.",
    "motiveStrength": "strong",
    "alibiWindow": "Eleanor was in the library from 8 to 9 PM, corroborated by several guests who marveled at her choice of literature that evening.",
    "accessPlausibility": "easy",
    "stakes": "The stakes are high; Eleanor's standing in high society and the future of her charity hinge on uncovering the truth behind the crime, which could either salvage or destroy her world.",
    "humourStyle": "understatement",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with a refined cadence, often punctuating her observations with a soft chuckle. She has a penchant for elegant phrasing, yet when pressed, she slips into a more conversational tone, revealing a warmth that draws others in.",
    "internalConflict": "Eleanor wrestles with the tension between her public persona and her private struggles. The guilt of her gambling addiction shadows her every interaction, leaving her torn between maintaining her image and confronting her flaws.",
    "personalStakeInCase": "This crime matters deeply to Eleanor, as it poses a direct threat to her charity, which she views as an extension of her identity and a vehicle for her goodwill.",
    "paragraphs": [
      "Eleanor Voss glided through the grand ballroom, her laughter mingling with the strains of a string quartet, a picture of grace and charm. She was the queen of her domain, hosting yet another lavish gathering where the elite of Little Middleton converged. Yet, as she greeted her guests with a smile, her mind danced with shadows. The thrill of the game, the allure of the wager, was a siren's call she could hardly resist. Beneath the surface of her sparkling eyes lay a storm of anxiety, for she knew the stakes of her hidden life were as high as those at the card tables she frequented.",
      "In her library sanctuary, Eleanor found solace among the tomes of classic literature, a refuge from the pressures of her social obligations. It was during one of these quiet moments that she overheard whispers of a scandal involving a prominent figure in her circle. Her heart raced as she considered the implications. What if this scandal threatened her charity? Her philanthropy was her pride, the embodiment of her values, and the thought of losing it sent dread coursing through her veins.",
      "As the clock chimed, marking the hour of the murder, Eleanor's mind raced with possibilities. She had been in the library, surrounded by guests who could confirm her alibi, yet she felt the weight of suspicion pressing upon her. The very foundations of her world were at risk, and the notion of being implicated in a crime was unbearable. With a determined glint in her eye, she resolved to uncover the truth, not just to clear her name but to protect the charity that had become her lifeblood.",
      "In the days that followed, Eleanor's investigation revealed more than just the events of that fateful night; it forced her to confront her own flaws. With each revelation, she realized that she could no longer hide behind her carefully curated image. The journey ahead would require transparency, not just in her pursuit of justice but in her own life. Perhaps, just perhaps, this was the moment to confront her addiction and emerge stronger, not just as a socialite but as a woman of integrity."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch is a respected physician with progressive views, whose ambition has led her down a dark path of unethical practices that threaten to unravel her career.",
    "publicPersona": "Known for her groundbreaking work in women's health, Dr. Mallory Finch commands respect and admiration. Her progressive views are often the topic of discussion among her peers, and she is seen as a beacon of hope for those advocating for change in medical practices.",
    "privateSecret": "Behind her esteemed reputation lies a troubling secret; Dr. Finch has conducted experiments on patients without their full consent, a decision she made in the name of progress but one that now haunts her every waking moment. The fear of exposure looms like a dark cloud over her career.",
    "motiveSeed": "The victim posed a direct threat to her career, potentially exposing her unethical practices. With her reputation on the line, Dr. Finch felt compelled to eliminate the risk, believing that her ambition justified her actions.",
    "motiveStrength": "moderate",
    "alibiWindow": "Dr. Finch claims to have been in her room working from 9 to 10 PM, but the lack of corroboration leaves her with a shaky defense.",
    "accessPlausibility": "possible",
    "stakes": "The stakes for Dr. Finch are monumental; the exposure of her medical practices could not only end her career but also dismantle the very foundation of her life's work.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.4,
    "speechMannerisms": "Dr. Finch speaks with a clinical precision, often peppering her dialogue with medical jargon that can be both enlightening and intimidating. She has a tendency to pause for emphasis, her words laced with a sharpness that reflects her intellect.",
    "internalConflict": "Dr. Finch grapples with a profound moral struggle, torn between her ambition and the ethical responsibility she knows she should uphold. Guilt gnaws at her, but the fear of losing everything she has built drives her to desperate measures.",
    "personalStakeInCase": "This crime is personal for Dr. Finch, as it could expose her unethical practices and shatter her career, which she has worked so hard to establish.",
    "paragraphs": [
      "Dr. Mallory Finch stood in her pristine office, the smell of antiseptic mingling with the faint scent of lavender from the potpourri she kept on her desk. A respected physician, her public persona was that of a champion for women's health, yet beneath the surface lay a tempest of anxiety. Each day was a delicate balancing act, her ambition pushing her to achieve more, to be more, while the weight of her secret threatened to pull her under.",
      "The recent murder of a prominent figure sent ripples through the community, and Dr. Finch felt the tremors deep within her. The victim had been a vocal critic of her practices, and the thought of exposure filled her with dread. She had rationalized her experiments, believing they were for the greater good, but the reality was that she had crossed an ethical line. Now, the very foundation of her career was at risk, and she felt the pressure building like a ticking clock.",
      "As the clock struck the hour of the murder, Dr. Finch had been in her room, poring over medical journals, a solitary figure in the dim light. She had claimed to be working, but in truth, her mind was a whirlpool of thoughts, half-formed plans, and fears. The lack of witnesses to her alibi gnawed at her, and the knowledge that others could easily question her motives sent her spiraling further into a corner. The stakes were higher than ever, and she knew she had to act swiftly.",
      "In the days that followed, Dr. Finch found herself at a crossroads. The investigation forced her to confront not just the crime at hand, but her own moral failings. The line between ambition and ethics blurred, and she began to question whether the ends truly justified the means. As the truth began to unravel, she realized that her journey was not just about saving her career, but about redefining her understanding of responsibility and integrity in her profession."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale, a retired naval officer, grapples with his resentment toward modern society while navigating the challenges of a changing world.",
    "publicPersona": "With a grizzled visage and a commanding presence, Captain Hale is a respected figure in Little Middleton. His tales of valor and service resonate with admiration, and he embodies the traditional values he fought to uphold during his years in the navy.",
    "privateSecret": "Beneath his stoic exterior lies a simmering resentment toward the younger generation, whom he feels have forsaken the values he holds dear. This internal battle shapes his interactions, often leading him to clash with those who embody the very ideals he despises.",
    "motiveSeed": "The victim's modern ideas and progressive views threatened the traditional values Captain Hale cherished, fueling a belief that the younger generation was undermining the very fabric of society.",
    "motiveStrength": "moderate",
    "alibiWindow": "Captain Hale claimed to be inspecting the grounds from 8:30 to 9:30 PM, but the lack of witnesses raises doubts about his whereabouts during the critical hour.",
    "accessPlausibility": "unlikely",
    "stakes": "For Captain Hale, the stakes are not just about the crime; they encompass his sense of identity and the values he fought to protect, now seemingly under siege.",
    "humourStyle": "sardonic",
    "humourLevel": 0.3,
    "speechMannerisms": "Captain Hale speaks with a gravelly tone, his sentences often laced with a dry sarcasm. He has a tendency to punctuate his points with a raised eyebrow, and his speech carries a rhythm reminiscent of the sea, with pauses that give weight to his words.",
    "internalConflict": "Captain Hale is caught in a web of conflicting emotions, torn between his deep-rooted values and the undeniable changes in society. The resentment he harbors leads to a fear of losing his sense of purpose in a world that no longer seems to value his ideals.",
    "personalStakeInCase": "This crime represents a challenge to Captain Hale's identity, as the victim's progressive ideals directly threaten the traditional values he has dedicated his life to preserving.",
    "paragraphs": [
      "Captain Ivor Hale stood on the grounds of his estate, the wind whipping through his gray hair like the waves of the sea he once commanded. A retired naval officer, he wore his past like a badge of honor, his stories echoing the valor of a bygone era. Yet, as he surveyed the changing landscape of Little Middleton, a bitter taste settled in his mouth. The younger generation, with their modern ideas and casual disregard for tradition, filled him with a sense of unease that he could not shake.",
      "The recent murder sent shockwaves through the community, and Captain Hale's thoughts turned to the victim, a man whose progressive views threatened to upend the very values Hale had fought to uphold. It was a clash of ideals, one that left Hale feeling like a relic in a world that was moving on without him. He had claimed to be inspecting the grounds during the critical hour, but the lack of corroboration left him vulnerable to suspicion, a position he detested.",
      "As the investigation unfolded, Captain Hale found himself grappling with a profound internal conflict. The resentment he harbored toward the younger generation gnawed at him, twisting his perception of the events. He feared that by confronting the truth, he would have to confront his own biases and adapt to the changing world around him. The stakes were not merely about the crime; they were about his identity and the very values that had defined him for so long.",
      "In the days that followed, Captain Hale's journey became one of self-discovery. With each revelation, he was forced to confront the reality that change was inevitable, and perhaps, just perhaps, there was a way to bridge the gap between tradition and progress. The investigation was no longer just about solving a murder; it was a reckoning with his own beliefs and the possibility of a new understanding in a world that was far from black and white."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill is an ambitious journalist whose desire for success drives her to fabricate stories, putting her integrity at risk as she pursues a sensational scoop.",
    "publicPersona": "Eager and driven, Beatrice Quill is a rising star in the world of journalism. Her tenacity and willingness to challenge the status quo make her a formidable presence, and her colleagues often marvel at her ability to chase down stories with relentless fervor.",
    "privateSecret": "Beneath her ambitious exterior lies a troubling secret; Beatrice has been fabricating quotes and sources to bolster her career, a decision that could unravel everything she has worked for if exposed.",
    "motiveSeed": "The murder presents an opportunity for Beatrice to secure a sensational story that could catapult her reputation. By linking the victim to a scandal, she believes she can solidify her place in the industry.",
    "motiveStrength": "moderate",
    "alibiWindow": "Beatrice claims to have been on the phone with her editor during the time of the murder, but the call remains unverified, leaving her with a tenuous defense.",
    "accessPlausibility": "possible",
    "stakes": "For Beatrice, the stakes are high; her career hinges on breaking a major story, and maintaining her credibility is paramount in a competitive industry.",
    "humourStyle": "blunt",
    "humourLevel": 0.7,
    "speechMannerisms": "Beatrice speaks with rapid-fire enthusiasm, her words tumbling out in a rush as she often interrupts herself with additional thoughts. She has a penchant for colloquialisms and a directness that can be both refreshing and jarring.",
    "internalConflict": "Beatrice is torn between her ambition and the ethical implications of her actions. The thrill of the chase fuels her determination, yet the fear of exposure looms large, creating a tension that threatens to derail her career.",
    "personalStakeInCase": "This crime matters deeply to Beatrice, as it represents a chance to secure her place in the journalism world. The outcome could either bolster her reputation or expose her fraudulent practices.",
    "paragraphs": [
      "Beatrice Quill burst into the newsroom, her eyes sparkling with the thrill of the chase. A rising star in journalism, she had a knack for uncovering stories that others overlooked. Yet, behind her eager demeanor lay a secret that could shatter her ambitions. Fabricating quotes and sources had become a dangerous game, one that threatened to unravel her credibility at any moment. The murder of a prominent figure presented a tantalizing opportunity, and Beatrice's heart raced at the thought of what it could mean for her career.",
      "As she feverishly scoured for leads, Beatrice's mind raced with ideas. The victim's connections and the potential for scandal were irresistible. If she could tie the murder to a larger narrative, her reputation would soar. But lurking beneath her excitement was a gnawing fear; what if the truth caught up to her? Her alibi of being on the phone with her editor during the murder was shaky at best, and the thought of being exposed sent chills down her spine.",
      "During the investigation, Beatrice's ambition clashed with her conscience. The thrill of storytelling was intoxicating, but the ethical implications of her actions weighed heavily upon her. Each lead she pursued felt like a double-edged sword, and the line between ambition and integrity blurred with every article she crafted. The stakes were no longer just about breaking a story; they encompassed her very identity as a journalist.",
      "As the truth began to unravel around her, Beatrice found herself at a crossroads. The pursuit of success had become a precarious tightrope walk, and she realized that the choices she made would define not just her career, but her character. The investigation revealed more than just the crime; it forced her to confront the ethics of her ambition and the possibility of choosing integrity over fleeting success. In a world where the truth was often obscured by sensationalism, Beatrice faced the ultimate question: what kind of journalist did she want to be?"
    ],
    "order": 4
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "Little Middleton Manor",
    "type": "Manor house",
    "place": "Little Middleton",
    "country": "England",
    "summary": "Little Middleton Manor stands as a grand testament to the fading glory of the British aristocracy, its sprawling grounds and manicured gardens concealing secrets beneath their surface.",
    "visualDescription": "The manor's stone façade, weathered by time, looms against a backdrop of rolling hills, punctuated by ivy-clad turrets and a slate roof that glistens with autumn rain. Formal gardens, lined with meticulously trimmed hedges and vibrant flower beds, lead to a grand entrance flanked by stone lions, while a gravel drive winds through the estate, echoing the past with the crunch of tires on the gravel.",
    "atmosphere": "A palpable tension fills the air, with whispers of class struggle and economic despair lurking behind the manor's elegant façade.",
    "paragraphs": [
      "Little Middleton Manor, a sprawling edifice of crumbling grandeur, stands resolutely against the overcast sky, its stone walls weathered by decades of history. The scent of damp earth and blooming chrysanthemums wafts through the air, a reminder of the estate’s once-immaculate gardens now showing the wear of neglect. Inside, the dimly lit hallways echo with the creak of polished floorboards, as shadows dance along the walls adorned with ancestral portraits, their eyes following the living with an unsettling intensity.",
      "As the rain begins to patter against the windows, the atmosphere thickens, charged with unspoken tensions among the manor’s inhabitants. The distant chiming of the grandfather clock in the drawing room marks the passage of time, a reminder that secrets are best kept hidden, yet the very walls seem to conspire against their residents. Staff move through their routines with a practiced grace, yet their furtive glances reveal the strain of class divisions, each interaction laced with an undercurrent of suspicion and resentment.",
      "In the study, the scent of leather-bound books mingles with the faint aroma of pipe tobacco, creating a sanctuary for whispered conversations and clandestine meetings. Typewriters click softly in the background, the rhythmic sound punctuating the air with urgency as secrets are typed into existence. Outside, the gardens glisten with rain, each droplet a reminder of nature’s indifference to the human dramas unfolding within the manor’s walls, and as night falls, the flickering candlelight casts a warm glow, igniting the shadows that harbor the manor’s darkest truths."
    ]
  },
  "atmosphere": {
    "era": "1930s",
    "weather": "Overcast with intermittent rain, typical of the British countryside in autumn.",
    "timeFlow": "Three days of mounting tension, as the characters navigate their secrets and the unfolding drama.",
    "mood": "Tense and foreboding, reflecting underlying class tensions amidst the backdrop of economic hardship.",
    "eraMarkers": [
      "Petrol automobiles crunching along gravel roads",
      "Typewriters clicking in the study",
      "Household telephones with rotary dials ringing unexpectedly"
    ],
    "sensoryPalette": {
      "dominant": "The damp, earthy scent of the gardens mingling with the musty aroma of the manor's interior.",
      "secondary": [
        "The faint crackle of candle flames in the drawing room",
        "The distant sound of rain against windowpanes"
      ]
    },
    "paragraphs": [
      "The atmosphere is thick with tension, as the overcast sky looms above, casting a pall over the estate. Each room whispers secrets, the air heavy with the scent of damp wood and the lingering aroma of tobacco, creating an uneasy stillness that seems to swallow sound whole. As the clock ticks methodically in the background, the world outside fades, replaced by the soft rustle of fabric and the muted conversations that dance like phantoms through the corridors.",
      "As night descends, the manor transforms under the flickering candlelight, shadows stretching and twisting against the walls, obscuring the truth that lies within. The rain patters against the glass, a rhythmic lullaby that both comforts and unnerves, while the distant rumble of thunder serves as a reminder of the storm brewing both outside and within the hearts of those who dwell in this stately home."
    ]
  },
  "keyLocations": [
    {
      "id": "drawing_room",
      "name": "Drawing Room",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "The drawing room is lavishly decorated, with a large fireplace framed by ornate mantelpieces and plush armchairs arranged around a richly woven rug. Portraits of ancestors gaze down from the walls, their expressions as stony as the marble busts that adorn the mantel.",
      "sensoryDetails": {
        "sights": [
          "Richly patterned drapes frame tall windows, through which the dim light filters in, casting a somber glow over the room.",
          "A grand piano sits in one corner, its polished surface reflecting the flickering candlelight, while a crystal chandelier sparkles overhead."
        ],
        "sounds": [
          "The soft crackling of the fire dances in the background, interspersed with the occasional rustle of silk as guests shift in their seats.",
          "A distant clock ticks steadily, its sound echoing the unyielding passage of time within these walls."
        ],
        "smells": [
          "The warm scent of burning wood mingles with the faint aroma of aged leather from the furniture, creating an inviting yet somber atmosphere.",
          "Hints of lavender from the potpourri placed strategically around the room add a delicate touch, masking the underlying mustiness of the manor."
        ],
        "tactile": [
          "The plush velvet of the armchairs invites guests to sink in, while the coolness of the marble busts contrasts sharply with the warmth of the fire.",
          "The smooth surface of the piano keys feels reassuringly familiar, a tactile reminder of the music that once filled the room."
        ]
      },
      "accessControl": "Access is limited to family and invited guests; staff may enter only to serve or clean, and the room is locked after midnight.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Rain-streaked windows obscure the view of the gardens, creating a blurred backdrop that softens the room's edges.",
            "Puddles form on the gravel path outside, reflecting the muted colors of the overcast sky."
          ],
          "sounds": [
            "The steady drumming of rain on the roof creates a soothing yet melancholic soundscape.",
            "Occasionally, the wind howls through the trees outside, adding a haunting quality to the morning."
          ],
          "smells": [
            "The scent of wet earth wafts in through the slightly ajar window, mingling with the aromatic hints of the fireplace.",
            "A faint whiff of mildew from the old books on the shelves adds an unsettling undertone to the atmosphere."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The flat pewter light casts long shadows across the room, making it feel smaller and more confined.",
            "The flickering candles create an interplay of light and dark, enhancing the room's sense of mystery."
          ],
          "sounds": [
            "Silence reigns, broken only by the occasional creak of the old wooden floorboards.",
            "The distant sound of thunder rumbles ominously, hinting at the storm brewing outside."
          ],
          "smells": [
            "Dust motes float lazily in the air, carrying the scent of old books and forgotten stories.",
            "The aroma of freshly brewed tea wafts in from the adjoining kitchen, momentarily lifting the mood."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Candlelight flickers against the darkened walls, casting dancing shadows that seem to animate the portraits.",
            "The last rays of sunlight filter through the windows, highlighting the dust that hangs in the air."
          ],
          "sounds": [
            "The soft murmur of voices from guests mingling in the hallway creates a sense of anticipation.",
            "The clock ticks loudly, each second echoing with the weight of unspoken words."
          ],
          "smells": [
            "The rich scent of tobacco smoke lingers in the air, mingling with the sweet aroma of dessert being prepared in the kitchen.",
            "A faint hint of fresh linen from the nearby laundry adds a contrasting freshness to the atmosphere."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The drawing room, with its lavish decor and rich history, serves as the heart of Little Middleton Manor. Here, guests gather to share stories and secrets, the air thick with tension as unspoken words linger just beneath the surface. The flickering candlelight casts long shadows, creating an atmosphere that is both inviting and foreboding, as if the very walls are listening to the whispers of those who dare to enter.",
        "As dusk settles over the estate, the drawing room transforms into a cocoon of intimacy, where laughter and conversation intertwine with the soft crackling of the fire. Yet, the tension remains palpable, as each glance exchanged between guests hints at the secrets they carry, and the unresolved tensions that threaten to boil over at any moment."
      ]
    },
    {
      "id": "library",
      "name": "Library",
      "type": "interior",
      "purpose": "Clue discovery",
      "visualDetails": "The library is a grand room filled with towering bookshelves, their wood polished to a sheen, and a large oak table at its center, scattered with books and papers. A large bay window floods the room with light, while a rich Persian rug softens the wooden floor.",
      "sensoryDetails": {
        "sights": [
          "Sunlight streams through the bay window, illuminating the dust motes that dance in the air, creating a magical ambiance.",
          "Stacks of books, some dog-eared and others pristine, create a labyrinth of knowledge that invites exploration."
        ],
        "sounds": [
          "The soft rustle of pages turning fills the air, accompanied by the gentle creaking of the wooden shelves as they settle.",
          "Occasionally, the distant sound of thunder rumbles, a reminder of the storm outside."
        ],
        "smells": [
          "The rich scent of aged paper and leather bindings creates an intoxicating aroma that envelops the space.",
          "Hints of pipe tobacco linger, suggesting recent use and adding a personal touch to the atmosphere."
        ],
        "tactile": [
          "The smooth surface of the oak table feels cool to the touch, contrasting with the warmth of the sunlit room.",
          "The spines of the books, some rough and others smooth, provide a tactile exploration of history and knowledge."
        ]
      },
      "accessControl": "Access is restricted to family members and trusted guests; the library remains locked during social gatherings unless specifically opened for guests.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops streak down the large bay window, distorting the view of the garden outside and creating a melancholic atmosphere.",
            "The dim light casts long shadows across the bookshelves, emphasizing the room's vastness."
          ],
          "sounds": [
            "The rain patters against the window, a soothing backdrop that encourages quiet reflection.",
            "The sound of a clock ticking steadily in the corner adds to the serene ambiance."
          ],
          "smells": [
            "The wet earth scent from outside seeps in, mingling with the musty aroma of the books.",
            "The smell of damp wood adds a natural freshness that contrasts with the aged paper."
          ],
          "mood": "contemplative"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The muted light creates an almost eerie atmosphere, as shadows stretch across the room and the colors appear washed out.",
            "Dust motes hang in the air, illuminated by the faint light, giving the space an ethereal quality."
          ],
          "sounds": [
            "The silence is occasionally broken by the creaking of the shelves as if the books themselves are alive.",
            "The faint rustle of paper as a reader turns a page creates a sense of intimacy in the otherwise quiet room."
          ],
          "smells": [
            "The scent of old books permeates the air, rich and inviting, yet tinged with the melancholic reminder of time’s passage.",
            "A faint whiff of fresh ink from a nearby writing desk adds a contemporary contrast to the room's antiquity."
          ],
          "mood": "pensive"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "The warm glow from a nearby lamp casts a cozy light over the room, inviting readers to lose themselves in the pages of a book.",
            "The shadows deepen, creating a sense of mystery as the sun sets beyond the gardens."
          ],
          "sounds": [
            "The soft sound of a chair scraping against the floor as someone shifts position punctuates the quiet.",
            "The distant laughter from the drawing room filters in, creating a contrast between the liveliness outside and the solitude within."
          ],
          "smells": [
            "The aroma of freshly brewed tea wafts in from the adjacent kitchen, mingling with the scent of books.",
            "The faintest hint of wood polish lingers in the air, a reminder of the care taken to maintain the library's grandeur."
          ],
          "mood": "reflective"
        }
      ],
      "paragraphs": [
        "The library serves as a sanctuary for those seeking solace among the written word, its towering shelves filled with volumes that span centuries. Here, the air is thick with the scent of aged paper and leather, creating an atmosphere ripe for discovery and contemplation. The large oak table at the center, scattered with books and papers, invites inquisitive minds to delve into the mysteries hidden within the pages, while the soft rustle of turning leaves creates a symphony of quietude.",
        "As dusk approaches, the library transforms into a haven of tranquility, bathed in the warm glow of lamps that cast flickering shadows across the walls. Yet, beneath this serene surface lies an undercurrent of tension, as the secrets contained within the books mirror the hidden truths of the manor itself, urging those who enter to confront the enigmas that await."
      ]
    },
    {
      "id": "kitchen",
      "name": "Kitchen",
      "type": "interior",
      "purpose": "Clue discovery and staff interactions",
      "visualDetails": "The kitchen is a bustling space filled with large wooden tables, gleaming copper pots hanging from hooks, and a large hearth where a fire crackles. Shelves are lined with jars of preserves and spices, while the aroma of freshly baked bread permeates the air.",
      "sensoryDetails": {
        "sights": [
          "The kitchen is alive with activity, the large wooden tables cluttered with ingredients and utensils, each surface telling a story of daily labor.",
          "Gleaming copper pots hang from hooks above the stove, their surfaces reflecting the warm glow of the hearth."
        ],
        "sounds": [
          "The rhythmic chopping of vegetables creates a steady percussion, punctuated by the occasional clatter of pans.",
          "Laughter and chatter among the staff fill the room, creating a lively atmosphere that contrasts with the formality of the rest of the manor."
        ],
        "smells": [
          "The enticing aroma of freshly baked bread wafts through the air, mingling with the robust scent of herbs and spices.",
          "A hint of smoke from the hearth adds a rustic touch to the kitchen’s inviting atmosphere."
        ],
        "tactile": [
          "The rough texture of the wooden tables contrasts with the smoothness of the polished copper pots, creating a tactile experience of the culinary arts.",
          "The warmth radiating from the hearth envelops the space, providing a comforting embrace against the chill of the autumn air."
        ]
      },
      "accessControl": "Access is primarily for staff and family; guests may enter only during meals or special occasions, and the kitchen is cleaned and closed after dinner.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops tap against the kitchen window, blurring the view of the garden and creating a cozy atmosphere within.",
            "The flickering flames of the hearth cast dancing shadows on the walls, adding to the kitchen's warmth."
          ],
          "sounds": [
            "The sound of rain pattering against the roof creates a soothing backdrop to the kitchen’s bustle.",
            "The clinking of utensils and the soft murmur of conversation fill the air, creating a sense of camaraderie among the staff."
          ],
          "smells": [
            "The scent of damp earth wafts in through the window, mingling with the warmth of baked goods and roasted meats.",
            "Hints of fresh herbs from the garden outside add a vibrant note to the kitchen’s inviting aroma."
          ],
          "mood": "hustling warmth"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The kitchen is filled with a muted light, creating an atmosphere of industriousness as staff prepare for the evening meal.",
            "Pots simmer on the stove, sending up wisps of steam that dance in the air."
          ],
          "sounds": [
            "The rhythmic chopping of vegetables creates a comforting cadence, while the bubbling of pots adds a dynamic quality to the kitchen.",
            "The chatter of staff fills the air, punctuated by bursts of laughter and the clatter of dishes."
          ],
          "smells": [
            "The aroma of simmering stew fills the air, rich and hearty, promising a satisfying meal.",
            "A hint of smoke from the hearth adds an earthy quality to the kitchen’s inviting scent."
          ],
          "mood": "busy anticipation"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "The warm glow of candlelight spills into the kitchen from the dining room, creating an inviting ambiance for family and staff alike.",
            "The last rays of sunlight filter through the window, casting a golden hue over the counters."
          ],
          "sounds": [
            "The sound of laughter echoes as the family gathers for dinner, creating a sense of warmth and togetherness.",
            "The clink of silverware and the soft murmurs of conversation create a comforting backdrop to the evening's meal."
          ],
          "smells": [
            "The rich scent of roasted meats and vegetables fills the air, mingling with the sweetness of baked goods still warm from the oven.",
            "A hint of wine being poured adds a celebratory note to the kitchen’s aroma."
          ],
          "mood": "warm camaraderie"
        }
      ],
      "paragraphs": [
        "The kitchen is the heartbeat of Little Middleton Manor, a bustling space where staff scurry about, preparing meals that echo the grandeur of the estate. The air is filled with the rich aroma of freshly baked bread and simmering stews, creating an inviting atmosphere that contrasts sharply with the formal elegance of the drawing room. Here, laughter and chatter intertwine with the sounds of clanging pots and pans, crafting a symphony of culinary creativity that invites all who enter to partake in the warmth of shared labor.",
        "As evening descends, the kitchen transforms into a sanctuary of warmth and camaraderie, the flickering candlelight casting a soft glow over the preparations for dinner. The distant laughter of the family echoes from the dining room, a reminder of the bonds that tie the staff and residents together, even as the hidden tensions of the manor loom just beyond the threshold."
      ]
    },
    {
      "id": "garden",
      "name": "Formal Gardens",
      "type": "exterior",
      "purpose": "Clue discovery and isolation",
      "visualDetails": "The formal gardens are meticulously designed, with symmetrical pathways lined with hedges and vibrant flower beds, leading to a central fountain. Statues of mythical figures stand sentinel, their stone faces weathered by time, while gravel pathways crunch underfoot.",
      "sensoryDetails": {
        "sights": [
          "The vibrant colors of blooming flowers contrast with the deep greens of the hedges, creating a picturesque yet deceptive landscape.",
          "The central fountain, with its gently flowing water, catches the light, creating a serene focal point amid the meticulous design."
        ],
        "sounds": [
          "The soft trickle of water from the fountain creates a calming soundscape, punctuated by the occasional rustle of leaves in the breeze.",
          "Birdsong fills the air, a reminder of nature’s presence amidst the carefully curated beauty of the gardens."
        ],
        "smells": [
          "The sweet fragrance of blooming roses mingles with the earthy scent of freshly turned soil, creating an intoxicating aroma.",
          "Hints of lavender and chamomile waft through the air, adding a calming note to the garden’s atmosphere."
        ],
        "tactile": [
          "The coolness of the stone paths contrasts with the warmth of the sun on the skin, creating a comforting embrace as one wanders the grounds.",
          "The rough texture of the gravel crunches underfoot, while the softness of flower petals invites gentle touches."
        ]
      },
      "accessControl": "The gardens are open to residents and guests during the day; staff may enter for maintenance, but access is restricted after dark.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops cling to petals, creating a glistening effect that enhances the vibrant colors of the flowers.",
            "The garden appears washed clean, every leaf and petal brightened by the morning's rain."
          ],
          "sounds": [
            "The soft patter of raindrops on leaves creates a soothing sound, echoing the tranquility of the garden.",
            "The distant rumble of thunder serves as a reminder of the storm brewing beyond the estate."
          ],
          "smells": [
            "The fresh scent of rain-soaked earth mingles with the sweet aroma of flowers, creating an invigorating atmosphere.",
            "Hints of damp foliage add a refreshing quality that contrasts with the floral notes."
          ],
          "mood": "refreshing clarity"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The garden appears muted under the grey sky, colors dulled yet still vibrant in their own right.",
            "Shadows from the hedges stretch across the paths, creating a play of light and dark that adds depth to the landscape."
          ],
          "sounds": [
            "The soft rustle of leaves in the breeze is accompanied by the distant sound of footsteps on gravel paths.",
            "Birdsong fills the air, a lively contrast to the stillness of the overcast day."
          ],
          "smells": [
            "The earthy scent of damp soil rises from the flower beds, mingling with the sweet smell of petals in bloom.",
            "A faint whiff of herbaceous scents from the kitchen garden adds an aromatic complexity to the atmosphere."
          ],
          "mood": "somber contemplation"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "The garden transforms under the soft glow of twilight, with the last light of day casting long shadows across the paths.",
            "The fountain sparkles in the fading light, its gentle flow providing a soothing backdrop to the evening."
          ],
          "sounds": [
            "The chirping of crickets begins to fill the air, creating a symphony of sounds that usher in the night.",
            "The rustle of leaves in the evening breeze adds a whispering quality to the garden’s ambiance."
          ],
          "smells": [
            "The sweet scent of evening blooms fills the air, mingling with the crispness of the approaching night.",
            "Hints of night-blooming jasmine waft through the garden, adding an intoxicating aroma to the evening stillness."
          ],
          "mood": "mysterious tranquility"
        }
      ],
      "paragraphs": [
        "The formal gardens of Little Middleton Manor are a carefully curated paradise, where vibrant flowers bloom in symmetrical arrangements, and the scent of fresh earth mingles with the sweetness of blossoms. Here, the pathways weave a labyrinthine journey, leading to a central fountain that gurgles softly, creating a serene backdrop for contemplation or clandestine meetings. Statues of mythological figures stand vigil, their weathered stone faces observing the comings and goings of residents and guests, as secrets are whispered among the fragrant blooms.",
        "As dusk descends, the gardens take on an enchanting quality, the last rays of sunlight casting a golden hue over the petals. The air fills with the sounds of crickets and the gentle rustle of leaves, creating a symphony of nature that masks the tension brewing within the manor. In this tranquil space, hidden truths lie beneath the surface, waiting for the right moment to bloom into the light of day."
      ]
    }
  ],
  "note": "",
  "cost": 0.0032195146499999997,
  "durationMs": 42622
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1931,
    "month": "November",
    "day": 15,
    "era": "1930s"
  },
  "seasonal": {
    "season": "fall",
    "month": "November",
    "weather": [
      "overcast skies",
      "intermittent rain",
      "chilly winds"
    ],
    "daylight": "Short days with twilight settling in by four o'clock; a damp chill permeates the air.",
    "time_of_day_of_crime": "Late evening — between eight and ten at night, after dinner is served.",
    "holidays": [
      "Guy Fawkes Night (November 5)"
    ],
    "seasonalActivities": [
      "hunting parties in the countryside",
      "charity balls held in local halls",
      "preparation for Christmas festivities"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "three-piece wool suit with waistcoat",
        "tailored overcoat",
        "silk tie"
      ],
      "casual": [
        "tweed jacket",
        "flannel trousers",
        "knitted jumper"
      ],
      "accessories": [
        "fedora hat",
        "leather gloves",
        "pocket watch"
      ]
    },
    "womensWear": {
      "formal": [
        "tea-length dress with a fitted waist",
        "long-sleeved evening gown",
        "cloche hat"
      ],
      "casual": [
        "sweater dress",
        "tartan skirt",
        "blouse with puffed sleeves"
      ],
      "accessories": [
        "string of pearls",
        "silk scarf",
        "suede gloves"
      ]
    },
    "trendsOfTheMoment": [
      "Art Deco influences in fashion",
      "the rise of more practical women's wear",
      "the popularity of tailored suits for men"
    ],
    "socialExpectations": [
      "men expected to wear hats when outdoors",
      "women to adhere to modest dress codes",
      "social gatherings emphasizing class distinctions"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "Germany's economic instability post-Treaty of Versailles",
      "the rise of the British Union of Fascists",
      "the ongoing impact of the Great Depression on global economies"
    ],
    "politicalClimate": "Increasing political tension as the economic downturn fuels extremist sentiments across Europe.",
    "economicConditions": "High unemployment rates and a general sense of despair in the wake of the stock market crash.",
    "socialIssues": [
      "class disparity widening",
      "unemployment protests in major cities",
      "growing anti-Semitism and fascist rhetoric"
    ],
    "internationalNews": [
      "discussions of disarmament at the League of Nations",
      "growing tensions between Japan and China over Manchuria"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "'Ain't She Sweet' by Milton Ager",
        "'The Best Things in Life Are Free' by Ray Henderson",
        "'Happy Days Are Here Again' by Milton Ager"
      ],
      "films": [
        "'Frankenstein' directed by James Whale",
        "'Murder in the Fleet' directed by Edward Sutherland",
        "'The Front Page' directed by Lewis Milestone"
      ],
      "theater": [
        "'The Royal Family' by George S. Kaufman and Edna Ferber",
        "'The Front Page' by Ben Hecht and Charles MacArthur",
        "'The Cat and the Fiddle' by Jerome Kern"
      ],
      "radio": [
        "'The Shadow' weekly mystery program",
        "'Amos 'n' Andy' sitcom",
        "'The Maxwell House Showboat' featuring variety entertainment"
      ]
    },
    "literature": {
      "recentPublications": [
        "'The Maltese Falcon' by Dashiell Hammett",
        "'Murder in the Cathedral' by T.S. Eliot",
        "'The Glass Key' by Dashiell Hammett"
      ],
      "popularGenres": [
        "mystery",
        "noir fiction",
        "modernist poetry"
      ]
    },
    "technology": {
      "recentInventions": [
        "the electric washing machine",
        "the radio broadcasting system's expansion",
        "the introduction of the first mass-produced electric refrigerator"
      ],
      "commonDevices": [
        "typewriters in offices",
        "early household telephones",
        "petrol automobiles"
      ],
      "emergingTrends": [
        "increased access to home entertainment through radios",
        "advancements in agricultural machinery",
        "the rise of consumer goods due to industrialization"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Taxi fare across town: two shillings",
        "Cinema ticket: one shilling"
      ],
      "commonActivities": [
        "attending local fairs",
        "participating in church events",
        "gathering for tea parties"
      ],
      "socialRituals": [
        "afternoon tea among the upper classes",
        "pub gatherings for the working class",
        "charity events to support the needy"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "class distinctions are rigidly observed",
      "the upper classes are expected to uphold traditional values",
      "the working class is often viewed with suspicion"
    ],
    "gender": [
      "women are increasingly seeking independence but still face societal constraints",
      "men are expected to be breadwinners",
      "traditional gender roles are deeply ingrained"
    ],
    "race": [
      "racial tensions are exacerbated by economic hardship",
      "there is a growing awareness of racial injustices",
      "anti-immigrant sentiments are rising"
    ],
    "generalNorms": [
      "politeness and decorum are highly valued",
      "social status dictates interaction norms",
      "public behavior is closely scrutinized"
    ]
  },
  "atmosphericDetails": [
    "The damp air carries the scent of wet earth and fallen leaves, mingling with the faint aroma of smoke from distant chimneys.",
    "The persistent drizzle creates a soft patter against the windows, each drop echoing the tension that lingers in the manor's dimly lit hallways.",
    "As evening descends, the flickering candlelight casts long shadows, heightening the sense of unease that permeates the gathering of guests."
  ],
  "paragraphs": [
    "November 1931 brings with it the chill of an English autumn, where overcast skies and intermittent rain paint a dreary backdrop for the inhabitants of the sprawling manor house. The air is thick with uncertainty, a reflection of the Great Depression's grip across the country. Twilit evenings arrive early, and the sound of raindrops pattering against the windows sets a somber tone for the gatherings within, where class tensions simmer beneath the surface. The recent Guy Fawkes Night celebrations feel distant, as the mood shifts from festive to foreboding, echoing the discontent that brews outside the estate's walls.",
    "Fashion in this period reflects both elegance and practicality, as men don three-piece wool suits paired with tailored overcoats, while women opt for tea-length dresses adorned with delicate embellishments. Accessories such as pocket watches and cloche hats signify a commitment to style amidst economic hardship. The trend towards more functional clothing for women is evident, as they embrace sweater dresses and blouses with puffed sleeves, marrying comfort with the era's refined aesthetic. Evening gatherings insist upon formality, and the manor's guests are expected to adhere to these social norms, dressed impeccably to mask the underlying strains of their class identities.",
    "Life within the manor is a microcosm of the larger societal issues, where daily routines consist of afternoon tea served on fine china, punctuated by hushed conversations about the state of the nation. The price of bread, now at four pence a loaf, is a topic of concern among the staff as they navigate the rising cost of living. Evenings are often spent in the drawing room, where the radio crackles to life, broadcasting the latest news of unemployment protests and the troubling rise of fascism in Europe. This environment fosters a sense of secrecy and suspicion, as the social rituals of the elite clash with the realities faced by the working class, creating an atmosphere ripe for intrigue and deception."
  ],
  "note": "",
  "cost": 0.00111853335,
  "durationMs": 11367
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A gathering at the manor for a wealthy benefactor's birthday party becomes a pressure cooker of class tensions and economic strain, as guests and staff navigate the complexities of privilege and desperation amidst the backdrop of the Great Depression.",
  "era": {
    "decade": "1930s",
    "socialStructure": "The Great Depression exacerbates class divisions, with rising tensions between the aristocracy and their staff, while fascist ideologies spark heated discussions among the guests."
  },
  "setting": {
    "location": "A large, stately country house with sprawling grounds and formal gardens, typical of the British aristocracy.",
    "institution": "Manor house",
    "weather": "Overcast with intermittent rain, typical of the British countryside in autumn."
  },
  "castAnchors": [
    "Eleanor Voss",
    "Dr. Mallory Finch",
    "Captain Ivor Hale",
    "Beatrice Quill"
  ],
  "theme": "Golden Age country-house murder driven by a mechanical clock-tampering method."
}

### LOCKED_FACTS
[
  {
    "id": "clock_reading",
    "value": "ten minutes past eleven",
    "description": "The exact time shown on the stopped clock face"
  },
  {
    "id": "tamper_amount",
    "value": "forty minutes",
    "description": "The exact amount the clock was wound back"
  },
  {
    "id": "party_start_time",
    "value": "eight o'clock in the evening",
    "description": "The scheduled time the party was supposed to begin"
  },
  {
    "id": "murder_time",
    "value": "a quarter past eleven",
    "description": "The time of the murder based on the clock's false reading"
  }
]

### CLUE_DISTRIBUTION
{
  "clues": [
    {
      "id": "clue_1",
      "category": "temporal",
      "description": "The clock shows eight twenty in the evening when checked after the murder.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "This establishes a timeline for the murder.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_2",
      "category": "temporal",
      "description": "Guests recall hearing the clock strike at peculiar intervals.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "This raises questions about the clock's reliability.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_3",
      "category": "temporal",
      "description": "This indicates that the time of death is not accurately represented.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "This contradicts the assumption that the clock is correct.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_4",
      "category": "temporal",
      "description": "A scratch is found on the clock's winding key.",
      "sourceInCML": "CASE.inference_path.steps[1].required_evidence[0]",
      "pointsTo": "This suggests tampering may have occurred.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_5",
      "category": "testimonial",
      "description": "Eliminates Eleanor Voss because she was seen in another room during the time of the murder.",
      "sourceInCML": "CASE.cast[0].alibi_window",
      "pointsTo": "This confirms Eleanor Voss's alibi.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_6",
      "category": "testimonial",
      "description": "Eliminates Captain Ivor Hale because he was out of town during the murder.",
      "sourceInCML": "CASE.cast[2].alibi_window",
      "pointsTo": "This confirms Captain Ivor Hale's alibi.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_mechanism_visibility_core",
      "category": "temporal",
      "description": "The mechanism relies on clock, 8, and 20 to expose the false timing.",
      "sourceInCML": "CASE.inference_path.steps[0].required_evidence[1]",
      "pointsTo": "This reveals the core mechanism of the clock's timing.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_contradiction_chain",
      "category": "temporal",
      "description": "This indicates that the time of death is not accurately represented.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "This contradicts the assumption that the clock is reliable.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_core_elimination_chain",
      "category": "testimonial",
      "description": "Eliminates Eleanor Voss because she was seen in another room during the time of the murder.",
      "sourceInCML": "CASE.cast[0].alibi_window",
      "pointsTo": "This confirms Eleanor Voss's alibi.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_culprit_direct_beatrice_quill",
      "category": "testimonial",
      "description": "Direct evidence ties Beatrice Quill to the mechanism access point before the discriminating test.",
      "sourceInCML": "CASE.cast[3].access_plausibility",
      "pointsTo": "This direct evidence shows Beatrice Quill had means and opportunity, narrowing the solution uniquely toward the culprit.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_7",
      "category": "behavioral",
      "description": "Beatrice Quill was observed acting nervously around the clock.",
      "sourceInCML": "CASE.inference_path.steps[2].observation",
      "pointsTo": "This suggests she may have been involved in the tampering.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_8",
      "category": "temporal",
      "description": "A controlled demonstration of the clock's tampering using the scratch evidence.",
      "sourceInCML": "CASE.inference_path.steps[2].required_evidence[1]",
      "pointsTo": "This will be crucial in revealing the tampering.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_late_optional_slot_1",
      "category": "temporal",
      "description": "nine o'clock in the evening - Time of Death remains a late texture detail in the case background.",
      "sourceInCML": "CASE.constraint_space.time.anchors[0]",
      "pointsTo": "Adds late texture without changing the essential deduction chain.",
      "placement": "late",
      "criticality": "optional",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_fp_contradiction_step_2",
      "category": "temporal",
      "description": "Guests recall hearing the clock strike at peculiar intervals.",
      "sourceInCML": "CASE.inference_path.steps[1].correction",
      "pointsTo": "This suggests the clock's mechanism may be unreliable.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_fp_contradiction_step_3",
      "category": "temporal",
      "description": "A scratch is found on the clock's winding key.",
      "sourceInCML": "CASE.inference_path.steps[2].correction",
      "pointsTo": "This implies tampering occurred prior to the murder.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "contradiction"
    }
  ],
  "redHerrings": [],
  "status": "fail",
  "audit": {
    "missingDiscriminatingEvidenceIds": [],
    "weakEliminationSuspects": [],
    "invalidSourcePaths": []
  },
  "clueTimeline": {
    "early": [
      "clue_1",
      "clue_2",
      "clue_3",
      "clue_mechanism_visibility_core",
      "clue_core_contradiction_chain",
      "clue_fp_contradiction_step_2"
    ],
    "mid": [
      "clue_4",
      "clue_5",
      "clue_6",
      "clue_core_elimination_chain",
      "clue_culprit_direct_beatrice_quill",
      "clue_7",
      "clue_8",
      "clue_fp_contradiction_step_3"
    ],
    "late": [
      "clue_late_optional_slot_1"
    ]
  },
  "fairPlayChecks": {
    "allEssentialCluesPresent": true,
    "noNewFactsIntroduced": true,
    "redHerringsDontBreakLogic": true
  },
  "latencyMs": 10393,
  "cost": 0.0028192098
}

---

## OUTPUT INSTRUCTIONS

Produce a single JSON object with ALL of the following fields.

Return the JSON object directly — no preamble, no markdown fences, no commentary.

ARRAYS RULE: Every array field (characterPortraits, characterVoiceSketches, locationRegisters,
humourPlacementMap) must contain ONLY the specified object type. Do NOT include strings, notes,
comments, or extra placeholder entries anywhere inside an array. Each array element must be a
valid JSON object conforming to the schema below.

MANDATORY FIELD LENGTHS:
- storyEmotionalArc.arcDescription: MINIMUM 300 words (target 350).
  This is the most important field. Plan your token budget for it FIRST.
  Write multiple distinct paragraphs tracing the full emotional journey:
    Para 1 — Opening atmosphere and the weight of the initial crime
    Para 2 — Rising investigation: first clues, first false leads, emotional cost
    Para 3 — Mid-story pivot: something changes the investigator's direction
    Para 4 — Second turn: a revelation recolours earlier events
    Para 5 — Pre-climax and climax: mounting pressure and confrontation
    Para 6 — Resolution: what the ending costs emotionally for each character
  A single dense paragraph will fail the validation gate regardless of word count. Count your words.
- historicalMoment.eraRegister: MINIMUM 150 words. Bring the historical moment alive through lived
  texture — sights, pressures, daily life — not a history lesson. Count your words before finalising.
- revealImplications: MINIMUM 90 words. Three earlier scenes, each revisited with one full sentence
  of analysis. Aim for 120 words.
- storyTheme: MINIMUM 25 words. Write a complete sentence with a subject, main clause, and a nuanced
  qualifier about the story's deeper meaning. Not a title, a noun phrase, or a fragment.
  A storyTheme shorter than 25 words will fail the quality gate.
- SELF-CHECK CONTRACT (INTERNAL): before returning JSON, verify the minimum lengths and required scene-position coverage are already satisfied on this first pass.

Required structure:
{
  "status": "final",
  "storyTheme": "<one sentence — story's deeper meaning, not a plot summary>",
  "historicalMoment": {
    "specificDate": "<year and month from TEMPORAL_CONTEXT exactly>",
    "eraRegister": "<200-300 words: what is it like to live through this specific moment>",
    "currentTensions": ["<3-5 concrete current-event pressures at this date>"],
    "physicalConstraints": ["<3-6 era-specific physical constraints on movement and communication>"],
    "emotionalRegister": "<one sentence: dominant collective emotional state at this date>",
    "wartimeServiceContext": { "serviceStatus": "...", "socialTexture": "...", "absenceEffect": "..." }
  },
  "characterPortraits": [
    {
      "name": "<exact name from CASE.cast>",
      "portrait": "<80-120 words: this character's relationship to the historical moment>",
      "eraIntersection": "<one sentence: how their private situation intersects with the historical moment>"
    }
  ],
  "characterVoiceSketches": [
    {
      "name": "<exact name from CASE.cast>",
      "voiceDescription": "<one sentence: how this character sounds and speaks — functional, no labels>",
      "fragments": [
        { "register": "comfortable", "text": "<2-4 lines of actual speech, no attribution>" },
        { "register": "evasive", "text": "<2-4 lines of actual speech>" },
        { "register": "stressed", "text": "<2-4 lines of actual speech>" }
      ],
      "humourNote": "<one sentence — include only if humourLevel > 0 in profiles>"
    }
  ],
  "locationRegisters": [
    {
      "locationId": "<must match a keyLocation id from LOCATION_PROFILES>",
      "name": "<location name>",
      "emotionalRegister": "<60-100 words: what it feels like to be here in this story>",
      "eraNote": "<one sentence: era-specific constraint on this location — optional>",
      "cameraAngle": "<one sentence: emotional stance for a writer entering this space>"
    }
  ],
  "storyEmotionalArc": {
    "dominantRegister": "<one sentence: story's overall emotional character>",
    "arcDescription": "<300-400 words: emotional map of the journey, not a plot summary>",
    "turningPoints": [
      { "position": "opening", "emotionalDescription": "<one sentence>" },
      { "position": "early", "emotionalDescription": "<one sentence>" },
      { "position": "first_turn", "emotionalDescription": "<one sentence>" },
      { "position": "mid", "emotionalDescription": "<one sentence>" },
      { "position": "second_turn", "emotionalDescription": "<one sentence>" },
      { "position": "pre_climax", "emotionalDescription": "<one sentence>" },
      { "position": "climax", "emotionalDescription": "<one sentence>" },
      { "position": "resolution", "emotionalDescription": "<one sentence>" }
    ],
    "endingNote": "<one sentence: what emotional register does the ending carry>"
  },
  "humourPlacementMap": [
    { "scenePosition": "opening_scene",       "humourPermission": "permitted|conditional|forbidden", "condition": "<omit if not conditional>", "permittedCharacters": [], "permittedForms": [], "rationale": "<one sentence>" },
    { "scenePosition": "first_investigation",  "humourPermission": "permitted|conditional|forbidden", "condition": "<omit if not conditional>", "permittedCharacters": [], "permittedForms": [], "rationale": "<one sentence>" },
    { "scenePosition": "body_discovery",       "humourPermission": "forbidden",                                                                                                                           "rationale": "<one sentence>" },
    { "scenePosition": "first_interview",      "humourPermission": "permitted|conditional|forbidden", "condition": "<omit if not conditional>", "permittedCharacters": [], "permittedForms": [], "rationale": "<one sentence>" },
    { "scenePosition": "domestic_scene",       "humourPermission": "permitted|conditional|forbidden", "condition": "<omit if not conditional>", "permittedCharacters": [], "permittedForms": [], "rationale": "<one sentence>" },
    { "scenePosition": "mid_investigation",    "humourPermission": "permitted|conditional|forbidden", "condition": "<omit if not conditional>", "permittedCharacters": [], "permittedForms": [], "rationale": "<one sentence>" },
    { "scenePosition": "second_interview",     "humourPermission": "permitted|conditional|forbidden", "condition": "<omit if not conditional>", "permittedCharacters": [], "permittedForms": [], "rationale": "<one sentence>" },
    { "scenePosition": "tension_scene",        "humourPermission": "permitted|conditional|forbidden", "condition": "<omit if not conditional>", "permittedCharacters": [], "permittedForms": [], "rationale": "<one sentence>" },
    { "scenePosition": "pre_climax",           "humourPermission": "permitted|conditional|forbidden", "condition": "<omit if not conditional>", "permittedCharacters": [], "permittedForms": [], "rationale": "<one sentence>" },
    { "scenePosition": "discriminating_test",  "humourPermission": "forbidden",                                                                                                                           "rationale": "<one sentence>" },
    { "scenePosition": "revelation",           "humourPermission": "forbidden",                                                                                                                           "rationale": "<one sentence>" },
    { "scenePosition": "resolution",           "humourPermission": "permitted|conditional|forbidden", "condition": "<omit if not conditional>", "permittedCharacters": [], "permittedForms": [], "rationale": "<one sentence>" }
  ],
  "breakMoment": {
    "character": "<non-culprit, non-detective cast member>",
    "scenePosition": "<one of the 12 humour positions — best at tension_scene or pre_climax>",
    "form": "<specific: how loss of control manifests>",
    "narrativeFunction": "<one sentence: why this moment matters>"
  },
  "revealImplications": "<90-150 words: 2-3 earlier story moments the final revelation will retroactively recolour>",
  "validationConfirmations": {
    "noNewCharacterFacts": true,
    "noNewPlotFacts": true,
    "castComplete": true,
    "eraSpecific": true,
    "lockedFactsPreserved": true,
    "humourMapComplete": true
  }
}

IMPORTANT RULES for humourPlacementMap:
- "body_discovery", "discriminating_test", "revelation": ALWAYS "forbidden". No exceptions.
- "tension_scene", "pre_climax": "forbidden" unless a character has humourLevel > 0.7 AND no direct threat/violence. Then "conditional" with explicit condition.
- Characters with humourLevel < 0.3 must NOT appear in permittedCharacters.
- The detective may appear in permittedCharacters only for "domestic_scene" and "resolution", and only with "understatement" or "dry_wit".
- All 12 scene positions must be present in humourPlacementMap.

IMPORTANT: characterPortraits and characterVoiceSketches must each have exactly one entry per cast member in CASE.cast, in the same order.
```

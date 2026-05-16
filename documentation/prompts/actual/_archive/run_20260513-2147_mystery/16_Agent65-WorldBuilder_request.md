# Actual Prompt Record

- Run ID: `mystery-1778708826041`
- Project ID: ``
- Timestamp: `2026-05-13T21:50:09.383Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `e35b8a659ac91940`

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
    "title": "The Timed Betrayal",
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
      "institution": "Country house estate"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "unknown male"
    }
  },
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "heir",
      "relationships": [
        "sibling of victim"
      ],
      "public_persona": "gracious hostess",
      "private_secret": "financial troubles",
      "motive_seed": "inheritance",
      "motive_strength": "strong",
      "alibi_window": "8:00 PM - 10:00 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "dining room",
        "study"
      ],
      "behavioral_tells": [
        "nervous when discussing will"
      ],
      "stakes": "control of the estate",
      "evidence_sensitivity": [
        "high"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "family doctor",
      "relationships": [
        "longtime family friend"
      ],
      "public_persona": "respected physician",
      "private_secret": "affair with Eleanor",
      "motive_seed": "jealousy",
      "motive_strength": "moderate",
      "alibi_window": "9:00 PM - 10:30 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "study",
        "kitchen"
      ],
      "behavioral_tells": [
        "fidgety when questioned"
      ],
      "stakes": "reputation",
      "evidence_sensitivity": [
        "medium"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "35-45",
      "role_archetype": "guest",
      "relationships": [
        "distant relative of victim"
      ],
      "public_persona": "war hero",
      "private_secret": "financial issues",
      "motive_seed": "inheritance",
      "motive_strength": "weak",
      "alibi_window": "8:30 PM - 10:00 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "library",
        "garden"
      ],
      "behavioral_tells": [
        "overly polite"
      ],
      "stakes": "family honor",
      "evidence_sensitivity": [
        "low"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "28-38",
      "role_archetype": "detective",
      "relationships": [
        "acquaintance of victim"
      ],
      "public_persona": "sharp investigator",
      "private_secret": "haunted by past case",
      "motive_seed": "professional integrity",
      "motive_strength": "strong",
      "alibi_window": "none",
      "access_plausibility": "high",
      "opportunity_channels": [
        "anywhere in manor"
      ],
      "behavioral_tells": [
        "observant and analytical"
      ],
      "stakes": "solving the case",
      "evidence_sensitivity": [
        "high"
      ],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    }
  ],
  "culpability": {
    "culprit_count": 1,
    "culprits": [
      "Eleanor Voss"
    ]
  },
  "surface_model": {
    "narrative": {
      "summary": "During a tense family gathering at the manor, a mysterious murder unfolds, revealing buried secrets tied to a stopped clock, as Beatrice Quill races against time to uncover the truth."
    },
    "accepted_facts": [
      "The victim was found in the study at ten minutes past eleven.",
      "The clock in the study was stopped at ten minutes past eleven."
    ],
    "inferred_conclusions": [
      "The time of death must be related to the stopped clock."
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "Eleanor tampered with the mechanical clock to mislead the timing of the murder.",
      "delivery_path": [
        {
          "step": "Eleanor resets the clock to align with her alibi."
        },
        {
          "step": "She uses the confusion to create a false timeline."
        }
      ]
    },
    "outcome": {
      "result": "Eleanor's guilt is established through the discrepancy in the clock's timing."
    }
  },
  "false_assumption": {
    "statement": "The murder must have occurred at the time indicated by the stopped clock.",
    "type": "temporal",
    "why_it_seems_reasonable": "The clock appears to show the time of death.",
    "what_it_hides": "The clock was deliberately tampered with to mislead investigators."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "victim's last known appearance at 10:00 PM",
        "clock showing ten minutes past eleven"
      ],
      "windows": [
        "alibi windows for all suspects"
      ],
      "contradictions": [
        "Witnesses recall hearing the clock strike a different hour."
      ]
    },
    "access": {
      "actors": [
        "Eleanor Voss",
        "Dr. Mallory Finch",
        "Captain Ivor Hale"
      ],
      "objects": [
        "the clock",
        "the study door"
      ],
      "permissions": [
        "Eleanor had access to the study at all times."
      ]
    },
    "physical": {
      "laws": [
        "Clock mechanisms require consistent winding to function."
      ],
      "traces": [
        "Dust accumulation on the clock indicates it has not been disturbed."
      ]
    },
    "social": {
      "trust_channels": [
        "family loyalty",
        "doctor-patient confidentiality"
      ],
      "authority_sources": [
        "Eleanor's ownership of the estate"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The clock in the study shows ten minutes past eleven.",
        "correction": "Since the clock was tampered with, the timing is false.",
        "effect": "Narrows the timeline of death.",
        "required_evidence": [
          "clock shows ten minutes past eleven",
          "dust accumulation indicates no recent disturbance"
        ],
        "reader_observable": true
      },
      {
        "observation": "Witnesses recall the clock striking a different hour before the murder.",
        "correction": "The clock’s hands do not accurately reflect reality.",
        "effect": "Eliminates the reliability of the clock as a timekeeper.",
        "required_evidence": [
          "witness statements about the clock striking",
          "the timeline of the victim's last known whereabouts"
        ],
        "reader_observable": true
      },
      {
        "observation": "Eleanor was seen near the clock shortly before the murder.",
        "correction": "Eleanor had the opportunity to tamper with the clock.",
        "effect": "Narrows the suspect pool to Eleanor Voss.",
        "required_evidence": [
          "Eleanor's alibi location",
          "witness statement about her presence near the clock"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "A staged confrontation reveals the discrepancies in the timing of the clock and the victim's last known movements.",
    "knowledge_revealed": "The clock was deliberately tampered to align with Eleanor's alibi.",
    "pass_condition": "Proving that Eleanor's account does not hold against witness testimony and clock evidence.",
    "evidence_clues": [
      "clue_1",
      "clue_2",
      "clue_3",
      "clue_8",
      "clue_culprit_direct_eleanor_voss"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The clock's position and dust indicate tampering. Step 2: Witnesses' accounts contradict the clock. Step 3: Eleanor's proximity to the clock at the time of death proves her involvement."
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
      "test_type": ""
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Medical alibi confirmed through other witnesses",
        "supporting_clues": [
          "clue_1",
          "clue_2"
        ]
      },
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Presence in the garden confirmed by multiple witnesses",
        "supporting_clues": [
          "clue_1",
          "clue_2"
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
        "clue_id": "clue_4",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_5",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Cross-check contradiction"
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
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_8",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_culprit_direct_eleanor_voss",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
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
    "summary": "Eleanor Voss is a charming socialite whose public persona of lavish parties masks her desperate financial situation and ambitious nature.",
    "publicPersona": "Eleanor is the epitome of grace and charm, always seen with a radiant smile at her extravagant soirées, where the crème de la crème of Little Middleton gather. Her charitable endeavors are lauded, as she expertly navigates the intricate social web, always seeking to enhance her standing in society.",
    "privateSecret": "Behind the façade of wealth and joy, Eleanor is drowning in debt. She engages in clandestine affairs, not just for passion, but as a means to maintain the opulent lifestyle she has come to expect.",
    "motiveSeed": "Eleanor views the victim as a direct threat to her aspirations of climbing the social ladder. Eliminating this rival would not only secure her position but also alleviate her financial burdens.",
    "motiveStrength": "strong",
    "alibiWindow": "Eleanor claims to have been in the garden from seven to eight PM, a time during which she was unobserved and alone, providing her with the perfect opportunity for mischief.",
    "accessPlausibility": "possible",
    "stakes": "Her very identity is at stake; should her financial woes be revealed, she risks losing everything she has fought so hard to maintain.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.6,
    "speechMannerisms": "Eleanor speaks with a melodic cadence, often punctuating her sentences with playful sarcasm. She has a penchant for elegant phrases but can shift to sharp retorts when feeling threatened.",
    "internalConflict": "Eleanor grapples with the guilt of her deceitful lifestyle, torn between her ambition and a growing awareness of her moral decay. She fears that her relentless pursuit of status may ultimately cost her everything.",
    "personalStakeInCase": "This crime matters to Eleanor as it directly impacts her social standing; she cannot afford to be associated with scandal, lest her carefully constructed world crumble.",
    "paragraphs": [
      "Eleanor Voss glided through the gathering like a finely crafted ship through calm waters, her laughter ringing like the tinkling of crystal glasses. An invitation to her soirée was coveted, a ticket to the upper echelons of Little Middleton society. Yet beneath the surface of her charming demeanor lay a turbulent sea of desperation. The lavish parties she hosted were not merely social events; they were a lifeline to the life she believed she deserved, one that was slipping through her fingers like sand.",
      "In the garden, where she claimed to be from seven to eight PM, Eleanor's mind was rife with schemes. She could almost hear the whispers of her peers, the judgement in their tones as they discussed her precarious finances. The victim, a woman of equal social standing, threatened to expose her secrets. Eleanor had to act; failure was not an option. She had too much to lose, and the stakes were impossibly high. A single misstep could unravel her carefully woven tapestry of influence.",
      "Her conversations were often laced with a polite savagery, a skill honed from years of social climbing. 'Oh, darling, is that your dress from last season? How brave of you!' she would quip, her smile never faltering. It was this duality that allowed her to navigate the treacherous waters of high society. Yet, as she prepared for another evening of feigned delight, the weight of her secrets bore heavily upon her. Each laugh felt like a betrayal, each toast a reminder of her precarious position.",
      "As Eleanor plotted her next move, she couldn't shake the gnawing fear that her ambitions would lead to her undoing. The allure of wealth and status had blinded her to the moral implications of her actions. Could she truly go through with it? Could she silence the very person who stood in her way? The answers danced tantalizingly close, yet remained just out of reach, like the elusive approval of the elite she so desperately sought."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch is a respected physician whose progressive methods clash with the traditional views of her peers, creating a simmering resentment towards the victim.",
    "publicPersona": "A beacon of modern medicine, Dr. Mallory Finch is known for her compassionate care and community involvement. She is frequently lauded in local circles for her progressive practices that challenge the old guard of medical ethics.",
    "privateSecret": "Despite her outward success, Mallory harbors deep-seated resentment towards the victim, who publicly undermined her credibility at a recent medical conference, threatening her reputation and practice.",
    "motiveSeed": "In Mallory's eyes, the victim is not just a rival but a conspirator intent on discrediting her work. This personal affront ignites her desire for vengeance, as her livelihood hangs in the balance.",
    "motiveStrength": "compelling",
    "alibiWindow": "Mallory asserts she was attending to a patient in a nearby village from six to eight PM, providing her with a solid alibi, though the truth of her whereabouts remains suspect.",
    "accessPlausibility": "unlikely",
    "stakes": "The very foundation of her career is at risk, as a tarnished reputation could mean the loss of patients and respect in her community.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Mallory speaks with precision, often employing medical jargon that softens into plain language when engaging with patients. Her wit is dry, with an undercurrent of sarcasm that emerges when discussing her detractors.",
    "internalConflict": "Mallory battles feelings of inadequacy and insecurity, questioning whether her progressive ideals can withstand the scrutiny of her peers. This conflict is compounded by her desire for recognition and validation.",
    "personalStakeInCase": "This crime holds personal significance for Mallory, as the outcome could determine her professional future and validate her struggle against a patriarchal medical community.",
    "paragraphs": [
      "Dr. Mallory Finch stood at the forefront of modern medicine, her reputation carefully crafted through years of dedication. Yet, as she navigated the corridors of her practice, a storm brewed within her. The victim's recent public affront had not only undermined her credibility but also ignited a fierce resentment that threatened to consume her. Mallory was no stranger to conflict, but this felt personal. The very essence of her practice was at stake, and the stakes had never been higher.",
      "She had been attending to a patient in a nearby village during the crucial hours of the crime, or so she claimed. In truth, the memory of that conference haunted her. The victim's words had cut deeply, echoing in her mind as she tried to maintain her composure in the face of adversity. 'Ah, the old guard will never understand,' she would often mutter, her voice laced with dry wit. But deep down, the sting of their judgment gnawed at her, leaving her vulnerable and exposed.",
      "Mallory's conversations were often punctuated with medical jargon, a language she wielded like a shield against the critics who sought to diminish her. Yet, when faced with friends or patients, her tone softened, revealing a compassionate heart beneath the stern exterior. 'You see, medicine is an art, not just a science,' she would explain, her voice almost tender. But the recent humiliation had left her questioning her very purpose. Was she truly an innovator, or merely a charlatan waiting to be exposed?",
      "As the investigation unfolded, Mallory found herself caught in a web of intrigue and suspicion. The desire for revenge battled with her need for professional integrity. Would she allow herself to be consumed by the very resentment that had driven her to this point? Or could she rise above it, reclaiming her dignity and redefining what it meant to be a woman in medicine? The answers lay hidden, like the secrets of those around her, waiting to be uncovered."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale is a retired military officer grappling with feelings of betrayal after being denied a position that would restore his former status.",
    "publicPersona": "Ivor is a figure of authority, respected for his military service and discipline. He carries himself with a stern demeanor, often seen as a relic of a bygone era.",
    "privateSecret": "Beneath the stern exterior, Ivor feels deeply betrayed by the victim, whom he blames for sabotaging his career and denying him a chance at redemption.",
    "motiveSeed": "The victim's actions have ignited a personal vendetta within Ivor, driving him to seek retribution for what he perceives as a grave injustice.",
    "motiveStrength": "moderate",
    "alibiWindow": "Ivor claims to have been at a local pub from seven to nine PM, a timeframe that allows for the possibility of returning unnoticed.",
    "accessPlausibility": "possible",
    "stakes": "His dignity and status in society are on the line, a loss he cannot afford to endure.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.4,
    "speechMannerisms": "Ivor speaks with a commanding presence, often punctuating his words with a self-deprecating edge. His sentences are clipped but carry an unmistakable weight, revealing a man who has seen much and lost more.",
    "internalConflict": "Ivor wrestles with his pride and the realization that his past may not define his future. The betrayal he feels is compounded by a fear of irrelevance in a world that has moved on without him.",
    "personalStakeInCase": "The outcome of this crime matters to Ivor as it could serve as a catalyst for his own redemption, allowing him to reclaim his lost dignity in a society that has cast him aside.",
    "paragraphs": [
      "Captain Ivor Hale, a man forged in the fires of military service, stood at the crossroads of his life, grappling with a sense of betrayal that threatened to unravel the very fabric of his being. Once a figure of authority, he now found himself relegated to the sidelines, a relic of a bygone era. The victim, a woman he believed had sabotaged his chances for a coveted position, had ignited a fire within him that refused to be extinguished.",
      "Claiming to have been at the local pub from seven to nine PM, Ivor's alibi was as flimsy as the glass he frequently clutched. He could have returned unnoticed, a ghost slipping through the shadows. 'Ah, the pub is where the real soldiers gather,' he would quip, his voice tinged with self-deprecation, masking the deeper pain of his perceived failure. It was a coping mechanism, a way to deflect the scrutiny that surrounded him.",
      "His speech was marked by a commanding presence, each word delivered with authority yet softened by a self-aware edge. 'I suppose I’ve become a bit of an old dog, set in my ways,' he would say, a wry smile crossing his face. But beneath the surface, Ivor was a man wrestling with the ghosts of his past, haunted by the idea that he was no longer relevant in a world that had moved on without him.",
      "As the investigation unfolded, Ivor found himself drawn deeper into the web of intrigue. The desire for vengeance battled with the need for redemption. Could he rise above the bitterness and reclaim his dignity? Or would he allow the betrayal to consume him entirely? The answers lay within the very heart of the mystery, intertwined with the fate of the victim he both despised and longed to confront."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill is an aspiring writer whose sharp wit and curiosity lead her into the heart of the mystery, even as she juggles her own secrets.",
    "publicPersona": "Beatrice is known for her keen observations and sharp wit, often entertaining friends with tales of her literary endeavors and social escapades.",
    "privateSecret": "Her fascination with the lives of those around her is not merely for entertainment; she has been gathering dark secrets about the manor's residents to fuel her writing.",
    "motiveSeed": "Beatrice's curiosity about the crime is fueled by her desire to write a sensational story, yet she also fears that her own secrets may come to light.",
    "motiveStrength": "weak",
    "alibiWindow": "She was in her room writing from five to eight PM, though the walls of the manor often whispered secrets she couldn't ignore.",
    "accessPlausibility": "easy",
    "stakes": "Her ambitions as a writer could be jeopardized if her secrets are exposed, leading to public embarrassment and tarnished credibility.",
    "humourStyle": "sardonic",
    "humourLevel": 0.7,
    "speechMannerisms": "Beatrice speaks with a quick, lively rhythm, often interjecting her sentences with sardonic comments. Her playful banter often belies a deeper intelligence and insight.",
    "internalConflict": "Beatrice struggles with the tension between her ambition and the fear of exposure; her desire for success clashes with the risk of revealing her own secrets.",
    "personalStakeInCase": "This crime matters to Beatrice as it presents an opportunity for her to gain notoriety, but it also threatens to expose the very secrets she has been collecting.",
    "paragraphs": [
      "Beatrice Quill was the embodiment of youthful ambition, her sharp wit and keen observations making her a captivating presence in any gathering. Known for her sardonic commentary on the lives of those around her, she often found herself ensnared in the drama of Little Middleton. Yet, her fascination with the lives of others was not merely for entertainment; it served as fuel for her burgeoning writing career. The secrets of the manor were her muse, and she was determined to capture them all.",
      "During the fateful hours of the crime, Beatrice claimed to have been in her room, immersed in her writing. But the walls of the manor whispered secrets, and she couldn't help but overhear snippets of conversation that piqued her curiosity. 'Ah, the plot thickens,' she would muse, her mind racing with possibilities. The irony of her own secrets being at risk only added to the thrill of the unfolding mystery, a delicious tension she couldn't resist.",
      "Her speech was quick and lively, punctuated by sardonic comments that often revealed a deeper intelligence. 'Oh, darling, if only life were as simple as a plot twist!' she would quip, her laughter ringing like a bell. But behind the playful banter lay a girl grappling with the weight of her ambitions. The desire to write a sensational story clashed with the fear of exposure; what if her own secrets came to light amidst the chaos?",
      "As the investigation progressed, Beatrice found herself drawn deeper into the intrigue, her role shifting from mere observer to active participant. The stakes were high; her ambitions as a writer could be jeopardized if her secrets were revealed. Yet, within the heart of the mystery lay an opportunity for growth. Could she transform from a naive chronicler of others' lives into a resourceful investigator? The answers awaited her, hidden in the shadows of the manor, ready to be uncovered."
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
    "type": "Country house estate",
    "place": "Little Middleton",
    "country": "England",
    "summary": "A sprawling manor house, steeped in history, stands isolated in the English countryside, surrounded by manicured gardens that hide secrets and whispers of betrayal.",
    "visualDescription": "The manor boasts an imposing facade of weathered stone, ivy creeping up the walls, while tall chimneys punctuate the skyline. Inside, dark wood paneling and heavy drapes create an air of somber elegance, with portraits of stern ancestors lining the walls, their gazes seemingly following every step.",
    "atmosphere": "A palpable tension hangs in the air, as the estate's rich history clashes with the present-day struggles of its inhabitants.",
    "paragraphs": [
      "Little Middleton Manor looms over the surrounding landscape, its structure a testament to the wealth and status of generations past. The sprawling estate, with its intricate gardens and shadowy hedgerows, feels both inviting and foreboding, harboring a multitude of secrets beneath its elegant exterior. Each creak of the floorboards and whisper of the wind adds to the atmosphere of unease, as if the very walls are holding their breath, waiting for the next revelation to unfold.",
      "The gardens, meticulously tended, are a patchwork of vibrant blooms and dark, twisting paths that seem to lead nowhere. The scent of damp earth mingles with the fragrance of lilacs and roses, creating a deceptive sense of tranquility that belies the underlying tensions within the house. As guests stroll along the gravel paths, they are often oblivious to the hidden corners where hushed conversations and furtive glances may reveal more than they intend.",
      "Inside the manor, the drawing room is a study in contrasts, filled with plush furnishings that invite relaxation yet are overshadowed by the weight of unspoken words. The air is thick with the scent of polished wood and a lingering hint of tobacco smoke, remnants of late-night discussions that have turned heated. Outside, the overcast sky casts a grey pall over the estate, reflecting the somber mood of its inhabitants as they navigate the delicate intricacies of their social hierarchy.",
      "As the clock ticks steadily away in the background, marking the passage of time, the atmosphere grows increasingly charged. The tension is palpable, with each character's motivations entwined in a web of deceit and ambition. The manor, with its hidden passageways and locked doors, becomes a character in its own right, holding the keys to both the past and the present as secrets threaten to unravel and betrayals come to light."
    ]
  },
  "atmosphere": {
    "era": "1930s",
    "weather": "Overcast with occasional rain, typical for the English countryside in spring.",
    "timeFlow": "Three days of mounting tension as secrets unravel and trust erodes.",
    "mood": "Tense and foreboding, reflecting underlying class tensions and recent political unrest.",
    "eraMarkers": [
      "A radio crackles in the background, broadcasting news of political unrest and economic struggles.",
      "Typewriters clatter in the study, echoing the urgency of correspondence amidst growing crises.",
      "Guests arrive in petrol-driven automobiles, their engines rumbling like distant thunder as they approach the estate."
    ],
    "sensoryPalette": {
      "dominant": "The pervasive scent of damp earth and blooming flowers, mingling with the musty air of the manor.",
      "secondary": [
        "The faint, sharp tang of tobacco smoke lingering from an earlier conversation.",
        "The muted sounds of rain tapping against the windows, underscoring the tension inside."
      ]
    },
    "paragraphs": [
      "The atmosphere is thick with anticipation, as the overcast sky looms like a heavy curtain, casting long shadows across the estate. Each drop of rain serves as a reminder of the secrets hidden within the manor's walls, while the distant rumble of thunder echoes the unrest brewing in society. The air is electric, charged with unspoken words and unresolved conflicts, making every moment feel suspended in time.",
      "Inside, the manor feels like a living entity, its creaks and groans echoing the unease felt by its inhabitants. The scent of polished wood and lingering tobacco smoke creates an intimate yet oppressive environment, where conversations hover just below the surface. The tension among the guests is palpable, as they navigate the delicate social order, each aware that beneath the veneer of civility lies the potential for betrayal."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Library",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "The library is a cavernous room filled with dark wooden shelves lined with leather-bound books, their spines cracked and faded with age. A large mahogany table dominates the center, strewn with papers and a fallen inkpot, hinting at a struggle.",
      "sensoryDetails": {
        "sights": [
          "Rich oak paneling absorbs light, creating a warm yet shadowy atmosphere that feels both inviting and claustrophobic.",
          "A grand fireplace stands at one end, its mantle adorned with family portraits, their eyes seemingly watching the proceedings with silent judgment."
        ],
        "sounds": [
          "The muffled sound of rain pattering against the leaded windows creates a rhythmic backdrop, occasionally broken by the rustle of pages turning.",
          "A distant clock ticks steadily, marking time in this suspended moment of tension, each tick echoing the urgency of the unfolding drama."
        ],
        "smells": [
          "The rich scent of old paper and leather mingles with the faint, acrid odor of spilled ink, filling the air with a sense of history and loss.",
          "A hint of woodsmoke from the fireplace adds warmth to the otherwise cool room, creating an atmosphere ripe for confrontation."
        ],
        "tactile": [
          "The coolness of the polished wood table contrasts sharply with the warmth of the fire, offering a juxtaposition of comfort and unease.",
          "The rough texture of the carpet underfoot absorbs sound, enhancing the sense of secrecy as footsteps are muffled in this hidden corner of the manor."
        ]
      },
      "accessControl": "The library is generally off-limits to guests unless accompanied by the master of the house, and staff must have explicit permission to enter, making it a place of intrigue and isolation.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops streak down the windows, creating a blurred view of the garden outside, where colors seem to fade into the grey.",
            "The dim light casts long shadows across the room, emphasizing the towering shelves filled with forgotten knowledge."
          ],
          "sounds": [
            "The steady drumming of the rain on the roof is almost hypnotic, lulling one into a false sense of security.",
            "Occasional creaks of the old house settling add to the atmosphere of solitude, as if the library itself is a sanctuary."
          ],
          "smells": [
            "The scent of wet earth and foliage wafts in through the slightly ajar window, mingling with the mustiness of the books.",
            "A hint of dampness clings to the air, enhancing the feeling of confinement within the library's walls."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The flat, grey light seeps into the room, dulling the colors of the books and furniture, creating an air of melancholy.",
            "Shadows deepen in the corners, suggesting hidden corners and lurking secrets just out of sight."
          ],
          "sounds": [
            "The silence is occasionally broken by the sound of pages turning, a reminder of the hidden stories waiting to be uncovered.",
            "A distant clock chimes, its echo resonating through the stillness, adding to the sense of urgency."
          ],
          "smells": [
            "The rich aroma of aged paper and leather is intensified by the dampness of the day, creating a heady mix that speaks of time and memory.",
            "The faintest hint of mildew lingers, a reminder of the secrets long kept within these walls."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Candlelight flickers across the room, illuminating the spines of books and casting dancing shadows on the walls.",
            "A sense of warmth pervades, the golden light creating an inviting atmosphere, yet the tension remains palpable."
          ],
          "sounds": [
            "The crackle of burning logs in the fireplace adds a comforting backdrop, yet the quiet is charged with anticipation.",
            "Distant laughter from the drawing room underscores the contrast between the light-heartedness of the gathering and the darkness of the library's secrets."
          ],
          "smells": [
            "The scent of melting wax mixes with the earthy aroma of the fireplace, creating a cozy yet charged atmosphere.",
            "A lingering trace of tobacco smoke from earlier conversations hangs in the air, hinting at the weight of hidden agendas."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The library, with its towering shelves and heavy drapes, feels like a sanctuary of secrets, where whispers of betrayal echo between the pages of forgotten tomes. The air is thick with the scent of musty books and polished wood, a heady mix that wraps around the senses like a shroud. Each corner seems to harbor a story, and the faint sound of rain tapping against the window adds to the atmosphere of melancholy and tension, reminding all who enter that the past is never truly forgotten.",
        "As the day darkens, the library transforms, shadows creeping in from the corners, making it feel even more isolated from the rest of the house. The flickering candlelight casts long shadows that dance across the walls, and the quiet is occasionally punctuated by the soft rustle of pages turning, as if the books themselves are eager to share their secrets. In this room, the weight of history is palpable, and every creak of the floorboards seems to echo with the ghosts of decisions made long ago."
      ]
    },
    {
      "id": "drawing_room",
      "name": "The Drawing Room",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "The drawing room is lavishly appointed with deep green velvet sofas and ornate gilded mirrors reflecting the flickering candlelight. A grand piano sits in the corner, its keys dusted with neglect, while floral arrangements sit atop the mantelpiece, exuding a false sense of cheer.",
      "sensoryDetails": {
        "sights": [
          "The room is adorned with heavy drapery that blocks out the late afternoon light, creating a cozy yet oppressive atmosphere.",
          "A large, intricately woven rug covers the floor, its patterns swirling like secrets waiting to be uncovered."
        ],
        "sounds": [
          "Laughter and conversation filter through the air, yet the underlying tension is palpable, as if the walls themselves are eavesdropping.",
          "The soft clink of glasses and cutlery from a nearby tea service punctuates the conversations, masking the true emotions brewing beneath the surface."
        ],
        "smells": [
          "The sweet scent of freshly brewed tea mingles with the floral perfumes of the guests, creating an intoxicating blend that masks the tension in the room.",
          "A faint hint of dust clings to the air, reminding all present of the manor's age and the stories it has witnessed."
        ],
        "tactile": [
          "The plush fabric of the sofas invites guests to sink in, yet the underlying tension makes it hard to relax completely.",
          "The cool touch of the porcelain teacups contrasts sharply with the warmth of the room, a reminder of the facade of hospitality."
        ]
      },
      "accessControl": "The drawing room is accessible to all guests, but certain areas are reserved for the family alone, creating a subtle divide that reflects social hierarchies.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops trace their way down the windows, distorting the view of the garden, where colors seem to fade into the grey.",
            "The muted light casts a somber tone over the room, amplifying the sense of isolation within."
          ],
          "sounds": [
            "The steady drumming of rain on the roof is a constant reminder of the weather outside, creating a soothing yet melancholic backdrop.",
            "Occasional laughter from the kitchen staff filters through, contrasting sharply with the drawing room's heavy atmosphere."
          ],
          "smells": [
            "The scent of damp earth wafts in through the windows, mingling with the floral arrangements and creating a rich tapestry of aromas.",
            "A faint whiff of mildew lingers in the corners, enhancing the feeling of confinement within the room."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The room is bathed in a flat, grey light that dulls the vibrancy of the furnishings and creates an air of melancholy.",
            "Shadows deepen in the corners, suggesting hidden corners and lurking secrets just out of sight."
          ],
          "sounds": [
            "The murmur of conversation mixes with the soft ticking of a clock, each tick amplifying the tension in the air.",
            "The occasional clink of china punctuates the conversations, a reminder of the polite facade hiding deeper tensions."
          ],
          "smells": [
            "The rich aroma of tea steeping fills the air, mingling with the faint scent of dust that clings to the room's surfaces.",
            "A hint of tobacco smoke lingers from earlier discussions, suggesting that not all conversations have been innocent."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Candlelight flickers across the room, illuminating the plush furnishings and casting dancing shadows on the walls.",
            "The grand piano stands silent in the corner, a testament to the festivities that have taken place and the secrets still held."
          ],
          "sounds": [
            "The soft murmur of conversation is punctuated by laughter, a facade of joy that masks the underlying tension.",
            "The distant sound of music from a nearby gathering adds to the atmosphere, creating a contrast between joy and the darkness of the manor."
          ],
          "smells": [
            "The sweet scent of pastries fills the air, mingling with the floral perfumes of the guests, creating an intoxicating blend.",
            "A lingering trace of smoke from earlier fires adds a warmth to the atmosphere, even as the tension remains palpable."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The drawing room is the heart of the manor, where guests gather to exchange pleasantries and hidden glances, all while the air buzzes with unspoken words. The rich colors of the upholstery and the warmth of the flickering candlelight create an inviting atmosphere, but the heavy drapery and ornate furnishings seem to absorb the tension in the room. Here, beneath the surface of laughter and polite conversation, lies a simmering conflict waiting to erupt, each guest acutely aware of the delicate social fabric that binds them together.",
        "As the day fades into evening, the drawing room transforms, shadows creeping in to mingle with the candlelight. The laughter grows louder, but it feels strained, as if everyone is playing their part in a grand performance, desperate to maintain appearances. Yet, the atmosphere is thick with anticipation, as if the walls themselves are holding their breath, waiting for the moment when the facade will crack and the truth will be laid bare."
      ]
    },
    {
      "id": "servants_hall",
      "name": "The Servants' Hall",
      "type": "interior",
      "purpose": "Gathering space for staff",
      "visualDetails": "The servants' hall is a modest yet functional space, with a long wooden table at its center surrounded by simple chairs. The walls are adorned with peeling wallpaper, and a small fireplace provides warmth, casting flickering shadows across the room.",
      "sensoryDetails": {
        "sights": [
          "The room is sparsely decorated, with utilitarian furnishings that reflect the hierarchy of the household, each item showing signs of wear.",
          "A large, old clock ticks steadily on the wall, its face cracked, indicating the passage of time and the lives dedicated to service."
        ],
        "sounds": [
          "The clatter of dishes and the murmur of conversation fills the air, creating a sense of camaraderie among the staff, even as tensions simmer beneath the surface.",
          "The occasional crackle of the fire provides a comforting backdrop, contrasting with the whispers of discontent that occasionally rise."
        ],
        "smells": [
          "The scent of hearty stew simmering on the stove mingles with the mustiness of the room, a reminder of the long hours spent within these walls.",
          "A faint odor of burnt wood lingers in the air, a sign of the fireplace's frequent use, adding to the sense of warmth and neglect."
        ],
        "tactile": [
          "The rough texture of the wooden table contrasts with the soft fabric of the staff's uniforms, a reminder of the divide between service and leisure.",
          "The coolness of the stone floor underfoot provides a stark contrast to the warmth radiating from the fire, highlighting the duality of the space."
        ]
      },
      "accessControl": "The servants' hall is accessible to all staff members, but entry is restricted for guests, creating a clear divide between social classes and highlighting the underlying tensions.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops streak against the windowpanes, casting a grey hue over the room and creating a dreary atmosphere.",
            "The dim light reveals the wear and tear of the furnishings, emphasizing the stark reality of life below stairs."
          ],
          "sounds": [
            "The sound of rain pattering against the roof is a constant reminder of the bleak weather outside, adding to the somber mood.",
            "The soft chatter among the staff is punctuated by the clanging of pots and pans in the kitchen, a reminder of their duties."
          ],
          "smells": [
            "The scent of wet earth wafts in through the slightly ajar window, mingling with the aroma of cooking stew, creating a rich yet heavy atmosphere.",
            "A hint of mildew clings to the corners, a reminder of the dampness that permeates the estate."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The light is muted, casting a dull glow over the room, which feels even more cramped and cluttered than usual.",
            "Shadows deepen in the corners, suggesting the weight of secrets and unspoken words among the staff."
          ],
          "sounds": [
            "The distant sound of laughter from the drawing room contrasts sharply with the more subdued tones of the servants' hall, highlighting the divide.",
            "The ticking of the clock serves as a constant reminder of the passing time, adding to the sense of urgency."
          ],
          "smells": [
            "The aroma of hearty stew wafts through the air, mingling with the stale scent of the room, creating a heavy atmosphere.",
            "A faint whiff of tobacco smoke lingers from earlier conversations, hinting at the staff's attempts to unwind amidst their duties."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "The warm glow from the fireplace casts flickering shadows that dance across the walls, creating an intimate yet tense atmosphere.",
            "The table is set for an evening meal, the simple plates and cutlery a stark contrast to the opulence of the drawing room."
          ],
          "sounds": [
            "The sounds of laughter and music filtering from the upper floors create a stark contrast to the more subdued tones of the servants' hall.",
            "The crackling of the fire provides a comforting backdrop, yet the murmurs of discontent among the staff hint at deeper issues."
          ],
          "smells": [
            "The scent of roasted meat fills the air, mingling with the earthy aroma of the fireplace, creating a warm yet charged atmosphere.",
            "A lingering trace of smoke adds to the ambiance, creating a reminder of the struggles faced by those who serve."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The servants' hall, a modest space filled with the echoes of laughter and whispered conversations, serves as a gathering point for the staff of Little Middleton Manor. Here, camaraderie is forged amidst the long hours of labor, yet the air is thick with unspoken tensions, as the divide between service and privilege looms large. The worn furnishings and peeling wallpaper tell tales of lives devoted to the manor, and the scent of hearty stew wafting from the kitchen mingles with the musty air, creating an atmosphere that is both comforting and oppressive.",
        "As the day progresses, the hall becomes a microcosm of the manor's social hierarchy, where the laughter of the upper classes filters down like a distant echo, reminding the staff of their place within this world. The flickering firelight casts shadows that dance along the walls, creating an intimate yet charged environment, where secrets are exchanged and alliances formed. In this space, the weight of duty and loyalty hangs heavy, as each servant navigates the complexities of their roles, aware that beneath the surface lies a brewing storm of resentment and ambition."
      ]
    }
  ],
  "note": "",
  "cost": 0.0028228596,
  "durationMs": 35919
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1937,
    "month": "January",
    "day": 15,
    "era": "1930s"
  },
  "seasonal": {
    "season": "winter",
    "month": "January",
    "weather": [
      "overcast skies",
      "occasional light rain",
      "chilly breezes"
    ],
    "daylight": "Short days with twilight settling in by four o'clock in the afternoon; limited sunlight breaking through the clouds.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, after dinner has concluded.",
    "holidays": [
      "New Year's Day (January 1)"
    ],
    "seasonalActivities": [
      "hunting parties in the countryside",
      "indoor games like bridge and chess",
      "preparing for the spring planting season"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "tailored evening suit with a bow tie",
        "frock coat with waistcoat",
        "cravat with a morning suit"
      ],
      "casual": [
        "tweed jacket with wool trousers",
        "corduroy trousers with woolen sweater",
        "flannel shirt with a flat cap"
      ],
      "accessories": [
        "silver cufflinks",
        "walking cane",
        "pocket watch"
      ]
    },
    "womensWear": {
      "formal": [
        "beaded evening gown with long sleeves",
        "tea-length dress with a fitted waist",
        "cocktail dress adorned with sequins"
      ],
      "casual": [
        "tweed skirt with a knitted sweater",
        "blouse with a Peter Pan collar",
        "swing coat made of wool"
      ],
      "accessories": [
        "clutch purse",
        "string of pearls",
        "feathered headband"
      ]
    },
    "trendsOfTheMoment": [
      "art deco influences in fashion",
      "bold geometric patterns",
      "return of vintage styles"
    ],
    "socialExpectations": [
      "men are expected to be chivalrous and courteous",
      "women are often judged by their fashion and social graces",
      "class distinctions are maintained in social settings"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "rising tensions in Europe due to fascist movements",
      "debates in Parliament over unemployment assistance",
      "the abdication crisis in Spain affecting international relations"
    ],
    "politicalClimate": "A climate of uncertainty as political movements gain traction across Europe, with debates about the rise of fascism concerning many.",
    "economicConditions": "The Great Depression continues to affect economic stability, with high unemployment rates and social unrest prevalent, especially in urban areas.",
    "socialIssues": [
      "rising class tensions due to economic disparity",
      "debates around women's suffrage and roles in society",
      "concerns over immigration policies"
    ],
    "internationalNews": [
      "Germany's rearmament causing alarm in Britain",
      "Spanish Civil War drawing international attention",
      "growing anti-Semitism in Europe"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "'The Way You Look Tonight' by Fred Astaire",
        "'I Can't Give You Anything But Love' by Louis Armstrong",
        "swing music gaining popularity"
      ],
      "films": [
        "'The Great Ziegfeld'",
        "'A Star Is Born'",
        "'The Prisoner of Zenda'"
      ],
      "theater": [
        "'The Royal Family'",
        "'The Show Must Go On'",
        "'The Lady from Shanghai'"
      ],
      "radio": [
        "BBC radio dramas are popular",
        "news broadcasts covering international affairs",
        "music programs featuring the latest swing hits"
      ]
    },
    "literature": {
      "recentPublications": [
        "'The Maltese Falcon' by Dashiell Hammett",
        "'Of Mice and Men' by John Steinbeck",
        "'The Glass Key' by Dashiell Hammett"
      ],
      "popularGenres": [
        "detective fiction",
        "social realism",
        "romantic novels"
      ]
    },
    "technology": {
      "recentInventions": [
        "the electric refrigerator becoming common",
        "advancements in radio technology",
        "development of early automatic telephones"
      ],
      "commonDevices": [
        "radio receivers in most homes",
        "typewriters in offices",
        "early models of electric washing machines"
      ],
      "emergingTrends": [
        "increased use of household appliances",
        "growing interest in automobiles",
        "initial development of consumer electronics"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Bottle of milk: three pence",
        "Train ticket to London: two shillings"
      ],
      "commonActivities": [
        "attending social gatherings or balls",
        "visiting the local market",
        "reading newspapers for news and entertainment"
      ],
      "socialRituals": [
        "afternoon tea with family and friends",
        "weekly church services",
        "formal dining etiquette during meals"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "the upper class maintains a strict social hierarchy",
      "the working class struggles for recognition and rights"
    ],
    "gender": [
      "women are increasingly seeking independence yet are often expected to adhere to traditional roles",
      "men are viewed as the primary breadwinners"
    ],
    "race": [
      "racial tensions are simmering with immigration debates",
      "the upper classes often hold prejudiced views against lower classes and immigrants"
    ],
    "generalNorms": [
      "formal etiquette is highly valued in social interactions",
      "public displays of affection are frowned upon",
      "conservatism in public life is the norm"
    ]
  },
  "atmosphericDetails": [
    "Damp air fills the estate, carrying the scent of wet earth and decaying leaves underfoot.",
    "The flickering candles cast long shadows across the drawing room, heightening the sense of unease that lingers in the atmosphere.",
    "Outside, the distant sound of hounds on a hunt echoes faintly through the trees, a reminder of the estate's social obligations amid rising tensions."
  ],
  "paragraphs": [
    "In January 1937, the English countryside is cloaked in the damp chill of winter, with overcast skies frequently unleashing light rain. As daylight dwindles by four o'clock in the afternoon, the ambiance within the country house estate becomes increasingly tense and foreboding. The aristocratic family prepares for an evening gathering, yet whispers of political unrest and economic despair brew as they engage in their usual dining rituals, the once-lively banter now tainted with unease.",
    "Fashionably, the upper class dons tailored evening suits adorned with bow ties and elegant gowns embellished with beads. Men favor frock coats over waistcoats, while women embrace tea-length dresses, reflecting the art deco influences of the era. Accessories, such as silver cufflinks and feathered headbands, accent their attire, establishing a sense of status that contrasts with the struggles of the working class outside their estate's gates.",
    "Daily life in this period is marked by class distinctions that dictate social interactions. Afternoon tea rituals punctuate the day, where the upper class discusses the latest news from the radio—rising fascism in Europe and local unemployment rates. Meanwhile, the working class grapples with economic hardships, attending markets where a loaf of bread costs four pence. This dichotomy creates an air of tension, as the wealthy navigate their social obligations while the specter of class struggle looms ever closer."
  ],
  "note": "",
  "cost": 0.0010503603,
  "durationMs": 11061
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A family gathering for a will reading amidst the Great Depression forces heirs and staff into a tense atmosphere, where class tensions and political unrest create a breeding ground for secrets and betrayal.",
  "era": {
    "decade": "1930s",
    "socialStructure": "Class divides are stark, with estate owners grappling with diminished wealth while servants navigate precarious job security, all under the shadow of rising fascism and economic despair."
  },
  "setting": {
    "location": "A sprawling manor house in the English countryside",
    "institution": "Country house estate",
    "weather": "Overcast with occasional rain"
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
  }
]

### CLUE_DISTRIBUTION
{
  "clues": [
    {
      "id": "clue_1",
      "category": "temporal",
      "description": "The clock in the study shows ten minutes past eleven.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "The time displayed on the clock at the time of the murder.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_2",
      "category": "temporal",
      "description": "Witnesses recall hearing the clock striking a different hour before the murder.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "The discrepancies in the timing of the clock.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_3",
      "category": "temporal",
      "description": "The clock’s hands do not accurately reflect reality.",
      "sourceInCML": "CASE.inference_path.steps[1].correction",
      "pointsTo": "The clock is not a reliable indicator of the time.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_4",
      "category": "temporal",
      "description": "Eleanor was seen near the clock shortly before the murder.",
      "sourceInCML": "CASE.inference_path.steps[2].observation",
      "pointsTo": "Eleanor's proximity to the clock raises suspicion.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_5",
      "category": "temporal",
      "description": "Eleanor had the opportunity to tamper with the clock.",
      "sourceInCML": "CASE.inference_path.steps[2].correction",
      "pointsTo": "Eleanor's access to the clock suggests she could have altered it.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_culprit_direct_eleanor_voss",
      "category": "behavioral",
      "description": "Eleanor Voss had the means and opportunity to mislead the timing of the murder.",
      "sourceInCML": "CASE.cast[0].access_plausibility",
      "pointsTo": "Direct evidence linking Eleanor to the tampering of the clock.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_6",
      "category": "testimonial",
      "description": "Eliminates Dr. Mallory Finch because he was at the hospital attending to a patient during the time of the murder.",
      "sourceInCML": "CASE.cast[1].alibi_window",
      "pointsTo": "Dr. Mallory Finch's alibi confirms he could not have committed the murder.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_7",
      "category": "testimonial",
      "description": "Eliminates Captain Ivor Hale because he was seen in a different location at the time of the murder.",
      "sourceInCML": "CASE.cast[2].alibi_window",
      "pointsTo": "Captain Ivor Hale's alibi confirms he could not have committed the murder.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_8",
      "category": "temporal",
      "description": "A staged confrontation reveals the discrepancies in the timing of the clock and the victim's last known appearance.",
      "sourceInCML": "CASE.inference_path.steps[2].observation",
      "pointsTo": "The inconsistencies in timing suggest foul play.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_late_optional_slot_1",
      "category": "temporal",
      "description": "Victim's last known appearance at ten o'clock in the evening remains a late texture detail in the case background.",
      "sourceInCML": "CASE.constraint_space.time.anchors[0]",
      "pointsTo": "Adds late texture without changing the essential deduction chain.",
      "placement": "late",
      "criticality": "optional",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_fp_contradiction_step_3",
      "category": "temporal",
      "description": "Eleanor was seen near the clock shortly before the murder.",
      "sourceInCML": "CASE.inference_path.steps[2].correction",
      "pointsTo": "Eleanor had the opportunity to tamper with the clock.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "contradiction"
    }
  ],
  "redHerrings": [
    {
      "id": "rh_1",
      "description": "The stopped appears to have stopped at exactly the time of the murder, suggesting it was a planned act.",
      "supportsAssumption": "The murder must have occurred at the time indicated by the stopped clock.",
      "misdirection": "This suggests a deliberate setup, but it does not consider the possibility of tampering."
    },
    {
      "id": "rh_2",
      "description": "The stopped appears appears to be a critical piece of evidence in the case.",
      "supportsAssumption": "The murder must have occurred at the time indicated by the stopped clock.",
      "misdirection": "While it seems significant, it overlooks the evidence of tampering that points to witness."
    }
  ],
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
      "clue_3"
    ],
    "mid": [
      "clue_4",
      "clue_5",
      "clue_culprit_direct_eleanor_voss",
      "clue_6",
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
  "latencyMs": 10941,
  "cost": 0.006083434499999999
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

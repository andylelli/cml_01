# Actual Prompt Record

- Run ID: `mystery-1784253138797`
- Project ID: ``
- Timestamp: `2026-07-17T01:55:33.631Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `e4e80fd3d5df04bc`

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
    "title": "Echoes of Identity",
    "author": "Agent 9",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1940s",
      "realism_constraints": []
    },
    "setting": {
      "location": "Seaside Hotel",
      "place": "Brighton",
      "country": "England",
      "institution": "hotel"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "acoustic manipulation"
    }
  },
  "death_method": "strangled",
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "victim",
      "relationships": [
        "Dr. Mallory Finch (friend)",
        "Captain Ivor Hale (former colleague)"
      ],
      "public_persona": "A well-liked war veteran and artist",
      "private_secret": "Had a hidden affair with Captain Hale",
      "motive_seed": "Fear of exposure",
      "motive_strength": "high",
      "alibi_window": "10 minutes before 9 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "private beach",
        "hotel room"
      ],
      "behavioral_tells": [
        "anxiety about past relationships"
      ],
      "stakes": "Reputation",
      "evidence_sensitivity": [
        "high"
      ],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "30-40",
      "role_archetype": "Friend",
      "relationships": [
        "Eleanor Voss (close friend)",
        "Hugo Vane (acquaintance)"
      ],
      "public_persona": "A dedicated doctor",
      "private_secret": "Has feelings for Eleanor",
      "motive_seed": "Jealousy",
      "motive_strength": "moderate",
      "alibi_window": "8:45 PM to 9:15 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "hotel kitchen"
      ],
      "behavioral_tells": [
        "nervous when questioned"
      ],
      "stakes": "Unrequited love",
      "evidence_sensitivity": [
        "medium"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "40-50",
      "role_archetype": "Rival",
      "relationships": [
        "Eleanor Voss (former lover)",
        "Beatrice Quill (friend)"
      ],
      "public_persona": "A decorated war hero",
      "private_secret": "Involved in a scandal with Eleanor",
      "motive_seed": "Fear of scandal",
      "motive_strength": "high",
      "alibi_window": "9 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "private beach"
      ],
      "behavioral_tells": [
        "defensive about past"
      ],
      "stakes": "Reputation",
      "evidence_sensitivity": [
        "high"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "25-35",
      "role_archetype": "Friend",
      "relationships": [
        "Eleanor Voss (friend)",
        "Dr. Mallory Finch (acquaintance)"
      ],
      "public_persona": "A supportive companion",
      "private_secret": "Resentful of Eleanor's talent",
      "motive_seed": "Envy",
      "motive_strength": "low",
      "alibi_window": "8:30 PM to 9:00 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "hotel lounge"
      ],
      "behavioral_tells": [
        "overly eager to help"
      ],
      "stakes": "Status",
      "evidence_sensitivity": [
        "low"
      ],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "35-45",
      "role_archetype": "Authority",
      "relationships": [
        "Captain Ivor Hale (friend)",
        "Hugo Vane (investigator)"
      ],
      "public_persona": "The hotel manager",
      "private_secret": "Knows more about guests than she lets on",
      "motive_seed": "Protecting the hotel’s reputation",
      "motive_strength": "moderate",
      "alibi_window": "9 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "hotel office"
      ],
      "behavioral_tells": [
        "calm under pressure"
      ],
      "stakes": "Business",
      "evidence_sensitivity": [
        "medium"
      ],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "40-50",
      "role_archetype": "Detective",
      "relationships": [
        "Eleanor Voss (acquaintance)",
        "Dr. Mallory Finch (friend)"
      ],
      "public_persona": "A seasoned investigator",
      "private_secret": "Haunted by past cases",
      "motive_seed": "Desire for justice",
      "motive_strength": "high",
      "alibi_window": "9 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "hotel lobby"
      ],
      "behavioral_tells": [
        "intense focus on details"
      ],
      "stakes": "Professional integrity",
      "evidence_sensitivity": [
        "high"
      ],
      "culprit_eligibility": "locked",
      "culpability": "unknown",
      "gender": "male"
    }
  ],
  "culpability": {
    "culprit_count": 1,
    "culprits": [
      "Captain Ivor Hale"
    ]
  },
  "surface_model": {
    "narrative": {
      "summary": "In the overcast atmosphere of a seaside hotel, Eleanor Voss is found strangled in a soundproof room. As the investigation unfolds, acoustic manipulation and hidden identities create a complex web of deception, leading to a surprising conclusion."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "The murder of Eleanor Voss was concealed through a gramophone recording that created a false alibi for Captain Hale.",
      "delivery_path": [
        {
          "step": "The gramophone played a recording during the murder, masking the sound of the struggle."
        },
        {
          "step": "The soundproof room ensured no one could hear the actual event."
        },
        {
          "step": "The recording was timed to coincide exactly with the moment of death."
        }
      ]
    },
    "outcome": {
      "result": "Captain Hale's alibi collapses when the acoustic manipulation is revealed."
    }
  },
  "false_assumption": {
    "statement": "Captain Hale was in the lounge at the time of the murder.",
    "type": "identity",
    "why_it_seems_reasonable": "Witnesses saw him in the lounge, and he claimed to be there for the duration.",
    "what_it_hides": "He was actually in the soundproof room with Eleanor."
  },
  "false_solution": {
    "accused_suspect": "Dr. Mallory Finch",
    "supporting_points": [
      "She had access to the victim in the hospital.",
      "Witnesses noted her nervousness when questioned."
    ],
    "the_one_flaw": "Finch's alibi was corroborated by multiple witnesses who placed her in the dining area during the murder.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "A broken vase found in the lounge seemed to indicate a struggle.",
      "points_at_suspect": "Dr. Mallory Finch",
      "innocent_explanation": "The vase was knocked over by a guest earlier in the evening.",
      "resolved_in_chapter": 7
    },
    {
      "id": "red_herring_2",
      "description": "A witness claimed to have seen Captain Hale leave the soundproof room shortly after the murder.",
      "points_at_suspect": "Captain Ivor Hale",
      "innocent_explanation": "The witness misjudged the timing due to the gramophone's noise masking the actual timeline.",
      "resolved_in_chapter": 7
    }
  ],
  "closed_circle": {
    "suspects": [
      "Eleanor Voss",
      "Dr. Mallory Finch",
      "Captain Ivor Hale",
      "Beatrice Quill",
      "Sylvia Trent",
      "Hugo Vane"
    ],
    "rationale": "All suspects were present at the hotel during the murder with no outsiders involved."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Eleanor's alibi time",
        "Hale's alibi time"
      ],
      "windows": [
        "8:45 PM to 9:00 PM"
      ],
      "contradictions": [
        "Witnesses reported seeing Hale at the lounge at 8:50 PM, but the murder occurred at 8:55 PM."
      ]
    },
    "access": {
      "actors": [
        "Eleanor Voss",
        "Captain Ivor Hale"
      ],
      "objects": [
        "gramophone",
        "soundproof room"
      ],
      "permissions": [
        "Hale had access to the soundproof room due to his status."
      ]
    },
    "physical": {
      "laws": [
        "Sound travels differently in soundproof environments."
      ],
      "traces": [
        "Needle marks on the gramophone indicate tampering."
      ]
    },
    "social": {
      "trust_channels": [
        "Hale's reputation as a war hero"
      ],
      "authority_sources": [
        "Sylvia Trent as hotel manager overseeing guest access."
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The gramophone's needle shows unusual scratches and wear.",
        "correction": "This indicates the gramophone was used frequently, likely to play a recording during the murder.",
        "effect": "Narrows suspect access to those who could tamper with the gramophone.",
        "required_evidence": [
          "The gramophone's needle was scratched in an unusual pattern.",
          "The room was soundproofed."
        ],
        "reader_observable": true
      },
      {
        "observation": "Witnesses reported hearing a loud noise right before finding Eleanor's body.",
        "correction": "This suggests that the noise was likely masked by the gramophone, indicating the murder occurred during the recording.",
        "effect": "Eliminates any alibis that don't account for sound manipulation.",
        "required_evidence": [
          "Witness statements confirm timing of the noise.",
          "The gramophone was playing at the time."
        ],
        "reader_observable": true
      },
      {
        "observation": "Acoustic measurements show the sound could not have originated from the lounge.",
        "correction": "This means the struggle must have occurred in the soundproof room.",
        "effect": "Narrows suspect pool to those with access to the room during that time.",
        "required_evidence": [
          "Acoustic measurements show unusual reverberation patterns.",
          "Hale had unrestricted access to the soundproof room."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "Comparing the gramophone's recording with the timeline of the murder proves Hale's alibi was false, as the recording was timed to coincide with the murder.",
    "knowledge_revealed": "The recording reveals Hale's tampering with the timeline.",
    "pass_condition": "If the recording matches the timeline, Hale's guilt is confirmed.",
    "evidence_clues": [
      "clue_9",
      "clue_mechanism_visibility_core",
      "clue_5",
      "clue_early_1"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The gramophone’s needle condition indicates it was played during the murder. Step 2: Witness noise reports align with the gramophone's timing. Step 3: Acoustic evidence reveals the true location of the struggle, confirming Hale's access and guilt."
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
        "clearance_method": "Her alibi from multiple witnesses clears her.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed by hotel staff.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Her management duties during the murder clear her.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Eleanor Voss",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: 10 minutes before 9 PM",
        "supporting_clues": []
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with evidence"
    },
    "identity_rules": [
      {
        "character_name": "Eleanor Voss",
        "revealed_in_act": 3,
        "before_reveal_reference": "the victim",
        "after_reveal_reference": "Eleanor Voss"
      },
      {
        "character_name": "Captain Ivor Hale",
        "revealed_in_act": 3,
        "before_reveal_reference": "the suspect",
        "after_reveal_reference": "Captain Ivor Hale"
      }
    ],
    "clue_to_scene_mapping": [
      {
        "clue_id": "clue_mechanism_visibility_core",
        "act_number": 1,
        "scene_number": 1,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_core_contradiction_chain",
        "act_number": 1,
        "scene_number": 2,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_5",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_6",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_8",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_core_elimination_chain",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_early_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_fp_contradiction_step_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_late_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Acoustic measurements"
      },
      {
        "clue_id": "clue_mid_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness statements"
      },
      {
        "clue_id": "clue_4",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_7",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_11",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_12",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_9",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_culprit_direct_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_culprit_direct_captain_ivor_hale",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
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
    "summary": "Eleanor Voss, a respected local hotelier, is a figure of charm and hospitality, yet her life conceals a web of financial struggles that could unravel her reputation.",
    "publicPersona": "Respected businesswoman, known for her charm and hospitality.",
    "privateSecret": "Hides her financial struggles from the community.",
    "motiveSeed": "Possessed valuable property rights that others coveted.",
    "motiveStrength": "strong",
    "alibiWindow": "was in her office from 8 PM until the time of death at 9 PM",
    "accessPlausibility": "impossible",
    "stakes": "Her business depended on her reputation.",
    "humourStyle": "none",
    "humourLevel": 0,
    "speechMannerisms": "Eleanor speaks with a warm, inviting tone, often punctuating her sentences with a soft laugh, masking her underlying tension with a veneer of grace.",
    "signatureTic": "‘Everything is just fine, thank you!’",
    "internalConflict": "Fears that her financial issues will be exposed, jeopardizing her hard-earned reputation.",
    "personalStakeInCase": "This crime not only threatens her life but also the very foundation of her business and her legacy within the community.",
    "paragraphs": [
      "Eleanor Voss had always been the embodiment of charm, a lighthouse guiding weary travelers to the shores of her seaside hotel. Yet beneath the polished veneer of her public persona lay a storm of financial despair. Her struggles were well-hidden, masked by the laughter and warmth she dispensed like hospitality’s sweetest nectar. To the townsfolk, she was a paragon of success; to herself, a mere juggler, desperately keeping her financial troubles at bay.",
      "The night of her demise was like any other. Her office, dimly lit and cluttered with papers, offered a sanctuary where she could momentarily escape the weight of expectation. But as the clock struck nine, her life was extinguished, leaving behind unanswered questions and a community in shock. The only witness to her last moments was the ticking clock that betrayed her, marking the time she had left in this world.",
      "Eleanor’s death sent shockwaves through the town, igniting whispers of envy and resentment. Her valuable property rights were coveted by many, and the potential for profit was a motive that sparked a dangerous fire in the hearts of those around her. For Eleanor, the stakes had always been high; her reputation was not just her armor but her very lifeline. As her secrets lay bare, the question remained: who among her acquaintances could harbor such deadly intentions?",
      "As the investigation unfolded, Eleanor's charm became a haunting echo, a reminder of what had been lost. It was her fear of exposure that had driven her to keep her struggles hidden, and in a twist of fate, her very desperation for survival had led her to a tragic end. In death, Eleanor Voss became the victim of her own carefully constructed façade, leaving behind a legacy that would forever be marred by the shadows of her financial strife."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch, a well-respected physician, battles a hidden addiction that threatens to unravel her career and reputation.",
    "publicPersona": "Community doctor admired for her dedication to health.",
    "privateSecret": "Struggled with addiction to prescription medications.",
    "motiveSeed": "Eleanor threatened to expose her addiction, risking her career.",
    "motiveStrength": "moderate",
    "alibiWindow": "Claimed to be at a dinner party during the time of death.",
    "accessPlausibility": "possible",
    "stakes": "Her career and reputation in the community were on the line.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Mallory speaks with a calm, measured cadence, often interjecting dry jokes to deflect from uncomfortable topics, her eyes betraying a flicker of anxiety when pressed.",
    "signatureTic": "‘You know what they say...’",
    "internalConflict": "Struggles with guilt over her addiction, fearing it could destroy her career and the lives of those who depend on her.",
    "personalStakeInCase": "This crime threatens not only her reputation but also her very identity as a healer, forcing her to confront the darkness she keeps hidden.",
    "paragraphs": [
      "Dr. Mallory Finch had long been the pillar of health in the community, a beacon of hope for those seeking solace in her care. Yet beneath the crisp white coat lay a tempest of addiction, a secret that threatened to drown her in its depths. She often joked about the pressures of her profession, saying, ‘You know what they say, laughter is the best medicine,’ but her laughter was often a mask, hiding the burden she carried.",
      "The night Eleanor was murdered, Mallory claimed to be at a dinner party, a plausible alibi that felt as fragile as a house of cards. In truth, she had been grappling with her demons, the specter of Eleanor’s potential exposure looming over her like a guillotine. The threat of revelation had become a palpable weight, one that pushed her toward desperation as she fought to maintain her facade.",
      "As the investigation progressed, whispers of Mallory’s struggle began to circulate, intertwining her fate with that of the victim. Eleanor’s threat to expose her addiction was not merely a risk; it was a death knell for her career, a breach that could shatter the trust she had built with her patients. The stakes had never been higher, and Mallory was left to navigate a treacherous path fraught with peril.",
      "In the end, Mallory was left grappling with the duality of her existence—the dedicated healer and the wounded soul. The crime that had taken Eleanor’s life forced her to confront her own fragility, the delicate balance between her professional identity and the shadows of her addiction. As the truth emerged, Mallory would have to decide whether to fight for redemption or succumb to the darkness that beckoned her."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale, a retired military officer, grapples with resentment towards Eleanor, whose dismissal of his cause left him feeling unworthy.",
    "publicPersona": "Respected war hero with a commanding presence.",
    "privateSecret": "Harbors resentment towards Eleanor for not supporting veterans' causes.",
    "motiveSeed": "Eleanor dismissed his appeals for a veterans’ charity event, enraging him.",
    "motiveStrength": "moderate",
    "alibiWindow": "Claimed he was fishing off the coast during the crime.",
    "accessPlausibility": "possible",
    "stakes": "His reputation among fellow veterans stood to diminish.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.4,
    "speechMannerisms": "Ivor speaks with a booming voice, often punctuating his statements with self-deprecating humor, his demeanor a mix of warmth and underlying frustration.",
    "signatureTic": "‘I suppose I’ll just have to fish for compliments!’",
    "internalConflict": "Struggles with feelings of inadequacy and anger, torn between his past valor and current irrelevance.",
    "personalStakeInCase": "This crime threatens to expose his vulnerabilities, leaving him wrestling with his legacy and the respect he seeks from his peers.",
    "paragraphs": [
      "Captain Ivor Hale was a name that resonated with respect and admiration, a war hero whose mere presence commanded attention. Yet, behind the façade of valor lay a simmering resentment, particularly toward Eleanor Voss. She had dismissed his appeals for a charity event to support veterans, a slight he felt deeply, like a wound that refused to heal. In his mind, her rejection was not just a personal affront; it was a betrayal of the very ideals he had fought for.",
      "On the night of Eleanor's death, Ivor claimed to be fishing off the coast, an alibi as shaky as the boat he pretended to navigate. The truth was that he had been wrestling with his own demons, the anger bubbling beneath the surface, threatening to erupt. The thought that Eleanor's refusal could lead to her demise was a bitter pill to swallow, yet one he couldn't shake from his mind.",
      "As the investigation unfolded, Ivor found himself at a crossroads, his reputation hanging in the balance. The camaraderie he once shared with fellow veterans now felt like a distant memory, overshadowed by the specter of his own inadequacies. The crime had exposed not only Eleanor's vulnerabilities but also his own, leaving him grappling with the question of whether he was still worthy of respect.",
      "In the end, Ivor's path was fraught with challenges. He had the opportunity to reclaim his purpose, to become an advocate for veterans’ rights, but the shadows of resentment loomed large. The burden of his past weighed heavily on him, and as truths began to emerge, Ivor would have to confront not only the reality of Eleanor’s death but also the legacy he wished to leave behind."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill, an aspiring writer, faces desperation as her dreams of success are thwarted by Eleanor's rejection of her manuscript.",
    "publicPersona": "Charming and ambitious, often seen mingling with the elite.",
    "privateSecret": "Desperately in debt, driven by a need for success.",
    "motiveSeed": "Eleanor rejected Beatrice's manuscript, denying her a lucrative publishing deal.",
    "motiveStrength": "strong",
    "alibiWindow": "Was allegedly at the local library from 7 PM until 10 PM.",
    "accessPlausibility": "unlikely",
    "stakes": "Her career and financial future depended on her breakthrough.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Beatrice speaks with a quick, animated rhythm, often using sarcasm to mask her insecurities, her voice rising in pitch when she feels cornered.",
    "signatureTic": "‘Well, isn’t that just the plot twist of the century?’",
    "internalConflict": "Struggles with her self-worth and the fear that she will never achieve her dreams, leading her to desperate measures.",
    "personalStakeInCase": "This crime could either destroy her aspirations or provide an unexpected opportunity for success, forcing her to confront her own ambition.",
    "paragraphs": [
      "Beatrice Quill was a name whispered in the corridors of literary ambition, an aspiring writer with dreams as vast as the ocean. Yet, those dreams were threatened by a single rejection—the dismissal of her manuscript by Eleanor Voss. To Beatrice, it felt like a death sentence, a cruel twist of fate that left her grappling with despair. ‘Well, isn’t that just the plot twist of the century?’ she would often quip, masking her disappointment with sardonic humor.",
      "On the night of Eleanor’s murder, Beatrice claimed to be at the library, a weak alibi that felt more like a desperate plea for validation than a solid defense. The truth was that she had been stewing in a cauldron of anxiety and debt, driven by an insatiable need for success. The stakes had never been higher; her financial future depended on her ability to break through, and Eleanor’s rejection was an anchor pulling her deeper into despair.",
      "As the investigation unfolded, Beatrice found herself in a precarious position, her ambition casting a long shadow over her innocence. The whispers of envy and desperation began to swirl around her, intertwining her fate with that of the victim. Eleanor’s death could either be her undoing or the catalyst for her success, a double-edged sword that left her teetering on the brink of chaos.",
      "In the end, Beatrice was forced to confront her own motivations. Would she allow her ambition to consume her, or could she learn to navigate the treacherous waters of rejection? The crime that had taken Eleanor’s life had also ignited a spark within her, forcing her to reckon with the fine line between aspiration and desperation. It was a moment of reckoning, one that could either lead her to greatness or plunge her into darkness."
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "Sylvia Trent, a glamorous socialite, is driven by ambition and envy, desperately seeking validation from the elite, and her ambitions collide with Eleanor's refusal to endorse her.",
    "publicPersona": "Glamorous and influential, often the center of attention.",
    "privateSecret": "Faked connections to wealthy patrons to elevate her status.",
    "motiveSeed": "Eleanor’s refusal to endorse her social events jeopardized her ambitions.",
    "motiveStrength": "moderate",
    "alibiWindow": "Claimed to be attending a charity gala in town.",
    "accessPlausibility": "possible",
    "stakes": "Her social standing and future connections depended on her success.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.5,
    "speechMannerisms": "Sylvia's speech is smooth and polished, often dripping with charm, yet laced with sharp undertones that reveal her underlying ambition, her laughter sometimes too bright.",
    "signatureTic": "‘Oh darling, it’s all about who you know!’",
    "internalConflict": "Wrestles with her need for validation and the emptiness that comes from her superficial connections.",
    "personalStakeInCase": "This crime threatens to unravel the delicate web of her social status, forcing her to confront her own insecurities and the truth behind her façade.",
    "paragraphs": [
      "Sylvia Trent was the epitome of glamour, a socialite whose presence lit up every room she entered. Yet beneath the polished exterior lay a deep-seated insecurity, a desperate need for validation that drove her to fake connections with the elite. ‘Oh darling, it’s all about who you know!’ she would laugh, yet the laughter often masked a profound emptiness. Eleanor Voss had been a gatekeeper to the world she coveted, and her refusal to endorse Sylvia’s social events felt like a dagger to the heart.",
      "The night of Eleanor’s murder, Sylvia claimed to be attending a charity gala, a plausible alibi that felt more like a desperate attempt to maintain her facade. The truth was that she had been grappling with the reality of her ambitions, the very foundation of her social standing threatened by Eleanor’s dismissal. The stakes had never been higher; her future connections depended on her success, and Eleanor's death sent ripples of uncertainty through her carefully curated world.",
      "As the investigation unfolded, Sylvia found herself entangled in a web of suspicion, her ambition casting a long shadow over her innocence. The whispers of envy surrounding Eleanor’s demise began to swirl, intertwining her fate with that of the victim. This crime could either be her undoing or the catalyst for her rise, a double-edged sword that left her teetering on the brink of chaos.",
      "In the end, Sylvia was forced to confront her own motivations. Would she allow her ambition to consume her, or could she learn to navigate the treacherous waters of authenticity? The crime that had taken Eleanor’s life had also ignited a spark within her, forcing her to reckon with the fine line between aspiration and desperation. It was a moment of reckoning, one that could either lead her to true connections or plunge her deeper into the abyss of superficiality."
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "Hugo Vane, a business consultant, navigates a precarious path as a detective, concealing a shady past while investigating Eleanor's murder.",
    "publicPersona": "Insightful and shrewd, known for his analytical mind.",
    "privateSecret": "Has a shady past involving financial misdeeds that he hides.",
    "motiveSeed": "None directly against Eleanor, but his insights make him suspicious.",
    "motiveStrength": "weak",
    "alibiWindow": "Was in the lounge area, claim unverified.",
    "accessPlausibility": "easy",
    "stakes": "His reputation as a consultant hinges on solving this mystery.",
    "humourStyle": "observational",
    "humourLevel": 0.4,
    "speechMannerisms": "Hugo speaks in a calm, calculated manner, often pausing to reflect before answering, his gaze piercing as he assesses the motivations of those around him.",
    "signatureTic": "‘It’s all in the details, isn’t it?’",
    "internalConflict": "Struggles with guilt over his past misdeeds, fearing that one slip could unravel his new life.",
    "personalStakeInCase": "This crime not only tests his analytical skills but also threatens to expose the skeletons in his closet, placing his hard-won reputation at risk.",
    "paragraphs": [
      "Hugo Vane was a man of many layers, a business consultant with an analytical mind that could dissect even the most complex of mysteries. Yet beneath the polished surface lay a shadowy past, one filled with financial misdeeds that he had worked tirelessly to bury. ‘It’s all in the details, isn’t it?’ he would often muse, but the irony was not lost on him; the details of his past were the very things that haunted him.",
      "As the detective in the investigation of Eleanor Voss’s murder, Hugo found himself walking a tightrope, balancing the need for clarity with the fear of exposure. His alibi was flimsy, merely a claim that he had been in the lounge area, and the specter of suspicion loomed large. The stakes were high; solving this mystery was not just a matter of professional duty but a means to protect the fragile façade he had built.",
      "The investigation revealed a tangled web of motives, and as each suspect’s secrets began to unravel, Hugo’s analytical prowess was put to the test. Yet, with each revelation, he felt the weight of his own guilt pressing down upon him. The fear that someone might uncover his past misdeeds gnawed at him, a constant reminder that one misstep could send him spiraling back into the darkness he fought so hard to escape.",
      "In the end, Hugo was left grappling with the duality of his existence—the detective and the man with a past. The crime that had taken Eleanor’s life forced him to confront not only the motivations of others but also the shadows of his own history. As he delved deeper into the investigation, he realized that the truth was a double-edged sword, capable of both redemption and destruction."
    ],
    "order": 6
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "Cliffside Retreat Hotel",
    "type": "hotel",
    "place": "Broadstairs",
    "country": "England",
    "summary": "A seaside hotel perched on a cliff, blending Victorian and Art Deco styles, with an air of mystery among its guests.",
    "visualDescription": "The hotel features a grand facade of weathered stone, intricately carved balustrades and tall, narrow windows that overlook the turbulent sea. Inside, dark wood paneling contrasts with vibrant Art Deco motifs, while plush carpets muffled footsteps in the dimly lit corridors.",
    "atmosphere": "A mix of elegance and unease, where the beauty of the ocean is shadowed by hidden secrets.",
    "paragraphs": [
      "The Cliffside Retreat Hotel stands defiantly against the elements, its sturdy stone walls weathered by years of salt and wind. Guests arrive to find a blend of Victorian grandeur and Art Deco flair, the lobby adorned with brass fixtures and plush velvet seating. The scent of damp sea air mingles with the faint aroma of wood polish, hinting at the many stories hidden within its walls. As rain patters against the windows, shadows dance in the corners, suggesting that not everything is as it seems.",
      "Every creak of the floorboards echoes through the narrow hallways, amplifying the tension among the guests. The hotel’s isolation on the cliffside adds to its mystique, with the nearest village miles away, leaving visitors and staff alike in a bubble of uncertainty. The sound of waves crashing below contrasts with the whispered conversations that fill the air, each guest wary of the other. The atmosphere thickens, a palpable sense of suspicion lingering like the salty mist.",
      "In the evenings, flickering gas lamps cast a warm glow, illuminating the antique furnishings and the carefully curated art deco decor. The guests, dressed in the styles of the 1940s, gather in the lounge, their laughter tinged with a nervous edge. Outside, the horizon blurs into a steely grey, the ocean a restless expanse. The hotel, with its mix of elegance and enigma, becomes a character in its own right, holding secrets that twist and turn like the very cliffs on which it stands."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "overcast with occasional rain, typical of coastal climates",
    "timeFlow": "Days filled with tension and mounting suspicion.",
    "mood": "tense, with an undercurrent of suspicion among guests",
    "eraMarkers": [
      "Radio broadcasts of wartime news",
      "Early television sets in common areas",
      "Rationed wartime vehicles parked outside"
    ],
    "sensoryPalette": {
      "dominant": "Salt-laden sea air with damp wood",
      "secondary": [
        "Warm gaslight flicker",
        "Echoes of distant waves"
      ]
    },
    "paragraphs": [
      "The air is thick with the scent of salt and damp wood, a reminder of the relentless sea that crashes against the cliffs below. Gaslight flickers in the dim hallways, casting shadows that dance across the walls, while whispers of past conversations linger like ghosts. A sense of foreboding permeates the space, as if the walls themselves hold secrets waiting to be uncovered.",
      "As the day fades into dusk, the hotel transforms; the sounds of laughter and clinking glasses mingle with the distant roar of the ocean. Yet, beneath the surface, tension simmers, each guest acutely aware of the others, their expressions revealing nothing while their eyes dart about with suspicion. The atmosphere is electric with uncertainty, echoing the larger anxieties of a world still grappling with the aftermath of war."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Ocean View Lounge",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "A spacious lounge with large bay windows overlooking the turbulent sea, furnished with plush armchairs and art deco accents.",
      "sensoryDetails": {
        "sights": [
          "flickering gas lamps",
          "stormy sea through bay windows",
          "art deco patterns on walls",
          "dark wood paneling",
          "crumpled newspapers on tables"
        ],
        "sounds": [
          "crackling gas flames",
          "distant thunder",
          "muffled conversations",
          "the crash of waves",
          "the ticking of an old clock"
        ],
        "smells": [
          "tobacco smoke lingering",
          "sea salt and dampness",
          "old leather and polish",
          "wet wool from soaked clothing",
          "faint floral perfume"
        ],
        "tactile": [
          "soft velvet upholstery",
          "cold glass window panes",
          "rough wood table surfaces",
          "chill from the sea breeze",
          "worn brass fixtures"
        ]
      },
      "accessControl": "Guests access during operational hours; staff only access after hours for cleaning.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-streaked windows",
            "grey light spilling in",
            "drops falling from the eaves",
            "scattered chairs around tables",
            "unopened newspapers"
          ],
          "sounds": [
            "steady drumming on the roof",
            "water trickling down the window",
            "soft footfalls on carpet",
            "the creak of old furniture",
            "the whoosh of waves"
          ],
          "smells": [
            "fresh earth after rain",
            "damp wood and sea air",
            "faint mildew in corners",
            "scent of wet wool",
            "lingering tobacco smoke"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat grey light",
            "shadows creeping across the floor",
            "a single umbrella in the corner",
            "dark clouds gathering outside",
            "the stillness of empty chairs"
          ],
          "sounds": [
            "silence broken by distant thunder",
            "the creak of old timbers",
            "occasional laughter from the dining room",
            "the rustle of newspaper pages",
            "the ticking of a distant clock"
          ],
          "smells": [
            "damp stone and old wood",
            "dusty corners and leather",
            "a hint of vinegar from the kitchen",
            "the metallic scent of rain",
            "faint hints of perfume"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight reflecting off glass",
            "long shadows stretching across the floor",
            "the ocean glowing under the moonlight",
            "guests in evening attire",
            "a half-empty glass on the table"
          ],
          "sounds": [
            "the tick of a mantel clock",
            "soft music from a radio",
            "the murmur of conversation",
            "distant waves crashing",
            "the rustle of a dress"
          ],
          "smells": [
            "candle wax melting",
            "freshly brewed coffee",
            "the scent of cigars",
            "a hint of salt from the sea",
            "warmth of baked goods from the kitchen"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Ocean View Lounge, with its sweeping bay windows, offers a stunning panorama of the tumultuous sea below. Plush armchairs invite guests to linger, yet the atmosphere is thick with unspoken tension. A recent crime has cast a pall over the once-vibrant space, where laughter now feels forced and conversations are laced with suspicion. The flickering gas lamps cast dancing shadows, echoing the unease that settles like a fog in the room.",
        "Distant thunder rumbles outside as guests steal glances at one another, their expressions revealing little but their eyes betraying their thoughts. The scent of dampness and old leather permeates the air, mingling with the faintest hint of tobacco smoke. This lounge, once a haven of relaxation, has transformed into an arena of uncertainty, where every creak of a floorboard stirs the nerves and every whispered conversation raises questions."
      ]
    },
    {
      "id": "guest_room",
      "name": "Room 203 - The Seaside Suite",
      "type": "interior",
      "purpose": "Guest accommodation",
      "visualDetails": "A spacious suite with a large four-poster bed, vintage furniture, and a private balcony overlooking the sea.",
      "sensoryDetails": {
        "sights": [
          "sunlight spilling through sheer curtains",
          "faded floral wallpaper",
          "ornate furniture from the 1920s",
          "a large mirror reflecting the room",
          "ocean waves visible from the balcony"
        ],
        "sounds": [
          "the rustle of curtains in the breeze",
          "soft footsteps on the carpet",
          "the distant call of seagulls",
          "the sound of waves lapping against the cliffs",
          "the creak of the bed frame"
        ],
        "smells": [
          "fresh linen and lavender",
          "a hint of salt from the sea",
          "old books on the shelf",
          "faint traces of perfume",
          "damp wood from the balcony"
        ],
        "tactile": [
          "soft cotton sheets",
          "coolness of the balcony railing",
          "smooth wood of the furniture",
          "the plushness of the carpet",
          "the chill of the sea breeze"
        ]
      },
      "accessControl": "Guests only; privacy respected by staff.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light filtering through clouds",
            "raindrops tracing patterns on glass",
            "sheets rumpled from sleep",
            "the ocean hidden behind fog",
            "a steaming cup on the bedside table"
          ],
          "sounds": [
            "steady rain against the window",
            "the soft creak of the bed",
            "the distant thrum of thunder",
            "water dripping from the eaves",
            "the rustle of a newspaper"
          ],
          "smells": [
            "the scent of wet earth",
            "freshly brewed coffee",
            "the mustiness of wet wool",
            "the saltiness of the sea air",
            "faint traces of lavender"
          ],
          "mood": "introspective"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting shadows",
            "a half-open book on the nightstand",
            "the balcony door slightly ajar",
            "the ocean a dull grey"
          ],
          "sounds": [
            "the sound of waves crashing",
            "the creak of wood settling",
            "a soft breeze through the curtains",
            "the ticking of a clock",
            "the distant chatter of guests"
          ],
          "smells": [
            "the lingering scent of lavender",
            "dampness in the air",
            "old paper and leather",
            "the faint aroma of tea",
            "the salty tang of the ocean"
          ],
          "mood": "melancholic"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "sunset colors bleeding into the sky",
            "the moon rising over the ocean",
            "the room glowing with soft light",
            "the balcony adorned with potted plants",
            "the silhouette of the cliffs outside"
          ],
          "sounds": [
            "the distant sound of music",
            "the chirping of crickets",
            "the rustling of leaves outside",
            "the soft lapping of waves",
            "the murmur of conversations from below"
          ],
          "smells": [
            "freshly cut flowers",
            "the scent of evening air",
            "the aroma of dinner wafting up",
            "the sweetness of jasmine",
            "the salty breeze from the ocean"
          ],
          "mood": "romantic"
        }
      ],
      "paragraphs": [
        "Room 203, The Seaside Suite, offers a panoramic view of the ocean, a luxurious retreat for weary travelers. The four-poster bed, draped in fine linens, beckons for rest, yet the atmosphere is thick with tension. Guests are reminded of the recent disturbances within the hotel walls, their minds racing with thoughts of what may have transpired nearby. The scent of lavender and fresh linen mingles in the air, providing a momentary escape from the underlying unease.",
        "As the day turns to dusk, the room transforms; shadows stretch across the faded floral wallpaper, and the soft sounds of the sea blend with the rustle of curtains. The distant call of seagulls serves as a reminder of their isolation, as guests grapple with the mysteries surrounding them. This seemingly serene suite holds secrets of its own, a place where every creak of the floorboards and whisper of the wind becomes a part of the unfolding narrative."
      ]
    },
    {
      "id": "kitchen",
      "name": "The Staff Kitchen",
      "type": "interior",
      "purpose": "Staff-only area for food preparation",
      "visualDetails": "A bustling kitchen filled with vintage appliances, large wooden tables, and an array of pots and pans hanging from the ceiling.",
      "sensoryDetails": {
        "sights": [
          "gleaming stainless steel countertops",
          "hanging pots and pans",
          "large wooden prep tables",
          "baking sheets lined with pastries",
          "flour dust dancing in the air"
        ],
        "sounds": [
          "clattering of pots and pans",
          "the hiss of frying food",
          "the chatter of kitchen staff",
          "water running in the sink",
          "the crackle of a fire"
        ],
        "smells": [
          "freshly baked bread",
          "sautéing vegetables",
          "the aroma of spices",
          "burnt sugar caramelizing",
          "the scent of fresh herbs"
        ],
        "tactile": [
          "warmth from the stove",
          "coolness of marble countertops",
          "rough texture of wooden tables",
          "the weight of a heavy pot",
          "the stickiness of dough on fingers"
        ]
      },
      "accessControl": "Staff only; locked after hours for security.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops sliding down the window",
            "busy staff preparing breakfast",
            "steam rising from pots",
            "the glow of electric lights",
            "glistening dishes being washed"
          ],
          "sounds": [
            "the rhythm of chopping vegetables",
            "the sizzle of eggs on the grill",
            "staff laughing and chatting",
            "the soft patter of rain",
            "the clatter of cutlery"
          ],
          "smells": [
            "the rich aroma of coffee brewing",
            "freshly baked pastries cooling",
            "the scent of wet earth outside",
            "buttery croissants in the oven",
            "the tang of citrus fruits"
          ],
          "mood": "busy and industrious"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light filtering through windows",
            "staff moving efficiently",
            "pans simmering on the stove",
            "baking sheets cooling on the counter",
            "the kitchen in mid-preparation"
          ],
          "sounds": [
            "the clanking of metal utensils",
            "the bubbling of sauces",
            "the quiet hum of conversation",
            "the drip of water from the sink",
            "the rustle of packaging"
          ],
          "smells": [
            "the aroma of simmering broth",
            "herbs and spices in the air",
            "the scent of freshly baked bread",
            "the tang of vinegar",
            "the sweetness of caramelizing onions"
          ],
          "mood": "calm focus"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "the warm glow of lights",
            "dishes being plated",
            "staff arranging food on tables",
            "the kitchen bustling with activity",
            "the reflection of flames in pans"
          ],
          "sounds": [
            "the sizzling of food",
            "the chatter of diners outside",
            "the sound of laughter",
            "the rustle of napkins"
          ],
          "smells": [
            "the scent of roasted meats",
            "freshly baked desserts cooling",
            "the fragrance of herbs",
            "the richness of sauces",
            "the sweetness of fruit tarts"
          ],
          "mood": "cheerful anticipation"
        }
      ],
      "paragraphs": [
        "The Staff Kitchen is a hive of activity, where the heart of the hotel beats strongest. Vintage appliances and large wooden tables create an inviting yet industrious atmosphere, the air thick with the scent of freshly baked bread and sautéing vegetables. Staff bustle about, their laughter mingling with the sounds of pots clattering and food sizzling, each person focused on the task at hand. Here, the worries of the guests seem distant, replaced by the urgency of meal preparation and the camaraderie of kitchen life.",
        "As the day wears on and the rain patters against the windows, the kitchen remains a warm refuge. The aroma of cooking wafts through the air, a blend of spices and flavors that tantalize the senses. Staff work efficiently, their movements synchronized as they chop, stir, and plate dishes. This space, alive with energy and purpose, contrasts sharply with the tension brewing in the guest areas, a reminder of the simple pleasures that food can bring even amidst uncertainty."
      ]
    },
    {
      "id": "staircase",
      "name": "The Grand Staircase",
      "type": "transitional",
      "purpose": "Main access route between floors",
      "visualDetails": "A sweeping staircase with a polished banister, adorned with a rich carpet that muffles footsteps.",
      "sensoryDetails": {
        "sights": [
          "ornate wrought-iron banister",
          "richly patterned carpet",
          "dimly lit from above",
          "framed portraits lining the walls",
          "shadows pooling in corners"
        ],
        "sounds": [
          "soft footfalls on carpet",
          "the creak of wooden steps",
          "the distant echo of conversations",
          "the rustle of clothing",
          "the thud of a suitcase"
        ],
        "smells": [
          "the scent of polished wood",
          "mustiness of old carpet",
          "faint traces of perfume",
          "the aroma of fresh paint",
          "the hint of sea air"
        ],
        "tactile": [
          "smoothness of the banister",
          "softness of the carpet underfoot",
          "coolness of the air near windows",
          "the weight of a heavy suitcase",
          "the chill of the stone walls"
        ]
      },
      "accessControl": "All guests can use the staircase; staff prefer to use service stairs.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "water droplets on the windows",
            "glistening steps from the rain",
            "the faint reflection of light",
            "wet footprints leading away"
          ],
          "sounds": [
            "the sound of rain tapping on glass",
            "the distant creaking of the building",
            "the soft rustle of clothing",
            "the echo of voices from below",
            "the drip of water from the eaves"
          ],
          "smells": [
            "the dampness of the air",
            "the scent of wet wood",
            "the mustiness of the carpet",
            "the hint of sea salt",
            "the aroma of brewing coffee from below"
          ],
          "mood": "melancholic"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light filtering through windows",
            "the staircase shrouded in shadows",
            "faded portraits on the walls",
            "the carpet slightly worn",
            "the stillness of the air"
          ],
          "sounds": [
            "the soft creak of wood settling",
            "the whisper of footsteps",
            "the distant murmur of conversations",
            "the rustle of fabric",
            "the thud of a door closing"
          ],
          "smells": [
            "the musty scent of old wood",
            "the aroma of dust in the air",
            "faint traces of cologne",
            "the scent of dampness",
            "the hint of flowers from the lobby"
          ],
          "mood": "suspenseful"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "the soft glow of lamps",
            "the staircase illuminated by candlelight",
            "guests in evening attire",
            "the shadows dancing on the walls",
            "the reflection of lights in polished surfaces"
          ],
          "sounds": [
            "the laughter of guests",
            "the clink of glasses",
            "the soft music playing in the background",
            "the rustle of evening gowns",
            "the echo of footsteps"
          ],
          "smells": [
            "the scent of polished wood",
            "the fragrance of evening perfume",
            "the aroma of dinner wafting up",
            "the hint of cigar smoke",
            "the sweetness of dessert"
          ],
          "mood": "elegant anticipation"
        }
      ],
      "paragraphs": [
        "The Grand Staircase serves as the hotel's main artery, connecting the various floors with a sense of elegance and grandeur. Its polished banister gleams, inviting guests to ascend or descend with every step muffled by the richly patterned carpet. Framed portraits gaze down from the walls, silent witnesses to the comings and goings of countless visitors. Yet, beneath its beauty lies a sense of foreboding, as if the very air holds secrets waiting to be uncovered.",
        "As guests traverse the staircase, the atmosphere shifts; whispers echo off the walls and the soft creak of wood underfoot adds to the suspense. The scent of polished wood mingles with the mustiness of old carpet, creating a heady blend that speaks of history and hidden stories. Here, in this transitional space, the tension among the guests is palpable, each step taken with a mix of anticipation and dread, as they navigate the mysteries that lurk within the hotel."
      ]
    }
  ],
  "note": "",
  "cost": 0.00304223865,
  "durationMs": 44130
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1945,
    "month": "November",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "fall",
    "month": "November",
    "weather": [
      "overcast skies",
      "occasional rain showers",
      "cool breezes from the coast"
    ],
    "daylight": "Short days with darkness enveloping the town by five o'clock in the evening",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, shadows deepening as the rain patters against windows",
    "holidays": [
      "Thanksgiving (November 28)"
    ],
    "seasonalActivities": [
      "preparations for Thanksgiving feasts",
      "visiting local markets for seasonal produce",
      "attending community gatherings"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "dark wool suits",
        "double-breasted blazers",
        "tweed overcoats"
      ],
      "casual": [
        "corduroy trousers",
        "button-up shirts with rolled sleeves",
        "woolen sweaters"
      ],
      "accessories": [
        "fedora hats",
        "silk ties",
        "leather gloves"
      ]
    },
    "womensWear": {
      "formal": [
        "tea-length dresses with fitted waists",
        "tailored suits with peplum jackets",
        "cloche hats"
      ],
      "casual": [
        "knee-length skirts paired with cardigans",
        "blouses with puff sleeves",
        "practical ankle boots"
      ],
      "accessories": [
        "string of pearls",
        "stylish handbags",
        "colorful scarves"
      ]
    },
    "trendsOfTheMoment": [
      "the return of traditional post-war styles",
      "influence of Hollywood glamour",
      "increased use of bold colors and patterns"
    ],
    "socialExpectations": [
      "men are expected to be the primary breadwinners",
      "women are increasingly taking on roles in business and industry",
      "courtesy and formality in public interactions"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "Nuremberg Trials begin to address war crimes",
      "United Nations founded in October",
      "continued debates over the future of Germany and Europe"
    ],
    "politicalClimate": "Heightened tensions as the world adjusts to the aftermath of World War II, with the beginnings of the Cold War evident in political discourse",
    "economicConditions": "A struggling economy with rationing still in effect, but signs of recovery beginning to emerge as wartime production shifts",
    "socialIssues": [
      "displacement of millions due to war",
      "returning soldiers adjusting to civilian life",
      "the role of women in the workforce under scrutiny"
    ],
    "internationalNews": [
      "tensions rise between the USSR and the West",
      "European countries begin to rebuild with Marshall Plan discussions",
      "the first meetings of the United Nations occur"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Bing Crosby's 'White Christmas'",
        "The Ink Spots' 'If I Didn't Care'",
        "Doris Day's 'Sentimental Journey'"
      ],
      "films": [
        "'The Best Years of Our Lives'",
        "'Spellbound'",
        "'Mildred Pierce'"
      ],
      "theater": [
        "'Carousel'",
        "'The Glass Menagerie'",
        "'Annie Get Your Gun'"
      ],
      "radio": [
        "'The Jack Benny Program'",
        "'Suspense'",
        "'The Lone Ranger'"
      ]
    },
    "literature": {
      "recentPublications": [
        "'A Bell for Adano' by John Hersey",
        "'The Catcher in the Rye' by J.D. Salinger",
        "'The Naked and the Dead' by Norman Mailer"
      ],
      "popularGenres": [
        "post-war fiction",
        "detective stories",
        "romantic novels"
      ]
    },
    "technology": {
      "recentInventions": [
        "first electronic computers are developed",
        "advances in radar technology",
        "the introduction of the first television commercials"
      ],
      "commonDevices": [
        "radio sets in most homes",
        "early television sets in affluent households",
        "household appliances like washing machines"
      ],
      "emergingTrends": [
        "growing interest in consumer electronics",
        "development of jet engines",
        "post-war automotive innovations"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "A pound of sugar: eight pence",
        "Taxi fare across town: two shillings"
      ],
      "commonActivities": [
        "families gather for radio shows",
        "neighbors visit each other for tea",
        "community events celebrating Thanksgiving preparations"
      ],
      "socialRituals": [
        "Sunday church services attended regularly",
        "family gatherings for holiday meals",
        "neighborhood potluck dinners"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "rising middle class due to post-war economy",
      "increased visibility of working-class struggles"
    ],
    "gender": [
      "women celebrated for their wartime contributions, yet faced pressure to return to traditional roles",
      "evolving views on women's independence and careers"
    ],
    "race": [
      "ongoing civil rights movements gaining traction",
      "racial segregation and discrimination still prevalent in many areas"
    ],
    "generalNorms": [
      "formality in public behavior",
      "respect for authority and tradition",
      "growing acceptance of diverse lifestyles"
    ]
  },
  "atmosphericDetails": [
    "The smell of damp earth and fallen leaves filled the air, punctuated by the distant sound of thunder rumbling over the sea.",
    "The flickering glow of hotel lobby lamps cast long shadows, creating a sense of mystery amid the whispered conversations of anxious guests.",
    "Beneath the surface of polite smiles, a tension hung thick, as the weight of recent history loomed large in the minds of all present."
  ],
  "paragraphs": [
    "On a damp November evening in 1945, the coastal hotel stood shrouded in an atmosphere thick with suspicion. Overcast skies loomed overhead, with rain intermittently drumming against the windows, creating a backdrop to the murmured conversations and wary glances exchanged among guests. The recent end of World War II lingered in the air, a specter that tainted even the most mundane interactions as both the joy of peace and the scars of war remained fresh in the memory of all who had lived through it.",
    "Fashion in this post-war moment reflected a blend of practicality and the lingering glamour of the wartime years. Men donned dark wool suits and double-breasted blazers, their fedora hats tilted slightly as they moved through the hotel, while women wore tailored suits with peplum jackets, accentuating their figures despite the chill. The sound of heels echoed on the polished floors, each guest aware of their presentation, as societal expectations still held sway over their choices.",
    "Daily life was a tapestry of social rituals and shared experiences, with families preparing for Thanksgiving in a time of both gratitude and reflection. The hotel served as a microcosm of the broader societal shifts, where traditional norms clashed with the evolving roles of women in the workforce and the persistent sadness of those displaced by war. Conversations often turned to current events—the trials in Nuremberg, the foundation of the United Nations—painting a vivid picture of a world grappling with its identity amidst the shadows of history."
  ],
  "note": "",
  "cost": 0.0010482746999999999,
  "durationMs": 10148
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A seaside hotel hosts a gathering of war veterans and their families, where tensions from the recent global conflict and shifting gender roles create an atmosphere ripe for suspicion and intrigue.",
  "era": {
    "decade": "1940s",
    "socialStructure": "The impact of WWII has led to a redefined social order, with women taking on more prominent roles in the workforce while class distinctions remain, creating pressure among guests to navigate old loyalties and new expectations."
  },
  "setting": {
    "location": "A seaside hotel built in the early 20th century, overlooking the ocean.",
    "institution": "hotel",
    "weather": "overcast with occasional rain, typical of coastal climates"
  },
  "castAnchors": [
    "Eleanor Voss",
    "Dr. Mallory Finch",
    "Captain Ivor Hale",
    "Beatrice Quill",
    "Sylvia Trent",
    "Hugo Vane"
  ],
  "theme": "Golden Age murder driven by an acoustic method, where a gramophone recording played into a soundproofed room fabricates an alibi for the true moment of death."
}

### LOCKED_FACTS
[
  {
    "id": "time_of_death",
    "value": "ten minutes past eleven",
    "description": "The recorded sound was manipulated to mask the actual time of death."
  },
  {
    "id": "distance_to_beach",
    "value": "fifty yards",
    "description": "The victim was found near the hotel’s private beach."
  },
  {
    "id": "recording_length",
    "value": "three minutes",
    "description": "The gramophone recording lasted exactly three minutes."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 20,
  "countsByPlacement": {
    "early": 10,
    "mid": 9,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 18,
    "supporting": 1,
    "optional": 1
  },
  "redHerringCount": 2,
  "clues": [
    {
      "id": "clue_mechanism_visibility_core",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_core_contradiction_chain",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_core_elimination_chain",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_4",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_5",
      "placement": "early",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_6",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_7",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
    },
    {
      "id": "clue_8",
      "placement": "early",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_9",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_10",
      "placement": "mid",
      "criticality": "supporting",
      "category": "testimonial"
    },
    {
      "id": "clue_11",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
    },
    {
      "id": "clue_12",
      "placement": "mid",
      "criticality": "essential",
      "category": "spatial"
    },
    {
      "id": "clue_culprit_direct_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_culprit_direct_captain_ivor_hale",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_early_1",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_mid_1",
      "placement": "early",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_late_1",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_late_optional_slot_1",
      "placement": "late",
      "criticality": "optional",
      "category": "temporal"
    },
    {
      "id": "clue_fp_contradiction_step_1",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_fp_contradiction_step_3",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    }
  ]
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

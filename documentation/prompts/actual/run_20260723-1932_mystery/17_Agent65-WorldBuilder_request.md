# Actual Prompt Record

- Run ID: `mystery-1784835142830`
- Project ID: ``
- Timestamp: `2026-07-23T19:37:18.517Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `0b0ac77b5871b50f`

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
    "title": "Masks of Authority",
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
      "subtype": "impersonation"
    }
  },
  "death_method": "strangled",
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "victim",
      "relationships": [],
      "public_persona": "Socialite and organizer of the masquerade ball",
      "private_secret": "Involved in a secret relationship with Captain Hale",
      "motive_seed": "inheritance",
      "motive_strength": "none",
      "alibi_window": "none",
      "access_plausibility": "none",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "30-40",
      "role_archetype": "Suspect",
      "relationships": [
        "Friend of Eleanor"
      ],
      "public_persona": "Reputable doctor",
      "private_secret": "Disapproves of Eleanor's relationship with Captain Hale",
      "motive_seed": "Jealousy over relationship",
      "motive_strength": "moderate",
      "alibi_window": "9:00 PM - 10:00 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Hotel staff access"
      ],
      "behavioral_tells": [
        "Nervous when discussing Eleanor"
      ],
      "stakes": "Professional reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "40-50",
      "role_archetype": "Suspect",
      "relationships": [
        "Secret lover of Eleanor"
      ],
      "public_persona": "Military officer",
      "private_secret": "Has a past with the victim",
      "motive_seed": "Fear of exposure",
      "motive_strength": "high",
      "alibi_window": "9:15 PM - 10:15 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Hotel access",
        "Military connections"
      ],
      "behavioral_tells": [
        "Avoids eye contact when questioned"
      ],
      "stakes": "Reputation and career",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "25-35",
      "role_archetype": "Suspect",
      "relationships": [
        "Acquaintance of Eleanor"
      ],
      "public_persona": "Event planner",
      "private_secret": "In debt to Eleanor",
      "motive_seed": "Financial desperation",
      "motive_strength": "moderate",
      "alibi_window": "8:30 PM - 10:00 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Event access"
      ],
      "behavioral_tells": [
        "Fidgets when discussing money"
      ],
      "stakes": "Financial security",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "30-40",
      "role_archetype": "Suspect",
      "relationships": [
        "Friend of Eleanor"
      ],
      "public_persona": "Socialite",
      "private_secret": "Dislikes Captain Hale",
      "motive_seed": "Protecting Eleanor's reputation",
      "motive_strength": "low",
      "alibi_window": "9:00 PM - 10:30 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Hotel access"
      ],
      "behavioral_tells": [
        "Defensive when questioned"
      ],
      "stakes": "Friendship",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "35-45",
      "role_archetype": "Detective",
      "relationships": [
        "Colleague of Dr. Finch"
      ],
      "public_persona": "Private investigator",
      "private_secret": "Has a history with the hotel staff",
      "motive_seed": "inheritance",
      "motive_strength": "none",
      "alibi_window": "none",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
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
      "summary": "During a lavish masquerade ball at a seaside hotel, Eleanor Voss is found dead, strangled in her room. As tension rises, the guests must confront hidden identities and motives. Detective Hugo Vane uncovers a web of deception involving identical masks, leading to a shocking revelation about authority and personal motives."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "Captain Hale used an identical mask to impersonate Eleanor during the masquerade, creating a false alibi and evading suspicion.",
      "delivery_path": [
        {
          "step": "Captain Hale donned an identical mask and clothing of Eleanor and mingled in the crowd."
        },
        {
          "step": "Witnesses mistook him for Eleanor after the murder."
        },
        {
          "step": "He escaped unnoticed while others believed Eleanor was still alive."
        }
      ]
    },
    "outcome": {
      "result": "Culprit escapes suspicion until the truth is uncovered through the detective's investigation."
    }
  },
  "false_assumption": {
    "statement": "Captain Hale was seen with Eleanor shortly before the murder, establishing his alibi.",
    "type": "authority",
    "why_it_seems_reasonable": "Witnesses, including hotel staff, testified that they saw Hale and Eleanor together during the masquerade.",
    "what_it_hides": "The true identity of the murderer, who was using a mask to impersonate Eleanor."
  },
  "false_solution": {
    "accused_suspect": "Dr. Mallory Finch",
    "supporting_points": [
      "Dr. Finch had access to Eleanor's room as her doctor.",
      "Witnesses heard Dr. Finch arguing with Eleanor earlier in the evening."
    ],
    "the_one_flaw": "Dr. Finch's alibi was confirmed by multiple witnesses who saw her attending to other guests during the time of the murder.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "A witness claims to have seen Dr. Finch near Eleanor's room just before the murder.",
      "points_at_suspect": "Dr. Mallory Finch",
      "innocent_explanation": "The witness misidentified Dr. Finch; it was actually Captain Hale in disguise.",
      "resolved_in_chapter": 5
    },
    {
      "id": "red_herring_2",
      "description": "A broken mirror in Eleanor's room suggests a struggle.",
      "points_at_suspect": "Beatrice Quill",
      "innocent_explanation": "The mirror was broken earlier in the evening during a party game.",
      "resolved_in_chapter": 5
    }
  ],
  "closed_circle": {
    "suspects": [
      "Eleanor Voss",
      "Dr. Mallory Finch",
      "Captain Ivor Hale",
      "Beatrice Quill",
      "Sylvia Trent"
    ],
    "rationale": "All suspects were present at the hotel and had interactions with the victim."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "9:00 PM",
        "10:00 PM"
      ],
      "windows": [
        "9:15 PM - 10:15 PM"
      ],
      "contradictions": [
        "Witnesses saw Captain Hale with Eleanor at 9:30 PM, but the murder happened shortly after."
      ]
    },
    "access": {
      "actors": [
        "Hotel staff",
        "Guests"
      ],
      "objects": [
        "Eleanor's mask",
        "Captain Hale's mask"
      ],
      "permissions": [
        "Access to Eleanor's room"
      ]
    },
    "physical": {
      "laws": [
        "Sound travel time in hotel corridors"
      ],
      "traces": [
        "Footprints leading away from the scene"
      ]
    },
    "social": {
      "trust_channels": [
        "Witness testimony",
        "Hotel authority"
      ],
      "authority_sources": [
        "Hotel manager",
        "Local police"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "Witnesses recall seeing Eleanor wearing a distinct mask with a tear during the masquerade.",
        "correction": "This tear must match the mask found in Captain Hale's possession.",
        "effect": "Narrows suspects to Captain Hale.",
        "required_evidence": [
          "Witness statement about the tear on Eleanor's mask",
          "Captain Hale's possession of an identical mask"
        ],
        "reader_observable": true
      },
      {
        "observation": "A bellhop recalls delivering Eleanor's belongings to her room shortly before the murder.",
        "correction": "The timeline contradicts Captain Hale's alibi.",
        "effect": "Eliminates the possibility of Hale being in his room at the time.",
        "required_evidence": [
          "Bellhop's statement on delivery time",
          "Hale's claimed alibi"
        ],
        "reader_observable": true
      },
      {
        "observation": "A hotel staff member describes seeing two identical masks in Captain Hale's possession.",
        "correction": "This confirms Hale's capability to impersonate Eleanor.",
        "effect": "Narrows the opportunity channel to Hale.",
        "required_evidence": [
          "Staff member's statement about the masks",
          "Comparison of mask designs"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "The discriminating test compares masquerade, witness, and recall against the claimed timeline.",
    "knowledge_revealed": "The revealed facts are distinct, witness, and recall.",
    "pass_condition": "The evidence of the tear on the mask confirms Hale's impersonation.",
    "evidence_clues": [
      "clue_early_1",
      "clue_culprit_direct_1",
      "clue_mid_1",
      "clue_culprit_direct_captain_ivor_hale"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: Witness statements (early) about Eleanor's mask clearly identify the tear. Step 2: The bellhop's timeline (mid) confirms Hale's false alibi. Step 3: Staff member testimony (discriminating test) exposes Hale's motive and capability."
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
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Confirmed alibi by multiple witnesses.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "The broken mirror's history is revealed.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Witness testimony clears her of suspicion.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Eleanor Voss",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: none",
        "supporting_clues": []
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with evidence linking Hale to the murder."
    },
    "identity_rules": [],
    "clue_to_scene_mapping": [
      {
        "clue_id": "clue_early_1",
        "act_number": 1,
        "scene_number": 1,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_core_contradiction_chain",
        "act_number": 1,
        "scene_number": 2,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_fp_contradiction_step_2",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_mid_1",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Witness testimony"
      },
      {
        "clue_id": "clue_core_elimination_chain",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_culprit_direct_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_culprit_direct_captain_ivor_hale",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_fp_elimination_beatrice_quill",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_fp_elimination_sylvia_trent",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_late_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Controlled reenactment"
      },
      {
        "clue_id": "clue_mid_2",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_mid_3",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_mid_4",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "Eleanor Voss, the charming owner of a seaside hotel, is found dead, leaving behind a tangled web of family secrets and financial ruin.",
    "publicPersona": "A respected and charming hotelier, Eleanor is known for her hospitality and dedication to guests, often hosting lavish gatherings that showcase her impeccable taste.",
    "privateSecret": "Beneath her polished exterior, Eleanor struggles with crippling debt, having hidden the hotel's financial troubles from her family, fearing the fallout would shatter their image and legacy.",
    "motiveSeed": "Her untimely death would allow her family members to gain control over the hotel and its assets, a prospect that looms larger than the love they claim to hold for her.",
    "motiveStrength": "strong",
    "alibiWindow": "Last seen entering her office around 8 PM, a time that would later become crucial in the murky details surrounding her demise.",
    "accessPlausibility": "easy",
    "stakes": "The future of her family’s legacy and the reputation of the hotel hang in the balance, with Eleanor's death threatening to unravel everything she has built.",
    "humourStyle": "none",
    "humourLevel": 0,
    "speechMannerisms": "Eleanor speaks with a warm, nurturing tone, carefully choosing her words to put guests at ease while masking her inner turmoil with practiced grace.",
    "signatureTic": "‘Let’s not dwell on the past; we must focus on the future.’",
    "internalConflict": "Eleanor wrestles with guilt over the lies she has told her family, knowing that her inability to be honest has put her loved ones at risk.",
    "personalStakeInCase": "This crime matters deeply to Eleanor because it threatens the very legacy she has poured her life into, a legacy she hoped would unite her family rather than divide it.",
    "paragraphs": [
      "Eleanor Voss is the epitome of grace under pressure, a woman who has built an empire from the ground up, yet now faces the specter of her own financial ruin. The seaside hotel, a jewel of the community, glimmers with the facade of success while concealing the cracks of her crumbling reality. Guests are charmed by her welcoming smile, unaware of the tempest raging beneath the surface as Eleanor grapples with the suffocating weight of debt and familial expectations.",
      "As the owner of the hotel, Eleanor has dedicated her life to creating a sanctuary for others. She pours her heart into every detail, hosting lavish events and ensuring her guests feel at home. Yet, behind closed doors, she struggles with the knowledge that her financial missteps could destroy the very legacy she cherishes. The thought of her family discovering the truth terrifies her, for she knows that the fallout could be catastrophic. To them, she must remain a paragon of success, a matriarch whose strength shields them from the storm.",
      "The night of her death was a fateful culmination of Eleanor's fears and desires. Last seen entering her office, she had hoped to devise a plan to save her hotel and, perhaps, her relationships with her family. Instead, her secrets became her undoing. The thought that her death might bring her family closer to control over the hotel haunts her still, as if in life she had built a prison from which they would seek to escape her legacy.",
      "Eleanor's journey could have led her to reconcile with her family, to mend the frayed bonds that had been stretched too thin by her silence. She had the potential to confront her demons, to share her burdens and seek their help. But now, with her life extinguished, the possibility of redemption fades, leaving only the bitter taste of what might have been. In death, Eleanor becomes a tragic figure, a victim of her own ambitions and the secrets that ultimately claimed her life."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch, a community-loved physician, finds herself entangled in a web of suspicion when her patient, Eleanor Voss, is murdered.",
    "publicPersona": "Known as a caring and honest doctor, Mallory is well-liked in the community, often seen attending to patients with a gentle touch and a warm smile.",
    "privateSecret": "Mallory has been treating Eleanor for a hidden illness, a secret that, if revealed, could tarnish her reputation as a trustworthy physician.",
    "motiveSeed": "The potential exposure of Eleanor's illness might damage Mallory's professional integrity, an outcome she fears more than the loss of her patient.",
    "motiveStrength": "moderate",
    "alibiWindow": "Mallory claims she was in her office reviewing records, but the lack of corroboration raises eyebrows and casts doubt on her whereabouts.",
    "accessPlausibility": "possible",
    "stakes": "The stakes for Mallory are high; her professional reputation is on the line, and the ramifications of Eleanor's secrets could jeopardize her practice.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.4,
    "speechMannerisms": "Mallory speaks with a calm, measured tone, often punctuating her sentences with a subtle irony that reflects her awareness of the absurdities of life and her profession.",
    "signatureTic": "‘You know, medicine is just as much about the mind as it is the body.’",
    "internalConflict": "Mallory is torn between her duty to her patient and the ethical implications of keeping Eleanor's illness a secret; she fears the truth will unravel her carefully constructed life.",
    "personalStakeInCase": "This case matters deeply to Mallory, not just for her professional reputation, but because she feels a genuine responsibility for Eleanor’s well-being and the potential fallout from her death.",
    "paragraphs": [
      "Dr. Mallory Finch is a name synonymous with care in the small seaside community, her reputation built on a foundation of trust and compassion. Yet, beneath her composed exterior lies a tumultuous conflict that threatens to unravel everything she has worked for. Mallory's dedication to her patients is unwavering, but her relationship with Eleanor Voss has taken on a complexity that she struggles to navigate. As the family physician, she has been privy to Eleanor's hidden illness, a truth that burdens her with the weight of unspoken secrets.",
      "On the night of Eleanor’s murder, Mallory finds herself in a precarious position. She claims to have been in her office, reviewing records, but the lack of witnesses casts a shadow over her alibi. The very thought that her patient’s death could be linked to her own failings gnaws at her conscience. What if Eleanor's illness had clouded her judgment, leading to decisions that ultimately cost her life? The implications are staggering, and Mallory fears that the truth may not only damage her practice but also shatter the trust she has built over the years.",
      "In moments of reflection, Mallory can’t help but wonder if she could have done more. Could she have urged Eleanor to confront her illness openly, to seek the help she desperately needed? The guilt of her silence weighs heavily on her, an internal conflict that manifests in her interactions with others. She often employs dry wit to deflect the seriousness of her situation, using humor as a coping mechanism in a world that often seems absurd. Yet, the laughter feels hollow when faced with the reality of Eleanor's death.",
      "As the investigation unfolds, Mallory is thrust into a world of suspicion and intrigue. She must confront not only her role in Eleanor's life but also the ethical dilemmas that arise from her medical practice. This case is not just about uncovering the truth behind Eleanor's murder; it is a chance for Mallory to redeem herself, to prove that she can rise above the chaos and emerge with her integrity intact. In doing so, she may find the courage to face her own demons, transforming her guilt into a catalyst for change."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale, a retired naval officer, struggles with feelings of resentment towards his niece Eleanor, whose murder exposes family tensions and rivalries.",
    "publicPersona": "With a dignified presence and an authoritative air, Ivor is well-respected in the community for his military service, often regarded as a pillar of strength.",
    "privateSecret": "Ivor harbors deep resentment towards Eleanor for pushing him out of family business decisions, feeling sidelined in the very affairs he once controlled.",
    "motiveSeed": "Killing Eleanor would eliminate his main obstacle to regaining control over family affairs and the hotel, a power he desperately yearns for.",
    "motiveStrength": "strong",
    "alibiWindow": "Reportedly at a bar with friends, but his specific actions remain unverified, casting doubt on his whereabouts.",
    "accessPlausibility": "possible",
    "stakes": "The stakes for Ivor are high; he longs to reclaim his influence within the family and the hotel, fearing that without it, he will be reduced to a mere spectator in his own life.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.5,
    "speechMannerisms": "Ivor speaks with a commanding yet self-aware tone, often using humor to mask his vulnerabilities and deflect from the tensions simmering beneath his composed facade.",
    "signatureTic": "‘Well, I suppose I can’t always be the captain of my own ship.’",
    "internalConflict": "Ivor grapples with feelings of inadequacy and resentment, torn between his desire for power and the love he feels for his family, questioning whether his ambitions are worth the price of their relationships.",
    "personalStakeInCase": "This case matters profoundly to Ivor, as it is not just about Eleanor’s death but also about the legacy of control and influence he wishes to leave behind for his family.",
    "paragraphs": [
      "Captain Ivor Hale stands as a figure of authority and dignity, a retired naval officer who has seen the world and returned to a family dynamic fraught with tension. He is well-regarded in the community, a man whose military service has earned him respect, yet he feels a growing sense of alienation within his own family. The hotel, once a bastion of family unity, has become a battleground for control, with Eleanor at the helm. Ivor's resentment towards her is palpable, a festering wound that threatens to consume him.",
      "On the night of Eleanor's murder, Ivor finds himself at a bar, surrounded by friends, yet feeling more isolated than ever. The laughter and camaraderie do little to ease the bitterness that has taken root in his heart. Eleanor’s decisions have sidelined him, pushing him out of the very affairs he once controlled. The thought of regaining that power becomes an obsession, one that clouds his judgment and leads him to consider the unthinkable. In his mind, eliminating Eleanor would pave the way for him to reclaim his rightful place in the family.",
      "Ivor’s speech often carries a self-deprecating humor, a way to mask the insecurities that gnaw at him. He employs this humor as a shield, a means of deflecting the vulnerabilities that threaten to expose his true feelings. Yet, beneath the surface, a storm brews, fueled by his desire for control and a fear of being rendered obsolete. The investigation into Eleanor's murder forces him to confront these demons, to reckon with the consequences of his ambitions and the cost of familial love.",
      "As the pieces of the puzzle begin to fall into place, Ivor must confront the reality of his actions and the legacy he wishes to leave behind. This case is not just about the death of his niece; it is a reckoning for Ivor, a chance to reevaluate what truly matters. The struggle for power may have consumed him, but perhaps there is still time for redemption. In facing the truth of Eleanor's murder, Ivor may find a path toward healing, one that transcends the desire for control and embraces the importance of family bonds."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill, Eleanor’s niece and aspiring artist, finds herself caught in the storm of suspicion following her aunt’s murder, driven by her own struggles for recognition.",
    "publicPersona": "Charismatic and carefree, Beatrice is often seen painting along the seaside, her vibrant spirit captivating those around her.",
    "privateSecret": "In deep debt after failing to sell her artworks, Beatrice feels neglected by her aunt, whose support she desperately craves.",
    "motiveSeed": "Believing Eleanor planned to sell her paintings, Beatrice feared that this would ruin her artistic reputation, pushing her to the brink.",
    "motiveStrength": "moderate",
    "alibiWindow": "Claimed to be out painting but left no proof of her whereabouts during the time of the murder, raising questions about her innocence.",
    "accessPlausibility": "easy",
    "stakes": "The stakes for Beatrice are high; she yearns not only for her aunt’s support but also for the chance to prove herself as an artist and secure her future.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Beatrice speaks with a breezy, almost whimsical tone, often punctuating her sentences with sardonic remarks that reveal her frustrations and aspirations.",
    "signatureTic": "‘I suppose the muse can be fickle, but so are expectations.’",
    "internalConflict": "Beatrice struggles with feelings of inadequacy and neglect, torn between her desire for recognition and the fear that she may never escape her aunt’s shadow.",
    "personalStakeInCase": "This case matters to Beatrice because Eleanor’s death not only robs her of familial support but also jeopardizes her artistic aspirations, leaving her feeling adrift in a sea of uncertainty.",
    "paragraphs": [
      "Beatrice Quill is a vibrant soul, a young artist with a spirit as colorful as the canvases she paints. Often seen along the seaside, she captures the essence of her surroundings with a carefree demeanor that masks the turmoil brewing within. While she presents herself as a charismatic and carefree artist, Beatrice grapples with her own demons, feeling neglected by her aunt Eleanor, the very person she sought validation from. The pressure to succeed weighs heavily on her shoulders, and when Eleanor’s murder occurs, it sends shockwaves through her already fragile existence.",
      "In the days leading up to Eleanor's death, Beatrice found herself drowning in debt, her artistic dreams slipping through her fingers like sand. The thought that Eleanor might sell her paintings—an act that would obliterate her reputation—fills her with despair. She believed that her aunt’s plans could spell the end of her aspirations, and the fear of being overshadowed by Eleanor's legacy becomes a driving force in her life. It is this fear that leads her down a dark path, where the line between love and resentment becomes blurred.",
      "Following Eleanor’s murder, Beatrice’s alibi comes under scrutiny, her claim of being out painting lacking the proof needed to dispel suspicion. The sardonic humor she often employs to deflect her insecurities now feels inadequate in the face of such tragedy. She finds herself grappling with the realization that her artistic journey may forever be tainted by the shadow of her aunt's death. The stakes are high; not only does she seek justice for Eleanor, but she also longs for acknowledgment of her talent, a chance to break free from the chains of familial expectations.",
      "As the investigation unfolds, Beatrice is forced to confront her own motivations and desires. This case matters deeply to her, not only because it strips her of the support she so desperately craved from Eleanor but also because it threatens to derail her artistic aspirations. In the midst of chaos, Beatrice must navigate the treacherous waters of suspicion, seeking to prove her innocence while also finding her own voice. The journey ahead may be fraught with challenges, but perhaps it is through this turmoil that she will discover her true self, rising above the expectations that once held her captive."
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "Sylvia Trent, a socialite and friend of Eleanor’s, finds herself ensnared in a web of jealousy and insecurity following the murder of her influential companion.",
    "publicPersona": "Charming and influential, Sylvia is a well-known figure in social circles, often seen at charity events, where she thrives on the attention and admiration of others.",
    "privateSecret": "Dependent on Eleanor’s social standing, Sylvia fears the loss of her own influence, feeling threatened by Eleanor's growing ties with Beatrice.",
    "motiveSeed": "Desperate to maintain her social status, Sylvia's insecurities lead her to view Eleanor’s connections as a threat to her own position.",
    "motiveStrength": "moderate",
    "alibiWindow": "Reportedly at a charity meeting, but her attendance was not documented, leaving room for doubt.",
    "accessPlausibility": "possible",
    "stakes": "The stakes for Sylvia are significant; the potential loss of her social status and financial backing looms large, pushing her to consider drastic measures.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.5,
    "speechMannerisms": "Sylvia speaks with an air of refinement, often employing polite sarcasm and subtle jabs that reveal her underlying insecurities and fierce ambition.",
    "signatureTic": "‘One must keep up appearances, after all.’",
    "internalConflict": "Sylvia struggles with her dependence on Eleanor for social validation, feeling torn between her desire for acceptance and the fear of losing her identity.",
    "personalStakeInCase": "This case matters to Sylvia because Eleanor's death threatens to unravel her carefully cultivated social status, leaving her vulnerable in a world where appearances reign supreme.",
    "paragraphs": [
      "Sylvia Trent is the quintessential socialite, a woman whose charm and influence have made her a fixture in elite circles. With a polished exterior and a penchant for the dramatic, she thrives on the attention of others, often seen at charity events with a smile that masks her insecurities. Yet, beneath the surface lies a tumultuous struggle for identity, as Sylvia's dependence on Eleanor Voss for social standing becomes painfully evident. The murder of her friend sends ripples of anxiety through her carefully constructed world, leaving her questioning her place within it.",
      "On the night of Eleanor's death, Sylvia claims she was attending a charity meeting, yet the lack of documentation raises eyebrows and casts a shadow of doubt over her alibi. As the investigation unfolds, she finds herself ensnared in a web of jealousy and insecurity, feeling threatened by Eleanor's growing ties with Beatrice, the young artist who represents a new wave of talent and influence. The stakes are high for Sylvia; the potential loss of Eleanor's support could spell the end of her social aspirations, a prospect that terrifies her.",
      "Sylvia's speech is often laced with polite savagery, a means of masking her fears with a veneer of sophistication. She employs subtle jabs and sarcasm, revealing her underlying insecurities while maintaining an air of refinement. Yet, as the investigation progresses, her carefully crafted facade begins to crack, exposing the desperation that drives her actions. The fear of losing her social status looms large, and she grapples with the realization that her identity is inextricably tied to Eleanor's influence.",
      "As the truth behind Eleanor’s murder begins to unravel, Sylvia must confront her own motivations and the lengths she is willing to go to preserve her social standing. This case matters deeply to her, not just for the potential fallout but for the chance to redefine herself beyond the shadows of others. In a world where appearances reign supreme, Sylvia's struggle for identity becomes a poignant reflection of the complexities of friendship, ambition, and the price of societal acceptance."
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "Hugo Vane, a journalist and outsider, finds himself pulled into the investigation of Eleanor Voss's murder, driven by a desire to uncover the truth behind family secrets.",
    "publicPersona": "A well-known journalist with a nose for scandal, Hugo is often seen around town, sniffing out stories and weaving them into captivating narratives.",
    "privateSecret": "Hugo has been secretly investigating the Voss family for a story on hidden family secrets, a pursuit that now intertwines with the murder investigation.",
    "motiveSeed": "His desire to uncover the truth behind Eleanor’s financial distress and familial conflicts for a major article could lead him to exploit the tragedy for his own gain.",
    "motiveStrength": "moderate",
    "alibiWindow": "Present in the lobby for an interview, but his timeline remains unclear, casting doubt on his intentions.",
    "accessPlausibility": "easy",
    "stakes": "The stakes for Hugo are high; a breakthrough story could elevate his career, but the truth may also expose devastating family secrets.",
    "humourStyle": "observational",
    "humourLevel": 0.5,
    "speechMannerisms": "Hugo speaks with a keen observational tone, often employing dry humor to comment on the absurdities of life and the human condition, revealing his sharp wit.",
    "signatureTic": "‘The truth is often stranger than fiction, wouldn’t you agree?’",
    "internalConflict": "Hugo is torn between his journalistic instincts to uncover the truth and the moral implications of exposing a family's darkest secrets, questioning whether the story is worth the cost.",
    "personalStakeInCase": "This case matters to Hugo because it presents an opportunity to not only break a significant story but also to engage with the complexities of human nature and the consequences of truth.",
    "paragraphs": [
      "Hugo Vane is a journalist known for his nose for scandal, a man who thrives on the thrill of uncovering hidden truths. His reputation precedes him, often seen around town with a notepad in hand, ready to weave the next captivating narrative. Yet, beneath the surface of this confident exterior lies a man grappling with the ethical dilemmas that come with his profession. As he finds himself pulled into the investigation of Eleanor Voss's murder, he must confront the delicate balance between truth and consequence.",
      "Hugo has been secretly investigating the Voss family, drawn to the tangled web of hidden secrets and financial distress that surrounds them. The murder of Eleanor propels him into a world of intrigue, where the lines between professional ambition and personal morality blur. His desire to uncover the truth is tempered by the realization that exposing family secrets may come at a steep price, one that could shatter lives and reputations. The stakes are high; a breakthrough story could elevate his career, but it also risks inflicting irreparable damage on those involved.",
      "With a keen observational eye, Hugo often employs dry humor to comment on the absurdities of life, using wit as a means of navigating the complexities of human nature. His speech reflects this observational style, revealing a man who is both insightful and self-aware. Yet, as the investigation unfolds, he begins to question whether the truth is worth the cost of destruction it may bring. The internal conflict between his journalistic instincts and the moral implications of his work weighs heavily on him, forcing him to confront the very essence of his craft.",
      "As he delves deeper into the mystery surrounding Eleanor’s death, Hugo realizes that this case is not merely a story to be told, but a journey into the heart of human relationships and the consequences of our actions. The chance to uncover the truth about Eleanor and her family presents an opportunity for growth, a chance to engage with the complexities of life beyond the confines of a byline. In navigating the treacherous waters of suspicion and intrigue, Hugo may find that the truth is often stranger than fiction, and that sometimes, it is the journey toward understanding that holds the most significance."
    ],
    "order": 6
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "The Grand Mariner Hotel",
    "type": "hotel",
    "place": "Brighton",
    "country": "England",
    "summary": "A sprawling seaside hotel with Art Deco elegance, overlooking the tumultuous waves of the English Channel, where secrets linger beneath the surface.",
    "visualDescription": "The Grand Mariner Hotel showcases stunning Art Deco architecture, with its sweeping curves and angular motifs reflecting the glamour of the era. The grand lobby boasts polished marble floors, flanked by sweeping staircases that ascend to guest rooms. Expansive windows frame the ocean view, while the dining area features ornate chandeliers and plush seating, inviting guests to indulge while watching the waves crash against the shore.",
    "atmosphere": "A blend of elegance and tension, where the whispers of the past echo amid the salty breeze.",
    "paragraphs": [
      "The Grand Mariner Hotel stands resolute against the roiling sea, its Art Deco façade a striking contrast to the wild, crashing waves below. As guests enter the grand lobby, they are greeted by the faint scent of salt and polished wood, mingling with the aroma of freshly brewed coffee from the nearby café. The sound of laughter and clinking glasses floats in from the dining area, but a subtle tension hangs in the air, a reminder of the war's lingering shadows.",
      "Visitors occasionally pause to admire the panoramic ocean views, the horizon blurring into the mist. Yet, the narrow hallways and crowded stairwells create an atmosphere of intimacy, where secrets can easily be overheard. The balcony, often a refuge for guests seeking solitude, remains off-limits at night, adding an air of restriction that heightens the sense of vigilance among those who remain.",
      "As the sun sets, the hotel transforms; the flickering gas lamps cast long shadows across the marble floors. The distant sound of waves crashing against the cliffs provides a haunting backdrop to the evening's conversations, where every gaze is laden with unspoken truths. In this sanctuary of elegance, the weight of post-war anxieties feels palpable, enveloping all who seek respite within its walls."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "cool and breezy with occasional fog typical of coastal regions",
    "timeFlow": "Three days of mounting tension leading to a revelation",
    "mood": "tense and anticipatory, with lingering post-war anxieties",
    "eraMarkers": [
      "Art Deco architecture",
      "early radio broadcasts in the lobby",
      "women in the workforce as hotel staff"
    ],
    "sensoryPalette": {
      "dominant": "salty sea air and polished wood",
      "secondary": [
        "faint aroma of fresh coffee",
        "underlying scent of dampness"
      ]
    },
    "paragraphs": [
      "The cool, salty air envelops the Grand Mariner Hotel, where the crashing waves outside mingle with the whispers of guests inside. Each footstep echoes off the polished marble, and the distant sound of a radio crackles with the latest news from abroad, reminding all of the world beyond their temporary refuge. The atmosphere is thick with secrets, where the elegant design serves as a façade for the darker truths hiding in plain sight.",
      "As evening falls, the hotel’s windows fog slightly, blurring the line between inside and outside. Flickering gas lamps create an intimate glow, illuminating the faces of patrons lost in thought, their expressions revealing the weight of unspoken worries. The lingering aroma of damp sea air and polished wood fills the space, evoking memories of loss and longing, while the distant sound of laughter contrasts sharply with the tension that hangs heavy in the air."
    ]
  },
  "keyLocations": [
    {
      "id": "lobby",
      "name": "Grand Lobby",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "Expansive marble floors, sweeping staircases, ornate chandeliers casting a warm glow.",
      "sensoryDetails": {
        "sights": [
          "polished marble floors",
          "elegant Art Deco motifs",
          "plush velvet seating",
          "grand chandelier glow",
          "swaying palm fronds"
        ],
        "sounds": [
          "murmurs of conversation",
          "clinking of glassware",
          "soft jazz from a radio",
          "footsteps echoing",
          "the distant crash of waves"
        ],
        "smells": [
          "fresh coffee from the café",
          "salt from the ocean",
          "polished wood",
          "dampness in the air",
          "cigarette smoke"
        ],
        "tactile": [
          "smooth marble underfoot",
          "soft velvet upholstery",
          "cool metal railings",
          "warmth of sunlight through windows",
          "chill of the sea breeze"
        ]
      },
      "accessControl": "Open to all guests; staff-only areas behind the reception desk.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-dappled windows",
            "grey light filtering in",
            "water pooling on the floor"
          ],
          "sounds": [
            "steady rain on the roof",
            "dripping from eaves",
            "muffled voices from the café"
          ],
          "smells": [
            "freshly brewed coffee",
            "damp earth",
            "wet wood"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light through clouds",
            "shadows creeping across the floor",
            "flickering gas lamps"
          ],
          "sounds": [
            "silence interrupted by distant laughter",
            "the creak of old furniture",
            "the ticking of a clock"
          ],
          "smells": [
            "old books",
            "dust motes in sunlight",
            "candle wax"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight reflections",
            "long shadows from the chandelier",
            "glimmering glassware"
          ],
          "sounds": [
            "soft jazz playing",
            "gentle laughter",
            "the distant hum of the ocean"
          ],
          "smells": [
            "scent of tobacco",
            "freshly baked pastries",
            "warmth of the fireplace"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Grand Lobby is a bustling heart of the hotel, where guests gather to exchange pleasantries or whisper conspiracies. Polished marble floors reflect the elegance of the Art Deco design, while the grand chandelier casts a warm glow over plush velvet seating. The air is rich with the aroma of freshly brewed coffee and the salty tang of the ocean, creating a heady mix that invites both relaxation and suspicion.",
        "As guests mill about, the sounds of laughter and soft jazz create a warm atmosphere, yet an undercurrent of tension lingers. The narrow hallways leading away from the lobby create a sense of intimacy, where overheard conversations might reveal hidden truths. The lobby, while open and inviting, is a stage for the drama that unfolds within the hotel’s walls."
      ]
    },
    {
      "id": "dining_area",
      "name": "Dining Room",
      "type": "interior",
      "purpose": "Dining space for guests",
      "visualDetails": "Large windows overlooking the beach, elegantly set tables, and a grand fireplace.",
      "sensoryDetails": {
        "sights": [
          "ocean waves crashing outside",
          "elegantly set tables",
          "gleaming silverware",
          "ornate fireplace",
          "floral centerpieces"
        ],
        "sounds": [
          "clinking of cutlery",
          "soft murmur of conversations",
          "crackling fire",
          "waiters moving about",
          "the distant sound of waves"
        ],
        "smells": [
          "freshly baked bread",
          "grilled seafood",
          "aromatic herbs",
          "warmth from the fireplace",
          "candle wax"
        ],
        "tactile": [
          "smooth linen tablecloths",
          "cold glassware",
          "warmth of the fireplace",
          "soft velvet chairs",
          "the chill of the sea breeze"
        ]
      },
      "accessControl": "Open to all guests during meal times; staff access to kitchen.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-splattered windows",
            "dim light filtering in",
            "wet tablecloths"
          ],
          "sounds": [
            "soft patter of rain",
            "muffled laughter",
            "clinking of dishes"
          ],
          "smells": [
            "fresh coffee",
            "toasted pastries",
            "wet stone"
          ],
          "mood": "introspective"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "grey light casting shadows",
            "empty chairs awaiting guests",
            "flickering candles"
          ],
          "sounds": [
            "soft discussions",
            "the rustle of menus",
            "the crackle of the fireplace"
          ],
          "smells": [
            "roasted meats",
            "simmering sauces",
            "fresh herbs"
          ],
          "mood": "contemplative"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight dancing on walls",
            "glimmering plates",
            "happy faces of diners"
          ],
          "sounds": [
            "laughter and chatter",
            "waitstaff moving gracefully",
            "the crackling fire"
          ],
          "smells": [
            "scent of grilled fish",
            "sweet desserts",
            "freshly baked bread"
          ],
          "mood": "celebratory"
        }
      ],
      "paragraphs": [
        "The dining room, with its stunning ocean view, serves as a canvas for culinary delight and social interaction. Large windows frame the crashing waves outside, while elegantly set tables invite guests to indulge in the evening’s fare. The scent of freshly baked bread mingles with the aroma of grilled seafood, creating a feast for the senses that is both comforting and tantalizing.",
        "As diners engage in soft conversation, the crackling fireplace adds warmth to the room, while the distant sound of waves provides a soothing backdrop. The ambiance shifts with the time of day, transforming from the quiet introspection of a rainy morning to the lively chatter of an evening celebration, each moment steeped in the rich history of the hotel and its guests."
      ]
    },
    {
      "id": "rooftop_terrace",
      "name": "Rooftop Terrace",
      "type": "exterior",
      "purpose": "Scenic overlook and relaxation area",
      "visualDetails": "Panoramic views of the coastline, wrought-iron railings, and potted plants.",
      "sensoryDetails": {
        "sights": [
          "panoramic ocean views",
          "swirling clouds overhead",
          "distant ships on the horizon",
          "wrought-iron railings",
          "potted flowers swaying"
        ],
        "sounds": [
          "whistling wind",
          "distant gulls calling",
          "the murmur of waves",
          "soft rustling of leaves",
          "the thump of a door"
        ],
        "smells": [
          "fresh sea air",
          "scent of blooming flowers",
          "salt and brine",
          "warmth of the sun",
          "faint tobacco smoke"
        ],
        "tactile": [
          "cool metal railings",
          "warm sun on skin",
          "soft breeze against skin",
          "rough texture of potted plants",
          "the chill of evening air"
        ]
      },
      "accessControl": "Restricted access at night; open to guests during the day.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "clouds rolling in",
            "rain-soaked railings",
            "dripping potted plants"
          ],
          "sounds": [
            "steady rain on metal",
            "wind howling",
            "distant thunder"
          ],
          "smells": [
            "damp earth",
            "freshly washed air",
            "wet foliage"
          ],
          "mood": "melancholic"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat grey sky",
            "choppy sea",
            "faded colors"
          ],
          "sounds": [
            "soft rustle of leaves",
            "the low murmur of the ocean",
            "the creak of metal"
          ],
          "smells": [
            "scent of seaweed",
            "cool air",
            "wet stone"
          ],
          "mood": "reflective"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "sunset painting the sky",
            "stars beginning to twinkle",
            "glow of the city lights"
          ],
          "sounds": [
            "gentle waves lapping",
            "soft laughter from below",
            "the rustle of a breeze"
          ],
          "smells": [
            "scent of blooming flowers",
            "salt in the air",
            "warmth of the sun setting"
          ],
          "mood": "serene"
        }
      ],
      "paragraphs": [
        "The rooftop terrace offers a breathtaking view of the coastline, a secluded spot where guests can escape the bustle of the hotel below. With its wrought-iron railings and potted plants swaying gently in the breeze, it serves as a haven for reflection and contemplation. The fresh sea air invigorates, yet a sense of isolation lingers, reminding visitors of their distance from the world beyond.",
        "As day transitions to night, the terrace transforms into a canvas of color, with sunsets painting the sky in shades of orange and pink. The distant sound of waves crashing against the shore mingles with the soft rustle of leaves, creating a symphony of nature that soothes the mind. However, as darkness falls, the restricted access at night adds a layer of intrigue, suggesting that not all is as it appears in this seemingly tranquil setting."
      ]
    },
    {
      "id": "crime_scene",
      "name": "Beachfront Room 12",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "Disheveled room with overturned furniture, a shattered window, and footprints in the sand.",
      "sensoryDetails": {
        "sights": [
          "overturned furniture",
          "shattered glass on the floor",
          "footprints leading to the window",
          "dark stains on the carpet",
          "open door swinging slightly"
        ],
        "sounds": [
          "distant waves crashing",
          "the creak of the building settling",
          "muffled voices from the hallway",
          "the flutter of a curtain",
          "the wind whistling through cracks"
        ],
        "smells": [
          "scent of salt and brine",
          "faint metallic tang of blood",
          "old cigarette smoke",
          "the musty odor of dampness",
          "the lingering perfume of a struggle"
        ],
        "tactile": [
          "sharp glass shards underfoot",
          "cold air seeping in through the window",
          "rough texture of sand on the floor",
          "soft fabric of the bedspread",
          "the chill of the sea breeze"
        ]
      },
      "accessControl": "Access restricted to authorized personnel; staff must knock and announce themselves.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-soaked footprints",
            "dim light filtering through clouds",
            "mist gathering on the floor"
          ],
          "sounds": [
            "steady rain tapping against glass",
            "muffled whispers from the hallway",
            "the distant rumble of thunder"
          ],
          "smells": [
            "dampness in the air",
            "the scent of fresh rain",
            "the metallic tang of blood"
          ],
          "mood": "foreboding"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "grey light spilling into the room",
            "shadows creeping across the floor",
            "the outline of footprints in the sand"
          ],
          "sounds": [
            "the creaking of old wood",
            "the soft hum of conversations outside",
            "the faint sound of the sea"
          ],
          "smells": [
            "scent of damp earth",
            "the stale odor of old smoke",
            "the lingering perfume of fear"
          ],
          "mood": "tense"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "shadows elongating in the fading light",
            "the glow of distant lights outside",
            "the flicker of a candle"
          ],
          "sounds": [
            "the soft rustle of curtains",
            "the distant laughter from the lobby",
            "the sound of waves crashing"
          ],
          "smells": [
            "scent of salt in the air",
            "the faint smell of blood",
            "the mustiness of the room"
          ],
          "mood": "intense"
        }
      ],
      "paragraphs": [
        "Beachfront Room 12 bears the scars of a violent encounter, a disheveled space that tells a story of chaos. Overturned furniture and shattered glass litter the floor, while footprints in the sand lead to the broken window, hinting at a hasty escape. The air is thick with the lingering scent of salt and brine, mingling with a faint metallic tang that sends shivers down the spine.",
        "As investigators step into the room, the distant sound of waves crashing outside contrasts sharply with the stillness within. The soft flutter of a curtain whispers secrets, while the chill of the sea breeze seeps through the cracks, creating an unsettling atmosphere. This is a place where danger lurked, and the evidence left behind speaks volumes."
      ]
    }
  ],
  "note": "",
  "cost": 0.0023695022999999996,
  "durationMs": 27123
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1940,
    "month": "February",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "winter",
    "month": "February",
    "weather": [
      "cool and breezy",
      "occasional fog",
      "overcast skies with sporadic sun"
    ],
    "daylight": "Short daylight hours; the sun rises around 7:30 AM and sets by 5:30 PM, casting long shadows in the early evening.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, just after dinner service concludes.",
    "holidays": [
      "Valentine's Day on February 14"
    ],
    "seasonalActivities": [
      "attending local theater productions",
      "participating in winter sports like skating",
      "celebrating Valentine's Day with social gatherings"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "double-breasted suit with wide lapels",
        "wingtip shoes",
        "silk tie with geometric patterns"
      ],
      "casual": [
        "tweed jacket with elbow patches",
        "corduroy trousers",
        "polo shirt"
      ],
      "accessories": [
        "fedora hat",
        "leather gloves",
        "pocket square"
      ]
    },
    "womensWear": {
      "formal": [
        "tea-length evening gown with a fitted bodice",
        "faux fur stole",
        "string of pearls"
      ],
      "casual": [
        "A-line dress with a cinched waist",
        "tweed skirt with a matching cardigan",
        "blouse with puffed sleeves"
      ],
      "accessories": [
        "cloche hat",
        "silk scarf",
        "gloves"
      ]
    },
    "trendsOfTheMoment": [
      "bold patterns in clothing",
      "increased use of synthetic fabrics",
      "rising popularity of ready-to-wear fashion"
    ],
    "socialExpectations": [
      "men expected to wear hats in public",
      "women encouraged to embody femininity",
      "social gatherings often revolve around formal dining"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "The Winter War between Finland and the Soviet Union continues",
      "Tensions rise in Europe as Britain faces the threat of invasion",
      "The U.S. begins to formalize aid to Britain through the Lend-Lease Act"
    ],
    "politicalClimate": "In Europe, nations are on high alert amidst the ongoing conflict, while the U.S. grapples with isolationist sentiments against growing global tensions.",
    "economicConditions": "The economy is recovering from the Great Depression, but unemployment remains a concern as war efforts ramp up.",
    "socialIssues": [
      "debates over military enlistment",
      "women's rights in the workplace",
      "racial segregation in employment"
    ],
    "internationalNews": [
      "Germany's aggressive expansion continues to dominate headlines",
      "The League of Nations struggles to maintain peace",
      "Rationing of goods begins to tighten in various countries"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "'In the Mood' by Glenn Miller",
        "'I'll Be Seeing You' by Billie Holiday",
        "'Tuxedo Junction' by Erskine Hawkins"
      ],
      "films": [
        "'The Great McGinty'",
        "'The Grapes of Wrath'",
        "'The Wizard of Oz'"
      ],
      "theater": [
        "'The Corn Is Green' by Emlyn Williams",
        "'Lady Windermere's Fan' by Oscar Wilde"
      ],
      "radio": [
        "The Jack Benny Show",
        "Fibber McGee and Molly",
        "Gangbusters"
      ]
    },
    "literature": {
      "recentPublications": [
        "'The Maltese Falcon' by Dashiell Hammett",
        "'The Grapes of Wrath' by John Steinbeck",
        "'The Little Prince' by Antoine de Saint-Exupéry"
      ],
      "popularGenres": [
        "mystery fiction",
        "social realism",
        "science fiction"
      ]
    },
    "technology": {
      "recentInventions": [
        "the first commercial radar systems",
        "the development of the Walkie Talkie",
        "advancements in early computing technology"
      ],
      "commonDevices": [
        "radio sets",
        "typewriters",
        "manual telephones"
      ],
      "emergingTrends": [
        "early television broadcasts",
        "increased household electrification",
        "growing popularity of vehicles"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "A pint of milk: three pence",
        "Coal scuttle refill: one shilling sixpence"
      ],
      "commonActivities": [
        "socializing at local pubs",
        "attending community dances",
        "engaging in charity events"
      ],
      "socialRituals": [
        "formal dinner parties",
        "weekly church services"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "growing class consciousness due to economic changes",
      "increased solidarity among workers",
      "continued elitism in high society"
    ],
    "gender": [
      "women increasingly stepping into roles traditionally held by men",
      "expectation for women to balance work and home life",
      "emerging feminist sentiments"
    ],
    "race": [
      "continued racial segregation in many areas",
      "growing awareness of civil rights issues",
      "African American contributions to the war effort gaining recognition"
    ],
    "generalNorms": [
      "increasingly formal social gatherings",
      "emphasis on community and family values",
      "widespread adherence to traditional gender roles"
    ]
  },
  "atmosphericDetails": [
    "The scent of coal smoke lingers in the air as the fog rolls in from the coast, blurring the outlines of nearby buildings.",
    "Inside the hotel, the faint sound of a jazz band plays softly in the background, mixing with the clinking of glasses and hushed conversations.",
    "The light from ornate chandeliers casts flickering shadows on the walls, creating an intimate yet charged atmosphere where secrets may lie just beneath the surface."
  ],
  "paragraphs": [
    "On a chilly February evening in 1940, the air hangs heavy with the anticipation of the unknown. Fog drapes over the coastal hotel, obscuring the world outside while the warmth of the interior pulses with life. Guests gather, dressed in their finest attire, discussing the latest news of Europe’s escalating tensions and the Winter War that rages on, a reminder of the fragility of peace. The long shadows cast by flickering lamps create an atmosphere thick with secrets, where the clinking of cocktail glasses mingles with whispers of fear and hope.",
    "Fashion reflects the era, with men donning double-breasted suits adorned with bold patterns and women gracing the hall in tea-length gowns, their ensembles completed with faux fur stoles and elegant pearls. Hats are de rigueur for men, while women's cloche hats add a touch of whimsy to their otherwise sophisticated looks. As conversations flow, the rich textures of their clothing absorb the warmth of the gathering, yet outside, the cool breeze serves as a reminder of the harsh realities that persist beyond the hotel’s walls.",
    "Daily life is characterized by a sense of urgency; rationing begins to take form, and prices reflect a cautious economy still recovering from the Great Depression. A loaf of bread costs four pence, and the community gathers at local pubs and charity events, forging connections amid uncertainty. Social rituals like formal dinner parties take place in the hotel, where class lines are both drawn and blurred, leaving guests to navigate the complex web of post-war society. It is a time when old norms clash with emerging sentiments, and the air is thick with the promise—and peril—of change."
  ],
  "note": "",
  "cost": 0.00107864625,
  "durationMs": 14529
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A high-stakes masquerade ball at a seaside hotel brings together a diverse group, each grappling with post-war anxieties and hidden identities, as tensions rise amidst the backdrop of Cold War fears.",
  "era": {
    "decade": "1940s",
    "socialStructure": "Post-WWII societal trauma influences class dynamics, with women entering the workforce and a pervasive atmosphere of suspicion and secrecy due to Cold War tensions."
  },
  "setting": {
    "location": "A large, seaside hotel with Art Deco architecture overlooking the beach.",
    "institution": "hotel",
    "weather": "cool and breezy with occasional fog typical of coastal regions"
  },
  "castAnchors": [
    "Eleanor Voss",
    "Dr. Mallory Finch",
    "Captain Ivor Hale",
    "Beatrice Quill",
    "Sylvia Trent",
    "Hugo Vane"
  ],
  "theme": "Golden Age murder driven by an impersonation method, where a masquerade of double identity — a disguise exploited to seem to be in two places — breaks the assumed alibi."
}

### LOCKED_FACTS
[
  {
    "id": "mask_tear_location",
    "value": "the left eye",
    "description": "The distinct tear on the victim's mask was located at the left eye."
  },
  {
    "id": "mask_thread_color",
    "value": "green",
    "description": "The loose thread found on the victim's clothing was green, matching the mask's design."
  },
  {
    "id": "mask_count",
    "value": "two",
    "description": "There were two identical masks created for the masquerade."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 14,
  "countsByPlacement": {
    "early": 3,
    "mid": 10,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 13,
    "optional": 1
  },
  "redHerringCount": 1,
  "clues": [
    {
      "id": "clue_early_1",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_core_contradiction_chain",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_mid_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_core_elimination_chain",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_mid_2",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_culprit_direct_captain_ivor_hale",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_late_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_mid_3",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_mid_4",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
    },
    {
      "id": "clue_fp_elimination_beatrice_quill",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_fp_elimination_sylvia_trent",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_culprit_direct_1",
      "placement": "mid",
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
      "id": "clue_fp_contradiction_step_2",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
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

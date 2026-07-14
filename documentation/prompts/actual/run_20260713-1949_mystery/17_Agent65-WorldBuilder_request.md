# Actual Prompt Record

- Run ID: `mystery-1783972181080`
- Project ID: ``
- Timestamp: `2026-07-13T19:54:56.701Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `1c7c9a1e76dd9596`

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
    "title": "The Tidal Trap",
    "author": "Anonymous",
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
      "subtype": "drowning"
    }
  },
  "death_method": "drowned",
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "Detective",
      "relationships": [],
      "public_persona": "A keen-minded investigator with a knack for solving mysteries.",
      "private_secret": "Struggles with the trauma of losing a loved one in the war.",
      "motive_seed": "inheritance",
      "motive_strength": "moderate",
      "alibi_window": "None",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Desire for justice",
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
      "public_persona": "Respected doctor known for her work with veterans.",
      "private_secret": "Had been threatened due to her medical opinions.",
      "motive_seed": "inheritance",
      "motive_strength": "unknown",
      "alibi_window": "unknown",
      "access_plausibility": "unknown",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Personal safety",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "50-60",
      "role_archetype": "Suspect",
      "relationships": [],
      "public_persona": "A retired naval officer with a stern reputation.",
      "private_secret": "Has a history of conflict with Dr. Finch over her treatments.",
      "motive_seed": "Jealousy over her influence.",
      "motive_strength": "strong",
      "alibi_window": "From ten to eleven",
      "access_plausibility": "high",
      "opportunity_channels": [
        "The beach access from the hotel"
      ],
      "behavioral_tells": [
        "Short temper when discussing Dr. Finch"
      ],
      "stakes": "Reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "30-40",
      "role_archetype": "Suspect",
      "relationships": [],
      "public_persona": "A charming socialite with connections to the victim.",
      "private_secret": "Had a secret affair with Dr. Finch.",
      "motive_seed": "Fear of exposure of their relationship.",
      "motive_strength": "moderate",
      "alibi_window": "Last seen at dinner until quarter to eleven",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Dining room access"
      ],
      "behavioral_tells": [
        "Nervousness when questioned"
      ],
      "stakes": "Social standing",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "20-30",
      "role_archetype": "Suspect",
      "relationships": [],
      "public_persona": "A hotel staff member with an eye for detail.",
      "private_secret": "Knew about Dr. Finch's enemies.",
      "motive_seed": "inheritance",
      "motive_strength": "weak",
      "alibi_window": "Working until eleven",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Access to all hotel areas"
      ],
      "behavioral_tells": [
        "Fidgeting when discussing the night of the murder"
      ],
      "stakes": "Job security",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "40-50",
      "role_archetype": "Suspect",
      "relationships": [],
      "public_persona": "A wealthy businessman with interests in the hotel.",
      "private_secret": "Had financial disputes with Dr. Finch.",
      "motive_seed": "Financial pressure due to Dr. Finch's refusal to treat his investments.",
      "motive_strength": "strong",
      "alibi_window": "Claimed to be in his room from ten to eleven",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Window access to the beach"
      ],
      "behavioral_tells": [
        "Avoids eye contact when questioned"
      ],
      "stakes": "Financial stability",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
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
      "summary": "Dr. Mallory Finch was found drowned during a reunion at a seaside hotel, but the timing of the tides complicates the investigation, suggesting foul play. Eleanor Voss must navigate the tangled relationships and hidden motives of the guests to uncover the truth."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "The mechanism relies on schedule, eleven, and drown to expose the false timing.",
      "delivery_path": [
        {
          "step": "Captain Hale misled witnesses about the time he last saw Dr. Finch."
        },
        {
          "step": "The high tide schedule was altered in the minds of the witnesses during the emotional stress of the evening."
        }
      ]
    },
    "outcome": {
      "result": "The evidence reveals that Dr. Finch could not have drowned at the indicated time due to the high tide."
    }
  },
  "false_assumption": {
    "statement": "Dr. Mallory Finch drowned at the time indicated by the hotel clock.",
    "type": "temporal",
    "why_it_seems_reasonable": "Witnesses recall seeing her alive until shortly before the time stated.",
    "what_it_hides": "The true timing of the tide, which made it impossible for her to drown at that time."
  },
  "false_solution": {
    "accused_suspect": "Hugo Vane",
    "supporting_points": [
      "Witnesses saw Hugo arguing with Dr. Finch earlier in the evening.",
      "He had access to the beach and could have staged the drowning."
    ],
    "the_one_flaw": "Witnesses later couldn't confirm his presence by the tide, as he was seen entering the hotel before eleven.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "A witness claims to have seen Dr. Finch arguing with Beatrice shortly before the murder.",
      "points_at_suspect": "Beatrice Quill",
      "innocent_explanation": "The argument was over a personal matter unrelated to the murder.",
      "resolved_in_chapter": 5
    },
    {
      "id": "red_herring_2",
      "description": "Captain Hale’s heated remarks about Dr. Finch’s medical practices.",
      "points_at_suspect": "Captain Ivor Hale",
      "innocent_explanation": "His remarks stemmed from concern for fellow veterans and were not threatening.",
      "resolved_in_chapter": 5
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
    "rationale": "All suspects were present at the hotel during the time of the murder."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Last sighting of Dr. Finch",
        "High tide schedule"
      ],
      "windows": [
        "From ten to eleven"
      ],
      "contradictions": [
        "Witnesses claim Dr. Finch was last seen alive at quarter to eleven, but high tide occurred at half past eleven."
      ]
    },
    "access": {
      "actors": [
        "Captain Ivor Hale",
        "Hugo Vane",
        "Beatrice Quill"
      ],
      "objects": [
        "Beach access from the hotel",
        "Tide gauge"
      ],
      "permissions": [
        "Access to the beach area during the reunion"
      ]
    },
    "physical": {
      "laws": [
        "Tide laws govern water levels and timing"
      ],
      "traces": [
        "Footprints leading to the tide gauge"
      ]
    },
    "social": {
      "trust_channels": [
        "Witness testimonies",
        "Hotel staff reliability"
      ],
      "authority_sources": [
        "Hotel management",
        "Local authorities"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The tide schedule shows high tide at half past eleven.",
        "correction": "Dr. Finch could not have drowned at the time indicated by witnesses if high tide was later.",
        "effect": "Narrows potential time of death, eliminating any claim of drowning before high tide.",
        "required_evidence": [
          "Tide schedule showing high tide at half past eleven",
          "Witness statements claiming Dr. Finch was last seen alive at quarter to eleven"
        ],
        "reader_observable": true
      },
      {
        "observation": "Captain Hale's watch was found stopped at twenty minutes past eleven.",
        "correction": "If Captain Hale's watch stopped at twenty minutes past eleven, his claim about Dr. Finch's last sighting must be questioned.",
        "effect": "Eliminates Captain Hale's claim of being with Dr. Finch until just before high tide.",
        "required_evidence": [
          "Captain Hale's watch showing twenty minutes past eleven",
          "Witness accounts of Hale's whereabouts at that time"
        ],
        "reader_observable": true
      },
      {
        "observation": "Witness statements contain discrepancies about the time of Dr. Finch's last sighting.",
        "correction": "The conflicting accounts of the witnesses indicate a cognitive bias due to emotional stress.",
        "effect": "Narrows credibility of witnesses who claim to have seen Dr. Finch alive shortly before drowning.",
        "required_evidence": [
          "Witness statements showing conflicting times",
          "Emotional testimonies from witnesses"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "Comparing the tide schedule with the times claimed by Hale and the witnesses will reveal inconsistencies.",
    "knowledge_revealed": "The tide schedule contradicts the claimed times of death.",
    "pass_condition": "If Hale's claims do not align with the tide schedule, he is proven to be lying.",
    "evidence_clues": [
      "clue_core_contradiction_chain",
      "clue_mechanism_visibility_core",
      "clue_6",
      "clue_early_1"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The tide schedule (early) and witness accounts (mid) allow the reader to establish the timeline. Step 2: Hale's stopped watch reveals discrepancies in his alibi. Step 3: Witness contradictions expose cognitive bias, leading to the realization that Hale's timeline is impossible."
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
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Witness testimony confirms she was in the dining room during the time of the murder.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Evidence shows she was working in another area of the hotel at the time.",
        "supporting_clues": [
          "clue_id_3",
          "clue_id_4"
        ]
      },
      {
        "suspect_name": "Hugo Vane",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Confirmed alibi from other guests that he was not by the tide at the time.",
        "supporting_clues": [
          "clue_id_5",
          "clue_id_6"
        ]
      },
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: unknown",
        "supporting_clues": []
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
        "clue_id": "clue_mechanism_visibility_core",
        "act_number": 1,
        "scene_number": 1,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_core_contradiction_chain",
        "act_number": 1,
        "scene_number": 2,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_culprit_direct_captain_ivor_hale",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_early_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_3",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_4",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_10",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_11",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_5",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_6",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
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
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_9",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_culprit_direct_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_late_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Test results"
      },
      {
        "clue_id": "clue_mid_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "Eleanor Voss is a travel journalist whose charming exterior masks a fierce determination to uncover the truth, driven by a personal vendetta against a former colleague.",
    "publicPersona": "Charming, inquisitive, with a knack for uncovering secrets and a keen observer of human behavior.",
    "privateSecret": "Harbors a deep-seated resentment against a former colleague who overshadowed her career.",
    "motiveSeed": "Desires to find the truth about the murder to vindicate her own credibility as a journalist.",
    "motiveStrength": "moderate",
    "alibiWindow": "Present at the hotel for an assignment, stayed in the lobby during dinner.",
    "accessPlausibility": "easy",
    "stakes": "Community trust and personal integrity at stake as a journalist.",
    "humourStyle": "observational",
    "humourLevel": 0.5,
    "speechMannerisms": "Speaks with a mix of enthusiasm and caution, often asking probing questions that reflect her curiosity. Occasionally punctuates her observations with dry humor.",
    "signatureTic": "‘Isn’t it fascinating how people reveal themselves?’",
    "internalConflict": "Struggles with feelings of inadequacy and jealousy, questioning whether her pursuit of the truth is driven by integrity or a desire for validation.",
    "personalStakeInCase": "This murder could either solidify her reputation or shatter it, making her determined to uncover the truth.",
    "paragraphs": [
      "Eleanor Voss stood in the hotel lobby, her keen eyes scanning the room like a hawk surveying its territory. The air was thick with the scent of salt and secrets. As a travel journalist, she had learned to observe the subtle shifts in human behavior, but tonight, the tension was palpable. The murder of Dr. Mallory Finch had sent shockwaves through the seaside community, and Eleanor sensed an opportunity to reclaim her place in the spotlight, overshadowed as she had been by a former colleague's success.",
      "With a charming smile that belied her inner turmoil, Eleanor approached the guests, her voice a melodic blend of curiosity and warmth. 'Isn’t it fascinating how people reveal themselves?' she often mused, a phrase that had become her signature. But beneath that charm lay a simmering resentment; she had spent too long in the shadows, and now, with the right story, she could finally step into the light. The murder investigation presented the perfect stage for her to showcase her skills, and she was determined to seize it.",
      "However, as she delved deeper into the mystery, Eleanor found herself grappling with more than just the details of the case. Her internal conflict gnawed at her—the desire to expose the truth clashed with her longing for validation. What would it mean for her if she succeeded? Would she earn the respect she craved, or would her motives be scrutinized and dismissed? The stakes had never been higher, and Eleanor felt the weight of her ambitions pressing down on her.",
      "As she gathered clues and interviewed suspects, Eleanor's observational humor often lightened the heavy atmosphere. She noted the absurdity of human nature, the way people clung to their facades even in the face of tragedy. Yet, inside, she wrestled with the fear that her own past would come to light, that her jealousy and resentment could taint her investigation. In this dark game of deception and death, could she emerge not just as a journalist, but as a trusted member of this fractured community?"
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch, the respected local physician, finds herself at the center of a web of secrets and lies, her past threatening to unravel her carefully crafted reputation.",
    "publicPersona": "Respected and composed doctor, often seen as a confidante for the town's elite.",
    "privateSecret": "Had an affair with the victim which ended tumultuously, leading to threats about revealing secrets.",
    "motiveSeed": "Fear of old secrets being revealed that could harm her reputation and practice.",
    "motiveStrength": "strong",
    "alibiWindow": "In a room with patients during the murder, but could have had a window to slip away.",
    "accessPlausibility": "possible",
    "stakes": "Her career and reputation are at stake.",
    "humourStyle": "none",
    "humourLevel": 0,
    "speechMannerisms": "Speaks with measured precision, often using medical jargon that reflects her expertise. Her tone is calm, but there’s an underlying tension that betrays her inner turmoil.",
    "signatureTic": "‘We mustn't rush to conclusions.’",
    "internalConflict": "Dr. Finch grapples with guilt over her past decisions and the fear that her secrets will come to light, jeopardizing her career.",
    "personalStakeInCase": "The murder poses a direct threat to her professional life and her standing in the community, making her desperate to keep her past hidden.",
    "paragraphs": [
      "Dr. Mallory Finch had always been the epitome of calm and collected, a trusted physician whose presence brought comfort to the town's elite. Yet, as the news of the murder spread, the façade she had so meticulously maintained began to crack. In the shadows of her composed exterior lay a tumultuous affair with the victim—a secret that could destroy her career and reputation. The thought of her past resurfacing was a nightmare she could scarcely bear.",
      "In her office, surrounded by medical texts and the faint scent of antiseptic, Mallory spoke with a precision that reflected her training. 'We mustn't rush to conclusions,' she often reminded her patients, a mantra that now felt ironic. As she examined the evidence surrounding the murder, her mind raced with the implications of her own involvement. What if her past were to be revealed? The whispers of scandal would echo through the town, and her practice would crumble.",
      "The stakes had never been higher; the very foundation of her career rested on a knife's edge. Mallory had spent years building her reputation, carefully navigating the treacherous waters of small-town politics. Now, with the specter of her affair looming over her, she was left to grapple with the reality of her choices. The fear of exposure gnawed at her, a relentless reminder of the consequences of her actions.",
      "As she moved through the investigation, the tension within her grew. Each interaction with the other suspects felt like a tightrope walk, balancing on the precipice of revelation. Would her past catch up with her? Or could she manipulate the narrative enough to keep her secrets buried? In this dark tale of murder and deceit, Dr. Mallory Finch was not just a victim of circumstance; she was a woman on the brink, fighting to retain her dignity and her life’s work."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale, a retired naval officer, navigates the murky waters of his past as financial troubles and a looming scandal threaten to surface with the murder investigation.",
    "publicPersona": "Stoic and authoritative, known for his patriotic fervor and leadership.",
    "privateSecret": "Hiding a history of gambling debts linked to the victim's family finances.",
    "motiveSeed": "Would have benefited from the victim's death by concealing financial failures linked to past ventures.",
    "motiveStrength": "moderate",
    "alibiWindow": "Claims to have been on the terrace overlooking the sea during the murder.",
    "accessPlausibility": "easy",
    "stakes": "His honor and financial security hang in balance.",
    "humourStyle": "blunt",
    "humourLevel": 0.4,
    "speechMannerisms": "Speaks in a direct, authoritative manner, often using military jargon. His words are clipped and precise, but there's a hint of weariness in his tone.",
    "signatureTic": "‘In the service, we learned to face our challenges head-on.’",
    "internalConflict": "Ivor is torn between his sense of honor and the shame of his financial indiscretions, struggling to reconcile his past with his present.",
    "personalStakeInCase": "The murder investigation could expose his gambling debts, jeopardizing his reputation and financial stability.",
    "paragraphs": [
      "Captain Ivor Hale stood on the terrace, the salty breeze ruffling his hair as he stared out at the tumultuous sea. The waves crashed against the rocks, a fitting metaphor for the storm brewing in his life. A retired naval officer, he had always prided himself on his stoicism, yet the murder of Dr. Mallory Finch had dredged up a past he had tried to bury. His financial troubles, tied to gambling debts, were a secret he had kept from everyone, but now, with the investigation underway, the threat of exposure loomed large.",
      "‘In the service, we learned to face our challenges head-on,’ Ivor often said, but now, he felt the weight of his failures pressing down on him. His reputation as a leader and patriot was at stake, and the thought of being unmasked as a man drowning in debt was unbearable. He had always been the one others looked up to, the stalwart figure in times of crisis. But as the investigation unfolded, he feared that his past would shatter that image.",
      "Ivor's alibi was weak, and while he claimed to have been on the terrace during the murder, the truth was that he had the opportunity to slip away unnoticed. The stakes were high; if the truth came to light, his honor would be tarnished, and his financial security would vanish like a ship lost to the depths. He felt the pressure building, a ticking clock reminding him that time was running out.",
      "As he navigated the murky waters of suspicion, Ivor's blunt demeanor often put others off guard. He spoke with a precision that mirrored his military training, but there was a fatigue in his voice, an acknowledgment of the battles he faced beyond the battlefield. The murder investigation had become not just a matter of justice but a personal reckoning, forcing him to confront the consequences of his past decisions and the man he had become in a post-war world."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill, the charming hotel receptionist, conceals a tumultuous love for the victim that has driven her to the brink of desperation and heartbreak.",
    "publicPersona": "Sweet and accommodating, well-liked by guests, often seen as the face of the hotel.",
    "privateSecret": "Obsessively in love with the victim, but he dismissed her affections publicly.",
    "motiveSeed": "Desperation and heartbreak leading to a violent confrontation.",
    "motiveStrength": "compelling",
    "alibiWindow": "Busy at the front desk, but had access to the victim's room.",
    "accessPlausibility": "possible",
    "stakes": "Her emotional well-being and dignity.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.3,
    "speechMannerisms": "Speaks with an earnest warmth, often punctuating her sentences with nervous laughter. Her tone is often tinged with sadness, revealing her inner turmoil.",
    "signatureTic": "‘I just wanted to make him happy.’",
    "internalConflict": "Beatrice struggles with the pain of unrequited love and the fear that her emotions could lead her down a dark path.",
    "personalStakeInCase": "The murder investigation could expose her feelings and lead to public humiliation, making her desperate to protect her dignity.",
    "paragraphs": [
      "Beatrice Quill stood behind the hotel reception desk, her smile bright yet strained. To the guests, she was the embodiment of hospitality, sweet and accommodating, but beneath that façade lay a heart tormented by unrequited love. Her feelings for the victim, once a source of joy, had spiraled into an obsession, and now, with his murder hanging over the hotel, she felt her world crumbling around her. 'I just wanted to make him happy,' she would often say, a mantra that now felt like a cruel joke.",
      "As she navigated the day-to-day demands of her job, Beatrice found herself lost in memories of the victim's dismissive words, echoing in her mind like a haunting refrain. Her alibi was weak; she had been busy at the front desk during the murder, but her access to the victim's room had been unimpeded. The thought of being implicated in his death filled her with dread, a fear that intertwined with her heartbreak. The stakes were high, and she could feel the weight of her emotions pressing down on her.",
      "Beatrice's self-deprecating humor often surfaced as a defense mechanism, a way to cope with her pain. 'Well, I suppose my love life was never a fairy tale,' she'd joke, but the laughter never reached her eyes. Each interaction with the other suspects felt like a tightrope walk, balancing on the precipice of exposure. Would the truth about her feelings come to light? Or could she bury her heartache deep enough to escape the scrutiny of the investigation?",
      "In this dark narrative of love and loss, Beatrice was more than just a receptionist; she was a woman grappling with the depths of her emotions. The murder investigation had become a crucible, forcing her to confront her feelings and the lengths to which she might go to protect her dignity. As the truth unraveled, Beatrice faced the ultimate question: how far would she go for love, and what would it cost her?"
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "Sylvia Trent, a glamorous socialite, finds herself entangled in a web of deceit as her past threatens to unravel her carefully curated life amidst the murder investigation.",
    "publicPersona": "Glamorous and influential, often organizing social events to maintain a façade of status.",
    "privateSecret": "Was once in financial trouble and is tied to a scandal involving the victim that could resurface.",
    "motiveSeed": "Fear of social ruin if the truth about her financial dealings with the victim comes to light.",
    "motiveStrength": "weak",
    "alibiWindow": "Claims to have been in her room, but could have been elsewhere.",
    "accessPlausibility": "unlikely",
    "stakes": "Maintaining her social standing against potential disgrace.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.4,
    "speechMannerisms": "Speaks with an air of sophistication, often using elaborate vocabulary. Her tone is smooth, but there's an underlying sharpness to her words that hints at her true nature.",
    "signatureTic": "‘One must always keep up appearances.’",
    "internalConflict": "Sylvia grapples with the fear that her past financial troubles will come to light, jeopardizing her social status and self-worth.",
    "personalStakeInCase": "The murder investigation could expose her past, threatening her carefully constructed image and social standing.",
    "paragraphs": [
      "Sylvia Trent glided through the hotel lobby, her presence commanding attention as she effortlessly mingled with the guests. A glamorous socialite, she had built her life around the art of appearances, curating a façade of wealth and sophistication. Yet, beneath that polished exterior lay a turbulent past, one that threatened to unravel with the murder of Dr. Mallory Finch. 'One must always keep up appearances,' she often reminded herself, but as the investigation unfolded, she felt the ground beneath her feet begin to tremble.",
      "With a weak alibi and a history of financial troubles linked to the victim, Sylvia found herself navigating treacherous waters. The fear of social ruin loomed large, a specter haunting her every interaction. Her public persona was a carefully crafted illusion, and the thought of it shattering sent waves of anxiety coursing through her. Each conversation was a potential minefield, and she had to tread carefully to maintain her status among the elite.",
      "Sylvia's polite savagery often emerged in her conversations, a blend of charm and sharp wit that disarmed those around her. Yet, beneath the surface, she was a woman in crisis, grappling with the reality that her past could come back to haunt her. The stakes were high; if the truth about her dealings with the victim surfaced, her carefully constructed world would come crashing down.",
      "As the investigation progressed, Sylvia faced a moral quandary—would she continue to deceive those around her to protect her image, or would she find the courage to confront her past? In this dark tale of ambition and deceit, Sylvia Trent was a woman at a crossroads, caught between the desire for redemption and the fear of exposure."
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "Hugo Vane, an eccentric author, finds his literary ambitions entangled in a murder investigation that threatens his career and integrity.",
    "publicPersona": "Eccentric writer known for his controversial opinions and sharp wit.",
    "privateSecret": "Borrows heavily from the lives of others for his novels, including the victim's life for a new book.",
    "motiveSeed": "Desires to eliminate the victim to avoid a lawsuit for defamation and to keep his research a secret.",
    "motiveStrength": "weak",
    "alibiWindow": "Claimed to be in his room writing, but witnesses say he was seen wandering.",
    "accessPlausibility": "possible",
    "stakes": "His literary career and integrity are at stake.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Speaks in a whimsical, digressive manner, often punctuating his sentences with dry humor and sarcasm. His tone is lively, reflecting his creative spirit.",
    "signatureTic": "‘Ah, the absurdity of existence!’",
    "internalConflict": "Hugo grapples with the morality of using others' lives for his art, fearing the consequences of his actions could lead to ruin.",
    "personalStakeInCase": "The investigation threatens to expose his literary theft, jeopardizing his career and reputation as an author.",
    "paragraphs": [
      "Hugo Vane was a man of words, a writer whose eccentricities often overshadowed his talent. As he wandered the hotel grounds, he could feel the weight of the murder investigation pressing down on him like a heavy tome. An author known for borrowing heavily from the lives of others, he had drawn inspiration from the victim, and now, with suspicion swirling around him, he feared the consequences of his literary theft. 'Ah, the absurdity of existence!' he would exclaim, but the truth was that his creative process had landed him in a precarious position.",
      "With a weak alibi and witnesses claiming to have seen him wandering aimlessly, Hugo knew his credibility was on the line. The stakes were high; a defamation lawsuit from the victim's family could spell disaster for his career. Each interaction with the other suspects felt like a dance upon a tightrope, balancing his need to protect his secrets with the inevitable fallout of discovery. He often resorted to sardonic humor to mask his anxiety, using wit as a shield against the looming threat of exposure.",
      "His speech was whimsical and digressive, a reflection of his artistic spirit. Hugo's sardonic humor often revealed the absurdity he saw in life, but beneath the surface lay a profound conflict. He wrestled with the morality of his actions, questioning whether the ends truly justified the means. Could he continue to thrive as a writer while exploiting the lives of others? The investigation had become a mirror, forcing him to confront the darker aspects of his ambition.",
      "As the investigation unfolded, Hugo found himself at a crossroads—would he cling to his literary ambitions at any cost, or would he find the courage to confront his own ethical dilemmas? In this dark narrative of murder and deceit, Hugo Vane was not just a suspect; he was a man grappling with the consequences of his choices, navigating a world where the line between fiction and reality blurred dangerously."
    ],
    "order": 6
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "The Tidal Trap Hotel",
    "type": "hotel",
    "place": "Brighton",
    "country": "England",
    "summary": "A grand Art Deco hotel perched precariously on the cliffs of Brighton, the Tidal Trap Hotel is both a sanctuary and a potential trap for its guests.",
    "visualDescription": "Stunning white façade with geometric patterns, glass-fronted lobby revealing polished marble floors, and striking chandeliers casting reflections on the walls. The ocean looms nearby, its waves crashing against the cliffs below.",
    "atmosphere": "A blend of opulence and foreboding, the air thick with secrets and impending dread.",
    "paragraphs": [
      "The Tidal Trap Hotel stands proudly against the tumultuous backdrop of the English Channel, its Art Deco lines sharp against an overcast sky. The grand lobby, with its gleaming marble floors and sweeping staircase, offers an inviting entrance, yet the hushed whispers of guests hint at the tension lurking beneath the surface. With the ocean's roar echoing in the distance, the hotel seems to hold its breath, as if anticipating the storm to come.",
      "Inside, the dining areas boast rich tapestries and polished wood, yet the scent of salt and dampness seeps in from the ocean. Staff scurry about, their footsteps muted on the plush carpets, while the faint crackle of a radio plays in the background, broadcasting news of the war still raging beyond the horizon. Each guest is ensconced in their own world, but the shared unease is palpable, a collective anxiety that hangs in the air like fog.",
      "As evening approaches, the atmosphere thickens with a sense of foreboding. The once-vibrant conversations grow quieter, shadows lengthening as the light dims. Guests huddle in their corners, stealing glances towards the sea, where the waves crash with a ferocity that mirrors their own rising dread. The hotel, with its beauty and charm, becomes a gilded cage, each room a potential hiding place for unspeakable secrets."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "Overcast with intermittent rain, typical of a coastal climate in the fall",
    "timeFlow": "Days filled with tension, each moment steeped in uncertainty",
    "mood": "Tense and suspenseful, with a sense of impending revelation",
    "eraMarkers": [
      "Art Deco architectural elements",
      "Radio broadcasts filling the air",
      "Rationed fuel impacting travel",
      "Military presence in the area"
    ],
    "sensoryPalette": {
      "dominant": "The sharp scent of salt and dampness",
      "secondary": [
        "Warmth of polished wood and leather",
        "A hint of smoke from distant fires"
      ]
    },
    "paragraphs": [
      "The atmosphere in Brighton is thick with anticipation, the air heavy with the scent of the sea mixed with the damp earth. Overhead, the clouds loom like a shroud, casting a pall over the vibrant town. The rhythmic crashing of waves against the cliffs serves as a constant reminder of the hotel’s precarious position, both physically and metaphorically. Guests, wrapped in their own worries, move through the halls with a sense of urgency, their footsteps echoing in the quiet spaces.",
      "As the day drags on, the tension within the hotel simmers just below the surface. Conversations fade into whispers, punctuated by sudden laughter that quickly dies out. The flickering lights cast dancing shadows on the walls, creating an unsettling ambiance. Outside, the weather mirrors the emotional landscape; gusts of wind whip up salty spray that dampens the hotel’s pristine façade, while the distant rumble of thunder hints at the storm brewing both in the sky and among the guests."
    ]
  },
  "keyLocations": [
    {
      "id": "grand_lobby",
      "name": "Grand Lobby",
      "type": "interior",
      "purpose": "Gathering space for guests",
      "visualDetails": "Spacious atrium with high ceilings, Art Deco chandeliers, and marble floors reflecting the soft glow of lights.",
      "sensoryDetails": {
        "sights": [
          "gleaming marble floors",
          "geometric Art Deco patterns",
          "tall potted palms",
          "ornate chandeliers casting light",
          "large windows framing the ocean"
        ],
        "sounds": [
          "murmurs of conversation",
          "footsteps on polished stone",
          "clinking of glasses",
          "the crackle of a nearby radio",
          "the distant roar of waves"
        ],
        "smells": [
          "freshly polished wood",
          "faint perfume and cologne",
          "salt air wafting in",
          "warmth of baking bread",
          "damp fabric from the ocean mist"
        ],
        "tactile": [
          "smooth marble underfoot",
          "cool metal of handrails",
          "softness of plush seating",
          "warmth of sunlight through glass",
          "chill breeze from open windows"
        ]
      },
      "accessControl": "Open to all guests, but restricted access to staff-only areas behind the reception desk.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops streaking the windows",
            "grey light filtering through clouds",
            "damp footprints on marble",
            "shadows of guests in the lobby",
            "mist rolling in from the sea"
          ],
          "sounds": [
            "steady drumming of rain",
            "soft laughter echoing",
            "water trickling from eaves",
            "the distant toll of a bell",
            "the hum of a heater"
          ],
          "smells": [
            "damp earth and stone",
            "freshly brewed coffee",
            "wet fabric from umbrellas",
            "scent of seaweed on the breeze",
            "mildew from old wood"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat grey light in the lobby",
            "shadows creeping across the floor",
            "glossy surfaces reflecting dim light",
            "ghostly outlines of guests",
            "clouds hanging low outside"
          ],
          "sounds": [
            "silence broken by a distant clock",
            "the creak of old floorboards",
            "soft whispers in corners",
            "the rustle of newspaper pages",
            "the intermittent buzz of conversation"
          ],
          "smells": [
            "dust and old leather",
            "the scent of disinfectant",
            "faint whiff of tobacco",
            "cooked seafood from the kitchen",
            "lingering scent of rain"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "soft candlelight flickering",
            "long shadows across the floor",
            "golden glow of lamps",
            "silhouettes of guests against windows",
            "stars beginning to twinkle outside"
          ],
          "sounds": [
            "the tick of a mantel clock",
            "laughter rising and falling",
            "the clinking of silverware",
            "the distant sound of waves crashing",
            "soft music from a gramophone"
          ],
          "smells": [
            "candle wax melting",
            "rich aroma of dinner dishes",
            "freshly polished wood",
            "the scent of jasmine from outside",
            "the warm smell of baked goods"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Grand Lobby serves as the heart of the Tidal Trap Hotel, a spacious area adorned with Art Deco elegance. Guests gather here, their laughter and whispers blending with the sound of the ocean pounding against the cliffs. The marble floors shine under the glow of ornate chandeliers, while tall potted palms sway gently in the sea breeze that slips through the open windows. Yet, beneath the glitz, a palpable tension hangs in the air, each guest acutely aware of the shadows that lurk just beyond their sight.",
        "As the day wears on, the atmosphere shifts. The once-vibrant conversations turn into muted exchanges, punctuated by the faint crackling of the radio broadcasting news from afar. The drumming of rain against the window adds to the sense of urgency, as if the elements themselves conspire to trap them within the hotel's walls. Each person feels the weight of unseen eyes, the overwhelming feeling that the hotel is not just a refuge but a stage for secrets waiting to unfold."
      ]
    },
    {
      "id": "dining_area",
      "name": "Dining Area",
      "type": "interior",
      "purpose": "Clue discovery and social interaction",
      "visualDetails": "Elegantly set tables with starched white linens, polished silverware, and a grand view of the ocean through large windows.",
      "sensoryDetails": {
        "sights": [
          "gleaming silverware on crisp linen",
          "colorful floral centerpieces",
          "steam rising from covered dishes",
          "ocean waves crashing outside",
          "flickering candlelight casting shadows"
        ],
        "sounds": [
          "clinking of plates and glasses",
          "distant laughter and conversation",
          "soft strains of classical music",
          "the rustle of napkins",
          "the hum of kitchen activity"
        ],
        "smells": [
          "savory aromas of roasted meats",
          "freshly baked bread",
          "scent of rich sauces simmering",
          "the sweetness of dessert pastries",
          "salt air mingling with cooking scents"
        ],
        "tactile": [
          "smoothness of fine china",
          "weight of silverware in hand",
          "warmth of freshly baked bread",
          "crispness of starched linens",
          "cool glass of water"
        ]
      },
      "accessControl": "Open to all guests during dining hours; staff-only access to kitchen areas.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops on windowpanes",
            "dim light filtering through clouds",
            "puddles forming outside",
            "empty tables awaiting guests",
            "steam rising from hot coffee"
          ],
          "sounds": [
            "soft patter of rain",
            "clinking of utensils on plates",
            "murmurs of early risers",
            "the hiss of the coffee machine",
            "the distant thud of waves"
          ],
          "smells": [
            "freshly brewed coffee",
            "the scent of wet earth",
            "warmth of baked pastries",
            "dampness in the air",
            "the aroma of breakfast dishes"
          ],
          "mood": "quiet contemplation"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "grey light filtering through clouds",
            "the shimmer of water droplets",
            "empty plates on tables",
            "shadows creeping across the floor",
            "the ocean churning outside"
          ],
          "sounds": [
            "the soft murmur of conversation",
            "the clinking of glasses",
            "the rustle of newspapers",
            "the distant sound of waves crashing",
            "the hum of the kitchen"
          ],
          "smells": [
            "the scent of grilled fish",
            "freshly sliced vegetables",
            "the aroma of herbs",
            "the warmth of bread rolls",
            "the tang of salt in the air"
          ],
          "mood": "melancholic reflection"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight illuminating tables",
            "guests in evening attire",
            "the sun setting over the ocean",
            "glimmer of silverware",
            "the twinkle of stars outside"
          ],
          "sounds": [
            "laughter ringing out",
            "the clinking of glasses raised in toast",
            "the soft strains of a string quartet",
            "the sound of waves lapping at the shore",
            "the rustle of evening dresses"
          ],
          "smells": [
            "the fragrant aroma of grilled meats",
            "the sweetness of dessert wines",
            "the scent of fresh herbs",
            "the warmth of baked goods",
            "the salty breeze from the ocean"
          ],
          "mood": "festive celebration"
        }
      ],
      "paragraphs": [
        "The Dining Area of the Tidal Trap Hotel is a culinary oasis, where guests gather to share meals and secrets alike. Elegantly set tables invite diners to indulge in sumptuous offerings while gazing out at the crashing waves below. As the sun dips low in the sky, the ambiance shifts; the flickering candlelight casts elongated shadows that dance across the walls, echoing the unspoken tensions simmering just beneath the surface. With each course served, the atmosphere thickens, laden with the weight of unsaid words and hidden glances.",
        "Conversations rise and fall like the tide outside, punctuated by laughter and the occasional clink of silverware. Yet, amidst the festive cheer, an undercurrent of anxiety weaves through the room. The aroma of roasted meats mingles with the salty sea air, creating an intoxicating blend that draws guests closer while simultaneously pushing them apart. As they share their meals, each bite carries the taste of uncertainty, as if the very food they consume may hold the answers to the mysteries that plague them."
      ]
    },
    {
      "id": "guest_rooms",
      "name": "Guest Rooms",
      "type": "interior",
      "purpose": "Private spaces for guests, potential hiding places for clues",
      "visualDetails": "Individually decorated with vintage furnishings, plush bedding, and large windows overlooking the sea.",
      "sensoryDetails": {
        "sights": [
          "vintage wallpaper with floral patterns",
          "heavy drapes framing the windows",
          "ornate wooden furniture",
          "soft lighting from bedside lamps",
          "the ocean glimmering in the distance"
        ],
        "sounds": [
          "the distant crash of waves",
          "whispers of conversations from the hallway",
          "the creak of floorboards",
          "the rustle of sheets",
          "the ticking of a clock"
        ],
        "smells": [
          "the scent of fresh linens",
          "the mustiness of old wood",
          "the aroma of perfume lingering",
          "the faint smell of sea salt",
          "the warmth of candle wax"
        ],
        "tactile": [
          "softness of plush bedding",
          "coolness of marble-topped tables",
          "the weight of a heavy blanket",
          "the smoothness of wooden surfaces",
          "the chill of the sea breeze through the window"
        ]
      },
      "accessControl": "Access limited to registered guests; staff can only enter during cleaning hours.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light filtering through heavy drapes",
            "rain streaking down the window",
            "puddles forming outside",
            "the room dim with cloud cover",
            "the bed unmade in the early light"
          ],
          "sounds": [
            "steady patter of rain",
            "the rustle of sheets",
            "soft murmurs from neighboring rooms",
            "the creak of old furniture",
            "the sound of water dripping"
          ],
          "smells": [
            "dampness in the air",
            "the scent of wet earth",
            "the freshness of linens",
            "the aroma of coffee brewing nearby",
            "the musty smell of old wood"
          ],
          "mood": "introspective solitude"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows falling across the room",
            "the ocean churning outside",
            "the flicker of candlelight",
            "the room dimmed by cloud cover",
            "the bed inviting yet untouched"
          ],
          "sounds": [
            "the distant crash of waves",
            "soft whispers in the hallway",
            "the ticking of a clock",
            "the flutter of a newspaper",
            "the rustling of fabric"
          ],
          "smells": [
            "the scent of old books",
            "the aroma of fresh linens",
            "the faint smell of tobacco",
            "the mustiness of closed windows",
            "the hint of salt in the air"
          ],
          "mood": "melancholic reflection"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "golden light streaming through windows",
            "the ocean sparkling in the moonlight",
            "the soft glow of bedside lamps",
            "the bed inviting for rest"
          ],
          "sounds": [
            "the soft crash of waves",
            "laughter from the hallway",
            "the ticking of a clock",
            "the rustle of sheets",
            "the distant sound of music"
          ],
          "smells": [
            "the scent of fresh linens",
            "the warmth of candle wax",
            "the faint aroma of perfume",
            "the salty breeze from the ocean",
            "the earthy smell of wood"
          ],
          "mood": "calm contemplation"
        }
      ],
      "paragraphs": [
        "The Guest Rooms of the Tidal Trap Hotel are sanctuaries of privacy, each one uniquely decorated to reflect the tastes of its occupants. Heavy drapes frame the windows, blocking out the outside world while inviting in the sounds of the crashing waves. The air is thick with the scent of fresh linens and a hint of sea salt, creating a soothing yet charged atmosphere. Each room offers a glimpse of the ocean, a reminder of both beauty and danger, as guests retreat into their personal spaces to wrestle with their thoughts.",
        "As night descends, the rooms transform into intimate refuges, where secrets can be kept or revealed. The soft lighting casts gentle shadows, creating an ambiance of warmth and safety, yet the distant echoes of laughter and conversation from the hallway serve as a reminder that the world outside is still very much alive. Here, in these rooms, the weight of the outside world presses against the walls, and every creak of the floorboards seems to whisper of the mysteries yet to unfold."
      ]
    },
    {
      "id": "oceanfront_balcony",
      "name": "Oceanfront Balcony",
      "type": "exterior",
      "purpose": "Potential escape route or place for clandestine meetings",
      "visualDetails": "A narrow balcony with wrought-iron railings, overlooking the churning sea, offering a breathtaking yet perilous view.",
      "sensoryDetails": {
        "sights": [
          "turbulent waves crashing against cliffs",
          "dark clouds swirling overhead",
          "seagulls wheeling in the wind",
          "the horizon fading into mist",
          "the distant lighthouse blinking"
        ],
        "sounds": [
          "roaring waves crashing",
          "howling wind whipping past",
          "the call of seagulls",
          "the creaking of the balcony",
          "the distant sound of thunder"
        ],
        "smells": [
          "salty sea air",
          "the scent of damp stone",
          "the freshness of rain",
          "the hint of seaweed",
          "the earthy smell of wet soil"
        ],
        "tactile": [
          "cold metal of railings",
          "the chill of the ocean breeze",
          "the rough texture of stone",
          "the dampness of rain on skin",
          "the sway of the balcony in the wind"
        ]
      },
      "accessControl": "Accessible to all guests, but limited to daylight hours for safety.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey mist rolling over the sea",
            "raindrops splattering on the railing",
            "puddles forming on the balcony",
            "the ocean churning violently",
            "dim light filtering through clouds"
          ],
          "sounds": [
            "steady patter of rain",
            "the roar of waves crashing",
            "the wind howling",
            "the rustle of wet leaves",
            "the distant rumble of thunder"
          ],
          "smells": [
            "freshly fallen rain",
            "the scent of wet stone",
            "the briny aroma of the sea",
            "the earthy smell of damp soil",
            "the sharpness of ozone"
          ],
          "mood": "foreboding tension"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dark clouds hanging low",
            "the ocean a slate-grey expanse",
            "the distant outline of a fishing boat",
            "waves crashing against the rocks",
            "the horizon blurred by mist"
          ],
          "sounds": [
            "the crash of waves against the cliffs",
            "the wind whipping through the railings",
            "the distant call of seagulls",
            "the creaking of the balcony underfoot",
            "the muffled roar of the ocean"
          ],
          "smells": [
            "the saltiness of the sea",
            "the freshness of the wind",
            "the dampness of the air",
            "the scent of seaweed",
            "the aroma of wet sand"
          ],
          "mood": "introspective unease"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "sunset painting the sky in orange",
            "the ocean shimmering in twilight",
            "stars beginning to emerge",
            "the silhouette of the lighthouse",
            "the last light fading from the horizon"
          ],
          "sounds": [
            "gentle lapping of waves",
            "the distant call of a foghorn",
            "the whisper of the wind",
            "the rustle of evening attire",
            "the soft laughter of guests"
          ],
          "smells": [
            "the sweet scent of evening blooms",
            "the lingering salt of the ocean",
            "the freshness of the night air",
            "the hint of smoke from distant fires",
            "the aroma of seafood from nearby kitchens"
          ],
          "mood": "romantic serenity"
        }
      ],
      "paragraphs": [
        "The Oceanfront Balcony of the Tidal Trap Hotel offers breathtaking views of the tumultuous sea, a narrow perch that feels both exhilarating and precarious. The wrought-iron railings provide a semblance of safety as guests lean over to watch the waves crash against the cliffs below. Here, the salty breeze mingles with the scent of damp stone, creating an intoxicating atmosphere that draws people outside to share secrets or contemplate their next move. Yet, the balcony also serves as a reminder of the hotel’s isolation, the vast ocean surrounding it like a trap.",
        "As evening falls, the balcony transforms into a place of clandestine meetings and whispered conversations. The sound of waves lapping against the rocks below creates a rhythm that both soothes and unnerves. Under the vast expanse of the darkening sky, guests find themselves drawn into the mysteries of the night, their shadows merging with the encroaching darkness. The last light of day fades, leaving behind a sense of longing and possibility, as the ocean's roar becomes a backdrop to their secrets."
      ]
    }
  ],
  "note": "",
  "cost": 0.0031098903000000002,
  "durationMs": 66162
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1949,
    "month": "September",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "fall",
    "month": "September",
    "weather": [
      "overcast skies",
      "intermittent rain showers",
      "cool breezes from the coast"
    ],
    "daylight": "Days are shortening, with daylight fading by 7:30 PM, casting a gray hue over the landscape.",
    "time_of_day_of_crime": "Late evening — between eight and ten at night, just after dinner service.",
    "holidays": [
      "Labor Day (first Monday of September)"
    ],
    "seasonalActivities": [
      "visiting local fall fairs",
      "harvesting apples at orchards",
      "taking evening strolls along the coast"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "double-breasted navy suit",
        "crisp white dress shirt",
        "silk tie with geometric patterns"
      ],
      "casual": [
        "tweed sports jacket",
        "khaki slacks",
        "button-up flannel shirt"
      ],
      "accessories": [
        "fedora hat",
        "leather gloves",
        "silver cufflinks"
      ]
    },
    "womensWear": {
      "formal": [
        "tea-length floral dress",
        "tailored blazer",
        "pearl necklace"
      ],
      "casual": [
        "ankle-length skirt",
        "blouse with puffed sleeves",
        "cardigan sweater"
      ],
      "accessories": [
        "wide-brimmed hat",
        "silk scarf",
        "string of pearls"
      ]
    },
    "trendsOfTheMoment": [
      "emphasis on tailored fits",
      "use of bold patterns and colors",
      "advent of synthetic fabrics like nylon"
    ],
    "socialExpectations": [
      "adherence to gender roles in the workplace",
      "emphasis on modesty in women's fashion",
      "importance of social etiquette in public spaces"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "The United States is solidifying its position in the Cold War",
      "The first issue of 'The Saturday Evening Post' after WWII features a cover by Norman Rockwell",
      "The United Nations is addressing issues of refugee resettlement"
    ],
    "politicalClimate": "A tense atmosphere as the world grapples with the aftermath of WWII, with growing fears of communism influencing domestic policy.",
    "economicConditions": "The economy is recovering but still feels the effects of post-war adjustments, with inflation beginning to creep into the cost of living.",
    "socialIssues": [
      "the role of returning veterans in society",
      "gender equality debates as women continue to enter the workforce",
      "racial tensions in urban areas"
    ],
    "internationalNews": [
      "The Berlin Airlift has concluded successfully",
      "Civil unrest in Greece as the government struggles with leftist insurgents"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "'The Tennessee Waltz' by Patti Page",
        "'Cry' by Johnnie Ray",
        "'Aba Daba Honeymoon' by Debbie Reynolds and Carleton Carpenter"
      ],
      "films": [
        "'All the King's Men'",
        "'The Third Man'",
        "'East Side, West Side'"
      ],
      "theater": [
        "'Death of a Salesman' by Arthur Miller",
        "'The Glass Menagerie' by Tennessee Williams"
      ],
      "radio": [
        "'Suspense' radio program",
        "'The Jack Benny Program'",
        "'The Adventures of Sam Spade'"
      ]
    },
    "literature": {
      "recentPublications": [
        "'The Catcher in the Rye' by J.D. Salinger",
        "'1984' by George Orwell",
        "'The Old Man and the Sea' by Ernest Hemingway"
      ],
      "popularGenres": [
        "mystery",
        "thriller",
        "post-war fiction"
      ]
    },
    "technology": {
      "recentInventions": [
        "the transistor radio",
        "the first commercially available microwave oven",
        "early models of the television set"
      ],
      "commonDevices": [
        "manual typewriters",
        "film cameras",
        "phonographs"
      ],
      "emergingTrends": [
        "the rise of suburban living",
        "increased use of plastics in household items",
        "the beginning of consumer culture with the expansion of credit"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Movie ticket: one shilling",
        "Bottle of milk: one shilling"
      ],
      "commonActivities": [
        "attending local community events",
        "reading in cafes",
        "taking weekend road trips"
      ],
      "socialRituals": [
        "Sunday family dinners",
        "weekly bingo nights at the local hall"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "growing middle class aspirations",
      "traditional class distinctions still prevalent"
    ],
    "gender": [
      "expectation for women to maintain traditional roles despite workforce participation",
      "increasing acceptance of women's independence"
    ],
    "race": [
      "racial segregation in many areas remains a contentious issue",
      "growing awareness and activism for civil rights"
    ],
    "generalNorms": [
      "emphasis on community and family values",
      "politeness and decorum are expected in social interactions",
      "charity and volunteerism are viewed positively"
    ]
  },
  "atmosphericDetails": [
    "The scent of wet earth hangs in the air, mixed with the briny tang from the nearby ocean, creating an unsettling atmosphere.",
    "The sound of rain tapping against the hotel windows harmonizes with distant thunder, amplifying the tension of the unfolding mystery.",
    "Dim light from the hotel lobby casts long shadows, creating an eerie ambiance as guests whisper behind closed doors."
  ],
  "paragraphs": [
    "In September 1949, the coastal town is cloaked in a thick blanket of overcast skies, with sporadic rain showers that create a rhythmic patter against the windows of the old hotel. The air carries a crispness that signals the arrival of fall, a time when locals gather for annual fairs and harvest festivals. The fading daylight casts a muted glow, with darkness encroaching by 7:30 PM, and the guests of the hotel find themselves drawn into the shadows of the evening, where secrets lurk just beyond sight.",
    "Fashion in this period reflects a post-war desire for both elegance and practicality. Men don tailored suits with sharp cuts, opting for double-breasted navy styles paired with crisp white shirts and silk ties, while women embrace tea-length dresses adorned with floral patterns, often complemented by a tailored blazer and pearls. As the rain continues outside, the hotel’s dining room buzzes with guests dressed in their best, the clinking of glasses and soft melodies from the radio creating an atmosphere that is both celebratory and tense, a stark contrast to the storms brewing outside.",
    "Life in this time is marked by a blend of recovery and apprehension. As the world adjusts to the post-war reality, families engage in social rituals like Sunday dinners and community bingo nights, while also grappling with the changes brought by returning veterans and women stepping into new roles in the workforce. Prices remain reasonable, with a loaf of bread costing four pence and a cinema ticket just a shilling. Yet, beneath the surface of daily life lies an undercurrent of tension, with social issues simmering just below the calm façade of the coastal community, setting the stage for a mystery waiting to unfold."
  ],
  "note": "",
  "cost": 0.00105674745,
  "durationMs": 19345
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A gathering at a seaside hotel for a post-war reunion forces a diverse group of guests and staff to confront their shared traumas while navigating the complexities of class and gender dynamics in a changing world.",
  "era": {
    "decade": "1940s",
    "socialStructure": "The aftermath of WWII has reshaped social hierarchies, with women entering the workforce and class tensions rising as communities grapple with loss and recovery."
  },
  "setting": {
    "location": "A large seaside hotel with Art Deco architecture",
    "institution": "hotel",
    "weather": "Overcast with intermittent rain, typical of a coastal climate in the fall"
  },
  "castAnchors": [
    "Eleanor Voss",
    "Dr. Mallory Finch",
    "Captain Ivor Hale",
    "Beatrice Quill",
    "Sylvia Trent",
    "Hugo Vane"
  ],
  "theme": "Golden Age murder driven by a tidal-drowning method, where the flood-tide timetable and shifting sea level fix — and falsify — the window in which the victim could have drowned."
}

### LOCKED_FACTS
[
  {
    "id": "high_tide_time",
    "value": "half past eleven",
    "description": "The time of high tide on the night of the murder."
  },
  {
    "id": "victim_watch_time",
    "value": "twenty minutes past eleven",
    "description": "The time at which the victim's watch stopped."
  },
  {
    "id": "last_seen_time",
    "value": "a quarter to eleven",
    "description": "The last time the victim was seen alive by witnesses."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 17,
  "countsByPlacement": {
    "early": 4,
    "mid": 12,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 16,
    "optional": 1
  },
  "redHerringCount": 0,
  "clues": [
    {
      "id": "clue_mechanism_visibility_core",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_core_contradiction_chain",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_3",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_4",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_5",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_6",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_7",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_8",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_9",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_10",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_11",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
    },
    {
      "id": "clue_culprit_direct_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_culprit_direct_captain_ivor_hale",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_early_1",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_mid_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_late_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_late_optional_slot_1",
      "placement": "late",
      "criticality": "optional",
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

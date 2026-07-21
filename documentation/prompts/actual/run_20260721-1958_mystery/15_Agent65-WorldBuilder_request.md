# Actual Prompt Record

- Run ID: `mystery-1784663896191`
- Project ID: ``
- Timestamp: `2026-07-21T20:02:43.424Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `c8dd30c7946528a4`

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
    "title": "The Stopped Pendulum",
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
      "subtype": "mechanical tampering"
    }
  },
  "death_method": "struck with a heavy object",
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "Detective",
      "relationships": [],
      "public_persona": "An astute investigator",
      "private_secret": "Has a past connection to the victim",
      "motive_seed": "Unresolved feelings",
      "motive_strength": "moderate",
      "alibi_window": "None",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Desire for closure",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "35-45",
      "role_archetype": "Medical professional",
      "relationships": [],
      "public_persona": "Respected physician",
      "private_secret": "Had a rivalry with the victim",
      "motive_seed": "Professional jealousy",
      "motive_strength": "moderate",
      "alibi_window": "10:00 PM - 10:30 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "40-50",
      "role_archetype": "Military officer",
      "relationships": [],
      "public_persona": "Charming and authoritative",
      "private_secret": "Knew the victim from the war",
      "motive_seed": "A past grievance",
      "motive_strength": "weak",
      "alibi_window": "10:00 PM - 10:30 PM",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Honor",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "25-35",
      "role_archetype": "Hotel staff",
      "relationships": [],
      "public_persona": "Friendly and helpful",
      "private_secret": "Has a crush on the victim",
      "motive_seed": "Unrequited love",
      "motive_strength": "weak",
      "alibi_window": "10:00 PM - 10:30 PM",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Emotional turmoil",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "30-40",
      "role_archetype": "Socialite",
      "relationships": [],
      "public_persona": "Wealthy and influential",
      "private_secret": "Had a feud with the victim",
      "motive_seed": "Financial rivalry",
      "motive_strength": "moderate",
      "alibi_window": "10:00 PM - 10:30 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Business interests",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "30-40",
      "role_archetype": "victim",
      "relationships": [],
      "public_persona": "Charming businessman",
      "private_secret": "Involved in shady dealings",
      "motive_seed": "N/A",
      "motive_strength": "N/A",
      "alibi_window": "N/A",
      "access_plausibility": "N/A",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "N/A",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "male"
    }
  ],
  "culpability": {
    "culprit_count": 1,
    "culprits": [
      "Dr. Mallory Finch"
    ]
  },
  "surface_model": {
    "narrative": {
      "summary": "During a stormy night at a seaside hotel, Hugo Vane is found dead, and the investigation reveals that the time of death was manipulated by tampering with a grandfather clock."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "The pendulum of the grandfather clock was stopped to create a false timeline of Hugo's death.",
      "delivery_path": [
        {
          "step": "The murderer stopped the pendulum just before the act."
        },
        {
          "step": "Witnesses were misled by the clock's incorrect time."
        }
      ]
    },
    "outcome": {
      "result": "The false timeline concealed the true time of death."
    }
  },
  "false_assumption": {
    "statement": "The murder occurred at the time indicated by the grandfather clock.",
    "type": "temporal",
    "why_it_seems_reasonable": "Witnesses corroborated the time shown on the clock.",
    "what_it_hides": "The clock was tampered with to mislead the investigation."
  },
  "false_solution": {
    "accused_suspect": "Captain Ivor Hale",
    "supporting_points": [
      "Captain Hale was seen arguing with Hugo earlier in the evening.",
      "Witnesses claim they saw him near the clock just before the murder."
    ],
    "the_one_flaw": "The clock was stopped, indicating the time of death was manipulated.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "Witnesses reported seeing Captain Hale near the clock.",
      "points_at_suspect": "Captain Ivor Hale",
      "innocent_explanation": "He was simply checking the time before leaving for dinner.",
      "resolved_in_chapter": 7
    },
    {
      "id": "red_herring_2",
      "description": "Dr. Finch's rivalry with the victim was well-known.",
      "points_at_suspect": "Dr. Mallory Finch",
      "innocent_explanation": "Their rivalry was purely professional and had not escalated to violence.",
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
    "rationale": "All suspects were present at the hotel during the murder."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "The clock was last seen working at 9:45 PM.",
        "Hugo was last seen at the gala at 10:00 PM."
      ],
      "windows": [
        "The murder window is between 10:00 PM and 10:30 PM."
      ],
      "contradictions": [
        "Witnesses state Hugo was alive at 10:00 PM, but the clock shows a different time."
      ]
    },
    "access": {
      "actors": [
        "Dr. Mallory Finch",
        "Captain Ivor Hale"
      ],
      "objects": [
        "Grandfather clock"
      ],
      "permissions": [
        "Access to the hotel staff area for tampering"
      ]
    },
    "physical": {
      "laws": [
        "The pendulum's movement can be stopped manually."
      ],
      "traces": [
        "Dust on the clock indicates it hadn't been touched recently."
      ]
    },
    "social": {
      "trust_channels": [
        "Witness testimonies were trusted without verification."
      ],
      "authority_sources": [
        "The hotel manager's logbook was assumed to be accurate."
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The grandfather clock in the lobby shows a time of ten minutes past ten.",
        "correction": "This contradicts witness statements claiming Hugo was alive at ten o'clock.",
        "effect": "Narrows the murder window to before ten minutes past ten.",
        "required_evidence": [
          "Witness statements claiming Hugo was seen alive at ten o'clock.",
          "The grandfather clock showing ten minutes past ten."
        ],
        "reader_observable": true
      },
      {
        "observation": "The clock's pendulum has dust on it, indicating it hasn't been moved recently.",
        "correction": "The clock was tampered with to create a false time.",
        "effect": "Eliminates the possibility that the clock was accurate at the time of death.",
        "required_evidence": [
          "Dust on the clock's pendulum.",
          "Witness statements about the clock's last known working time."
        ],
        "reader_observable": true
      },
      {
        "observation": "A loose gear is found near the grandfather clock.",
        "correction": "The gear indicates tampering with the clock's mechanism.",
        "effect": "Eliminates Dr. Mallory Finch as the culprit, as she lacks clock-tampering skills.",
        "required_evidence": [
          "The loose gear found near the clock.",
          "Dr. Mallory Finch's lack of mechanical skills."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "A controlled comparison of the clock's pendulum motion is staged to reveal inconsistencies.",
    "knowledge_revealed": "The clock's pendulum shows signs of recent tampering, proving the time was manipulated.",
    "pass_condition": "If the pendulum's movement is inconsistent with the time of death.",
    "evidence_clues": [
      "clue_4",
      "clue_11",
      "clue_3"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The grandfather clock's time (early) and witness statements (mid) reveal the time conflict. Step 2: The dust on the pendulum (mid) indicates tampering. Step 3: The loose gear (discriminating test) confirms mechanical interference."
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
      "test_type": "mechanical comparison"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Proving he was checking the time, not tampering.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Her infatuation does not equate to murder.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: 10:00 PM - 10:30 PM",
        "supporting_clues": []
      },
      {
        "suspect_name": "Hugo Vane",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: N/A",
        "supporting_clues": []
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with evidence."
    },
    "identity_rules": [],
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
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_3",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_4",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_7",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_culprit_direct_dr_mallory_finch",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_early_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_mid_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_5",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_6",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_11",
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
        "clue_id": "clue_9",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_culprit_direct_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_fp_contradiction_step_3",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_late_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Controlled comparison"
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "A local journalist with a penchant for uncovering truths, Eleanor is charming yet plagued by her past experiences from the war.",
    "publicPersona": "Charming and inquisitive, known for her sharp articles and keen observations.",
    "privateSecret": "Hides her struggles with mental health issues stemming from her war experiences.",
    "motiveSeed": "Eleanor was invited to the hotel for a writing retreat.",
    "motiveStrength": "weak",
    "alibiWindow": "was in the hotel lobby conducting interviews at the time of the murder",
    "accessPlausibility": "easy",
    "stakes": "Desires to prove herself as a credible journalist.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with a measured cadence, often punctuating her observations with a wry smile. She has a tendency to ask rhetorical questions, which she answers herself with an ironic twist.",
    "signatureTic": "“Truth is a slippery fish.”",
    "internalConflict": "Battles self-doubt and the haunting memories of her wartime experiences, which threaten to undermine her confidence.",
    "personalStakeInCase": "Eleanor's credibility as a journalist hangs in the balance; solving the case could elevate her career and silence her inner demons.",
    "paragraphs": [
      "Eleanor Voss stepped into the lobby of the seaside hotel, her heart racing with the thrill of the unknown. As a local journalist, she had always been drawn to stories that whispered of secrets and intrigue. The invitation to this writing retreat was a lifeline, a chance to reclaim her voice after the cacophony of war had stolen it. But the murder of Hugo Vane cast a shadow over her aspirations, forcing her to confront not only the dark underbelly of the guests but also the specters of her past.",
      "With an inquisitive gleam in her eyes, Eleanor approached the guests with a charming smile, her sharp wit often disarming them. She had a knack for making others reveal more than they intended, a skill honed through years of reporting. Yet beneath her polished exterior lay a tumultuous sea of anxiety. The war had left her with more than just physical scars; it had etched deep grooves of doubt into her psyche. Every article she penned felt like a tightrope walk over an abyss, and the stakes had never felt higher.",
      "As she conducted interviews in the hotel lobby, Eleanor’s mind raced with the possibilities of the case. She adored the thrill of investigation, yet the weight of her mental health struggles loomed like a dark cloud. Each interaction was a balancing act, as she fought to maintain her composure while the ghosts of her past whispered insidiously in her ear. The thought of exposing the truth behind Hugo's murder offered her a glimmer of hope, a chance to prove herself, but the fear of failure clung to her like a shroud.",
      "In the quiet moments, Eleanor often found herself reflecting on her journey. She had always been captivated by the stories of others, yet now she was compelled to write her own. As she delved deeper into the mystery, she realized that unraveling the case could be her salvation. Perhaps, in confronting the darkness of the hotel and its guests, she might also confront the shadows within herself, allowing her to emerge not just as a journalist, but as a woman unafraid of her own narrative."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "A physician with a philanthropic facade, Mallory is a respected figure whose dark secrets threaten to unravel her carefully constructed life.",
    "publicPersona": "Respected doctor with a philanthropic flair, often seen at charity events.",
    "privateSecret": "Has been skimming funds from her charity for personal gain.",
    "motiveSeed": "Fears that the victim's knowledge of her embezzlement will ruin her reputation.",
    "motiveStrength": "strong",
    "alibiWindow": "claims to have been in her room attending to a patient at the time",
    "accessPlausibility": "possible",
    "stakes": "Her social standing and financial security are at risk.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.4,
    "speechMannerisms": "Mallory speaks with an eloquent precision, often employing a gentle sarcasm that reveals her sharp intellect. She has a habit of framing her critiques as compliments, masking her true feelings beneath a veneer of politeness.",
    "signatureTic": "“Isn't it delightful how ignorance can be so blissful?”",
    "internalConflict": "Struggles with the fear of being exposed for her embezzlement, which threatens to destroy her reputation and philanthropic endeavors.",
    "personalStakeInCase": "Mallory's entire social reputation is at risk; the case could expose her deceit and ruin her carefully crafted life.",
    "paragraphs": [
      "Dr. Mallory Finch glided through the hotel corridors with an air of elegance, her heels clicking rhythmically against the polished floor. To the outside world, she was a paragon of virtue, a physician devoted to her patients and a philanthropist championing the less fortunate. Yet beneath her poised exterior lay a web of deceit, intricately woven with threads of greed and desperation. The murder of Hugo Vane had thrown her into a tempest, as the very foundation of her carefully curated life began to tremble.",
      "In her private moments, Mallory often found herself reflecting on the choices that had led her to this precarious juncture. She had always believed that the ends justified the means, that her noble pursuits could excuse her transgressions. But as the shadows of her past loomed larger, she felt the suffocating grip of anxiety tighten around her throat. The thought of Hugo revealing her embezzlement sent chills down her spine; the potential fallout could obliterate her reputation, leaving her a mere ghost of her former self.",
      "As she spoke with guests, her voice dripped with polite savagery, each compliment laced with veiled criticism. She relished the art of conversation, wielding her words like a surgeon's scalpel. Yet, the façade was cracking, and the pressure of maintaining her image gnawed at her insides. She had always been the one in control, but now she found herself teetering on the edge of chaos, the stakes higher than ever. Would she be able to navigate this treacherous landscape without losing everything she had worked for?",
      "As the investigation unfolded, Mallory felt an unsettling mixture of dread and determination. She would not allow her secrets to surface without a fight. With each passing moment, she resolved to protect her legacy, even if it meant stepping into the shadows of her own making. The game was afoot, and she was determined to emerge victorious, no matter the cost."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "A retired Navy captain whose dignified exterior masks a simmering resentment, Ivor's past threatens to unravel his present as he faces accusations.",
    "publicPersona": "Dignified and authoritative, admired for his service but carries a distant demeanor.",
    "privateSecret": "Resents the victim for her involvement in a scandal that tarnished his naval career.",
    "motiveSeed": "Believes the victim was about to publicly expose his past mistakes.",
    "motiveStrength": "compelling",
    "alibiWindow": "was seen arguing with the victim shortly before the murder",
    "accessPlausibility": "easy",
    "stakes": "His honor and legacy are at stake.",
    "humourStyle": "blunt",
    "humourLevel": 0.3,
    "speechMannerisms": "Ivor’s speech is marked by a clipped precision, often reflecting his military background. He speaks with an authoritative tone, rarely indulging in frivolity, but when he does, it is with a stark bluntness that leaves little room for misunderstanding.",
    "signatureTic": "“In my day, we faced our battles head-on.”",
    "internalConflict": "Struggles with the resentment of his tarnished legacy, caught between the honor of his past and the shame of his present.",
    "personalStakeInCase": "Ivor's honor is on the line; the case could expose his past mistakes and erase the respect he has fought to maintain.",
    "paragraphs": [
      "Captain Ivor Hale stood at the edge of the hotel terrace, gazing out at the tumultuous sea, the waves crashing against the rocks mirroring the turmoil within him. A retired Navy captain, he had once commanded respect and admiration, but now he felt the weight of his past pressing down upon him like an anchor. The murder of Hugo Vane had thrown him into the spotlight, and as whispers of his involvement began to circulate, Ivor felt the familiar pang of resentment rise within him. He had fought valiantly in the war, only to have his career sullied by the very woman who now lay dead.",
      "Ivor’s dignified façade often masked the turmoil brewing beneath. He had always prided himself on his honor, but the victim's knowledge of his past mistakes threatened to unravel the carefully constructed image he had built over the years. The argument they had shared before her death echoed in his mind, a cacophony of accusations and bitterness. To think that she would dare to expose him was an affront he could not tolerate, and the thought of his legacy being tarnished sent a shiver down his spine.",
      "His interactions with the other guests were marked by a bluntness that disarmed them. Ivor had little patience for frivolity; he preferred to cut straight to the heart of the matter. But as he navigated the investigation, he found himself grappling with the ghosts of his past. Each question posed by Eleanor Voss, the journalist, felt like a dagger aimed at his honor, and he was determined to deflect any suspicion that might fall upon him. The stakes were higher than ever, and he could not afford to lose everything he had fought for.",
      "As the investigation unfolded, Ivor faced the uncomfortable truth: in order to protect his legacy, he would have to confront the very demons he had long tried to bury. The path to redemption would not be easy, but perhaps, in unraveling the mystery of Hugo's murder, he might also find a way to reclaim his honor. The battle was no longer just against the shadows of the past; it was a fight for his very soul."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "An aspiring actress with a burning ambition, Beatrice is willing to do whatever it takes to secure her place in the limelight, even if it means hiding dark secrets.",
    "publicPersona": "Charming and ambitious, always seeking the next opportunity to rise in social standing.",
    "privateSecret": "Had an affair with the victim, who threatened to ruin her budding career.",
    "motiveSeed": "Was desperate to prevent the victim from exposing their affair.",
    "motiveStrength": "moderate",
    "alibiWindow": "claims to have been rehearsing lines in her room",
    "accessPlausibility": "possible",
    "stakes": "Her career and reputation are jeopardized.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Beatrice speaks with an animated flair, her words tumbling out in a rush, often punctuated by dramatic pauses. She employs theatrical expressions, making her dialogue feel larger than life, and her sardonic wit shines through in her remarks.",
    "signatureTic": "“Life’s a stage, darling.”",
    "internalConflict": "Struggles with the fear of being exposed for her affair and the lengths she is willing to go to protect her career.",
    "personalStakeInCase": "Beatrice's burgeoning career is on the line; the exposure of her affair could shatter her dreams and reputation.",
    "paragraphs": [
      "Beatrice Quill flitted through the hotel corridors like a butterfly in search of the brightest flower. An aspiring actress with dreams bigger than the ocean, she had always believed that charm and ambition would carry her to the top. The murder of Hugo Vane had thrown her into a whirlwind of chaos, but she saw it as an opportunity to showcase her talents, even if that meant concealing the dark secrets that lurked beneath her dazzling exterior.",
      "With every interaction, Beatrice infused her words with an animated flair, her voice rising and falling with the rhythm of her emotions. She reveled in the drama of the moment, her sardonic wit often catching others off guard. Yet, beneath the surface of her bubbly personality lay a gnawing fear — the threat of exposure. Her affair with Hugo had been a reckless gamble, one that now threatened to unravel everything she had worked for. The thought of him revealing their secret sent chills down her spine, and desperation clawed at her insides.",
      "As she rehearsed her lines in the privacy of her room, Beatrice found herself torn between ambition and integrity. She had always been willing to do whatever it took to rise in social standing, but now she questioned how far she was willing to go. The stakes had never been higher; her career was hanging by a thread, and the prospect of being outed as a mistress loomed like a dark cloud. Would she be able to navigate the treacherous waters of the investigation without losing herself in the process?",
      "In the days that followed, Beatrice felt the tension mounting. Each encounter with the other guests became a performance, and she was determined to play her role to perfection. The allure of fame tugged at her heart, but deep down, she knew that the cost of her ambition could be steep. As the investigation unfolded, she would have to confront not only the truth of Hugo's murder but also the truth of who she was becoming. Life was indeed a stage, and she was ready to play her part — even if it meant stepping into the shadows."
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "The efficient hotel manager, Sylvia balances professionalism with a hidden vice, caught between her duties and her secret life.",
    "publicPersona": "Efficient and punctual; known for her exceptional management skills and guest relations.",
    "privateSecret": "Is involved in a secret gambling ring that could be exposed by the victim.",
    "motiveSeed": "Fears the victim will reveal her gambling debts to the hotel ownership.",
    "motiveStrength": "weak",
    "alibiWindow": "was in the back office taking care of paperwork at the time",
    "accessPlausibility": "easy",
    "stakes": "Her job and financial integrity are at risk.",
    "humourStyle": "deadpan",
    "humourLevel": 0.2,
    "speechMannerisms": "Sylvia speaks in a straight, no-nonsense manner, often delivering her lines with a dry, unwavering tone. Her words are precise and devoid of embellishment, reflecting her commitment to efficiency.",
    "signatureTic": "“We all have our little vices.”",
    "internalConflict": "Struggles with the fear of being exposed for her gambling, torn between her professional responsibilities and her personal indulgences.",
    "personalStakeInCase": "Sylvia's job security is on the line; the exposure of her gambling could lead to her dismissal and financial ruin.",
    "paragraphs": [
      "Sylvia Trent moved through the hotel with the precision of a well-oiled machine, her every action focused on maintaining order amidst the chaos of guests and their demands. As the hotel manager, she was known for her exceptional skills in guest relations, a reputation built on her unwavering commitment to efficiency. Yet beneath the polished exterior lay a hidden vice that threatened to unravel her carefully constructed life. The murder of Hugo Vane had cast a shadow over her world, and the stakes had never been higher.",
      "In her back office, surrounded by paperwork, Sylvia often found herself reflecting on her choices. Her involvement in a secret gambling ring had been a thrilling escape, but now it felt like a noose tightening around her neck. The fear of exposure gnawed at her, and the thought of Hugo revealing her debts to the hotel ownership sent waves of anxiety coursing through her veins. She had always prided herself on her professionalism, but now she felt the ground shifting beneath her feet, and the walls closing in.",
      "Sylvia's speech was marked by a deadpan delivery, her words devoid of unnecessary embellishment. She had little patience for frivolity, preferring to cut through the noise with a razor-sharp focus. Yet, as she navigated the investigation, she found herself grappling with the tension between her responsibilities and her indulgences. The stakes were high, and she could not afford to let her secrets come to light. Each interaction with the guests felt like a tightrope walk, and she was determined to maintain her balance.",
      "As the investigation unfolded, Sylvia felt the pressure mounting. She was not one to succumb to panic, but the weight of her gambling debts loomed large. The thought of losing her job, her financial security, and her carefully curated life was unbearable. In the face of adversity, she resolved to protect her reputation at all costs. The game was afoot, and she would play her part with unwavering resolve, even if it meant stepping into the shadows of her own making."
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "The wealthy real estate developer whose ambition led him to the brink of disaster, Hugo's decisions left him vulnerable to the very secrets he sought to control.",
    "publicPersona": "Wealthy and influential, known for his ambitious projects and philanthropic efforts.",
    "privateSecret": "Was in a business deal with the victim that was about to collapse, losing him millions.",
    "motiveSeed": "The victim's decision to pull out of the deal would cause him significant financial loss.",
    "motiveStrength": "weak",
    "alibiWindow": "was at a meeting across town, but the timing is questionable",
    "accessPlausibility": "unlikely",
    "stakes": "His financial future and reputation in the community are endangered.",
    "humourStyle": "none",
    "humourLevel": 0,
    "speechMannerisms": "Hugo speaks in a commanding and authoritative tone, often employing business jargon that reflects his career. He has a tendency to be curt, rarely indulging in pleasantries.",
    "signatureTic": "“Time is money.”",
    "internalConflict": "Fears the impending collapse of a business deal could ruin him, leaving him exposed and vulnerable.",
    "personalStakeInCase": "Hugo's financial future is at stake; the murder investigation could unravel the very deals he relied on to maintain his status.",
    "paragraphs": [
      "Hugo Vane was a man accustomed to power, his presence commanding attention in any room. As a wealthy real estate developer, he had built an empire on ambition and ruthlessness. However, the murder that unfolded in the hotel threatened to topple the precarious balance he had maintained. With the collapse of a significant business deal looming, Hugo felt the ground beneath him shift, and the stakes had never been higher.",
      "The facade of control he had so carefully crafted began to fray as whispers of his involvement in the deal emerged. Hugo's speech was marked by a curt authority, his words often laced with business jargon that left little room for interpretation. He had little patience for idle chatter; time was money, and he intended to spend his wisely. Yet, as the investigation progressed, he found himself grappling with the very secrets he had sought to control, each question posed a reminder of his precarious position.",
      "Hugo's alibi was questionable, a meeting across town that left room for doubt. The thought of being implicated in the murder sent shivers down his spine. As he navigated the delicate web of relationships within the hotel, he felt the weight of his choices pressing down on him. His financial future hung in the balance, and the prospect of losing everything he had built was utterly intolerable.",
      "In the shadows of the investigation, Hugo faced a moral dilemma that could redefine him. Would he continue to play the ruthless game he had mastered, or would this crisis lead him to reevaluate his values? The clock was ticking, and as the truth began to emerge, he realized that the stakes were not just financial; they were existential. The path forward was fraught with danger, and Hugo would have to confront the very essence of who he was."
    ],
    "order": 6
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "The Oceanview Hotel",
    "type": "hotel",
    "place": "St. Ives",
    "country": "England",
    "summary": "An elegant seaside hotel with Art Deco flair, popular among vacationers and business travelers, overlooking the tumultuous Atlantic.",
    "visualDescription": "A striking façade of geometric lines and pastel colors, with large glass windows reflecting the moody sea. Inside, polished marble floors and brass fixtures glimmer under soft lighting, while the scent of saltwater lingers in the air.",
    "atmosphere": "A blend of elegance and unease, as guests navigate the tension of recent events.",
    "paragraphs": [
      "The Oceanview Hotel stands proudly against the rugged cliffs of St. Ives, its Art Deco architecture a vibrant contrast to the brooding Atlantic. Guests are drawn to its glamour, but whispers of disquiet ripple through the polished marble halls. The clinking of glasses in the lounge mingles with the distant crash of waves, creating an unsettling symphony of luxury and tension.",
      "As the sun dips below the horizon, the hotel's grand ballroom is filled with flickering candlelight and the soft strains of a live band. Yet, the laughter and chatter feel strained, as if the shadows of recent events loom over even the most festive gatherings. Guests exchange furtive glances, their eyes darting towards the corners of the room, as if anticipating a revelation hidden within the folds of the evening.",
      "The narrow hallways of the hotel wind like a maze, limiting movement and cloaking secrets behind closed doors. Access to the beach is strictly regulated, with staff checking identification at the entrance. The remote location of the hotel adds to the growing sense of isolation, as the sound of sirens or help feels impossibly far away. Here, amidst the elegance, a feeling of entrapment takes root, feeding the tension of the unfolding mystery."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "Overcast with occasional rain showers, typical for coastal regions during the spring.",
    "timeFlow": "A weekend of mounting tension as the truth slowly unfolds.",
    "mood": "Tense and mysterious, as guests are unsettled by recent events at the hotel.",
    "eraMarkers": [
      "Radio broadcasts in the lounge",
      "Rationed automobiles parked outside",
      "Staff in wartime uniforms",
      "Limited public transport schedules"
    ],
    "sensoryPalette": {
      "dominant": "The salty tang of the ocean air",
      "secondary": [
        "A hint of damp wood and mildew",
        "The clinking of glassware and soft music"
      ]
    },
    "paragraphs": [
      "The Oceanview Hotel is enveloped in a thick blanket of coastal mist, with the scent of salt and damp earth lingering in the air. The rhythmic sound of waves crashing against the rocks below creates a haunting backdrop, echoing the unease among the guests. Flickering gas lamps cast soft shadows, while the muted colors of the decor add to the overall atmosphere of tension and anticipation.",
      "Inside, the hotel feels like a world apart, with the sounds of laughter and conversation barely masking the undercurrent of fear. Guests in elegant attire fill the common areas, their expressions betraying a mix of curiosity and dread. The distant hum of a radio broadcasting news adds an unsettling layer, as the world outside feels both close and far away, a reminder of the uncertainties that linger beyond the hotel walls."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Hotel Lounge",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "Dimly lit with plush velvet seating, large windows overlooking the turbulent sea.",
      "sensoryDetails": {
        "sights": [
          "flickering candlelight casting shadows",
          "rain-streaked windows",
          "art deco murals depicting ocean scenes",
          "gleaming brass fixtures",
          "overstuffed armchairs in deep colors"
        ],
        "sounds": [
          "soft jazz playing in the background",
          "clinking of glasses",
          "whispers of anxious conversations",
          "the crackle of the fireplace",
          "the distant crash of waves"
        ],
        "smells": [
          "rich tobacco smoke",
          "beeswax from candles",
          "damp sea air",
          "old leather and varnished wood",
          "hint of spilled whiskey"
        ],
        "tactile": [
          "soft velvet upholstery",
          "cool marble underfoot",
          "warmth from the fireplace",
          "slippery condensation on glass",
          "rough grain of the wooden bar"
        ]
      },
      "accessControl": "Guests may enter freely, but staff restrict access during cleaning hours; private conversations take place in corners.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light filtering through clouds",
            "raindrops racing down window panes",
            "mist curling around the furniture",
            "empty chairs waiting for guests",
            "water pooling on the polished floor"
          ],
          "sounds": [
            "steady rain drumming on the roof",
            "the soft thud of wet shoes",
            "muffled voices from the hallway",
            "the rustle of newspapers",
            "the distant sound of thunder"
          ],
          "smells": [
            "freshly brewed coffee",
            "wet earth and stone",
            "scent of old books",
            "damp wool from coats",
            "lingering perfume from earlier guests"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat grey light streaming in",
            "shadows creeping along the walls",
            "dampness clinging to surfaces",
            "faded photographs on the walls",
            "an empty stage in the corner"
          ],
          "sounds": [
            "silence interrupted by a clock ticking",
            "the creak of floorboards",
            "soft laughter from a distant room",
            "the rustle of a newspaper",
            "the distant sound of waves"
          ],
          "smells": [
            "dust mingling with dampness",
            "hint of mildew in the corners",
            "faint traces of cologne",
            "old wood and varnish",
            "scent of damp fabric"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "golden light streaming through windows",
            "guests in elegant attire",
            "glint of polished silverware",
            "waves shimmering under the moonlight"
          ],
          "sounds": [
            "the tick of a mantel clock",
            "laughter echoing in the hall",
            "soft music from the band",
            "the rustle of fine fabrics"
          ],
          "smells": [
            "freshly baked bread",
            "the scent of flowers from a nearby table",
            "burning wood from the fireplace",
            "citrus from cocktails",
            "the hint of cologne and perfume"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The lounge, with its dim lighting and plush decor, was the perfect place for secrets to unfold. Guests lounged on velvet chairs, their conversations hushed and cautious, as if the very walls were listening. The flickering candlelight cast dancing shadows, creating an atmosphere of intrigue, while the distant sound of thunder hinted at a storm brewing outside, mirroring the tension within.",
        "In the corner, a spilled drink glistened on the floor, a forgotten clue in the midst of the chaos. The scent of tobacco smoke mingled with the dampness of the ocean air, creating a heady mix that hung in the atmosphere. As the night wore on, the unease grew palpable, with each creak of the floorboards echoing like a whispered secret."
      ]
    },
    {
      "id": "dining_room",
      "name": "The Grand Dining Room",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "Expansive room with high ceilings, adorned with chandeliers and large windows overlooking the ocean.",
      "sensoryDetails": {
        "sights": [
          "gleaming silverware on crisp white tablecloths",
          "chandeliers sparkling with light",
          "ocean waves crashing against the rocks outside",
          "decorative murals of coastal scenes",
          "elegantly dressed guests dining"
        ],
        "sounds": [
          "clatter of dishes being served",
          "soft murmur of polite conversation",
          "the pop of champagne corks",
          "the rustle of napkins",
          "the distant sound of waves"
        ],
        "smells": [
          "aromatic herbs and roasted meats",
          "freshly baked pastries",
          "the scent of polished wood",
          "hint of citrus from cocktails",
          "the fragrance of flowers on the tables"
        ],
        "tactile": [
          "smoothness of fine china",
          "softness of linen napkins",
          "cool glass of wine",
          "warmth from the fireplace",
          "the weight of silverware in hand"
        ]
      },
      "accessControl": "Open to all guests during dining hours; staff control access during cleaning.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "wet tablecloths glistening",
            "cloudy light filtering in",
            "empty chairs awaiting breakfast",
            "water droplets on windows",
            "elegant floral arrangements drooping"
          ],
          "sounds": [
            "soft patter of rain on the roof",
            "the clink of cutlery on plates",
            "muffled conversations from the kitchen",
            "the rustling of newspapers",
            "the distant sound of thunder"
          ],
          "smells": [
            "the scent of brewing coffee",
            "freshly baked bread",
            "the tang of damp air",
            "fragrant herbs from the kitchen",
            "the aroma of sizzling bacon"
          ],
          "mood": "quiet anticipation"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting shadows on tables",
            "glasses fogged by humidity",
            "empty plates awaiting dessert",
            "pale colors of the decor",
            "faded photographs on the walls"
          ],
          "sounds": [
            "soft conversations blending together",
            "the clink of glasses",
            "the rustle of menus",
            "the distant sound of waves",
            "the ticking of a clock"
          ],
          "smells": [
            "the scent of fresh seafood",
            "the aroma of simmering sauces",
            "the fragrance of flowers on the table",
            "the scent of polished wood",
            "the hint of dampness in the air"
          ],
          "mood": "melancholy reflection"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight flickering on tables",
            "guests in evening attire",
            "the sun setting over the ocean",
            "shadows dancing on the walls",
            "sparkling glassware catching the light"
          ],
          "sounds": [
            "laughter ringing through the room",
            "the soft strains of music",
            "the clinking of glasses",
            "the rustle of fine fabrics",
            "the distant sound of waves"
          ],
          "smells": [
            "the aroma of rich desserts",
            "the scent of good wine",
            "the fragrance of flowers in vases",
            "the smell of grilled meats",
            "the hint of perfume in the air"
          ],
          "mood": "festive celebration"
        }
      ],
      "paragraphs": [
        "The Grand Dining Room is a spectacle of elegance, with chandeliers casting a warm glow over the tables. Guests dine on sumptuous meals, their laughter echoing against the high ceilings, yet beneath the surface lies an undercurrent of worry. The rhythmic sound of waves crashing against the shore outside serves as a constant reminder of the storm brewing both outside and within the hotel.",
        "Each meal is a delicate dance of flavors, but the tension in the air thickens with every passing moment. The staff glides between tables, delivering dishes with practiced grace, yet their eyes betray a shared sense of unease. As the sun sets, the atmosphere shifts, with shadows lengthening and conversations taking on a hushed tone, as if the dining room itself is holding its breath."
      ]
    },
    {
      "id": "staff_quarters",
      "name": "Staff Quarters",
      "type": "interior",
      "purpose": "Restricted access area",
      "visualDetails": "Simple, utilitarian space with narrow bunk beds and a shared bathroom, tucked away behind the main areas of the hotel.",
      "sensoryDetails": {
        "sights": [
          "bare walls adorned with schedules",
          "narrow bunks stacked against the walls",
          "faded photos of past employees",
          "dim overhead lighting",
          "cleaning supplies in the corner"
        ],
        "sounds": [
          "muffled voices from the hallway",
          "the creak of floorboards",
          "the sound of water running",
          "the rustle of uniforms",
          "the distant echo of laughter"
        ],
        "smells": [
          "the scent of soap and bleach",
          "faint traces of food",
          "the odor of damp laundry",
          "cleaning products lingering in the air",
          "the mustiness of closed quarters"
        ],
        "tactile": [
          "the rough texture of bunk beds",
          "cold metal of a doorknob",
          "smoothness of freshly washed linens",
          "the chill of the tiled floor",
          "the weight of uniforms in hand"
        ]
      },
      "accessControl": "Access restricted to staff only; guests prohibited from entering without permission.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "dim light filtering through a small window",
            "water droplets clinging to surfaces",
            "sheets hanging to dry",
            "shadows creeping along the floor",
            "cleaning carts parked outside"
          ],
          "sounds": [
            "the sound of rain tapping on the roof",
            "soft conversations between staff",
            "the rustle of uniforms being put on",
            "the clatter of dishes being washed",
            "the distant sound of thunder"
          ],
          "smells": [
            "the scent of wet clothes",
            "the aroma of freshly brewed coffee",
            "the tang of cleaning products",
            "the mustiness of damp wood",
            "the faint scent of breakfast"
          ],
          "mood": "hushed anticipation"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "faded light casting shadows",
            "cleaning supplies stacked in a corner",
            "bunk beds lined up neatly",
            "the dull shine of polished floors",
            "the clock ticking on the wall"
          ],
          "sounds": [
            "the sound of footsteps in the hallway",
            "the clink of dishes being put away",
            "muffled laughter from the dining room",
            "the rustle of cleaning supplies",
            "the distant sound of waves"
          ],
          "smells": [
            "the scent of soap and bleach",
            "the faint aroma of food",
            "the musty smell of closed quarters",
            "the lingering scent of cleaning products",
            "the hint of dampness in the air"
          ],
          "mood": "quiet resignation"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "dim light casting long shadows",
            "the glow of a single lamp",
            "staff uniforms hanging on hooks",
            "the clutter of cleaning supplies",
            "the clock striking the hour"
          ],
          "sounds": [
            "the sound of laughter from the dining room",
            "the creak of the building settling",
            "the rustle of papers being organized",
            "the distant echo of music",
            "the soft hum of the ocean"
          ],
          "smells": [
            "the scent of freshly laundered linens",
            "the lingering aroma of food from the dining room",
            "the mustiness of the room",
            "the faint scent of cleaning products",
            "the hint of salt from the sea"
          ],
          "mood": "tired acceptance"
        }
      ],
      "paragraphs": [
        "The Staff Quarters, tucked away from the guest areas, are utilitarian and bare, a stark contrast to the elegance of the hotel. The narrow bunks are lined against the walls, and schedules hang like reminders of the relentless pace of work. Here, the atmosphere is thick with the scent of soap and cleaning products, a constant reminder of the duties that await beyond the door.",
        "Inside, the sounds of laughter and music from the dining area filter through the walls, a tantalizing reminder of the life beyond. Staff members move with purpose, their uniforms crisp but their faces showing signs of fatigue. The weight of the day's events hangs heavy in the air, as they exchange whispers of uncertainty and concern, knowing that the mystery unfolding in the hotel may soon reach them as well."
      ]
    },
    {
      "id": "beach_access",
      "name": "Beach Access Path",
      "type": "transitional",
      "purpose": "Restricted access to the beach",
      "visualDetails": "Narrow path winding through tall grass and rocky outcrops leading to a secluded stretch of beach.",
      "sensoryDetails": {
        "sights": [
          "tall grasses swaying in the wind",
          "jagged rocks jutting out from the sand",
          "waves crashing against the shore",
          "seagulls circling overhead",
          "distant cliffs silhouetted against the sky"
        ],
        "sounds": [
          "the roar of the ocean",
          "crunching gravel underfoot",
          "the call of seagulls",
          "the whisper of the wind",
          "the soft crash of waves"
        ],
        "smells": [
          "salty sea air",
          "the scent of damp earth",
          "the aroma of seaweed",
          "the fragrance of wildflowers",
          "the mustiness of wet rocks"
        ],
        "tactile": [
          "rough texture of gravel underfoot",
          "cool breeze against the skin",
          "the warmth of the sun on the face",
          "the softness of sand between toes",
          "the chill of ocean water on the feet"
        ]
      },
      "accessControl": "Access restricted to hotel guests only; staff monitor entry during peak hours.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey clouds hanging low",
            "raindrops falling on the path",
            "mud forming between the stones",
            "puddles reflecting the sky",
            "wet grass glistening in the light"
          ],
          "sounds": [
            "the sound of rain pattering on leaves",
            "the distant crash of waves",
            "the squelch of wet ground",
            "the rustle of grass in the wind",
            "the call of distant seagulls"
          ],
          "smells": [
            "the fresh scent of rain-soaked earth",
            "the tang of sea salt in the air",
            "the aroma of wet grass",
            "the mustiness of damp rocks",
            "the hint of seaweed"
          ],
          "mood": "gloomy introspection"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting shadows",
            "waves crashing against the rocks",
            "seagulls swooping low",
            "the path winding into the distance",
            "the horizon blurred by mist"
          ],
          "sounds": [
            "the sound of waves crashing",
            "the whisper of the wind",
            "the rustle of grass",
            "the distant murmur of voices",
            "the call of seagulls"
          ],
          "smells": [
            "the scent of damp earth",
            "the tang of saltwater",
            "the fragrance of wildflowers",
            "the mustiness of wet stones",
            "the aroma of seaweed"
          ],
          "mood": "melancholic solitude"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "the sun setting over the horizon",
            "golden light reflecting off the water",
            "silhouettes of rocks against the sky",
            "the path illuminated by soft light",
            "the distant sound of laughter"
          ],
          "sounds": [
            "the gentle lapping of waves",
            "the call of seagulls returning to roost",
            "the rustle of grass in the breeze",
            "the distant sound of music from the hotel",
            "the soft crunch of footsteps on gravel"
          ],
          "smells": [
            "the scent of salty air",
            "the aroma of wildflowers blooming",
            "the freshness of the evening breeze",
            "the faint smell of smoke from nearby fires",
            "the hint of damp sand"
          ],
          "mood": "tranquil reflection"
        }
      ],
      "paragraphs": [
        "The Beach Access Path leads down from the hotel, a narrow way through tall grasses and rocky outcrops. The sound of waves crashing against the shore fills the air, mingling with the calls of seagulls overhead. This secluded stretch of beach offers a momentary escape from the tension of the hotel, yet it holds its own secrets amidst the serenity.",
        "As guests traverse the path, the salty sea air fills their lungs, a refreshing contrast to the stifling atmosphere indoors. The rough gravel crunches underfoot, and the thrill of the ocean beckons. Yet, the isolation of the beach reminds them of their vulnerability, as the waves crash rhythmically like a heartbeat, echoing the mysteries that lie within the walls of the Oceanview Hotel."
      ]
    }
  ],
  "note": "",
  "cost": 0.002992836,
  "durationMs": 36607
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1949,
    "month": "June",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "summer",
    "month": "June",
    "weather": [
      "Overcast skies with sporadic rain showers",
      "Cool breezes from the nearby coast",
      "Humidity typical for coastal regions"
    ],
    "daylight": "Long summer days with twilight stretching into the evening, sunset occurring around nine o'clock.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, as guests unwind after dinner.",
    "holidays": [
      "Father's Day (June 19)"
    ],
    "seasonalActivities": [
      "Strolling along the beachfront promenade",
      "Participating in local summer fairs or carnivals",
      "Enjoying outdoor dining at seaside cafes"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "Navy blue suit with a light-colored dress shirt",
        "Black leather shoes with polished finish",
        "Silk tie in a geometric pattern"
      ],
      "casual": [
        "Short-sleeved cotton shirts with floral patterns",
        "Lightweight linen trousers",
        "Canvas loafers"
      ],
      "accessories": [
        "Fedora hats",
        "Wristwatches with leather straps",
        "Suspenders for a relaxed fit"
      ]
    },
    "womensWear": {
      "formal": [
        "Tea-length dresses with floral prints",
        "Straw hats adorned with ribbons",
        "Heels with open toes"
      ],
      "casual": [
        "Cotton blouses paired with high-waisted shorts",
        "Lightweight summer cardigans",
        "Ballet flats in pastel colors"
      ],
      "accessories": [
        "Pearl necklaces",
        "Clutch purses",
        "Sunglasses with oversized frames"
      ]
    },
    "trendsOfTheMoment": [
      "Use of brighter pastel colors in clothing",
      "Emphasis on leisure wear for casual outings",
      "Adoption of shorter hemlines"
    ],
    "socialExpectations": [
      "Politeness and decorum in public spaces",
      "Emerging acceptance of women in leadership roles",
      "Conformity to traditional family roles, especially around Father's Day"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "The establishment of NATO in April 1949",
      "Tensions rising in the Korean Peninsula as North Korea shows military aggression",
      "Continued investigations into war crimes and the Nuremberg Trials"
    ],
    "politicalClimate": "Heightened political tensions as the Cold War begins to solidify, with countries aligning into opposing blocs.",
    "economicConditions": "Post-war recovery is underway but uneven, with inflation affecting daily expenses and a growing housing shortage.",
    "socialIssues": [
      "Discrimination against returning veterans",
      "Economic disparities between urban and rural areas",
      "The role of women in the workforce continuing to evolve"
    ],
    "internationalNews": [
      "The threat of communism spreading in Eastern Europe",
      "New policies being discussed in the United Nations",
      "Continued reconstruction efforts in war-torn Europe"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "'Some Enchanted Evening' from South Pacific",
        "'A Little Bird Told Me' by Evelyn Knight",
        "'Cruising Down the River' by The Four Aces"
      ],
      "films": [
        "The Third Man",
        "All the King's Men",
        "The Heiress"
      ],
      "theater": [
        "South Pacific",
        "The King and I",
        "Death of a Salesman"
      ],
      "radio": [
        "The Adventures of Sam Spade",
        "Suspense",
        "The Jack Benny Program"
      ]
    },
    "literature": {
      "recentPublications": [
        "'The Naked and the Dead' by Norman Mailer",
        "'The Catcher in the Rye' by J.D. Salinger",
        "'1984' by George Orwell"
      ],
      "popularGenres": [
        "Mystery and detective fiction",
        "Social realism",
        "Post-war literature"
      ]
    },
    "technology": {
      "recentInventions": [
        "Transistor radio",
        "Automatic telephone dialing",
        "First commercial jet airliner, the de Havilland Comet"
      ],
      "commonDevices": [
        "Standard radios in homes",
        "Typewriters still prevalent in offices",
        "Early television sets beginning to appear in households"
      ],
      "emergingTrends": [
        "Increased public interest in television programming",
        "Growth in consumer electronics",
        "Adoption of modern kitchen appliances"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Bottle of milk: one shilling",
        "Movie ticket: one shilling sixpence"
      ],
      "commonActivities": [
        "Visiting local parks for picnics",
        "Attending community events or fairs",
        "Dining at neighborhood diners"
      ],
      "socialRituals": [
        "Sunday family dinners",
        "Engaging in weekend outings to the beach",
        "Participating in local sports events"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "Growing middle class with aspirations towards home ownership",
      "Class distinctions still evident in urban settings"
    ],
    "gender": [
      "Increased acceptance of women in the workforce",
      "Traditional views on family roles still prevalent"
    ],
    "race": [
      "Emerging civil rights movements advocating for racial equality",
      "Prejudice and segregation still present in many regions"
    ],
    "generalNorms": [
      "Politeness and formality in social interactions",
      "Respect for authority figures",
      "Community involvement emphasized"
    ]
  },
  "atmosphericDetails": [
    "The salty tang of the ocean air mingles with the scent of rain-soaked pavement.",
    "The muted sounds of laughter and conversation echo in the hotel lobby, punctuated by the occasional clap of thunder.",
    "Dim lighting casts long shadows in the corners of the elegant dining room, as guests share hushed whispers and furtive glances."
  ],
  "paragraphs": [
    "In June 1949, the coastal town is shrouded in a mix of humidity and overcast skies, casting a pall over the beachfront hotel where guests have gathered. The scent of rain-soaked pavement wafts through the air, mingling with the salty ocean breeze that hints at the unpredictability of summer storms. As the sun sets later in the evening, the atmosphere is thick with tension, as reports of rising tensions in Korea echo through the news broadcasts, unsettling the guests who are trying to unwind after a long day of summer activities.",
    "Fashion in this post-war era reflects a blend of practicality and emerging trends, with men donning navy suits paired with light dress shirts, while women opt for tea-length dresses adorned in floral prints. The air is punctuated with the soft click of heels against polished wooden floors and the rustle of lightweight fabrics. As guests gather in the hotel’s lounge, the vibrancy of colors and styles contrasts with the lingering shadows of the past, creating a visual tapestry that tells the story of a society in transition.",
    "Daily life at the hotel is marked by both routine and unease. Guests engage in social rituals such as leisurely Sunday dinners and weekend outings to the beach, but the specter of recent events weighs heavily on their minds. Typical prices reflect a recovering economy — a loaf of bread costs four pence, while a movie ticket is just over a shilling. Amidst the backdrop of laughter and music from the radio, there lies a palpable tension, as guests exchange wary glances, aware that beneath the facade of summer leisure, something sinister may lie just out of sight."
  ],
  "note": "",
  "cost": 0.0010704342,
  "durationMs": 23975
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A recent murder at a remote seaside hotel draws together a diverse group of guests and staff, all grappling with the social upheaval of post-war recovery and the pressures of emerging Cold War tensions.",
  "era": {
    "decade": "1940s",
    "socialStructure": "The class dynamics are shifting as women increasingly enter the workforce, while the lingering effects of WWII create an atmosphere of suspicion and unease among the hotel’s diverse patrons."
  },
  "setting": {
    "location": "A seaside hotel featuring Art Deco architecture, popular among vacationers and business travelers, with a view of the ocean.",
    "institution": "hotel",
    "weather": "Overcast with occasional rain showers, typical for coastal regions during the spring."
  },
  "castAnchors": [
    "Eleanor Voss",
    "Dr. Mallory Finch",
    "Captain Ivor Hale",
    "Beatrice Quill",
    "Sylvia Trent",
    "Hugo Vane"
  ],
  "theme": "Golden Age murder driven by a mechanical clock-tampering method, where a rewound timepiece staged the apparent time of death."
}

### LOCKED_FACTS
[
  {
    "id": "time_of_death",
    "value": "five minutes to ten",
    "description": "The time displayed on the tampered clock when the murder was staged."
  },
  {
    "id": "pendulum_stop_time",
    "value": "ten minutes past nine",
    "description": "The true time of death when the pendulum was stopped."
  },
  {
    "id": "witness_testimony_time",
    "value": "a quarter to ten",
    "description": "The time when witnesses believed the victim was still alive."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 19,
  "countsByPlacement": {
    "early": 8,
    "mid": 10,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 16,
    "supporting": 2,
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
      "category": "temporal"
    },
    {
      "id": "clue_3",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_4",
      "placement": "early",
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
      "category": "temporal"
    },
    {
      "id": "clue_7",
      "placement": "early",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_8",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
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
      "criticality": "supporting",
      "category": "testimonial"
    },
    {
      "id": "clue_culprit_direct_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_culprit_direct_dr_mallory_finch",
      "placement": "early",
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
      "category": "temporal"
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

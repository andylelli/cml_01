# Actual Prompt Record

- Run ID: `mystery-1778783763479`
- Project ID: ``
- Timestamp: `2026-05-14T18:39:56.428Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `retry 1`
- Prompt Hash: `9e6b1832198b96b0`

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
    "title": "The Clockwork Conspiracy",
    "author": "Your Name",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1930s",
      "realism_constraints": []
    },
    "setting": {
      "location": "Little Middleton",
      "place": "country house estate",
      "country": "England",
      "institution": "country house estate"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "clock tampering"
    }
  },
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "detective",
      "relationships": [
        "Dr. Mallory Finch (friend)",
        "Captain Ivor Hale (acquaintance)",
        "Beatrice Quill (guest)"
      ],
      "public_persona": "A sharp, observant woman known for her keen intellect.",
      "private_secret": "Struggles with self-doubt in her abilities.",
      "motive_seed": "Desire to prove herself in a male-dominated field.",
      "motive_strength": "strong",
      "alibi_window": "n/a",
      "access_plausibility": "high",
      "opportunity_channels": [
        "managing the estate",
        "visiting the study"
      ],
      "behavioral_tells": [
        "calm under pressure",
        "observant"
      ],
      "stakes": "her reputation as a detective",
      "evidence_sensitivity": [
        "confidential witness statements",
        "private conversations"
      ],
      "culprit_eligibility": "locked",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "doctor",
      "relationships": [
        "Eleanor Voss (friend)",
        "Beatrice Quill (colleague)",
        "Captain Ivor Hale (guest)"
      ],
      "public_persona": "Respected physician with a calming presence.",
      "private_secret": "Involved in illegal dealings to fund his practice.",
      "motive_seed": "Financial desperation due to the Great Depression.",
      "motive_strength": "moderate",
      "alibi_window": "between 10:00 and 11:00",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "access to victim's study",
        "knowledge of clock mechanics"
      ],
      "behavioral_tells": [
        "nervous when discussing finances"
      ],
      "stakes": "his career and freedom",
      "evidence_sensitivity": [
        "medical records",
        "financial documents"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "30-40",
      "role_archetype": "military officer",
      "relationships": [
        "Eleanor Voss (acquaintance)",
        "Beatrice Quill (love interest)",
        "Dr. Mallory Finch (guest)"
      ],
      "public_persona": "Dashing and charming officer, well-liked among peers.",
      "private_secret": "Involved in a secret gambling ring.",
      "motive_seed": "Desire to cover gambling debts.",
      "motive_strength": "strong",
      "alibi_window": "between 10:00 and 11:00",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "frequent visits to the estate",
        "knowledge of the layout"
      ],
      "behavioral_tells": [
        "excessive charm to deflect suspicion"
      ],
      "stakes": "his social standing and financial security",
      "evidence_sensitivity": [
        "gambling records",
        "witness statements"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "20-30",
      "role_archetype": "guest",
      "relationships": [
        "Eleanor Voss (friend)",
        "Dr. Mallory Finch (colleague)",
        "Captain Ivor Hale (love interest)"
      ],
      "public_persona": "A lively and engaging young woman who charms everyone.",
      "private_secret": "Hiding her family's financial ruin.",
      "motive_seed": "Fear of being exposed as a fraud.",
      "motive_strength": "moderate",
      "alibi_window": "between 10:00 and 11:00",
      "access_plausibility": "high",
      "opportunity_channels": [
        "visiting the estate frequently",
        "knowledge of the clock"
      ],
      "behavioral_tells": [
        "distraction when discussing family"
      ],
      "stakes": "her social reputation",
      "evidence_sensitivity": [
        "family correspondence",
        "guest log"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
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
      "summary": "As the elite gather at a country estate for a weekend retreat, the clock stops ticking just as a murder occurs. Eleanor Voss must unravel the mystery of the clockwork conspiracy that conceals the true timeline of events."
    },
    "accepted_facts": [
      "The clock in the study stopped at ten minutes past eleven.",
      "Witnesses recall the victim mentioning a meeting at twenty minutes past eleven.",
      "The weather was overcast with occasional rain showers."
    ],
    "inferred_conclusions": [
      "The murder occurred shortly before the clock stopped."
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "A mechanical clock was tampered with to mislead the timeline of the murder.",
      "delivery_path": [
        {
          "step": "The clock was wound back forty minutes, creating a false timeline for the events."
        }
      ]
    },
    "outcome": {
      "result": "The true time of the murder is revealed, proving Captain Ivor Hale's guilt."
    }
  },
  "false_assumption": {
    "statement": "The murder occurred after the clock stopped at ten minutes past eleven.",
    "type": "temporal",
    "why_it_seems_reasonable": "Witnesses corroborate the victim's appointment at twenty minutes past eleven, suggesting the murder happened after the clock stopped.",
    "what_it_hides": "The clock was tampered with to mislead the timeline."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "The clock stopped at ten minutes past eleven.",
        "Witnesses recall the victim mentioning a meeting at twenty minutes past eleven."
      ],
      "windows": [
        "Murder occurred between 10:00 and 11:00"
      ],
      "contradictions": [
        "The victim's appointment suggests time discrepancy."
      ]
    },
    "access": {
      "actors": [
        "Captain Ivor Hale",
        "Dr. Mallory Finch"
      ],
      "objects": [
        "The clock",
        "The study"
      ],
      "permissions": [
        "All guests had access to the study but restricted access to the clock mechanism."
      ]
    },
    "physical": {
      "laws": [
        "Mechanical clock regulation",
        "Physics of time measurement"
      ],
      "traces": [
        "Clock mechanism shows signs of tampering."
      ]
    },
    "social": {
      "trust_channels": [
        "Guest interactions",
        "Social hierarchy among the elite"
      ],
      "authority_sources": [
        "Eleanor Voss's authority as a detective"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The clock in the study stopped at ten minutes past eleven, and witnesses heard the victim mention an appointment at twenty minutes past eleven.",
        "correction": "The murder could not have happened after the clock stopped.",
        "effect": "Eliminates the possibility that the murder occurred after the appointment.",
        "required_evidence": [
          "The clock in the study stopped at ten minutes past eleven.",
          "Witnesses recall the victim mentioning a meeting at twenty minutes past eleven."
        ],
        "reader_observable": true
      },
      {
        "observation": "The shadows cast by the sun indicate that the clock must have been wound back.",
        "correction": "The time indicated by the clock is inaccurate due to tampering.",
        "effect": "Narrows the investigation focus towards the timekeeping devices.",
        "required_evidence": [
          "The difference in shadows cast by the sun.",
          "Witness statements indicate the sun's position."
        ],
        "reader_observable": true
      },
      {
        "observation": "The clock mechanism shows signs of tampering with fresh tool marks.",
        "correction": "This indicates that someone adjusted the clock to mislead the timeline.",
        "effect": "Narrows the suspect pool to those who had access to the clock.",
        "required_evidence": [
          "Clock mechanism shows signs of tampering.",
          "Witnesses confirm Captain Hale was seen near the clock earlier."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "Comparing the tampered clock with the schedule of appointments reveals inconsistencies that can only implicate Captain Ivor Hale.",
    "knowledge_revealed": "The clock was wound back, proving the murder was premeditated.",
    "pass_condition": "If the clock's tampering is confirmed, it shows that Captain Hale manipulated the timeline.",
    "evidence_clues": [
      "clue_1",
      "clue_2",
      "clue_3",
      "clue_mechanism_visibility_core"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The clock's stopping time and appointment references establish the timeline. Step 2: Shadow evidence clarifies the actual time of death. Step 3: Tampering evidence on the clock implicates Captain Hale."
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
        "Observe the clock's tampering evidence",
        "Draw conclusion about Captain Hale's guilt"
      ],
      "test_type": "mechanical comparison"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Showing his medical alibi during the time of the murder.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Her alibi is confirmed by multiple eyewitnesses.",
        "supporting_clues": [
          "clue_id_3",
          "clue_id_4"
        ]
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with evidence of the clock tampering."
    },
    "identity_rules": [],
    "clue_to_scene_mapping": [
      {
        "clue_id": "clue_1",
        "act_number": 1,
        "scene_number": 1,
        "delivery_method": "Direct observation of the stopped clock."
      },
      {
        "clue_id": "clue_2",
        "act_number": 1,
        "scene_number": 2,
        "delivery_method": "Witnesses discussing the victim's appointment."
      },
      {
        "clue_id": "clue_9",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_core_contradiction_chain",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_culprit_direct_captain_ivor_hale",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_mechanism_visibility_core",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_3",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Discovery of the tampered clock mechanism."
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
        "clue_id": "clue_8",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_core_elimination_chain",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "Eleanor Voss is a charming socialite and philanthropist, admired for her charity work yet burdened by the financial instability of her family business. As an amateur sleuth, she is determined to protect her family's reputation amidst swirling rumors.",
    "publicPersona": "Eleanor is the epitome of grace and charm, often hosting lavish gatherings where the elite of Little Middleton mingle. Her laughter rings like music, and her keen sense of style makes her a focal point of any social event. Everyone admires her for her charitable endeavors, seemingly oblivious to the cracks forming in her family’s financial facade.",
    "privateSecret": "Beneath her polished exterior, Eleanor grapples with the reality of her family’s failing business, which she keeps hidden from her social circle. The weight of this secret gnaws at her, for she fears that exposure would not only bring shame to her family but also shatter the image she has carefully constructed.",
    "motiveSeed": "Driven by a fierce desire to protect her family’s reputation, Eleanor feels an urgent need to uncover the truth behind the recent tragedy. The thought of gossip tarnishing her family’s name propels her into action, as she realizes that the stakes have never been higher.",
    "motiveStrength": "strong",
    "alibiWindow": "Eleanor claims to have been in the garden from seven until nine, tending to her prized roses and enjoying the evening air.",
    "accessPlausibility": "With her social standing, accessing various locations and events in Little Middleton is effortless for Eleanor, allowing her to gather information with ease.",
    "stakes": "Her family's legacy hangs in the balance, and Eleanor knows that failure to act could mean the end of everything her family has worked for.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with a refined accent, punctuating her sentences with a light lilt. She often employs clever quips that reveal her sharp intellect, though she maintains a polite demeanor that masks her underlying urgency.",
    "internalConflict": "Eleanor is torn between her desire to uphold her family's reputation and the fear that the truth may expose deeper issues that could ruin them. Her moral compass is challenged as she navigates the murky waters of loyalty and honesty.",
    "personalStakeInCase": "This crime strikes at the heart of Eleanor's identity, as her family's standing in society is intricately linked to her own sense of self-worth and purpose.",
    "paragraphs": [
      "Eleanor Voss stood in her garden, the moonlight casting silvery shadows across her meticulously tended roses. She inhaled deeply, the scent of blooms mingling with the crisp night air, a fleeting comfort amidst the turmoil swirling in her mind. The recent tragedy had sent shockwaves through Little Middleton, and Eleanor felt the weight of her family's reputation pressing down upon her like a heavy cloak. While her public persona gleamed with charm and grace, behind closed doors, she grappled with the reality of her family's financial instability—a truth she dared not reveal.",
      "As the daughter of a once-prosperous businessman, Eleanor had grown accustomed to the trappings of wealth. Her charity galas were the stuff of legend; she could coax donations from the tightest of purses with a mere flutter of her eyelashes. Yet, as whispers of her family's impending financial ruin began to circulate, her heart raced with fear. What if the truth came to light? What if her friends turned their backs on her? The thought was unbearable, and it propelled her into the role of an amateur sleuth, determined to uncover the truth behind the recent murder that threatened to upend her world.",
      "Eleanor's investigation led her through the labyrinth of Little Middleton’s society, where secrets lay hidden beneath layers of silk and lace. She had always been a keen observer, noting the subtle dynamics of power and influence that governed her social circle. Yet, as she delved deeper, she found herself confronting not only the shadows of others but also her own moral dilemmas. Could she betray her friends to protect her family? The internal conflict gnawed at her, leaving her restless in the quiet hours of the night.",
      "In the days that followed, Eleanor began to weave a delicate web of alliances and inquiries, each thread pulling her closer to the truth. With every revelation, she felt the stakes rise, not just for her family’s reputation but for her own sense of identity. She was no longer just the charming hostess; she was a woman on a mission, willing to risk everything to safeguard the legacy that had been entrusted to her care."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch is a respected physician facing the twilight of his career, threatened by new medical practices and personal demons. His stern demeanor hides a fragile ego, compelling him into a web of deceit as he battles to protect his reputation.",
    "publicPersona": "A figure of authority in Little Middleton, Dr. Finch commands respect with his sharp intellect and unwavering dedication to his patients. His reputation as a skilled physician is marred only by his brusque manner, which often leaves others feeling intimidated rather than comforted.",
    "privateSecret": "Behind the facade of confidence, Dr. Finch feels the ground shift beneath him as new medical practices emerge. His clinic struggles, and the thought of being overshadowed by younger, more progressive doctors eats away at his self-assurance.",
    "motiveSeed": "Dr. Finch fears that the victim was on the verge of exposing unethical practices within his clinic, which would not only ruin his reputation but also threaten his very livelihood and legacy as a physician.",
    "motiveStrength": "compelling",
    "alibiWindow": "He claims to have been in his study, absorbed in medical journals from eight until ten, a solitary figure lost in the world of medicine.",
    "accessPlausibility": "As a prominent doctor, Dr. Finch has access to various locations, though his reputation may hinder him from mingling freely among the upper echelons of society.",
    "stakes": "The stakes are high for Dr. Finch; his career and the respect he has built over years of hard work are on the line, leaving him desperate to protect his legacy.",
    "humourStyle": "sardonic",
    "humourLevel": 0.4,
    "speechMannerisms": "Dr. Finch speaks in clipped, precise sentences, often laced with a hint of sarcasm. His tone is authoritative, yet there's a flicker of vulnerability that occasionally escapes, especially when discussing his field.",
    "internalConflict": "Dr. Finch wrestles with the fear that his traditional methods may no longer suffice in a rapidly evolving medical landscape. The possibility of being exposed as unethical gnaws at his conscience, creating a tension that threatens to unravel him.",
    "personalStakeInCase": "This crime matters deeply to Dr. Finch, as it represents not only a threat to his reputation but also a challenge to his identity as a physician in a changing world.",
    "paragraphs": [
      "Dr. Mallory Finch sat in his study, the dim light illuminating the pages of medical journals that surrounded him like a fortress. A respected physician in Little Middleton, he had devoted his life to the art of healing, yet lately, he found himself ensnared in a web of fear and uncertainty. The rise of new medical practices threatened to eclipse his own, leaving him feeling like a relic of a bygone era. As he flipped through the pages, his mind wandered to the recent murder that had shaken the community, and the chilling thought that the victim's demise could be linked to him sent a shiver down his spine.",
      "With every tick of the clock, Dr. Finch felt the pressure mounting. He had heard rumors that the victim was preparing to expose unethical practices within his clinic, a prospect that could ruin him. The very idea felt like a noose tightening around his neck, and he wondered how much longer he could maintain the facade of respectability. His colleagues respected him, but how long could he keep them from discovering the truth? The stakes were high, and with each passing day, the shadows of doubt loomed larger.",
      "As he navigated the corridors of his clinic, Dr. Finch wore his stern demeanor like armor. Patients regarded him with a mix of admiration and fear, but beneath that exterior lay a man grappling with his own inadequacies. He had always prided himself on being a pillar of the community, yet the encroaching tide of change left him feeling adrift. The whispers of younger doctors echoed in his mind, taunting him with the knowledge that his time was running out.",
      "In the wake of the murder, Dr. Finch found himself drawn into a murky investigation, a reluctant participant in a game of cat and mouse. Each interaction with the other suspects felt like a high-stakes chess match, where one wrong move could lead to his downfall. As he sought to protect his reputation, he also confronted the ethical dilemmas that arose from his past decisions. The battle raged within him, and he knew that the truth could either save him or condemn him."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale, a proud retired Navy officer, grapples with resentment towards the upper class and the tarnishing of his honor. His commanding presence masks the inner turmoil of a man struggling to reconcile past glories with present realities.",
    "publicPersona": "Captain Hale is a figure of authority and pride, known for his commanding presence and tales of bravery from his days at sea. His fellow veterans look up to him, and he relishes the respect he garners, often regaling listeners with stories of valor and sacrifice.",
    "privateSecret": "Beneath the surface, Captain Hale harbors deep resentment towards the upper class, feeling their disdain for veterans like himself. Their lack of respect gnaws at his pride, leaving him feeling like a relic in a world that has moved on.",
    "motiveSeed": "The victim publicly insulted him at a gathering, dealing a blow to his honor that he cannot ignore. The need to reclaim his dignity drives him, as he longs to restore the respect he feels has been stripped away.",
    "motiveStrength": "moderate",
    "alibiWindow": "He claims to have been in the library from six until nine, lost in the pages of naval histories that both inspire and haunt him.",
    "accessPlausibility": "As a retired officer, Captain Hale has some access to various locations, though his interactions with the upper class are often strained due to his past grievances.",
    "stakes": "His pride and respect among his peers are at stake, and the thought of being further humiliated is unbearable for him.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.3,
    "speechMannerisms": "Captain Hale speaks with a commanding tone, though his words are often laced with self-deprecating humor. He enjoys telling tales of his past, but there's a wistfulness that permeates his stories, revealing a man who feels out of place.",
    "internalConflict": "Captain Hale's sense of honor is in conflict with the reality of his current status as a retired veteran. The public insult he endured has left him grappling with feelings of inadequacy and a desperate need to reclaim his lost dignity.",
    "personalStakeInCase": "This crime matters to Captain Hale because it represents an affront to his honor, and avenging the slight against him could restore his standing among his peers.",
    "paragraphs": [
      "Captain Ivor Hale sat in the library, the shadows dancing across the spines of naval histories that lined the shelves. A proud retired officer, he had once commanded respect on the high seas, but now he felt adrift in a world that seemed to have forgotten him. The tales of bravery he once recounted with gusto now echoed hollowly in his mind, and the recent insult from the victim at a gathering had struck a nerve he thought long buried. The need to reclaim his honor consumed him, a fire that refused to be extinguished.",
      "As he turned the pages of a particularly gripping account of naval battles, Captain Hale's thoughts drifted to the upper class, those who had once admired him for his service but now looked down upon him with disdain. Their lack of respect gnawed at his pride, fueling an inner turmoil that left him restless. He longed to confront the victim, to demand satisfaction for the public slight that had tarnished his reputation. The stakes felt impossibly high, and the thought of being further humiliated sent tremors of anger through him.",
      "In conversations with fellow veterans, he relished the camaraderie that reminded him of days gone by, yet he could not shake the feeling of being an outsider in a world that had moved on. The camaraderie was tinged with an unspoken understanding of the struggles they all faced, but Captain Hale's resentment towards the upper class remained a constant weight upon his shoulders. He had fought for their freedom, yet they treated him as if he were less than a man. The thought was infuriating.",
      "As the investigation unfolded, Captain Hale found himself drawn into the murky waters of suspicion, a reluctant participant in a game that threatened to expose his own vulnerabilities. Each interaction with the other suspects felt charged with tension, a reminder of the honor he sought to reclaim. He was determined to confront the truth behind the murder, even if it meant facing his own demons in the process. The battle for his dignity had only just begun."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill is an aspiring writer with a vivacious spirit, driven by a desperate desire to escape her working-class roots. Her ambition blinds her to the moral consequences of her actions as she navigates a treacherous path towards success.",
    "publicPersona": "Beatrice is known for her bright-eyed enthusiasm and literary ambitions, often seen flitting about social events, eager to engage with the elite of Little Middleton. Her vivacity draws others in, and she is often the life of the party, charming those around her with her quick wit.",
    "privateSecret": "Beneath her bubbly exterior lies a desperation to escape her working-class roots. Beatrice is willing to do anything to achieve success, even if it means sacrificing her integrity or betraying those who have supported her.",
    "motiveSeed": "Beatrice believes the victim was about to expose her past, which could jeopardize her aspirations of becoming a successful writer. The thought of her dreams unraveling drives her to desperate measures.",
    "motiveStrength": "strong",
    "alibiWindow": "She claims to have been in her room writing from seven until eight-thirty, though her productivity may have been clouded by her mounting anxiety.",
    "accessPlausibility": "While Beatrice aspires to the upper echelons of society, her working-class background makes her access to certain locations less plausible, often relying on her charm to navigate those spaces.",
    "stakes": "Her future and dream of success in the literary world are at risk, and the potential exposure of her past threatens to shatter her aspirations.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Beatrice speaks with an energetic cadence, her words flowing rapidly as she peppers her conversations with clever remarks. Her enthusiasm sometimes leads her to overshare, revealing more than she intends.",
    "internalConflict": "Beatrice grapples with the moral implications of her ambition, torn between her desire for success and the fear of losing her integrity. The threat of her past being exposed creates a tension that leaves her feeling vulnerable.",
    "personalStakeInCase": "This crime matters to Beatrice because it represents a direct threat to her dreams; the fear of her past being unearthed looms like a specter over her aspirations.",
    "paragraphs": [
      "Beatrice Quill sat at her writing desk, the pages of her latest manuscript scattered around her like fallen leaves. An aspiring writer with a vivacious spirit, she was determined to carve her name into the annals of literary greatness. Yet, as she stared at the blank page before her, doubt crept in, gnawing at her resolve. The recent murder had sent shockwaves through Little Middleton, and she couldn't shake the feeling that it would somehow touch her life in a way she dreaded. The victim was rumored to have been about to expose her past, and the thought sent chills down her spine.",
      "With her bright-eyed enthusiasm, Beatrice flitted about social events, charming the upper crust of society in a bid to elevate her status. She was the life of the party, her laughter ringing out like music as she engaged with her peers. Yet, beneath the bubbly exterior lay a desperation that drove her ambition. She longed to escape the working-class roots that tethered her, and the fear of being discovered loomed like a dark cloud over her aspirations. The stakes were high, and she would do anything to protect the dream she had nurtured for so long.",
      "As the investigation progressed, Beatrice found herself grappling with her own moral dilemmas. The whispers of her past haunted her, and the fear of exposure became a constant companion. In her desperate pursuit of success, she questioned whether she was willing to betray those who had supported her. The tension between her ambition and her integrity created an internal conflict that left her feeling vulnerable and exposed.",
      "Determined to navigate the treacherous waters of high society, Beatrice relied on her wit and charm, often using sardonic humor to deflect attention from her insecurities. Yet, as the investigation unfolded and the truth threatened to surface, she realized that the very ambition that had propelled her forward might also lead to her undoing. The battle between her dreams and her conscience raged within her, and she knew that the resolution of this crime could determine her future."
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
    "type": "country house estate",
    "place": "Little Middleton",
    "country": "England",
    "summary": "A grand estate nestled within the lush English countryside, Little Middleton Manor serves as a retreat for the wealthy elite, shrouded in secrets and intrigue.",
    "visualDescription": "The manor is an imposing structure of weathered stone, with ivy creeping up its walls and tall chimneys that pierce the overcast sky. Surrounding the house are meticulously manicured gardens, filled with vibrant blooms and hedgerows that create a maze-like quality, hiding potential secrets.",
    "atmosphere": "A sense of foreboding lingers in the air, as the weather mirrors the tension among the guests, each hiding their own motives.",
    "paragraphs": [
      "Little Middleton Manor stands as a testament to opulence amid the encroaching shadows of the Great Depression. Its stone facade, worn yet dignified, carries the weight of numerous gatherings, whispers of laughter mingling with the haunting echoes of secrets long buried. The sprawling gardens, with their elaborate topiaries and fragrant roses, seem to breathe life into the estate, yet they also conceal dark corners where mischief and malice may lurk.",
      "As guests arrive in their polished automobiles, the sound of gravel crunching underfoot punctuates the otherwise serene atmosphere. Inside, the drawing room boasts heavy drapes that block out the dreary light, casting the space in a somber hue. The scent of polished mahogany mingles with the faint aroma of tobacco smoke, while the distant ticking of an ornate grandfather clock serves as an unsettling reminder that time is running out for one of them.",
      "Each room is a carefully curated tableau, yet beneath the surface, the air is thick with unease. Guests exchange glances filled with suspicion, their laughter strained, as they navigate the invisible boundaries dictated by social hierarchies. The staff moves like shadows, their access to the more intimate spaces restricted, leaving the guests to ponder what lies behind closed doors, and who among them might be hiding a deadly secret.",
      "As the clock strikes the hour, a palpable tension fills the air; the manor, with its hidden passages and locked rooms, becomes a character in its own right, harboring the truth of a conspiracy that threatens to unravel the lives of those who tread its opulent halls."
    ]
  },
  "atmosphere": {
    "era": "1930s",
    "weather": "Overcast with occasional rain showers, typical for the English countryside in late spring.",
    "timeFlow": "Three days of mounting tension as each hour draws the guests deeper into suspicion and intrigue.",
    "mood": "Tense and brooding, with an underlying sense of unease among the guests.",
    "eraMarkers": [
      "Guests converse over the crackling radio, the latest news reports mingling with classical music.",
      "Typewriters clack rhythmically in the study where correspondence is meticulously crafted.",
      "The faint ring of an early telephone can be heard, a reminder of the outside world beyond the estate."
    ],
    "sensoryPalette": {
      "dominant": "A heavy, moist scent of earth and damp stone permeates the air.",
      "secondary": [
        "The sweet fragrance of blooming roses, contrasting sharply with the musty odor of old books.",
        "The acrid scent of tobacco smoke lingering in the drawing room."
      ]
    },
    "paragraphs": [
      "The atmosphere is thick with unspoken words, as the clouds above threaten to unleash their burden upon the land. The rustle of leaves in the wind creates a haunting symphony, intertwining with the distant call of a cuckoo, echoing through the verdant grounds. The manor, while beautiful, casts a long shadow, as if it knows the secrets that reside within its walls.",
      "Inside, the flickering candlelight casts dancing shadows across the richly adorned wallpaper, a stark reminder of the wealth that surrounds the guests. Yet, amid the elegance, the air is laced with tension, as if every whisper carries the weight of suspicion. The scent of damp earth and polished wood creates a heady mix, evoking both comfort and dread as the evening unfolds."
    ]
  },
  "keyLocations": [
    {
      "id": "drawing_room",
      "name": "Drawing Room",
      "type": "interior",
      "purpose": "Gathering space for guests",
      "visualDetails": "The drawing room is lavishly furnished with deep velvet sofas and heavy curtains that block out the dreary daylight. Ornate chandeliers hang from the ceiling, their crystals glinting like trapped stars in the dimly lit space.",
      "sensoryDetails": {
        "sights": [
          "Richly patterned rugs cover the polished floor, while framed portraits of stern ancestors gaze down from the walls, their expressions seemingly alive with judgment.",
          "A grand piano sits in one corner, its surface gleaming, yet untouched, as if waiting for a performance that may never come."
        ],
        "sounds": [
          "The soft murmur of conversation fills the air, punctuated by the occasional clink of teacups, while the distant ticking of the grandfather clock provides an unsettling rhythm.",
          "Outside, the wind rustles the leaves, a sound that seems to whisper secrets of its own, mingling with the laughter that feels forced."
        ],
        "smells": [
          "The scent of polished wood and leather mingles with the rich aroma of Earl Grey tea, creating an atmosphere of indulgence.",
          "A faint trace of tobacco smoke hangs in the air, hinting at the presence of a clandestine conversation that has just taken place."
        ],
        "tactile": [
          "The cushions of the sofas are soft yet firm, inviting yet concealing the tension that lies beneath the surface.",
          "The air is cool and slightly damp, a reminder of the rain that has fallen outside, seeping into the very walls of the manor."
        ]
      },
      "accessControl": "The drawing room is accessible to all guests during social hours, but becomes a restricted area for staff during private gatherings.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Droplets cling to the windowpanes, distorting the view of the gardens outside.",
            "The muted colors of the room appear even more somber against the grey light."
          ],
          "sounds": [
            "The drumming of rain on the roof creates a rhythmic backdrop to the hushed conversations.",
            "Occasional thunder rumbles in the distance, adding a sense of foreboding."
          ],
          "smells": [
            "The dampness of the air mingles with the scent of blooming flowers from the garden.",
            "A hint of mildew from the corners of the room adds to the oppressive atmosphere."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The light in the room is flat and uninviting, casting long shadows that create an eerie sense of isolation.",
            "The flickering candles on the mantelpiece struggle against the gloom."
          ],
          "sounds": [
            "The silence is broken only by the creaking of the old house and the distant sound of a radio broadcasting news.",
            "A clock ticks loudly, marking the passing time with an ominous regularity."
          ],
          "smells": [
            "The scent of beeswax from the candles mingles with the musty odor of the old furniture.",
            "A trace of dust hangs in the air, a reminder of the secrets long forgotten."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Candlelight reflects off the polished surfaces, creating a warm glow that belies the tension in the room.",
            "The last light of day seeps through the curtains, casting a golden hue."
          ],
          "sounds": [
            "The distant laughter of guests mingles with the soft notes of a piano being played, creating a false sense of normalcy.",
            "The crackle of the fireplace adds a comforting sound that contrasts with the underlying tension."
          ],
          "smells": [
            "The rich aroma of burning wood fills the room, adding warmth to the chill in the air.",
            "The sweet scent of floral arrangements on the table brings a deceptive sense of tranquility."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The drawing room serves as the heart of Little Middleton Manor, a space where guests gather to exchange pleasantries, yet it is also a stage for the unspoken drama unfolding among the elite. With its heavy drapes and plush furnishings, the room offers a veneer of comfort that contrasts sharply with the tension simmering just beneath the surface. Every glance exchanged and every hushed whisper carries the weight of suspicion, as the guests navigate the treacherous waters of class and expectation.",
        "As the evening wears on, the atmosphere in the drawing room thickens, with the flicker of candlelight casting shadows over the guests' faces. Each laugh sounds brittle, as if it could shatter at any moment, while the air grows heavy with secrets. The scent of tobacco and polished wood envelops the space, creating an intoxicating mix that draws some in and repels others, as the clock continues its relentless ticking, counting down to an inevitable revelation."
      ]
    },
    {
      "id": "library",
      "name": "Library",
      "type": "interior",
      "purpose": "Restricted area for staff and select guests; potential source of clues",
      "visualDetails": "The library is a dimly lit room lined with towering shelves filled with leather-bound books, their spines cracked with age. A large oak table sits in the center, covered with a green felt cloth, and a single brass lamp casts a warm glow over the pages of an open book.",
      "sensoryDetails": {
        "sights": [
          "Dust motes dance in the beams of light filtering through the tall windows, creating an ethereal atmosphere amid the shadows.",
          "An ornate globe stands in one corner, its surface worn and faded, hinting at journeys long past."
        ],
        "sounds": [
          "The soft rustle of pages turning is almost reverent, as if the books themselves hold secrets waiting to be uncovered.",
          "A clock ticks softly in the background, its sound blending with the occasional creak of the house settling, creating a sense of timelessness."
        ],
        "smells": [
          "The rich scent of old books permeates the air, mingling with the faint aroma of polished wood and leather.",
          "A hint of mustiness lingers, a testament to the years of stories and knowledge contained within these walls."
        ],
        "tactile": [
          "The cool surface of the table contrasts with the warm glow of the lamp, inviting guests to linger and explore.",
          "The texture of the leather-bound books is smooth yet worn, each volume telling its own story through the feel of its pages."
        ]
      },
      "accessControl": "Access is strictly reserved for the estate's staff during the day, with select guests invited to peruse the collection during private gatherings.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops streak down the windows, blurring the view of the gardens outside.",
            "The dim light casts elongated shadows across the room, enhancing its mysterious ambiance."
          ],
          "sounds": [
            "The steady patter of rain against the glass creates a soothing backdrop, interrupted only by the occasional rustle of paper.",
            "The low murmur of voices from the drawing room filters in, creating an air of tension."
          ],
          "smells": [
            "The scent of damp earth from outside seeps in, mingling with the musty odor of the books.",
            "A hint of mildew adds to the oppressive atmosphere, as if the room itself is holding its breath."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The light is dim and muted, casting a gloomy pall over the room as shadows stretch across the shelves.",
            "The rich colors of the book spines seem to fade into the darkness."
          ],
          "sounds": [
            "The only sounds are the occasional creak of the floorboards and the soft rustle of pages being turned, creating an atmosphere of quiet contemplation.",
            "A distant clock ticks, echoing the passing time in this sanctuary of knowledge."
          ],
          "smells": [
            "The aroma of old paper and ink fills the air, a reminder of the countless stories waiting to be discovered.",
            "A faint scent of leather from the bindings adds a luxurious touch to the otherwise musty atmosphere."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "The warm glow of the lamp casts a cozy light over the table, inviting guests to delve into the volumes before them.",
            "Shadows flicker against the walls, creating a sense of intimacy amidst the looming darkness outside."
          ],
          "sounds": [
            "The room is filled with the soft sound of pages turning and the occasional crackle of the fireplace, enhancing the cozy ambiance.",
            "A distant clock chimes, marking the hour and reminding all of the passage of time."
          ],
          "smells": [
            "The scent of burning wood from the fireplace mingles with the rich aroma of old books, creating a comforting atmosphere.",
            "A hint of dust fills the air, a reminder of the many stories that have been left untold."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The library is a sanctuary of knowledge, yet it also harbors the potential for discovery and deception. Its towering shelves, filled with forgotten tomes, stand as guardians of secrets that might hold the key to unraveling the mystery at hand. The air is thick with the scent of aged paper and leather, inviting guests to explore the depths of its collection, while the shadows cast by the flickering lamp dance like specters among the books.",
        "As guests are drawn into the library's embrace, they find themselves surrounded by whispers of history and intrigue. Each book is a doorway to another world, yet some volumes may conceal more than just stories; they could hold the truth behind the clockwork conspiracy that threatens to entangle them all. The quiet rustle of pages turning is a reminder that knowledge, like time, can be both a comfort and a curse."
      ]
    },
    {
      "id": "master_suite",
      "name": "Master Suite",
      "type": "interior",
      "purpose": "Private quarters for the estate's owner; potential crime scene",
      "visualDetails": "The master suite is opulently decorated, with a four-poster bed draped in rich fabrics and a matching vanity adorned with ornate mirrors. The walls are lined with portraits of ancestors, their eyes following one as they move about the room.",
      "sensoryDetails": {
        "sights": [
          "Heavy drapes frame the tall windows, blocking out the light and creating an intimate yet oppressive atmosphere.",
          "A plush carpet muffles footsteps, adding to the sense of secrecy that envelops the space."
        ],
        "sounds": [
          "The soft creaking of the floorboards echoes as one moves about, punctuated by the distant sounds of laughter from the drawing room.",
          "The ticking of a wall clock serves as a constant reminder of the passing time, each tick echoing ominously in the silence."
        ],
        "smells": [
          "The air is thick with the scent of expensive perfume, mingling with the faint aroma of freshly polished wood.",
          "A hint of dust lingers in the corners, a reminder of the secrets that may have been left behind."
        ],
        "tactile": [
          "The coolness of the marble fireplace contrasts sharply with the warmth of the heavy bedding, creating a juxtaposition of comfort and unease.",
          "The textures of the fabrics are sumptuous yet heavy, evoking a sense of both luxury and confinement."
        ]
      },
      "accessControl": "The master suite is off-limits to all but the estate owner and select trusted staff, with strict rules about entry and privacy.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops trickle down the windowpanes, distorting the view of the gardens outside.",
            "The dim light filters through the curtains, casting a gloomy pall over the room."
          ],
          "sounds": [
            "The steady patter of rain creates a soothing yet melancholic backdrop, mingling with the distant sounds of the estate waking up.",
            "The faint echo of laughter from the drawing room feels distant and disconnected."
          ],
          "smells": [
            "The scent of damp earth wafts in through the slightly open window, mingling with the rich aroma of the fabrics.",
            "A trace of mildew adds to the oppressive atmosphere, hinting at secrets hidden within."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The light in the room is muted and shadowy, enhancing the feeling of isolation and introspection.",
            "The portraits on the walls seem to loom larger, their gazes heavy with expectation."
          ],
          "sounds": [
            "The ticking of the clock is pronounced in the silence, each tick echoing like a heartbeat in the stillness.",
            "The distant sounds of the estate's activities feel far removed, creating a sense of solitude."
          ],
          "smells": [
            "The air is thick with the scent of polished wood and expensive perfume, creating an air of opulence tinged with melancholy.",
            "A hint of dust hangs in the air, as if the room has been untouched for too long."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "The flickering candlelight casts dancing shadows across the room, creating a sense of intimacy and danger.",
            "The rich colors of the fabrics seem to come alive in the warm glow."
          ],
          "sounds": [
            "The soft rustle of fabric and the distant laughter from the drawing room create a deceptive sense of normalcy.",
            "The clock ticks steadily in the background, a reminder that time is running out."
          ],
          "smells": [
            "The scent of burning wax from the candles mingles with the rich aroma of the fabrics, creating a cozy yet foreboding atmosphere.",
            "A hint of tobacco smoke from the drawing room wafts in, adding to the sense of intrigue."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The master suite is a sanctuary of luxury, yet it is also a potential stage for betrayal. The opulent decor, with its heavy fabrics and ornate furnishings, creates an atmosphere of both comfort and confinement, where secrets may be whispered behind closed doors. The portraits of ancestors watch over the room, their expressions seemingly alive with judgment, as if they too know the weight of the truths that lie hidden.",
        "As night falls, the air grows thick with tension, and the master suite transforms into a realm of shadows. The flickering candlelight casts eerie shapes on the walls, while the ticking clock serves as a metronome for the gathering storm of suspicion. Each creak of the floorboards echoes like a warning, as the boundaries between trust and betrayal blur, and the clockwork conspiracy begins to unravel."
      ]
    },
    {
      "id": "gardens",
      "name": "Gardens",
      "type": "exterior",
      "purpose": "Outdoor space for guests; potential hiding spots and meeting places",
      "visualDetails": "The gardens are a sprawling expanse of manicured lawns and vibrant flowerbeds, interspersed with winding pathways and secluded nooks. A central fountain bubbles quietly, surrounded by benches where guests may gather or retreat.",
      "sensoryDetails": {
        "sights": [
          "Colorful blooms sway gently in the breeze, their petals vibrant against the backdrop of lush greenery.",
          "Tall hedgerows create a maze-like quality, offering glimpses of hidden corners where secrets may be exchanged."
        ],
        "sounds": [
          "The gentle sound of water cascading from the fountain provides a soothing soundtrack, mingling with the rustle of leaves.",
          "Birdsong fills the air, but beneath it lies an undercurrent of hushed whispers, hinting at conversations held away from prying eyes."
        ],
        "smells": [
          "The air is heady with the fragrance of blooming flowers, a mix of roses, lavender, and honeysuckle that entices and distracts.",
          "A hint of freshly cut grass mingles with the earthy scent of damp soil, grounding the lushness of the garden."
        ],
        "tactile": [
          "The coolness of the grass beneath one's feet contrasts with the warmth of the sun shining down, creating a pleasant sensation of comfort.",
          "The rough texture of the stone path provides a grounding feeling, leading one deeper into the garden's hidden secrets."
        ]
      },
      "accessControl": "The gardens are accessible to all guests during daylight hours, but certain areas are restricted to staff only, particularly where maintenance is required.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops cling to petals, creating a glistening effect that enhances the vibrant colors of the flowers.",
            "The path is slick and reflective, mirroring the grey skies above."
          ],
          "sounds": [
            "The patter of rain on leaves creates a rhythmic sound, punctuated by the occasional drip from branches.",
            "The distant rumble of thunder adds a sense of urgency to the otherwise serene setting."
          ],
          "smells": [
            "The scent of wet earth rises up, rich and potent, mingling with the sweet aroma of blooming flowers.",
            "A touch of mildew can be detected, hinting at the moisture that lingers in the air."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The colors appear muted under the grey sky, with shadows stretching across the garden, creating an eerie sense of isolation.",
            "The fountain's water appears dull, lacking the vibrancy of sunlight."
          ],
          "sounds": [
            "The quiet rustling of leaves is punctuated by the occasional call of a bird, creating a sense of stillness.",
            "The distant laughter of guests can be heard, but it feels disconnected from the garden's solitude."
          ],
          "smells": [
            "The aroma of wet grass is strong, mingling with the earthy scent of soil, creating a grounding atmosphere.",
            "A faint smell of decay from fallen leaves hints at the passage of time."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "The garden is bathed in the warm glow of the setting sun, casting long shadows that dance among the flowers.",
            "The fountain sparkles under the evening light, inviting guests to gather around."
          ],
          "sounds": [
            "The gentle trickle of water from the fountain harmonizes with the soft buzz of insects, creating a serene soundscape.",
            "Laughter from the drawing room drifts through the garden, creating a juxtaposition of joy and tension."
          ],
          "smells": [
            "The mingling scents of night-blooming jasmine and freshly mown grass create an intoxicating aroma in the evening air.",
            "A hint of smoke from a distant fire adds a touch of warmth and comfort to the atmosphere."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The gardens of Little Middleton Manor are a sanctuary of beauty and serenity, yet they hold the potential for secrets and intrigue. With their vibrant blooms and winding paths, the gardens invite guests to explore, but they also create opportunities for whispered conversations and clandestine meetings. The tall hedgerows offer concealment, allowing for the exchange of secrets away from the watchful eyes of the manor's inhabitants.",
        "As the sun sets and the shadows grow long, the gardens transform into a realm of tension and anticipation. The scent of blooming flowers mingles with the cool evening air, creating a sense of allure that draws guests deeper into the maze. Yet, beneath the surface beauty lies an undercurrent of danger, as the clockwork conspiracy begins to tick ever closer to its climax, and the gardens may very well hold the key to unraveling the truth."
      ]
    }
  ],
  "note": "",
  "cost": 0.00312253425,
  "durationMs": 46446
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1939,
    "month": "July",
    "day": null,
    "era": "1930s"
  },
  "seasonal": {
    "season": "summer",
    "month": "July",
    "weather": [
      "overcast with intermittent rain showers",
      "humid conditions",
      "occasional bursts of sunshine"
    ],
    "daylight": "Long daylight hours with sunset around nine o'clock, providing a mix of twilight and lingering evening light.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, when shadows deepen and conversations take on a more conspiratorial tone.",
    "holidays": [
      "Independence Day (observed in the United States)",
      "no major holidays in the UK"
    ],
    "seasonalActivities": [
      "garden parties and picnics",
      "evening strolls in the countryside",
      "attending summer fairs and local festivals"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "three-piece suit in light wool",
        "crisp white dress shirt",
        "silk tie with geometric patterns"
      ],
      "casual": [
        "linen trousers with a short-sleeved shirt",
        "lightweight blazer",
        "boater hat for sunny days"
      ],
      "accessories": [
        "cufflinks in silver or gold",
        "pocket watch with chain",
        "leather gloves"
      ]
    },
    "womensWear": {
      "formal": [
        "tea-length dress with floral prints",
        "straw hat adorned with ribbons",
        "pearl necklace"
      ],
      "casual": [
        "cotton blouse paired with a flowing skirt",
        "sundress with a cinched waist",
        "light cardigan for cool evenings"
      ],
      "accessories": [
        "handbag with intricate beading",
        "silk scarf tied around the neck",
        "sunglasses with oversized frames"
      ]
    },
    "trendsOfTheMoment": [
      "influence of Hollywood glamour on fashion",
      "rise of sportswear in casual settings",
      "use of bold floral patterns in women's clothing"
    ],
    "socialExpectations": [
      "strict adherence to class distinctions",
      "formal etiquette at social gatherings",
      "emphasis on modesty and propriety in women's attire"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "rising tensions in Europe as World War II looms",
      "Nazi Germany's aggressive expansionism",
      "the Munich Agreement's fallout causing political discourse"
    ],
    "politicalClimate": "Tense and uncertain, with growing fears of fascism influencing public opinion and political discussions.",
    "economicConditions": "Lingering effects of the Great Depression, with varying recovery rates across social classes creating class disparities.",
    "socialIssues": [
      "debates on civil liberties versus national security",
      "concerns about rising anti-Semitism",
      "struggles of the working class against unemployment"
    ],
    "internationalNews": [
      "Nazi-Soviet Pact signed in August 1939",
      "British and French military preparations for potential conflict",
      "evacuation plans for children from cities to the countryside"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Glenn Miller's 'In the Mood'",
        "Django Reinhardt's jazz stylings",
        "Bing Crosby's crooning"
      ],
      "films": [
        "'The Wizard of Oz'",
        "'Gone with the Wind'",
        "'Mr. Smith Goes to Washington'"
      ],
      "theater": [
        "'The Glass Menagerie'",
        "revival of classic Shakespeare plays",
        "new comedies reflecting social issues"
      ],
      "radio": [
        "BBC news broadcasts",
        "various musical variety shows",
        "detective stories being serialized"
      ]
    },
    "literature": {
      "recentPublications": [
        "'The Grapes of Wrath' by John Steinbeck",
        "'The Maltese Falcon' by Dashiell Hammett",
        "'The Old Man and the Sea' by Ernest Hemingway"
      ],
      "popularGenres": [
        "detective fiction",
        "social realism",
        "romantic novels reflecting societal changes"
      ]
    },
    "technology": {
      "recentInventions": [
        "early television broadcasts",
        "improved car designs with streamlined bodies",
        "advancements in radio technology"
      ],
      "commonDevices": [
        "home radios for entertainment and news",
        "typewriters for correspondence",
        "early telephones with party lines"
      ],
      "emergingTrends": [
        "increased reliance on mass media",
        "growing popularity of home cinema",
        "development of consumer gadgets"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Cinema ticket: one shilling",
        "Taxi fare across town: two shillings"
      ],
      "commonActivities": [
        "garden parties with tea and pastries",
        "picnics in local parks",
        "attending village fairs"
      ],
      "socialRituals": [
        "afternoon tea served with scones",
        "formal invitations sent for dinner parties",
        "local church gatherings on Sundays"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "strong class divisions still felt",
      "expectations of behavior based on social status"
    ],
    "gender": [
      "women increasingly participating in social and political discourse",
      "traditional roles still prevalent, especially among the upper classes",
      "emerging feminist movements advocating for equality"
    ],
    "race": [
      "growing awareness of racial issues due to immigration debates",
      "prevalent racial stereotypes in popular culture"
    ],
    "generalNorms": [
      "respect for tradition and decorum",
      "importance of reputation and social standing",
      "formal manners expected at all social gatherings"
    ]
  },
  "atmosphericDetails": [
    "The air is thick with the scent of wet earth following a summer rain, mingling with the floral aromas from the garden.",
    "The distant sounds of thunder rumble ominously, while the chatter of guests at the estate takes on a nervous edge.",
    "Curtains drawn against the dim light of the evening create a cozy yet oppressive atmosphere, inviting whispers of secrets and conspiracies."
  ],
  "paragraphs": [
    "In July 1939, the English countryside is cloaked in a tapestry of overcast skies, punctuated by the occasional glimmer of sunshine peeking through the clouds. Rain showers come and go, refreshing the vibrant greens of the estate grounds. The long summer evenings stretch into twilight, lending an air of unease as guests at the country house gather for dinner, their conversations revealing apprehensions about the unfolding political landscape in Europe. As tensions rise globally, the atmosphere is thick with unspoken fears, reminiscent of the brooding summer storms that threaten to break.",
    "Fashion among the guests reflects a blend of elegance and practicality, with men donning light wool suits, crisp white shirts, and patterned ties, while women grace the scene in tea-length dresses adorned with floral prints and wide-brimmed straw hats. Accessories such as pearl necklaces and leather gloves add an air of sophistication, embodying the glamour of the time while remaining mindful of the economic strains from the Great Depression. The duality of style and circumstance is palpable, as guests navigate the expectations of their social class amidst a backdrop of rising uncertainties.",
    "Daily life at the estate flows with an air of tradition, where afternoon tea rituals are punctuated by the clink of china and the aroma of freshly baked scones. Guests partake in garden parties, exchanging pleasantries while subtle glances betray their underlying preoccupations with the world outside. As evening descends, the strains of popular music from the radio fill the air, providing a fleeting escape from the mounting concerns of political strife and class tensions that permeate their conversations. These social rituals, while seemingly mundane, are layered with the weight of expectation and the reality of a rapidly changing world."
  ],
  "note": "",
  "cost": 0.0010918116,
  "durationMs": 14538
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A wealthy elite gathers at a country house estate for a weekend retreat, where the pressures of the Great Depression and class tensions simmer beneath the surface, creating an atmosphere ripe for intrigue and betrayal.",
  "era": {
    "decade": "1930s",
    "socialStructure": "The upper class grapples with diminishing fortunes, while the lower classes face hardship, leading to strained social interactions and rising tensions influenced by political unrest."
  },
  "setting": {
    "location": "A sprawling manor house surrounded by extensive gardens and woodlands",
    "institution": "country house estate",
    "weather": "Overcast with occasional rain showers, typical for the English countryside in late spring."
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
      "description": "The clock in the study stopped at ten minutes past eleven, and witnesses heard the victim mention an appointment at twenty minutes past eleven.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "The time of the victim's last known interaction.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_2",
      "category": "temporal",
      "description": "The murder could not have occurred after the clock stopped.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "Establishes a timeline for the murder.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_3",
      "category": "temporal",
      "description": "The shadows cast by the sun indicate that the clock must have been wound back.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "Suggests tampering with the clock.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_4",
      "category": "temporal",
      "description": "The time indicated by the clock is inaccurate due to tampering.",
      "sourceInCML": "CASE.inference_path.steps[1].correction",
      "pointsTo": "Confirms the clock's reliability is compromised.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_5",
      "category": "physical",
      "description": "The clock mechanism shows signs of tampering with fresh tool marks.",
      "sourceInCML": "CASE.inference_path.steps[2].observation",
      "pointsTo": "Indicates deliberate alteration of the clock.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_6",
      "category": "temporal",
      "description": "This indicates that someone adjusted the clock to mislead the timeline.",
      "sourceInCML": "CASE.inference_path.steps[2].correction",
      "pointsTo": "Points to intentional manipulation of time.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_mechanism_visibility_core",
      "category": "temporal",
      "description": "A mechanical clock was tampered with to mislead the timeline of the murder.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "Reveals the core mechanism of the crime.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_contradiction_chain",
      "category": "temporal",
      "description": "The murder could not have occurred after the clock stopped.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "Contradicts the timeline of events.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_core_elimination_chain",
      "category": "testimonial",
      "description": "Eliminates Dr. Mallory Finch because he has a confirmed alibi during the time of the murder.",
      "sourceInCML": "CASE.cast[1].alibi_window",
      "pointsTo": "Narrow the suspects towards Captain Ivor Hale.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_8",
      "category": "behavioral",
      "description": "Captain Ivor Hale had a desire to cover gambling debts, which could motivate him to commit the crime.",
      "sourceInCML": "CASE.cast[2].evidence_sensitivity[0]",
      "pointsTo": "Indicates a motive for Captain Ivor Hale.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_9",
      "category": "testimonial",
      "description": "Witnesses corroborate that the victim mentioned a meeting shortly before the clock stopped.",
      "sourceInCML": "CASE.inference_path.steps[0].required_evidence[0]",
      "pointsTo": "Supports the timeline of events leading to the murder.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_10",
      "category": "testimonial",
      "description": "Eliminates Beatrice Quill because she was seen at a different location at the time of the crime.",
      "sourceInCML": "CASE.cast[3].alibi_window",
      "pointsTo": "Narrow the focus back to Captain Ivor Hale.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_late_optional_slot_1",
      "category": "temporal",
      "description": "Comparing the tampered clock with the schedule of appointments reveals inconsistencies that can only be explained by tampering.",
      "sourceInCML": "CASE.inference_path.steps[2].required_evidence[0]",
      "pointsTo": "Reinforces the evidence of tampering.",
      "placement": "late",
      "criticality": "optional",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_culprit_direct_captain_ivor_hale",
      "category": "temporal",
      "description": "Direct evidence ties Captain Ivor Hale to the mechanism access point before the discriminating test.",
      "sourceInCML": "CASE.cast[2].access_plausibility",
      "pointsTo": "This direct evidence shows Captain Ivor Hale had means and opportunity, narrowing the solution uniquely toward the culprit.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    }
  ],
  "redHerrings": [
    {
      "id": "rh_1",
      "description": "Witnesses claim they saw the victim arguing with an unknown figure just before the minutes eleven.",
      "supportsAssumption": "The murder occurred after the clock stopped.",
      "misdirection": "This suggests a confrontation happened, but it does not directly connect to the witnesses of the crime."
    },
    {
      "id": "rh_2",
      "description": "The victim had a history of disputes with various individuals, which could imply multiple suspects.",
      "supportsAssumption": "The murder occurred after the clock stopped.",
      "misdirection": "While this suggests motive, it does not provide concrete evidence against any specific individual."
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
      "clue_mechanism_visibility_core",
      "clue_core_contradiction_chain",
      "clue_9",
      "clue_culprit_direct_captain_ivor_hale"
    ],
    "mid": [
      "clue_3",
      "clue_4",
      "clue_5",
      "clue_6",
      "clue_core_elimination_chain",
      "clue_8",
      "clue_10"
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
  "latencyMs": 13660,
  "cost": 0.00328234335
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

## Message 3 (role=user)

```text
The previous response failed validation with this error:
Schema validation failed on attempt 1: validationConfirmations is required

Please correct the issues and return a valid JSON object. Mandatory checks:
- All required fields are present
- characterPortraits has one entry per cast member
- characterVoiceSketches has one entry per cast member
- characterPortraits and characterVoiceSketches preserve CASE.cast name order exactly
- humourPlacementMap has all 12 scene positions, each with a non-empty rationale string
- Every humourPlacementMap entry must have a "rationale" field — this is required even for "forbidden" entries
- humourPlacementMap must include each required scenePosition exactly once (no missing/duplicate positions)
- validationConfirmations all set to true
- storyEmotionalArc.arcDescription MUST be at least 300 words (target 350). Count every word before submitting. A single dense paragraph is not enough — write multiple paragraphs tracing the emotional journey from opening through climax to resolution.
- storyTheme MUST be at least 25 words — a complete sentence with a subject, main clause, and nuanced qualifier. Not a title or fragment.
- revealImplications MUST be at least 90 words
- Return only the JSON object, no preamble
```

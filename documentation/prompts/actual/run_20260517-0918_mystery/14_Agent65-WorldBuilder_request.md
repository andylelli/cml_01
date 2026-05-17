# Actual Prompt Record

- Run ID: `mystery-1779009530668`
- Project ID: ``
- Timestamp: `2026-05-17T09:21:26.111Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `661015724eb2b7e4`

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
      "institution": "Country house estate (Manor house)"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "clock-tampering"
    }
  },
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "detective",
      "relationships": [],
      "public_persona": "Wealthy hostess and philanthropist",
      "private_secret": "Investigating hidden tensions among guests",
      "motive_seed": "Fear of financial ruin due to class tensions",
      "motive_strength": "strong",
      "alibi_window": "10:00 PM to 11:00 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "access to the clock",
        "knowledge of the schedule"
      ],
      "behavioral_tells": [
        "calm under pressure",
        "keen observer"
      ],
      "stakes": "Personal reputation and safety of guests",
      "evidence_sensitivity": [],
      "culprit_eligibility": "locked",
      "culpability": "guilty",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "suspect",
      "relationships": [
        "former mentor to Eleanor"
      ],
      "public_persona": "Respected physician",
      "private_secret": "Obsession with timekeeping",
      "motive_seed": "Desire for recognition",
      "motive_strength": "moderate",
      "alibi_window": "10:15 PM to 10:45 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "access to the clock",
        "knowledge of the manor layout"
      ],
      "behavioral_tells": [
        "nervous foot tapping",
        "frequent clock checks"
      ],
      "stakes": "Professional reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "35-45",
      "role_archetype": "suspect",
      "relationships": [
        "rival to Eleanor"
      ],
      "public_persona": "Charming war hero",
      "private_secret": "Struggling with personal debts",
      "motive_seed": "Financial desperation",
      "motive_strength": "strong",
      "alibi_window": "10:30 PM to 11:00 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "access to the clock",
        "distraction during party"
      ],
      "behavioral_tells": [
        "overly friendly demeanor",
        "inconsistent stories"
      ],
      "stakes": "Financial security",
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
        "assistant to Eleanor"
      ],
      "public_persona": "Dutiful servant",
      "private_secret": "In love with Captain Hale",
      "motive_seed": "Jealousy over attention",
      "motive_strength": "moderate",
      "alibi_window": "10:00 PM to 11:00 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "access to the clock",
        "knowledge of the household routines"
      ],
      "behavioral_tells": [
        "avoidance of eye contact",
        "anxious mannerisms"
      ],
      "stakes": "Loyalty to Eleanor versus love for Hale",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
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
      "summary": "During a lavish party at the sprawling Voss Manor, Eleanor Voss is found dead, her demise concealed by a cleverly tampered clock, leading to a web of intrigue and suspicion among the guests."
    },
    "accepted_facts": [
      "The clock stopped at ten minutes past eleven.",
      "Eleanor was last seen alive at ten o'clock.",
      "Dr. Mallory Finch was observed near the clock shortly before the murder."
    ],
    "inferred_conclusions": [
      "The murder must have occurred after the clock was tampered with.",
      "The timing of the murder is critical to determining the culprit."
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "The clock was wound back to create a false timeline for the murder.",
      "delivery_path": [
        {
          "step": "The clock was tampered with to show a later time."
        },
        {
          "step": "This misled everyone about when Eleanor was actually murdered."
        }
      ]
    },
    "outcome": {
      "result": "The murderer escaped unnoticed due to the false timeline."
    }
  },
  "false_assumption": {
    "statement": "The murder occurred shortly after the last sighting of Eleanor.",
    "type": "temporal",
    "why_it_seems_reasonable": "Witnesses recall seeing Eleanor last at ten o'clock.",
    "what_it_hides": "The clock was tampered with to misrepresent the time."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Eleanor was last seen at ten o'clock.",
        "The clock stopped at ten minutes past eleven."
      ],
      "windows": [
        "The murder occurred between 10:00 PM and 11:00 PM."
      ],
      "contradictions": [
        "Witness statements say Eleanor was alive at ten o'clock, but the clock shows a later time."
      ]
    },
    "access": {
      "actors": [
        "Eleanor Voss",
        "Dr. Mallory Finch",
        "Captain Ivor Hale",
        "Beatrice Quill"
      ],
      "objects": [
        "The clock",
        "The study",
        "Eleanor's notebook"
      ],
      "permissions": [
        "All suspects had access to the clock."
      ]
    },
    "physical": {
      "laws": [
        "The clock's mechanism requires manual intervention to change time."
      ],
      "traces": [
        "Scratch marks on the clock face indicating tampering."
      ]
    },
    "social": {
      "trust_channels": [
        "Eleanor's authority as hostess",
        "Dr. Finch's reputation as a physician"
      ],
      "authority_sources": [
        "Eleanor's status in society"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The clock in the study shows the time as ten minutes past eleven.",
        "correction": "Since Eleanor was last seen alive at ten o'clock, the clock must have been tampered with.",
        "effect": "Narrows the timeline of the murder, suggesting it was after ten o'clock.",
        "required_evidence": [
          "The clock was wound back by forty minutes.",
          "Eleanor was last seen alive at ten o'clock."
        ],
        "reader_observable": true
      },
      {
        "observation": "Witness statements confirm Eleanor was alive at ten o'clock.",
        "correction": "If the clock was tampered with, the time of death must be later than shown.",
        "effect": "Eliminates the possibility of death occurring before ten o'clock.",
        "required_evidence": [
          "The clock's hands were wound back forty minutes.",
          "Witness statements about Eleanor's last sighting."
        ],
        "reader_observable": true
      },
      {
        "observation": "Scratch marks on the clock face indicate tampering.",
        "correction": "The tampering would require someone to access the clock just before the murder.",
        "effect": "Narrows suspicion to those who had access to the clock.",
        "required_evidence": [
          "The clock's surface shows fresh scratches.",
          "Access records show all suspects were near the clock."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "The discriminating test compares clock, tamper, and study against the claimed timeline.",
    "knowledge_revealed": "The revealed facts are clock, tamper, and study.",
    "pass_condition": "The clock shows a different time than the accurate timepiece, confirming tampering.",
    "evidence_clues": [
      "clue_1",
      "clue_2",
      "clue_3",
      "clue_4"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The clock's tampering is evident from the scratches (early) and witness statements (mid) clarify the timeline. Step 2: The fresh scratch evidence (mid) eliminates other suspects. Step 3: The controlled clock comparison (discriminating test) directly proves the clock was manipulated."
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
        "Observe the clock's response to the test",
        "Draw conclusion about the tampering"
      ],
      "test_type": "comparison"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "His alibi is confirmed by witnesses, who saw him in the dining room.",
        "supporting_clues": [
          "Witness statements about his location",
          "His access records during the murder."
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Her alibi is verified through the staff schedule.",
        "supporting_clues": [
          "Staff schedules showing her duties at the time.",
          "Witness accounts of her activities."
        ]
      },
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: 10:30 PM to 11:00 PM",
        "supporting_clues": []
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with evidence from the clock."
    },
    "identity_rules": [],
    "clue_to_scene_mapping": [
      {
        "clue_id": "clue_1",
        "act_number": 1,
        "scene_number": 1,
        "delivery_method": "Direct observation of the clock."
      },
      {
        "clue_id": "clue_2",
        "act_number": 1,
        "scene_number": 2,
        "delivery_method": "Witness interviews."
      },
      {
        "clue_id": "clue_core_contradiction_chain",
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
        "clue_id": "clue_3",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Examination of the clock mechanism."
      },
      {
        "clue_id": "clue_4",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_5",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_6",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
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
        "clue_id": "clue_core_elimination_chain",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_culprit_direct_eleanor_voss",
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
    "summary": "Eleanor Voss is a local historian with a keen eye for the past, but her friendly demeanor masks a tumultuous history intertwined with the victim's family.",
    "publicPersona": "Eleanor is often seen as the amiable expert on the estate's storied history, charming visitors with tales that breathe life into faded portraits and dusty tomes. Her warmth makes her a beloved figure in Little Middleton, often organizing community events and lectures that draw crowds eager to learn about the local lore.",
    "privateSecret": "Beneath her affable exterior lies a heart weighed down by the remnants of a romantic relationship with the victim's late brother, which ended in bitterness. This past connection has left her grappling with unresolved feelings and a fierce desire to uncover the truth about the victim's potential inheritance, which may also affect her own family’s legacy.",
    "motiveSeed": "Eleanor's pursuit of the truth is not merely academic; it is deeply personal, as she seeks to understand how the victim's fate might intertwine with her own family's past.",
    "motiveStrength": "strong",
    "alibiWindow": "Eleanor claims to have been cataloguing artifacts in the estate library from 7 PM to 9 PM, a task that could potentially be verified by her notes and the presence of others.",
    "accessPlausibility": "possible",
    "stakes": "Her connection to the estate's scandalous past raises the stakes significantly, as she realizes that uncovering the truth could either vindicate her or expose long-buried secrets.",
    "humourStyle": "observational",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with a gentle cadence, often punctuating her thoughts with a light chuckle. She has a tendency to weave anecdotes into her conversations, using them as a bridge to connect with others. Occasionally, she slips into a more formal tone when discussing historical matters, a subtle reminder of her scholarly background.",
    "internalConflict": "Eleanor is torn between her desire for closure regarding her past relationship and the fear that uncovering the truth could lead to further heartbreak.",
    "personalStakeInCase": "This crime matters to Eleanor not only because of her historical ties but also due to her lingering feelings for the victim's brother and the potential impact on her family's reputation.",
    "paragraphs": [
      "Eleanor Voss stood before the grand shelves of the estate library, her fingers tracing the spines of dusty volumes that whispered secrets of Little Middleton's past. To the casual observer, she was merely a local historian, a friendly face eager to share the estate's rich tapestry of history. But beneath that genial exterior lay the tumult of personal memories, each artifact stirring echoes of a romance that had once flourished in the shadow of the family she now sought to understand.",
      "Her heart ached as she cataloged the artifacts, remnants of a life entwined with her own. The victim's late brother had been the light in her life, a beacon of possibility that had dimmed too soon. Their relationship had ended in turmoil, a bitter fallout that left her questioning her worth and place within the estate's storied walls. Now, with the victim's untimely demise, Eleanor felt an unshakeable pull to unearth the truth of their connection, one that could either redeem her past or expose her family's hidden skeletons.",
      "As she delved deeper into the investigation, Eleanor found herself grappling with the duality of her existence: the amiable historian everyone adored and the woman haunted by her unresolved feelings. Each clue she uncovered felt like a step closer to confronting the ghosts of her past. Yet, she feared that the truth might shatter the fragile peace she had built within herself. Was it worth risking her heart anew for answers that could lead to further anguish?",
      "In the quiet moments between her research, Eleanor often caught herself imagining what her life could have been had circumstances been different. Her pursuit of the truth was not merely for the sake of history but also a desperate attempt to reclaim her own narrative. As she stood surrounded by the remnants of others' stories, she understood that her own was still being written, and the choices she made now would define her future."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch is a respected local physician whose compassionate facade conceals a web of financial entanglements with the victim.",
    "publicPersona": "Known for his dedication to the community, Dr. Finch is often seen making house calls and offering a comforting presence to those in need. His gentle manner and authoritative medical opinion have earned him both respect and affection from the townsfolk, who often turn to him for guidance in health matters.",
    "privateSecret": "In the shadows of his esteemed reputation lies a troubling secret: he has been financially supporting the victim's gambling habit, a relationship that threatens to unravel his carefully constructed life.",
    "motiveSeed": "Dr. Finch fears exposure of their financial dealings, knowing that if the victim continues her gambling ways, his own reputation and standing in the community could be jeopardized.",
    "motiveStrength": "moderate",
    "alibiWindow": "He claims to have attended a dinner party at a neighboring estate from 6:30 PM until 8:30 PM, an event that could provide witnesses to his whereabouts.",
    "accessPlausibility": "unlikely",
    "stakes": "The potential loss of his social standing and professional reputation looms heavily over him, making him desperate to ensure that his secrets remain hidden.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.4,
    "speechMannerisms": "Dr. Finch speaks with a measured tone, often choosing his words carefully as if prescribing them. He employs a slight arch in his brow when conveying sarcasm, a subtle gesture that hints at his dry sense of humor. His speech is peppered with medical jargon, which he occasionally uses to deflect personal questions.",
    "internalConflict": "Dr. Finch wrestles with the guilt of his hidden support for the victim, feeling torn between his professional ethics and the need to protect his reputation.",
    "personalStakeInCase": "The stakes are personal for Dr. Finch, as the threat of exposure could lead to the collapse of the life he has built and the respect he has garnered over the years.",
    "paragraphs": [
      "Dr. Mallory Finch stood in his examination room, the familiar scent of antiseptic mingling with the faint traces of lavender from the potpourri his wife insisted on keeping. To the townsfolk of Little Middleton, he was a pillar of strength and compassion, a doctor whose gentle touch brought comfort to the ailing. Yet, beneath the surface lay a tempest of anxiety, swirling around the precarious financial support he had provided to the victim, a habit that had spiraled out of control.",
      "His evenings were often spent in the company of those who admired his medical prowess, yet the shadows of his secret gnawed at him like a persistent ache. The victim's gambling had become a burden he never intended to carry, one that threatened to unravel the very fabric of his carefully curated existence. As he navigated the social intricacies of high society, Dr. Finch often found himself grappling with the notion of his dual life: the compassionate physician and the clandestine benefactor entangled in a web of deceit.",
      "At the dinner party, he had worn a mask of joviality, laughing at the right moments and nodding as others spoke of trivial matters. But inside, his thoughts raced, plagued by the fear of what might happen if the truth were to surface. The victim's death could either be a salvation or a curse, depending on how the investigation unfolded. Would he be seen as a devoted friend, or would his hidden support paint him as a fool taken advantage of?",
      "As he pondered the consequences of his actions, Dr. Finch felt the weight of his profession bearing down on him. He had sworn an oath to do no harm, yet here he was, caught in a moral quagmire of his own making. The stakes had never been higher, and the path ahead was fraught with peril. Would he find a way to extricate himself from this mess, or would he be forced to confront the truth he so desperately wished to avoid?"
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale is a retired military officer whose gruff exterior hides a tumultuous past marked by tragedy and blame directed at the victim.",
    "publicPersona": "With a reputation as a no-nonsense figure, Captain Hale commands respect through his gruff demeanor and unwavering principles. His military background lends him an air of authority, and while some find him intimidating, others appreciate his straightforwardness and reliability.",
    "privateSecret": "Haunted by a tragic incident during the war, Captain Hale blames the victim for her perceived role in that dark chapter of his life, fueling a desire for revenge that complicates his moral compass.",
    "motiveSeed": "His longing for retribution against the victim stems from the belief that her actions contributed to his suffering, a notion that he clings to as a means of justifying his anger.",
    "motiveStrength": "moderate",
    "alibiWindow": "Witnesses claim he was seen arguing with a groundskeeper in the garden between 8 PM and 8:30 PM, an encounter that may have escalated his emotional state.",
    "accessPlausibility": "easy",
    "stakes": "For Captain Hale, the stakes are steep; he seeks redemption for his troubled past while wrestling with the demons of his own making.",
    "humourStyle": "blunt",
    "humourLevel": 0.3,
    "speechMannerisms": "Captain Hale's speech is direct and clipped, often laced with a military precision that leaves little room for ambiguity. He tends to use short, sharp sentences, and while he occasionally attempts humor, it often comes off as dry and unyielding.",
    "internalConflict": "Captain Hale grapples with the desire for revenge against the victim while recognizing that this anger is a mask for his own pain and regret.",
    "personalStakeInCase": "The case is personal for Captain Hale, as it forces him to confront his past traumas and the role that anger has played in shaping his life.",
    "paragraphs": [
      "Captain Ivor Hale stood in the fading light of the garden, his silhouette stark against the twilight sky. To the townsfolk, he was a figure of authority, a retired military officer whose no-nonsense approach earned him both respect and wariness. But beneath that gruff exterior lay a tempest of unresolved anger and pain, a burden he had carried since the war. The victim, in his eyes, symbolized everything that had gone wrong in a world that had once seemed so simple.",
      "His thoughts spiraled back to the past, to the moment when he lost everything he held dear. The victim's perceived involvement in that tragedy had etched a bitter mark on his soul, fueling a desire for revenge that had become a consuming fire. As he stood in the garden, arguing with the groundskeeper, his emotions flared, a reminder of how easily he could be set ablaze by memories he wished to forget.",
      "Though he had spent years trying to distance himself from the weight of his past, the victim's death forced him to confront the very demons he had sought to bury. Would he allow his anger to dictate his actions, or could he find a path toward forgiveness? As he wrestled with these questions, Captain Hale felt the pull of his own humanity, a flicker of hope that perhaps redemption was possible, even for someone as scarred as he.",
      "As the shadows deepened around him, he realized that the case was more than just a means of settling old scores; it was a chance to reclaim his own life from the clutches of bitterness. In the heart of Little Middleton, amidst the chaos of the investigation, Captain Hale stood at a crossroads, grappling with the choice between vengeance and healing."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill is a charming socialite and aspiring writer whose pursuit of success leads her into a web of desperation and moral ambiguity.",
    "publicPersona": "With her effortless charm and quick wit, Beatrice is a fixture in Little Middleton's high society. She navigates social events with grace, always seeking opportunities to network and gain favor with the influential. Her laughter is infectious, and her ability to engage others makes her a beloved presence at any gathering.",
    "privateSecret": "Beneath her polished exterior lies a desperate need for funds to publish her first novel, and the victim had been her last hope for financial backing, leaving her in a precarious position.",
    "motiveSeed": "The pressure of financial desperation pushes Beatrice to consider drastic measures, including the possibility of resorting to unethical tactics to secure her future.",
    "motiveStrength": "moderate",
    "alibiWindow": "She claims to have been chatting with guests in the drawing room from 7:30 PM onwards, a statement that could be corroborated by others.",
    "accessPlausibility": "possible",
    "stakes": "Her social future hinges on securing a wealthy patron, and the loss of the victim could mean the end of her dreams.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Beatrice speaks with a lively rhythm, often employing playful banter and sharp retorts. She has a knack for turning serious conversations into humorous exchanges, using her wit as both a shield and a social tool. Her laughter often punctuates her words, adding a buoyant quality to her dialogue.",
    "internalConflict": "Beatrice is torn between her ambition and her moral compass, struggling with the lengths she might go to achieve her dreams.",
    "personalStakeInCase": "The crime matters to Beatrice because the victim's death represents the loss of her last chance at securing a financial patron, forcing her to reevaluate her values and aspirations.",
    "paragraphs": [
      "Beatrice Quill flitted through the drawing room like a butterfly, her laughter ringing out like a melody amidst the chatter of high society. To those around her, she was the epitome of charm and grace, a socialite with dreams of becoming a renowned author. Yet, hidden beneath that sparkling exterior was a gnawing desperation, a need for funds that had become increasingly pressing as her aspirations grew.",
      "The victim had represented her last bastion of hope, a potential benefactor who could propel her writing career into the limelight. As Beatrice mingled with the guests, she couldn’t shake the feeling that her future hung by a thread, one that could snap at any moment. The weight of her financial woes pressed heavily on her shoulders, and the thought of losing her chance at success sent her mind racing into darker territories.",
      "While her laughter masked her worries, Beatrice felt the duality of her existence: the socialite adored by many and the aspiring writer on the verge of despair. Her wit and charm had always served her well, but as the investigation unfolded, she found herself questioning just how far she was willing to go to secure her dreams. Would she sacrifice her integrity for the sake of ambition, or could she find a way to navigate the treacherous waters of her aspirations without losing herself?",
      "In the days that followed, the news of the victim's death loomed over her like a storm cloud, forcing Beatrice to confront the fragility of her social standing. As she grappled with her own motivations, she realized that her journey was not just about attaining success but understanding the true value of integrity. The case had become a mirror, reflecting her innermost fears and desires, and she was left to ponder what kind of legacy she truly wished to leave behind."
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
    "type": "Country house estate (Manor house)",
    "place": "Little Middleton",
    "country": "England",
    "summary": "A sprawling manor house steeped in secrets, set amidst manicured gardens and dense woods, where the tension of recent social unrest simmers beneath the surface.",
    "visualDescription": "The manor's grand facade is adorned with ivy-clad stone and intricate leaded windows, while sprawling wings branch out like the gnarled branches of the ancient oaks that surround it. A cobblestone drive leads to the entrance, flanked by meticulously trimmed hedges and the occasional statue, hinting at the estate's opulent past.",
    "atmosphere": "Tense and foreboding, a palpable sense of suspicion weaves through the air as guests navigate the estate's labyrinthine corridors.",
    "paragraphs": [
      "Little Middleton Manor stands resolute against the overcast sky, its stone walls absorbing the damp chill of autumn. The rhythmic patter of rain against the windows creates a haunting melody, echoing the unspoken anxieties of the guests within. Each room, steeped in the scent of polished wood and stale tobacco, holds secrets waiting to be unearthed. Whispers of discontent linger in the air, each shadow seeming to harbor a hidden agenda.",
      "As the rain continues to fall, the gardens transform into a lush, green maze, where well-kept paths twist and turn through hedgerows and flowerbeds. The scent of wet earth mingles with the sweetness of blooming roses, creating an intoxicating atmosphere that belies the tension brewing inside the manor. The isolation of the estate, miles from the nearest village, amplifies the feeling of entrapment, as if the walls themselves conspire to keep the truth hidden.",
      "With every tick of the ornate grandfather clock in the foyer, time feels suspended, stretching the moments into an eternity of uncertainty. The manor's hidden passages, known only to a few, promise both escape and concealment. As the evening descends, candlelight flickers across the dark oak furniture, casting long shadows that dance along the walls, hinting at the secrets that lurk just out of sight.",
      "In the drawing room, the heavy velvet drapes are drawn tight, blocking out the dreary light and creating a cocoon of intimacy that feels almost claustrophobic. The crackling fire in the hearth struggles to ward off the encroaching chill, while the scent of beeswax candles mingles with the musty aroma of old books lining the shelves. Here, amidst the opulence, the undercurrents of class tension and suspicion rise like steam from a pot, threatening to boil over at any moment."
    ]
  },
  "atmosphere": {
    "era": "1930s",
    "weather": "Overcast with sporadic rain, typical of the British countryside in the fall, affecting visibility and mood.",
    "timeFlow": "Three days of mounting tension as guests arrive and secrets unfold.",
    "mood": "Tense and foreboding due to recent social unrest and economic hardship, creating an atmosphere of suspicion among the guests.",
    "eraMarkers": [
      "Petrol automobiles parked along the cobblestone drive",
      "Typewriters clattering in the study",
      "Early telephones ringing in the hall"
    ],
    "sensoryPalette": {
      "dominant": "The pervasive scent of damp earth and old wood",
      "secondary": [
        "Crackling fire in the hearth",
        "Faint whispers lingering in the air",
        "The rhythmic patter of rain on windows"
      ]
    },
    "paragraphs": [
      "The air is thick with the scent of rain-soaked earth and the faint musk of old wood, creating an atmosphere ripe with tension. Shadows play tricks on the eye, and every creak of the manor seems to echo with the secrets it holds. Outside, the gardens glisten with moisture, their beauty marred by the foreboding skies above. The world feels suspended, caught between the past and an uncertain future, as the manor stands sentinel over its inhabitants.",
      "Flickering candlelight casts a warm glow against the cold stone walls, creating a stark contrast to the chill that seeps through the manor. The sounds of the outside world are muffled, as if the estate itself is a sanctuary from the turmoil beyond its gates. Yet, within these walls, the tension is palpable; every glance, every hushed conversation, holds the weight of unspoken truths, waiting to unravel in the face of the looming storm."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Library",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "Shelves lined with dusty tomes, a large oak table at the center, and a faintly flickering candle casting shadows.",
      "sensoryDetails": {
        "sights": [
          "Dust motes dancing in candlelight",
          "Dark oak shelves filled with leather-bound books",
          "Faded wallpaper peeling at the edges"
        ],
        "sounds": [
          "The crackle of wax melting",
          "Whispers of pages turning",
          "Distant thunder rumbling outside"
        ],
        "smells": [
          "Mildew and old parchment",
          "Beeswax from burning candles",
          "The musty scent of leather bindings"
        ],
        "tactile": [
          "Worn leather armchair",
          "Cold brass doorknob",
          "Smooth, polished wood of the table"
        ]
      },
      "accessControl": "Restricted to family and select guests; staff may enter only for cleaning during the day.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Rain-smeared windows",
            "Dull light filtering through clouds",
            "Puddles forming on the wooden floor"
          ],
          "sounds": [
            "Steady drumming of rain on the roof",
            "The rustle of paper in the quiet",
            "The distant sound of thunder"
          ],
          "smells": [
            "Damp wood and mildew",
            "The tang of fresh rain",
            "Cold stone from the fireplace"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "Flat grey light illuminating the room",
            "Deepening shadows in the corners",
            "The flicker of candle flames"
          ],
          "sounds": [
            "Silence interrupted by the ticking clock",
            "Occasional creaking of the house settling",
            "Whispers of guests in adjacent rooms"
          ],
          "smells": [
            "Dust and old books",
            "Wood smoke from the hearth",
            "Beeswax from the candles"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Candlelight reflecting off polished wood",
            "Long shadows stretching across the floor",
            "Soft glow of the fireplace"
          ],
          "sounds": [
            "The crackling fire",
            "Distant laughter from the drawing room",
            "The tick of the grandfather clock"
          ],
          "smells": [
            "Warm wood and candle wax",
            "The scent of pipe tobacco",
            "The lingering aroma of dinner"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The library, often a refuge for the manor's inhabitants, now bears the weight of tragedy. Dusty tomes stand sentinel over the oak table, where the remnants of a struggle are evident. Shadows cling to the corners, hiding secrets that the flickering candlelight can barely reveal. As the rain drums steadily outside, the atmosphere inside thickens with the tension of unspoken fears and the potential for revelation.",
        "In this room of knowledge, the air is heavy with the scent of old parchment and beeswax. Every creak of the floorboards seems amplified, a reminder that the past is never truly behind us. The library's allure of wisdom is overshadowed by the grim reality of its current purpose, as whispers of the past and present collide in a cacophony of suspicion and dread."
      ]
    },
    {
      "id": "drawing_room",
      "name": "The Drawing Room",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "Lavishly furnished with plush sofas, ornate rugs, and a grand piano in the corner, adorned with family portraits.",
      "sensoryDetails": {
        "sights": [
          "Rich tapestry curtains drawn against the light",
          "Glistening chandelier casting soft light",
          "Family portraits lining the walls"
        ],
        "sounds": [
          "The soft notes of piano music",
          "Laughter echoing from the guests",
          "The rustle of silk dresses"
        ],
        "smells": [
          "Fresh flowers in a vase",
          "The scent of polished wood",
          "Hints of perfume lingering in the air"
        ],
        "tactile": [
          "Soft velvet upholstery",
          "Cool marble fireplace mantle",
          "Worn silk cushions"
        ]
      },
      "accessControl": "Accessible to all guests during social hours; off-limits to staff unless summoned.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Dim light filtering through rain-drenched windows",
            "Puddles forming on the polished floor",
            "Drapes heavy with moisture"
          ],
          "sounds": [
            "Raindrops tapping against the window",
            "The soft sound of fabric rustling",
            "Quiet murmurs of guests conversing"
          ],
          "smells": [
            "Wet fabric and dust",
            "The faint scent of damp flowers",
            "Cold stone from the fireplace"
          ],
          "mood": "melancholic"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "Grey light casting long shadows",
            "The flicker of candle flames",
            "Guests huddled in small groups"
          ],
          "sounds": [
            "The clinking of teacups",
            "Distant laughter echoing",
            "The rustle of newspaper pages"
          ],
          "smells": [
            "Tea steeping in china cups",
            "The scent of fresh pastries",
            "Wood smoke from the hearth"
          ],
          "mood": "tense intimacy"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Candlelight dancing across the room",
            "Guests in evening attire",
            "The gleam of glassware on the table"
          ],
          "sounds": [
            "Lively conversation and laughter",
            "The soft notes of piano music",
            "The crackling of the fire"
          ],
          "smells": [
            "Rich aromas of dinner wafting in",
            "The scent of polished wood and leather",
            "Hints of perfume and cologne"
          ],
          "mood": "festive yet strained"
        }
      ],
      "paragraphs": [
        "The drawing room, with its lavish furnishings and ornate decor, serves as the heart of the manor’s social gatherings. Here, laughter mingles with the soft strains of piano music, creating an atmosphere of elegance and charm. Yet beneath the surface, the tension is palpable, as guests exchange furtive glances and whispered conversations hint at hidden agendas. The flickering candlelight reflects off the polished surfaces, casting shadows that seem to deepen the secrets lurking just out of sight.",
        "As day turns to evening, the room transforms into a cocoon of intimacy, the laughter growing louder, the conversations more animated. Yet, the underlying current of suspicion remains, a reminder that within these walls, every smile could mask a motive. The drawing room, once a symbol of comfort, now feels like a stage where the players are all too aware of the stakes at hand, and the clock ticks ominously in the background."
      ]
    },
    {
      "id": "study",
      "name": "The Study",
      "type": "interior",
      "purpose": "Private meeting space",
      "visualDetails": "A dark, wood-paneled room filled with books, a large desk cluttered with papers, and a globe in the corner.",
      "sensoryDetails": {
        "sights": [
          "Heavy curtains drawn tight against the light",
          "A large mahogany desk covered in documents",
          "Shelves brimming with leather-bound books"
        ],
        "sounds": [
          "The scratch of a pen on paper",
          "The ticking of a clock",
          "Quiet rustling of documents"
        ],
        "smells": [
          "Fresh ink and paper",
          "The scent of polished wood",
          "Hints of tobacco smoke lingering"
        ],
        "tactile": [
          "Smooth surface of the desk",
          "Cool brass handles on drawers",
          "Worn leather of the chair"
        ]
      },
      "accessControl": "Strictly off-limits to all but the owner and select guests; staff may not enter without permission.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Dim light struggling to penetrate the curtains",
            "Raindrops sliding down the glass",
            "The cluttered desk under a pall of grey"
          ],
          "sounds": [
            "Rain tapping against the window",
            "The quiet whisper of paper being shuffled",
            "The distant sound of thunder"
          ],
          "smells": [
            "The scent of damp wood",
            "Fresh ink and paper",
            "Hints of mildew from the corners"
          ],
          "mood": "claustrophobic"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "Shadows pooling in the corners",
            "A single beam of light illuminating the desk",
            "The clock ticking loudly in the silence"
          ],
          "sounds": [
            "The steady tick of the clock",
            "The rustle of papers",
            "Occasional creaks of the house settling"
          ],
          "smells": [
            "Wood polish and tobacco smoke",
            "The musty scent of old books",
            "The faint aroma of coffee"
          ],
          "mood": "tense focus"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Soft glow of a single lamp on the desk",
            "The warmth of candlelight flickering",
            "Shadows dancing along the walls"
          ],
          "sounds": [
            "The soft rustling of papers",
            "The distant sound of laughter from the drawing room",
            "The tick of the clock marking the passage of time"
          ],
          "smells": [
            "Cedar and leather",
            "The lingering scent of ink",
            "Hints of pipe tobacco"
          ],
          "mood": "reflective"
        }
      ],
      "paragraphs": [
        "The study, with its dark wood paneling and cluttered desk, is a world apart from the rest of the manor. Here, amidst the scent of ink and leather, the air is thick with the weight of unspoken decisions. The heavy curtains block out the outside world, creating an atmosphere of isolation that is both comforting and stifling. Every tick of the clock seems to echo in the silence, a reminder of time slipping away as secrets threaten to unravel.",
        "In this room, the shadows seem to whisper, and every creak of the floorboards carries with it a sense of urgency. The clutter of documents and books reflects the chaos of thoughts racing through the owner's mind. As evening descends, the soft glow of a lamp casts long shadows across the desk, transforming the space into a sanctuary of reflection, where the weight of the situation presses heavily on the shoulders of those who dare to enter."
      ]
    },
    {
      "id": "gardens",
      "name": "The Gardens",
      "type": "exterior",
      "purpose": "Potential hiding spots and clue discovery",
      "visualDetails": "Lush, manicured lawns dotted with flower beds and winding paths leading into dense woods.",
      "sensoryDetails": {
        "sights": [
          "Vibrant flowers swaying in the breeze",
          "Tall hedges creating natural barriers",
          "Sunlight breaking through the clouds"
        ],
        "sounds": [
          "Birds chirping in the trees",
          "The rustle of leaves in the wind",
          "Distant sounds of laughter from the manor"
        ],
        "smells": [
          "Freshly mown grass",
          "The sweet scent of blooming flowers",
          "The earthy aroma of damp soil"
        ],
        "tactile": [
          "Soft grass underfoot",
          "Cool breeze brushing against the skin",
          "The rough texture of tree bark"
        ]
      },
      "accessControl": "Open to all guests during daylight hours; restricted access after dark.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops clinging to petals",
            "The ground glistening with moisture",
            "Clouds casting a grey pall over the garden"
          ],
          "sounds": [
            "Rain tapping on leaves",
            "The soft squelch of mud underfoot",
            "Distant thunder rumbling"
          ],
          "smells": [
            "Wet earth and rain-soaked grass",
            "The scent of damp flowers",
            "Faint aroma of decaying foliage"
          ],
          "mood": "somber"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "Muted colors beneath the grey sky",
            "Shadows cast by hedges",
            "The distant outline of the manor"
          ],
          "sounds": [
            "The wind rustling through the trees",
            "Distant laughter fading in the background",
            "The soft sound of footsteps on gravel"
          ],
          "smells": [
            "The scent of earth and foliage",
            "Hints of flowers beginning to wilt",
            "The dampness of the air"
          ],
          "mood": "melancholic"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "The last rays of sun illuminating the flowers",
            "Fireflies flickering as night falls",
            "The silhouettes of trees against the twilight sky"
          ],
          "sounds": [
            "The chirping of crickets",
            "Soft whispers of guests wandering",
            "The rustle of leaves in a gentle breeze"
          ],
          "smells": [
            "The sweet scent of night-blooming flowers",
            "Fresh grass underfoot",
            "The coolness of night air"
          ],
          "mood": "tranquil yet eerie"
        }
      ],
      "paragraphs": [
        "The gardens of Little Middleton Manor, with their vibrant colors and manicured lawns, offer an inviting facade that contrasts sharply with the tension brewing within the house. As rain falls softly, the petals of flowers glisten, and the air is thick with the scent of damp earth and blooming flora. The winding paths lead into the shadows of the dense woods, where secrets may lie hidden, waiting to be uncovered amidst the beauty.",
        "In the evening, the gardens transform into a realm of shadows, where the last light of day casts an ethereal glow over the landscape. The soft chirping of crickets fills the air, creating a serene ambiance that belies the uncertainty looming over the estate. Here, among the flickering fireflies and swaying flowers, the gardens are both a sanctuary and a potential stage for the unfolding drama, where every rustle may signal the approach of revelation or danger."
      ]
    }
  ],
  "note": "",
  "cost": 0.0026587489500000004,
  "durationMs": 28930
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1931,
    "month": "August",
    "day": 15,
    "era": "1930s"
  },
  "seasonal": {
    "season": "summer",
    "month": "August",
    "weather": [
      "overcast with sporadic rain",
      "humid air with occasional gusts of wind",
      "cool evenings that hint at the coming autumn"
    ],
    "daylight": "Long summer days with daylight lasting until about eight-thirty in the evening, though the clouds often obscure the sun.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, after dinner has concluded",
    "holidays": [
      "Notting Hill Carnival (begins in late August)"
    ],
    "seasonalActivities": [
      "garden parties with tea and croquet",
      "evening strolls along the estate grounds",
      "visiting nearby fairs and local markets"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "tailored morning coat",
        "waistcoat in muted colors",
        "crisp white shirt with a stiff collar"
      ],
      "casual": [
        "tweed flat cap",
        "cotton trousers",
        "lightweight summer blazer"
      ],
      "accessories": [
        "polished leather shoes",
        "silver pocket watch",
        "silk cravat"
      ]
    },
    "womensWear": {
      "formal": [
        "elegant tea dress with floral patterns",
        "lightweight silk evening gown",
        "tailored jacket with a cinched waist"
      ],
      "casual": [
        "cotton blouse with puffed sleeves",
        "A-line skirt",
        "straw hat adorned with ribbons"
      ],
      "accessories": [
        "pearl necklace",
        "dainty gloves",
        "handbag with intricate beadwork"
      ]
    },
    "trendsOfTheMoment": [
      "Art Deco influences in design",
      "flapper styles gradually evolving",
      "the popularity of sportswear among women"
    ],
    "socialExpectations": [
      "men expected to wear hats outdoors",
      "women should maintain modesty in dress",
      "strict adherence to etiquette in social gatherings"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "rising unemployment rates due to the Great Depression",
      "political unrest with growing support for fascist movements",
      "international tensions following the disarmament conferences"
    ],
    "politicalClimate": "Increasing tensions with the rise of the British Union of Fascists and the impact of economic hardship on the working class.",
    "economicConditions": "Widespread economic distress; many families struggling with unemployment and poverty.",
    "socialIssues": [
      "class disparity widening",
      "increasing public protests against government policies",
      "debates on women's rights gaining traction"
    ],
    "internationalNews": [
      "Germany's political landscape shifting towards extremism",
      "rising anti-colonial sentiment in India",
      "the ongoing effects of the Wall Street Crash felt globally"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "'The Lady Is a Tramp' by the popular bands of the day",
        "'Ain't She Sweet' by Al Jolson",
        "'It Ain't Necessarily So' from Porgy and Bess"
      ],
      "films": [
        "'City Lights' starring Charlie Chaplin",
        "'Frankenstein' directed by James Whale",
        "'The Front Page' with Adolphe Menjou"
      ],
      "theater": [
        "'The Royal Family' by George S. Kaufman",
        "'The Cat and the Moon' by W.B. Yeats",
        "'The Skin of Our Teeth' by Thornton Wilder"
      ],
      "radio": [
        "The BBC's evening broadcasts featuring classical music",
        "Variety shows featuring popular comedians",
        "News programs discussing current events"
      ]
    },
    "literature": {
      "recentPublications": [
        "'Murder in the Mews' by Agatha Christie",
        "'The Glass Key' by Dashiell Hammett",
        "'To the Lighthouse' by Virginia Woolf"
      ],
      "popularGenres": [
        "detective fiction",
        "social realism",
        "modernist literature"
      ]
    },
    "technology": {
      "recentInventions": [
        "the first commercially available radio receiver",
        "advances in aviation with the introduction of passenger airlines",
        "emergence of household appliances like electric irons"
      ],
      "commonDevices": [
        "petrol-powered automobiles",
        "landline telephones in homes",
        "manual typewriters"
      ],
      "emergingTrends": [
        "growth of the film industry with sound technology",
        "increased availability of consumer goods",
        "expansion of public transportation systems"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Cinema ticket: one shilling",
        "Bottle of milk: seven pence"
      ],
      "commonActivities": [
        "afternoon tea with scones and jam",
        "visiting local fairs and community events",
        "participating in sports like cricket and tennis"
      ],
      "socialRituals": [
        "formal dinner parties with multiple courses",
        "Sunday church services followed by family gatherings"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "upper classes maintaining strict social hierarchies",
      "growing resentment towards the wealthy from the working class"
    ],
    "gender": [
      "women increasingly seeking independence and employment",
      "men expected to be the primary breadwinners",
      "traditional gender roles still prevalent"
    ],
    "race": [
      "racial tensions due to economic disparities",
      "growing awareness and advocacy for racial equality"
    ],
    "generalNorms": [
      "politeness and decorum highly valued",
      "social gatherings centered around established etiquette",
      "stigma against those in poverty"
    ]
  },
  "atmosphericDetails": [
    "The smell of damp earth and lush green grass permeates the air as summer wanes, with the scent of impending rain lingering.",
    "The muted sounds of distant thunder rumble over the estate, heightening the sense of unease amongst the guests gathered at the manor.",
    "The flickering gas lamps cast shadows across the elegantly set dining room, where the tension of conversation hangs thick like the humidity outside."
  ],
  "paragraphs": [
    "In August 1931, the British countryside is alive with the last bursts of summer, though the clouds gather ominously overhead. The overcast skies bring intermittent rain, and the air is thick with humidity, hinting at the autumn chill that will soon settle in. Guests at the country estate find themselves caught between the leisurely pursuits of garden parties and the tense reality of an economically strained nation. As they enjoy tea and croquet on the manicured lawns, whispers of social unrest and rising unemployment swirl like the winds that rustle the trees.",
    "Fashion during this summer is a blend of elegance and practicality, with men donning tailored morning coats and crisp white shirts, while women elegantly sport floral tea dresses and lightweight jackets. The attire reflects a desire to uphold social norms amidst the looming economic crisis, with every detail meticulously chosen to convey status and sophistication. Accessories like polished leather shoes and pearl necklaces are common, with the upper class keen to maintain appearances despite the growing class tensions brewing outside their garden walls.",
    "Daily life in this period is marked by a strict adherence to social rituals, with formal dinner parties featuring multiple courses and afternoon tea serving as a platform for gossip and intrigue. As the guests navigate their social interactions, they are keenly aware of the economic distress affecting their peers and the rising tide of political movements that challenge their way of life. The typical prices of goods like bread and cinema tickets reflect the economic struggles faced by many, accentuating the divide between the affluent and the working class. In this tense atmosphere, every interaction is laced with suspicion, as guests wonder what secrets lie beneath the surface."
  ],
  "note": "",
  "cost": 0.0010920723,
  "durationMs": 12466
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A gathering at the estate for a wealthy benefactor's birthday is overshadowed by class tensions and the looming threat of social upheaval, binding the guests in a web of suspicion and hidden motives.",
  "era": {
    "decade": "1930s",
    "socialStructure": "The Great Depression exacerbates class divides, with rising fascism influencing political discourse and strict hierarchies dictating interactions within the estate."
  },
  "setting": {
    "location": "A sprawling manor house surrounded by manicured gardens and dense woods, isolated from the nearest town.",
    "institution": "Country house estate (Manor house)",
    "weather": "Overcast with sporadic rain, creating a tense and foreboding atmosphere."
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
    "id": "murder_time",
    "value": "a quarter past ten",
    "description": "The actual time of the murder based on the tampered clock"
  },
  {
    "id": "distance_to_exit",
    "value": "thirty feet",
    "description": "The distance from the clock room to the nearest exit"
  }
]

### CLUE_DISTRIBUTION
{
  "clues": [
    {
      "id": "clue_1",
      "category": "temporal",
      "description": "The clock in the study shows the time as ten minutes past eleven.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "Indicates the time displayed on the clock at the scene.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_2",
      "category": "temporal",
      "description": "Witness statements confirm Eleanor was alive at ten o'clock.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "Establishes a timeline of Eleanor's last known moment.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_3",
      "category": "temporal",
      "description": "Scratch marks on the clock face indicate tampering.",
      "sourceInCML": "CASE.inference_path.steps[2].observation",
      "pointsTo": "Suggests that the clock has been manipulated.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_4",
      "category": "temporal",
      "description": "If the clock was tampered with, the time of death must be later than shown.",
      "sourceInCML": "CASE.inference_path.steps[2].correction",
      "pointsTo": "Contradicts the timeline established by the clock.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_5",
      "category": "temporal",
      "description": "The tampering would require someone to access the clock just before the murder.",
      "sourceInCML": "CASE.inference_path.steps[1].correction",
      "pointsTo": "Implies premeditated action to alter the clock's time.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_mechanism_visibility_core",
      "category": "temporal",
      "description": "The clock was wound back to create a false timeline for the murder.",
      "sourceInCML": "CASE.inference_path.steps[0].required_evidence[0]",
      "pointsTo": "Reveals the method used to mislead the timeline.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_contradiction_chain",
      "category": "temporal",
      "description": "Since Eleanor was last seen alive at ten o'clock, the clock must have been tampered with.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "Contradicts the assumption that the clock time is accurate.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_core_elimination_chain",
      "category": "testimonial",
      "description": "Eliminates Dr. Mallory Finch because he has an alibi confirmed by multiple witnesses.",
      "sourceInCML": "CASE.cast[1].alibi_window",
      "pointsTo": "Dr. Mallory Finch was not present at the time of the murder.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_6",
      "category": "behavioral",
      "description": "Eleanor Voss showed signs of distress due to financial issues.",
      "sourceInCML": "CASE.cast[0].access_plausibility",
      "pointsTo": "Indicates a motive for potential premeditation.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_7",
      "category": "testimonial",
      "description": "Eliminates Captain Ivor Hale because he was seen at a different location during the murder.",
      "sourceInCML": "CASE.cast[2].alibi_window",
      "pointsTo": "Captain Ivor Hale has a corroborated alibi.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_8",
      "category": "testimonial",
      "description": "Eliminates Beatrice Quill because she has a solid alibi verified by her husband.",
      "sourceInCML": "CASE.cast[3].alibi_window",
      "pointsTo": "Beatrice Quill was not at the scene of the crime.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_culprit_direct_eleanor_voss",
      "category": "temporal",
      "description": "Direct evidence ties Eleanor Voss to the mechanism access point before the discriminating test.",
      "sourceInCML": "CASE.cast[0].access_plausibility",
      "pointsTo": "This direct evidence shows Eleanor Voss had means and opportunity, narrowing the solution uniquely toward the culprit.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_late_optional_slot_1",
      "category": "temporal",
      "description": "Eleanor was last seen at ten o'clock. remains a late texture detail in the case background.",
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
      "description": "Scratch marks on the clock face indicate tampering.",
      "sourceInCML": "CASE.inference_path.steps[2].correction",
      "pointsTo": "The tampering would require someone to access the clock just before the murder.",
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
      "clue_mechanism_visibility_core",
      "clue_core_contradiction_chain"
    ],
    "mid": [
      "clue_3",
      "clue_4",
      "clue_5",
      "clue_core_elimination_chain",
      "clue_6",
      "clue_7",
      "clue_8",
      "clue_culprit_direct_eleanor_voss",
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
  "latencyMs": 9398,
  "cost": 0.0030165596999999996
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

# Actual Prompt Record

- Run ID: `mystery-1778707884982`
- Project ID: ``
- Timestamp: `2026-05-13T21:34:39.152Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `42c470a54613ea31`

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
      "institution": "Country house estate"
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
      "role_archetype": "Victim",
      "relationships": [
        "Dr. Mallory Finch: friend",
        "Captain Ivor Hale: acquaintance",
        "Beatrice Quill: detective"
      ],
      "public_persona": "Affluent socialite",
      "private_secret": "Debt due to gambling",
      "motive_seed": "Financial desperation",
      "motive_strength": "high",
      "alibi_window": "9 PM to 10 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "The garden entrance",
        "The library windows"
      ],
      "behavioral_tells": [
        "Frequent visits to the library",
        "Late night walks in the garden"
      ],
      "stakes": "Her social reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "Friend",
      "relationships": [
        "Eleanor Voss: close friend",
        "Captain Ivor Hale: acquaintance",
        "Beatrice Quill: detective"
      ],
      "public_persona": "Respected physician",
      "private_secret": "Unrequited love for Eleanor",
      "motive_seed": "Jealousy",
      "motive_strength": "moderate",
      "alibi_window": "10 PM to 11 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "The study",
        "The dining room"
      ],
      "behavioral_tells": [
        "Nervous around Eleanor's guests",
        "Avoids eye contact"
      ],
      "stakes": "Professional reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "35-45",
      "role_archetype": "Acquaintance",
      "relationships": [
        "Eleanor Voss: acquaintance",
        "Dr. Mallory Finch: acquaintance",
        "Beatrice Quill: detective"
      ],
      "public_persona": "Charming war veteran",
      "private_secret": "Financial troubles",
      "motive_seed": "Greed",
      "motive_strength": "low",
      "alibi_window": "9 PM to 10 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "The garden entrance",
        "The library windows"
      ],
      "behavioral_tells": [
        "Flirtatious demeanor",
        "Evasive when questioned"
      ],
      "stakes": "Social standing",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "30-40",
      "role_archetype": "Detective",
      "relationships": [
        "Eleanor Voss: friend",
        "Dr. Mallory Finch: colleague",
        "Captain Ivor Hale: acquaintance"
      ],
      "public_persona": "Sharp-witted investigator",
      "private_secret": "Uncovering past scandals",
      "motive_seed": "Professional integrity",
      "motive_strength": "high",
      "alibi_window": "none",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Household staff",
        "Guest interactions"
      ],
      "behavioral_tells": [
        "Observant",
        "Inquisitive"
      ],
      "stakes": "Career advancement",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
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
      "summary": "During a tense autumn gathering at the Manor House in Little Middleton, Eleanor Voss is found dead. The clock in the study had been tampered with, leading everyone to believe she was murdered much later than the actual time of death. Detective Beatrice Quill must unravel the truth behind the clock's deception while navigating class tensions and hidden motives among the guests."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "A mechanical clock in the study was wound back to mislead guests about the time of Eleanor Voss's murder.",
      "delivery_path": [
        {
          "step": "The clock was tampered with before the guests arrived."
        },
        {
          "step": "Witnesses were misled about the timing of events."
        },
        {
          "step": "The murder occurred just before the clock struck the hour."
        }
      ]
    },
    "outcome": {
      "result": "Dr. Mallory Finch is revealed as the murderer due to his tampering with the clock."
    }
  },
  "false_assumption": {
    "statement": "The murder occurred after the clock struck eleven.",
    "type": "temporal",
    "why_it_seems_reasonable": "The clock showed a different time, leading everyone to believe that the murder happened later than it actually did.",
    "what_it_hides": "The actual time of death was just before the clock was tampered with."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Party began at 9 PM",
        "Eleanor was last seen at 10 PM"
      ],
      "windows": [
        "Time of death estimated between 10 PM and 10:30 PM"
      ],
      "contradictions": [
        "Witnesses claim Eleanor was seen in the garden around 10:15 PM, but the clock shows 11:10 PM."
      ]
    },
    "access": {
      "actors": [
        "Dr. Mallory Finch",
        "Captain Ivor Hale"
      ],
      "objects": [
        "The mechanical clock",
        "The garden entrance"
      ],
      "permissions": [
        "Guests had access to all common areas."
      ]
    },
    "physical": {
      "laws": [
        "Clock mechanics allow for tampering without detection."
      ],
      "traces": [
        "Scratch marks found on the clock's winding key."
      ]
    },
    "social": {
      "trust_channels": [
        "Guests trust each other’s alibis."
      ],
      "authority_sources": [
        "Dr. Finch is a respected member of the community."
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The clock in the study shows ten minutes past eleven.",
        "correction": "This indicates the time was altered, as the party ended at midnight and no one saw Eleanor after 10 PM.",
        "effect": "Eliminates the timeline of death after the clock struck eleven.",
        "required_evidence": [
          "The clock shows ten minutes past eleven.",
          "The party began at 9 PM.",
          "Eleanor was last seen at 10 PM."
        ],
        "reader_observable": true
      },
      {
        "observation": "Witnesses claim they saw Eleanor in the garden at approximately 10:15 PM.",
        "correction": "This contradicts the clock's time, suggesting the clock was tampered with to mislead the investigation.",
        "effect": "Narrows the window of opportunity for Eleanor's murder.",
        "required_evidence": [
          "Witnesses' statements about seeing Eleanor.",
          "The conflicting clock time.",
          "The timeline of the party's events."
        ],
        "reader_observable": true
      },
      {
        "observation": "Faint scratch marks are found on the clock's winding key.",
        "correction": "The scratch marks indicate recent tampering.",
        "effect": "Eliminates the possibility that the clock was left untouched since the start of the party.",
        "required_evidence": [
          "The scratch marks on the clock's key.",
          "The timeline of the party.",
          "Witnesses' statements about the clock's time before the murder."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "Beatrice Quill stages a confrontation where Dr. Mallory Finch is asked to account for the clock's tampering while presenting the witness statements that place Eleanor in the garden at a different time than the clock shows.",
    "knowledge_revealed": "Dr. Finch's alibi fails as the evidence shows he had access to the clock and the opportunity to tamper with it.",
    "pass_condition": "If Dr. Finch cannot provide a reasonable explanation for the scratch marks and the conflicting timelines, he is identified as the murderer.",
    "evidence_clues": [
      "clue_scratch_marks",
      "clue_clock_time",
      "clue_witness_statements",
      "clue_culprit_direct_dr_mallory_finch",
      "clue_fp_contradiction_step_2"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The clock's time shows ten minutes past eleven, contradicting the last sighting of Eleanor. Step 2: Witness statements place Eleanor outside at 10:15 PM, conflicting with the clock's time. Step 3: Scratch marks indicate tampering, pointing to Dr. Finch's involvement."
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
        "suspect_name": "Eleanor Voss",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Eleanor is deceased and cannot be implicated in the murder.",
        "supporting_clues": [
          "clue_clock_time",
          "clue_witness_statements"
        ]
      },
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Captain Hale's alibi holds as he was seen at the party when the murder occurred.",
        "supporting_clues": [
          "clue_party_timeline"
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
        "clue_id": "clue_clock_time",
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
        "clue_id": "clue_mechanism_visibility_core",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_witness_statements",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Interviews with guests"
      },
      {
        "clue_id": "clue_scratch_marks",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Inspection of the clock"
      },
      {
        "clue_id": "clue_core_elimination_chain",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_culprit_direct_dr_mallory_finch",
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
    "summary": "Eleanor Voss is a charming socialite who expertly navigates the elite circles of Little Middleton. Beneath her gracious exterior, she conceals a deep resentment towards her late husband's family, fearing for her control over his estate.",
    "publicPersona": "Charming and gracious, Eleanor is the perfect hostess, organizing lavish soirées that draw the town's elite. Her smile is as warm as her tea, and she possesses an uncanny ability to make each guest feel special, often leaving them enchanted and a little envious of her effortless elegance.",
    "privateSecret": "Eleanor harbors resentment towards her late husband's family for their interference in her inheritance. This resentment simmers beneath her polished surface, creating a tension that threatens to unravel her social facade.",
    "motiveSeed": "Fears losing control over her late husband's estate if revealed that she manipulated the will, leading her to make choices that could jeopardize her standing and wealth.",
    "motiveStrength": "strong",
    "alibiWindow": "was in the library from eight until ten, ostensibly engrossed in the latest novel, though her mind was preoccupied with thoughts of her estate.",
    "accessPlausibility": "easy, as her position grants her access to all areas of her home and the affairs surrounding it.",
    "stakes": "Maintaining her family's wealth and status is not just a matter of pride; it's her identity, and the potential loss terrifies her.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.6,
    "speechMannerisms": "Eleanor speaks with a refined cadence, often punctuating her sentences with light, almost musical laughter. She has a way of turning compliments into barbs, her words flowing with an elegance that belies their sharpness.",
    "internalConflict": "Eleanor is torn between her desire to protect her family’s legacy and the moral implications of her actions. She grapples with guilt over her manipulations, fearing that her actions may ultimately lead to her downfall.",
    "personalStakeInCase": "This crime matters deeply to Eleanor because it directly threatens her control over her late husband's estate, which is tied to her identity and societal standing.",
    "paragraphs": [
      "Eleanor Voss stood at the threshold of her grand estate, the evening sun casting a golden glow over the meticulously manicured gardens. A symphony of laughter and clinking glasses echoed from within, where she had orchestrated yet another soirée, the pinnacle of social gatherings in Little Middleton. Guests swirled around her like moths to a flame, drawn in by her magnetic charm and the promise of an extravagant evening. Yet, beneath her poised exterior, Eleanor was a master of deception, her mind racing with thoughts of the inheritance that had become her lifeblood and her prison.",
      "As she glided through the crowd, exchanging pleasantries with the town’s elite, Eleanor couldn't shake the bitterness that lurked in the corners of her mind. The late Mr. Voss's family had always been a thorn in her side, their interference in her affairs a constant reminder of her precarious position. She had fought tooth and nail to maintain her control over the estate, even bending the will to her advantage, a secret she guarded fiercely. Each laugh she shared felt hollow, a façade she wore to mask the growing resentment towards those who would see her stripped of her power.",
      "Eleanor's alibi was impeccable; she had been in the library from eight until ten, a perfect cover as she perused the latest literary offerings. Yet, her thoughts had strayed far from the pages, swirling around the potential consequences of her actions. She feared exposure, the truth of her manipulation threatening to unravel everything she had built. Maintaining her family's wealth and status was not merely a goal; it was her very essence. The thought of losing it all sent shivers down her spine.",
      "In the quiet moments between guests, Eleanor found herself reflecting on her choices. The stakes had never been higher, and the moral complexities of her actions loomed large. Should she continue to uphold the legacy of the Voss name, even if it meant perpetuating a lie? Or was it time to seek redemption, to confront the ghosts of her past and the family that had wronged her? The clock was ticking, and with it, Eleanor's resolve began to waver, leaving her to wonder how far she was willing to go to protect what was hers."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch is a rising physician with a reputation for dedication, yet she conceals a troubling gambling addiction that jeopardizes her career. Her desperation for money drives her to make difficult choices.",
    "publicPersona": "A dedicated doctor with a growing reputation, Mallory is often seen as the local hero, offering her expertise to the villagers with a warmth that belies the turmoil beneath her polished exterior. Her patients trust her implicitly, and her charm makes her a beloved figure in Little Middleton.",
    "privateSecret": "Struggling with a gambling addiction that threatens to ruin her career, Mallory is caught in a web of debt that she desperately tries to hide from her colleagues and patients.",
    "motiveSeed": "Desperation for money to pay debts after a recent gambling loss, which has left her feeling vulnerable and exposed.",
    "motiveStrength": "moderate",
    "alibiWindow": "was treating a patient in the village until nine-thirty, a fact that she clings to as her shield against suspicion.",
    "accessPlausibility": "possible, as her profession allows her access to various places in the village, though her focus on work often keeps her from the social scene.",
    "stakes": "Her professional reputation and financial stability hang in the balance, and the thought of losing it all terrifies her.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.5,
    "speechMannerisms": "Mallory speaks with an earnestness that conveys her dedication to her work. She often uses humor to deflect attention from her personal struggles, making light of her own flaws and misfortunes.",
    "internalConflict": "Mallory grapples with the shame of her addiction and the fear of losing everything she has worked for. She faces a moral dilemma between the ambition that drives her and the integrity of her profession.",
    "personalStakeInCase": "This crime matters to Mallory because it threatens her reputation as a physician, and the fallout could jeopardize her career and her ability to pay off her debts.",
    "paragraphs": [
      "Dr. Mallory Finch hurried through the bustling streets of Little Middleton, her medical bag swinging at her side as she made her way to yet another patient. The sun was setting, casting long shadows that mirrored the weight on her shoulders. As a respected physician, she was the embodiment of dedication, always ready to lend a helping hand to those in need. Yet, as she smiled at the townsfolk who greeted her, a flicker of anxiety danced in her chest, a reminder of the secrets she harbored beneath her professional facade.",
      "Behind closed doors, Mallory battled a relentless addiction to gambling, a vice that had begun to consume her life. The thrill of the game had once been an exhilarating escape, but now it loomed over her like a dark cloud, threatening to rain down chaos. Her recent losses had left her drowning in debt, and the thought of being discovered sent shivers down her spine. She had to keep up appearances, to maintain her reputation as the town's trusted healer, but each day was a precarious balancing act between her professional obligations and her personal demons.",
      "Her alibi was airtight; she had been treating a patient until nine-thirty, an alibi that she clung to like a life raft. Yet, the pressure of her financial struggles gnawed at her, and the stakes were higher than ever. She could lose everything she had worked for—the respect of her peers, her career, and ultimately, the chance to escape her debts. Mallory's ambition had always driven her, but now it felt like a double-edged sword, threatening to cut her down at the very moment she was poised to rise.",
      "As she navigated the complexities of her life, Mallory found herself reflecting on the choices that had led her here. The crime that had shaken Little Middleton presented an opportunity, a chance to reclaim her footing and perhaps even find redemption. But at what cost? With her integrity on the line, she faced a moral crossroads that would determine not only her future but also the very essence of who she was. In a world that demanded perfection, Mallory was left to wonder whether she could truly be the hero she aspired to be."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale is a retired naval officer with a reputation for respect and propriety. Beneath the surface, he grapples with anger and resentment over family favoritism that has left him feeling sidelined.",
    "publicPersona": "Respected veteran with strong opinions on propriety and service, Ivor commands attention with his commanding presence and unwavering principles. He is often sought for advice, his views on honor and duty shaping the community's values.",
    "privateSecret": "Harbors anger over being passed over for a lucrative family inheritance due to his brother's favoritism, a resentment that has festered over the years.",
    "motiveSeed": "Bitter over his brother's death and the potential loss of family fortune to a disliked in-law, Ivor's feelings of injustice fuel a desire for retribution.",
    "motiveStrength": "moderate",
    "alibiWindow": "was in the garden from eight to nine, tending to his plants, a peaceful distraction from the turmoil within.",
    "accessPlausibility": "possible, as his status in the community grants him access to various social circles, though he prefers the solitude of his garden.",
    "stakes": "A chance to reclaim his family's honor and wealth, which he feels has been unjustly denied to him.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.4,
    "speechMannerisms": "Ivor speaks in a measured, deliberate manner, often punctuating his statements with a wry smile or an ironic twist of phrase. His formality lends weight to his words, making them resonate with authority.",
    "internalConflict": "Ivor grapples with feelings of entitlement and bitterness regarding his family's legacy. He struggles to reconcile his sense of duty with the personal grievances that threaten to consume him.",
    "personalStakeInCase": "This crime matters to Ivor because it represents a chance to confront the injustices he has faced and to reclaim his rightful place within the family hierarchy.",
    "paragraphs": [
      "Captain Ivor Hale stood in the serene confines of his garden, the twilight casting a soft glow on the meticulously arranged flowers. A retired naval officer, he had long been a pillar of the community, respected for his unwavering principles and strong opinions on propriety. Yet, as he tended to his plants, a wave of bitterness washed over him, a reminder of the family dynamics that had left him feeling sidelined and resentful. His brother's favoritism had robbed him of a lucrative inheritance, a slight that continued to sting even in his retirement.",
      "In public, Ivor was the epitome of honor and duty, often sought for counsel by those who admired his steadfastness. But beneath the surface lay a tempest of anger, fueled by the loss of opportunity and the specter of a disliked in-law poised to inherit what he believed should have been his. The recent death of his brother only exacerbated his feelings, and he found himself grappling with thoughts of retribution that he had never imagined entertaining. The crime that had disrupted their lives felt like a twisted chance to reclaim what was rightfully his.",
      "His alibi was simple and unassailable; he had been in the garden from eight to nine, a refuge from the emotional turmoil that threatened to overwhelm him. Yet, Ivor knew that the stakes were higher than mere familial squabbles. The potential loss of his family's wealth to an outsider ignited a fire within him, compelling him to confront the very injustices he had endured. The thought of reclaiming his family's honor became an obsession, blinding him to the complexities of loyalty and love that surrounded him.",
      "As he pondered the unfolding events, Ivor found himself at a crossroads, torn between the desire for vengeance and the principles he had long upheld. The crime that had rocked Little Middleton could serve as a catalyst for change, but at what cost? He faced the daunting challenge of reconciling his sense of entitlement with the reality of his relationships. In a world that demanded loyalty, Ivor was left to wonder whether he could navigate the murky waters of family dynamics without losing himself in the process."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill is an underappreciated housemaid with dreams of rising above her station. Secretly in love with Captain Hale, her loyalty is tested as she navigates her complex feelings.",
    "publicPersona": "Diligent and unobtrusive, Beatrice is often overlooked in the household, her hard work going unnoticed by the family she serves. She possesses a quiet strength and resilience, always ready to lend a hand despite her lowly position.",
    "privateSecret": "Secretly in love with Captain Hale, complicating her loyalty to the family and creating a tension that leaves her torn between duty and desire.",
    "motiveSeed": "Jealous of the privileges enjoyed by the family, especially the inheritance she believes she deserves, Beatrice feels a growing resentment towards those she serves.",
    "motiveStrength": "moderate",
    "alibiWindow": "was cleaning the upper floors from eight to ten, a task that kept her out of sight but did little to shield her from the turmoil around her.",
    "accessPlausibility": "easy, as her duties allow her to move freely within the estate, though her position often leaves her feeling invisible.",
    "stakes": "Her future and ability to climb the social ladder hinge on the outcome of the crime, as it may present an opportunity to change her circumstances.",
    "humourStyle": "observational",
    "humourLevel": 0.4,
    "speechMannerisms": "Beatrice speaks softly, often hesitating as if weighing her words carefully. She has a tendency to use dry humor to cope with her frustrations, her observations about the family’s antics revealing a sharp wit.",
    "internalConflict": "Beatrice is torn between her unrequited love for Captain Hale and her loyalty to the family she serves. Her feelings complicate her sense of self-worth and belonging.",
    "personalStakeInCase": "This crime matters to Beatrice because it could alter her position within the household and offer her a chance to assert her worth in a world that marginalizes her.",
    "paragraphs": [
      "Beatrice Quill stood in the shadows of the grand estate, her hands busy with the mundane tasks of cleaning while her heart yearned for something more. As a housemaid, she was often invisible, her diligent efforts overlooked by the family she served. Yet, in the quiet moments, she harbored dreams of rising above her station, aspirations that felt as distant as the stars overhead. Her heart, however, was tangled in a web of unrequited love for Captain Hale, a man whose strength and honor captivated her despite the chasm of class that separated them.",
      "In the backdrop of the household's bustling social life, Beatrice observed the interactions with a keen eye, her dry humor often surfacing as she noted the absurdities of her employers. She found herself laughing quietly at the grandiosity of their soirées, her sharp wit a shield against the frustrations of her position. Yet, beneath the surface, a simmering jealousy brewed as she watched the privileges enjoyed by the family, particularly the inheritance that she felt should rightfully belong to someone like her, someone who had dedicated their life to serving them.",
      "Her alibi was simple; she had been cleaning the upper floors from eight to ten, a task that kept her out of sight but did little to shield her from the turmoil around her. As the crime unfolded, Beatrice felt the weight of the stakes pressing down on her. The outcome could alter her future in ways she had never imagined, presenting a chance to assert her worth in a world that often marginalized her. But with her feelings for Captain Hale complicating her loyalties, she found herself caught in a storm of conflicting emotions.",
      "As she navigated the complexities of her life, Beatrice recognized that the crime that had rocked Little Middleton could serve as a turning point. It was an opportunity to challenge the status quo and perhaps even reshape her destiny. Yet, the path ahead was fraught with uncertainty, and she was left to ponder whether she had the courage to assert herself or if she would remain forever trapped in the shadows of others' lives. In a world that demanded conformity, Beatrice's journey was one of self-discovery, a quest for belonging that would ultimately define her."
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
    "summary": "Little Middleton Manor is a sprawling estate surrounded by meticulously landscaped gardens and dense woodlands, a relic of wealth now shadowed by recent sinister events.",
    "visualDescription": "The manor boasts an impressive façade of weathered stone, its tall windows framed by ivy that climbs toward the gabled roof. Surrounding the house, formal gardens with clipped hedges and ornamental fountains give way to the untamed shadows of the woodlands, where secrets lie hidden.",
    "atmosphere": "The atmosphere is thick with tension, as the air crackles with unspoken suspicions and the echoes of recent turmoil within the estate.",
    "paragraphs": [
      "Little Middleton Manor stands resolute against the overcast sky, its stone walls cloaked in the damp chill of autumn. The gardens, though once a source of beauty, now feel oppressive, the meticulously trimmed hedges casting long, dark shadows that seem to watch every movement. What was once the laughter of family gatherings is replaced by whispers of discontent, as each window reflects the growing unease among its inhabitants. The distant rustle of leaves in the woodlands adds a haunting quality, as if the very trees are privy to the secrets that linger within the manor's walls.",
      "Inside, the air is stale with the scent of dust and old wood, the heavy drapes drawn tight against the outside world. The drawing room, with its faded upholstery and flickering gas lamps, feels like a time capsule, preserving the echoes of conversations long past. Here, the ticking of the grand clock, its hands stubbornly refusing to move forward, punctuates the silence, each tick a reminder of the mounting tension that grips the estate. The light filtering through the leaded glass windows casts a somber hue, trapping the occupants in a world that feels increasingly claustrophobic.",
      "As the day wears on, the weather shifts, dark clouds rolling in, promising rain and further isolation. The gravel driveway, often bustling with the arrival of visitors, lies empty, the only sound the occasional rustle of a passing breeze. The manor, though grand, feels like a gilded cage, where the inhabitants are ensnared by both the weight of their secrets and the encroaching wilderness that surrounds them. Each room holds its own stories, and in this moment, the truth seems just out of reach, shrouded in the mists of doubt and suspicion."
    ]
  },
  "atmosphere": {
    "era": "1930s",
    "weather": "Overcast with occasional rain, typical of the English countryside in autumn",
    "timeFlow": "Three days of mounting tension as the investigation unfolds",
    "mood": "Tense due to recent incidents within the estate, creating an air of suspicion",
    "eraMarkers": [
      "Petrol automobiles parked on the gravel drive",
      "Domestic telephones with party lines ringing sporadically",
      "Typewriters clacking away in the study, sending urgent missives"
    ],
    "sensoryPalette": {
      "dominant": "The heavy scent of damp earth and decaying leaves pervades the air, creating a sense of foreboding.",
      "secondary": [
        "A faint hint of woodsmoke from the fireplaces, mingling with the mustiness of old books in the library.",
        "The crisp sound of gravel crunching underfoot, emphasizing the isolation of the estate."
      ]
    },
    "paragraphs": [
      "The air hangs thick, heavy with the scent of damp earth and decaying leaves, creating an atmosphere laden with foreboding. Each breath feels like inhaling the very essence of the mysteries that lurk in the shadows of the manor, where every corner whispers of secrets yet to be uncovered. The occasional rustle of branches outside serves as a reminder of the encroaching woods, a vast wilderness that feels both protective and menacing, blurring the lines between safety and danger.",
      "Inside, the smell of woodsmoke from the fireplaces competes with the mustiness of old books in the library, an olfactory tapestry that evokes both comfort and unease. The flickering light from the gas lamps casts dancing shadows on the walls, as if the manor itself is alive, holding its breath in anticipation of the truth. The sound of gravel crunching beneath the feet of those who dare to wander the grounds serves as a stark reminder of the isolation that envelops Little Middleton, where help is far away and trust is a fragile commodity."
    ]
  },
  "keyLocations": [
    {
      "id": "drawing_room",
      "name": "Drawing Room",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "The drawing room is adorned with faded floral wallpaper and a grand fireplace, its mantle cluttered with family portraits and dusty trinkets. Plush armchairs, once vibrant, now sag under the weight of time, while a large bay window offers a view of the overgrown garden.",
      "sensoryDetails": {
        "sights": [
          "Faded floral wallpaper peels slightly at the edges, revealing the underlying plaster, while the grand fireplace looms at the center, its embers long extinguished.",
          "The bay window, obscured by layers of dust, frames a view of the dense gardens, where shadows seem to shift and dance in the dim light."
        ],
        "sounds": [
          "The soft crackle of the hearth in the winter months is replaced by the eerie silence of the room, interrupted only by the creaking of the old floorboards.",
          "Occasionally, the distant sound of thunder rumbles from outside, echoing off the walls and adding to the pervasive tension."
        ],
        "smells": [
          "The stale scent of dust clings to the air, punctuated by the faint aroma of old leather book bindings and mothballs from forgotten corners.",
          "A trace of lingering tobacco from past occupants weaves through the room, mingling with the musty odor of neglected upholstery."
        ],
        "tactile": [
          "The upholstery on the armchairs feels rough and threadbare, a testament to years of use, while the polished wood of the coffee table is cold and uninviting.",
          "The air is cool and still, a chill that seeps into the bones, making the drawing room feel both spacious and claustrophobic at once."
        ]
      },
      "accessControl": "Access is granted to family members and select guests during gatherings; household staff may enter for cleaning but are expected to leave swiftly.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Rain-streaked windows distort the view of the gardens outside, blurring the line between inside and out.",
            "The dim light casts elongated shadows across the plush carpet, as raindrops tap gently against the glass."
          ],
          "sounds": [
            "The steady drumming of rain against the roof creates a rhythmic backdrop, soothing yet unnerving.",
            "Occasional thunder rumbles in the distance, adding an ominous undertone to the morning."
          ],
          "smells": [
            "The scent of damp earth wafts through the slightly ajar window, mingling with the musty air inside.",
            "A trace of wet foliage from the garden seeps in, enhancing the feeling of confinement."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "Flat pewter light filters through the clouds, casting a grey pallor over the room, dulling colors and shadows.",
            "Dust motes dance in the air, illuminated by the sparse light, creating an ethereal quality."
          ],
          "sounds": [
            "Silence reigns, broken only by the distant ticking of the grandfather clock, each tick echoing like a heartbeat.",
            "The creak of the floorboards underfoot is amplified in the stillness, a reminder of the room's solitude."
          ],
          "smells": [
            "The lingering scent of beeswax polish from the furniture mixes with the stale air, creating a sense of neglect.",
            "A faint whiff of woodsmoke from the fireplace lingers, suggesting recent gatherings."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Candlelight flickers in glass holders on the mantle, casting a warm glow that contrasts with the encroaching darkness outside.",
            "Long shadows stretch across the room, creating a sense of depth and mystery."
          ],
          "sounds": [
            "The soft murmur of voices from the adjoining rooms provides a comforting yet tense undercurrent.",
            "The occasional clink of glassware from the dining room hints at a gathering, heightening the anticipation."
          ],
          "smells": [
            "The rich aroma of candle wax mingles with the scent of old paper from the bookshelves, creating a nostalgic ambiance.",
            "A hint of cold fireplace ash lingers in the air, a reminder of past warmth."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The drawing room, with its faded elegance, serves as a gathering space for the family, where secrets are whispered and tensions simmer beneath the surface. Its plush armchairs, once the seat of laughter and warmth, now harbor unspoken grievances, and the grand fireplace stands cold, a monument to the warmth that has long since fled. The heavy drapes are drawn tight against the outside world, creating an atmosphere of confinement, where every creak of the floorboards feels magnified, echoing the unease that permeates the air.",
        "As the day gives way to evening, the room transforms under the flickering candlelight, casting shadows that seem to dance with the ghosts of those who have come before. Each light reveals moments of intimacy while simultaneously obscuring the truth, as the lingering scent of beeswax and tobacco hangs heavily in the atmosphere. This is a space where the past intertwines with the present, and every glance exchanged carries the weight of suspicion, as the clock ticks ominously towards an uncertain future."
      ]
    },
    {
      "id": "library",
      "name": "Library",
      "type": "interior",
      "purpose": "Clue discovery",
      "visualDetails": "The library is lined with dark oak shelves filled with leather-bound volumes, their spines cracked and titles faded. A large mahogany desk dominates the center, cluttered with papers, a typewriter, and an array of dusty artifacts.",
      "sensoryDetails": {
        "sights": [
          "Dark oak shelves tower above, crammed with books whose spines have dulled with age, each one a silent witness to the secrets they hold.",
          "The mahogany desk, polished to a high sheen, is littered with scattered papers and an old typewriter, its keys sticky and worn from frequent use."
        ],
        "sounds": [
          "The soft rustle of pages turning fills the air as if the books themselves are whispering their stories to anyone who dares to listen.",
          "Occasionally, the creak of the old wooden floor interrupts the silence, a reminder that the library is not as deserted as it appears."
        ],
        "smells": [
          "The rich scent of aged leather and musty paper envelops the space, a heady aroma that evokes the passage of time.",
          "A faint hint of dust dances in the air, stirred by the occasional breeze from the slightly open window, mingling with the fragrance of polished wood."
        ],
        "tactile": [
          "The cool surface of the mahogany desk contrasts sharply with the rough texture of the worn spines of the books, inviting exploration.",
          "The air is still, carrying a chill that seeps into the bones, creating an atmosphere that feels both inviting and foreboding."
        ]
      },
      "accessControl": "Access is limited to family members and select staff, with the door often locked to keep out unwanted visitors; private meetings are held here away from prying eyes.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops trickle down the windowpanes, distorting the view of the gardens outside, while the dim light casts a gray hue over the room.",
            "The shadows from the oak shelves loom larger, creating an almost oppressive atmosphere."
          ],
          "sounds": [
            "The steady patter of rain against the roof provides a rhythmic backdrop, punctuated by the occasional roll of thunder.",
            "The rustling of pages seems louder in the silence, as if the books are eager to share their secrets."
          ],
          "smells": [
            "The scent of wet earth wafts in through the window, mingling with the musty aroma of old books, creating a rich tapestry of scents.",
            "A faint trace of petrichor fills the air, heightening the sensation of isolation."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The library is bathed in soft, muted light, the shadows lengthening as the afternoon wears on, creating a feeling of encroaching dusk.",
            "Dust motes dance in the air, caught in the light that filters through the window."
          ],
          "sounds": [
            "The silence is punctuated only by the occasional creak of the shelves as they settle, a reminder of their age and the stories they hold.",
            "The ticking of a small clock on the mantelpiece echoes softly, each tick a reminder of time slipping away."
          ],
          "smells": [
            "The heady aroma of old leather and paper fills the space, creating an atmosphere steeped in history and mystery.",
            "A hint of beeswax from the candle on the desk adds warmth, contrasting with the coolness of the room."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Candlelight flickers on the desk, illuminating the typewriter and casting dancing shadows across the walls, creating an intimate yet eerie ambiance.",
            "The room seems to breathe as the light shifts, revealing glimpses of titles and artifacts hidden in the shadows."
          ],
          "sounds": [
            "The soft crackle of a candle wick is the only sound, a soothing yet tension-filled backdrop to the quiet of the room.",
            "Distant laughter from the drawing room floats in, a reminder of life outside the library's walls."
          ],
          "smells": [
            "The warm scent of melting wax mingles with the musty smell of old books, creating a comforting yet unsettling atmosphere.",
            "A faint trace of woodsmoke from the fireplace wafts in, heightening the sense of coziness and secrecy."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The library serves as a sanctuary for those seeking knowledge and refuge, its dark oak shelves crammed with books that hold untold stories and secrets. The sturdy mahogany desk at its center, littered with papers and an old typewriter, offers a glimpse into the lives of those who have used it, each scratch of the keys a testament to the weight of their thoughts. Here, the atmosphere is thick with the scent of aged leather and musty paper, a heady mix that invites exploration yet warns of the shadows that lurk within the pages.",
        "In the quiet moments, the library transforms into a realm of whispers, as the rustle of pages turning fills the air, echoing the stories waiting to be uncovered. Each creak of the floor beneath one's feet seems to amplify the solitude, and the dim light that filters through the window casts long shadows, enhancing the sense of mystery. This is a space where secrets are kept and revelations await, and where the past intertwines with the present, creating an ever-looming tension that fills the air."
      ]
    },
    {
      "id": "garden",
      "name": "Formal Gardens",
      "type": "exterior",
      "purpose": "Concealment and discovery",
      "visualDetails": "The formal gardens are meticulously landscaped, featuring symmetrical flower beds and hedges that evoke a sense of order amidst the chaos of the surrounding woodlands. Ornamental fountains stand at intervals, their waters glistening in the dappled light that breaks through the trees.",
      "sensoryDetails": {
        "sights": [
          "Symmetrical flower beds burst with color, their blooms a stark contrast to the deep greens of the hedges that frame them, creating a picturesque yet unnerving scene.",
          "The sunlight filters through the trees, casting dappled shadows on the gravel pathways, while the glistening waters of the fountains catch the light, creating a serene yet eerie atmosphere."
        ],
        "sounds": [
          "The gentle trickle of water from the fountains mingles with the rustle of leaves in the breeze, creating a soothing soundtrack that belies the tension within the estate.",
          "Occasionally, the distant call of a bird breaks the silence, a reminder of life beyond the confines of the gardens."
        ],
        "smells": [
          "The air is fragrant with the scent of blooming flowers, a heady perfume that can be both inviting and overwhelming, mingling with the damp earth from recent rains.",
          "A faint whiff of decay from the underbrush hints at the wildness that lies beyond the manicured edges, reminding visitors of the untamed woods surrounding the estate."
        ],
        "tactile": [
          "The gravel pathways crunch underfoot, a satisfying sound that contrasts with the softness of the flower petals brushing against one's fingers.",
          "The air is fresh yet carries a chill, the moisture from the earth lingering in the atmosphere and creating an invigorating yet uneasy sensation."
        ]
      },
      "accessControl": "The gardens are accessible to both family and staff, but certain areas are off-limits during private gatherings; the dense woodlands that border the gardens provide ample concealment.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops cling to the petals of flowers, their colors vibrant against the grey backdrop of the sky, while puddles form on the gravel paths.",
            "The foliage glistens with moisture, creating a fresh yet oppressive atmosphere."
          ],
          "sounds": [
            "The steady patter of rain on the leaves provides a soothing rhythm, punctuated by the occasional drip into puddles below.",
            "The rustle of wet leaves creates a symphony of sound, amplifying the sense of isolation."
          ],
          "smells": [
            "The scent of damp earth rises from the sodden ground, mingling with the sweet fragrance of wet flowers, creating a rich olfactory experience.",
            "A hint of petrichor fills the air, evoking feelings of nostalgia and melancholy."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The gardens appear muted under the grey sky, colors dulled and shadows lengthening, creating an atmosphere of unease.",
            "The flowers sway gently in the breeze, their movements almost ghostly in the dim light."
          ],
          "sounds": [
            "The gentle rustle of leaves mixes with the distant sound of thunder, creating a foreboding ambiance that hangs over the gardens.",
            "The occasional call of a bird echoes, a stark contrast to the stillness surrounding."
          ],
          "smells": [
            "The earthy aroma of damp soil fills the air, blending with the more subtle fragrances of flowers, creating a complex tapestry of scents.",
            "A faint whiff of decay from the underbrush adds an unsettling note to the otherwise pleasant environment."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "The gardens are bathed in the warm glow of the setting sun, casting long shadows and illuminating the flowers in a golden light.",
            "The peacefulness is deceptive, as the last rays of daylight flicker against the backdrop of the looming woods."
          ],
          "sounds": [
            "The distant chirping of crickets begins to fill the air, a natural soundtrack that signals the approach of night.",
            "The soft rustle of leaves in the evening breeze adds a calming yet eerie quality to the atmosphere."
          ],
          "smells": [
            "The rich scent of blooming flowers is heightened in the evening air, mingling with the coolness of the approaching night.",
            "A hint of woodsmoke from distant fires wafts in, creating a comforting yet haunting aroma."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The formal gardens, with their meticulously landscaped flower beds and symmetrical hedges, serve as both a sanctuary and a stage for the unfolding drama of Little Middleton. Each bloom bursts with color, a stark contrast to the oppressive shadows cast by the surrounding woodlands, where secrets lie hidden just beyond the manicured edges. The ornamental fountains, with their glistening waters, provide a soothing soundtrack that belies the tension lurking within the estate, while the air is thick with the scent of blooming flowers, a heady perfume that invites exploration yet warns of danger.",
        "As evening approaches, the gardens transform under the warm glow of the setting sun, casting long shadows that stretch toward the trees, creating an eerie sense of anticipation. The distant sounds of laughter from the manor float through the air, a reminder of the life that continues within, while the soft rustle of leaves hints at the secrets that lie just out of reach. Here, amidst the beauty, the gardens become a place of concealment, where intentions are hidden, and the truth waits to be uncovered."
      ]
    },
    {
      "id": "servants_hall",
      "name": "Servants' Hall",
      "type": "interior",
      "purpose": "Staff interactions and secretive meetings",
      "visualDetails": "The servants' hall is a modest room, furnished with simple wooden tables and mismatched chairs, the walls adorned with faded photographs of past staff. A large fireplace dominates one end, offering warmth and a gathering place for whispered conversations.",
      "sensoryDetails": {
        "sights": [
          "The room is sparsely decorated, with simple wooden tables and mismatched chairs that speak of practicality rather than elegance.",
          "Faded photographs of past staff hang on the walls, their stories captured in sepia tones, creating a sense of history and continuity."
        ],
        "sounds": [
          "The crackling of the fireplace fills the air, providing a comforting background hum to the otherwise quiet room.",
          "Occasional hushed whispers punctuate the stillness, conversations kept low to avoid drawing attention from above."
        ],
        "smells": [
          "The scent of woodsmoke from the fireplace mingles with the lingering aroma of boiled vegetables from the kitchen, creating a homey yet utilitarian atmosphere.",
          "A faint hint of dust lingers in the air, a reminder of the constant bustle and activity that takes place in the manor."
        ],
        "tactile": [
          "The rough wood of the tables feels sturdy and worn, a testament to years of use by the staff who gather for meals and meetings.",
          "The air is warmer near the fireplace, a stark contrast to the coolness that pervades the rest of the manor, creating a cozy yet watchful environment."
        ]
      },
      "accessControl": "Access is restricted primarily to the household staff, with the door kept closed to maintain privacy; family members rarely enter unless needed.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops trickle down the windows, distorting the view of the gardens outside, while the dim light casts a dreary hue over the room.",
            "The flickering light from the fireplace provides a warm contrast to the cold, wet morning."
          ],
          "sounds": [
            "The steady patter of rain against the roof creates a rhythmic backdrop, punctuated by the occasional crack of thunder.",
            "The low murmur of voices rises and falls, a comforting sound amidst the gloom."
          ],
          "smells": [
            "The scent of damp earth wafts in through the slightly open window, mingling with the aroma of boiled vegetables from the kitchen.",
            "A hint of woodsmoke from the fireplace adds warmth, creating a cozy atmosphere."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The room is dim, shadows lengthening as the afternoon wears on, creating an atmosphere of unease.",
            "The flickering flames in the fireplace cast dancing shadows against the walls, heightening the sense of secrecy."
          ],
          "sounds": [
            "The crackle of the fire mingles with the distant sound of thunder, creating a foreboding ambiance that hangs over the hall.",
            "The hushed whispers of the staff punctuate the stillness, each word a thread in the web of tension."
          ],
          "smells": [
            "The air is filled with the rich aroma of stewing vegetables, blending with the scent of woodsmoke, creating a comforting yet uneasy atmosphere.",
            "A faint trace of dust lingers, a reminder of the constant activity that takes place in the manor."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "The warm glow of the fireplace casts a welcoming light over the room, illuminating the faces of the gathered staff as they share stories and laughter.",
            "The flickering shadows create a cozy yet intimate atmosphere, where secrets can be shared in hushed tones."
          ],
          "sounds": [
            "The soft crackle of the fire is accompanied by the laughter of staff members, a sound that feels both joyous and conspiratorial.",
            "Distant sounds from the manor echo through the hall, a reminder of the lives being lived above."
          ],
          "smells": [
            "The scent of woodsmoke mingles with the aroma of hearty stews, creating a comforting and inviting atmosphere.",
            "A hint of fresh bread cooling nearby adds a homey touch to the room."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The servants' hall serves as the heart of the staff's daily lives, a modest room filled with simple furnishings that reflect their practicality. The large fireplace at one end provides warmth and comfort, while the faded photographs of past staff hanging on the walls offer a glimpse into the history of the manor. Here, the air is thick with the scent of woodsmoke and boiled vegetables, creating a homey atmosphere that belies the tension that simmers just beneath the surface, as hushed whispers and furtive glances reveal the secrets shared among the staff.",
        "In the evenings, the hall transforms into a gathering space where laughter and stories are exchanged, but the tension is palpable. The flickering flames cast a warm glow, creating an intimate setting where secrets can be shared in hushed tones. As the distant sounds of the manor filter in, the staff are reminded that their lives are intertwined with the mysteries that unfold within the walls of Little Middleton, and the shared camaraderie serves as both comfort and a reminder of the fragile nature of their existence."
      ]
    }
  ],
  "note": "",
  "cost": 0.00340721865,
  "durationMs": 49351
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1930,
    "month": "August",
    "day": 15,
    "era": "1930s"
  },
  "seasonal": {
    "season": "summer",
    "month": "August",
    "weather": [
      "overcast skies",
      "light drizzle",
      "occasional bursts of sunshine"
    ],
    "daylight": "Long daylight hours with twilight extending into the evening, around nine o'clock.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, after dinner has concluded",
    "holidays": [
      "August Bank Holiday (first Monday in August)"
    ],
    "seasonalActivities": [
      "garden parties",
      "afternoon teas",
      "vintage car rallies"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "lightweight linen suits",
        "double-breasted blazers",
        "tailored trousers with turn-ups"
      ],
      "casual": [
        "short-sleeved cotton shirts",
        "tweed caps",
        "suspenders"
      ],
      "accessories": [
        "silk ties",
        "pocket squares",
        "leather gloves"
      ]
    },
    "womensWear": {
      "formal": [
        "sleeveless evening gowns",
        "drop-waist dresses",
        "cloche hats"
      ],
      "casual": [
        "tea dresses with floral patterns",
        "knitted cardigans",
        "broad-brimmed straw hats"
      ],
      "accessories": [
        "beaded handbags",
        "string pearls",
        "silk scarves"
      ]
    },
    "trendsOfTheMoment": [
      "Art Deco influences in design",
      "the popularity of jazz music",
      "the rise of outdoor leisure activities"
    ],
    "socialExpectations": [
      "adherence to formal dining etiquette",
      "importance of social status",
      "expectation of modesty in women's attire"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "the aftermath of the Wall Street Crash continues to impact the economy",
      "the Labour government faces challenges in addressing unemployment",
      "tensions rise in Europe with the rise of fascism"
    ],
    "politicalClimate": "Increasing unease as the Great Depression deepens, with government policies struggling to alleviate economic distress.",
    "economicConditions": "High unemployment rates and diminished consumer spending lead to a pervasive atmosphere of anxiety and uncertainty among the populace.",
    "socialIssues": [
      "growing class divide exacerbated by economic hardship",
      "debates over workers' rights and pay",
      "increased visibility of women's rights movements"
    ],
    "internationalNews": [
      "rising political instability in Germany and Italy",
      "efforts to stabilize the League of Nations",
      "the decline of imperial powers and rising nationalism in colonies"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "'Ain't She Sweet' by Milton Ager",
        "'Happy Days Are Here Again' by Leo Reisman",
        "jazz performances by Duke Ellington"
      ],
      "films": [
        "'All Quiet on the Western Front'",
        "'The Love Parade'",
        "'The Jazz Singer'"
      ],
      "theater": [
        "'The Front Page'",
        "'The Royal Family'",
        "'The Cat and the Fiddle'"
      ],
      "radio": [
        "BBC Radio News",
        "variety shows featuring popular musicians",
        "drama series based on classic literature"
      ]
    },
    "literature": {
      "recentPublications": [
        "'Murder in the Mews' by Agatha Christie",
        "'The Maltese Falcon' by Dashiell Hammett",
        "'Brave New World' by Aldous Huxley"
      ],
      "popularGenres": [
        "mystery and detective fiction",
        "social realism",
        "science fiction"
      ]
    },
    "technology": {
      "recentInventions": [
        "the electric toaster",
        "the radio receiver",
        "the first commercially available refrigerator"
      ],
      "commonDevices": [
        "domestic telephones with party lines",
        "phonographs for playing records",
        "typewriters for correspondence"
      ],
      "emergingTrends": [
        "increased household electrification",
        "the growth of consumer goods markets",
        "the rise of cinema as a primary entertainment form"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "loaf of bread: four pence",
        "men's linen suit: two pounds ten shillings",
        "theatre ticket: three shillings"
      ],
      "commonActivities": [
        "afternoon tea with friends",
        "attending local fairs and festivals",
        "visiting the cinema for the latest films"
      ],
      "socialRituals": [
        "formal dinner parties on weekends",
        "garden parties featuring lawn games",
        "Sunday church services followed by family outings"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "increasing resentment among working-class towards the upper classes",
      "the aristocracy's struggle to maintain their status"
    ],
    "gender": [
      "women increasingly participating in the workforce",
      "traditional roles still largely upheld in upper classes",
      "growing acceptance of women in public life"
    ],
    "race": [
      "racial tensions in urban areas beginning to surface",
      "Colonial attitudes still influencing societal views"
    ],
    "generalNorms": [
      "strict adherence to social etiquette",
      "importance of family reputation",
      "expectations of modesty and propriety in behavior"
    ]
  },
  "atmosphericDetails": [
    "The scent of wet earth mingles with the floral aromas of late summer blooms, creating a rich tapestry of smells wafting through the country house garden.",
    "The rhythmic patter of raindrops on the window panes punctuates the tense silence within the estate, as whispers of suspicion hang heavy in the air.",
    "The distant sounds of jazz music filter in from the drawing room, juxtaposed against the creaking floorboards and the occasional rustle of silk dresses as guests attempt to maintain a facade of normalcy."
  ],
  "paragraphs": [
    "In August 1930, the English countryside is caught in a web of overcast skies, the air thick with humidity and the promise of rain. The summer days are long, with twilight lingering well into the evening, creating an atmosphere ripe for intrigue. On this particular evening, the country house estate, filled with the echoes of past grandeur, becomes a stage for whispered conversations and furtive glances. The recent spate of unsettling incidents has left a palpable tension in the air, as the household staff and esteemed guests navigate the delicate balance of social propriety amidst growing suspicion.",
    "Fashion trends of the era reflect the contrasts of the time. Men can be seen in lightweight linen suits, breezy enough to accommodate the warm yet unpredictable weather, while women don elegant sleeveless evening gowns, accented with beaded handbags and pearl necklaces. The elegance of the drop-waist dresses is often paired with broad-brimmed straw hats, showcasing a blend of sophistication and leisure. As they gather for evening tea, the clinking of china and the soft rustle of silk create an auditory backdrop, underscoring the importance of appearances in this tense environment.",
    "Daily life in August 1930 is marked by the ongoing struggles of the Great Depression, which casts a shadow over the summer festivities. With a loaf of bread costing four pence, families are forced to prioritize their spending, while the upper classes host lavish garden parties to distract themselves from economic realities. The social rituals of the day, including formal dinner parties and church services, serve as both a refuge and a battleground for the class tensions brewing beneath the surface. As guests contemplate their roles in a society grappling with change, the air is thick with unspoken expectations and the weight of history."
  ],
  "note": "",
  "cost": 0.0010744750499999999,
  "durationMs": 12995
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "The looming threat of financial ruin amidst the Great Depression forces the affluent residents and their staff to navigate a web of social etiquette and class tensions during a tense weekend gathering at the estate.",
  "era": {
    "decade": "1930s",
    "socialStructure": "Economic strain from the Great Depression exacerbates class tensions, creating a fragile dynamic between wealthy owners and their increasingly resentful staff."
  },
  "setting": {
    "location": "A sprawling manor house surrounded by landscaped gardens and dense woodlands",
    "institution": "Country house estate",
    "weather": "Overcast with occasional rain, typical of the English countryside in autumn"
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
    "id": "party_end_time",
    "value": "midnight",
    "description": "The official end time of the party when the murder was discovered"
  }
]

### CLUE_DISTRIBUTION
{
  "clues": [
    {
      "id": "clue_clock_time",
      "category": "temporal",
      "description": "The clock in the study shows ten minutes past eleven.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "The time displayed on the clock is inconsistent with witness statements.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_contradiction_chain",
      "category": "temporal",
      "description": "This indicates the time was altered, as the party ended at midnight and no one saw Eleanor after 10.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "The alteration of time suggests foul play.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_witness_statements",
      "category": "testimonial",
      "description": "Witnesses claim they saw Eleanor in the garden at approximately ten fifteen in the evening.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "Eleanor's last known whereabouts contradict the clock's time.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_scratch_marks",
      "category": "physical",
      "description": "Faint scratch marks are found on the clock's winding key.",
      "sourceInCML": "CASE.inference_path.steps[1].required_evidence[0]",
      "pointsTo": "The scratch marks suggest recent tampering with the clock.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_culprit_direct_dr_mallory_finch",
      "category": "behavioral",
      "description": "Direct evidence ties Dr. Mallory Finch to the mechanism access point before the discriminating test.",
      "sourceInCML": "CASE.cast[1].access_plausibility",
      "pointsTo": "This direct evidence shows Dr. Mallory Finch had means and opportunity, narrowing the solution uniquely toward the culprit.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_elimination_chain",
      "category": "testimonial",
      "description": "Eliminates Captain Ivor Hale because he was seen at the bar with multiple witnesses until after eleven.",
      "sourceInCML": "CASE.cast[2].alibi_window",
      "pointsTo": "Captain Ivor Hale's alibi rules him out as a suspect.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_mechanism_visibility_core",
      "category": "temporal",
      "description": "A mechanical clock in the study was wound back to mislead guests about the time of Eleanor Voss's murder.",
      "sourceInCML": "CASE.inference_path.steps[2].observation",
      "pointsTo": "The mechanism of tampering is revealed.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_late_optional_slot_1",
      "category": "spatial",
      "description": "The garden entrance is located near the study, providing easy access.",
      "sourceInCML": "CASE.constraint_space.access.objects[1]",
      "pointsTo": "This location detail is relevant to the timeline of events.",
      "placement": "late",
      "criticality": "optional",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_fp_contradiction_step_2",
      "category": "temporal",
      "description": "Witnesses claim they saw Eleanor in the garden at approximately ten fifteen in the evening.",
      "sourceInCML": "CASE.inference_path.steps[1].correction",
      "pointsTo": "This contradicts the clock's time, suggesting the clock was tampered with to mislead the investigation.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_fp_contradiction_step_3",
      "category": "temporal",
      "description": "Faint scratch marks are found on the clock's winding key.",
      "sourceInCML": "CASE.inference_path.steps[2].correction",
      "pointsTo": "The scratch marks indicate recent tampering.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "contradiction"
    }
  ],
  "redHerrings": [
    {
      "id": "rh_1",
      "description": "Some believe the murder occurred after the clock struck eleven.",
      "supportsAssumption": "The murder occurred after the clock struck eleven.",
      "misdirection": "This misleads by suggesting that the clock's time is accurate, which is not the case."
    },
    {
      "id": "rh_2",
      "description": "Everyone thought struck was safe until later that night.",
      "supportsAssumption": "The murder occurred after the clock struck eleven.",
      "misdirection": "This implies a false sense of security, diverting attention from the eleven."
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
      "clue_clock_time",
      "clue_core_contradiction_chain",
      "clue_mechanism_visibility_core",
      "clue_fp_contradiction_step_2"
    ],
    "mid": [
      "clue_witness_statements",
      "clue_scratch_marks",
      "clue_culprit_direct_dr_mallory_finch",
      "clue_core_elimination_chain",
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
  "latencyMs": 9372,
  "cost": 0.0043935771000000005
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

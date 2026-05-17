# Actual Prompt Record

- Run ID: `mystery-1779031192067`
- Project ID: ``
- Timestamp: `2026-05-17T15:22:26.869Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `03e45c6302ba27b3`

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
    "title": "The Clockwork Murder",
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
      "institution": "country house estate"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "unknown"
    }
  },
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "detective",
      "relationships": [],
      "public_persona": "Intelligent and observant",
      "private_secret": "Struggles with familial expectations",
      "motive_seed": "Curiosity about the estate's hidden truths",
      "motive_strength": "strong",
      "alibi_window": "none",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Uncover the truth of the murder",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "witness",
      "relationships": [],
      "public_persona": "Respected physician",
      "private_secret": "Hides knowledge of the victim's past",
      "motive_seed": "Protecting a family secret",
      "motive_strength": "moderate",
      "alibi_window": "between 10:30 and 11:00",
      "access_plausibility": "medium",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Protect her reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "35-45",
      "role_archetype": "suspect",
      "relationships": [],
      "public_persona": "Charming and affable",
      "private_secret": "Has a gambling problem",
      "motive_seed": "Financial desperation",
      "motive_strength": "strong",
      "alibi_window": "between 10:00 and 11:10",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Avoid losing his status",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "25-35",
      "role_archetype": "staff",
      "relationships": [],
      "public_persona": "Loyal servant",
      "private_secret": "In love with Captain Hale",
      "motive_seed": "Jealousy towards the victim",
      "motive_strength": "weak",
      "alibi_window": "between 10:30 and 11:15",
      "access_plausibility": "medium",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Protect Hale",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
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
      "summary": "During the reading of a will at a remote manor, a hidden murder unfolds, leading detective Eleanor Voss to uncover the truth behind the clock's tampering that obscured the time of death."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "A mechanical clock was adjusted to misrepresent the time of death.",
      "delivery_path": [
        {
          "step": "The clock was wound back to show a false time."
        }
      ]
    },
    "outcome": {
      "result": "The true time of death is obscured."
    }
  },
  "false_assumption": {
    "statement": "The victim died at the time indicated by the clock.",
    "type": "temporal",
    "why_it_seems_reasonable": "The clock appears to be fully functional and has been maintained well.",
    "what_it_hides": "The clock was tampered with to misrepresent the actual time of death."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "last chime of the clock",
        "scheduled events"
      ],
      "windows": [
        "10:30 to 11:10"
      ],
      "contradictions": [
        "Witnesses claim to see Captain Hale at 10:50, but the clock shows 11:10."
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
        "the clock",
        "the garden",
        "the will"
      ],
      "permissions": [
        "access to the clock room"
      ]
    },
    "physical": {
      "laws": [
        "Physical tampering of mechanical devices can alter time appearance."
      ],
      "traces": [
        "Scratch marks on the clock's winding stem."
      ]
    },
    "social": {
      "trust_channels": [
        "Testimonies from other guests",
        "Staff account of the evening events"
      ],
      "authority_sources": [
        "Dr. Finch's medical opinion"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The clock shows ten minutes past eleven.",
        "correction": "Since the clock shows a later time than witnesses saw Hale, it contradicts his alibi.",
        "effect": "Eliminates Captain Ivor Hale as a credible alibi.",
        "required_evidence": [
          "The clock's time shows ten minutes past eleven.",
          "Witness statements indicate Hale was seen at 10:50."
        ],
        "reader_observable": true
      },
      {
        "observation": "A faint scratch is found on the clock's winding stem.",
        "correction": "The scratch suggests tampering, indicating the clock was adjusted.",
        "effect": "Narrows investigation focus to those with access to the clock.",
        "required_evidence": [
          "The scratch on the clock's winding stem.",
          "Access records show Hale was near the clock room."
        ],
        "reader_observable": true
      },
      {
        "observation": "Dr. Finch's account of the victim's last moments conflicts with the clock's time.",
        "correction": "If Finch's timing is accurate, the clock must be adjusted, indicating premeditated murder.",
        "effect": "Establishes Finch as a suspect capable of tampering.",
        "required_evidence": [
          "Dr. Finch's statement about the victim's last moments.",
          "The clock's time showing ten minutes past eleven."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "Comparing the clock's scratch marks with a known tool used by Finch reveals it was likely tampered with by her.",
    "knowledge_revealed": "The clock's mechanism was adjusted recently, aligning with Finch's access.",
    "pass_condition": "If the tool matches, Finch's involvement is confirmed.",
    "evidence_clues": [
      "clue_1",
      "clue_2",
      "clue_3",
      "clue_6",
      "clue_4",
      "clue_fp_contradiction_step_3"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The time shown on the clock and witness statements contradict Hale's alibi. Step 2: The scratch on the clock suggests tampering, implicating those with access to the clock. Step 3: Finch's conflicting account of the victim's last moments, combined with the clock's time, establishes her potential motive and opportunity."
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
        "clearance_method": "Her alibi is confirmed by other guests.",
        "supporting_clues": [
          "clue_1",
          "clue_2"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Her movements were accounted for by other staff.",
        "supporting_clues": [
          "clue_1",
          "clue_2"
        ]
      },
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: between 10:00 and 11:10",
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
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_core_contradiction_chain",
        "act_number": 1,
        "scene_number": 2,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_2",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_3",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Inspection of the clock"
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
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_6",
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
    "summary": "Eleanor Voss is a widowed matriarch and retired schoolteacher, known for her wisdom and kindness, yet she harbors a tumultuous past as a radical activist.",
    "publicPersona": "Eleanor presents herself as the epitome of grace and wisdom, often dispensing sage advice to her neighbors and friends in Little Middleton. She is the kind of woman who brings homemade cookies to her neighbors and volunteers at the local library, earning the affection of her community.",
    "privateSecret": "Beneath her gentle exterior lies a tempestuous past, one that includes fierce activism against the establishment. She once stood shoulder to shoulder with those who challenged authority, a fact she now hides to protect her family's reputation.",
    "motiveSeed": "Eleanor fears that her past connections to disgraced family members, who were involved in scandalous activities, may come to light and tarnish the legacy she has worked so hard to uphold.",
    "motiveStrength": "strong",
    "alibiWindow": "She was in the library with other guests, surrounded by literature and the comforting smell of old books, until the piercing scream shattered the evening's tranquility.",
    "accessPlausibility": "easy",
    "stakes": "For Eleanor, this murder is not just a mystery to solve; it is a matter of protecting her family's honor and legacy, which have been painstakingly built over the years.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.4,
    "speechMannerisms": "Eleanor speaks with a measured cadence, often pausing to choose her words carefully. She has a penchant for quoting literature, which adds a touch of whimsy to her otherwise serious conversations.",
    "internalConflict": "Eleanor grapples with the guilt of her past actions and the fear that they might resurface, endangering not only herself but also the reputation of her family.",
    "personalStakeInCase": "The crime matters deeply to Eleanor because her family's reputation hangs in the balance, and she feels a moral obligation to uncover the truth to protect her loved ones.",
    "paragraphs": [
      "Eleanor Voss, with her silver hair neatly pinned and a pair of spectacles perched on her nose, could easily be mistaken for a kindly grandmother, dispensing cookies and wisdom to the youth of Little Middleton. However, behind her warm smile lies a history that could ignite a scandal. Once a fervent activist, she fought against the very establishment she now appears to embrace. Memories of her past haunt her like shadows, threatening to tarnish the legacy she has built for her family.",
      "As she wandered the library, Eleanor found solace in the familiar scent of aged paper and leather bindings. It was a sanctuary, a place where she could lose herself in stories and forget the world outside. But when the scream pierced the air, her heart raced, not just from fear but from the dread of what might be revealed. The walls of her carefully constructed life felt as if they were closing in, and the thought of her past surfacing filled her with anxiety.",
      "In her interactions with the townsfolk, Eleanor maintained an air of dry wit, often using humor to deflect inquiries about her past. 'If only my life were as exciting as a novel,' she would say with a chuckle, masking the truth of her radical history. Yet, the stakes were high; if her secret were to come out, it could destroy not only her but also the reputation of her beloved family. She had worked too hard to let her past undo the future she envisioned for them.",
      "As the investigation unfolded, Eleanor felt a stirring within her—a desire for redemption. Perhaps, by solving the murder, she could confront her own demons and redeem herself in the eyes of her community. With each clue she uncovered, she felt a flicker of hope. It was not just about the murder; it was about reclaiming her identity and proving that she was more than the radical she once was. The truth, she knew, could either liberate her or imprison her further, but she was willing to take that risk for the sake of her family's honor."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch is a respected physician with a progressive approach to medicine, concealing a troubling addiction that threatens to unravel her life.",
    "publicPersona": "In the eyes of Little Middleton, Dr. Mallory Finch is a beacon of hope, a dedicated physician who advocates for innovative treatments and compassionate care. Her patients trust her implicitly, and her colleagues admire her commitment to pushing the boundaries of medical practice.",
    "privateSecret": "However, beneath her polished exterior lies a dark secret: a hidden addiction to painkillers that she struggles to control, a vice that could jeopardize her career and freedom.",
    "motiveSeed": "Desperate for funds to sustain her addiction, Dr. Finch stands to gain a substantial windfall from the victim's life insurance policy, creating a perilous conflict between her professional integrity and personal desperation.",
    "motiveStrength": "compelling",
    "alibiWindow": "Mallory claimed to be attending to a medical emergency involving another guest, a story that could be corroborated or contradicted depending on the investigation's findings.",
    "accessPlausibility": "possible",
    "stakes": "The stakes for Dr. Finch are high; if her addiction is exposed, it would not only ruin her career but also imprison her in a life of shame and regret.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.5,
    "speechMannerisms": "Her speech is often punctuated with nervous laughter, and she has a habit of downplaying her own achievements, frequently using phrases like 'I just try to do my best' or 'It's nothing really.'",
    "internalConflict": "Mallory is tormented by the duality of her existence—her public persona as a healer contrasts starkly with her private battles, creating a tension that leaves her feeling isolated and ashamed.",
    "personalStakeInCase": "For Mallory, this murder investigation is not just about justice; it is a chance to confront her own demons and perhaps find a way to reclaim her life from the clutches of addiction.",
    "paragraphs": [
      "Dr. Mallory Finch, with her meticulously styled hair and crisp white coat, was the epitome of a modern physician in Little Middleton. Patients flocked to her office, drawn not only by her progressive methods but also by her genuine warmth. Yet, behind her confident façade lay a secret that threatened to unravel everything she had built. As the daughter of a prominent doctor, expectations weighed heavily on her shoulders, and the pressure to succeed sometimes drove her to seek solace in the very substances she prescribed.",
      "That fateful evening, when the scream echoed through the halls, Mallory found herself caught in a web of panic and fear. She had just administered a dose to a guest, a desperate attempt to stave off her own cravings. The thrill of being needed as a doctor was intoxicating, but it paled in comparison to the relief she sought from her addiction. When she claimed to be attending to a medical emergency, she hoped it would shield her from scrutiny, but the truth was that she was teetering on the edge of a precipice.",
      "In conversations with her peers, Mallory often employed self-deprecating humor to mask her insecurities. 'Oh, I’m just a glorified pill pusher,' she would joke, her laughter tinged with nervousness. Yet, beneath the surface, she was a woman grappling with the fear that her addiction would be exposed, that her patients would no longer trust her, and that her career would crumble like a house of cards.",
      "As the investigation progressed, Mallory felt a flicker of hope mixed with dread. Perhaps this murder was an opportunity to confront her addiction and reclaim her life. The stakes were higher than ever; if she could navigate the murky waters of the investigation without her secret surfacing, she might find the strength to seek help. For Mallory, the case was not just about solving a crime; it was a chance for redemption, a chance to emerge from the shadows of her addiction and embrace the light of honesty."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale is a retired naval officer whose esteemed reputation masks a simmering resentment towards the victim from their shared past.",
    "publicPersona": "Respected and dignified, Captain Ivor Hale is a war hero in Little Middleton, known for his unwavering sense of honor and commitment to decorum. He is often seen as a pillar of the community, dispensing wisdom and guidance to those who seek it.",
    "privateSecret": "Yet, beneath this polished exterior lies a deep-seated resentment towards the victim, who he believes has tarnished his family's name through perceived slights and betrayals.",
    "motiveSeed": "Fueled by a desire for vengeance, Ivor believes that the victim's actions have dishonored his family, compelling him to consider drastic measures.",
    "motiveStrength": "strong",
    "alibiWindow": "Earlier in the evening, he was seen in a heated argument with the victim, a confrontation that raised eyebrows and cast suspicion in his direction.",
    "accessPlausibility": "possible",
    "stakes": "For Ivor, the stakes are not just personal; they involve his honor and legacy, as he risks losing his esteemed position in society if his connection to the murder is revealed.",
    "humourStyle": "blunt",
    "humourLevel": 0.3,
    "speechMannerisms": "Ivor speaks with a commanding presence, often using a firm tone and direct language. He has little patience for frivolous conversation and prefers to get straight to the point.",
    "internalConflict": "Ivor is torn between his ingrained values of honor and the desire for retribution, creating a moral struggle that threatens to consume him.",
    "personalStakeInCase": "This crime matters profoundly to Ivor because it directly threatens his reputation and the legacy of honor he has built throughout his life.",
    "paragraphs": [
      "Captain Ivor Hale, with his chestnut hair now flecked with gray and a posture that exuded authority, had long been a respected figure in Little Middleton. His naval service defined him, and he wore his medals like armor, shielding him from the vulnerabilities of civilian life. Yet, beneath the surface of this war hero lay a simmering resentment towards the victim, a resentment that had festered over the years due to perceived slights and betrayals. The very thought of the victim's actions tarnishing his family's name ignited a fire within him.",
      "On the night of the murder, Ivor found himself embroiled in a heated argument with the victim, a confrontation that left witnesses murmuring about the tension between the two men. Ivor's face reddened with indignation as he recalled the insults hurled at him, the ways in which his honor had been called into question. The argument had escalated, and Ivor had stormed away, seething with rage and a desire for retribution. As he paced the grounds, he felt a darkness creeping into his heart, tempting him to consider actions he had long deemed unacceptable.",
      "When speaking to others, Ivor's blunt manner often caught people off guard. 'I have no time for nonsense,' he would declare, his voice unwavering. His directness was both refreshing and intimidating, but it left little room for humor. He believed that honor was something to be upheld, not toyed with, and he had little patience for those who did not share his convictions. Yet, as he navigated the complexities of the murder investigation, he began to question whether his desire for vengeance was truly honorable.",
      "As the investigation unfolded, Ivor felt the weight of his internal conflict bearing down on him. He was torn between the values he had upheld throughout his life and the urge to seek vengeance against the man he believed had wronged him. The stakes were higher than ever; if his connection to the murder were to be revealed, it would not only tarnish his reputation but also shatter the legacy he had built. Ultimately, Ivor realized that this case was not just about the victim; it was about confronting his own demons and determining what kind of man he truly wanted to be."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill is a charming socialite disillusioned by her privileged upbringing, seeking to escape her gilded cage through the untimely demise of the victim.",
    "publicPersona": "Known for her vivacity and lavish parties, Beatrice Quill is the life of any gathering in Little Middleton. With a sparkling smile and an infectious laugh, she captivates those around her, embodying the ideal socialite of her time.",
    "privateSecret": "Beneath her charming facade lies a profound sense of entrapment, feeling suffocated by the expectations of her privileged life and yearning for independence.",
    "motiveSeed": "Beatrice sees the victim's demise as a potential means to inherit the family fortune, a chance to escape her gilded cage and finally take control of her own destiny.",
    "motiveStrength": "moderate",
    "alibiWindow": "Beatrice claimed to have been in her room preparing for a gala, a statement that could either lend her an alibi or raise further questions depending on the investigation's trajectory.",
    "accessPlausibility": "possible",
    "stakes": "For Beatrice, the stakes are personal; her future and independence hinge on a change in her financial status, which the victim's death could facilitate.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Beatrice often speaks in a lively, animated manner, her sentences peppered with sarcasm and playful banter. She has a knack for witty retorts and enjoys keeping her audience engaged.",
    "internalConflict": "Beatrice wrestles with her desire for freedom and her loyalty to her family, creating a tension that leaves her questioning her values and choices.",
    "personalStakeInCase": "The murder investigation matters significantly to Beatrice, as it offers her the chance to reshape her life and pursue a future defined by her own choices rather than familial obligations.",
    "paragraphs": [
      "Beatrice Quill, with her flowing gowns and laughter that rang through the halls of Little Middleton, was the quintessential socialite. Her parties were the talk of the town, and she thrived on the attention and admiration of her peers. Yet, beneath the surface of her charming exterior lay a disillusionment that gnawed at her—a sense of entrapment in a gilded cage, where expectations suffocated her spirit. Beatrice longed for freedom, for the opportunity to carve out a life that was truly her own.",
      "On the night of the murder, Beatrice found herself preparing for yet another gala, her mind racing with thoughts of escape. She had heard whispers about the victim's life insurance policy, and the idea of inheriting a fortune sparked a flicker of hope within her. 'What a delightful way to make an exit,' she mused, her sardonic humor betraying the seriousness of her thoughts. The victim's untimely demise could pave the way for her liberation, but at what cost?",
      "In conversations, Beatrice's sardonic wit often shone through, as she effortlessly turned mundane exchanges into lively banter. 'Oh, darling, who needs a prince when you have a bank account?' she would quip, her eyes sparkling with mischief. Her humor was a shield, a way to mask her insecurities and the weight of her family's expectations. Yet, as the investigation unfolded, she began to question whether her dreams of freedom were worth the price of another's life.",
      "As the mystery deepened, Beatrice felt the pull of her internal conflict intensifying. She was torn between her desire for independence and her loyalty to her family, creating a tension that left her restless. The stakes were personal, and the investigation offered her a chance to redefine her life on her own terms. Beatrice realized that the murder was not just about the victim; it was a turning point in her journey towards authenticity, a chance to confront her values and choose a path that aligned with her true self."
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
    "summary": "A sprawling manor house steeped in opulence yet shadowed by isolation, where secrets linger in every corner.",
    "visualDescription": "The manor boasts grand Georgian architecture with tall windows, surrounded by meticulously trimmed hedges and a thick forest that looms ominously at its edges. Ivy clings to the stone walls, and the slate roof glistens with rain.",
    "atmosphere": "A palpable tension lingers in the air, where whispers of the past echo amidst the grandeur.",
    "paragraphs": [
      "Little Middleton Manor rises from the mist like a ghostly sentinel, its stone façade weathered yet imposing against the darkening skies. Towering oaks encircle the estate, their gnarled branches forming a protective barrier that only adds to the feeling of isolation. The manicured gardens, once a source of pride, now seem to wilt under the weight of secrets, with rain-soaked petals clinging to life amid the encroaching gloom.",
      "Inside, the grand foyer opens up to an elegant staircase, its polished banister gleaming under the soft glow of gas lamps. The air is thick with the scent of damp wood and aged leather, a testament to the manor's long history. Each room tells a story, from the drawing room filled with antique furniture and the distant sound of a typewriter in the study to the library, where volumes of forgotten lore lie waiting to be unearthed. The atmosphere is heavy, a tension palpable as guests move about, each step echoing the unspoken fears that linger like shadows.",
      "As evening falls, the house transforms; shadows stretch across the walls, and the flickering of candlelight casts a dance of uncertainty. The distant tolling of a clock reverberates throughout the manor, a reminder of the time slipping away, intensifying the urgency of the unfolding drama. Outside, the rain drums against the windows, a relentless reminder of the world beyond, while inside, the occupants are trapped in a web of suspicion and intrigue.",
      "In this house of wealth and privilege, class tensions simmer beneath the surface. The Great Depression has left its mark, and whispers of discontent fill the air. The manor, once a symbol of security, now stands as a monument to the fragility of status and the ever-present threat of exposure. As secrets unravel, the true nature of those within these walls will be laid bare, revealing the dark heart of Little Middleton."
    ]
  },
  "atmosphere": {
    "era": "1930s",
    "weather": "Overcast skies with intermittent rain, creating a somber mood.",
    "timeFlow": "A weekend of escalating tension, with events unfolding over three days.",
    "mood": "Tense and foreboding, reflecting the underlying class tensions and societal unease of the era.",
    "eraMarkers": [
      "Typewriters clattering in the study",
      "Radio crackling with news bulletins",
      "Early home telephones with party lines",
      "Petrol-driven automobiles parked in the gravel drive"
    ],
    "sensoryPalette": {
      "dominant": "The scent of damp earth and aged wood",
      "secondary": [
        "Whispers of the past",
        "Flickering candlelight"
      ]
    },
    "paragraphs": [
      "The air is thick with anticipation as clouds loom overhead, casting a pall over the estate. The rhythmic patter of rain against the windows creates a hypnotic backdrop, punctuating the silence that hangs in the hallways. Each room is a time capsule, preserving the echoes of laughter and sorrow, while the scent of damp stone mingles with the musty aroma of forgotten books in the library. The atmosphere is heavy with unspoken words, every creak of the floorboards a reminder of the fragile peace.",
      "As daylight fades, the manor exudes an eerie charm, with shadows dancing in the candlelight. The distant chime of the grandfather clock punctuates the stillness, marking the passage of time and the growing tension among the inhabitants. Outside, the rain blurs the boundaries of the estate, isolating it from the world beyond. In this haven of opulence, the unseen threat of class struggle and societal upheaval looms large, promising to unravel the carefully woven fabric of privilege."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Library",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "A dimly lit room lined with shelves of dusty tomes, a grand fireplace, and a large oak desk cluttered with papers.",
      "sensoryDetails": {
        "sights": [
          "dust motes in the air",
          "dark wood paneling",
          "flickering candlelight"
        ],
        "sounds": [
          "crackling fire",
          "pages turning",
          "distant thunder"
        ],
        "smells": [
          "old leather and parchment",
          "smoky fireplace ash",
          "damp wool"
        ],
        "tactile": [
          "cold marble floor",
          "smooth leather-bound books",
          "worn armchair upholstery"
        ]
      },
      "accessControl": "Restricted access; only family and select guests allowed after dinner; locked when not in use.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-streaked window panes",
            "grey light filtering through curtains"
          ],
          "sounds": [
            "steady rain on glass",
            "soft rustle of pages"
          ],
          "smells": [
            "damp earth",
            "mildew",
            "wet stone"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dimly lit corners",
            "shadows creeping on the walls"
          ],
          "sounds": [
            "silence punctuated by distant footsteps",
            "the low hum of the radio"
          ],
          "smells": [
            "beeswax candles",
            "old wood",
            "dust"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight casting long shadows",
            "the glow of the fireplace"
          ],
          "sounds": [
            "the tick of a clock",
            "soft laughter from outside"
          ],
          "smells": [
            "freshly brewed tea",
            "woodsmoke",
            "candle wax"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The library, a sanctuary of knowledge, now serves as the backdrop for a chilling discovery. Dust dances in the air, illuminated by the flickering candlelight, as the once-quiet space becomes a stage for unraveling secrets. The grand fireplace sits cold, its ashes untouched, while the oak desk is cluttered with hastily written notes and a single, ominous clock that ticks away the moments. The scent of aged parchment mingles with the dampness of the room, enveloping the atmosphere in a shroud of unease.",
        "With each creak of the floorboards, the tension heightens. The shadows cast by the flickering candles seem to stretch and twist, reflecting the turmoil brewing within the hearts of those who dare to enter. Whispers of the past echo in the silence, and the weight of history presses down, making it clear that the truth hidden within these walls will not remain concealed for long."
      ]
    },
    {
      "id": "drawing_room",
      "name": "The Drawing Room",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "A lavish room adorned with ornate furniture, plush carpets, and a grand piano in the corner, all under the watchful eyes of family portraits.",
      "sensoryDetails": {
        "sights": [
          "richly patterned wallpaper",
          "gleaming brass accents",
          "faded family portraits"
        ],
        "sounds": [
          "soft piano notes",
          "murmurs of conversation",
          "the crackling of a fire"
        ],
        "smells": [
          "freshly polished wood",
          "lavender potpourri",
          "smoky embers"
        ],
        "tactile": [
          "soft velvet cushions",
          "chilly marble fireplace mantle",
          "smooth glass of whiskey"
        ]
      },
      "accessControl": "Open to guests during social hours; off-limits for staff unless summoned.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "dim light filtering through heavy curtains",
            "raindrops trickling down the windows"
          ],
          "sounds": [
            "the patter of rain on the roof",
            "soft whispers of guests"
          ],
          "smells": [
            "freshly brewed coffee",
            "wet wool",
            "dusty books"
          ],
          "mood": "melancholic"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "fading light casting shadows",
            "the flicker of candle flames"
          ],
          "sounds": [
            "the distant sound of a clock chiming",
            "muffled conversations"
          ],
          "smells": [
            "old leather",
            "perfume lingering in the air",
            "woodsmoke"
          ],
          "mood": "tense"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "golden light from the chandelier",
            "the glow of the fire reflecting on the walls"
          ],
          "sounds": [
            "laughter and clinking glasses",
            "the rustle of evening gowns"
          ],
          "smells": [
            "fine tobacco",
            "freshly baked pastries",
            "candle wax"
          ],
          "mood": "opulent yet anxious"
        }
      ],
      "paragraphs": [
        "The drawing room is an embodiment of elegance, its walls adorned with rich patterns and the air suffused with the scent of lavender and polished wood. Plush carpets muffle footsteps, creating an atmosphere of intimacy among the gathered guests. Here, the soft notes of a piano fill the silence, but beneath the surface, a current of tension flows, as laughter masks the unease that lingers like smoke from the fireplace.",
        "As the evening unfolds, the room transforms; shadows deepen, and the flickering flames of candles dance, casting a warm glow that belies the chill in the air. Conversations grow hushed, glances exchanged in a delicate balance of politeness and suspicion. Each guest wears a mask of civility, yet the weight of unspoken truths hangs heavily, hinting that not all is as it seems within this sanctuary of wealth."
      ]
    },
    {
      "id": "study",
      "name": "The Study",
      "type": "interior",
      "purpose": "Clue discovery",
      "visualDetails": "A small, cluttered room filled with bookshelves, a large oak desk, and a typewriter, with a single window overlooking the estate grounds.",
      "sensoryDetails": {
        "sights": [
          "books piled high",
          "papers strewn across the desk",
          "the glow of a desk lamp"
        ],
        "sounds": [
          "the clatter of a typewriter",
          "the rustle of paper",
          "the distant sound of rain"
        ],
        "smells": [
          "ink and paper",
          "old wood",
          "the scent of tobacco"
        ],
        "tactile": [
          "smooth typewriter keys",
          "rough paper edges",
          "the coolness of the window frame"
        ]
      },
      "accessControl": "Restricted to the owner and trusted family members; off-limits to guests.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light filtering through the window",
            "water droplets on the glass"
          ],
          "sounds": [
            "rain tapping against the roof",
            "the soft clatter of the typewriter"
          ],
          "smells": [
            "freshly brewed coffee",
            "wet paper",
            "mildew"
          ],
          "mood": "reflective"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "fading light casting long shadows",
            "the flicker of a candle"
          ],
          "sounds": [
            "the ticking of a clock",
            "the soft rustle of paper"
          ],
          "smells": [
            "old books",
            "cigar smoke",
            "dust"
          ],
          "mood": "tense"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "the warm glow of the desk lamp",
            "the silhouette of a figure against the window"
          ],
          "sounds": [
            "the soft tap of a typewriter",
            "the distant hum of conversation"
          ],
          "smells": [
            "freshly brewed tea",
            "leather and ink",
            "the scent of wood polish"
          ],
          "mood": "unsettling"
        }
      ],
      "paragraphs": [
        "The study is a realm of quiet chaos, filled with the weight of knowledge and the scent of ink. Bookshelves sag under the burden of tomes, and the oak desk stands as a testament to the owner's relentless pursuit of truth. Papers are strewn across the surface, some marked with hasty notes, while the typewriter sits poised for action, ready to record the unfolding drama. Outside, the rain beats against the window, a relentless reminder of the storm brewing within.",
        "As the shadows lengthen, the atmosphere grows thick with anticipation. The ticking of the clock echoes in the silence, a metronome for the secrets waiting to be uncovered. Each rustle of paper feels like a whisper, and the lingering scent of tobacco adds an air of nostalgia and tension. In this sanctuary of thought, the truth lies hidden, waiting for the right moment to emerge from the shadows."
      ]
    }
  ],
  "note": "",
  "cost": 0.0018951586499999999,
  "durationMs": 20010
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1939,
    "month": "October",
    "day": 15,
    "era": "1930s"
  },
  "seasonal": {
    "season": "fall",
    "month": "October",
    "weather": [
      "overcast skies",
      "intermittent rain",
      "chilly winds"
    ],
    "daylight": "Days are shorter, with twilight descending around six o'clock, casting a gloomy atmosphere over the estate.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, as the rain patters against the windows.",
    "holidays": [
      "Halloween"
    ],
    "seasonalActivities": [
      "apple picking at nearby orchards",
      "attending harvest festivals",
      "decorating for Halloween"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "tailored wool suit",
        "double-breasted waistcoat",
        "cravat or tie"
      ],
      "casual": [
        "tweed jacket",
        "knitted pullover",
        "corduroy trousers"
      ],
      "accessories": [
        "fedora hat",
        "leather gloves",
        "pocket watch"
      ]
    },
    "womensWear": {
      "formal": [
        "tea-length dress with a fitted bodice",
        "tailored wool coat",
        "beaded evening gown"
      ],
      "casual": [
        "tweed skirt",
        "blouse with puffed sleeves",
        "cardigan sweater"
      ],
      "accessories": [
        "cloche hat",
        "string of pearls",
        "handbag with clasp"
      ]
    },
    "trendsOfTheMoment": [
      "mixing patterns in outfits",
      "the popularity of tailored clothing for women",
      "the rise of practical footwear like oxfords"
    ],
    "socialExpectations": [
      "men expected to wear formal attire for dinner",
      "women should maintain a modest and elegant appearance",
      "class distinctions dictate social interactions"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "tensions rise as Europe braces for war",
      "Britain prepares for possible involvement in the conflict",
      "Nazi Germany's aggression towards Poland remains a hot topic"
    ],
    "politicalClimate": "A climate of anxiety as war looms, with political discussions dominated by the threat of fascism in Europe.",
    "economicConditions": "The shadow of the Great Depression lingers, with unemployment still affecting many families; however, some industries are seeing a slight recovery due to military contracts.",
    "socialIssues": [
      "class disparities exacerbated by economic strains",
      "women's rights gaining traction as more women work in offices",
      "conversations around pacifism versus militarism intensifying"
    ],
    "internationalNews": [
      "the Munich Agreement's failure becomes a lesson in appeasement",
      "the impact of the Spanish Civil War resonates across Europe"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Glenn Miller's big band sound",
        "Duke Ellington's jazz compositions",
        "popular crooners like Bing Crosby"
      ],
      "films": [
        "Gone with the Wind",
        "The Wizard of Oz",
        "Mr. Smith Goes to Washington"
      ],
      "theater": [
        "The Man Who Came Back",
        "The Women",
        "Of Mice and Men"
      ],
      "radio": [
        "The Shadow",
        "Amos 'n' Andy",
        "The Phil Harris-Alice Faye Show"
      ]
    },
    "literature": {
      "recentPublications": [
        "The Grapes of Wrath by John Steinbeck",
        "Brave New World by Aldous Huxley",
        "The Maltese Falcon by Dashiell Hammett"
      ],
      "popularGenres": [
        "mystery",
        "social realism",
        "political fiction"
      ]
    },
    "technology": {
      "recentInventions": [
        "the ballpoint pen",
        "improvements in radio technology",
        "the development of the first mass-produced cars"
      ],
      "commonDevices": [
        "wireless radios",
        "home telephones",
        "typewriters in offices"
      ],
      "emergingTrends": [
        "increasing popularity of cinema as a form of escape",
        "the rise of the automobile culture",
        "the spread of consumer goods through advertising"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Cinema ticket: one shilling",
        "Coffee at a café: sixpence"
      ],
      "commonActivities": [
        "host dinner parties",
        "go on weekend country outings",
        "participate in community harvest fairs"
      ],
      "socialRituals": [
        "afternoon tea served with pastries",
        "formal dinner gatherings with multiple courses"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "the upper class maintains a sense of superiority",
      "the middle class is striving to appear affluent",
      "the working class faces increasing hardships"
    ],
    "gender": [
      "traditional roles for men and women are still predominant",
      "women are expected to embody grace and domesticity",
      "more women are entering the workforce due to economic necessity"
    ],
    "race": [
      "racial tensions are simmering in the context of fascism",
      "African Americans face discrimination and limited opportunities",
      "there are emerging conversations around civil rights"
    ],
    "generalNorms": [
      "politeness and formality are paramount in social settings",
      "decorum in behavior is expected, especially among the upper classes",
      "conversations about politics and war are often avoided in polite company"
    ]
  },
  "atmosphericDetails": [
    "The scent of wet earth fills the air as rain falls softly on the manicured lawns of the estate.",
    "The low rumble of thunder in the distance adds a sense of foreboding, mirroring the tensions felt in society.",
    "Flickering candlelight casts long shadows against the intricate wallpaper inside the grand dining room, creating an ambiance of intimacy mixed with unease."
  ],
  "paragraphs": [
    "October 1939 unfolds with a somber chill, as overcast skies loom heavily over the country estate. The air is thick with the scent of damp leaves and the distant echoes of thunder, creating a foreboding atmosphere that mirrors the anxieties of the time. As the days grow shorter, twilight descends upon the manor by six o'clock, enveloping its halls in a muted gloom, punctuated only by the flicker of candlelight during evening dinners. The estate, once a symbol of grandeur, now feels like a mere backdrop to the tensions brewing across Europe, where the specter of war threatens to upend lives and legacies.",
    "Fashion in October 1939 reflects both the elegance of the upper classes and the practical needs born from a lingering economic strain. Men don tailored wool suits and cravats for formal occasions, while women showcase tea-length dresses and beaded evening gowns, accessorized with cloche hats and strands of pearls. The practicalities of the season are evident as ladies opt for knitted pullovers and tweed skirts during casual outings. This interplay of style and circumstance underscores a society grappling with class divisions, where every outfit tells a story of aspiration and restraint.",
    "Daily life within the manor is punctuated by rituals of formality. Guests are welcomed with afternoon tea served alongside delicate pastries, while evenings are reserved for elaborate dinners where multiple courses are served, all while conversations delicately skirt around the growing political unrest. The economic landscape influences social behavior, with many families tightening their belts, yet making efforts to maintain appearances. The tension between social classes is palpable, as the upper echelons of society cling to their traditions, while the middle and working classes are forced to adapt, reflecting the broader societal unease that hangs in the air like the impending storm."
  ],
  "note": "",
  "cost": 0.0010821657,
  "durationMs": 12772
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A family gathering at the estate for a will reading forces heirs and staff to confront their hidden resentments amidst the tensions of the Great Depression and the looming threat of fascism.",
  "era": {
    "decade": "1930s",
    "socialStructure": "Strict social hierarchies within the manor house reflect broader societal tensions, as wealth disparities deepen due to the Great Depression."
  },
  "setting": {
    "location": "A sprawling manor house set in a remote countryside, surrounded by manicured gardens and dense woods.",
    "institution": "country house estate",
    "weather": "Overcast skies with intermittent rain, creating a somber mood."
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
    "id": "compass_bearing",
    "value": "northwest",
    "description": "The direction the clock was facing when discovered"
  },
  {
    "id": "weight_of_clock",
    "value": "three pounds twelve ounces",
    "description": "The weight of the clock used in the crime"
  }
]

### CLUE_DISTRIBUTION
{
  "clues": [
    {
      "id": "clue_mechanism_visibility_core",
      "category": "temporal",
      "description": "A mechanical clock was adjusted to misrepresent the time of death.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "It indicates potential foul play regarding the time of death.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_contradiction_chain",
      "category": "temporal",
      "description": "Since the clock shows a later time than witnesses saw Hale, it contradicts his alibi.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "This casts doubt on Hale's claim of being elsewhere at the time of the murder.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_1",
      "category": "temporal",
      "description": "The clock shows ten minutes past eleven.",
      "sourceInCML": "CASE.inference_path.steps[0].required_evidence[0]",
      "pointsTo": "This time is crucial for establishing the timeline of events.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_2",
      "category": "temporal",
      "description": "A faint scratch is found on the clock's winding stem.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "This could indicate tampering with the clock.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_3",
      "category": "temporal",
      "description": "Dr. Finch's account of the victim's last moments conflicts with the clock's time.",
      "sourceInCML": "CASE.inference_path.steps[1].required_evidence[0]",
      "pointsTo": "This inconsistency raises questions about the reliability of his testimony.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_4",
      "category": "temporal",
      "description": "If Finch's timing is accurate, the clock must be adjusted, indicating premeditated murder.",
      "sourceInCML": "CASE.inference_path.steps[1].correction",
      "pointsTo": "This suggests a deliberate effort to mislead investigators.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_culprit_direct_eleanor_voss",
      "category": "spatial",
      "description": "Direct evidence ties Eleanor Voss to the mechanism access point before the discriminating test.",
      "sourceInCML": "CASE.cast[0].access_plausibility",
      "pointsTo": "This direct evidence shows Eleanor Voss had means and opportunity, narrowing the solution uniquely toward the culprit.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_elimination_chain",
      "category": "testimonial",
      "description": "Eliminates Captain Ivor Hale because he was seen by multiple people at the tavern until ten fifty in the morning.",
      "sourceInCML": "CASE.cast[2].alibi_window",
      "pointsTo": "This corroborates his alibi and rules him out as a suspect.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_5",
      "category": "behavioral",
      "description": "Eleanor Voss displayed unusual curiosity about the estate's hidden truths.",
      "sourceInCML": "CASE.inference_path.steps[2].observation",
      "pointsTo": "This behavior could indicate premeditation regarding the murder.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_6",
      "category": "physical",
      "description": "Comparing the clock's scratch marks with a known tool used by Finch reveals it was likely tampered with.",
      "sourceInCML": "CASE.inference_path.steps[2].required_evidence[1]",
      "pointsTo": "This evidence points toward Finch's involvement.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_late_optional_slot_1",
      "category": "temporal",
      "description": "Last chime of the clock remains a late texture detail in the case background.",
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
      "description": "Dr. Finch's account of the victim's last moments conflicts with the clock's time.",
      "sourceInCML": "CASE.inference_path.steps[2].correction",
      "pointsTo": "If Finch's timing is accurate, the clock must be adjusted, indicating premeditated murder.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "contradiction"
    }
  ],
  "redHerrings": [
    {
      "id": "rh_1",
      "description": "The victim's body was found near the appears, suggesting the time indicated by the appears is functional.",
      "supportsAssumption": "The victim died at the time indicated by the clock.",
      "misdirection": "This misleads the reader into believing the appears's time is reliable, despite evidence of fully."
    },
    {
      "id": "rh_2",
      "description": "witness claim they heard the maintained chime at the time of the murder.",
      "supportsAssumption": "The victim died at the time indicated by the clock.",
      "misdirection": "This creates the illusion of a solid timeline, obscuring the evidence of maintained manipulation."
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
      "clue_mechanism_visibility_core",
      "clue_core_contradiction_chain",
      "clue_1",
      "clue_2"
    ],
    "mid": [
      "clue_3",
      "clue_4",
      "clue_culprit_direct_eleanor_voss",
      "clue_core_elimination_chain",
      "clue_5",
      "clue_6",
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
  "latencyMs": 11450,
  "cost": 0.0045851916
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

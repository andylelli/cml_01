# Actual Prompt Record

- Run ID: `run_9e98f2e3-b11f-4ca1-8d65-a70edbc4c3be`
- Project ID: `proj_62757a44-1cc4-49b5-b5ea-3977dbd82113`
- Timestamp: `2026-06-14T07:52:56.046Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `de566b91af1077ff`

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
    "title": "The Echoes of Time",
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
      "subtype": "poisoning"
    }
  },
  "cast": [
    {
      "name": "Laurence Chalcott",
      "age_range": "40-50",
      "role_archetype": "victim",
      "relationships": [
        "Patricia Corfield (fiancée)",
        "Julian Cromer (friend)",
        "Wilfred Wellow (business partner)"
      ],
      "public_persona": "Wealthy estate owner",
      "private_secret": "Struggling financially, hiding debts",
      "motive_seed": "Financial desperation",
      "motive_strength": "high",
      "alibi_window": "10 minutes before the party started",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Garden path",
        "Back entrance"
      ],
      "behavioral_tells": [
        "Seen arguing with Wilfred"
      ],
      "stakes": "Inheritance and estate management",
      "evidence_sensitivity": [
        "Clock manipulation",
        "Witness testimonies"
      ],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "male"
    },
    {
      "name": "Patricia Corfield",
      "age_range": "30-40",
      "role_archetype": "Fiancée",
      "relationships": [
        "Laurence Chalcott (fiancé)",
        "Julian Cromer (friend)"
      ],
      "public_persona": "Charming and sophisticated",
      "private_secret": "Had a secret financial arrangement with Laurence",
      "motive_seed": "Financial security",
      "motive_strength": "moderate",
      "alibi_window": "Present during the party",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Ballroom",
        "Library"
      ],
      "behavioral_tells": [
        "Nervous during questioning"
      ],
      "stakes": "Future inheritance",
      "evidence_sensitivity": [
        "Witness statements",
        "Financial records"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Julian Cromer",
      "age_range": "30-40",
      "role_archetype": "Friend",
      "relationships": [
        "Laurence Chalcott (friend)",
        "Patricia Corfield (fiancée)"
      ],
      "public_persona": "Loyal and dependable",
      "private_secret": "In love with Patricia",
      "motive_seed": "Jealousy",
      "motive_strength": "low",
      "alibi_window": "Seen at the party",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Garden",
        "Dining room"
      ],
      "behavioral_tells": [
        "Too eager to provide alibi"
      ],
      "stakes": "Keeping Patricia's affection",
      "evidence_sensitivity": [
        "Witness accounts",
        "Party schedule"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Wilfred Wellow",
      "age_range": "40-50",
      "role_archetype": "Business partner",
      "relationships": [
        "Laurence Chalcott (business partner)",
        "Joan Plowden (detective)"
      ],
      "public_persona": "Cunning and ambitious",
      "private_secret": "Involved in illicit dealings",
      "motive_seed": "Financial gain",
      "motive_strength": "high",
      "alibi_window": "Claimed to be in the garden",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Garden entrance",
        "Study"
      ],
      "behavioral_tells": [
        "Defensive during questioning"
      ],
      "stakes": "Financial control of the estate",
      "evidence_sensitivity": [
        "Witness statements",
        "Financial documents"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "male"
    },
    {
      "name": "Joan Plowden",
      "age_range": "30-40",
      "role_archetype": "Detective",
      "relationships": [
        "Laurence Chalcott (victim)",
        "Wilfred Wellow (business partner)"
      ],
      "public_persona": "Sharp and intuitive",
      "private_secret": "Formerly engaged to Laurence",
      "motive_seed": "Unresolved feelings",
      "motive_strength": "low",
      "alibi_window": "At the party with guests",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Library",
        "Ballroom"
      ],
      "behavioral_tells": [
        "Calm and collected"
      ],
      "stakes": "Professional integrity",
      "evidence_sensitivity": [
        "Witness testimonies",
        "Party schedule"
      ],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
    }
  ],
  "culpability": {
    "culprit_count": 1,
    "culprits": [
      "Wilfred Wellow"
    ]
  },
  "surface_model": {
    "narrative": {
      "summary": "During a lavish party at the Chalcott Manor, Laurence Chalcott is found dead, leading to a tangled web of lies, jealousy, and financial desperation. As Detective Joan Plowden digs deeper, she uncovers manipulated timelines and hidden motives that reveal the true killer among the guests."
    },
    "accepted_facts": [
      "Laurence Chalcott was found dead in the garden.",
      "Witnesses reported seeing him alive shortly before the party started.",
      "The clock in the study was stopped at ten minutes past eleven."
    ],
    "inferred_conclusions": [
      "The time of death may not align with witnesses' statements.",
      "The clock manipulation suggests a deliberate attempt to mislead."
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "A clock was wound back to create a false timeline of events, leading witnesses to believe Laurence was alive for longer than he actually was.",
      "delivery_path": [
        {
          "step": "Clock was manipulated."
        },
        {
          "step": "Witnesses believed they saw Laurence alive."
        },
        {
          "step": "Murder occurred before the party started."
        }
      ]
    },
    "outcome": {
      "result": "Wilfred Wellow is identified as the murderer."
    }
  },
  "false_assumption": {
    "statement": "Laurence Chalcott was alive until the party began.",
    "type": "temporal",
    "why_it_seems_reasonable": "Witnesses reported seeing him just before the festivities, making it seem he had a motive to be present.",
    "what_it_hides": "The murder occurred earlier, and the clock's manipulation misled everyone."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Clock stopped at ten minutes past eleven",
        "Party began at eleven"
      ],
      "windows": [
        "Time of death assumed to be during the party"
      ],
      "contradictions": [
        "Witnesses saw Laurence alive at eleven",
        "Clock shows stopped time"
      ]
    },
    "access": {
      "actors": [
        "Wilfred Wellow",
        "Julian Cromer",
        "Patricia Corfield"
      ],
      "objects": [
        "Clock",
        "Garden path",
        "Chalice"
      ],
      "permissions": [
        "Access to the study",
        "Access to the garden"
      ]
    },
    "physical": {
      "laws": [
        "Time perception can be manipulated",
        "Physical evidence can be altered"
      ],
      "traces": [
        "Fingerprints on the clock",
        "Footprints in the garden"
      ]
    },
    "social": {
      "trust_channels": [
        "Witnesses' reliability",
        "Social standing"
      ],
      "authority_sources": [
        "Party organizer's schedule",
        "Housekeeper's reports"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The clock in the study shows it stopped at ten minutes past eleven.",
        "correction": "This indicates the time of death may not align with when witnesses last saw Laurence.",
        "effect": "Narrows the window of opportunity for the murder, suggesting a timing discrepancy.",
        "required_evidence": [
          "Clock stopped at ten minutes past eleven",
          "Witnesses' statements about Laurence's last sighting"
        ],
        "reader_observable": true
      },
      {
        "observation": "Witnesses claim they saw Laurence alive at eleven o'clock.",
        "correction": "This contradicts the clock's stopped time, indicating manipulation.",
        "effect": "Eliminates the assumption that Laurence was alive until the party began.",
        "required_evidence": [
          "Witness statements about Laurence's presence",
          "Clock evidence showing inconsistency"
        ],
        "reader_observable": true
      },
      {
        "observation": "Footprints in the garden lead to the back entrance.",
        "correction": "This suggests someone used the entrance to leave after the murder.",
        "effect": "Narrows the suspect pool to those who had access to the garden.",
        "required_evidence": [
          "Footprints leading to the back entrance",
          "Garden access permissions"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "A controlled comparison of witness statements and the clock's stopped time reveals the manipulation.",
    "knowledge_revealed": "The clock was tampered with to mislead witnesses about the time of death.",
    "pass_condition": "If the clock's time contradicts statements, Wilfred's alibi collapses.",
    "evidence_clues": [
      "clue_4",
      "clue_1",
      "clue_mechanism_visibility_core",
      "clue_fp_contradiction_step_1"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The stopped clock (early) and witness reports (mid) let the reader deduce the timing discrepancy. Step 2: Footprint evidence (late) narrows access to the garden. Step 3: The discriminating test reveals the clock manipulation, confirming Wilfred's guilt."
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
        "Observe the clock's stopped time",
        "Draw conclusion about Wilfred's alibi"
      ],
      "test_type": "clock manipulation reveal"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Patricia Corfield",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Confirmed alibi during the party",
        "supporting_clues": [
          "witness statements about Patricia's location"
        ]
      },
      {
        "suspect_name": "Julian Cromer",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Witnesses confirm his presence at the party",
        "supporting_clues": [
          "witness statements from party attendees"
        ]
      },
      {
        "suspect_name": "Laurence Chalcott",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: 10 minutes before the party started",
        "supporting_clues": []
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with evidence of clock manipulation"
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
        "delivery_method": "Direct observation"
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
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_fp_contradiction_step_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_core_elimination_chain",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_3",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_10",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_4",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
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
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_7",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
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
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_culprit_direct_wilfred_wellow",
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
    "name": "Laurence Chalcott",
    "summary": "A retired army officer with a charm that masks a heart full of resentment, Laurence finds himself at a crossroads of social status and emotional turmoil.",
    "publicPersona": "Charming and charismatic, Laurence regales those around him with tales of his military exploits and adventures, often charming the ladies with his dashing demeanor.",
    "privateSecret": "He still harbors a smoldering resentment toward Patricia for leaving him, feeling that their love was a casualty of her ambition and Julian's wealth.",
    "motiveSeed": "Laurence stands to lose his social standing if Patricia ends her engagement with him and marries Julian, a fate he cannot abide.",
    "motiveStrength": "moderate",
    "alibiWindow": "Was seen in the library from eight until midnight, supposedly engrossed in a book.",
    "accessPlausibility": "possible",
    "stakes": "Social status and self-respect hang in the balance; losing Patricia means losing the last vestiges of his youth.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Speaks with a slight drawl, often punctuating his stories with wry observations. He has a tendency to laugh at his own jokes, a habit developed from years of entertaining guests.",
    "internalConflict": "Laurence grapples with the realization that his past love for Patricia may have been more about pride than passion, leaving him to question the very nature of love and loss.",
    "personalStakeInCase": "This crime matters to Laurence as it forces him to confront the unresolved feelings he holds for Patricia and the bitterness of betrayal.",
    "paragraphs": [
      "Laurence Chalcott, a retired army officer, often stood at the center of social gatherings, a dashing figure draped in tales of valor and adventure. His charm was palpable, drawing admirers like moths to a flame. Yet, behind the polished exterior lay a heart simmering with resentment; Patricia Corfield had once been his muse, the object of his affections, and now she flitted in the arms of Julian Cromer, a man he deemed unworthy of her grace.",
      "As he paced the library, where he claimed to have spent the night, Laurence's thoughts spiraled into a maelstrom of jealousy and indignation. The walls seemed to echo with memories of laughter shared, promises whispered, and ultimately, the sting of abandonment. He could hardly bear the thought of Patricia casting him aside for a man whose wealth only amplified his shortcomings. The notion of losing not just her love but also his esteemed social standing gnawed at him relentlessly.",
      "Laurence often masked his emotional turmoil with humor, employing dry wit as a shield against the world. 'Ah, the life of a jilted lover,' he would say with a sardonic chuckle, 'it’s as thrilling as a morning parade of cobwebs.' Yet, in those moments of levity, he knew he was merely deflecting the truth—his heart was heavy with a longing that refused to fade. The prospect of confronting Patricia about her engagement sent shivers down his spine; would it lead to a cathartic closure or further entrench him in despair?",
      "The stakes had never been higher; social status and self-respect intertwined in a precarious dance. If Patricia's engagement to Julian were to proceed, Laurence feared he would become a mere footnote in their story, a relic of a past that offered him neither solace nor satisfaction. And so, as the clock ticked ominously in the library, Laurence resolved to confront his past, hoping to either reclaim what was lost or, at the very least, find the strength to let it go."
    ],
    "order": 1
  },
  {
    "name": "Patricia Corfield",
    "summary": "An elegant socialite caught in a web of deception, Patricia navigates the treacherous waters of love and financial insecurity with poise and desperation.",
    "publicPersona": "Patricia is the epitome of grace, admired for her beauty and social skills. At every gathering, she glides through rooms like a swan, effortlessly charming everyone in her path.",
    "privateSecret": "Behind the façade of poise lies a woman grappling with financial struggles, engaging to Julian not for love, but for the security his family's wealth provides.",
    "motiveSeed": "Patricia could be motivated to silence Laurence, who threatens to expose her financial troubles and ruin her carefully crafted reputation.",
    "motiveStrength": "moderate",
    "alibiWindow": "Claimed to be at a party across town from nine until ten-thirty, a detail she rehearsed to perfection.",
    "accessPlausibility": "possible",
    "stakes": "Her financial security and reputation are at stake, as the collapse of her social standing would mean losing everything she has built.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.6,
    "speechMannerisms": "Speaks in a soft, melodic tone, often lacing her sentences with subtle sarcasm. She enjoys employing clever turns of phrase to mask her true feelings.",
    "internalConflict": "Patricia is torn between her ambition and the guilt of her deception, knowing that her engagement to Julian is built on shaky foundations.",
    "personalStakeInCase": "This crime matters to Patricia as it threatens to unravel the delicate fabric of her life, exposing her vulnerabilities and forcing her to confront the choices she has made.",
    "paragraphs": [
      "Patricia Corfield, the belle of Little Middleton, glided through the social scene like a masterful conductor leading an orchestra. Dressed in the finest silks, she was the embodiment of elegance, captivating her audience with a smile that could both dazzle and deceive. Yet beneath the surface, a tempest brewed; the weight of financial insecurity bore down on her, a secret she guarded with the same ferocity as a dragon over its treasure.",
      "Engaged to Julian Cromer, she wore her ring like a badge of honor, yet the truth was a bitter pill to swallow. She had not chosen him for love, but for the promise of security that came with his family's wealth. The thought of Laurence, with his roguish charm and lingering affections, loomed like a dark cloud over her sunny disposition. His knowledge of her precarious situation was a ticking time bomb, and if he were to expose her, it would shatter her carefully curated image.",
      "Despite her struggles, Patricia wielded her humor like a sharpened dagger, delivering polite savagery with a smile. 'Oh, darling, don’t be ridiculous—like a cat on a hot tin roof, I assure you, I’m perfectly comfortable!' she would quip, masking her insecurities with laughter. Yet, in the quiet moments, when the laughter faded, she was left alone with the reality of her choices, grappling with the guilt of her deception and the loneliness that accompanied it.",
      "As the party across town raged on, Patricia felt the stakes rise with each passing moment. Her reputation, her financial security, and her very identity hung in the balance. The walls she had built to protect herself now felt like a prison. The prospect of confronting Laurence filled her with dread, yet she knew that the time for reckoning was drawing near. She must navigate this labyrinth of lies, or risk losing everything she had worked so hard to achieve."
    ],
    "order": 2
  },
  {
    "name": "Julian Cromer",
    "summary": "A wealthy heir caught between ambition and desire, Julian presents himself as the ideal gentleman but is shackled by secrets that could unravel his world.",
    "publicPersona": "Julian is the quintessential suave gentleman, known for his affluence and charm, often seen as the perfect match for Patricia in the eyes of society.",
    "privateSecret": "Behind the polished exterior lies a tangled affair with Joan, a secret that, if exposed, could destroy his engagement and reputation.",
    "motiveSeed": "Julian is motivated by the fear of losing Patricia to Laurence, who could expose his affair and ruin everything he has built.",
    "motiveStrength": "moderate",
    "alibiWindow": "Was in the dining room with other guests from eight-thirty to ten, a detail that could easily be corroborated.",
    "accessPlausibility": "easy",
    "stakes": "His engagement and public image are at stake, as losing Patricia would mean losing not only love but also his social standing.",
    "humourStyle": "sardonic",
    "humourLevel": 0.5,
    "speechMannerisms": "Speaks with a smooth, confident cadence, often punctuating his statements with a knowing smirk. He tends to use grand gestures when making a point, reflecting his wealthy upbringing.",
    "internalConflict": "Julian battles between his ambition to maintain his status and the guilt of his infidelity, aware that his choices may lead to his downfall.",
    "personalStakeInCase": "This crime matters to Julian because it could expose his affair with Joan, jeopardizing everything he has worked for and forcing him to confront the consequences of his actions.",
    "paragraphs": [
      "Julian Cromer was the embodiment of the affluent gentleman, his every gesture crafted to perfection. With a smile that could charm the most hardened cynic, he navigated the social landscape with ease, his reputation as the ideal match for Patricia Corfield firmly established. Yet beneath the surface of his suave demeanor lay a tumultuous sea of secrets, threatening to capsize his carefully constructed life.",
      "The affair with Joan Plowden was a reckless indulgence, a passionate escape from the suffocating expectations of his engagement. 'Ah, love—such a delightful paradox, isn’t it?' he would often jest, masking the guilt that gnawed at him like a persistent rat. The thought of Laurence, a specter from Patricia's past, loomed large, a constant reminder of what could be lost if his secrets were laid bare. Losing Patricia to Laurence would not just break his heart; it would dismantle the very foundation of his social standing.",
      "Julian's alibi was as solid as the fine china that adorned his dining room, yet he felt the weight of impending doom. Each laugh shared with his guests felt hollow, a mask worn to hide the churning turmoil within. He was determined to protect his image at all costs, but the stakes were rising with every whispered conversation in the corridors of power. 'One must always play the hand one is dealt,' he would quip, yet the truth was that he was bluffing, and the cards were stacked against him.",
      "As the night wore on and the shadows deepened, Julian found himself at a crossroads. The allure of ambition beckoned him, but the price was steep. He must decide whether to cling to his façade of perfection or embrace the authenticity that had eluded him for so long. The echoes of his choices reverberated in the air, and he knew that the time for reckoning was drawing near."
    ],
    "order": 3
  },
  {
    "name": "Wilfred Wellow",
    "summary": "A local gardener with a gruff exterior and a sharp mind, Wilfred stands on the fringes of society, holding secrets that could turn the tide of fortune.",
    "publicPersona": "Often dismissed as grumpy, Wilfred possesses a wisdom that belies his rough demeanor, offering the occasional sage advice to those willing to listen.",
    "privateSecret": "He has been blackmailing Julian for money, knowing about the affair and leveraging it for his own gain.",
    "motiveSeed": "Wilfred could gain financially from Julian's downfall or Patricia's inheritance if he exposes their secrets.",
    "motiveStrength": "moderate",
    "alibiWindow": "Claims to have been working in the garden from eight until nine-thirty, a plausible cover for his activities.",
    "accessPlausibility": "possible",
    "stakes": "His financial stability and respect from the community are at stake, as exposure could lead to his own ruin.",
    "humourStyle": "deadpan",
    "humourLevel": 0.4,
    "speechMannerisms": "Speaks in short, clipped sentences, often punctuated by a sardonic twist. He has a tendency to avoid small talk, preferring direct conversation.",
    "internalConflict": "Wilfred wrestles with the morality of his actions, knowing that his blackmail could ruin lives but feeling justified in his pursuit of financial stability.",
    "personalStakeInCase": "This crime matters deeply to Wilfred, as it could either secure his financial future or lead to his downfall, forcing him to confront the consequences of his choices.",
    "paragraphs": [
      "Wilfred Wellow, the local gardener, had long been the subject of whispered conversations and dismissive glances. Grumpy yet wise, he occupied a peculiar space in Little Middleton, straddling the line between the elite and the everyday. While others mingled and danced, he preferred the company of his plants, finding solace in their silent beauty. But beneath the gruff exterior lay a mind as sharp as the tools he wielded, and secrets that could turn the tide of fortune.",
      "His knowledge of Julian's affair with Joan was a double-edged sword, a weapon he wielded with both caution and intent. 'Life's a garden, you see—sometimes you need to prune the dead weight,' he would remark dryly, his deadpan humor cutting through the air like a knife. The blackmail had been a means to an end, a way to secure his own financial stability, yet with each demand he made, a nagging guilt crept into his conscience. He was aware that his actions could ruin lives, but in his mind, survival trumped morality.",
      "As he toiled in the garden on that fateful evening, the stakes felt higher than ever. He claimed to have been working from eight until nine-thirty, a plausible cover that kept him safe from suspicion. Yet the thought of being exposed gnawed at him, a constant reminder of the precariousness of his situation. The allure of financial gain was tempting, yet the potential fallout loomed larger, a storm threatening to engulf him if he misstepped.",
      "Wilfred's internal conflict raged on, forcing him to confront the very nature of his choices. Was it worth sacrificing his integrity for the sake of a few coins? As he pruned the roses, he pondered the weight of his actions, knowing that the truth of his dealings could lead to his redemption or his demise. The echoes of his decisions reverberated through the garden, a reminder that even the most ordinary lives could be touched by the extraordinary."
    ],
    "order": 4
  },
  {
    "name": "Joan Plowden",
    "summary": "A young artist caught in the throes of passion and conflict, Joan's love for Julian is overshadowed by the complexities of their affair and her longing for authenticity.",
    "publicPersona": "Joan is a free-spirited artist, celebrated for her vibrant paintings and passionate nature, drawing admiration and envy in equal measure.",
    "privateSecret": "She is deeply in love with Julian, yet aware of the barriers posed by his engagement to Patricia, creating a web of longing and heartbreak.",
    "motiveSeed": "Joan could wish to eliminate Patricia, seeing her as a barrier to a future with Julian, a desire fueled by desperation.",
    "motiveStrength": "moderate",
    "alibiWindow": "Was painting in her studio from eight to ten, a solitary act that offered her an escape from reality.",
    "accessPlausibility": "possible",
    "stakes": "Her love and future are at stake, as the potential loss of Julian could shatter her dreams.",
    "humourStyle": "sardonic",
    "humourLevel": 0.5,
    "speechMannerisms": "Expresses herself in an animated manner, often punctuating her speech with vivid imagery and metaphors, reflecting her artistic sensibilities.",
    "internalConflict": "Joan struggles with the reality of her feelings for Julian, torn between her desire for love and the ethical implications of their affair.",
    "personalStakeInCase": "This crime matters to Joan because it could determine her future with Julian, forcing her to confront the depths of her feelings and the sacrifices required for love.",
    "paragraphs": [
      "Joan Plowden, the young artist, moved through life with the grace of a brushstroke, each moment infused with passion and creativity. Her vibrant canvases spoke of a world unbound by convention, yet her heart was ensnared in a tumultuous affair with Julian Cromer, a reality that often clashed with her ideals. The admiration she garnered for her art was a mere façade, a distraction from the complexities of her emotions, which lay tangled like a palette of unblended colors.",
      "In the solitude of her studio, Joan poured her heart onto the canvas, seeking refuge from the storm of her feelings. 'Love is like paint—it can be beautiful, but it can also stain,' she would remark with a sardonic smile, reflecting the duality of her existence. The knowledge of Julian's engagement to Patricia weighed heavily on her, a constant reminder of the barriers that stood between them. Yet, the longing for him was a fire that refused to be extinguished, igniting a fierce desire to claim their love at any cost.",
      "As she painted that fateful evening, Joan felt the stakes rise with every stroke of her brush. To lose Julian would mean losing a piece of herself, a reality she could hardly bear to contemplate. The thought of eliminating Patricia, though fleeting and fueled by desperation, flickered in her mind like a candle in the wind. Would she sacrifice her own integrity for the sake of love? The internal conflict raged on, forcing her to confront the ethical implications of her desires.",
      "Ultimately, Joan's journey was one of self-discovery, a path that led her to realize that true love requires more than passion; it demands honesty and sacrifice. As the colors swirled on her canvas, so too did her thoughts swirl in a tempest of emotion, leaving her to ponder the true meaning of love and the lengths she would go to achieve it. The echoes of her choices reverberated throughout the studio, a reminder that even the most vibrant dreams could be tinged with shadows."
    ],
    "order": 5
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
    "summary": "A sprawling manor house that embodies the tension of class and economic strife, set against the backdrop of a remote countryside.",
    "visualDescription": "Grand stone façade with ivy creeping up the walls; multiple wings branching like a family tree; ornate cornices and leaded glass windows reflecting a dim sky.",
    "atmosphere": "An unsettling blend of opulence and decay, where whispers of the past linger in the air.",
    "paragraphs": [
      "Little Middleton Manor stands as a testament to a bygone era, its grandiosity now shadowed by the weight of economic despair. The ivy-clad stone walls whisper stories of lavish balls and high society, now turned to echoes in the drafty halls. The estate sprawls across the landscape, its wings stretching into the muted hues of the overcast sky, as if seeking to escape the isolation of its surroundings.",
      "Inside, the manor is a labyrinth of secrets and shadows. The air is thick with the scent of aged wood and dust, a reminder of the lives once lived behind closed doors. Each room is adorned with heavy drapes and antique furnishings, but the atmosphere is tinged with an unsettling stillness, punctuated only by the distant sound of rain tapping against the leaded windows. The gardens, once vibrant, are now overgrown and wild, providing a sense of concealment that adds to the tension.",
      "The manor's isolation is palpable; narrow, winding roads lead to its entrance, limiting the movement of the few petrol-driven automobiles that dare to approach. The closest village, Little Middleton, lies several miles away, making any hope of outside support a distant dream. The inhabitants of the manor, trapped by both their own social hierarchies and the weight of their economic circumstances, move like phantoms through the halls, each with their own secrets to keep.",
      "As the story unfolds, the manor becomes a character in its own right, harboring hidden doors and locked rooms that guard the truths of its past. With each creak of the floorboards and flicker of candlelight, the tension mounts, revealing that within the opulent walls of Little Middleton Manor lies a web of intrigue, betrayal, and the echoes of time."
    ]
  },
  "atmosphere": {
    "era": "1930s",
    "weather": "Overcast with intermittent rain, typical of a British countryside in autumn",
    "timeFlow": "Days of mounting tension as the mystery unfolds",
    "mood": "Tense and suspenseful, heightened by the economic pressures of the era and underlying class tensions",
    "eraMarkers": [
      "Petrol-driven automobiles on winding country lanes",
      "Typewriters for correspondence and communication",
      "Early home telephones with limited range"
    ],
    "sensoryPalette": {
      "dominant": "A heavy, damp atmosphere filled with secrets",
      "secondary": [
        "The musty scent of old leather and wood",
        "Distant sounds of rain and thunder"
      ]
    },
    "paragraphs": [
      "The air is thick with the scent of damp earth and decaying leaves, a reminder of the relentless British autumn. Shadows stretch long across the cobbled paths, and the distant rumble of thunder echoes through the valley. As the sun struggles to break through the clouds, the manor stands resolute, cloaked in a shroud of mystery and foreboding.",
      "Inside, the flickering candlelight casts dancing shadows on the walls, illuminating glimpses of a lavish past now overshadowed by uncertainty. The quiet is punctuated by the soft creak of the floorboards and the faint rustle of fabric as the inhabitants move through the manor, each step echoing the weight of their secrets. The atmosphere hums with an unspoken tension, hinting at the unraveling of a mystery that lies just beneath the surface."
    ]
  },
  "keyLocations": [
    {
      "id": "drawing_room",
      "name": "Drawing Room",
      "type": "interior",
      "purpose": "Social gathering space; potential clue discovery",
      "visualDetails": "A grand room with high ceilings, adorned with intricate plasterwork; velvet drapes framing tall windows; a massive fireplace at one end, flanked by ornate armchairs.",
      "sensoryDetails": {
        "sights": [
          "gilded mirrors reflecting candlelight",
          "richly patterned rugs on polished wood floors",
          "dark oak furniture with intricate carvings",
          "vases of wilting flowers on the mantel"
        ],
        "sounds": [
          "crackling firewood",
          "soft laughter echoing in the corners",
          "the ticking of an ornate grandfather clock",
          "the rustle of fine fabrics"
        ],
        "smells": [
          "smoky wood and burnt embers",
          "dusty leather and old books",
          "faint scent of lavender potpourri",
          "musty air from the closed shutters"
        ],
        "tactile": [
          "plush velvet upholstery",
          "cool marble mantelpiece",
          "rough texture of the woven rugs",
          "chill from the open window"
        ]
      },
      "accessControl": "Accessible to guests during social hours; staff may enter for cleaning, but must knock first.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops on window panes",
            "grey light filtering through clouds",
            "dampened colors of the furnishings"
          ],
          "sounds": [
            "steady rain pattering against glass",
            "soft murmurs of conversation",
            "the distant rumble of thunder"
          ],
          "smells": [
            "fresh rain on earth",
            "mildew from damp fabrics",
            "scent of polished wood"
          ],
          "mood": "oppressive and heavy"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat light dulling the colors",
            "shadows creeping across the room",
            "the flicker of candles in the dimness"
          ],
          "sounds": [
            "silence punctuated by distant clock chimes",
            "the creak of settling wood",
            "the soft rustle of pages turning"
          ],
          "smells": [
            "old paper and ink",
            "dust motes dancing in the air",
            "the lingering scent of tea"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "golden light from the fireplace",
            "the glow of polished silverware"
          ],
          "sounds": [
            "the crackle of burning logs",
            "laughter and chatter growing louder",
            "the gentle clinking of glasses"
          ],
          "smells": [
            "warmth of roasted meats",
            "scent of burning wax",
            "aroma of spiced wine"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The drawing room, with its high ceilings and intricate plasterwork, serves as the heart of social gatherings at Little Middleton Manor. The flickering candlelight casts a warm glow over the richly patterned rugs and dark oak furniture, creating an inviting yet opulent atmosphere. However, beneath the surface charm lies an undercurrent of tension, as guests exchange furtive glances and whispers, each aware of the secrets that lurk in the shadows.",
        "As the rain drums against the windows, the drawing room becomes a sanctuary from the storm outside, yet the air inside is thick with unspoken words. The crackling fire provides warmth, but the chill of uncertainty hangs in the air. It is here that the first clues may emerge, hidden among the velvet drapes and gilded mirrors, waiting to be uncovered by those brave enough to seek the truth."
      ]
    },
    {
      "id": "library",
      "name": "Library",
      "type": "interior",
      "purpose": "Restricted knowledge space; potential clue discovery",
      "visualDetails": "A vast room lined with dark wood bookshelves, filled with dusty tomes; a large oak table in the center, scattered with papers and a typewriter; a tall window with a view of the gardens.",
      "sensoryDetails": {
        "sights": [
          "dust motes floating in sunlight",
          "leather-bound books with gilded spines",
          "the imposing figure of a grandfather clock",
          "a globe perched on a side table"
        ],
        "sounds": [
          "the soft rustle of turning pages",
          "the ticking of the clock",
          "the muted sound of rain against the window",
          "distant echoes of footsteps outside"
        ],
        "smells": [
          "musty paper and ink",
          "scent of polished wood",
          "tinge of damp from the rain",
          "faint aroma of old leather"
        ],
        "tactile": [
          "rough texture of old book spines",
          "smooth surface of a polished table",
          "coolness of the window glass",
          "the weight of a heavy tome in hand"
        ]
      },
      "accessControl": "Access limited to family and select guests; staff must request permission to enter.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "darkened corners of the library",
            "raindrops running down the glass",
            "the glow of a lamp illuminating a book"
          ],
          "sounds": [
            "steady rain tapping on the roof",
            "the occasional crack of thunder",
            "the rustling of papers on the table"
          ],
          "smells": [
            "damp wood and leather",
            "scent of wet earth outside",
            "the mustiness of old pages"
          ],
          "mood": "claustrophobic and tense"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light filtering through the window",
            "shadows creeping along the shelves",
            "the glint of a hidden object on the table"
          ],
          "sounds": [
            "the ticking of the clock echoing",
            "the soft thud of a book being closed",
            "distant voices from elsewhere in the house"
          ],
          "smells": [
            "dust and old paper",
            "the faint tang of metal from the typewriter",
            "the scent of dampness in the air"
          ],
          "mood": "heavy anticipation"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "golden light from a nearby lamp",
            "the glow of polished wood reflecting candlelight",
            "the silhouette of a figure in the doorway"
          ],
          "sounds": [
            "the soft scratching of a typewriter",
            "the rustle of pages turning",
            "the distant sound of laughter from the drawing room"
          ],
          "smells": [
            "the rich scent of leather-bound books",
            "the sweetness of candle wax",
            "the faint aroma of brewing tea"
          ],
          "mood": "suspenseful and charged"
        }
      ],
      "paragraphs": [
        "The library of Little Middleton Manor is a sanctuary of knowledge and secrets, its dark wood shelves towering over the central oak table cluttered with papers and a vintage typewriter. Dusty tomes line the walls, their spines gilded and faded, holding the weight of history within their pages. The air is thick with the smell of aged paper and ink, a sensory reminder of the stories waiting to be uncovered.",
        "In the quiet of the library, the sound of rain outside becomes a gentle backdrop, mixing with the soft rustle of pages turning. Shadows loom in the corners, creating an atmosphere that is both inviting and foreboding. It is here that the characters may find the clues that could unravel the mystery, hidden among the volumes that have stood witness to the manor's secrets."
      ]
    },
    {
      "id": "servants_hall",
      "name": "Servants' Hall",
      "type": "interior",
      "purpose": "Staff gathering space; potential for overheard conversations",
      "visualDetails": "A modest room with plain wooden furniture, a large table surrounded by mismatched chairs; a small fireplace provides minimal warmth; walls adorned with a few faded portraits.",
      "sensoryDetails": {
        "sights": [
          "faded wallpaper peeling at the edges",
          "a clock ticking on the wall",
          "scattered newspapers on the table"
        ],
        "sounds": [
          "clatter of dishes being washed",
          "muffled conversations from the kitchen",
          "the crackle of the fire",
          "footsteps echoing on wooden floors"
        ],
        "smells": [
          "the aroma of cooking meals",
          "scent of wood smoke",
          "the mustiness of old furniture",
          "the tang of cleaning supplies"
        ],
        "tactile": [
          "rough wood of the table surface",
          "cold iron of the fireplace grate",
          "smoothness of worn chairs",
          "the chill of the room air"
        ]
      },
      "accessControl": "Restricted to household staff; guests may not enter without permission.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "dim light filtering through small windows",
            "water pooling outside on the cobblestones",
            "steam rising from a kettle"
          ],
          "sounds": [
            "rain drumming on the roof",
            "the clatter of pots in the kitchen",
            "soft laughter among the staff"
          ],
          "smells": [
            "the scent of fresh bread",
            "the tang of wet earth",
            "the warmth of brewing tea"
          ],
          "mood": "busy and bustling"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows creeping across the floor",
            "a flickering candle on the table",
            "the dull glow of the fireplace"
          ],
          "sounds": [
            "the soft murmur of conversations",
            "the crackle of the fire",
            "the ticking of the wall clock"
          ],
          "smells": [
            "the scent of old wood",
            "the tang of cleaning supplies",
            "the aroma of stewing meat"
          ],
          "mood": "tense and watchful"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "golden light from the kitchen spilling in",
            "the glow of the fireplace casting shadows",
            "the silhouettes of staff moving about"
          ],
          "sounds": [
            "the distant sound of laughter from the drawing room",
            "soft whispers among the staff"
          ],
          "smells": [
            "the rich aroma of a hearty stew",
            "the scent of fresh herbs",
            "the warmth of baked goods"
          ],
          "mood": "anxious and expectant"
        }
      ],
      "paragraphs": [
        "The Servants' Hall serves as the heart of the household staff, a modest room filled with simple wooden furniture and the lingering scent of cooking meals. Here, the staff gather to share stories and whispers of the happenings in the manor, their conversations often punctuated by laughter and the clatter of dishes. Despite its humble appearance, the hall is a hub of activity and secrets, where the social hierarchies of the household are laid bare.",
        "As the rain patters against the roof and the air thickens with the aroma of hearty meals, the atmosphere shifts, filled with an unspoken tension. The staff, while bound by their duties, are acutely aware of the undercurrents of drama that flow through the manor's upper echelons. In this space, where they can speak freely, the truth may be found in the most unexpected of places."
      ]
    },
    {
      "id": "gardens",
      "name": "Gardens",
      "type": "exterior",
      "purpose": "Outdoor space for recreation; potential hiding spots",
      "visualDetails": "Expansive grounds with overgrown hedges; a stone path winding through wildflowers; a gazebo partially hidden by climbing vines.",
      "sensoryDetails": {
        "sights": [
          "wildflowers swaying in the breeze",
          "overgrown hedges and untamed shrubs",
          "the dilapidated gazebo peeking through the foliage",
          "dark clouds looming overhead"
        ],
        "sounds": [
          "rustling leaves in the wind",
          "the distant sound of rain beginning",
          "birds chirping in the trees",
          "the creak of the gazebo's wooden frame"
        ],
        "smells": [
          "damp earth and fresh rain",
          "scent of rotting leaves",
          "the faint sweetness of overripe fruit",
          "the aroma of wet grass"
        ],
        "tactile": [
          "roughness of the stone path",
          "softness of flower petals",
          "the chill of the evening air",
          "the dampness of the grass underfoot"
        ]
      },
      "accessControl": "Open to guests during daylight; restricted after dark for safety reasons.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops clinging to flower petals",
            "grey clouds hanging low",
            "the shimmering of wet grass"
          ],
          "sounds": [
            "steady rain pattering on leaves",
            "the distant rumble of thunder",
            "the soft drip of water from branches"
          ],
          "smells": [
            "fresh rain on earth",
            "the scent of damp foliage",
            "the mustiness of wet soil"
          ],
          "mood": "melancholic and introspective"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "the dull colors of wilting flowers",
            "the wind bending the tall grasses"
          ],
          "sounds": [
            "the rustle of leaves in the breeze",
            "the soft thud of branches swaying",
            "the distant sound of thunder"
          ],
          "smells": [
            "the earthy scent of decaying plants",
            "the tang of wet stone",
            "the aroma of damp earth"
          ],
          "mood": "foreboding and tense"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "the last rays of sun illuminating the flowers",
            "long shadows stretching across the lawn",
            "fireflies beginning to flicker"
          ],
          "sounds": [
            "the chirping of crickets",
            "the rustling of grass",
            "the distant sounds of laughter from the house"
          ],
          "smells": [
            "the sweet fragrance of evening blooms",
            "the scent of fresh-cut grass",
            "the coolness of the night air"
          ],
          "mood": "serene yet anxious"
        }
      ],
      "paragraphs": [
        "The gardens of Little Middleton Manor, while once a display of cultivated beauty, have fallen into a state of wild neglect. Overgrown hedges and tangled vines weave a tapestry of secrecy, creating hiding spots for those who wish to escape the watchful eyes of the manor's inhabitants. The stone path meanders through wildflowers, leading to a gazebo partially hidden by climbing plants, its once-grand architecture now draped in nature's embrace.",
        "As the rain begins to fall, the gardens take on a melancholic atmosphere, the damp earth releasing its rich scent into the air. The rustling leaves whisper secrets, while the distant rumble of thunder hints at the storm brewing within the manor itself. In this space, where light and shadow play among the foliage, the tension of the story unfolds, revealing hidden truths waiting to be discovered amidst the wild beauty."
      ]
    }
  ],
  "note": "",
  "cost": 0.0025723268999999997,
  "durationMs": 36049
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1938,
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
    "daylight": "Short days with twilight descending by four o'clock, leaving the countryside cloaked in a heavy gloom.",
    "time_of_day_of_crime": "Late evening — between eight and ten at night, as shadows deepen and rain patters against the windows.",
    "holidays": [
      "Guy Fawkes Night (November 5)"
    ],
    "seasonalActivities": [
      "Preparing for Christmas shopping in local towns",
      "Hunting parties in the countryside",
      "Gathering around the fireplace for storytelling"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "tailored wool suits",
        "double-breasted blazers",
        "cravats or patterned ties"
      ],
      "casual": [
        "tweed jackets",
        "corduroy trousers",
        "wool sweaters"
      ],
      "accessories": [
        "flat caps",
        "leather gloves",
        "wristwatches"
      ]
    },
    "womensWear": {
      "formal": [
        "tea-length dresses with cinched waists",
        "velvet evening gowns",
        "feathered hats"
      ],
      "casual": [
        "tweed skirts",
        "knitted cardigans",
        "blouses with puffed sleeves"
      ],
      "accessories": [
        "pearls or beaded necklaces",
        "gloves",
        "stylish clutches"
      ]
    },
    "trendsOfTheMoment": [
      "Art Deco influences in design",
      "Emphasis on tailored silhouettes",
      "Increased popularity of knitted garments"
    ],
    "socialExpectations": [
      "Adherence to class distinctions in social settings",
      "Expectations for women to maintain domestic roles",
      "Men expected to uphold traditional gender roles in public life"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "Continued tensions in Europe as Nazi Germany's aggression escalates",
      "The Munich Agreement fallout affecting British politics",
      "Increasing public concern over the effects of the Great Depression"
    ],
    "politicalClimate": "A climate of unease as Britain grapples with the rise of fascism in Europe, with public opinion divided on how to respond.",
    "economicConditions": "The Great Depression lingers, with high unemployment rates affecting social stability and increasing class tensions.",
    "socialIssues": [
      "Rising unemployment leading to increased poverty",
      "Discussions around the rights of women in the workforce",
      "Debates over immigration and asylum for refugees from Europe"
    ],
    "internationalNews": [
      "The Anschluss of Austria by Nazi Germany",
      "The Sudetenland crisis and its implications for European security"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "The Andrews Sisters",
        "Bing Crosby",
        "Duke Ellington"
      ],
      "films": [
        "The Adventures of Robin Hood",
        "Bringing Up Baby",
        "The Lady Vanishes"
      ],
      "theater": [
        "The Royal Family",
        "The Front Page",
        "Blithe Spirit"
      ],
      "radio": [
        "The BBC Home Service",
        "Variety Shows featuring popular music",
        "News broadcasts on European affairs"
      ]
    },
    "literature": {
      "recentPublications": [
        "The Maltese Falcon by Dashiell Hammett",
        "Brave New World by Aldous Huxley",
        "The Grapes of Wrath by John Steinbeck"
      ],
      "popularGenres": [
        "mystery and detective fiction",
        "social commentary novels",
        "sci-fi and dystopian literature"
      ]
    },
    "technology": {
      "recentInventions": [
        "The first jet engine prototypes",
        "Early models of television sets",
        "Advancements in radio technology"
      ],
      "commonDevices": [
        "Typewriters",
        "Home telephones",
        "Petrol-driven automobiles"
      ],
      "emergingTrends": [
        "Increased use of radio broadcasting for entertainment and news",
        "Growth of consumer goods manufacturing",
        "Early adoption of electric household appliances"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Cinema ticket: one shilling",
        "Bottle of milk: five pence"
      ],
      "commonActivities": [
        "Social gatherings for tea",
        "Attending local fairs and markets",
        "Participating in charitable events"
      ],
      "socialRituals": [
        "Hosting dinner parties with friends and family",
        "Engaging in seasonal traditions like bonfire night",
        "Writing and receiving letters as a primary form of communication"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "A rigid class structure remains, impacting social interactions",
      "Wealthier classes often look down on the working class"
    ],
    "gender": [
      "Women are increasingly entering the workforce but face societal pushback",
      "Traditional gender roles are still largely upheld, with women expected to manage the home"
    ],
    "race": [
      "Racial tensions are heightened in urban areas, alongside growing awareness of anti-racism movements",
      "Immigration issues are contentious, particularly concerning refugees from fascist regimes"
    ],
    "generalNorms": [
      "Politeness and decorum are highly valued in public interactions",
      "Social status is often signaled through attire and manners",
      "A sense of impending change looms over societal norms"
    ]
  },
  "atmosphericDetails": [
    "The scent of wet earth and fallen leaves fills the air as rain drizzles steadily, creating a somber backdrop for the estate.",
    "The flickering light of candles casts long shadows on the manor's walls, creating an atmosphere thick with anticipation and unease.",
    "Chilled air seeps through the cracks of the ancient manor, carrying whispers of tension as families gather for their evening meals, the clatter of cutlery punctuated by hushed conversations."
  ],
  "paragraphs": [
    "In November 1938, the British countryside is enveloped in a melancholic chill, with overcast skies threatening rain at any moment. The days are short, twilight settling in by four o'clock, leaving the sprawling grounds of the country house estate cloaked in shadows. Within the manor, the scent of wet leaves and the crackling fire provides a contrast to the cold and damp outside. As the wind howls through the trees, the tension among the residents mirrors the unsettled mood of the nation, grappling with economic strife and the specter of fascism looming over Europe.",
    "Fashion at this time reflects a blend of practicality and elegance, as both men and women navigate the expectations of their social classes. Men don tailored wool suits with double-breasted blazers, accessorized with flat caps and leather gloves, while women grace the rooms in tea-length dresses cinched at the waist, paired with feathered hats. The emphasis on tailored silhouettes and warm, knitted garments highlights the need for both style and comfort during the chilly autumn months, as the manor's residents prepare for the festive season ahead amidst rising social tensions.",
    "Daily life is characterized by a mixture of routine and social obligation, with families gathering for tea or hosting dinner parties to maintain connections within their social circles. As the Great Depression persists, discussions around employment and class struggles seep into even the most genteel conversations. The cost of living impacts everyone's choices, from the bread loaf at four pence to the cinema ticket priced at one shilling. Amidst the backdrop of political uncertainty and class distinction, the residents of the manor find themselves caught in a web of social expectations, as they navigate their lives under the watchful eyes of history."
  ],
  "note": "",
  "cost": 0.00108438165,
  "durationMs": 13381
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "An inheritance dispute amidst the Great Depression forces the privileged heirs and their staff into the isolated manor, where class tensions and economic strain heighten the stakes of their interactions.",
  "era": {
    "decade": "1930s",
    "socialStructure": "Class distinctions are pronounced, with the wealthy heirs grappling with economic pressures while their staff navigate strict hierarchies and limited opportunities."
  },
  "setting": {
    "location": "A sprawling manor house in the British countryside",
    "institution": "Country house estate",
    "weather": "Overcast with intermittent rain"
  },
  "castAnchors": [
    "Laurence Chalcott",
    "Patricia Corfield",
    "Julian Cromer",
    "Wilfred Wellow",
    "Joan Plowden"
  ],
  "theme": "A classic murder mystery"
}

### LOCKED_FACTS
[
  {
    "id": "clock_reading",
    "value": "ten minutes past eleven",
    "description": "The exact time shown on the stopped clock face"
  },
  {
    "id": "wound_back_amount",
    "value": "forty minutes",
    "description": "The exact amount the clock was wound back"
  }
]

### CLUE_DISTRIBUTION
{
  "clues": [
    {
      "id": "clue_mechanism_visibility_core",
      "category": "temporal",
      "description": "A clock was wound back to create a false timeline of events, leading witnesses to believe Laurence was alive for longer than he actually was...",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "This reveals the mechanism of time manipulation.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_contradiction_chain",
      "category": "temporal",
      "description": "Witnesses claim they saw Laurence alive at eleven o'clock.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "This contradicts the time indicated by the stopped clock.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_elimination_chain",
      "category": "testimonial",
      "description": "Eliminates Patricia Corfield because she was seen leaving the party at ten-thirty.",
      "sourceInCML": "CASE.cast[1].alibi_window",
      "pointsTo": "This confirms she could not have been involved in the murder.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_1",
      "category": "temporal",
      "description": "The clock in the study shows it stopped at ten minutes past eleven.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "This indicates the time of death may not align with when witnesses last saw Laurence.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_2",
      "category": "temporal",
      "description": "This contradicts the clock's stopped time, indicating manipulation.",
      "sourceInCML": "CASE.inference_path.steps[1].correction",
      "pointsTo": "This shows evidence of tampering with the timeline.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_3",
      "category": "physical",
      "description": "Footprints in the garden lead to the back entrance.",
      "sourceInCML": "CASE.inference_path.steps[2].observation",
      "pointsTo": "This suggests someone used the entrance to leave after the murder.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_4",
      "category": "temporal",
      "description": "A controlled comparison of witness statements and the clock's stopped time reveals the manipulation.",
      "sourceInCML": "CASE.inference_path.steps[2].required_evidence[0]",
      "pointsTo": "This highlights the discrepancies in the timeline.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_5",
      "category": "behavioral",
      "description": "Wilfred Wellow was seen checking his watch multiple times during the party.",
      "sourceInCML": "CASE.cast[3].evidence_sensitivity[0]",
      "pointsTo": "This raises suspicion about his involvement in the timing of events.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_6",
      "category": "testimonial",
      "description": "Eliminates Julian Cromer because he has a verified alibi from the party host.",
      "sourceInCML": "CASE.cast[2].alibi_window",
      "pointsTo": "This confirms he could not have committed the murder.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_7",
      "category": "temporal",
      "description": "The party began at eleven o'clock, shortly after the clock stopped.",
      "sourceInCML": "CASE.constraint_space.time.anchors[0]",
      "pointsTo": "This creates a tight timeline around the murder.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_8",
      "category": "temporal",
      "description": "The clock shows stopped time.",
      "sourceInCML": "CASE.constraint_space.time.anchors[1]",
      "pointsTo": "This is critical for understanding the timeline of events.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_9",
      "category": "physical",
      "description": "Fingerprints on the clock suggest tampering.",
      "sourceInCML": "CASE.constraint_space.physical.traces[0]",
      "pointsTo": "This indicates someone may have altered the time.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_10",
      "category": "spatial",
      "description": "The back entrance was found slightly ajar.",
      "sourceInCML": "CASE.constraint_space.access.objects[1]",
      "pointsTo": "This indicates a possible escape route for the murderer.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_culprit_direct_wilfred_wellow",
      "category": "temporal",
      "description": "Direct evidence ties Wilfred Wellow to the mechanism access point before the discriminating test.",
      "sourceInCML": "CASE.cast[3].access_plausibility",
      "pointsTo": "This direct evidence shows Wilfred Wellow had means and opportunity, narrowing the solution uniquely toward the culprit.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_late_optional_slot_1",
      "category": "temporal",
      "description": "Clock stopped at ten minutes past eleven remains a late texture detail in the case background.",
      "sourceInCML": "CASE.constraint_space.time.anchors[0]",
      "pointsTo": "Adds late texture without changing the essential deduction chain.",
      "placement": "late",
      "criticality": "optional",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_fp_contradiction_step_1",
      "category": "temporal",
      "description": "The clock in the study shows it stopped at ten minutes past eleven.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "This indicates the time of death may not align with when witnesses last saw Laurence.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_fp_contradiction_step_3",
      "category": "temporal",
      "description": "Footprints in the garden lead to the back entrance.",
      "sourceInCML": "CASE.inference_path.steps[2].correction",
      "pointsTo": "This suggests someone used the entrance to leave after the murder.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "contradiction"
    }
  ],
  "redHerrings": [
    {
      "id": "rh_1",
      "description": "chalcott reported seeing alive laughing and mingling with guests just before the party started.",
      "supportsAssumption": "Laurence Chalcott was alive until the party began.",
      "misdirection": "This misleads by suggesting alive was in good spirits and alive longer than he actually was."
    },
    {
      "id": "rh_2",
      "description": "A guest claimed to have seen until at the bar just before eleven o'clock.",
      "supportsAssumption": "Laurence Chalcott was alive until the party began.",
      "misdirection": "This creates confusion about the timeline and implies he was alive when the clock party."
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
      "clue_2",
      "clue_fp_contradiction_step_1"
    ],
    "mid": [
      "clue_core_elimination_chain",
      "clue_3",
      "clue_4",
      "clue_5",
      "clue_6",
      "clue_7",
      "clue_8",
      "clue_9",
      "clue_10",
      "clue_culprit_direct_wilfred_wellow",
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
  "latencyMs": 16741,
  "cost": 0.0014841651
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

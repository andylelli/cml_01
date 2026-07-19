# Actual Prompt Record

- Run ID: `mystery-1784464663892`
- Project ID: ``
- Timestamp: `2026-07-19T12:41:02.593Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `d3ee0d760761eb2a`

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
    "title": "The Masquerade of Authority",
    "author": "A. I. Writer",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1940s",
      "realism_constraints": []
    },
    "setting": {
      "location": "Seaside Hotel",
      "place": "Brighton",
      "country": "England",
      "institution": "Seaside hotel"
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
      "role_archetype": "Detective",
      "relationships": [],
      "public_persona": "A sharp and observant detective known for her analytical skills.",
      "private_secret": "Haunted by a past case that went unsolved.",
      "motive_seed": "Desire for justice.",
      "motive_strength": "strong",
      "alibi_window": "N/A",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Her reputation as a capable investigator.",
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
      "public_persona": "A respected physician known for her philanthropic work.",
      "private_secret": "Hiding a scandalous affair.",
      "motive_seed": "N/A",
      "motive_strength": "N/A",
      "alibi_window": "N/A",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Her professional reputation.",
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
      "public_persona": "A retired naval officer, charming and authoritative.",
      "private_secret": "Involved in illicit dealings.",
      "motive_seed": "Fear of exposure.",
      "motive_strength": "moderate",
      "alibi_window": "9:00 PM to 10:00 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Lounge",
        "Library"
      ],
      "behavioral_tells": [],
      "stakes": "Maintaining his honor.",
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
      "public_persona": "An ambitious journalist seeking sensational stories.",
      "private_secret": "Planned to unveil the victim's secret.",
      "motive_seed": "Career advancement.",
      "motive_strength": "high",
      "alibi_window": "9:15 PM to 10:15 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Lounge",
        "Guest Rooms"
      ],
      "behavioral_tells": [],
      "stakes": "Her career and reputation.",
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
      "public_persona": "A naive but observant waitress.",
      "private_secret": "Knew more than she let on.",
      "motive_seed": "Jealousy over the victim's attention.",
      "motive_strength": "weak",
      "alibi_window": "9:00 PM to 10:00 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Dining Room",
        "Lounge"
      ],
      "behavioral_tells": [],
      "stakes": "Maintaining her job.",
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
      "public_persona": "A wealthy businessman with a keen interest in local politics.",
      "private_secret": "Involved in a shady business deal with the victim.",
      "motive_seed": "Fear of losing a lucrative investment.",
      "motive_strength": "high",
      "alibi_window": "9:30 PM to 10:30 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Lounge",
        "Office"
      ],
      "behavioral_tells": [],
      "stakes": "Financial security.",
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
      "summary": "At a seaside hotel, a respected physician is found strangled in her room. As tensions rise among the diverse group of guests, a detective must navigate through layers of deception and impersonation to uncover the truth behind the authority that masked the real murderer."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "The murderer used forged documents to impersonate authority figures, allowing them to manipulate the victim and others without raising suspicion.",
      "delivery_path": [
        {
          "step": "The murderer creates a fake identity using forged documents."
        },
        {
          "step": "The murderer uses this identity to gain access to the victim."
        },
        {
          "step": "The impersonation leads to a false sense of security for the victim."
        }
      ]
    },
    "outcome": {
      "result": "The murderer successfully executes the crime without being detected until the investigation."
    }
  },
  "false_assumption": {
    "statement": "The murderer was a legitimate authority figure and acted with the victim's consent.",
    "type": "authority",
    "why_it_seems_reasonable": "Witnesses recall seeing the murderer in a uniform and carrying official documents.",
    "what_it_hides": "The murderer was impersonating an authority figure to manipulate the situation."
  },
  "false_solution": {
    "accused_suspect": "Captain Ivor Hale",
    "supporting_points": [
      "Witnesses saw Captain Hale arguing with Dr. Mallory Finch earlier in the evening.",
      "He had a motive related to a past grievance with the victim."
    ],
    "the_one_flaw": "The timeline does not match; Hale was seen in the lounge at the time of the murder.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "A loud argument was heard between the victim and Captain Hale just before the murder.",
      "points_at_suspect": "Captain Ivor Hale",
      "innocent_explanation": "The argument was about a business deal that had nothing to do with the murder.",
      "resolved_in_chapter": 7
    },
    {
      "id": "red_herring_2",
      "description": "Beatrice Quill was seen entering the victim's room shortly before the murder.",
      "points_at_suspect": "Beatrice Quill",
      "innocent_explanation": "She was delivering a message about a charity event, not related to the murder.",
      "resolved_in_chapter": 7
    }
  ],
  "closed_circle": {
    "suspects": [
      "Eleanor Voss",
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
        "9:15 PM",
        "10:00 PM"
      ],
      "windows": [
        "9:00 PM to 10:30 PM"
      ],
      "contradictions": [
        "Witnesses claim to have seen the murderer at the time of the murder while others confirm that the murderer was elsewhere."
      ]
    },
    "access": {
      "actors": [
        "Eleanor Voss",
        "Captain Ivor Hale",
        "Beatrice Quill",
        "Sylvia Trent",
        "Hugo Vane"
      ],
      "objects": [
        "Documents",
        "Keys to the victim's room"
      ],
      "permissions": [
        "The murderer had access to impersonate authority figures."
      ]
    },
    "physical": {
      "laws": [
        "Manipulation of documents can create false authority."
      ],
      "traces": [
        "Fingerprints on forged documents."
      ]
    },
    "social": {
      "trust_channels": [
        "Witnesses trusted the authority of the impersonator."
      ],
      "authority_sources": [
        "Official-looking documents."
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "Witnesses recall seeing an official-looking figure enter the victim's room just before the murder.",
        "correction": "The figure was likely an impersonator using forged documents to gain access.",
        "effect": "Narrows suspect pool to those who had the means to create such documents.",
        "required_evidence": [
          "Witness statements about the official-looking figure.",
          "Details about the forged documents found in the room."
        ],
        "reader_observable": true
      },
      {
        "observation": "The forensic analysis shows fingerprints on the forged documents.",
        "correction": "The fingerprints do not match any known authority figures.",
        "effect": "Eliminates the possibility that a legitimate authority figure was involved.",
        "required_evidence": [
          "Forensic report on fingerprints.",
          "Access records to the victim's room."
        ],
        "reader_observable": true
      },
      {
        "observation": "Eleanor finds discrepancies in the signatures of the authority documents.",
        "correction": "The discrepancies indicate forgery, suggesting the murderer was impersonating someone.",
        "effect": "Narrows suspicion to individuals with access to the victim and knowledge of the documents.",
        "required_evidence": [
          "Comparison of signatures from the documents.",
          "Eyewitness accounts of who had access to the documents."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "A staged confrontation using the forged documents to see how the suspects react.",
    "knowledge_revealed": "The revealed facts are suspect, discrepanci, and witness.",
    "pass_condition": "The suspect cannot provide a plausible explanation for their access to the documents.",
    "evidence_clues": [
      "clue_core_contradiction_chain",
      "clue_3",
      "clue_5"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: Witness statements about the official figure reveal access to the victim. Step 2: Fingerprint analysis eliminates legitimate authority figures. Step 3: Signature discrepancies narrow suspicion to those with motive."
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
        "Observe the suspect's reaction or result",
        "Draw conclusion about guilt"
      ],
      "test_type": "trap"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Her reasons for entering the room corroborate with the timeline.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Her alibi is supported by multiple witnesses.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Hugo Vane",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Financial records show he was occupied at the time.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: N/A",
        "supporting_clues": []
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with evidence leading to the exposure of the impersonator."
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
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_12",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_5",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness statement"
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
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_8",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
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
        "clue_id": "clue_early_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_early_2",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_mid_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness statements"
      },
      {
        "clue_id": "clue_mid_2",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Forensic report"
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "A sharp-witted journalist on a quest for truth, Eleanor Voss finds herself entangled in a web of secrets and past indiscretions as she investigates a murder that could make or break her career.",
    "publicPersona": "Eleanor is known for her incisive columns that dissect local society with a keen eye and a sharper pen, often attending events to gather the latest gossip and insights.",
    "privateSecret": "Years ago, Eleanor had a fleeting affair with the victim's spouse, a fact she has buried deep, fearing the repercussions should it come to light.",
    "motiveSeed": "Determined to uncover the truth behind the murder, Eleanor sees this as an opportunity to solidify her career and prove her worth in a male-dominated field.",
    "motiveStrength": "compelling",
    "alibiWindow": "She arrived at the hotel just before dinner and was seen mingling in the lobby until the murder occurred, providing her a clear alibi.",
    "accessPlausibility": "easy",
    "stakes": "Eleanor's career hinges on her ability to demonstrate her investigative prowess, especially in a society that is beginning to change.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with a quick cadence, often punctuating her sentences with sharp observations and wry comments. She has a tendency to use rhetorical questions to engage her audience.",
    "signatureTic": "Well, isn't that just the way of it?",
    "internalConflict": "Eleanor grapples with her guilt over the past affair, fearing that her personal history may cloud her judgment and affect her ability to uncover the truth.",
    "personalStakeInCase": "This murder matters to Eleanor not just for her career but also because it forces her to confront her own past and the choices she has made.",
    "paragraphs": [
      "Eleanor Voss stood at the threshold of the hotel lobby, her keen eyes scanning the room for familiar faces. The air was thick with tension, a palpable sense of something sinister lurking beneath the surface of polite conversation. As a journalist, she thrived on such atmospheres, always ready to dig deeper, but this time was different. The stakes were personal. The victim was someone whose life intertwined with her past, a past she had long buried but could no longer escape.",
      "With a quick glance at her watch, she noted the time. Dinner was about to start, and so was the performance of a lifetime—the investigation into a murder that could either make her career or shatter it. Eleanor was determined. Her articles had already hinted at the darker undercurrents of the community, but this was a chance to expose the truth in a way that would solidify her reputation. A compelling story lay before her, but it came with risks she could not ignore.",
      "As she mingled with the guests, Eleanor's mind raced. She had to navigate the murky waters of trust and betrayal. Whispers of secrets floated around her like the scent of the sea breeze—familiar yet foreign. Each person she encountered could either be a potential ally or a hidden adversary. Yet, the ghost of her past loomed larger than any of these guests. The affair with the victim's spouse had been a fleeting moment of weakness, yet the fear of exposure clutched at her heart. What if that secret came to light? Would it tarnish her pursuit of the truth?",
      "Eleanor knew she had to confront her internal conflict while maintaining her composure. The dark humor she often wielded in her writing became a shield against the weight of her guilt. 'Well, isn't that just the way of it?' she mused quietly to herself, a phrase that had become a comforting mantra. It was time to dive into the depths of this mystery, to unearth the secrets that lay beneath the surface, and perhaps, in doing so, confront her own truths as well."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "A respected family physician with a hidden struggle, Dr. Mallory Finch's life spirals into chaos when her financial troubles intersect with a murder investigation that could cost her everything.",
    "publicPersona": "Dr. Mallory Finch is a pillar of the community, known for her dedication to her patients and her compassionate care, often seen as a trusted confidante in times of need.",
    "privateSecret": "Beneath her professional facade, Mallory is drowning in debt, having borrowed money from the victim to keep her practice afloat.",
    "motiveSeed": "Desperation to erase her financial troubles led her to contemplate drastic measures to protect her practice and reputation.",
    "motiveStrength": "strong",
    "alibiWindow": "She claimed to be attending to a patient in another room during the murder, which may be difficult to verify.",
    "accessPlausibility": "unlikely",
    "stakes": "Her professional reputation and the future of her practice are at risk if her financial struggles come to light, especially in a community that values discretion.",
    "humourStyle": "none",
    "humourLevel": 0,
    "speechMannerisms": "Mallory speaks with a calm, measured tone, often using medical jargon that reflects her profession. When pressed, her responses may become slightly more hurried as she struggles to maintain her composure.",
    "signatureTic": "Let me check my notes.",
    "internalConflict": "Mallory is torn between her ethical obligations as a physician and the desperation of her financial situation, fearing she may have to compromise her morals to survive.",
    "personalStakeInCase": "This murder investigation is crucial for Mallory, not only because it threatens her reputation but also because it forces her to confront the lengths she might go to protect herself.",
    "paragraphs": [
      "Dr. Mallory Finch stood in her office, the familiar scent of antiseptic mingling with the faint aroma of lavender from the diffuser in the corner. Patients relied on her, confiding their fears and ailments, yet here she was, grappling with a fear of her own. The news of the murder sent shockwaves through her, not just because of the tragedy itself but because of the tangled web of her own financial troubles that threatened to unravel at any moment.",
      "With each passing moment, the weight of her secret pressed down on her chest. How could she continue to care for her patients when she was buried in debt? The victim had been her lifeline, a source of financial support she had never intended to rely on so heavily. Now, with their death, she felt the ground shifting beneath her feet, and her mind raced with the implications. 'Let me check my notes,' she murmured to herself, a habit that had once calmed her nerves but now felt like a futile gesture.",
      "In the quiet moments between patients, Mallory wrestled with her conscience. The Hippocratic oath she had taken loomed large, a constant reminder of her duty to do no harm. Yet, the desperation that clawed at her insides whispered dark possibilities. What if she were implicated in this murder? What would that mean for her practice? The thought sent chills down her spine. She had always prided herself on her integrity, but the prospect of losing everything made her question how far she would go to protect her secrets.",
      "As the investigation unfolded around her, Mallory found herself entangled in a moral dilemma. Each question posed by the detective felt like a tightening noose, constricting her ability to breathe. The stakes had never been higher, and she was left to ponder whether her commitment to her patients was worth the risk of losing everything she had built. The truth had a way of surfacing, and she feared what it would reveal about her—and how it would change the lives of those who depended on her."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "A retired naval officer with a dignified exterior, Captain Ivor Hale grapples with a dark past that threatens to resurface amidst a murder investigation tied to his family's honor.",
    "publicPersona": "Ivor Hale is viewed as a respected figure in the community, often seen as a moral compass and a man of integrity, thanks to his years of service in the navy.",
    "privateSecret": "Beneath his polished demeanor lies a history of smuggling during the war, a secret that could destroy his family's reputation if exposed.",
    "motiveSeed": "Fear of exposure drives Ivor to consider drastic actions when the victim threatens to reveal his past.",
    "motiveStrength": "moderate",
    "alibiWindow": "He claimed to be taking a solitary walk along the beach during the murder, a statement that could be easily challenged.",
    "accessPlausibility": "possible",
    "stakes": "The honor of his family and his own peace of mind hang in the balance, leaving him to consider how far he will go to protect them.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.4,
    "speechMannerisms": "Ivor speaks with a measured cadence, often punctuating his statements with anecdotes from his naval days. His humor comes across as dry and occasionally biting, revealing a sharp wit beneath his stoic exterior.",
    "signatureTic": "In my day, we handled things differently.",
    "internalConflict": "Ivor is torn between his desire to protect his family's reputation and the guilt of his past actions, fearing that one misstep could unravel everything he has built.",
    "personalStakeInCase": "This murder investigation is not just a matter of personal safety for Ivor; it challenges the very legacy he wishes to uphold for his family.",
    "paragraphs": [
      "Captain Ivor Hale stood at the edge of the beach, the waves crashing against the shore mirroring the turmoil within him. The salty air filled his lungs, but it did little to clear the fog of anxiety clouding his mind. He was a man of honor, a retired naval officer who had served his country with pride, and yet, beneath the surface lay a history he hoped would remain buried. The murder of the victim threatened to unearth secrets he had fought hard to keep hidden.",
      "With each step along the sand, Ivor's thoughts drifted to the past—those days of smuggling when survival had seemed more pressing than morality. 'In my day, we handled things differently,' he often said, a phrase that now felt like a hollow excuse for choices he could never take back. The fear of exposure loomed large; if the victim had been about to reveal his past, Ivor knew he would do anything to prevent that from happening.",
      "As the investigation unfolded, Ivor found himself caught in a storm of conflicting emotions. He had built a life for his family based on respect and integrity, yet the specter of his past loomed over him like a dark cloud. The stakes were high; if his secrets were exposed, it would not just tarnish his name but also shatter his family's reputation. How far was he willing to go to protect them? The question haunted him as he navigated the delicate dance of suspicion and deceit among the hotel's guests.",
      "Ivor's dignified exterior masked a growing desperation. He was determined to shield his family's honor, even if it meant crossing lines he had sworn never to approach again. As he faced the mounting pressure of the investigation, he realized that the true battle was not just against the detective's inquiries but against the demons of his own making. The past had a way of clawing its way to the surface, and Ivor feared that this time, it might drag him down with it."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "A charming socialite with dreams of stardom, Beatrice Quill's ambitions lead her into a dangerous game of manipulation and deceit that may cost her everything.",
    "publicPersona": "Beatrice is known for her beauty and charm, often attending high-society events and captivating those around her with her aspirations for fame.",
    "privateSecret": "Beatrice has been using her allure to manipulate wealthy men, including the victim, to secure her place in the social hierarchy.",
    "motiveSeed": "Fear of exposure drives Beatrice to consider desperate measures to protect her carefully curated image and future aspirations.",
    "motiveStrength": "strong",
    "alibiWindow": "She was seen at a party in the hotel during the murder but could have easily slipped away unnoticed.",
    "accessPlausibility": "easy",
    "stakes": "Beatrice's dreams of stardom and her social standing are at risk if her manipulations come to light.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Beatrice speaks in a melodious tone, often punctuating her speech with dramatic flourishes. She has a penchant for playful sarcasm and frequently engages in flirtatious banter.",
    "signatureTic": "Oh darling, you know how it is.",
    "internalConflict": "Beatrice struggles with the ethical implications of her actions, torn between her ambition and the potential fallout from her manipulations.",
    "personalStakeInCase": "This murder investigation is crucial for Beatrice, as it threatens her carefully constructed image and the future she has envisioned for herself.",
    "paragraphs": [
      "Beatrice Quill floated through the hotel lobby like a butterfly drawn to the brightest light. Her laughter rang out, charming everyone within earshot, yet beneath her captivating exterior lay a heart filled with ambition and desperation. The murder had cast a shadow on her carefully curated world, and she could feel the tension in the air as guests whispered behind closed doors. If anyone discovered the extent of her manipulations, her dreams of stardom would come crashing down like a house of cards.",
      "With a flick of her wrist, Beatrice adjusted her hair, a nervous habit that belied her confidence. 'Oh darling, you know how it is,' she would often say, a phrase that masked the truth of her situation. She had used her charm to ensnare the victim, hoping to secure a position of influence within the elite circles she so desperately wanted to join. But now, with the specter of murder hanging over her, the stakes had never been higher.",
      "As the investigation unfolded, Beatrice found herself caught between her desire for fame and the ethical implications of her actions. She had always been willing to manipulate those around her, but the thought of losing everything she had worked for sent chills down her spine. The victim's death was not just a tragedy; it was a threat to her carefully crafted image, and she was determined to protect it at all costs.",
      "In the days that followed, Beatrice danced on the edge of danger, flirting with the line between ambition and integrity. The pressure mounted as she navigated the web of suspicion, her charm becoming both a weapon and a shield. Yet, in the quiet moments, doubt crept in. Was she willing to sacrifice her moral compass for the sake of fame? And if the truth came out, would it be worth the cost of her dreams?"
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "A competent hotel manager with a hidden romance, Sylvia Trent's world is turned upside down when her affair becomes a potential motive in a murder investigation.",
    "publicPersona": "Sylvia is seen as the diligent manager of the hotel, ensuring that guests feel welcome and cared for, often praised for her organizational skills.",
    "privateSecret": "Sylvia is involved in a secret love affair with the victim's spouse, a relationship that could destroy her career if exposed.",
    "motiveSeed": "The victim's threat to reveal the affair puts Sylvia in a precarious position, forcing her to consider extreme measures.",
    "motiveStrength": "moderate",
    "alibiWindow": "She claimed to be in her office organizing a charity event at the time of the murder, a statement that could be easily verified.",
    "accessPlausibility": "possible",
    "stakes": "Sylvia's career and personal life are at risk if her affair is revealed, leaving her to navigate the fallout.",
    "humourStyle": "observational",
    "humourLevel": 0.4,
    "speechMannerisms": "Sylvia speaks in a calm, reassuring tone, often using practical language. She has a tendency to observe her surroundings keenly, commenting on the dynamics of the guests subtly.",
    "signatureTic": "It's all part of the job, really.",
    "internalConflict": "Sylvia is torn between her loyalty to the victim and her feelings for the spouse, struggling to reconcile her actions with her professional ethics.",
    "personalStakeInCase": "This murder investigation is deeply personal for Sylvia, not only because it threatens her career but also because it forces her to confront the consequences of her hidden affair.",
    "paragraphs": [
      "Sylvia Trent stood behind the reception desk, her hands poised over the polished wood as she surveyed the bustling hotel lobby. The atmosphere was charged, filled with whispers and furtive glances. As the manager, she had always prided herself on her ability to keep the peace among guests, yet the specter of murder loomed large, threatening to disrupt the delicate balance she had worked so hard to maintain. The stakes were higher than ever, and she could feel the weight of her secret pressing down on her.",
      "Her affair with the victim's spouse was a fire she had stoked with reckless abandon, a passionate connection that had brought her joy but also peril. 'It's all part of the job, really,' she would joke when asked about her long hours, but deep down, she knew the truth. If the victim had threatened to expose their relationship, it could destroy not only her career but also the fragile happiness she had found. The thought sent shivers down her spine as she contemplated the consequences of her choices.",
      "As the investigation unfolded around her, Sylvia found herself caught in a web of deception and guilt. She had always been a caretaker, dedicated to her guests and their needs, but now she was forced to confront the reality of her own actions. The tension in the air was palpable, and every inquiry from the detective felt like a spotlight shining on her hidden life. The stakes were personal; her career and emotional well-being hung in the balance, and she feared what would happen if the truth were to emerge.",
      "Navigating the complexities of her feelings for the spouse and her loyalty to the victim became a delicate dance. Sylvia's calm demeanor masked the turmoil within, as she grappled with the consequences of her choices. The investigation had become a crucible, forcing her to confront not just the murder but also the moral implications of her secret life. In the end, she would have to decide what mattered most—her career or the love that had brought her both joy and pain."
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "A wealthy inheritance consultant with a charm that masks his ulterior motives, Hugo Vane's ambition drives him to manipulate those around him, leading to a web of deceit that threatens to unravel.",
    "publicPersona": "Hugo is known for his affluence and charm, often seen as a trusted advisor to families navigating inheritance matters, with a reputation for being shrewd yet likable.",
    "privateSecret": "Hugo had forged a close relationship with the victim, potentially to sway inheritance decisions in his favor.",
    "motiveSeed": "With the victim's death, he stands to gain financially by securing lucrative contracts with the family, a prospect that drives him to consider drastic actions.",
    "motiveStrength": "compelling",
    "alibiWindow": "He claimed to be in a meeting with clients at the time of the murder, but the validity of his alibi is questionable.",
    "accessPlausibility": "easy",
    "stakes": "His reputation and future business depend on maintaining his affluent connections, leaving him to navigate the treacherous waters of ambition and greed.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.5,
    "speechMannerisms": "Hugo speaks with a smooth, persuasive tone, often employing flattery and charm to disarm those around him. He has a tendency to use grandiose language when discussing his work.",
    "signatureTic": "Ah, but that's just the nature of the business, isn't it?",
    "internalConflict": "Hugo struggles with the ethical implications of his ambition, torn between his desire for wealth and the potential consequences of his actions.",
    "personalStakeInCase": "This murder investigation poses a significant threat to Hugo, as it could expose his manipulations and jeopardize his carefully constructed facade.",
    "paragraphs": [
      "Hugo Vane leaned against the bar, a glass of scotch in hand, exuding an air of affluence and charm that drew people in like moths to a flame. He was the quintessential consultant, a man whose presence commanded attention and respect. Yet beneath the polished exterior lay a mind that thrived on ambition and manipulation. The murder of the victim had sent ripples through the social fabric of the hotel, and Hugo found himself at the center of a storm he had partially orchestrated.",
      "With a wry smile, he often remarked, 'Ah, but that's just the nature of the business, isn't it?' A phrase that had become his shield against the scrutiny of others. The victim's death opened doors for him that had previously remained closed, presenting opportunities to secure lucrative contracts with the grieving family. Yet, the prospect of murder hung over him like a dark cloud, and he knew that any misstep could unravel the carefully crafted facade he had built.",
      "As the investigation progressed, Hugo felt the pressure mount. He had spent years cultivating relationships, using charm and wit to manipulate those around him. But now, with the detective probing deeper, he was forced to confront the ethical implications of his actions. Did he truly want to risk everything for the sake of greed? The dilemma gnawed at him, a constant reminder of the fine line he walked between ambition and morality.",
      "Navigating the treacherous waters of the investigation required all of Hugo's cunning. He had to maintain his reputation while simultaneously deflecting suspicion. Each interaction became a delicate dance, his charm a weapon and a shield. Yet, the deeper he delved into the mystery, the more he realized that the truth had a way of surfacing, and he would have to decide whether to continue down a path of deceit or risk everything to protect the carefully constructed image he had built over the years."
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
    "type": "Seaside hotel",
    "place": "Cromer",
    "country": "England",
    "summary": "A grand seaside hotel, caught between the elegance of Art Deco and the charm of Colonial architecture, where whispers of distrust swirl like the ocean mist.",
    "visualDescription": "The Oceanview Hotel boasts sweeping balconies adorned with wrought iron, large bay windows reflecting the turbulent sea, and a façade of pale stucco that stands against the moody sky. Lush lawns frame the entrance, leading to a cobblestone path that meanders toward the beach, where private property signs guard the sand.",
    "atmosphere": "A sense of foreboding lingers in the air, as the mix of elegance and isolation creates an unsettling tension among the guests.",
    "paragraphs": [
      "The Oceanview Hotel rises majestically above the rugged coastline, its Art Deco lines softened by Colonial accents. The salty breeze carries the faint sounds of crashing waves, but within the hotel, a different tension brews. Guests and staff alike navigate the narrow hallways, their footsteps echoing against the polished floors, as the distant hum of a radio fills the common areas. Conversations are hushed, eyes darting, suspicion weaving through the air like the scent of damp seaweed.",
      "As the clouds gather overhead, the atmosphere thickens with unease. The hotel's grand lobby, with its high ceilings and ornate chandeliers, feels more like a gilded cage than a refuge. Guests glance at each other, masks of cordiality slipping to reveal the underlying distrust. The staff, too, are on edge, acutely aware that management's authority can turn a pleasant stay into a nightmare with the stroke of a pen, locking doors to certain floors and monitoring access with vigilant eyes.",
      "Each room tells a story, but the tales of the guests remain locked behind closed doors. The sound of rain tapping against the windowpanes serves as a grim reminder of the storm brewing both outside and within. The hotel, with its view of the tumultuous sea, stands as a fortress of secrets, where the beauty of the surroundings contrasts sharply with the dark undercurrents of human frailty and deception."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "Overcast with occasional rain, typical for coastal climates in spring",
    "timeFlow": "Three days of mounting tension and suspicion among the guests",
    "mood": "Tense and suspenseful, with an undercurrent of distrust among the guests",
    "eraMarkers": [
      "Ubiquitous radios playing wartime broadcasts",
      "Early television sets in common areas",
      "Rationed wartime vehicles parked outside"
    ],
    "sensoryPalette": {
      "dominant": "Salt air and damp wood",
      "secondary": [
        "Crisp linen and fresh paint",
        "Musty carpets and old leather"
      ]
    },
    "paragraphs": [
      "The scent of salt air mingles with the musty odor of damp wood, creating a unique atmosphere that clings to the walls of the Oceanview Hotel. The sound of waves crashing against the rocky shoreline is a constant reminder of the isolation that surrounds the hotel, while the occasional rumble of thunder adds an ominous note to the ambiance. Inside, the hotel is a patchwork of elegance and decay, with crisp linen tablecloths contrasting against the worn leather of the armchairs in the lounge.",
      "As guests gather in the drawing room, the flickering light of the radio casts dancing shadows on the walls, illuminating the faces of those who share furtive glances. The tension is palpable, each conversation laced with unspoken accusations. The feeling that something is amiss hangs heavily in the air, creating an atmosphere ripe for intrigue and suspicion."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Grand Dining Room",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "An expansive room with high ceilings, adorned with ornate chandeliers and large bay windows overlooking the sea. Tables are set with fine china and polished silverware, reflecting the dim light.",
      "sensoryDetails": {
        "sights": [
          "gleaming silver cutlery on white linen",
          "shadows playing across the polished floor",
          "rain streaks on the tall windows",
          "art deco murals on the walls"
        ],
        "sounds": [
          "clinking glasses and cutlery",
          "muffled conversations and laughter",
          "the distant crash of waves",
          "the creak of old floorboards"
        ],
        "smells": [
          "rich roast beef and gravy",
          "freshly baked bread and butter",
          "dampness from the rain outside",
          "worn wood and varnish"
        ],
        "tactile": [
          "smooth tablecloth under fingertips",
          "cold metal of silverware",
          "the warmth of candle flames",
          "the chill of the ocean air seeping in"
        ]
      },
      "accessControl": "Guests are allowed during dining hours; management restricts access after hours. Staff can enter for cleaning and service, but must log entry.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "dim light filtering through rain-soaked windows",
            "droplets clinging to the glass",
            "dark clouds looming outside"
          ],
          "sounds": [
            "steady rain tapping on the roof",
            "the rustle of waitstaff preparing",
            "soft murmurs of early risers",
            "the distant rumble of thunder"
          ],
          "smells": [
            "freshly brewed coffee and pastries",
            "wet stone and earth",
            "the scent of damp cloths",
            "the faint aroma of smoke from the fireplace"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "grey light casting shadows",
            "clouds drifting over the horizon",
            "a solitary figure at the window"
          ],
          "sounds": [
            "the creak of chairs scraping",
            "the soft clatter of teacups",
            "the ticking of a clock",
            "the distant sound of waves"
          ],
          "smells": [
            "tea leaves steeping",
            "sugar and lemon",
            "the mustiness of old books",
            "the scent of wet wood"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight flickering on tables",
            "stars beginning to peek through clouds",
            "guests in formal attire",
            "shadows lengthening across the room"
          ],
          "sounds": [
            "laughter and music from a radio",
            "the soft murmur of conversation",
            "the sound of a cork popping",
            "the rustle of silk dresses"
          ],
          "smells": [
            "scent of wine and cheese",
            "the aroma of grilled fish",
            "fresh flowers on the tables",
            "the faint scent of cologne"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Grand Dining Room, with its high ceilings and ornate chandeliers, serves as the heart of the Oceanview Hotel. Here, the guests gather for meals that echo with laughter, yet the undercurrent of suspicion is palpable. The long tables, set with gleaming silver and crisp linens, seem to invite camaraderie, but the glances exchanged between diners tell a different story. The rain outside drums against the windows, adding to the tension within, as if nature itself is aware of the secrets lurking among the guests.",
        "On the evening of the incident, the room was filled with an air of celebration, but the atmosphere quickly shifted. As the candlelight flickered, revealing faces taut with anxiety, a chilling silence fell over the diners. The sounds of cutlery clinking ceased, replaced by the distant crash of waves that seemed to echo the turmoil within. It was here, amidst the elegance and the whispers, that the first act of deception would unfold, marking the beginning of a mystery that would ensnare them all."
      ]
    },
    {
      "id": "drawing_room",
      "name": "The Drawing Room",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "A cozy yet grand room filled with plush armchairs, dark wood paneling, and a large fireplace. Oil paintings of seascapes adorn the walls.",
      "sensoryDetails": {
        "sights": [
          "glowing fireplace casting warm light",
          "rich tapestries hanging from the walls",
          "ornate molding along the ceiling",
          "large bay windows with sea views"
        ],
        "sounds": [
          "crackling firewood",
          "soft rustling of newspaper pages",
          "intermittent laughter from guests",
          "the distant sound of waves crashing"
        ],
        "smells": [
          "smoky wood and burnt embers",
          "the scent of old books and leather",
          "freshly brewed tea",
          "the faint perfume of flowers"
        ],
        "tactile": [
          "soft velvet upholstery",
          "cool marble mantelpiece",
          "the warmth of a woolen throw",
          "the rough texture of aged books"
        ]
      },
      "accessControl": "Open to guests during the day; closed at night. Staff can enter for cleaning and service, but must announce themselves.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "dim light filtering through grey clouds",
            "raindrops trickling down the windows",
            "glistening floors from the morning cleaning",
            "a solitary figure reading by the fire"
          ],
          "sounds": [
            "gentle patter of rain on the roof",
            "the rustle of a newspaper",
            "a clock ticking in the corner",
            "soft whispers of conversation"
          ],
          "smells": [
            "freshly brewed coffee and pastries",
            "the musty scent of antique books",
            "the aroma of damp wood",
            "the sweetness of blooming flowers"
          ],
          "mood": "somber reflection"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows creeping across the floor",
            "the flickering light of a lamp",
            "guests seated in quiet conversation",
            "a half-empty teapot on the table"
          ],
          "sounds": [
            "the ticking of a clock",
            "the sound of a chair scraping",
            "the soft murmur of voices",
            "the crackle of the fireplace"
          ],
          "smells": [
            "the scent of burnt wood",
            "the aroma of strong tea",
            "the mustiness of leather-bound books",
            "the fragrance of fresh flowers"
          ],
          "mood": "tense quietude"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight illuminating the room",
            "guests dressed in evening attire",
            "the glow of the fireplace",
            "stars beginning to twinkle outside"
          ],
          "sounds": [
            "laughter and soft conversation",
            "the crackling of the fire",
            "the clink of glasses",
            "the rustle of silk dresses"
          ],
          "smells": [
            "the aroma of fine wine",
            "the scent of rich chocolate desserts",
            "the fragrance of fresh flowers",
            "the warmth of baked bread"
          ],
          "mood": "festive anticipation"
        }
      ],
      "paragraphs": [
        "The Drawing Room serves as a sanctuary for guests seeking solace or companionship. Its plush armchairs invite weary souls to sink into their embrace, while the glow of the fireplace casts a warm and inviting light. Here, conversations flow easily, but beneath the surface, a current of tension simmers. The scent of smoky wood and rich leather fills the air, mingling with the delicate aroma of freshly brewed tea, creating an atmosphere that is both comforting and deceptive.",
        "As the day turns to evening, the room transforms into a gathering place for hushed conversations and secretive glances. Candlelight flickers, illuminating the worried expressions of the guests. The cracks in their facades begin to show, as laughter echoes awkwardly against the quiet of the room. It is here that alliances are formed and broken, as the shadows lengthen and the night deepens, setting the stage for the unfolding mystery."
      ]
    },
    {
      "id": "library",
      "name": "The Library",
      "type": "interior",
      "purpose": "Clue discovery",
      "visualDetails": "A dark, book-lined room filled with heavy wooden shelves, a large globe in the center, and a single reading table beneath a brass lamp.",
      "sensoryDetails": {
        "sights": [
          "dusty tomes lining the shelves",
          "the warm glow of a brass lamp",
          "a large globe with faded colors",
          "the intricate carvings on the furniture"
        ],
        "sounds": [
          "the rustle of turning pages",
          "the creak of the wooden floor",
          "the faint ticking of a clock",
          "the whisper of footsteps"
        ],
        "smells": [
          "old paper and ink",
          "the scent of polished wood",
          "a hint of mustiness in the air",
          "the faint aroma of tobacco"
        ],
        "tactile": [
          "rough edges of old books",
          "smooth surface of the reading table",
          "cool metal of the lamp",
          "the plush softness of a reading chair"
        ]
      },
      "accessControl": "Open to guests during the day for reading; locked at night. Staff can enter for maintenance but must log their visits.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "dim light filtering through rain-streaked windows",
            "shadows dancing along the shelves",
            "a single figure reading in the corner",
            "the glow of the lamp against the gloom"
          ],
          "sounds": [
            "gentle patter of rain outside",
            "the soft rustle of a page turning",
            "the ticking of a clock on the wall",
            "the quiet creaking of the building"
          ],
          "smells": [
            "the scent of wet paper",
            "old leather and ink",
            "the comforting aroma of brewed tea",
            "the faint whiff of damp wood"
          ],
          "mood": "introspective calm"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows lengthening across the floor",
            "the flickering light of the lamp",
            "dust motes floating in the air",
            "a stack of books waiting to be read"
          ],
          "sounds": [
            "the sound of a chair scraping",
            "the rustle of paper as pages turn",
            "the ticking of a clock",
            "the faint echo of voices outside"
          ],
          "smells": [
            "the scent of musty books",
            "the aroma of brewed coffee",
            "the faint fragrance of polished wood",
            "the tang of old paper"
          ],
          "mood": "suspenseful discovery"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "the warm glow of the lamp illuminating the table",
            "shadows deepening in the corners",
            "a figure lost in thought",
            "the outlines of books against the light"
          ],
          "sounds": [
            "the quiet rustle of pages turning",
            "the soft ticking of a clock",
            "the distant sound of laughter from the drawing room",
            "the creaking of the building settling"
          ],
          "smells": [
            "the scent of old paper and ink",
            "the faint aroma of tobacco smoke",
            "the comforting smell of leather",
            "the crispness of night air seeping in"
          ],
          "mood": "mysterious intrigue"
        }
      ],
      "paragraphs": [
        "The Library is a haven for those seeking knowledge and solace, its walls lined with dusty tomes that whisper secrets of the past. The warm glow of a brass lamp casts shadows across the dark wooden shelves, creating an atmosphere thick with history and intrigue. Here, the smell of old paper and polished wood fills the air, inviting guests to linger in quiet contemplation or to seek out hidden truths among the pages.",
        "As the evening progresses, the library transforms into a space where clues might be uncovered. The quiet rustle of turning pages is punctuated by the creak of the floorboards, a reminder of the weight of the history surrounding those who seek answers. The scent of tobacco lingers in the air, mingling with the mustiness of the books, as the tension builds. Each shadow holds the potential for revelation, making the library a critical location in the unfolding mystery."
      ]
    },
    {
      "id": "garden",
      "name": "The Garden",
      "type": "exterior",
      "purpose": "Isolation and reflection",
      "visualDetails": "A manicured garden with colorful flower beds, trimmed hedges, and a stone path leading to a small gazebo overlooking the ocean.",
      "sensoryDetails": {
        "sights": [
          "vibrant blooms in full color",
          "neatly trimmed hedges",
          "the gentle sway of flowers in the breeze",
          "the distant waves crashing"
        ],
        "sounds": [
          "birds chirping in the trees",
          "the rustle of leaves in the wind",
          "the sound of waves lapping at the shore",
          "the distant laughter of guests"
        ],
        "smells": [
          "fragrant flowers in bloom",
          "freshly cut grass",
          "the salty tang of the ocean air",
          "the earthy scent of damp soil"
        ],
        "tactile": [
          "soft petals brushing against skin",
          "cool stone path underfoot",
          "the warmth of the sun on skin",
          "the rough texture of tree bark"
        ]
      },
      "accessControl": "Open to guests at all hours; staff maintain the garden but guests are free to wander. The gazebo is a popular spot for quiet reflection.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops clinging to flower petals",
            "the garden glistening in the grey light",
            "a solitary figure with an umbrella",
            "puddles forming on the stone path"
          ],
          "sounds": [
            "the soft patter of rain on leaves",
            "the distant sound of thunder",
            "the rustle of wet grass",
            "the drip of water from branches"
          ],
          "smells": [
            "the scent of wet earth",
            "the fragrance of blooming flowers",
            "the sharpness of rain in the air",
            "the dampness of the grass"
          ],
          "mood": "melancholic solitude"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "clouds casting shadows over the garden",
            "the colors of flowers muted in the grey light",
            "a figure sitting on a bench",
            "the stillness of the air"
          ],
          "sounds": [
            "the chirping of birds",
            "the rustle of leaves in the breeze",
            "the crash of waves in the distance",
            "the soft sound of footsteps on gravel"
          ],
          "smells": [
            "the scent of damp earth",
            "the aroma of wet flowers",
            "the freshness of the ocean breeze",
            "the tang of salt in the air"
          ],
          "mood": "reflective tranquility"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "the sun setting over the ocean",
            "fireflies beginning to dance in the dusk",
            "the silhouette of the gazebo against the sky",
            "shadows lengthening across the grass"
          ],
          "sounds": [
            "the gentle lapping of waves",
            "the distant sound of laughter from the hotel",
            "the rustling of leaves in the evening breeze",
            "the chirping of crickets"
          ],
          "smells": [
            "the scent of blooming night flowers",
            "the freshness of the evening air",
            "the tang of saltwater",
            "the earthy aroma of the garden"
          ],
          "mood": "serene contemplation"
        }
      ],
      "paragraphs": [
        "The Garden is a sanctuary of beauty, a manicured expanse where guests can escape the tensions of the hotel. Vibrant flower beds burst with color, their fragrance mingling with the salty tang of the ocean air. The gentle sway of flowers in the breeze creates a soothing backdrop, while the distant sound of waves crashing against the shore adds to the sense of serenity. Here, the world feels momentarily at peace, yet beneath the surface, secrets linger like shadows among the petals.",
        "In the evenings, the garden transforms into a magical realm, as fireflies dance against the backdrop of a setting sun. The gazebo, overlooking the tumultuous sea, becomes a popular spot for quiet reflection, where guests can ponder the events of the day. Yet, as the darkness deepens, a sense of foreboding creeps in, reminding all who linger that even the most beautiful places can harbor hidden dangers."
      ]
    }
  ],
  "note": "",
  "cost": 0.00293717655,
  "durationMs": 29983
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1940,
    "month": "January",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "winter",
    "month": "January",
    "weather": [
      "Overcast skies with sporadic rain",
      "Chilly winds blowing in from the sea",
      "Occasional bright spells breaking through the clouds"
    ],
    "daylight": "Short days with daylight lasting until around 4:30 PM, with twilight quickly enveloping the coastal town",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, when the hotel is quiet and the guests are gathered for dinner",
    "holidays": [
      "New Year's Day (January 1)"
    ],
    "seasonalActivities": [
      "Indoor card games by the fireplace",
      "Exploring the coastal promenade wrapped in warm coats",
      "Attending winter balls and charity events in the hotel"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "Three-piece wool suit in dark grey",
        "Tailored overcoat with a velvet collar",
        "Bow tie or necktie in muted plaid patterns"
      ],
      "casual": [
        "Woolen sweaters with crew necks",
        "Tweed caps for outdoor wear",
        "Chinos or flannel trousers"
      ],
      "accessories": [
        "Leather gloves",
        "Wool scarves",
        "Pocket watches"
      ]
    },
    "womensWear": {
      "formal": [
        "Tea-length dress with a fitted bodice and flared skirt",
        "Long-sleeved evening gown in rich fabrics like satin",
        "Faux fur wrap or stole"
      ],
      "casual": [
        "Knee-length skirts paired with fitted sweaters",
        "Wool coats with detailed buttons",
        "Knitted hats and gloves"
      ],
      "accessories": [
        "Pearl necklaces",
        "Cloche hats",
        "Small handbags with chain straps"
      ]
    },
    "trendsOfTheMoment": [
      "Emphasis on tailored silhouettes",
      "Use of rich, warm colors for winter attire",
      "Popularity of vintage-inspired patterns"
    ],
    "socialExpectations": [
      "Formal attire expected for evening events",
      "Women encouraged to look polished and elegant",
      "Men expected to maintain a dignified appearance"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "Tensions rising in Europe as Germany prepares for potential aggression",
      "The United States still grappling with the impact of the Great Depression",
      "Increased military spending discussions in the British Parliament"
    ],
    "politicalClimate": "A growing sense of unease as the threat of World War II looms over Europe, with nations bracing for potential conflict.",
    "economicConditions": "Strained economic conditions in many parts of the world, with growing unemployment rates and a struggling economy in the U.S.",
    "socialIssues": [
      "Debates surrounding pacifism versus militarism",
      "Discussions on women's rights in the workforce",
      "Racial tensions exacerbated by economic hardships"
    ],
    "internationalNews": [
      "Reports of Nazi Germany's aggressive military maneuvers",
      "Refugees fleeing war-torn regions of Europe seeking asylum"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Bing Crosby's 'White Christmas'",
        "Glenn Miller's big band sound",
        "Tommy Dorsey's 'I'll Never Smile Again'"
      ],
      "films": [
        "'The Great Dictator' by Charlie Chaplin",
        "'Rebecca' directed by Alfred Hitchcock",
        "'The Grapes of Wrath' based on Steinbeck's novel"
      ],
      "theater": [
        "Broadway's 'The Time of Your Life'",
        "Musicals featuring popular war-themed songs"
      ],
      "radio": [
        "The Shadow",
        "The Lone Ranger",
        "Suspense dramas captivating late evening audiences"
      ]
    },
    "literature": {
      "recentPublications": [
        "'For Whom the Bell Tolls' by Ernest Hemingway",
        "'The Maltese Falcon' by Dashiell Hammett",
        "'The Grapes of Wrath' by John Steinbeck"
      ],
      "popularGenres": [
        "War literature",
        "Mystery and detective fiction",
        "Realist novels reflecting societal issues"
      ]
    },
    "technology": {
      "recentInventions": [
        "Radar technology becoming more refined",
        "The introduction of early television broadcasts",
        "Advancements in aircraft design"
      ],
      "commonDevices": [
        "Radios in most households",
        "Typewriters for personal and business use",
        "Basic home appliances like refrigerators and electric stoves"
      ],
      "emergingTrends": [
        "Increased reliance on radio for news and entertainment",
        "Growing interest in film as a popular medium",
        "Early adoption of television as a novelty"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: 4 pence",
        "Cinema ticket: 6 pence",
        "Coal scuttle refill: 1 shilling 6 pence"
      ],
      "commonActivities": [
        "Attending local dances and social events",
        "Gathering for tea and conversation in living rooms",
        "Participating in church services and community gatherings"
      ],
      "socialRituals": [
        "Formal dinner parties with elaborate meals",
        "Card games and parlor games as evening entertainment"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "Strong class distinctions still evident",
      "Rising aspirations among the working class"
    ],
    "gender": [
      "Women increasingly taking on roles in the workforce, yet still expected to conform to traditional gender roles at home",
      "Debate about women's suffrage and equality"
    ],
    "race": [
      "Racial segregation prevalent in many areas",
      "Growing awareness of civil rights issues among minority communities"
    ],
    "generalNorms": [
      "Expectations for proper etiquette in social situations",
      "High value placed on modesty and decorum in public life"
    ]
  },
  "atmosphericDetails": [
    "The salty tang of the sea air mixes with the scent of wet earth after a light rain",
    "The sound of waves crashing against the rocky shore, mingling with the distant laughter and clinking glasses from the hotel dining room",
    "Flickering candlelight casting shadows on the walls, creating an intimate yet tense atmosphere as guests exchange wary glances"
  ],
  "paragraphs": [
    "January 1940 brings a chill to the coastal hotel, cloaked in overcast skies that threaten rain at any moment. As the sun sets early, the flickering lights from the hotel windows create an inviting glow against the darkness, while the salty sea air carries an undercurrent of tension among the guests. With the threat of war looming ominously on the horizon, conversations drift from idle chatter to hushed discussions of political unrest, making the atmosphere thick with suspicion and unease.",
    "Fashion in this winter season is characterized by tailored elegance, as men don three-piece suits in dark wool, complemented by velvet-collared overcoats and bow ties, while women grace the dining room in tea-length dresses made from rich fabrics adorned with intricate detailing. The cloche hats and faux fur stoles worn by the women evoke a sense of sophistication, while men’s leather gloves and wool scarves complete their polished appearance. This attention to detail reflects the social expectations of the time, where formality is the norm in public gatherings.",
    "Daily life in January 1940 revolves around community and resilience amid uncertainty. Local gatherings, from card games by the fireplace to winter balls in the hotel, provide a respite from the harsh realities outside. The price of a loaf of bread at four pence is a reminder of the economic challenges faced by many households, while the laughter of guests mingles with the sounds of the crashing waves outside. Yet, beneath the surface of camaraderie lies a palpable distrust, as whispers of the growing global tensions seep into the fabric of their interactions, creating an atmosphere ripe for mystery."
  ],
  "note": "",
  "cost": 0.0011025002999999998,
  "durationMs": 14088
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A seaside hotel hosts a gathering of diverse guests, each grappling with post-war anxieties and personal secrets, as tensions rise amidst a backdrop of distrust and hidden identities.",
  "era": {
    "decade": "1940s",
    "socialStructure": "The aftermath of WWII has reshaped societal norms, with increased female workforce participation and Cold War tensions creating a complex web of class dynamics and social pressure."
  },
  "setting": {
    "location": "A large, two-story hotel with a view of the ocean, featuring a mix of Art Deco and Colonial architectural styles, surrounded by manicured lawns and coastal pathways.",
    "institution": "Seaside hotel",
    "weather": "Overcast with occasional rain, typical for coastal climates in spring"
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
    "id": "time_of_death",
    "value": "ten minutes past ten",
    "description": "The exact time of the murder."
  },
  {
    "id": "mirror_angle",
    "value": "ninety degrees",
    "description": "The angle at which the two-way mirror was positioned."
  },
  {
    "id": "distance_to_victim",
    "value": "eight feet",
    "description": "The distance from the mirror to the victim's location."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 19,
  "countsByPlacement": {
    "early": 3,
    "mid": 15,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 18,
    "optional": 1
  },
  "redHerringCount": 2,
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
      "category": "spatial"
    },
    {
      "id": "clue_3",
      "placement": "mid",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_4",
      "placement": "mid",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_5",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
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
      "category": "behavioral"
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
      "category": "testimonial"
    },
    {
      "id": "clue_12",
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
      "id": "clue_culprit_direct_captain_ivor_hale",
      "placement": "early",
      "criticality": "essential",
      "category": "spatial"
    },
    {
      "id": "clue_early_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_early_2",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_mid_1",
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

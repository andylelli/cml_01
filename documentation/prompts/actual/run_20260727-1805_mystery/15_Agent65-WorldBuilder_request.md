# Actual Prompt Record

- Run ID: `mystery-1785175520689`
- Project ID: ``
- Timestamp: `2026-07-27T18:09:45.802Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `b10defad042edee7`

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
    "title": "The Timed Deception",
    "author": "Agent 9",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1940s",
      "realism_constraints": []
    },
    "setting": {
      "location": "A grand, art deco seaside hotel",
      "place": "Brighton",
      "country": "England",
      "institution": "Seaside hotel"
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
      "role_archetype": "detective",
      "relationships": [],
      "public_persona": "Acclaimed journalist",
      "private_secret": "Haunted by war memories",
      "motive_seed": "inheritance",
      "motive_strength": "low",
      "alibi_window": "8 PM to 10 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "interviewing guests",
        "access to public areas"
      ],
      "behavioral_tells": [],
      "stakes": "Solve the case to restore her reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "doctor",
      "relationships": [],
      "public_persona": "Renowned physician",
      "private_secret": "Struggling with the death of a patient",
      "motive_seed": "Professional rivalry with Hugo",
      "motive_strength": "moderate",
      "alibi_window": "9 PM to 11 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "medical supplies",
        "staff access"
      ],
      "behavioral_tells": [],
      "stakes": "Maintain professional integrity",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "35-45",
      "role_archetype": "military officer",
      "relationships": [],
      "public_persona": "War hero",
      "private_secret": "Guilt over wartime decisions",
      "motive_seed": "Protecting a fellow officer's reputation",
      "motive_strength": "high",
      "alibi_window": "9 PM to 10 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "military contacts",
        "hotel staff"
      ],
      "behavioral_tells": [],
      "stakes": "Protect his name",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "25-35",
      "role_archetype": "socialite",
      "relationships": [],
      "public_persona": "Socialite",
      "private_secret": "In debt to Hugo",
      "motive_seed": "Financial pressure",
      "motive_strength": "low",
      "alibi_window": "8 PM to 10 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "social gatherings",
        "dining room access"
      ],
      "behavioral_tells": [],
      "stakes": "Avoid scandal",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "30-40",
      "role_archetype": "housekeeper",
      "relationships": [],
      "public_persona": "Diligent staff member",
      "private_secret": "Knows more than she lets on",
      "motive_seed": "Protecting the hotel's reputation",
      "motive_strength": "high",
      "alibi_window": "8 PM to 10 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "cleaning supplies",
        "access to all rooms"
      ],
      "behavioral_tells": [],
      "stakes": "Job security",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "40-50",
      "role_archetype": "victim",
      "relationships": [],
      "public_persona": "Wealthy businessman",
      "private_secret": "Involved in shady dealings",
      "motive_seed": "inheritance",
      "motive_strength": "none",
      "alibi_window": "evening",
      "access_plausibility": "medium",
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
      "Dr. Mallory Finch"
    ]
  },
  "surface_model": {
    "narrative": {
      "summary": "During a stormy evening at a seaside hotel, Hugo Vane is found dead. As the guests gather to unravel the mystery, they discover that the clock in the lobby has been tampered with, leading them to question the timing of the murder and the motives of each suspect."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "The mechanism relies on clock, lobby, and minut to expose the false timing.",
      "delivery_path": [
        {
          "step": "The clock in the lobby was wound and set back so that it appeared to show a time when the murder was impossible."
        }
      ]
    },
    "outcome": {
      "result": "The false time misleads the investigation into when Hugo was actually murdered."
    }
  },
  "false_assumption": {
    "statement": "Hugo was murdered just after nine o'clock.",
    "type": "temporal",
    "why_it_seems_reasonable": "The lobby clock showed a time consistent with witness accounts.",
    "what_it_hides": "The clock was tampered with to give a false timeline."
  },
  "false_solution": {
    "accused_suspect": "Dr. Mallory Finch",
    "supporting_points": [
      "Dr. Finch was the last known person to see Hugo alive.",
      "Witnesses claim she was in the vicinity of the murder scene."
    ],
    "the_one_flaw": "Dr. Finch's alibi is corroborated by multiple witnesses who saw her in the dining room.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "Witnesses claim to have seen Captain Hale arguing with Hugo just before the murder.",
      "points_at_suspect": "Captain Ivor Hale",
      "innocent_explanation": "The argument was a misunderstanding over a business deal, unrelated to the murder.",
      "resolved_in_chapter": 5
    },
    {
      "id": "red_herring_2",
      "description": "Eleanor Voss found a threatening letter addressed to Hugo in his room.",
      "points_at_suspect": "Beatrice Quill",
      "innocent_explanation": "The letter was from a disgruntled business partner, not Beatrice.",
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
    "rationale": "All suspects are guests at the hotel, and no outsiders were involved."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "The clock in the lobby",
        "Witness statements"
      ],
      "windows": [
        "Time of death estimated between 9 PM and 10 PM"
      ],
      "contradictions": [
        "Clock shows a different time than witness accounts"
      ]
    },
    "access": {
      "actors": [
        "All suspects had access to the lobby clock."
      ],
      "objects": [
        "The lobby clock"
      ],
      "permissions": [
        "All guests had access to public areas of the hotel."
      ]
    },
    "physical": {
      "laws": [
        "Mechanical clocks can be wound and set to different times."
      ],
      "traces": [
        "Fingerprints on the clock face"
      ]
    },
    "social": {
      "trust_channels": [
        "Hotel staff reliability"
      ],
      "authority_sources": [
        "Captain Hale's military reputation"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The clock in the lobby shows a time of ten minutes past eleven.",
        "correction": "This contradicts witness statements that Hugo was last seen alive at nine o'clock.",
        "effect": "Narrows time of death to between nine and ten.",
        "required_evidence": [
          "The clock in the lobby",
          "Witness statements about Hugo's last sighting"
        ],
        "reader_observable": true
      },
      {
        "observation": "Witnesses report the clock was unusually silent earlier that evening.",
        "correction": "This indicates the clock may have been tampered with before the murder.",
        "effect": "Eliminates the possibility that the clock was functioning normally.",
        "required_evidence": [
          "Witness statements about the clock",
          "The clock's mechanism"
        ],
        "reader_observable": true
      },
      {
        "observation": "The fingerprints found on the clock face do not match any of the suspects.",
        "correction": "This suggests that the clock was tampered with by someone else.",
        "effect": "Narrows suspect list to those who had access to the clock.",
        "required_evidence": [
          "Fingerprints on the clock face",
          "List of hotel staff with access"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "The discriminating test compares clock, lobby, and minut against the claimed timeline.",
    "knowledge_revealed": "The clock mechanism had fresh tool marks indicating tampering.",
    "pass_condition": "If the clock's tampering aligns with the timeline of the murder, the suspect with access is guilty.",
    "evidence_clues": [
      "clue_early_1",
      "clue_culprit_direct_1",
      "clue_core_contradiction_chain",
      "clue_culprit_direct_dr_mallory_finch"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The clock's time discrepancy (early) and witness statements (mid) separate the time of death from the clock's reading. Step 2: Witness observations of the clock's silence (mid) eliminate the possibility of normal function. Step 3: The fingerprints on the clock (discriminating test) confirm tampering, leading to the identification of the perpetrator."
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
      "test_type": "clock mechanism examination"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Proves he was attending a military meeting.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Her financial troubles do not connect to the murder.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Confirmed cleaning schedule during the murder.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Hugo Vane",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: evening",
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
        "delivery_method": "Witness statements"
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
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_culprit_direct_dr_mallory_finch",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
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
        "delivery_method": "Fingerprints on the clock"
      },
      {
        "clue_id": "clue_mid_2",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_mid_3",
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
    "summary": "A traveling journalist grappling with her past while uncovering a murder mystery at a seaside hotel.",
    "publicPersona": "Charming and perceptive, known for her insightful articles on social issues.",
    "privateSecret": "Struggles with guilt over a past relationship that ended abruptly.",
    "motiveSeed": "Drawn to the hotel for an article on post-war recovery, she finds herself in the middle of a murder investigation.",
    "motiveStrength": "strong",
    "alibiWindow": "arrived at the hotel two days prior to the murder",
    "accessPlausibility": "easy",
    "stakes": "Unraveling the truth will help her cope with her personal demons.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with a measured cadence, often punctuating her observations with a wry smile. She has a tendency to ask rhetorical questions, drawing her listener into her reflections.",
    "signatureTic": "‘What’s the story here?’",
    "internalConflict": "Haunted by the guilt of her past relationship, she fears that her pursuit of truth might lead her to uncover more than she bargained for.",
    "personalStakeInCase": "The case represents a chance for Eleanor to confront her past mistakes and perhaps find redemption in the truth.",
    "paragraphs": [
      "Eleanor Voss arrived at the grand art deco hotel with the intention of crafting a piece that would shine a light on the post-war recovery of seaside communities. She had envisioned tranquil days filled with interviews and sun-drenched beaches, not the shadow of murder looming over her. Yet, as she stepped into the lavish lobby, she felt an unsettling tension in the air, as if the very walls held secrets too heavy to bear. Her charm often disarmed those around her, allowing her to dig deeper into their lives, but now she found herself on the other side of the inquiry, thrust into a role she had not anticipated.",
      "For Eleanor, the hotel was a refuge and a prison, a place where her past collided with the present. The guilt of a relationship that had ended in betrayal weighed on her, and the murder felt like a cruel twist of fate. As she navigated the social circles of the hotel, she couldn’t shake the feeling that the truth behind the murder could mirror her own failures. Every conversation became a potential revelation, every glance a reminder of her own buried secrets. She had always sought to uncover the truth in others, but now she was terrified of what the truth might reveal about herself.",
      "Her journalistic instincts kicked in, driving her to investigate the murder with a fervor that surprised even her. Each suspect offered a glimpse into their lives, but Eleanor was not merely an observer; she was a participant in this dark drama. As she gathered clues, she also gathered the courage to confront her own past. The stakes were high—unraveling the truth behind the murder could lead to her own redemption. She had to know if she could face the ghosts of her past and still emerge intact.",
      "In this grand hotel filled with pretense and glamour, Eleanor discovered that the path to truth is often fraught with danger. Each step closer to the murderer also brought her closer to her own reckoning. With every article she wrote, she hoped to weave her personal narrative into the larger tapestry of recovery and healing. The murder investigation was no longer just a story; it was a chance to reclaim her voice and perhaps, in the process, discover what truly mattered to her."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "A dedicated physician with a hidden past that threatens to unravel her career and reputation.",
    "publicPersona": "Respected doctor dedicated to her patients, especially those traumatized by the war.",
    "privateSecret": "Involved in an affair with the victim, which she wishes to keep hidden.",
    "motiveSeed": "Fear of the affair being exposed, which could ruin her career and reputation.",
    "motiveStrength": "moderate",
    "alibiWindow": "was in the hospital at the time of the murder, but her records are unverified",
    "accessPlausibility": "possible",
    "stakes": "Her career is at risk, and she may lose everything if the affair comes to light.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.3,
    "speechMannerisms": "Mallory speaks with a gentle, soothing tone, often using medical jargon that she tries to simplify for her audience. She has a habit of apologizing when she feels she has overstepped, and her laughter is often tinged with nervousness.",
    "signatureTic": "‘I’m afraid I can’t divulge too much.’",
    "internalConflict": "Dr. Finch feels torn between her professional duties and the personal consequences of her hidden affair, fearing that exposure would destroy her life’s work.",
    "personalStakeInCase": "The murder investigation is a threat to her career, and she must navigate her way through the chaos without losing everything she has built.",
    "paragraphs": [
      "Dr. Mallory Finch was known as a healer in a world that had seen too much suffering. Her patients revered her for her dedication, especially the war-torn souls who wandered into her practice seeking solace. Yet, beneath her calm exterior lay a tempest of fear and regret. The affair with Hugo Vane was a mistake, one that could cost her everything if it came to light. As the news of his murder spread like wildfire through the hotel, Mallory felt the walls closing in around her, suffocating her with the weight of her secrets.",
      "Every interaction with the other guests became a tightrope walk, balancing her facade of professionalism with the anxiety that gnawed at her insides. She had been in the hospital during the murder, but the unverified records left her vulnerable to suspicion. The very thought of being questioned about her whereabouts sent a shiver down her spine. Mallory often found herself apologizing for her silence, a nervous habit that did little to assuage her growing dread. 'I’m afraid I can’t divulge too much,' she would say, but the truth was she feared what would happen if she did.",
      "As the investigation unfolded, Mallory's mind raced with the consequences of her actions. The thought of a scandal threatened to overshadow her medical career, and the idea of losing her patients—the very people she had dedicated her life to—was unbearable. She had always been the pillar of strength for others, but now she felt like a house of cards, ready to collapse under the weight of her own decisions. Each day brought new challenges, and every moment spent in the hotel felt like a countdown to her undoing.",
      "In a world where reputation often mattered more than truth, Mallory found herself at a crossroads. Would she protect her career at all costs, or would she find the courage to confront her past? As the investigation drew closer to uncovering the truth, she realized that her fate was intertwined with Hugo’s, and perhaps, just perhaps, the truth could set her free. But at what cost?"
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "A retired naval officer with a tarnished honor, grappling with his past and the weight of betrayal.",
    "publicPersona": "A stern but fair figure, known for his war service and community leadership.",
    "privateSecret": "Harbors resentment toward the victim for an earlier betrayal in their shared military past.",
    "motiveSeed": "Victim's actions could expose secrets from their past that Ivor would rather keep buried.",
    "motiveStrength": "strong",
    "alibiWindow": "Claims to have been on a long walk after dinner, with no witnesses.",
    "accessPlausibility": "easy",
    "stakes": "His honor and reputation are at stake; being exposed could ruin him.",
    "humourStyle": "blunt",
    "humourLevel": 0.4,
    "speechMannerisms": "Ivor speaks in a deep, commanding voice, often using military jargon and direct language. His sentences are clipped, reflecting his no-nonsense attitude, but he occasionally allows a dry remark to slip through.",
    "signatureTic": "‘In my experience, the truth is never simple.’",
    "internalConflict": "Ivor struggles with the resentment he feels towards the victim and the fear that his own past mistakes will come to light, tarnishing his legacy.",
    "personalStakeInCase": "The murder investigation threatens to expose his past betrayals, and he must confront what he has long tried to forget.",
    "paragraphs": [
      "Captain Ivor Hale stood tall, a relic of a bygone era where honor and duty reigned supreme. His presence commanded respect, yet behind the stern facade lay a man grappling with the ghosts of his past. The betrayal by Hugo Vane, a fellow officer, had left scars that ran deep, and now, with Vane dead, Ivor found himself ensnared in a web of suspicion. The irony was not lost on him; the very man he had resented was now the catalyst for his own potential downfall.",
      "As the investigation unfolded, Ivor felt the pressure mounting. He claimed to have taken a long walk after dinner, a statement that rang hollow without witnesses to back him up. The thought of being scrutinized, of having his past laid bare for all to see, sent a chill down his spine. 'In my experience, the truth is never simple,' he would mutter, a bitter acknowledgment of the complexities of loyalty and betrayal. The burden of his secrets weighed heavily on his shoulders, threatening to crush the honor he had fought so hard to uphold.",
      "Ivor’s interactions with the other suspects were laced with tension, each word a potential landmine. He was accustomed to leading men into battle, but navigating this social battlefield was a different challenge entirely. The stakes were high; his reputation was on the line, and the fear of exposure loomed like a dark cloud overhead. He had spent his life building a legacy, only to see it threatened by the very man he had once called a friend.",
      "As the truth began to unravel, Ivor realized that he could no longer hide from his past. The investigation was a reckoning, a chance to confront the choices he had made and the man he had become. In the end, he knew that redemption would require more than just bravery; it would demand facing the truth, no matter how painful it might be."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "An aspiring actress caught in a web of financial troubles and desperate dreams, facing the consequences of her choices.",
    "publicPersona": "A vibrant young woman eager to make her mark in the world of theatre.",
    "privateSecret": "Desperate for financial security, she has been involved in shady dealings.",
    "motiveSeed": "Victim was about to expose her financial troubles, which would ruin her chances at stardom.",
    "motiveStrength": "moderate",
    "alibiWindow": "Claims to have been rehearsing in her room, but no one can confirm it.",
    "accessPlausibility": "possible",
    "stakes": "Her dreams of becoming a star are jeopardized if her secrets are revealed.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Beatrice speaks with an animated and expressive tone, often using dramatic pauses and theatrical gestures. She has a tendency to exaggerate her emotions, making her seem larger than life.",
    "signatureTic": "‘It’s all so terribly dramatic, isn’t it?’",
    "internalConflict": "Beatrice is torn between her aspirations for fame and the lengths she has gone to achieve her dreams, fearing that exposure will shatter her illusions.",
    "personalStakeInCase": "The murder investigation threatens to expose her shady dealings, jeopardizing her aspirations and forcing her to confront her choices.",
    "paragraphs": [
      "Beatrice Quill was a whirlwind of ambition, a dreamer in a world that often crushed the hopes of the naïve. The grand hotel was her stage, and she longed for the spotlight to illuminate her path to stardom. Yet, beneath the vibrant exterior lay a woman grappling with the harsh realities of financial insecurity. Her desperation had led her down a dark path of shady dealings, and now, with the murder of Hugo Vane, her carefully constructed facade was at risk of crumbling.",
      "As she flitted from one gathering to another, Beatrice couldn’t shake the feeling that the walls were closing in. The victim had threatened to expose her financial troubles, and she felt as if the very air was charged with danger. 'It’s all so terribly dramatic, isn’t it?' she would say with a forced laugh, masking her anxiety with sardonic humor. Every conversation felt like a performance, and she was terrified of forgetting her lines.",
      "Her alibi was flimsy at best—claiming to have been rehearsing in her room, but with no one to corroborate her story, Beatrice was left vulnerable. The stakes were higher than ever; her dreams of becoming a star hinged on her ability to maintain the illusion. She often found herself rehearsing her responses in her head, imagining the worst-case scenarios that could unfold if her secrets were revealed. The thought of being exposed was a nightmare that haunted her, and yet, the allure of success kept her pushing forward.",
      "In the midst of the investigation, Beatrice faced a crucial decision. Would she continue to deceive those around her in pursuit of her dreams, or would she find the courage to embrace honesty? The murder had become a catalyst for self-reflection, forcing her to confront the consequences of her choices. As the truth threatened to unravel her carefully curated life, Beatrice knew that she had to decide what kind of actress she truly wanted to be—one who lived in the shadows or one who stepped into the light."
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "A charming socialite with a penchant for manipulation, facing the fallout of her calculated relationships.",
    "publicPersona": "Charming and well-connected, known for her lavish parties and social influence.",
    "privateSecret": "Has been manipulating relationships for her gain, including with the victim.",
    "motiveSeed": "The victim threatened to expose her manipulations, risking her social standing.",
    "motiveStrength": "moderate",
    "alibiWindow": "Was seen socializing at a different party, but no one can verify her exact whereabouts.",
    "accessPlausibility": "unlikely",
    "stakes": "Her entire social status hangs by a thread; exposure would be catastrophic.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.5,
    "speechMannerisms": "Sylvia speaks with a smooth, melodic tone, often using flattery and veiled threats. She has a way of making her words sound sweet while hiding sharp edges beneath.",
    "signatureTic": "‘Oh, darling, you must understand...’",
    "internalConflict": "Sylvia grapples with the consequences of her manipulations, fearing that her carefully constructed social empire could come crashing down.",
    "personalStakeInCase": "The investigation threatens to reveal her manipulative nature, jeopardizing her social standing and influence.",
    "paragraphs": [
      "Sylvia Trent was the epitome of charm, a socialite who navigated the treacherous waters of high society with grace and poise. Her lavish parties were the talk of the town, and she reveled in her influence over those around her. Yet, beneath the polished surface lay a woman who thrived on manipulation, weaving intricate webs that ensnared her unsuspecting prey. The murder of Hugo Vane had thrown her carefully orchestrated life into chaos, and Sylvia felt the walls closing in.",
      "She had been seen socializing at another party during the time of the murder, but the lack of verification left her vulnerable to scrutiny. 'Oh, darling, you must understand…’ she would say with a disarming smile, masking her unease with polite savagery. The threat of exposure loomed large over her, and the idea that her manipulations could be laid bare sent a shiver down her spine. Sylvia knew that her social status was precarious, built on a foundation of deceit that could crumble at any moment.",
      "As the investigation unfolded, Sylvia found herself embroiled in a dangerous game of cat and mouse. Each suspect was a potential ally or enemy, and she had to navigate the shifting alliances carefully. The stakes were high; her entire empire hung by a thread, and the thought of being exposed was a nightmare she could scarcely bear. She had spent years cultivating her image, and the idea of losing it all felt like a death sentence.",
      "In the depths of her mind, Sylvia knew that the murder investigation was not just about Hugo; it was a reflection of her own choices. The consequences of her manipulations had come home to roost, and she was left to ponder whether redemption was even possible. As she danced through the social landscape, she realized that the truth was a force that could either liberate her or destroy her, and she was determined to control the narrative at any cost."
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "An enigmatic author whose controversial works threatened to expose the secrets of the elite.",
    "publicPersona": "An enigmatic author known for his controversial novels about war and society.",
    "privateSecret": "Had documents that revealed secrets about several influential figures at the hotel.",
    "motiveSeed": "His writings threatened to expose the darker sides of the suspects, including potential criminal activities.",
    "motiveStrength": "compelling",
    "alibiWindow": "N/A - Deceased",
    "accessPlausibility": "possible",
    "stakes": "His death represents the loss of potential revelations that could change lives.",
    "humourStyle": "none",
    "humourLevel": 0,
    "speechMannerisms": "Hugo spoke with a deliberate and thoughtful cadence, often pausing to consider his words. His tone was serious, and he rarely indulged in humor, preferring to maintain an air of mystery.",
    "signatureTic": "‘The truth is a double-edged sword.’",
    "internalConflict": "Though Hugo was confident in his writing, he grappled with the moral implications of exposing the truths he uncovered, questioning whether the revelations would ultimately do more harm than good.",
    "personalStakeInCase": "His death raised questions about the secrets he held, and the implications of his writings could change the lives of many, including those who wished to silence him.",
    "paragraphs": [
      "Hugo Vane was an enigma wrapped in the allure of controversy, a writer whose words held the power to illuminate the darkest corners of society. His novels, rife with critique and reflection, challenged the status quo, and he reveled in the discomfort they caused among the elite. Yet, beneath the surface of his literary prowess lay a man burdened by the weight of his revelations. Hugo held documents that could expose the hidden truths of several influential figures at the hotel, a secret that ultimately cost him his life.",
      "His public persona was that of a confident author, but internally, Hugo struggled with the moral implications of his work. He often pondered whether the truths he uncovered would serve the greater good or simply sow discord among those who wielded power. 'The truth is a double-edged sword,' he would say, a reflection of his conflicted nature. Each word he penned was a step into uncharted territory, and as he approached the precipice of exposure, he felt the pressure mounting, knowing that the stakes were higher than he had ever imagined.",
      "In the days leading up to his murder, Hugo had sensed the growing tension around him. The whispers of discontent among the guests were palpable, and he understood that his writings threatened to disrupt the delicate balance of power. As the investigation unfolded, the secrets he held became a double-edged sword, cutting through the facades of those who surrounded him. The irony was not lost on him; the very people who once praised his work were now potential enemies, willing to go to great lengths to protect their reputations.",
      "Hugo’s death served as a grim reminder of the cost of truth, a sacrifice that would resonate far beyond the confines of the hotel. His writings, though silenced, held the potential to reveal the darker sides of the suspects, and as the investigation progressed, it became clear that his legacy would live on. The truths he sought to expose would not die with him; instead, they would emerge from the shadows, forcing those who had silenced him to confront their own demons."
    ],
    "order": 6
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "The Crestview Hotel",
    "type": "Seaside hotel",
    "place": "Brighton",
    "country": "England",
    "summary": "A grand art deco hotel overlooking the tumultuous sea, where luxury meets the austerity of wartime.",
    "visualDescription": "The Crestview Hotel stands proud with its sweeping curves and geometric designs, an opulent façade of white stucco and polished chrome. Inside, a lavish lobby boasts a grand chandelier that casts a soft glow over plush carpets and elegant furnishings, while large windows frame stormy sea views.",
    "atmosphere": "A palpable tension hangs in the air, a mingling of elegance and unease amidst the whispers of war.",
    "paragraphs": [
      "The Crestview Hotel, a beacon of 1940s opulence, rises majestically above the crashing waves of Brighton's shore. Its art deco design, with sweeping lines and intricate detailing, reflects the glamour of a bygone era, yet the weight of recent wartime events looms heavily over its polished surfaces. Guests, draped in their finest, navigate the grand lobby, their laughter and chatter a fragile mask for the underlying tension and suspicion that permeates the air.",
      "The scent of salt and dampness creeps through the grand windows, mingling with the rich aroma of freshly brewed tea and the faint whiff of cigar smoke. The low hum of a radio broadcasting updates from the front lines serves as a constant reminder of the world outside, while the creaking of floorboards and the rustling of newspapers punctuate the otherwise hushed conversations. Here, in this blend of luxury and austerity, every glance, every gesture is laden with meaning, as guests harbor secrets behind their polished façades.",
      "As the day wears on, the hotel transforms; shadows deepen and the flickering glow of candlelight dances across the walls. The sound of rain tapping against the windows creates a rhythmic backdrop to the whispered confessions and veiled accusations exchanged over cocktails in the dimly lit lounge. The atmosphere thickens with anticipation, as guests find themselves unwittingly drawn into a web of intrigue, where the slightest misstep could reveal a hidden truth.",
      "The Crestview Hotel, with its narrow hallways and winding staircases, offers both refuge and entrapment. Staff-only areas remain shrouded in mystery, their doors marked with subtle warnings meant to deter the curious. Yet the allure of the unknown beckons, as guests navigate the labyrinthine corridors, each turn leading them closer to revelations that could alter the course of their lives forever."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "Overcast with occasional rain, typical for a coastal setting.",
    "timeFlow": "Three days of mounting tension and unfolding secrets.",
    "mood": "Tense due to recent wartime events and lingering suspicions among guests.",
    "eraMarkers": [
      "art deco furnishings and design",
      "radio broadcasts of wartime news",
      "rationed petrol for travel",
      "increased roles for women in the workforce"
    ],
    "sensoryPalette": {
      "dominant": "Tension-laden whispers and muted elegance",
      "secondary": [
        "Crisp sea air with a hint of dampness",
        "Faint echoes of laughter and clinking glasses"
      ]
    },
    "paragraphs": [
      "The atmosphere inside the Crestview Hotel is thick with unspoken words and furtive glances. The art deco elegance, once a symbol of glamour, now serves as a backdrop for a gathering of souls haunted by the shadows of war. The overcast sky looms outside, casting a grey pallor over the shimmering ocean, where waves crash violently against the rocky shore, mirroring the turmoil within the hotel's walls.",
      "Within this grand seaside retreat, every sound seems amplified; the soft rustle of silk dresses, the distant crackle of the radio broadcasting news from the front, and the muffled conversations that echo through the corridors create an uneasy symphony. Guests tread carefully, their every move scrutinized, as the weight of their secrets presses heavily upon them, threatening to unravel the delicate fabric of their lives."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Grand Dining Room",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "An expansive room with high ceilings and ornate chandeliers, tables elegantly set with fine china and crystal glassware, overlooking the tumultuous sea.",
      "sensoryDetails": {
        "sights": [
          "gleaming silverware on linen tablecloths",
          "chandelier crystals refracting light",
          "stormy sea visible through tall windows",
          "art deco murals depicting nautical scenes",
          "shadows dancing on the polished floor"
        ],
        "sounds": [
          "clinking of glasses",
          "soft murmurs of conversation",
          "distant thunder rumbling",
          "the rustle of napkins",
          "the creaking of the wooden floor"
        ],
        "smells": [
          "freshly baked bread",
          "sea salt in the air",
          "roasted meat and vegetables",
          "a hint of cigar smoke",
          "polished wood and wax"
        ],
        "tactile": [
          "smooth linen under fingertips",
          "cool glassware against the skin",
          "hard wooden chairs",
          "the weight of silver cutlery",
          "the chill of the ocean breeze"
        ]
      },
      "accessControl": "Guests dine here during scheduled meals; staff have access for service only; private events require prior approval.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light filtering through clouds",
            "raindrops streaking the windows",
            "dimly lit tables awaiting breakfast",
            "muffled reflections in wet glass",
            "empty chairs around the tables"
          ],
          "sounds": [
            "steady rain drumming on the roof",
            "soft thud of footsteps on carpet",
            "the distant clatter of kitchenware",
            "whispers of early risers",
            "the ticking of an old clock"
          ],
          "smells": [
            "wet earth and sea air",
            "freshly brewed coffee",
            "baking pastries in the kitchen",
            "the scent of damp wood",
            "the faintest hint of mildew"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat light casting long shadows",
            "distant waves crashing against rocks",
            "clouds looming ominously outside",
            "faint outlines of guests in conversation"
          ],
          "sounds": [
            "silence punctuated by distant thunder",
            "the creak of old timbers",
            "the rustle of newspaper pages",
            "soft laughter from a nearby table",
            "the clatter of cutlery on plates"
          ],
          "smells": [
            "the rich aroma of tea",
            "scent of damp wool",
            "faint notes of floral arrangements",
            "the mustiness of old books",
            "the tang of salt in the air"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight flickering on tables",
            "golden light spilling from windows",
            "the last rays of sun over the ocean",
            "guests dressed for dinner",
            "glimmering reflections on glass"
          ],
          "sounds": [
            "the soft strumming of a guitar",
            "the low hum of conversation",
            "the distant crash of waves",
            "the clinking of ice in glasses",
            "the crackle of a fireplace"
          ],
          "smells": [
            "scent of grilled fish",
            "the sweetness of dessert pastries",
            "the aroma of aged whiskey",
            "freshly cut flowers",
            "the faint smell of smoke from a fire"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Grand Dining Room, with its high ceilings and ornate chandeliers, serves as the heart of the Crestview Hotel, where guests gather for meals amidst the backdrop of crashing waves. The elegant decor, adorned with art deco murals depicting nautical themes, creates an atmosphere of sophistication that contrasts sharply with the tension simmering beneath the surface. Here, the clinking of glasses and soft murmurs of conversation mingle with the distant rumbling of thunder, as the storm outside mirrors the brewing unrest among the guests.",
        "As the evening approaches, the room transforms; candlelight flickers across polished surfaces, casting playful shadows that dance on the walls. The scent of grilled fish wafts through the air, mingling with the aroma of aged whiskey, drawing guests closer together around their tables. Yet, amidst the laughter and clinking of ice in glasses, an undercurrent of suspicion flows, as whispered conversations hint at secrets, betrayals, and the looming presence of danger."
      ]
    },
    {
      "id": "library",
      "name": "The Library",
      "type": "interior",
      "purpose": "Research and clue discovery",
      "visualDetails": "A cozy room lined with dark wooden shelves filled with leather-bound books, a large bay window overlooking the ocean, and plush armchairs arranged around a small table.",
      "sensoryDetails": {
        "sights": [
          "dust motes dancing in sunlight",
          "faded maps and nautical charts",
          "a crackling fireplace in the corner",
          "rich mahogany furniture"
        ],
        "sounds": [
          "the rustle of pages turning",
          "firewood snapping in the hearth",
          "distant seagulls calling",
          "the ticking of a grandfather clock",
          "soft footsteps on the carpet"
        ],
        "smells": [
          "musty pages of old books",
          "wood smoke from the fireplace",
          "the scent of polished wood",
          "freshly brewed tea",
          "the tang of salt air"
        ],
        "tactile": [
          "smooth leather book covers",
          "soft woolen throws on chairs",
          "the coolness of marble tabletops",
          "worn carpet underfoot",
          "the warmth of a fire"
        ]
      },
      "accessControl": "Access limited to guests during library hours; staff may enter for maintenance; private readings require prior arrangement.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops tracing patterns on the window",
            "dim light filtering through clouds",
            "bookshelves lined with damp volumes",
            "soft glimmers of light on wet surfaces",
            "the flicker of candlelight"
          ],
          "sounds": [
            "steady patter of rain",
            "the crackle of a fire",
            "the rustle of a newspaper",
            "the distant sound of thunder",
            "the quiet sigh of a chair"
          ],
          "smells": [
            "freshly brewed coffee",
            "the scent of damp paper",
            "the aroma of hot chocolate",
            "wood smoke and ash",
            "the tang of saltwater"
          ],
          "mood": "introspective"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows creeping across the floor",
            "the flicker of a candle flame",
            "dusty books illuminated by weak light",
            "the outline of a figure in the bay window",
            "the distant horizon shrouded in mist"
          ],
          "sounds": [
            "the creak of floorboards",
            "the flutter of pages",
            "the distant hum of conversation",
            "the ticking of the clock",
            "the rustle of fabric"
          ],
          "smells": [
            "the musty scent of old books",
            "the faint aroma of tea",
            "the tang of leather bindings",
            "the scent of polished wood",
            "the hint of mildew"
          ],
          "mood": "reflective"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm glow of the fireplace",
            "sunset casting hues on the water",
            "shadows stretching across the room",
            "the sparkle of glass and silver",
            "the silhouette of a reader in an armchair"
          ],
          "sounds": [
            "the crackling of the fire",
            "soft laughter from the lounge",
            "the whisper of pages turning",
            "the distant sound of waves",
            "the ticking of a clock"
          ],
          "smells": [
            "the rich aroma of aged whiskey",
            "the scent of leather and wood",
            "freshly brewed tea",
            "the faint hint of tobacco smoke",
            "the coolness of the evening air"
          ],
          "mood": "contemplative"
        }
      ],
      "paragraphs": [
        "The Library, with its dark wooden shelves and leather-bound tomes, serves as a sanctuary for those seeking knowledge or refuge from the storm outside. A large bay window offers a breathtaking view of the turbulent sea, while the flickering crackle of the fireplace creates a cozy warmth that invites guests to linger. Here, the scent of musty pages and polished wood fills the air, mingling with the faint aroma of freshly brewed tea, as readers lose themselves in the stories of the past, unaware of the mysteries brewing in the present.",
        "As guests settle into plush armchairs, the quiet rustle of pages turning and the soft ticking of a grandfather clock create a serene backdrop for reflection. Yet, beneath this tranquil surface lies an undercurrent of tension; whispers of secrets and hidden truths echo in the stillness, as the library transforms into a stage for intrigue, where every book holds the potential for revelation."
      ]
    },
    {
      "id": "lounge",
      "name": "The Lounge",
      "type": "interior",
      "purpose": "Social gathering and clue exchange",
      "visualDetails": "A lavishly decorated room with deep armchairs, velvet drapes, and a grand piano in the corner, offering a view of the ocean through large windows.",
      "sensoryDetails": {
        "sights": [
          "plush velvet drapes in rich hues",
          "a grand piano gleaming under soft light",
          "ornate light fixtures casting warm glows",
          "guests in elegant attire",
          "the ocean's waves visible through windows"
        ],
        "sounds": [
          "the soft melody from the piano",
          "murmurs of conversation",
          "the crackle of a fire",
          "the clinking of glasses",
          "the rustle of evening gowns"
        ],
        "smells": [
          "the scent of fine cigars",
          "freshly brewed coffee",
          "the aroma of perfume",
          "the tang of salt air",
          "the warmth of polished wood"
        ],
        "tactile": [
          "soft velvet upholstery",
          "cool surface of glassware",
          "the warmth of a fireplace",
          "the weight of a heavy book",
          "the smoothness of polished wood"
        ]
      },
      "accessControl": "Open to all guests during operating hours; private gatherings require prior booking; staff access during service hours only.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops cascading down the windows",
            "dim light filtering through clouds",
            "empty chairs awaiting guests",
            "soft reflections on polished surfaces",
            "the flicker of candlelight"
          ],
          "sounds": [
            "steady rain pattering on the roof",
            "the distant crash of waves",
            "the creak of furniture adjusting",
            "the quiet murmuring of early risers",
            "the rustle of newspapers"
          ],
          "smells": [
            "the scent of wet earth",
            "freshly brewed tea",
            "the aroma of toasted bread",
            "the smell of damp fabric",
            "the tang of saltwater"
          ],
          "mood": "melancholic"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows creeping across the floor",
            "the glow of table lamps",
            "guests gathered in small groups",
            "the flicker of candlelight",
            "the outline of the ocean beyond"
          ],
          "sounds": [
            "muffled laughter from a nearby table",
            "the soft melody of the piano",
            "the crackle of firewood",
            "the rustle of fabric",
            "the distant sound of thunder"
          ],
          "smells": [
            "the aroma of spiced cider",
            "the scent of polished wood",
            "the faint smell of cigar smoke",
            "freshly brewed coffee",
            "the tang of salt air"
          ],
          "mood": "suspicious"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight casting playful shadows",
            "the glow of the ocean at dusk",
            "elegantly dressed guests",
            "the sparkle of glassware",
            "the reflection of stars in the windows"
          ],
          "sounds": [
            "the soft strumming of a guitar",
            "laughter mingling with conversation",
            "the crackle of the fire",
            "the clinking of glasses",
            "the sound of waves lapping at the shore"
          ],
          "smells": [
            "the scent of fine wine",
            "the aroma of grilled seafood",
            "the sweetness of dessert pastries",
            "the tang of salt air",
            "the warmth of wood smoke"
          ],
          "mood": "festive"
        }
      ],
      "paragraphs": [
        "The Lounge, with its sumptuous décor and elegant furnishings, serves as a social hub for the Crestview Hotel's guests. Plush velvet drapes frame large windows that provide a breathtaking view of the ocean, where waves crash against the shore, their rhythmic sounds blending with the soft melodies emanating from the grand piano in the corner. It is a space where laughter and conversation flow as freely as the drinks, yet beneath the surface, tension simmers, as guests exchange furtive glances and whispered secrets.",
        "As the evening deepens, the Lounge transforms into a haven of warmth and camaraderie, with the crackle of the fireplace inviting guests to settle in. The rich aromas of fine cigars and freshly brewed coffee mingle in the air, while the sound of glasses clinking punctuates the soft music. Yet, amidst the revelry, a sense of unease pervades—a reminder that the shadows of war and suspicion linger just beyond the door."
      ]
    },
    {
      "id": "staff_quarters",
      "name": "The Staff Quarters",
      "type": "interior",
      "purpose": "Staff access and operations",
      "visualDetails": "A modest area with simple furnishings, a communal dining table, and a small kitchen, located away from guest areas.",
      "sensoryDetails": {
        "sights": [
          "worn wooden tables and chairs",
          "faded wallpaper peeling at the edges",
          "the glow of dim overhead lights",
          "the small kitchen area with basic appliances"
        ],
        "sounds": [
          "clattering dishes and cutlery",
          "muffled conversations",
          "the hum of a refrigerator",
          "the creaking of floorboards",
          "the distant sound of waves"
        ],
        "smells": [
          "the scent of cooking vegetables",
          "the aroma of fresh bread",
          "the tang of cleaning supplies",
          "the mustiness of old furniture",
          "the faint smell of sea air"
        ],
        "tactile": [
          "rough wooden surfaces",
          "the chill of metal utensils",
          "the softness of a worn blanket",
          "the coolness of tiled floors",
          "the weight of a heavy door"
        ]
      },
      "accessControl": "Restricted to staff only; guests prohibited; access during working hours only.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "dim light filtering through rain-streaked windows",
            "wet shoes lined by the door",
            "the glow of the stove",
            "the outline of staff preparing breakfast"
          ],
          "sounds": [
            "the steady drip of rain",
            "the sizzle of frying eggs",
            "the clattering of pans",
            "the distant sound of thunder",
            "the quiet chatter of staff"
          ],
          "smells": [
            "the scent of smoky bacon",
            "the aroma of brewing coffee",
            "the tang of wet earth outside",
            "the mustiness of old wood",
            "the hint of citrus from cleaning supplies"
          ],
          "mood": "busy"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "faded light casting long shadows",
            "staff gathered around the dining table",
            "the clutter of papers on the counter",
            "the dim glow of the overhead lights",
            "the outline of guests outside"
          ],
          "sounds": [
            "the rustle of paper",
            "the soft hum of conversation",
            "the distant crash of waves",
            "the clattering of dishes being washed",
            "the creak of old furniture"
          ],
          "smells": [
            "the scent of fresh bread cooling",
            "the aroma of vegetable soup",
            "the tang of cleaning agents",
            "the mustiness of aged wood",
            "the faint hint of salt in the air"
          ],
          "mood": "tense"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "the glow of lights from the dining room",
            "shadows moving across the walls",
            "staff preparing for the evening rush",
            "the sparkle of clean dishes",
            "the outline of the ocean beyond"
          ],
          "sounds": [
            "the distant sound of laughter from guests",
            "the hum of kitchen appliances",
            "the rustle of staff uniforms",
            "the soft echo of footsteps"
          ],
          "smells": [
            "the aroma of simmering stew",
            "the scent of freshly baked bread",
            "the tang of cleaning supplies",
            "the warmth of cooked vegetables",
            "the hint of salt from the sea"
          ],
          "mood": "anticipatory"
        }
      ],
      "paragraphs": [
        "The Staff Quarters, a modest area tucked away from the opulence of the guest areas, reveals the behind-the-scenes life of the hotel staff. With worn wooden tables and fading wallpaper, it is a space filled with the hum of daily operations, where the clatter of dishes and muted conversations create a rhythm all their own. Here, the scent of cooking vegetables mingles with the tang of cleaning supplies, a reminder of the work that keeps the hotel running smoothly even as tensions rise among the guests.",
        "As evening approaches, the atmosphere shifts; staff members gather around the communal dining table, sharing stories and concerns over the day’s events. The distant sound of laughter from the guests echoes through the walls, a stark contrast to the quiet determination of the staff as they prepare for the evening rush. In this space, secrets are whispered, alliances are forged, and the pulse of the hotel beats steadily on, even as the world outside remains fraught with uncertainty."
      ]
    }
  ],
  "note": "",
  "cost": 0.0031473007500000005,
  "durationMs": 71741
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1944,
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
      "cool coastal breezes"
    ],
    "daylight": "Short days with twilight settling in early, around 4:30 PM.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, after dinner and drinks.",
    "holidays": [
      "Thanksgiving (fourth Thursday) approaching"
    ],
    "seasonalActivities": [
      "strolling along the beach despite the chill",
      "gathering for indoor games in the hotel lounge",
      "attending special wartime charity events"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "double-breasted suits",
        "tailored dress shirts with wider collars",
        "wool overcoats"
      ],
      "casual": [
        "tweed blazers",
        "knit sweaters",
        "khaki trousers"
      ],
      "accessories": [
        "fedora hats",
        "leather gloves",
        "silk ties"
      ]
    },
    "womensWear": {
      "formal": [
        "tea-length dresses with cinched waists",
        "satin evening gowns",
        "tailored suits with peplum jackets"
      ],
      "casual": [
        "cardigans over blouses",
        "A-line skirts",
        "wide-legged trousers"
      ],
      "accessories": [
        "string of pearls",
        "felt hats",
        "fur stoles"
      ]
    },
    "trendsOfTheMoment": [
      "utilitarian clothing due to fabric rationing",
      "bold prints and colors in evening wear",
      "influence of Hollywood glamour"
    ],
    "socialExpectations": [
      "men are expected to be chivalrous and protective",
      "women are taking on more public roles",
      "formal dining etiquette is strictly observed"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "D-Day victory results leading to shifting front lines in Europe",
      "increased discussions around the post-war reconstruction plan",
      "news of the Battle of Leyte Gulf impacting naval strategy"
    ],
    "politicalClimate": "Tension remains high as World War II nears its conclusion, with shifting alliances and discussions of peace terms beginning to surface.",
    "economicConditions": "Post-war rationing continues to affect daily life; shortages of various goods create a black market for luxuries.",
    "socialIssues": [
      "displacement of returning soldiers",
      "integration of women into the workforce",
      "racial tensions rising as civil rights discussions begin"
    ],
    "internationalNews": [
      "news of the Yalta Conference preparations",
      "reports of liberation efforts in Eastern Europe"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Bing Crosby's 'I'll Be Home for Christmas'",
        "The Andrews Sisters' 'Boogie Woogie Bugle Boy'",
        "Frank Sinatra's 'I'll Never Smile Again'"
      ],
      "films": [
        "'Double Indemnity'",
        "'Meet Me in St. Louis'",
        "'Going My Way'"
      ],
      "theater": [
        "'Oklahoma!'",
        "'The Glass Menagerie'",
        "'The Phantom of the Opera'"
      ],
      "radio": [
        "The Jack Benny Program",
        "The Shadow",
        "Suspense"
      ]
    },
    "literature": {
      "recentPublications": [
        "'The Thin Man' by Dashiell Hammett",
        "'Brave New World' by Aldous Huxley",
        "'The Naked and the Dead' by Norman Mailer"
      ],
      "popularGenres": [
        "detective fiction",
        "war novels",
        "romantic dramas"
      ]
    },
    "technology": {
      "recentInventions": [
        "first commercially available radar systems",
        "advancements in synthetic rubber",
        "early computers for military use"
      ],
      "commonDevices": [
        "crystal radios",
        "phonographs",
        "early television sets with limited programming"
      ],
      "emergingTrends": [
        "increased use of radar in civilian applications",
        "growth of the film industry as a form of escapism",
        "rise of the home front culture influenced by war efforts"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Cup of coffee: six pence",
        "Movie ticket: one shilling"
      ],
      "commonActivities": [
        "attending community dances and socials",
        "visiting local markets for rationed goods",
        "playing board games in the evenings"
      ],
      "socialRituals": [
        "formal dinner gatherings",
        "afternoon tea parties",
        "weekly church services"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "increased sympathy for working-class struggles",
      "a sense of pride in collective wartime efforts"
    ],
    "gender": [
      "growing acceptance of women in the workforce",
      "traditional gender roles still prevalent but under scrutiny",
      "men returning from war often face challenges in adjusting to roles"
    ],
    "race": [
      "racial segregation still common but beginning to face resistance",
      "emerging discussions on civil rights and equality"
    ],
    "generalNorms": [
      "strict etiquette during formal events",
      "increased value placed on community support",
      "growing awareness of global issues due to the war"
    ]
  },
  "atmosphericDetails": [
    "The air is heavy with the scent of salt and damp earth, as the rain occasionally falls from gray clouds overhead.",
    "The muted sounds of waves crashing against the rocky shore create a tense backdrop, while inside the hotel, whispers of gossip flicker like candle flames.",
    "The dimly lit lounge, filled with the soft glow of lamps, buzzes with nervous laughter and the clinking of glasses, punctuating the unease of recent wartime events."
  ],
  "paragraphs": [
    "In November 1944, the seaside hotel stands as a refuge yet a site of palpable tension, its guests caught in the web of a world affected by the war. The weather reflects the mood: overcast skies and the occasional rain mirror the unease among the visitors, who gather in the lounge for warmth and camaraderie. As Thanksgiving approaches, the promise of holiday festivities seems distant, overshadowed by the reality of wartime anxieties and a longing for home.",
    "Fashion choices this season echo the tumultuous times; men don tailored suits and wool overcoats, while women favor elegant tea-length dresses adorned with bold patterns, a nod to the glamour of Hollywood. Accessories such as silk ties and string pearls add a touch of sophistication to the evening's social events, as guests engage in formal dining rituals, clinging to remnants of pre-war social structures amidst the chaos.",
    "Daily life in this coastal locale carries the weight of rationing and shortages, with locals exchanging stories over cups of coffee priced at six pence. The interplay between traditional gender roles and the emerging presence of women in the workforce creates a fascinating dynamic. As guests partake in board games and community dances, the lingering effects of the war shape their interactions, imbuing every laughter with a bittersweet undertone, hinting at the unresolved complexities of their lives."
  ],
  "note": "",
  "cost": 0.0010302864,
  "durationMs": 19333
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A group of guests at a seaside hotel, bound by the shared trauma of WWII and the complexities of post-war recovery, find themselves entangled in a tense atmosphere where secrets and suspicions threaten to unravel their lives.",
  "era": {
    "decade": "1940s",
    "socialStructure": "The war has shifted class dynamics, with women stepping into roles traditionally held by men, creating a complex social landscape where loyalty and suspicion coexist."
  },
  "setting": {
    "location": "A grand, art deco seaside hotel with a view of the ocean.",
    "institution": "Seaside hotel",
    "weather": "Overcast with occasional rain."
  },
  "castAnchors": [
    "Eleanor Voss",
    "Dr. Mallory Finch",
    "Captain Ivor Hale",
    "Beatrice Quill",
    "Sylvia Trent",
    "Hugo Vane"
  ],
  "theme": "Golden Age country-house murder driven by a mechanical clock-tampering method."
}

### LOCKED_FACTS
[
  {
    "id": "clock_time",
    "value": "ten minutes past eleven",
    "description": "The clock was found showing this time, indicating tampering."
  },
  {
    "id": "watch_time",
    "value": "a quarter past nine",
    "description": "The victim's watch was stopped at this time, suggesting a different timeline."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 13,
  "countsByPlacement": {
    "early": 3,
    "mid": 9,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 12,
    "optional": 1
  },
  "redHerringCount": 0,
  "clues": [
    {
      "id": "clue_early_1",
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
      "category": "temporal"
    },
    {
      "id": "clue_late_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_culprit_direct_dr_mallory_finch",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
    },
    {
      "id": "clue_mid_3",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_late_optional_slot_1",
      "placement": "late",
      "criticality": "optional",
      "category": "behavioral"
    },
    {
      "id": "clue_fp_elimination_beatrice_quill",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_fp_elimination_sylvia_trent",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_culprit_direct_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_fp_contradiction_step_2",
      "placement": "early",
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

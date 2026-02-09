/**
 * CML 2.0 schema reference for prompts
 */

export const CML_2_0_SCHEMA_SUMMARY = `CML 2.0 Structure (Required Sections):

1. CML_VERSION: "2.0"

2. CASE:
   meta:
     title: string
     author: string
     primaryAxis: temporal | spatial | identity | behavioral | authority
     difficulty: string
     estimatedDurationMinutes: number
   
   cast:
     - name: string
       role: victim | detective | suspect | witness | culprit
       publicRole: string
       secrets?: string[]
       motive?: string
       alibi?: string
   
   culpability:
     culprit: string (name from cast)
     motive: string
     method: string
     opportunity: string
   
   surface_model:
     publicNarrative: string
     apparentMotive: string
     obviousSuspects: string[]
     misdirection: string
   
   hidden_model:
     mechanism:
       type: string
       description: string
       components: string[]
     actualConstraints:
       temporal?: object
       spatial?: object
       knowledge?: object
       physical?: object
   
   false_assumption:
     type: temporal | spatial | identity | behavioral | authority
     assumption: string
     why_believed: string
     actual_truth: string
   
   constraint_space:
     category: temporal | spatial | identity | behavioral | authority
     constraints:
       - id: string
         rule: string
         apparent_compliance: string
         actual_violation: string
   
   inference_path:
     - step: number
       observation: string
       reasoning: string
       conclusion: string
   
   discriminating_test:
     method: physical_reconstruction | timeline_analysis | forced_choice | 
             knowledge_trap | behavioral_inconsistency
     description: string
     reveals: string
     proves_guilt: string
   
   fair_play:
     all_clues_available: boolean
     load_bearing_clues_early: boolean
     no_deus_ex_machina: boolean
     detective_knowledge_public: boolean
     reader_can_solve: boolean
     solution_logical: boolean
     no_supernatural: boolean
     culprit_determinable: boolean`;

export const AXIS_TYPE_DESCRIPTIONS = `Primary Axis Types:

**temporal**: Mystery depends on when events occurred
- False assumption about timing, sequence, or duration
- Example: Clock stopped at wrong time, events happened in different order
- Discriminating test often involves timeline reconstruction

**spatial**: Mystery depends on where events occurred or who was where
- False assumption about locations, movement, or access
- Example: Room switch, hidden passage, impossible to be in two places
- Discriminating test often involves physical reconstruction

**identity**: Mystery depends on who someone really is
- False assumption about person's identity, role, or relationships
- Example: Impersonation, twin, identity swap, unknown relationship
- Discriminating test often involves knowledge trap or forced revelation

**behavioral**: Mystery depends on character psychology or social patterns
- False assumption about motives, habits, or social expectations
- Example: Unexpected behavior deviation, habit exploitation, motive mismatch
- Discriminating test often involves behavioral inconsistency proof

**authority**: Mystery depends on institutional rules or power structures
- False assumption about permissions, knowledge, or capability
- Example: False credentials, misunderstood hierarchy, rule exploitation
- Discriminating test often involves authority verification or forced choice`;

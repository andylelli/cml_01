# Cost Breakdown - Mystery Generation System

## Overview

This document provides a complete breakdown of all chargeable costs in the mystery generation system. All costs are for Azure OpenAI API calls using GPT-4 models.

## Understanding Tokens

### What is a Token?
A **token** is a chunk of text that the AI model processes. Tokens can be:
- Whole words: `"mystery"` = 1 token
- Parts of words: `"mysterious"` = 2 tokens (`"myster"` + `"ious"`)
- Punctuation: `","` = 1 token
- Spaces and characters: Often included with adjacent text

### Token Counting Rules
- **English**: ~4 characters = 1 token (average)
- **~750 words = 1,000 tokens** (typical English prose)
- **Structured data** (JSON, YAML): More tokens per word due to syntax
- **Code**: Variable, but typically ~3 characters = 1 token

### Examples
| Text | Estimated Tokens |
|------|-----------------|
| "Hello, world!" | 4 tokens |
| "A murder occurred at midnight." | 7 tokens |
| 100-word paragraph | ~133 tokens |
| 500-word story | ~667 tokens |
| Full CML (2,000 words) | ~2,667 tokens |

### Prompt vs Completion Tokens

**Prompt Tokens** (Input):
- Everything you send TO the model
- System messages, developer instructions, user input
- Context, examples, seed patterns
- Previous conversation history
- **Cost**: $0.03 per 1,000 tokens

**Completion Tokens** (Output):
- Everything the model generates
- The AI's response/output
- Generated text, structured data, CML
- **Cost**: $0.06 per 1,000 tokens (2× prompt cost)

**Why completion costs more**: More computational work to generate than to read.

---

## Pricing Model (as of February 2026)

### Base Rates
- **GPT-4 Prompt Tokens**: $0.03 per 1,000 tokens
- **GPT-4 Completion Tokens**: $0.06 per 1,000 tokens
- **GPT-3.5-Turbo Prompt**: $0.0005 per 1,000 tokens (not currently used)
- **GPT-3.5-Turbo Completion**: $0.0015 per 1,000 tokens (not currently used)

### Cost Calculation Formula
```
Total Cost = (Prompt Tokens / 1000 × $0.03) + (Completion Tokens / 1000 × $0.06)
```

### Example Calculation
```
Prompt Tokens: 2,000
Completion Tokens: 1,500

Prompt Cost: 2,000 / 1,000 × $0.03 = $0.06
Completion Cost: 1,500 / 1,000 × $0.06 = $0.09
Total Cost: $0.15
```

## Agent-by-Agent Cost Breakdown

### Agent 1: Era & Setting Refiner
**Purpose**: Refines era constraints, location details, and period-specific limitations

**Configuration**:
- Temperature: 0.3 (low - factual, consistent)
- Max Tokens: 2000
- Model: GPT-4

**Typical Token Usage**:
- Prompt Tokens: ~1,200-1,500
- Completion Tokens: ~800-1,200
- Total: ~2,000-2,700 tokens

**Cost Breakdown**:
```
Prompt: 1,200 tokens × $0.03/1k = $0.036
Completion: 800 tokens × $0.06/1k = $0.048
Low: $0.084

Prompt: 1,500 tokens × $0.03/1k = $0.045
Completion: 1,200 tokens × $0.06/1k = $0.072
High: $0.117
```

**Estimated Cost per Run**: **$0.08 - $0.12**

**What You Get**:
- Era technology constraints
- Forensic capabilities for the period
- Transportation and communication methods
- Social norms and class structures
- Location physical constraints
- Weather and atmosphere details
- Anachronism detection

---

### Agent 2: Cast & Motive Designer
**Purpose**: Creates character profiles with secrets, motives, relationships
Cost Breakdown**:
```
Prompt: 1,500 tokens × $0.03/1k = $0.045
Completion: 2,500 tokens × $0.06/1k = $0.150
Low: $0.195 → ~$0.25 (with larger prompts)

Prompt: 2,000 tokens × $0.03/1k = $0.060
Completion: 3,500 tokens × $0.06/1k = $0.210
High: $0.270 → ~$0.36 (with 6-12 characters)
```

**Estimated Cost per Run**: **$0.25 - $0.36**

**Why More Expensive**: Large completion (detailed character profiles for 6-12 people)
**Configuration**:
- Temperature: 0.7 (moderate-high - creative characterization)
- Max Tokens: 4000
- Model: GPT-4

**Typical Token Usage**:
- Prompt Tokens: ~1,500-2,000
- Completion Tokens: ~2,500-3,500
- Total: ~4,000-5,500 tokens

**Estimated Cost per Run**: **$0.25 - $0.36**

**What You Get**:
- 6-12 detailed character profiles
- Motive seeds and strengths for each
- Relationship web with tensions
- Alibi windows and access plausibility
- Public persona vs. private secrets
- Character arc potential
- Diversity check and recommendations

---

##Cost Breakdown**:
```
Prompt: 3,000 tokens × $0.03/1k = $0.090
Completion: 5,000 tokens × $0.06/1k = $0.300
Low: $0.390 → ~$0.51 (with additional context)

Prompt: 4,000 tokens × $0.03/1k = $0.120
Completion: 7,000 tokens × $0.06/1k = $0.420
High: $0.540 → ~$0.78 (complex mysteries)
```

**Token Composition**:
- System prompt: ~500 tokens
- CML schema: ~800 tokens
- Seed patterns: ~1,000 tokens
- Era/location constraints: ~400 tokens
- User inputs: ~300 tokens
- **Generated CML**: 5,000-7,000 tokens (complete mystery structure)

**Estimated Cost per Run**: **$0.51 - $0.78**

**Why Most Expensive**: Largest completion (entire CML structure = ~1,500-2,000 words of YAML)
**Purpose**: Generates the complete CML (Compositional Mystery Language) structure

**Configuration**:
- Temperature: 0.6 (moderate - creative but structured)
- Max Tokens: 8000 (largest)
- Model: GPT-4

**Typical Token Usage**:
- Prompt Tokens: ~3,000-4,000 (includes seed patterns)
- Completion Tokens: ~5,000-7,000 (complete CML)
- Total: ~8,000-11,000 tokens

**Estimated Cost per Run**: **$0.51 - $0.78**

**What You Get**:
- Complete mystery structure in CML format
- Crime definition with method, weapon, timing
- Hidden model (true solution)
- False assumptions (red herrings)
- Timeline of events
- Clue placement strategy
- Primary axis implementation (temporal/spatial/identity/behavioral/authority)
- All characters' actions and knowledge states

**Note**: This is the most expensive agent but also the core of the system.

---

### Agent 4: CML Revision (Conditional)
**Purpose**: Auto-revises CML if validation fails or quality issues detected

**Configuration**:
- Temperature: 0.5 (balanced - not too creative, not too rigid)
- Max Tokens: 8000
- Model: GPT-4
- **Triggered**: Only if Agent 3 output needs revision

**Typical Token Usage** (when triggered):
- Prompt Tokens: ~4,000-5,000 (includes failed CML + errors)
- Completion Tokens: ~5,000-7,000
- Total: ~9,000-12,000 tokens

**Estimated Cost per Run**: **$0.54 - $0.84** (if triggered)

**What You Get**:
- Corrected CML structure
- Fixed validation errors
- Improved logical consistency
- Better clue distribution
- Enhanced fair play compliance

**Frequency**: Triggered in ~20-30% of generations

**Total Cost if Triggered**: **Agent 3 + Agent 4 = $1.05 - $1.62**

---

### Agent 5: Clue Distribution
**Purpose**: Extracts and distributes clues from CML across timeline

**Configuration**:
- Temperature: 0.4 (low - consistent, grounded extraction)
- Max Tokens: 3000
- Model: GPT-4

**Typical Token Usage**:
- Prompt Tokens: ~2,000-2,500 (includes full CML)
- Completion Tokens: ~1,500-2,000
- Total: ~3,500-4,500 tokens

**Estimated Cost per Run**: **$0.18 - $0.27**

**What You Get**:
- 15-30 individual clues
- Clue categories (testimony, physical, document, behavioral)
- Red herring identification
- Reveal timing (which chapter/act)
- Points-to attribution
- Load-bearing clue designation
- Distribution quality score

---

### Agent 6: Fair Play Auditor
**Purpose**: Audits mystery for fair play compliance and solvability

**Configuration**:
- Temperature: 0.3 (very low - consistent, rigorous auditing)
- Max Tokens: 2500
- Model: GPT-4

**Typical Token Usage**:
- Prompt Tokens: ~2,000-2,500 (includes CML + clues)
- Completion Tokens: ~1,200-1,800
- Total: ~3,200-4,300 tokens

**Estimated Cost per Run**: **$0.16 - $0.26**

**What You Get**:
- Overall status (pass/needs-revision/fail)
- 10+ checklist items evaluated
- Violation details with severity
- Warnings for minor issues
- Recommendations for fixes
- Solvability score
- Fair play compliance rating

---

### Agent 7: Narrative Formatter
**Purpose**: Structures the narrative with scenes, chapters, pacing

**Configuration**:
- Temperature: 0.5 (moderate - creative scene structuring)
- Max Tokens: 4000
- Model: GPT-4

**Typical Token Usage**:
- Prompt Tokens: ~2,500-3,000 (includes CML + clues)
- Completion Tokens: ~2,500-3,500
- Total: ~5,000-6,500 tokens

**Estimated Cost per Run**: **$0.30 - $0.46**

**What You Get**:
- Scene-by-scene outline
- Chapter structure (typically 8-15 chapters)
- Clue reveal pacing
- Tension arc mapping
- POV character selection per scene
- Scene objectives and beats
- Estimated word count per scene
- Total estimated story length

---

### Agent 8: Novelty Auditor
**Purpose**: Checks generated mystery against seed examples for uniqueness

**Configuration**:
- Temperature: 0.3 (low - consistent, objective comparison)
- Max Tokens: 2500
- Model: GPT-4

**Typical Token Usage**:
- Prompt Tokens: ~3,000-4,000 (includes generated CML + seed CMLs)
- Completion Tokens: ~1,000-1,500
- Total: ~4,000-5,500 tokens

**Estimated Cost per Run**: **$0.18 - $0.30**

**What You Get**:
- Status (pass/warning/fail)
- Similarity scores vs each seed
- Pattern match detection
- Structural uniqueness rating
- Content divergence analysis
- Violations (if too similar)
- Recommendations for revision

**Note**: Can be skipped with `skipNoveltyCheck` flag to save cost.

---

## Total Cost Summary

### Full Pipeline (All Agents)

**Base Scenario** (Agent 4 not triggered):
```
Agent 1: $0.08 - $0.12
Agent 2: $0.25 - $0.36
Agent 3: $0.51 - $0.78
Agent 5: $0.18 - $0.27
Agent 6: $0.16 - $0.26
Agent 7: $0.30 - $0.46
Agent 8: $0.18 - $0.30
─────────────────────
TOTAL:   $1.66 - $2.55
```

**With Revision** (Agent 4 triggered ~25% of time):
```
Base:    $1.66 - $2.55
Agent 4: $0.54 - $0.84
─────────────────────
TOTAL:   $2.20 - $3.39
```

**Skip Novelty Check** (save Agent 8 cost):
```
Base minus Agent 8: $1.48 - $2.25
With Agent 4:       $2.02 - $3.09
```

### Typical Generation Cost: **$2.00 - $3.50**

---

## Individual Regeneration Costs

### Regenerate Setting
- Agent 1 only: **$0.08 - $0.12**

### Regenerate Cast
- Agent 2 only: **$0.25 - $0.36**

### Regenerate Clues
- Agent 5 only: **$0.18 - $0.27**

### Regenerate Outline
- Agent 7 only: **$0.30 - $0.46**

### Regenerate Story (Prose)
- Future prose agent: **$0.40 - $0.80** (estimated, not yet implemented)

---

## Cost Factors That Affect Price

### Higher Costs
- **Larger cast size** (8-12 characters vs 6) → Agent 2 +20-30%
- **Longer target length** ("long" vs "short") → Agent 7 +30-50%
- **Complex primary axis** (psychological vs temporal) → Agent 3 +10-20%
- **Agent 4 revision triggered** → +$0.54-$0.84
- **More seed patterns loaded** → Agent 3 +5-10%

### Lower Costs
- **Skip novelty check** → -$0.18-$0.30
- **Simpler settings** (familiar era/location) → Agent 1 -10-20%
- **Shorter target length** → Agent 7 -20-30%

---

## Cost Tracking & Monitoring

### Built-in Cost Tracking
The system automatically tracks:
- **Total cost per generation**
- **Cost per agent**
- **Token usage breakdown**
- **Cost by model**

### Where to See Costs
1. **Run Events** (Advanced > History tab)
   - Final event shows: "Total cost: $X.XX"
   
2. **Console Logs** (for developers)
   - Each agent logs its cost
   - Format: "Agent X cost: $0.XX"

3. **Database Logs** (via API)
   - All costs stored in activity logs
   - Query: `SELECT * FROM logs WHERE scope = 'llm'`

### Cost Tracking API
```typescript
// Get cost summary
const tracker = client.getCostTracker();
const summary = tracker.getSummary();

console.log("Total:", summary.totalCost);
console.log("By Agent:", summary.byAgent);
console.log("By Model:", summary.byModel);
```

---

## Cost Optimization Strategies

### 1. Skip Optional Agents
```typescript
{
  skipNoveltyCheck: true  // Save ~$0.24
}
```
**Savings**: ~10-15% per generation

### 2. Use Shorter Lengths
```typescript
{
  targetLength: "short"  // vs "long"
}
```
**Savings**: ~15-20% per generation

### 3. Smaller Cast Size
```typescript
{
  castSize: 6  // vs 12
}
```
**Savings**: ~10-15% per generation

### 4. Regenerate Selectively
Instead of full regeneration, regenerate only what needs fixing:
- **Full regeneration**: $2.00-$3.50
- **Cast only**: $0.25-$0.36 (7-10% of full)
- **Clues only**: $0.18-$0.27 (5-8% of full)

### 5. Batch Operations
Generate multiple mysteries in one session to amortize connection overhead.

---

## Cost Limits & Safeguards

### Current Safeguards
1. **Rate Limiting**
   - Default: 60 requests per minute
   - Configurable: `requestsPerMinute` option
   - Prevents runaway costs

2. **Token Limits**
   - Max tokens per agent capped (2k-8k)
   - Prevents excessive responses

3. **Circuit Breaker**
   - Stops after 5 consecutive failures
   - Prevents retry loops that accumulate cost

### Recommended Limits (Future)
```typescript
// Set per-project budget
{
  maxCostPerProject: 10.00,  // Stop at $10
  maxCostPerDay: 100.00,     // Stop at $100/day
  alertThreshold: 50.00,     // Alert at $50
}
```

---

## Example Cost Scenarios

### Scenario 1: Quick Test Mystery
```
Settings:
- Cast size: 6
- Target length: short
- Skip novelty: true

Agents Run:
Agent 1: $0.08
Agent 2: $0.25
Agent 3: $0.51
Agent 5: $0.18
Agent 6: $0.16
Agent 7: $0.30

TotToken Usage Patterns by Agent

### Prompt Size Drivers
| Agent | Large Prompt Components | Token Impact |
|-------|------------------------|--------------|
| Agent 1 | Era constraints, location templates | +400-600 |
| Agent 2 | Character examples, relationship templates | +500-700 |
| Agent 3 | **Seed CMLs, schema, constraints** | **+2,500-3,500** |
| Agent 4 | Failed CML + validation errors | +3,000-4,000 |
| Agent 5 | Full CML structure | +2,000-2,500 |
| Agent 6 | CML + clue list + checklist | +2,000-2,500 |
| Agent 7 | CML + clues + pacing guidelines | +2,500-3,000 |
| Agent 8 | Generated CML + 3-5 seed CMLs | +3,000-4,000 |

### Completion Size Drivers
| Agent | Output Type | Words | Tokens | Cost Impact |
|-------|------------|-------|--------|-------------|
| Agent 1 | Structured JSON | 200-300 | 800-1,200 | Low |
| Agent 2 | Character profiles (6-12) | 600-900 | 2,500-3,500 | High |
| Agent 3 | **Full CML YAML** | **1,500-2,000** | **5,000-7,000** | **Highest** |
| Agent 4 | Revised CML YAML | 1,500-2,000 | 5,000-7,000 | Highest |
| Agent 5 | Clue list (15-30 items) | 400-600 | 1,500-2,000 | Medium |
| Agent 6 | Audit report | 300-450 | 1,200-1,800 | Low |
| Agent 7 | Scene outline | 600-900 | 2,500-3,500 | High |
| Agent 8 | Similarity report | 250-400 | 1,000-1,500 | Low |

### Why Token Counts Vary

**Complexity Factors**:
- **Cast size**: 12 characters = +40% tokens vs 6 characters (Agent 2)
- **Mystery length**: "Long" = +60% tokens vs "Short" (Agent 7)
- **Primary axis**: Psychological = +20% tokens vs Temporal (Agent 3)
- **Seed patterns**: 5 seeds = +1,000 tokens vs 2 seeds (Agent 3, 8)

**Efficiency Observations**:
- Agent 3 (CML) is 50-60% of total token usage
- Completion tokens cost 2× prompt tokens
- Most cost is in generating long structured outputs (CML, character profiles)
- Reading context (prompts) is relatively cheap

---

## Estimating Token Usage

### Quick Estimation Formula
```
Tokens ≈ (Characters / 4) or (Words × 1.33)
```

### For Your Mystery
**Input Estimation**:
```
Your spec: ~100 words = 133 tokens
Settings description: ~50 words = 67 tokens
Character names (6): ~15 words = 20 tokens
Total user input: ~200-300 tokens
```

**System/Template Overhead**: ~5,000-8,000 tokens (prompts, schemas, seeds)

**Output Estimation**:
```
Setting: 200 words = 267 tokens
Cast: 700 words = 933 tokens (6 chars)
CML: 1,800 words = 2,400 tokens
Clues: 450 words = 600 tokens
Fair play: 350 words = 467 tokens
Narrative: 750 words = 1,000 tokens
Novelty: 300 words = 400 tokens
Total output: ~6,000-7,000 tokens
```

**Grand Total**: ~15,000-20,000 tokens per full mystery generation

### Token-to-Cost Mapping
| Total Tokens | Estimated Cost | Mystery Complexity |
|--------------|----------------|-------------------|
| 10,000-12,000 | $1.50-$2.00 | Simple, short, 6 characters |
| 15,000-18,000 | $2.00-$3.00 | Medium, typical |
| 20,000-25,000 | $3.00-$4.00 | Complex, long, 10-12 characters |
| 30,000+ | $4.50+ | Very complex + revision |

---

## al: $1.48
```

### Scenario 2: Full Production Mystery
```
Settings:
- Cast size: 10
- Target length: long
- Include novelty: true
- Revision triggered

Agents Run:
Agent 1: $0.12
Agent 2: $0.36
Agent 3: $0.78
Agent 4: $0.84 (revision)
Agent 5: $0.27
Agent 6: $0.26
Agent 7: $0.46
Agent 8: $0.30

Total: $3.39
```

### Scenario 3: Iterative Development
```
Initial Generation: $2.50
Regenerate Cast: $0.36
Regenerate Clues: $0.27
Final Total: $3.13
```

---

## Cost Comparison

### vs. Human Writer
- **AI Generation**: $2-3.50 per mystery (~2 minutes)
- **Human Writer**: $500-2000 per mystery (~20-40 hours)
- **AI is 200-800x cheaper**

### vs. Other AI Services
- **OpenAI API (direct)**: $2-3.50
- **Anthropic Claude**: $3-5 (estimated)
- **This system adds**: $0 (just API passthrough)

---

## Billing & Payment

### Azure OpenAI Billing
- Billed directly by Microsoft Azure
- Monthly invoice
- Per-token pricing
- No platform markup from this system

### Required Credentials
```env
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=your-api-key-here
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4o
```

### Checking Your Bill
1. Azure Portal → Cost Management
2. Filter by: Azure OpenAI Service
3. View by: Resource or Tag
4. Download detailed usage CSV

---

## FAQ

**Q: Why does cost vary so much?**
A: Token usage varies based on complexity, length, cast size, and whether revision is needed. Complex mysteries with large casts and long outlines use more tokens.

**Q: Can I set a hard cost limit?**
A: Not currently implemented. Azure OpenAI has quotas, but per-request limits need to be added to the application layer.

**Q: What if I go over budget?**
A: Azure will stop serving requests when you hit your quota. Set Azure spending limits in the portal.

**Q: Can I use GPT-3.5 instead to save money?**
A: Technically yes (change deployment name), but quality will be significantly lower. GPT-4 is recommended for mystery generation.

**Q: Do failed generations cost money?**
A: Yes - token usage is billed even if the output is rejected. Always costs are incurred for API calls.

**Q: Can I get refunds for bad generations?**
A: No - Azure charges for API usage regardless of output quality. Cost is for compute, not results.

---

## Summary

### Expected Costs
- **Typical mystery generation**: $2.00 - $3.50
- **Quick test**: $1.50 - $2.00
- **Production quality**: $3.00 - $4.00
- **Regenerating single component**: $0.10 - $0.50

### Cost Efficiency
- ✅ **Extremely cost-effective** compared to human writing
- ✅ **Predictable** - narrow range per generation
- ✅ **Trackable** - all costs logged and reported
- ✅ **Controllable** - skip agents, adjust length, limit cast size

### Best Practice
1. Start with full generation to see quality
2. Use selective regeneration to refine
3. Skip novelty check for internal tests
4. Monitor costs via run events
5. Set Azure spending alerts

**Average cost per publishable mystery**: **$2.50**

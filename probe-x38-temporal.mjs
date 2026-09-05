import { detectCrossArtifactTemporalConflicts } from "./apps/worker/dist/jobs/agents/agent9-run.js";

const LF_CLOCK = { description: "The apparent time displayed on the grandfather clock when last observed before the murder.", value: "twenty-five minutes past ten" };
const LF_WATCH = { description: "The time displayed on the receptionist's pocket watch at the same moment the grandfather clock chimed.", value: "half past ten" };

const mk = (timeObj) => ({ constraint_space: { time: timeObj } });

const show = (label, out) => {
  console.log(`\n### ${label} -> ${out.length} conflict(s)`);
  for (const c of out) console.log(`   anchor="${c.sourceTime}" type=${c.violationType} path=${c.sourcePath} canon="${c.lockedFactValue}"`);
};

// A. KNOWN-POSITIVE control: a genuinely different hour must be detected.
show("A known-positive (anchor 'eight o'clock' vs 10:25)", detectCrossArtifactTemporalConflicts({
  lockedFacts: [LF_CLOCK],
  cmlCase: mk({ anchors: ["The grandfather clock chimed at eight o'clock"] }),
  narrative: null,
}));

// B. REPRODUCTION of the shipped run: the exact windows array from run mystery-1788202899854.
show("B reproduce run (real windows[])", detectCrossArtifactTemporalConflicts({
  lockedFacts: [LF_CLOCK, LF_WATCH],
  cmlCase: mk({
    anchors: [
      "Grandfather clock chimed twenty-five minutes past ten",
      "Receptionist's pocket watch showed half past ten",
      "Captain Hale seen in smoking room nine fifty-five to ten fifteen",
      "Dining room attendance logs nine forty-five to ten twenty",
      "Beatrice Quill's office log records ten to ten forty-five",
    ],
    windows: [
      "Actual murder time between half past ten and ten forty",
      "Alibis based on grandfather clock time: nine fifty-five to ten twenty",
    ],
    contradictions: [
      "Grandfather clock time conflicts with receptionist's pocket watch",
      "Captain Hale's alibi overlaps only apparent but not actual murder time",
      "Dining room logs exclude Hugo Vane at actual murder time",
    ],
  }),
  narrative: null,
}));

// C. Isolate the range fragment.
show("C range fragment alone", detectCrossArtifactTemporalConflicts({
  lockedFacts: [LF_CLOCK],
  cmlCase: mk({ windows: ["Alibis based on grandfather clock time: nine fifty-five to ten twenty"] }),
  narrative: null,
}));

// D. THE DEFECT THE CHECK IS NAMED FOR: a real 5-minute clock disagreement.
show("D real 5-min disagreement (10:25 clock vs anchor saying the clock read half past ten)", detectCrossArtifactTemporalConflicts({
  lockedFacts: [LF_CLOCK],
  cmlCase: mk({ anchors: ["The grandfather clock chimed half past ten"] }),
  narrative: null,
}));

// E. sweep of the blindness threshold
console.log("\n### E threshold sweep, canonical = 'twenty-five minutes past ten' (10:25)");
for (const [txt, mins] of [["half past ten", 5], ["quarter to eleven", 20], ["five minutes past eleven", 40], ["twenty minutes past eleven", 55], ["twenty-five minutes past eleven", 60], ["half past eleven", 65]]) {
  const out = detectCrossArtifactTemporalConflicts({
    lockedFacts: [LF_CLOCK],
    cmlCase: mk({ anchors: [`The grandfather clock chimed ${txt}`] }),
    narrative: null,
  });
  console.log(`   gap ~${String(mins).padStart(2)} min ("${txt}") -> ${out.length} conflict(s)`);
}

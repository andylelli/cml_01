// replicate the splitter + mention logic to find where the flip happens
const paragraph = "He caught Dr. Finch's eye once more.";
const HONORIFIC_TAIL = /(?:Dr|Mr|Mrs|Ms|St|Capt|Col|Prof|Rev|Sgt|Insp|Lt|Maj)\.\s*$/i;
const sentencePattern = /([^.!?]*[.!?]+\s*)|([^.!?]+$)/g;
const segments: string[] = [];
let match: RegExpExecArray | null;
while ((match = sentencePattern.exec(paragraph)) !== null) {
  const piece = match[0];
  if (segments.length > 0 && HONORIFIC_TAIL.test(segments[segments.length - 1])) {
    segments[segments.length - 1] += piece;
  } else {
    segments.push(piece);
  }
  if (match[0].length === 0) sentencePattern.lastIndex++;
}
console.log(JSON.stringify(segments));

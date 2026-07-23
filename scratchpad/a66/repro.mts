import { repairPronouns } from '../../packages/story-validation/src/pronoun-repair.ts';
const CAST=[{name:'Hugo Vane',gender:'male'},{name:'Dr. Mallory Finch',gender:'female'}];
for (const s of ["He caught Dr. Finch's eye once more.", "He turned to Dr. Finch, voice softer."]) {
  console.log(JSON.stringify(repairPronouns(s, CAST as any, {crossParagraphInheritance:true})));
}

import { readFileSync } from "node:fs";
const o = JSON.parse(readFileSync(process.argv[2], "utf8"))["run_bcc0d637-0506-4314-908a-21c89d941c49"];
const p = JSON.parse(readFileSync(process.argv[3], "utf8"));
const a = p["resume-1791307885184"], b = p["resume-1791308574179"];
const contractOf = (u) => { const i = u.indexOf("## THE CHAPTERS TO WRITE"); const j = u.indexOf("THE BOOK SO FAR"); const k = u.indexOf("Write the chapters below"); return u.slice(i, j > i ? j : k); };
const headOf = (u) => u.slice(0, u.indexOf("## THE CHAPTERS TO WRITE"));
for (let s = 0; s < 10; s++) {
  const ko = o[`Agent9v2-Writer-S${s}-D1`]?.user, ka = a[`Agent9v2-Writer-S${s}-D1`]?.user, kb = b[`Agent9v2-Writer-S${s}-D1`]?.user;
  console.log(`S${s}`, "head orig==A'", headOf(ko) === headOf(ka), "contract orig==A'", contractOf(ko) === contractOf(ka), "| orig==B", contractOf(ko) === contractOf(kb), "lens", contractOf(ko).length, contractOf(ka).length, contractOf(kb).length);
}
console.log("orig agents", Object.keys(o).filter(k => !/Writer/.test(k)).join(","));

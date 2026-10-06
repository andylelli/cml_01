const KILL = /\b(killed|murdered|poisoned|strangled|throttled|struck|stabbed|shot|drowned|smothered|suffocated|bludgeoned|pushed|cut)\b/i;
const s = '"Desmond Kestrel killed Katherine Quayle-timing his entry';
const re = new RegExp(KILL.source + '\s+(\S+)', 'i');
console.log(re.source, s.match(re));

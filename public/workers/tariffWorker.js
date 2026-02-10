let dictionary = null;
let rf = [];
let Dictionary_Map = new Map();
let indexedEntries = [];
let ngramMaskMap = new Map(); // bitmask representation for ngram quick filter

/* ------------------------ SINGULARIZATION ------------------------ */
function singularize(word) {
  if (!word || word.length <= 3) return word;
  const irregulars = { children: "child", teeth: "tooth", feet: "foot", diagnoses: "diagnosis", analyses: "analysis" };
  if (irregulars[word]) return irregulars[word];
  if (word.endsWith("ies")) return word.slice(0, -3) + "y";
  if (word.endsWith("ses") || word.endsWith("xes") || word.endsWith("ches") || word.endsWith("shes")) return word.slice(0, -2);
  if (word.endsWith("s") && !word.endsWith("ss")) return word.slice(0, -1);
  return word;
}

/* ------------------------ ABBREVIATION EXPANSION ------------------------ */
const replacements = {
  TAB: "TABLET", CAP: "CAPLET", INJ: "INJECTION", IV: "INTRAVENOUS", IM: "INTRAMUSCULAR",
  SC: "SUBCUTANEOUS", SYP: "SYRUP", SUSP: "SUSPENSION", SOL: "SOLUTION", OINT: "OINTMENT",
  "%": "PERC", "&": "AND"
};

function expandAbbreviations(text) {
  for (const [abbr, full] of Object.entries(replacements)) {
    const regex = new RegExp(`\\b${abbr}\\b`, "gi");
    text = text.replace(regex, full);
  }
  return text;
}

/* ------------------------ NORMALIZATION ------------------------ */
export function normalizeAndSort(text) {
  if (!text) return "";
  let result = expandAbbreviations(text.toUpperCase())
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  result = singularize(result);
  return result.split(" ").sort().join(" ");
}

/* ------------------------ NGRAMS & PHONETIC ------------------------ */
function ngrams(str, n = 2) {
  const grams = [];
  for (let i = 0; i < str.length - n + 1; i++) grams.push(str.slice(i, i + n));
  return grams;
}

function phonetic(str) {
  return str.replace(/[aeiou]/g, "").replace(/ph/g, "f").replace(/ck/g, "k").replace(/q/g, "k").replace(/z/g, "s");
}

/* ------------------------ COSINE SIMILARITY ------------------------ */
function cosineSimilarity(a, b) {
  const setA = new Set(a);
  const setB = new Set(b);
  let intersection = 0;
  setA.forEach(x => { if (setB.has(x)) intersection++; });
  return intersection / Math.sqrt(a.length * b.length || 1);
}

/* ------------------------ WEIGHTED LEVENSHTEIN ------------------------ */
function weightedLevenshtein(a, b) {
  const al = a.length, bl = b.length;
  if (Math.abs(al - bl) > 4) return 0; // early exit for irrelevant
  const dp = Array(al + 1).fill(0).map((_, i) => i);
  for (let i = 1; i <= bl; i++) {
    let prev = dp[0]; dp[0] = i;
    for (let j = 1; j <= al; j++) {
      const temp = dp[j];
      const cost = a[j - 1] === b[i - 1] ? 0 : 1;
      dp[j] = Math.min(dp[j] + 0.8, dp[j - 1] + 0.8, prev + cost);
      prev = temp;
    }
  }
  return 1 - dp[al] / Math.max(al, bl);
}

/* ------------------------ SMART FUZZY TOP 10 ------------------------ */
function smartFuzzyTop10(searchTerm) {
  const query = normalizeAndSort(searchTerm);
  const queryGrams = ngrams(query);
  const queryPhonetic = phonetic(query);

  // Compute bitmask for query ngrams
  const queryMask = queryGrams.reduce((mask, g) => mask | (1 << (g.charCodeAt(0) % 32)), 0);

  // Candidate filtering using bitmask for very fast prefilter
  const candidates = indexedEntries.filter(item => (item.ngramMask & queryMask) !== 0);

  const results = [];
  for (let item of candidates) {
    const gramOverlap = cosineSimilarity(queryGrams, item.grams);
    if (gramOverlap < 0.25) continue; // early skip irrelevant

    const score =
      gramOverlap * 0.35 +
      weightedLevenshtein(query, item.text) * 0.35 +
      (item.text.startsWith(query) ? 0.2 : 0) +
      (queryPhonetic === item.phonetic ? 0.1 : 0);

    if (score >= 0.3) results.push({ service: item.original, code: item.code, score });
  }

  return results.sort((a, b) => b.score - a.score).slice(0, 10);
}

/* ------------------------ WORKER HANDLER ------------------------ */
self.onmessage = async function (e) {
  const { type } = e.data;

  if (type === "load") {
    if (!dictionary) {
      const res = await fetch("/js/Tar.json");
      dictionary = await res.json();
      rf = [];
      indexedEntries = [];
      Dictionary_Map.clear();
      ngramMaskMap.clear();

      dictionary.forEach((p, i) => {
        const norm = normalizeAndSort(p.tariff_desc);
        const grams = ngrams(norm);
        const ph = phonetic(norm);

        let mask = grams.reduce((m, g) => m | (1 << (g.charCodeAt(0) % 32)), 0);

        rf.push({ i, tariff_desc: norm, tariff_code: p.tariff_code });
        indexedEntries.push({ text: norm, grams, phonetic: ph, original: p.tariff_desc, code: p.tariff_code, ngramMask: mask });
        Dictionary_Map.set(norm, i);
        ngramMaskMap.set(norm, mask);
      });
    }
    self.postMessage({ type: "loaded" });
  }

  if (type === "search") {
    if (!dictionary) return;
    const { id, word, IOP } = e.data;
    const normWord = normalizeAndSort(word);

    if (Dictionary_Map.has(normWord)) {
      const idx = Dictionary_Map.get(normWord);
      const rest = dictionary[idx];
      self.postMessage({ type: "result", id, rest, score: 1, IOP });
    } else {
      const rest = smartFuzzyTop10(normWord);
      self.postMessage({ type: "result", id, rest, normWord, IOP });
    }
  }
};

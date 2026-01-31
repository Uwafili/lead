self.onmessage = function (e) {
  const {id, word, dictionary, } = e.data;

  /*************************************************
 * SMART FUZZY MATCHING ENGINE (MEDICAL-GRADE)
 *
 * ✔ Character n-grams
 * ✔ Weighted Levenshtein (insertions cheaper)
 * ✔ Vowel-tolerant edits
 * ✔ Sound-alike (phonetic)
 * ✔ Prefix bonus
 * ✔ Top-N ranked results
 *************************************************/

/* ------------------ NORMALIZE ------------------ */
function normalize(str) {
    if(str){
        return str
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "")
            .trim();
    }
 
}

/* ------------------ N-GRAMS ------------------ */
function charNGrams(str, n = 2) {
  const grams = [];
  for (let i = 0; i <= str.length - n; i++) {
    grams.push(str.slice(i, i + n));
  }
  return grams;
}

function ngramSimilarity(a, b) {
  if (!a || !b) return 0;

  const aGrams = new Set(charNGrams(a));
  const bGrams = new Set(charNGrams(b));

  let match = 0;
  for (const g of aGrams) {
    if (bGrams.has(g)) match++;
  }

  return match / Math.max(aGrams.size, bGrams.size);
}

/* ------------- WEIGHTED LEVENSHTEIN ------------- */
const vowels = new Set(["a", "e", "i", "o", "u"]);

function weightedLevenshtein(a, b) {
  const dp = Array.from({ length: b.length + 1 }, () =>
    new Array(a.length + 1).fill(0)
  );

  for (let i = 0; i <= a.length; i++) dp[0][i] = i * 0.6;
  for (let j = 0; j <= b.length; j++) dp[j][0] = j * 0.6;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      const ca = a[j - 1];
      const cb = b[i - 1];

      let substitutionCost = 1;
      if (ca === cb) substitutionCost = 0;
      else if (vowels.has(ca) && vowels.has(cb)) substitutionCost = 0.3;

      dp[i][j] = Math.min(
        dp[i - 1][j] + 0.6,                // deletion
        dp[i][j - 1] + 0.6,                // insertion
        dp[i - 1][j - 1] + substitutionCost // substitution
      );
    }
  }

  return dp[b.length][a.length];
}

function weightedSimilarity(a, b) {
  if (!a || !b) return 0;
  const dist = weightedLevenshtein(a, b);
  return 1 - dist / Math.max(a.length, b.length);
}

/* ---------------- PHONETIC CODE ---------------- */
function phoneticCode(str) {
  return normalize(str)
    .replace(/ph/g, "f")
    .replace(/ck/g, "k")
    .replace(/c(?=[eiy])/g, "s")
    .replace(/c/g, "k")
    .replace(/q/g, "k")
    .replace(/x/g, "ks")
    .replace(/v/g, "f")
    .replace(/dg/g, "j")
    .replace(/tch/g, "ch")
    .replace(/[aeiou]/g, "")
    .slice(0, 6);
}

/* ---------------- PREFIX BONUS ---------------- */
function prefixBonus(a, b) {
  let count = 0;
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    if (a[i] === b[i]) count++;
    else break;
  }
  return count >= 4 ? 0.05 : 0;
}

/* ------------ COMBINED SMART SCORE ------------ */
function smartFuzzyMatch(input, target) {
  input = normalize(input);
  target = normalize(target);

  if (!input || !target) return 0;

  const levScore = weightedSimilarity(input, target); // main driver
  const gramScore = ngramSimilarity(input, target);   // helper
  const soundScore =
    phoneticCode(input) === phoneticCode(target) ? 1 : 0;

  const bonus = prefixBonus(input, target);

  return Math.min(
    1,
    levScore * 0.7 +
    gramScore * 0.15 +
    soundScore * 0.15 +
    bonus
  );
}

/* -------- TOP-N BEST MATCHES (PUBLIC API) ------- */
 function topMatches(input, list, limit = 10, minScore = 0.6) {
  input = normalize(input);

  return list
    .map(item => ({
      value: item,
      score: Number(smartFuzzyMatch(input, item).toFixed(3))
    }))
    .filter(r => r.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

const rest=topMatches(word,dictionary)
self.postMessage({id,rest});

}
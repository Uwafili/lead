let dictionary = null;
function smartFuzzyTop10(searchTerm, dic) {

  const normalize = (str) => {
    if (!str) return "";
    return String(str).toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();
  };

  const ngrams = (str, n = 2) => {
    if (!str) return [];
    const grams = [];
    for (let i = 0; i < str.length - n + 1; i++) {
      grams.push(str.slice(i, i + n));
    }
    return grams;
  };

  const phonetic = (str) => {
    if (!str) return "";
    return str
      .replace(/[aeiou]/g, "")
      .replace(/ph/g, "f")
      .replace(/ck/g, "k")
      .replace(/q/g, "k")
      .replace(/z/g, "s");
  };

  const prefixBonus = (a, b) => b.startsWith(a) ? 1 : 0;

  const weightedLevenshtein = (a, b) => {
    const matrix = Array.from({ length: b.length + 1 }, () => []);
    for (let i = 0; i <= b.length; i++) matrix[i][0] = i;
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {

        const cost = a[j - 1] === b[i - 1] ? 0 : 1;

        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 0.8,
          matrix[i][j - 1] + 0.8,
          matrix[i - 1][j - 1] + cost
        );
      }
    }

    const maxLen = Math.max(a.length, b.length);
    return 1 - (matrix[b.length][a.length] / maxLen);
  };

  const cosineSimilarity = (a, b) => {
    const mapA = {}, mapB = {};

    a.forEach(g => mapA[g] = (mapA[g] || 0) + 1);
    b.forEach(g => mapB[g] = (mapB[g] || 0) + 1);

    const unique = new Set([...a, ...b]);

    let dot = 0, magA = 0, magB = 0;

    unique.forEach(g => {
      const valA = mapA[g] || 0;
      const valB = mapB[g] || 0;

      dot += valA * valB;
      magA += valA * valA;
      magB += valB * valB;
    });

    return dot / (Math.sqrt(magA) * Math.sqrt(magB) || 1);
  };


  /* ⭐ SUPPORT MAP OR ARRAY */
 const iterable = dic instanceof Map
  ? Array.from(dic.entries())
  : dic.map(item => [item, null]);


  const query = normalize(searchTerm);
  const queryGrams = ngrams(query);
  const queryPhonetic = phonetic(query);

const results = iterable.map(([serviceName, value]) => {

  const text = normalize(serviceName);
  const grams = ngrams(text);

  const score =
    cosineSimilarity(queryGrams, grams) * 0.35 +
    weightedLevenshtein(query, text) * 0.35 +
    prefixBonus(query, text) * 0.20 +
    (queryPhonetic === phonetic(text) ? 1 : 0) * 0.10;
    const yt=dictionary[value]
  return {
    service: serviceName,
    code: yt['tariff_code'],
    score
  };
});


return results.sort((a, b) => b.score - a.score).slice(0,10);

}




const replacements = {
  TAB: "TABLET",
  CAP: "CAPLET",
  INJ: "INJECTION",
  IV: "INTRAVENOUS",
  IM: "INTRAMUSCULAR",
  SC: "SUBCUTANEOUS",
  SYP: "SYRUP",
  SUSP: "SUSPENSION",
  SOL: "SOLUTION",
  OINT: "OINTMENT",
  '%':"PERC"
};


function expandAbbreviations(text) {
  let result = text;

  for (const [abbr, full] of Object.entries(replacements)) {
    const regex = new RegExp(`\\b${abbr}\\b`, "gi"); // whole-word match
    result = result.replace(regex, full);
  }

  return result;
}

export function normalizeAndSort(text) {
    if(text){
  return expandAbbreviations(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .sort()
    .join(' ');}
}
let rf=[]
self.onmessage = async function (e) {
  const {type} = e.data;

  /*************************************************
   * SMART FUZZY MATCHING ENGINE (MEDICAL-GRADE)
   *************************************************/

  /* ------------------ NORMALIZE ------------------ */


   if (type === "load") {
        if (!dictionary) {
            const res = await fetch('/js/Tar.json');
            dictionary = await res.json();
             dictionary.forEach((p,i) => {
              const tg=normalizeAndSort(p['tariff_desc']);
              const ty=p['tariff_code']
              const dc={i,'tariff_desc':tg,'tariff_code':ty}
              rf.push(dc)
            });
        }

        self.postMessage({ type: "loaded" });
    }
const Dictionary_Map=new Map()
rf.forEach((f)=>{Dictionary_Map.set(f['tariff_desc'],f['i'])})

    if (type=='search') {
      if (!dictionary) return;

       const { id, word,IOP } = e.data;
      const normWord =normalizeAndSort(word)

      if (Dictionary_Map.has(normWord)) {
          const index=Dictionary_Map.get(normWord)
          const rest=dictionary[index]
         self.postMessage({type:"result",id,rest,score:1,IOP})
      }else{
          const rest=smartFuzzyTop10(normWord,Dictionary_Map)
          self.postMessage({type:'result',id,rest,normWord,IOP})
      }
      
    }



};

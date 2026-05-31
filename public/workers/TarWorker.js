console.log("e")


let dictionary = null;
function smartFuzzySearch(searchTerm, dataset, limit = 10) {
  const ignore = new Set([
    "tablet", "tablets", "tab", "tabs",
    "capsule", "capsules", "cap", "caps",
    "softgel", "softgels",
    "pill", "pills",

    "syrup", "syrups", "syr",
    "suspension", "susp", "suspensions",
    "solution", "solutions", "sol", "soln",
    "mixture", "mix",
    "elixir",
    "emulsion",
    "linctus",

    "cream", "creams",
    "ointment", "ointments", "oint",
    "gel", "gels",
    "lotion", "lotions",

    "drop", "drops",
    "spray", "sprays",

    "injection", "injectable", "injectables",
    "inj", "iv", "im", "sc",
    "ampoule", "ampoules",
    "vial", "vials",

    "inhaler", "inhalers",
    "neb", "nebs",

    "patch", "patches",
    "device", "devices",

    "powder", "powders",
    "granule", "granules",
    "sachet", "sachets",

    "forte",
    "plus",
    "extra",
    "max",

    "percent",
    "mg", "g", "kg",
    "mcg", "ug",
    "ml", "mls",

    "per",
    "with",
    "and",
    "for",
    "of",

    "generic",
    "brand",
    "drug",
    "medicine",
    "medication"
  ]);

  function normalize(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      // remove dosage/alphanumeric dosage
    .replace(/\b\d+[a-z0-9.%]*\b/g, " ")
    // split
      .split(/\s+/)
      .filter(Boolean)
      .join(" ")
      .trim();
  }

  function ngrams(str, n = 2) {
    if (str.length < n) return [str];

    const grams = [];

    for (let i = 0; i <= str.length - n; i++) {
      grams.push(str.slice(i, i + n));
    }

    return grams;
  }

  function phonetic(str) {
    return str
      .replace(/[aeiou]/g, "")
      .replace(/ph/g, "f")
      .replace(/ck/g, "k")
      .replace(/q/g, "k")
      .replace(/z/g, "s");
  }

  function cosineSimilarity(a, b) {
    const setA = new Set(a);
    const setB = new Set(b);

    let intersection = 0;

    for (const x of setA) {
      if (setB.has(x)) intersection++;
    }

    return intersection / Math.sqrt(setA.size * setB.size || 1);
  }

  function weightedLevenshtein(a, b) {
    const al = a.length;
    const bl = b.length;

    if (!al && !bl) return 1;

    const dp = Array(al + 1)
      .fill(0)
      .map((_, i) => i);

    for (let i = 1; i <= bl; i++) {
      let prev = dp[0];
      dp[0] = i;

      for (let j = 1; j <= al; j++) {
        const temp = dp[j];

        const cost = a[j - 1] === b[i - 1] ? 0 : 1;

        dp[j] = Math.min(
          dp[j] + 1,
          dp[j - 1] + 1,
          prev + cost
        );

        prev = temp;
      }
    }

    return 1 - dp[al] / Math.max(al, bl);
  }

  const query = normalize(searchTerm);

  if (!query) return [];

  const queryGrams = ngrams(query);
  const queryPhonetic = phonetic(query);

  const results = dataset
    .map(original => {
      const text = normalize(original);

      if (!text) return null;

      const grams = ngrams(text);

      const gramScore = cosineSimilarity(
        queryGrams,
        grams
      );

      const levScore = weightedLevenshtein(
        query,
        text
      );

      const phoneticScore =
        queryPhonetic === phonetic(text)
          ? 1
          : 0;

      const startsWithScore =
        text.startsWith(query)
          ? 1
          : 0;

      const score =
        gramScore * 0.45 +
        levScore * 0.40 +
        startsWithScore * 0.10 +
        phoneticScore * 0.05;

      return {
        item: original,
        score: Number(score.toFixed(4))
      };
    })
    .filter(Boolean)
    .filter(r => r.score >= 0.25)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return results;
}
const medicationForms = {
  // vitamins
  vit: "vitamin",

  // tablets
  tab: "tablet",
  tabs: "tablet",
  tablets: "tablet",
  chewtab: "chewable tablet",
  disptab: "dispersible tablet",
  efftab: "effervescent tablet",
  ectab: "enteric-coated tablet",
  srtab: "sustained release tablet",
  crtab: "controlled release tablet",
  xrtab: "extended release tablet",
  mrtab: "modified release tablet",

  // capsules
  cap: "capsule",
  caps: "capsule",
  capsules: "capsule",

  // liquids
  syr: "syrup",
  syrups: "syrup",
  susp: "suspension",
  suspensions: "suspension",
  elix: "elixir",
  emuls: "emulsion",
  lot: "lotion",

  // topicals
  cr: "cream",
  creams: "cream",
  oint: "ointment",
  ointments: "ointment",
  gel: "gel",
  patch: "transdermal patch",

  // injectable
  inj: "injection",
  injections: "injection",
  injectables: "injection",
  amp: "ampoule",
  amps: "ampoule",
  ampoules: "ampoule",
  vial: "vial",
  vials: "vial",

  // solution / drops
  sol: "solution",
  soln: "solution",
  solutions: "solution",
  gtt: "drops",
  drops: "drops",

  // respiratory
  neb: "nebulization solution",
  nebulizer: "nebulization solution",
  inh: "inhaler",

  // others
  supp: "suppository",
  sachets: "sachet",
  spray: "spray",
  gran: "granules",
  loz: "lozenge",
  powd: "powder",

  pcm: "paracetamol"
};

function formReplace(meds) {
    meds = meds.toLowerCase();

    let refinedMed = meds;

    Object.keys(medicationForms).forEach(key => {
        refinedMed = refinedMed.replace(
            new RegExp(`\\b${key}\\b`, "g"),
            medicationForms[key]
        );
    });

    return refinedMed;
}

const ignore = new Set([

  // -------------------------
  // BASIC DOSAGE FORMS
  // -------------------------
  "tablet", "tablets", "tab", "tabs",
  "capsule", "capsules", "cap", "caps",
  "softgel", "softgels",
  "pill", "pills",

  // -------------------------
  // LIQUIDS
  // -------------------------
  "syrup", "syrups", "syr",
  "suspension", "susp", "suspensions",
  "solution", "solutions", "sol", "soln",
  "mixture", "mix",
  "elixir",
  "emulsion",
  "linctus",

  // -------------------------
  // TOPICALS
  // -------------------------
  "cream", "creams",
  "ointment", "ointments", "oint",
  "gel", "gels",
  "lotion", "lotions",
  "paste",
  "foam",
  "shampoo",
  "soap",

  // -------------------------
  // DROPS / SPRAYS
  // -------------------------
  "drop", "drops", "gtt",
  "spray", "sprays",
  "mist",

  // -------------------------
  // INJECTIONS
  // -------------------------
  "injection", "injectable", "injectables",
  "inj", "iv", "im", "sc", "subcut",
  "amp", "amps",
  "ampoule", "ampoules",
  "vial", "vials",
  "prefilled", "prefill",

  // -------------------------
  // RESPIRATORY
  // -------------------------
  "inhaler", "inhalers",
  "neb", "nebs",
  "nebulizer",
  "nebulisation",
  "nebulization",
  "respules",
  "rotacap",

  // -------------------------
  // PATCHES / DEVICES
  // -------------------------
  "patch", "patches",
  "device",  "devices",
  "kit",  "kits",

  // -------------------------
  // POWDERS / GRANULES
  // -------------------------
  "powder", "powders",
  "granule", "granules",
  "sachet", "sachets",

  // -------------------------
  // SPECIAL TABLET TYPES
  // -------------------------
  "chewable",
  "chewtab",
  "dispersible",
  "disptab",
  "effervescent",
  "efftab",
  "enteric",
  "coated",
  "film",
  "filmcoated",
  "sustained",
  "controlled",
  "extended",
  "modified",
  "release",

  // -------------------------
  // RELEASE ABBREVIATIONS
  // -------------------------
  "sr", "cr", "xr", "mr", "er", "dr", "ir",

  // -------------------------
  // ROUTES OF ADMINISTRATION
  // -------------------------
  "oral",
  "topical",
  "nasal",
  "ophthalmic",
  "otic",
  "rectal",
  "vaginal",
  "buccal",
  "sublingual",
  "inhalation",

  // -------------------------
  // BODY/USE DESCRIPTORS
  // -------------------------
 /*  "eye",
  "ear",
  "nose",
  "skin", */

  // -------------------------
  // PACKAGING
  // -------------------------
  "bottle", "bot",
  "pack", "packs",
  "strip", "strips",
  "blister",

  // -------------------------
  // STRENGTH / MARKETING
  // -------------------------
  "forte",
  "plus",
  "extra",
  "double",
  "maximum",
  "max",

  // -------------------------
  // MEASUREMENT WORDS
  // -------------------------
  "percent",
  "mg", "g", "kg",
  "mcg", "ug",
  "ml", "mls",
  "l", "litre", "liter",
  "iu", "units",
  "mmol",
  "meq",

  // -------------------------
  // COMMON FILLER WORDS
  // -------------------------
  "per",
  "with",
  "and",
  "for",
  "of",
  'piece',
  "pieces",

  // -------------------------
  // COMMON MEDICAL ABBREVIATIONS
  // -------------------------
  "od", "bd", "tds", "qid",
  "prn", "stat",

  // -------------------------
  // COMMON NOISE TOKENS
  // -------------------------
  "generic",
  "brand",
  "drug",
  "medicine",
  "medication"
]);

function getDrugKey(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(" ")
    .filter(word => {
      return (
        word.length > 3 &&          // removes mg, ml, tab, cap
        isNaN(word)                 // removes numbers like 625, 500
      );
    })
    .join(" ")
    .trim();
}

/* ------------------------ NORMALIZATION ------------------------ */
function normalizeAndSort(text) {
  if (!text) return "";

  let result = formReplace(text.toLowerCase())
    .toLowerCase()

    // normalize percent variations FIRST
    .replace(/\bperc\b/g, "percent")
    .replace(/%/g, "percent")

    // remove punctuation
    .replace(/[^a-z0-9\s]/g, " ")

    // normalize spaces
    .replace(/\s+/g, " ")
    .trim();
result =formReplace(result);

return result.split(" ").sort().join(" ");
}

function tokenizeDrug(str) {
  return str
    .toLowerCase()

    // remove dosage/alphanumeric dosage
    .replace(/\b\d+[a-z0-9.%]*\b/g, " ")

    // remove symbols
    .replace(/[^a-z\s]/g, " ")

    // split
    .split(/\s+/)

    // clean
    .filter(word =>
      word &&
      word.length > 2 &&
      !ignore.has(word)
    );
}

self.onmessage = async function (e) {
   
  const { type } = e.data;
  if (type === "load") {
    if(dictionary ===null){
      const res = await fetch("/api/hospital-pharmacy");
      const json = await res.json();
      const ret = json.data;
      rf = json.bad;
      dictionary=ret['PHARMACY'];

      dictionary.forEach((p,i) => {p['DESCRIPTION']=normalizeAndSort(p['DESCRIPTION']); }); 

      self.postMessage({ type: "loaded" });
    }
  } if (type === "search") {
    if (!dictionary) return;
    const {data} =e.data;
    let dupData=new Map(data.map(item => [normalizeAndSort(item.SERVICE),item]));

const exactMatches = [];
const partialMatches = [];
const fuzzyMatches = [];
const notFound = [];
const justhold=new Set();


// Exact lookup
const dictMap = new Map( dictionary.map(item => [item.DESCRIPTION,item]));
 const fgv= dictionary.map(item => item.DESCRIPTION)

// ---------------------------
// MAIN LOOP
// ---------------------------

for(const [B1,prop] of dupData.entries()){

   //EXACT MATCH
  const rtg = dictMap.get(B1);
  if (rtg !==undefined) {
    exactMatches.push(rtg);
    dupData.delete(B1)
    dictMap.delete(B1)
  }

    //Partials
    const related=[...dictMap].filter(([item, prop])=>{

      const keyA=new Set(tokenizeDrug(item))
      const keyB=new Set(tokenizeDrug(B1));
      
      for (const w of keyB) {
        if (keyA.has(w)){
          justhold.add(item)
           return true;
        }
      }
         return false;
    })
    if (related.length > 0) {
      partialMatches.push({parent: B1,matches: related});
    } else {
      notFound.push(B1);
      const rft= smartFuzzySearch(B1,fgv);
      fuzzyMatches.push(rft)
      //console.log(B1,rft) 
    } 
}



console.log(exactMatches)
console.log(partialMatches)
console.log(fuzzyMatches)
console.log(notFound)

console.log(justhold)

console.log(dupData)
console.log(dictMap)
//console.log(dupData)
  }

} 
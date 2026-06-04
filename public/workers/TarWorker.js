let dictionary = null;
let indexedEntries;

//DrugEngine
function DrugLord() {
  /* CORE SMART FUZZY SEARCH ENGINE                      */
  function smartFuzzyTop10(searchTerm) {
  // 1. Extract if the user typed a specific strength in their query (e.g., "625mg", "5ml")
  const queryStrength = extractStrength(searchTerm);
  
          // 2. Tokenize the input string into a clean array of lowercase words
          const queryTokens = tokenizeDrugWithNoise(searchTerm); 
  if (queryTokens.length === 0) return [];

          // 3. Separate the user's search query into Core Drugs vs Requested Forms
  const coreQueryDrugs = queryTokens.filter(t => !ignore.has(t));
  const requestedForms = queryTokens.filter(t => ignore.has(t));

          // CRITICAL GATE: If there are no active ingredient keywords, exit immediately 
          // to prevent matching purely on words like "tablet" or "syrup".
  if (coreQueryDrugs.length === 0) return [];

  const results = [];

          // 4. Loop through the pre-tokenized background database
  for (const item of indexedEntries) {
    if (item.tokens.length === 0) continue;

    let totalDrugScore = 0;

            /* ------------------- STAGE 1: CORE DRUG NAME MATCHING ------------------- */
            // Focus explicitly on matching the active ingredients, ignoring background noise words
    for (const qDrug of coreQueryDrugs) {
      let maxDrugScore = 0;

      for (const dToken of item.tokens) {
                if (dToken.isNoise) continue; // Skip matching active ingredients against filler words

        const score = getLevenshteinSimilarity(qDrug, dToken.text);
        if (score > maxDrugScore) {
          maxDrugScore = score;
        }
      }
      totalDrugScore += maxDrugScore;
    }

            // Baseline score derived strictly from active pharmaceutical ingredients
    let finalScore = totalDrugScore / coreQueryDrugs.length;

            // HARD GATE: Active ingredient must be a solid match (75%+) or it's dropped completely
    if (finalScore < 0.75) continue; 


            /* ------------------- STAGE 2: DOSAGE FORM TIE-BREAKER ------------------- */
            // PRIORITY 1: If the user explicitly requested a format (e.g., "syrup"), reward matches heavily
    if (requestedForms.length > 0) {
      let matchedFormCount = 0;

      for (const rForm of requestedForms) {
        for (const dToken of item.tokens) {
                  // If it's a database noise token and matches what the user typed
          if (dToken.isNoise && getLevenshteinSimilarity(rForm, dToken.text) >= 0.85) {
            matchedFormCount++;
            break; 
          }
        }
      }

              // High weight bonus (+0.30) ensures Form matches dominate the tie-breaker pool
      if (matchedFormCount > 0) {
        finalScore += (matchedFormCount / requestedForms.length) * 0.30;
      }
    }


    /* --------------------- STAGE 3: STRENGTH TIE-BREAKER --------------------- */
            // PRIORITY 2: Fine-tune positions based on specific numerical dosages
    if (queryStrength) {
      if (item.strength === queryStrength) {
                // Perfect match on strength adds a secondary modifier boost
        finalScore += 0.10; 
      } else if (item.strength && item.strength !== queryStrength) {
                // Modest penalty if a different strength exists, without overriding a correct Form match
        finalScore -= 0.05; 
      }
    }


            /* ----------------------- STAGE 4: RECORD PACKAGING ----------------------- */
            // Collect qualified matches that pass our evaluation profile
    if (finalScore >= 0.65) {
      results.push({
        service: item.original,
        code: item.code,
        tariff: item.tariff,
        score: Number(finalScore.toFixed(4))
      });
    }
  }

          // 5. Sort the top matches in descending order based on final score weight profiles
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
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
  "medication",
  "bottle",

  // CONSULTATION.

  "consultation", "consult", "visit", "review", "followup", 
  "follow", "initial", "routine", "specialist", "clinic", "services"
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

function tokenizeDrugWithNoise(str) {
  if (!str) return [];

  return str
    .toLowerCase()

    // 1. ADVANCED MEDICAL STRENGTH REMOVAL
    // Matches numbers, standalone fractions, decimals, and variations with spaces 
    // (e.g., "100mg", "100 mg", "312.5 mg", "312 5mg", "0.5%", "1/2", "1g", "1 g")
    .replace(/\b\d+[\d\s./%]*(mg|ml|g|l|mcg|ug|iu|units|percent|perc|\b)/gi, " ")

    // 2. Clear out punctuation and symbols, leaving clean spaces
    .replace(/[^a-z\s]/g, " ")

    // 3. Break the string apart into an array of words
    .split(/\s+/)

    // 4. Clean up trailing spaces and drop ultra-short tokens 
    .filter(word => word && word.length > 2);
}

function normalizeAndSort(text) {
  
  if (!text) return "";

  let result = formReplace(text.toLowerCase())
    .toLowerCase()

    // normalize percent variations FIRST
    .replace(/\bperc\b/g, "percent")
    .replace(/%/g, "percent")

    // remove punctuation
    .replace(/[^a-z0-9\s]/g, "")

    // normalize spaces
    .replace(/\s+/g, " ")
    .trim();
result =formReplace(result);

return result.split(" ").sort().join(" ");
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
// A helper regex to extract the first clear dosage strength found (e.g., "100mg", "5ml", "0.5%")
function extractStrength(str) {
  const match = str.toLowerCase().match(/\b(\d+[\d\s./%]*(?:mg|ml|g|l|mcg|ug|iu|units|percent|perc|%))/i);
  return match ? match[1].replace(/\s+/g, "") : null; // "100 mg" becomes "100mg"
}

 return {
      smartFuzzyTop10,
      normalizeAndSort,
      extractStrength,
      ignore,
      tokenizeDrugWithNoise
   };
}

// Consult Engine

function ConsultLord() {



    const consultationIgnore = new Set([
      // consultation words
      "consult",
      "consultation",
      "consulting",
      "review",
      "followup",
      "follow",
      "follow-up",
      "revisit",
      "visit",
      "attendance",

      // patient categories
      "new",
      "old",
      "return",
      "existing",
      "adult",
      "child",
      // encounter types
      "initial",
      "first",
      "routine",
      "regular",
      "emergency",
      "urgent",
      "walkin",
      "walk-in",

      // hospital/clinic words
      "hospital",
      "clinic",
      "medical",
      "health",
      "healthcare",
      "care",
      "centre",
      "center",

      // service words
      "service",
      "services",
      "fee",
      "charge",
      "charges",

      // doctor references
      "doctor",
      "dr",
      "consultant",

      // generic descriptors
      "comprehensive",
      "basic",
      "standard",
      "normal",
      "private",

      // abbreviations
    
    ]);

    const consultationForms = {
  // General practice
  gp: "general practitioner",
  gpc: "general practitioner consultation",
  gopd: "general outpatient department",

  // Common specialties
  ent: "ear nose throat",
  eye: "ophthalmology",
  oph: "ophthalmology",
  opht: "ophthalmology",
  ortho: "orthopaedic",
  psych: "psychiatry",
  derm: "dermatology",
  cardio: "cardiology",
  neuro: "neurology",
  uro: "urology",
  gyn: "gynaecology",
  obs: "obstetrics",
  paed: "paediatrics",
  ped: "paediatrics",
  gastro: "gastroenterology",
  nephro: "nephrology",
  pulm: "pulmonology",
  rheum: "rheumatology",
  endo: "endocrinology",
  onc: "oncology",

  // Facility departments
  opd: "outpatient department",
  ipd: "inpatient department",
  ae: "accident and emergency",
  er: "emergency room",
  icu: "intensive care unit",

  // Consultation types
  cons: "consultation",
  consult: "consultation",
  rev: "review",
  fup: "follow up",
  fu: "follow up",

  // Specialist levels
  spec: "specialist",
  sp: "specialist",
  consultant: "specialist"
    };
    function formReplace(text){
    if (!text) return;
    text = text.toLowerCase();

        let refinedConsult = text;

        Object.keys(consultationForms).forEach(key => {
            refinedConsult = refinedConsult.replace(
                new RegExp(`\\b${key}\\b`, "g"),
                consultationForms[key]
            );
        });

        return refinedConsult;
    }

    // Consult Normalize
    function consultNormalizeAndSort(text) {
      if (!text) return;

      let result = formReplace(text)

          // remove punctuation
        .replace(/[^a-z0-9\s]/g, "")

        // normalize spaces
        .replace(/\s+/g, " ")
        .trim();
        result =formReplace(result);

      return result.split(/\s+/).sort()

    }


      /* CORE SMART FUZZY SEARCH ENGINE                      */
  function smartFuzzyTop10(searchTerm) {
 
  
          // 2. Tokenize the input string into a clean array of lowercase words
          const queryTokens = searchTerm; 
  if (queryTokens.length === 0) return [];

          // 3. Separate the user's search query into Core Drugs vs Requested Forms
  const coreQueryDrugs = queryTokens.filter(t => !consultationIgnore.has(t));
  const requestedForms = queryTokens.filter(t => consultationIgnore.has(t));

          // CRITICAL GATE: If there are no active ingredient keywords, exit immediately 
          // to prevent matching purely on words like "tablet" or "syrup".
  if (coreQueryDrugs.length === 0) return [];

  const results = [];

          // 4. Loop through the pre-tokenized background database
  for (const item of indexedEntries) {
    if (item.tokens.length === 0) continue;

    let totalDrugScore = 0;

            /* ------------------- STAGE 1: CORE DRUG NAME MATCHING ------------------- */
            // Focus explicitly on matching the active ingredients, ignoring background noise words
    for (const qDrug of coreQueryDrugs) {
      let maxDrugScore = 0;

      for (const dToken of item.tokens) {
                if (dToken.isNoise) continue; // Skip matching active ingredients against filler words

        const score = getLevenshteinSimilarity(qDrug, dToken.text);
        if (score > maxDrugScore) {
          maxDrugScore = score;
        }
      }
      totalDrugScore += maxDrugScore;
    }

            // Baseline score derived strictly from active pharmaceutical ingredients
    let finalScore = totalDrugScore / coreQueryDrugs.length;

            // HARD GATE: Active ingredient must be a solid match (75%+) or it's dropped completely
    if (finalScore < 0.75) continue; 


            /* ------------------- STAGE 2: DOSAGE FORM TIE-BREAKER ------------------- */
            // PRIORITY 1: If the user explicitly requested a format (e.g., "syrup"), reward matches heavily
    if (requestedForms.length > 0) {
      let matchedFormCount = 0;

      for (const rForm of requestedForms) {
        for (const dToken of item.tokens) {
                  // If it's a database noise token and matches what the user typed
          if (dToken.isNoise && getLevenshteinSimilarity(rForm, dToken.text) >= 0.85) {
            matchedFormCount++;
            break; 
          }
        }
      }

              // High weight bonus (+0.30) ensures Form matches dominate the tie-breaker pool
      if (matchedFormCount > 0) {
        finalScore += (matchedFormCount / requestedForms.length) * 0.30;
      }
    }


            /* ----------------------- STAGE 4: RECORD PACKAGING ----------------------- */
            // Collect qualified matches that pass our evaluation profile
    if (finalScore >= 0.65) {
      results.push({
        service: item.original,
        code: item.code,
        tariff: item.tariff,
        score: Number(finalScore.toFixed(4))
      });
    }
  }

          // 5. Sort the top matches in descending order based on final score weight profiles
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}

    return{
        consultNormalizeAndSort,
        consultationIgnore,
        smartFuzzyTop10
    }
}

/* ------------------------ THE STANDALONE LEVENSHTEIN SIMILARITY ------------------------ */
function getLevenshteinSimilarity(a, b) {
  const al = a.length;
  const bl = b.length;
  if (!al || !bl) return 0;

  const dp = Array(al + 1).fill(0).map((_, i) => i);

  for (let i = 1; i <= bl; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= al; j++) {
      const temp = dp[j];
      const cost = a[j - 1] === b[i - 1] ? 0 : 1;
      dp[j] = Math.min(dp[j] + 1, dp[j - 1] + 1, prev + cost);
      prev = temp;
    }
  }
  // Returns a score between 0.0 (completely different) and 1.0 (identical)
  return 1 - dp[al] / Math.max(al, bl);
}

self.onmessage = async function (e) {
   
  const { type,cartegory } = e.data;
  if (type === "load") {    
       const cart=cartegory;

    console.log(cartegory)
    if(dictionary ===null){
      const res = await fetch("/api/hospital-pharmacy");
      const json = await res.json();
      const ret = json.data;
      rf = json.bad;
      dictionary=ret[cartegory];
     


      switch (cart) {
        case 'PHARMACY':
              drut()
          break;
        case 'CONSULTATION':
                 const ConLord = ConsultLord();
                 dictionary.forEach((p,i) => {p['DESCRIPTION']=ConLord.consultNormalizeAndSort(p['DESCRIPTION']); }); 
             consulp(ConLord);
        break;
        default:
          console.log("Hi")
      }

      self.postMessage({ type: "loaded" });
    }
  } if (type === "search") {

    if (!dictionary) return;
    const {data,cartegory} =e.data; 

    const cart=cartegory;
        switch (cart) {


          case 'PHARMACY':
            const drugEngine = DrugLord();
                DrugReturn (data,drugEngine)
            break;


          case 'CONSULTATION':
            const ConLord = ConsultLord();
                  consReturn(data,ConLord)

            break

            default:
            break;
        }
   

}

   
} 



/*     //Partials
  // Define keyB once outside the loop
const keyB = new Set(tokenizeDrugWith(B1));

const related = [...dictMap]
  .filter(([item, prop]) => {
    const keyA = new Set(tokenizeDrugWith(item));
    
    for (const w of keyB) {
      if (keyA.has(w)) {
        justhold.add(item);
        return true;
      }
    }
    return false;
  })
  .map(([item, prop]) => prop);
    if (related.length > 0) {
      const passer={id:prop['id'],parent: B1,matches: related};
       self.postMessage({type:'result',data:passer})
      partialMatches.push({parent: B1,matches: related});
    } else {
     
    }  */




      function DrugReturn(data,drugEngine) {
        const exactMatches = [];
const partialMatches = [];
const fuzzyMatches = [];
const notFound = [];
const justhold=new Set();
const Allsearched=[];
const Matched=[];


 const dictMap = new Map( dictionary.map(item => [item.DESCRIPTION,item]));
            let dupData =new Map(data.map(item => [drugEngine.normalizeAndSort(item.SERVICE),item]));
// ---------------------------
// MAIN LOOP
// ---------------------------

for(const [B1,prop] of dupData.entries()){

   //EXACT MATCH
  const rtg = dictMap.get(B1);

  if (rtg !==undefined) {
      const realVT={id:prop['id'],service: rtg.DESCRIPTION, code: rtg.CODE, 'tariff':rtg.TARIFF,score: 1}
    const passer={id:prop['id'],parent:prop.SERVICE,matches:[realVT]};
    Matched.push(realVT)
    //exactMatches.push({id:prop['id'],parent:prop.SERVICE,matches:[realVT]});

   Allsearched.push(passer)

    dupData.delete(B1)
    dictMap.delete(B1)

    continue
  }
   const fuzz= drugEngine.smartFuzzyTop10(B1);
        if (fuzz.length > 0) {
      
          const passer={id:prop['id'],parent:B1,matches:fuzz}
           fuzz.forEach(f => {f['id']=prop['id'];Matched.push(f)});
            Allsearched.push(passer)
          fuzzyMatches.push(fuzz)
        }
          else{
          notFound.push(B1);
        }
 } 
self.postMessage({type:'result',data:Allsearched,matched:Matched})
      }

      function drut() {
          const drugEngine = DrugLord();
           dictionary.forEach((p,i) => {p['DESCRIPTION']=drugEngine.normalizeAndSort(p['DESCRIPTION']); }); 
          indexedEntries = dictionary.map(item => {
          const rawDescription = item.DESCRIPTION.toLowerCase();                      // 1. Extract and store the clean structural strength (e.g., "625mg", "5ml")
          const itemStrength = drugEngine.extractStrength(rawDescription);
    // 2. Tokenize the remaining descriptive words using our noise-inclusive layout
                      const rawTokens = drugEngine.tokenizeDrugWithNoise(rawDescription); 
          const weightedTokens = rawTokens.map(word => ({
            text: word,
            isNoise: drugEngine.ignore.has(word)
          }));
          return {
            original: item.DESCRIPTION, 
            code: item.CODE,  
            tariff: item.TARIFF,  
            strength: itemStrength, // Stored safely as a standalone attribute!
            tokens: weightedTokens 
          };
        });
      }

      function consulp(ConLord){
           indexedEntries=dictionary.map(item=>{
            const rawDescription = item.DESCRIPTION;   
            const weightedTokens = rawDescription.map(word => ({
            text: word,
            isNoise: ConLord.consultationIgnore.has(word)
          }));
          return {original: item.DESCRIPTION,code: item.CODE,tariff: item.TARIFF,tokens: weightedTokens};
           })
      }

      function consReturn(data,ConLord){
          const fuzzyMatches = [];
          const notFound = [];
          const Allsearched=[];
          const Matched=[];

            const dictMap = new Map( dictionary.map(item => [item.DESCRIPTION.join(" "),item]));
            let dupData =new Map(data.map(item => [ConLord.consultNormalizeAndSort(item.SERVICE).join(" "),item]));
            for(const [B1,prop] of dupData.entries()){
                 //EXACT MATCH
            const rtg = dictMap.get(B1);
            if (rtg !==undefined) {
                const realVT={id:prop['id'],service: rtg.DESCRIPTION, code: rtg.CODE, 'tariff':rtg.TARIFF,score: 1}
              const passer={id:prop['id'],parent:prop.SERVICE,matches:[realVT]};
              console.log(rtg)
              Matched.push(realVT)

            Allsearched.push(passer)

              dupData.delete(B1)
              dictMap.delete(B1)
              continue
            }const fuzz= ConLord.smartFuzzyTop10(B1.split(" "));
        if (fuzz.length > 0) {
      
          const passer={id:prop['id'],parent:B1,matches:fuzz}
          console.log(passer)
         /*   fuzz.forEach(f => {f['id']=prop['id'];Matched.push(f)});
            Allsearched.push(passer)
          fuzzyMatches.push(fuzz) */
        }else{
          notFound.push(B1);
        }
            }
      }

let dictionary = null;
let indexedEntries;
let AllDiction=null;



function firstTwoLettersMatch(a, b) {
  const aRR = a.map(item => item.slice(0, 2));
  const bRR = b.map(item => item.slice(0, 2));
  return aRR.some(item => bRR.includes(item));
}

function calculateUniqueMatchScore(a, b) {
  // 1. Remove duplicates from both arrays by converting them to Sets
  const setA = new Set(a);
  const setB = new Set(b);
  
  // 2. Count how many items in setA also exist in setB
  let matchCount = 0;
  for (const item of setA) {
    if (setB.has(item)) {
      matchCount++;
    }
  }
  // 3. Multiply the unique match count by 0.25
  return matchCount * 0.25;
}
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
  "tablet", "tablets", "tab", "tabs","co",
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
     "first",
  "second",
  "third",
  "fourth",
  "fifth",
  "1st",
  "2nd",
  "3rd",
  "4th",
  "5th"
    ]);

    const consultationForms = {
  // General practice
  gp: "general practitioner",
  gpc: "general practitioner consultation",
  gopd: "general outpatient department",

  // Common specialties
  ent: "ear nose throat",
  'followup':"review",
  surgery:'surgeon',
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
  GYNAE:'gynaecology',
  obs: "obstetrics",
  paed: "paediatrics",
  ped: "paediatrics",
  peadiatrics:"paediatrics",
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
    "second":"review",
  "third":"review",
  "fourth":"review",
  "fifth":"review",
  "2nd":"review",
  "3rd":"review",
  "4th":"review",
  "5th":"review",

  // Specialist levels
  spec: "specialist",
  sp: "specialist",
  consultant: "specialist",
  '&':"and"
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
    if (!text) return [];

    let result = formReplace(text)
        .replace(/[^a-z0-9\s]/gi, "")
        .replace(/\s+/g, " ")
        .trim();

    result = formReplace(result);

    if (result.endsWith("gy")) {
        result = result.slice(0, -2) + "gist";
    } else if (result.endsWith("ry")) {
        result = result.slice(0, -2) + "ist";
    } else if(result.endsWith("tics")){
      result = result.slice(0, -2) + "cian";
    }

    return result.split(/\s+/).sort();
}


      /* CORE SMART FUZZY SEARCH ENGINE*/
  function smartFuzzyTop10(searchTerm) {
    const term=searchTerm.join(" ");
    const matches=[]
         const tg=[];
       const weightedTokens = searchTerm.map(word => ({
            text: word,
            isNoise: consultationIgnore.has(word)
          }));

        let NotIgnoreSearch=weightedTokens.filter((item)=>item.isNoise ===false).map(item=>item.text)

          for(const Entries of indexedEntries){
   
           
            const Edith=Entries.tokens.filter((item)=>item.isNoise== false)
            const words=Edith.map(item=>item.text)

              if (firstTwoLettersMatch(words,NotIgnoreSearch)) {
                
                let score = getLevenshteinSimilarity(words.join(" "), NotIgnoreSearch.join(" "));

                    const EntryNTY=Entries.tokens.filter((item)=>item.isNoise== true).map(item=>item.text)
                    const IgnoreSearch=weightedTokens.filter((item)=>item.isNoise ===true).map(item=>item.text)
                    

                  function getMatchScoreUnique(a, b) {
            // Find unique overlapping words
            const uniqueMatches = [...new Set(a)].filter(item => b.includes(item));
            
            // Multiply total matches by 0.25
           return uniqueMatches.length * 0.25;
          }
              score +=getMatchScoreUnique(EntryNTY, IgnoreSearch)
          
                  matches.push({ service: Entries.original,
                                code: Entries.code,
                                tariff: Entries.tariff,
                                score: Number(score.toFixed(4))
                              })
                  //console.log(words,NotIgnoreSearch,score)

              }
            

          }
function sortByScoreDescending(arr){return arr.sort((a, b) => b.score - a.score);}
          const rft=sortByScoreDescending(matches);
          return matches
}

    return{
        consultNormalizeAndSort,
        consultationIgnore,
        smartFuzzyTop10
    }
}

    function ProcedureLord() {
  /* CORE SMART FUZZY SEARCH ENGINE                      */
function searchProceduresTop10(searchTerm) {
  // 1. Check if query tokens exist
  const queryTokens = searchTerm; 
  if (!queryTokens || queryTokens.length === 0) return [];

  // 2. Tag the incoming query words as Core vs Noise
  const weightedQuery = queryTokens.map(word => ({
    text: word,
    isNoise: procedureIgnore.has(word)
  }));

  // Separate them into flat word arrays
  let coreQueryWords = weightedQuery.filter(item => !item.isNoise).map(item => item.text);
  let noiseQueryWords = weightedQuery.filter(item => item.isNoise).map(item => item.text);

  // Fallback: If the user ONLY typed noise words (e.g. "section"), treat them as core words 
  // so the search doesn't return empty.
  if (coreQueryWords.length === 0) {
    coreQueryWords = noiseQueryWords;
    noiseQueryWords = [];
  }

  const results = [];

  // 3. Loop through your pre-tokenized database rows
  for (const entry of indexedEntries) {
    const coreEntryWords = entry.tokens.filter(item => !item.isNoise).map(item => item.text);
    if (coreEntryWords.length === 0) continue;

    let totalCoreScore = 0;
    let matchedWordsCount = 0;
    let matchedEntryWords = new Set();

    /* ---------------- STAGE 1: WORD-BY-WORD CROSS CHECK ---------------- */
    for (const qWord of coreQueryWords) {
      let maxWordScore = 0;
      let bestEntryWordMatch = null;

      for (const eWord of coreEntryWords) {
        if (matchedEntryWords.has(eWord)) continue; // Skip if already paired

        const currentScore = getLevenshteinSimilarity(qWord, eWord);
        
        if (currentScore > maxWordScore) {
          maxWordScore = currentScore;
          bestEntryWordMatch = eWord;
        }
      }

      // Loose connection threshold to capture typos and close variations
      if (maxWordScore >= 0.70) {
        totalCoreScore += maxWordScore;
        matchedWordsCount++;
        if (bestEntryWordMatch) {
          matchedEntryWords.add(bestEntryWordMatch); // Lock this database word
        }
      }
    }

    /* ------------------- STAGE 2: INCLUSIVE SCORING MATH ------------------- */
    // INCLUSIVE GATE: As long as AT LEAST ONE word connected, we grade it and include it!
    if (matchedWordsCount >= 1) {
      
      // Calculate spelling accuracy across the specific words that matched
      const matchAccuracy = totalCoreScore / matchedWordsCount;
      
      // QUERY COVERAGE BONUS: This calculates what % of the user's core search terms matched.
      // This is the engine's primary sorting weight. It guarantees that an entry matching 
      // "caesarean" AND "twins" scores drastically higher than one matching just "caesarean".
      const queryCoverage = matchedWordsCount / coreQueryWords.length;

      // Combine weights: 60% on spelling precision, 40% on how many query terms matched
      let finalScore = (matchAccuracy * 0.6) + (queryCoverage * 0.4);

      /* ----------------- STAGE 3: NOISE / MODIFIER BONUS ----------------- */
      // If they matched modifiers like "section" or "lap", award an extra ranking boost
      if (noiseQueryWords.length > 0) {
        const noiseEntryWords = entry.tokens.filter(item => item.isNoise).map(item => item.text);
        let matchedNoiseCount = 0;

        for (const qNoise of noiseQueryWords) {
          for (const eNoise of noiseEntryWords) {
            if (getLevenshteinSimilarity(qNoise, eNoise) >= 0.80) {
              matchedNoiseCount++;
              break;
            }
          }
        }

        // Add modifier weight up to +0.25 to break ties among high-coverage entries
        if (matchedNoiseCount > 0) {
          finalScore += (matchedNoiseCount / noiseQueryWords.length) * 0.25;
        }
      }

      // Save all matches to results without a filtering threshold minimum
      results.push({
        service: entry.original,
        code: entry.code,
        tariff: entry.tariff,
        score: Number(finalScore.toFixed(4))
      });
    }
  }

  // 4. Sort descending by score. The queryCoverage + modifier bonuses ensure 
  // that the most thoroughly related options win the top positions.
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}
const procedureIgnore = new Set([
  // Generic Action Verbs
  "procedure", "procedures", "surgery", "operation", "management",
  "treatment", "excision", "incision", "repair", "removal", "fixation",
  "drainage", "biopsy", "resection", "closure", "reconstruction", "applied","minor","major","intermediate",
"fee","fees","global","block",
  
  // Operational Modifiers
  "stage", "stages", "under", "with", "without", "and", "for", "via","of", 
  "approach", "status", "unilateral", "bilateral", "including", "except"
]);


function normalizeAndSortProcedures(text) {
  if (!text) return "";

  let cleaned = text.toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")


    .replace(/\s+/g, " ")
    .trim();

  let words = cleaned.split(" ");

  let structuralWords = words.filter(word => word && word.length >= 2);

  return structuralWords.sort();
}
 return {
      searchProceduresTop10,
      procedureIgnore,
      normalizeAndSortProcedures
   };
}

function RadLord() {
  
const radiologyIgnore = new Set([
  // 1. Core Imaging Modalities & Shorthand
  "xray", "x-ray", "uss", "ultrasound", "ultrasonography", "sonar", "scan",
  "ct", "mri", "mra", "pet", "fluoroscopy", "", "",
   "tomography", "radiography", "imaging",
  
  // 2. Views, Postures, and Anatomical Planes
  "ap", "pa", "lateral", "lat", "oblique", "view", "views", "axial", 
  "sagittal", "coronal", "erect", "supine", "bilateral", "unilateral","single","double",

  // 3. Contrast & Technical Modifiers
  "contrast", "with", "without", "w", "wo", "iv", "gadolinium", "dye",
  "digital", "computed", "magnetic", "resonance", "resonance", "doppler", 
  "duplex", "color", "high", "resolution", "hrct", "3d", "4d",

  // 4. General Medical/Administrative Filler
  "routine", "urgent", "special", "guided", "guidance", "under", "procedure",
  "report", "film", "films", "screening", "diagnostic", "check", "and"
]);

function normalizeAndSortRadiology(text) {
  if (!text) return "";

  let cleaned = text.toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")


    .replace(/\s+/g, " ")
    .trim();

  let words = cleaned.split(" ");

  let structuralWords = words.filter(word => word && word.length >= 2);

 return structuralWords.sort();
  
          
            
}


function searchRadiologyTop10(searchTerm) {
  // 1. Check if query tokens exist
  const queryTokens = searchTerm; // Assuming this is an array of string tokens passed in
  if (!queryTokens || queryTokens.length === 0) return [];

  // 2. Tag the incoming query words as Core vs Noise
  const weightedQuery = queryTokens.map(word => ({
    text: word,
    isNoise: radiologyIgnore.has(word)
  }));

  // Separate them into flat word arrays
  let coreQueryWords = weightedQuery.filter(item => !item.isNoise).map(item => item.text);
  let noiseQueryWords = weightedQuery.filter(item => item.isNoise).map(item => item.text);

  // Fallback: If the user ONLY typed noise words (e.g. "section"), treat them as core words 
  // so the search doesn't return empty.
  if (coreQueryWords.length === 0) {
    coreQueryWords = noiseQueryWords;
    noiseQueryWords = [];
  }

  const results = [];

  // 3. Loop through your pre-tokenized database rows
  for (const entry of indexedEntries) {
    const coreEntryWords = entry.tokens.filter(item => !item.isNoise).map(item => item.text);
    if (coreEntryWords.length === 0) continue;

    let totalCoreScore = 0;
    let matchedWordsCount = 0;
    let matchedEntryWords = new Set();

    /* ---------------- STAGE 1: WORD-BY-WORD CROSS CHECK ---------------- */
    for (const qWord of coreQueryWords) {
      let maxWordScore = 0;
      let bestEntryWordMatch = null;

      for (const eWord of coreEntryWords) {
        if (matchedEntryWords.has(eWord)) continue; // Skip if already paired

        const currentScore = getLevenshteinSimilarity(qWord, eWord);
        
        if (currentScore > maxWordScore) {
          maxWordScore = currentScore;
          bestEntryWordMatch = eWord;
        }
      }

      // Loose connection threshold to capture typos and close variations
      if (maxWordScore >= 0.70) {
        totalCoreScore += maxWordScore;
        matchedWordsCount++;
        if (bestEntryWordMatch) {
          matchedEntryWords.add(bestEntryWordMatch); // Lock this database word
        }
      }
    }

    /* ------------------- STAGE 2: INCLUSIVE SCORING MATH ------------------- */
    // INCLUSIVE GATE: As long as AT LEAST ONE word connected, we grade it and include it!
    if (matchedWordsCount >= 1) {
      
      // Calculate spelling accuracy across the specific words that matched
      const matchAccuracy = totalCoreScore / matchedWordsCount;
      
      // QUERY COVERAGE BONUS: This calculates what % of the user's core search terms matched.
      // This is the engine's primary sorting weight. It guarantees that an entry matching 
      // "caesarean" AND "twins" scores drastically higher than one matching just "caesarean".
      const queryCoverage = matchedWordsCount / coreQueryWords.length;

      // Combine weights: 60% on spelling precision, 40% on how many query terms matched
      let finalScore = (matchAccuracy * 0.6) + (queryCoverage * 0.4);

      /* ----------------- STAGE 3: NOISE / MODIFIER BONUS ----------------- */
      // If they matched modifiers like "section" or "lap", award an extra ranking boost
      if (noiseQueryWords.length > 0) {
        const noiseEntryWords = entry.tokens.filter(item => item.isNoise).map(item => item.text);
        let matchedNoiseCount = 0;

        for (const qNoise of noiseQueryWords) {
          for (const eNoise of noiseEntryWords) {
            if (getLevenshteinSimilarity(qNoise, eNoise) >= 0.80) {
              matchedNoiseCount++;
              break;
            }
          }
        }

        // Add modifier weight up to +0.25 to break ties among high-coverage entries
        if (matchedNoiseCount > 0) {
          finalScore += (matchedNoiseCount / noiseQueryWords.length) * 0.25;
        }
      }

      // Save all matches to results without a filtering threshold minimum
      results.push({
        service: entry.original,
        code: entry.code,
        tariff: entry.tariff,
        score: Number(finalScore.toFixed(4))
      });
    }
  }

  // 4. Sort descending by score. The queryCoverage + modifier bonuses ensure 
  // that the most thoroughly related options win the top positions.
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}
return{
  normalizeAndSortRadiology,
  radiologyIgnore,
  searchRadiologyTop10,
}


}

function LabLord(){

  const laboratoryIgnore = new Set([
   // 1. Common Specimen / Fluid Types
  "serum", "plasma", "csf", "fluid", "mcs",
  "swab", "saliva", "tissue", "biopsy", "aspirate", "feces", "semen","stool","virus","blood",
  // 2. Test Formats, Panels, and Groupings
  "test", "tests", "profile", "panel", "screen","screens", "screening", "assay","donor",
  "level", "levels", "estimation", "analysis", "culture", 
  "sensitivity", "microscopy", "smear", "stain", "automated", "manual",

  // 3. Administrative / Method Modifiers
  "rapid", "stat", "routine", "quantitative", "qualitative", "total", 
  "free", "index", "ratio", "fasting", "random", "serial", "post", 
  "prandial", "timed", "24hr", "24-hour", "acute", "convalescent", 
  "aso","ige","iga","igg","igm","ig","ab","ag","as",

  // 4. General Connectors & Filler
  "for", "and", "in", "of", "with", "without", "against", "by"
]);

const labAliasMap = new Map([
  ["vdrl", ["venereal", "disease", "research", "laboratory"]],
  ["eucr",["electrolyte","urea","creatinine"]],
  ["rpr", ["rapid", "plasma", "reagin"]],
  ["tpha", ["treponema", "pallidum", "hemagglutination", "assay"]],
  ["crp", ["c-reactive", "protein"]],
  ["ana", ["anti", "nuclear", "antibody"]],
  ["hiv", ["human", "immunodeficiency", "virus"]],
  ["hbv", ["hepatitis", "b", "virus"]],
  ["hcv", ["hepatitis", "c", "virus"]],
  ["hbsag", ["hepatitis", "b", "surface", "antigen"]],
  /* ["sag", ["surface", "antigen"]],
  ["sab", ["surface", "antibody"]],
  ["Cab", ["", "antibody"]], */
  ["hbsab", ["hepatitis", "b", "surface", "antibody"]],
  ["hbeag", ["hepatitis", "b", "e", "antigen"]],
  ["hp", ["helicobacter", "pylori"]],
  ["h-pylori", ["helicobacter", "pylori"]],
  ["mp", ["malaria", "parasite"]],
  ["hep", ["hepatitis"]],

  ["fbc", ["full", "blood", "count"]],
  ["cbc", ["complete", "blood", "count"]],
  ["pbf", ["peripheral", "blood", "film"]],
  ["pcv", ["packed", "cell", "volume"]],
  ["wbc", ["white", "blood", "cells"]],
  ["rbc", ["red", "blood", "cells"]],
  ["plt", ["platelets"]],
  ["esr", ["erythrocyte", "sedimentation", "rate"]],
  ["twbc", ["total", "white", "blood", "count"]],
  ["diff", ["differential", "count"]],
  ["mcv", ["mean", "corpuscular", "volume"]],
  ["mch", ["mean", "corpuscular", "hemoglobin"]],
  ["mchc", ["mean", "corpuscular", "hemoglobin", "concentration"]]
  // ... continue the rest the same way
]);

function normalizeAndSortLab(text) {
  console.log(text)
  if (!text) return []; // Returning an empty array to match your split() return type

  let cleaned = text.toLowerCase()
    // 1. Remove forward slashes completely so "w/o" becomes "wo" or "u/e" becomes "ue"
    .replace(/\//g, "")
    // 2. Turn all other non-alphanumeric characters into spaces
    .replace(/[^a-z0-9\s]/g, " ")
    // 3. Collapse multiple spaces down to a single space
    .replace(/\s+/g, " ")
    .trim();

  let ty= cleaned.split(" ").sort();
const rt=ty.indexOf('hep')
if (rt !==-1) {
  ty[rt]="hepatitis"
}
  return ty
}


function searchLaboratoryTop10(queryTokens) {
  if (!queryTokens || queryTokens.length === 0) return [];

  const results = [];

  // 1. Normalize query tokens to lowercase arrays safely
  const queryWords = queryTokens.map(w => w.toLowerCase().trim()).filter(w => w.length > 0);
  if (queryWords.length === 0) return [];

  // Separate query into core vs noise arrays using your laboratoryIgnore Set
  let coreQueryWords = queryWords.filter(word => !laboratoryIgnore.has(word));
  let noiseQueryWords = queryWords.filter(word => laboratoryIgnore.has(word));

  // Fallback: If everything typed was a modifier (e.g. "blood test"), treat them as core
  if (coreQueryWords.length === 0) {
    coreQueryWords = noiseQueryWords;
    noiseQueryWords = [];
  }

  // 2. Loop through your pre-tokenized database rows
  for (const entry of indexedEntries) {
    const entryOriginalLower = entry.original.toLowerCase().trim();
    
    // Extract core vs noise arrays for the database entry
    const coreEntryWords = entry.tokens.filter(item => !item.isNoise).map(item => item.text.toLowerCase());
    const noiseEntryWords = entry.tokens.filter(item => item.isNoise).map(item => item.text.toLowerCase());

    let maxAcronymScore = 0;
    let totalWordScore = 0;
    let matchedWordsCount = 0;
    let matchedEntryWords = new Set();

    /* ---------------- PASS 1: ACRONYM INITIALS MATCHING ---------------- */
    if (coreQueryWords.length === 1) {
      const acronymInitials = coreEntryWords.map(w => w[0]).join("");
      if (acronymInitials === coreQueryWords[0] || entryOriginalLower.replace(/[^a-z0-9]/g, "").startsWith(coreQueryWords[0])) {
        maxAcronymScore = 0.95;
      } else {
        // Run a quick fuzzy acronym check in case of a small typo (e.g., "pvc" vs "pcv")
        const acronymSimilarity = getLevenshteinSimilarity(coreQueryWords[0], acronymInitials);
        if (acronymSimilarity >= 0.66) {
          maxAcronymScore = 0.85 * acronymSimilarity;
        }
      }
    }

    /* ---------------- PASS 2: TOKEN-BY-TOKEN CROSS CHECK ---------------- */
   
    for (const qWord of coreQueryWords) {
      let maxWordScore = 0;
      let bestEntryMatch = null;

      for (const eWord of coreEntryWords) {
        if (matchedEntryWords.has(eWord)) continue; // Don't double-pair a word

        const currentScore = getLevenshteinSimilarity(qWord, eWord);
        if (currentScore > maxWordScore) {
          maxWordScore = currentScore;
          bestEntryMatch = eWord;
        }
      }

      // If the word resemblance is solid, lock it in as a match
      if (maxWordScore >= 0.70) {
        totalWordScore += maxWordScore;
        matchedWordsCount++;
        if (bestEntryMatch) matchedEntryWords.add(bestEntryMatch);
      }
    }

    /* ---------------- PASS 3: ADAPTIVE GATING ---------------- */
    // Incorporating your match rules perfectly:
    // - 1 to 3 core words typed: Requires AT LEAST 1 solid match
    // - More than 3 core words typed: Requires AT LEAST 2 solid matches
    let requiredMatches = coreQueryWords.length > 3 ? 2 : 1;

    // If it didn't pass the word gate AND it didn't hit an acronym match, skip it!
    if (matchedWordsCount < requiredMatches && maxAcronymScore === 0) continue;

    /* ---------------- PASS 4: SCORING CALCULATION ---------------- */
    let finalScore = 0;

    if (matchedWordsCount > 0) {
      const matchAccuracy = totalWordScore / matchedWordsCount; // Precision of matched words
      const queryCoverage = matchedWordsCount / coreQueryWords.length; // How many typed terms matched
      
      // 60% weight on spelling precision, 40% weight on query coverage
      finalScore = (matchAccuracy * 0.6) + (queryCoverage * 0.4);
    }

    // Take the best score between the token match and the acronym match
    finalScore = Math.max(finalScore, maxAcronymScore);

    /* ---------------- PASS 5: NOISE MODIFIER BONUS ---------------- */
    // Add unique noise match calculations to break ties cleanly
    if (finalScore > 0.30 && noiseQueryWords.length > 0) {
      finalScore += calculateUniqueMatchScore(noiseEntryWords, noiseQueryWords);
    }

    // Save final qualified match to the results array
    if (finalScore >= 0.35) {
      results.push({
        service: entry.original,
        code: entry.code,
        tariff: entry.tariff,
        score: Number(Math.min(finalScore, 1.0).toFixed(4))
      });
    }
  }

  // 3. Sort descending from highest score to lowest and slice the top 10
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}

return {
  laboratoryIgnore,
  normalizeAndSortLab,
  searchLaboratoryTop10,
  labAliasMap,
}



}

function AccLord() {
  const accommodationIgnore = new Set([
  // 1. Generic Accommodation & Stay Fillers
  "accommodation", "stay", "stays", "admit", "admission", "admissions",
  "occupancy", "boarding", "lodging", "hospitalization", "inpatient", "ipd",

  // 2. Redundant Temporal Units & Frequency Modifiers
  "day", "days", "daily", "per-day", "perday", "night", "nights", "nightly",
  "week", "weekly", "hr", "hrs", "hour", "hours", "hourly", "diem", "per-diem",

  // 3. Billing, Charge, & Administrative Status
  "charge", "charges", "rate", "rates", "fee", "fees", "tariff", "tariffs",
  "cost", "price", "pricing", "bill", "billing", "deposit", "co-pay", "copay",
  "applicable", "routine","basic", "service", "services",

  // 4. Structural, Location, & Facility Tags
  "room", "rooms", "bed", "beds", "bedspace", "space", "unit", "units",
  "ward", "wards", "wing", "wings", "floor", "block", "clinic", "center", "centre",

  // 5. Connectors, Prepositions & Multipliers (Global Noise)
  "for", "and", "in", "of", "with", "without", "per", "a", "an", "the", "to",
  "x", "1", "one", "2", "two", "3", "three", "4", "four", "5", "five"
]);

const accommodationAliasMap = new Map([
  // --- PRIVATE WARD (Single Occupancy / Premium) ---
  ["1-bed", "private ward"],
  ["1bed", "private ward"],
  ["single bed", "private ward"],
  ["single room", "private ward"],
  ["private room", "private ward"],
  ["luxury", "private ward"],
  ["deluxe", "private ward"],
  ["suite", "private ward"],
  ["executive", "private ward"],
  ["vip", "private ward"],

  // --- SEMI-PRIVATE WARD (Shared / 2 to 4 Beds) ---
  ["2-bed", "semi-private ward"],
  ["2bed", "semi-private ward"],
  ["double bed", "semi-private ward"],
  ["double room", "semi-private ward"],
  ["twin bed", "semi-private ward"],
  ["twin room", "semi-private ward"],
  ["shared room", "semi-private ward"],
  ["3-bed", "semi-private ward"],
  ["4-bed", "semi-private ward"],
  ["4bed", "semi-private ward"],

  // --- GENERAL WARD (High Occupancy) ---
  ["general", "general ward"],
  ["public", "general ward"],
  ["multi-bed", "general ward"],
  ["open ward", "general ward"],
  ["communal", "general ward"],
  ["standard ward", "general ward"],
  ["5-bed", "general ward"],
  ["6-bed", "general ward"],

  // --- CRITICAL CARE & SPECIALIZED ---
  ["icu", "intensive care unit"],
  ["itu", "intensive care unit"],
  ["ccu", "coronary care unit"],
  ["nicu", "neonatal intensive care unit"],
  ["picu", "pediatric intensive care unit"],
  ["hdu", "high dependency unit"],
  
  // --- ISOLATION ---
  ["isolation", "isolation ward"],
  ["quarantine", "isolation ward"],
  ["negative pressure", "isolation ward"],
  ["infectious", "isolation ward"]
]);

function convertAccommodationForm(queryTokens) {
  // If no array or empty array passed, return an empty array
  if (!queryTokens || queryTokens.length === 0) return [];
  console.log(queryTokens)
  // 1. Join tokens to reconstruct the full string block for phrase matching
  let cleaned = queryTokens.join(" ").toLowerCase().replace(/\s+/g, " ").trim();

  // 2. Direct Phrase Check (Handles keys like "double bed" or "1-bed")
  if (accommodationAliasMap.has(cleaned)) {
    // Return the value split into a fresh token array
    return accommodationAliasMap.get(cleaned).split(" ");
  }

  // 3. Fallback Key Cross-Check (Scans inside the combined query)
  for (const [key, standardizedValue] of accommodationAliasMap.entries()) {
    if (cleaned.includes(key)) {
      return standardizedValue.split(" ");
    }
  }

  // 4. Fallback: If no match found, pass back the normalized original tokens array
  return cleaned.split(" ");
}
function normalizeAndSortAccom(text) {
  if (!text) return "";

  let cleaned = text.toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")


    .replace(/\s+/g, " ")
    .trim();

     return cleaned.split(" ").sort();

  
          
            
}

function searchAccomTop10(queryTokens) {
  if (!queryTokens || queryTokens.length === 0) return [];

  const results = [];

  // 1. Normalize query tokens to lowercase arrays safely
  const queryWords =convertAccommodationForm(queryTokens);
  if (queryWords.length === 0) return [];

  // Separate query into core vs noise arrays using your AccomIgnore Set
  let coreQueryWords = queryWords.filter(word => !accommodationIgnore.has(word));
  let noiseQueryWords = queryWords.filter(word => accommodationIgnore.has(word));

  // Fallback: If everything typed was a modifier (e.g. "blood test"), treat them as core
  if (coreQueryWords.length === 0) {
    coreQueryWords = noiseQueryWords;
    noiseQueryWords = [];
  }

  // 2. Loop through your pre-tokenized database rows
  for (const entry of indexedEntries) {
    const entryOriginalLower = entry.original.toLowerCase().trim();
    
    // Extract core vs noise arrays for the database entry
    const coreEntryWords = entry.tokens.filter(item => !item.isNoise).map(item => item.text.toLowerCase());
    const noiseEntryWords = entry.tokens.filter(item => item.isNoise).map(item => item.text.toLowerCase());

    let maxAcronymScore = 0;
    let totalWordScore = 0;
    let matchedWordsCount = 0;
    let matchedEntryWords = new Set();

    /* ---------------- PASS 1: ACRONYM INITIALS MATCHING ---------------- */
    // Checks if the user's search term matches the first letters of the database entry 
    // Example: "pcv" matching "P-acked C-ell V-olume"
    if (coreQueryWords.length === 1) {
      const acronymInitials = coreEntryWords.map(w => w[0]).join("");
      if (acronymInitials === coreQueryWords[0] || entryOriginalLower.replace(/[^a-z0-9]/g, "").startsWith(coreQueryWords[0])) {
        maxAcronymScore = 0.95;
      } else {
        // Run a quick fuzzy acronym check in case of a small typo (e.g., "pvc" vs "pcv")
        const acronymSimilarity = getLevenshteinSimilarity(coreQueryWords[0], acronymInitials);
        if (acronymSimilarity >= 0.66) {
          maxAcronymScore = 0.85 * acronymSimilarity;
        }
      }
    }

    /* ---------------- PASS 2: TOKEN-BY-TOKEN CROSS CHECK ---------------- */
    // The exact robust logic used in your drug matcher
    for (const qWord of coreQueryWords) {
      let maxWordScore = 0;
      let bestEntryMatch = null;

      for (const eWord of coreEntryWords) {
        if (matchedEntryWords.has(eWord)) continue; // Don't double-pair a word

        const currentScore = getLevenshteinSimilarity(qWord, eWord);
        if (currentScore > maxWordScore) {
          maxWordScore = currentScore;
          bestEntryMatch = eWord;
        }
      }

      // If the word resemblance is solid, lock it in as a match
      if (maxWordScore >= 0.70) {
        totalWordScore += maxWordScore;
        matchedWordsCount++;
        if (bestEntryMatch) matchedEntryWords.add(bestEntryMatch);
      }
    }

    /* ---------------- PASS 3: ADAPTIVE GATING ---------------- */
    // Incorporating your match rules perfectly:
    // - 1 to 3 core words typed: Requires AT LEAST 1 solid match
    // - More than 3 core words typed: Requires AT LEAST 2 solid matches
    let requiredMatches = coreQueryWords.length > 3 ? 2 : 1;

    // If it didn't pass the word gate AND it didn't hit an acronym match, skip it!
    if (matchedWordsCount < requiredMatches && maxAcronymScore === 0) continue;

    /* ---------------- PASS 4: SCORING CALCULATION ---------------- */
    let finalScore = 0;

    if (matchedWordsCount > 0) {
      const matchAccuracy = totalWordScore / matchedWordsCount; // Precision of matched words
      const queryCoverage = matchedWordsCount / coreQueryWords.length; // How many typed terms matched
      
      // 60% weight on spelling precision, 40% weight on query coverage
      finalScore = (matchAccuracy * 0.6) + (queryCoverage * 0.4);
    }

    // Take the best score between the token match and the acronym match
    finalScore = Math.max(finalScore, maxAcronymScore);

    /* ---------------- PASS 5: NOISE MODIFIER BONUS ---------------- */
    // Add unique noise match calculations to break ties cleanly
    if (finalScore > 0.30 && noiseQueryWords.length > 0) {
      finalScore += calculateUniqueMatchScore(noiseEntryWords, noiseQueryWords);
    }

    // Save final qualified match to the results array
    if (finalScore >= 0.35) {
      results.push({
        service: entry.original,
        code: entry.code,
        tariff: entry.tariff,
        score: Number(Math.min(finalScore, 1.0).toFixed(4))
      });
    }
  }

  // 3. Sort descending from highest score to lowest and slice the top 10
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}

return{
  accommodationIgnore,
  convertAccommodationForm,
  normalizeAndSortAccom,
  accommodationAliasMap,
  searchAccomTop10
}
}


function VaccLord() {
 const vaccineIgnore = new Set([
  // 1. Generic Vaccine & Immunization Fillers
  "vaccine", "vaccines", "vaccination", "vaccinations", "immunization", 
  "immunisations", "immunisation", "immunisations", "vax", "jab", "jabs",

  // 2. Administration Methods & Formats
  "shot", "shots", "injection", "injections", "inj", "dose", "doses", 
  "booster", "boosters", "vial", "vials", "ampoule", "oral", "nasal", "spray",

  // 3. Common Target Demographics / Age Groups
  "adult", "adults", "paediatric", "pediatric", "child", "children", 
  "infant", "infants", "baby", "babies", "toddler", "toddlers", "travel", "travelers",

  // 4. Clinical Schedules, Settings, & Status
  "schedule", "series", "course", "routine", "required", "mandatory", 
  "preventative", "prophylaxis", "clinic", "campaign", "dose-1", "dose-2",

  // 5. Connectors & Fillers (Global Noise)
  "for", "and", "in", "of", "with", "without", "against", "to", "by", "against",
  "1st", "2nd", "3rd", "1", "2", "3", "a", "an", "the"
]);



function normalizeAndSortVaccine(text) {
  if (!text) return "";

  let cleaned = text.toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")


    .replace(/\s+/g, " ")
    .trim();

     return cleaned.split(" ").sort();

  
          
            
}

function searchVaccineTop10(queryTokens) {
  if (!queryTokens || queryTokens.length === 0) return [];

  const results = [];

  // 1. Normalize query tokens to lowercase arrays safely
  const queryWords =queryTokens;
  if (queryWords.length === 0) return [];

  // Separate query into core vs noise arrays using your AccomIgnore Set
  let coreQueryWords = queryWords.filter(word => !vaccineIgnore.has(word));
  let noiseQueryWords = queryWords.filter(word => vaccineIgnore.has(word));

  // Fallback: If everything typed was a modifier (e.g. "blood test"), treat them as core
  if (coreQueryWords.length === 0) {
    coreQueryWords = noiseQueryWords;
    noiseQueryWords = [];
  }

  // 2. Loop through your pre-tokenized database rows
  for (const entry of indexedEntries) {
    const entryOriginalLower = entry.original.toLowerCase().trim();
    
    // Extract core vs noise arrays for the database entry
    const coreEntryWords = entry.tokens.filter(item => !item.isNoise).map(item => item.text.toLowerCase());
    const noiseEntryWords = entry.tokens.filter(item => item.isNoise).map(item => item.text.toLowerCase());

    let maxAcronymScore = 0;
    let totalWordScore = 0;
    let matchedWordsCount = 0;
    let matchedEntryWords = new Set();

    if (coreQueryWords.length === 1) {
      const acronymInitials = coreEntryWords.map(w => w[0]).join("");
      if (acronymInitials === coreQueryWords[0] || entryOriginalLower.replace(/[^a-z0-9]/g, "").startsWith(coreQueryWords[0])) {
        maxAcronymScore = 0.95;
      } else {
        // Run a quick fuzzy acronym check in case of a small typo (e.g., "pvc" vs "pcv")
        const acronymSimilarity = getLevenshteinSimilarity(coreQueryWords[0], acronymInitials);
        if (acronymSimilarity >= 0.66) {
          maxAcronymScore = 0.85 * acronymSimilarity;
        }
      }
    }

    /* ---------------- PASS 2: TOKEN-BY-TOKEN CROSS CHECK ---------------- */
    // The exact robust logic used in your drug matcher
    for (const qWord of coreQueryWords) {
      let maxWordScore = 0;
      let bestEntryMatch = null;

      for (const eWord of coreEntryWords) {
        if (matchedEntryWords.has(eWord)) continue; // Don't double-pair a word

        const currentScore = getLevenshteinSimilarity(qWord, eWord);
        if (currentScore > maxWordScore) {
          maxWordScore = currentScore;
          bestEntryMatch = eWord;
        }
      }

      // If the word resemblance is solid, lock it in as a match
      if (maxWordScore >= 0.70) {
        totalWordScore += maxWordScore;
        matchedWordsCount++;
        if (bestEntryMatch) matchedEntryWords.add(bestEntryMatch);
      }
    }

    /* ---------------- PASS 3: ADAPTIVE GATING ---------------- */
    // Incorporating your match rules perfectly:
    // - 1 to 3 core words typed: Requires AT LEAST 1 solid match
    // - More than 3 core words typed: Requires AT LEAST 2 solid matches
    let requiredMatches = coreQueryWords.length > 3 ? 2 : 1;

    // If it didn't pass the word gate AND it didn't hit an acronym match, skip it!
    if (matchedWordsCount < requiredMatches && maxAcronymScore === 0) continue;

    /* ---------------- PASS 4: SCORING CALCULATION ---------------- */
    let finalScore = 0;

    if (matchedWordsCount > 0) {
      const matchAccuracy = totalWordScore / matchedWordsCount; // Precision of matched words
      const queryCoverage = matchedWordsCount / coreQueryWords.length; // How many typed terms matched
      
      // 60% weight on spelling precision, 40% weight on query coverage
      finalScore = (matchAccuracy * 0.6) + (queryCoverage * 0.4);
    }

    // Take the best score between the token match and the acronym match
    finalScore = Math.max(finalScore, maxAcronymScore);

    /* ---------------- PASS 5: NOISE MODIFIER BONUS ---------------- */
    // Add unique noise match calculations to break ties cleanly
    if (finalScore > 0.30 && noiseQueryWords.length > 0) {
      finalScore += calculateUniqueMatchScore(noiseEntryWords, noiseQueryWords);
    }

    // Save final qualified match to the results array
    if (finalScore >= 0.35) {
      results.push({
        service: entry.original,
        code: entry.code,
        tariff: entry.tariff,
        score: Number(Math.min(finalScore, 1.0).toFixed(4))
      });
    }
  }

  // 3. Sort descending from highest score to lowest and slice the top 10
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}

return{
  vaccineIgnore,
  normalizeAndSortVaccine,
  searchVaccineTop10
}
}


const STRENGTH_REGEX = /\b(\d+[\d\s./%]*(?:mg|mls|ml|g|l|mcg|ug|iu|units|percent|perc|%)?)/i;
function LordForAll() {
  function normalizeAndSortAll(text) {
    if (!text) return [];
      let result = formReplace(text.toLowerCase())
    .toLowerCase()
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ")
          .trim();
result =formReplace(result);
    return result.split(" ").sort();
  }

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

const IgnoreList=new Set([
  
  // -------------------------
  // BASIC DOSAGE FORMS
  // -------------------------
  "tablet", "tablets", "tab", "tabs","co",
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
  "bottle",,
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
     "first",
  "second",
  "third",
  "fourth",
  "fifth",
  "1st",
  "2nd",
  "3rd",
  "4th",
  "5th",
  // 1. Generic Vaccine & Immunization Fillers
  "vaccine", "vaccines", "vaccination", "vaccinations", "immunization", 
  "immunisations", "immunisation", "immunisations", "vax", "jab", "jabs",

  // 2. Administration Methods & Formats
  "shot", "shots", "injection", "injections", "inj", "dose", "doses", 
  "booster", "boosters", "vial", "vials", "ampoule", "oral", "nasal", "spray",

  // 3. Common Target Demographics / Age Groups
  "adult", "adults", "paediatric", "pediatric", "child", "children", 
  "infant", "infants", "baby", "babies", "toddler", "toddlers", "travel", "travelers",

  // 4. Clinical Schedules, Settings, & Status
  "schedule", "series", "course", "routine", "required", "mandatory", 
  "preventative", "prophylaxis", "clinic", "campaign", "dose-1", "dose-2",

  // 5. Connectors & Fillers (Global Noise)
  "for", "and", "in", "of", "with", "without", "against", "to", "by", "against",
  "1st", "2nd", "3rd", "1", "2", "3", "a", "an", "the",
   // 1. Generic Accommodation & Stay Fillers
  "accommodation", "stay", "stays", "admit", "admission", "admissions",
  "occupancy", "boarding", "lodging", "hospitalization", "inpatient", "ipd",

  // 2. Redundant Temporal Units & Frequency Modifiers
  "day", "days", "daily", "per-day", "perday", "night", "nights", "nightly",
  "week", "weekly", "hr", "hrs", "hour", "hours", "hourly", "diem", "per-diem",

  // 3. Billing, Charge, & Administrative Status
  "charge", "charges", "rate", "rates", "fee", "fees", "tariff", "tariffs",
  "cost", "price", "pricing", "bill", "billing", "deposit", "co-pay", "copay",
  "applicable", "routine","basic", "service", "services",

  // 4. Structural, Location, & Facility Tags
  "room", "rooms", "bed", "beds", "bedspace", "space", "unit", "units",
  "ward", "wards", "wing", "wings", "floor", "block", "clinic", "center", "centre",

  // 5. Connectors, Prepositions & Multipliers (Global Noise)
  "for", "and", "in", "of", "with", "without", "per", "a", "an", "the", "to",
  "x", "1", "one", "2", "two", "3", "three", "4", "four", "5", "five",
   // 1. Common Specimen / Fluid Types
  "serum", "plasma", "csf", "fluid", "mcs",
  "swab", "saliva", "tissue", "biopsy", "aspirate", "feces", "semen","stool","virus","blood",
  // 2. Test Formats, Panels, and Groupings
  "test", "tests", "profile", "panel", "screen","screens", "screening", "assay","donor",
  "level", "levels", "estimation", "analysis", "culture", 
  "sensitivity", "microscopy", "smear", "stain", "automated", "manual",

  // 3. Administrative / Method Modifiers
  "rapid", "stat", "routine", "quantitative", "qualitative", "total", 
  "free", "index", "ratio", "fasting", "random", "serial", "post", 
  "prandial", "timed", "24hr", "24-hour", "acute", "convalescent", 
  "aso","ige","iga","igg","igm","ig","ab","ag","as",

  // 4. General Connectors & Filler
  "for", "and", "in", "of", "with", "without", "against", "by",
  // 1. Core Imaging Modalities & Shorthand
  "xray", "x-ray", "uss", "ultrasound", "ultrasonography", "sonar", "scan",
  "ct", "mri", "mra", "pet", "fluoroscopy", "", "",
   "tomography", "radiography", "imaging",
  
  // 2. Views, Postures, and Anatomical Planes
  "ap", "pa", "lateral", "lat", "oblique", "view", "views", "axial", 
  "sagittal", "coronal", "erect", "supine", "bilateral", "unilateral","single","double",

  // 3. Contrast & Technical Modifiers
  "contrast", "with", "without", "w", "wo", "iv", "gadolinium", "dye",
  "digital", "computed", "magnetic", "resonance", "resonance", "doppler", 
  "duplex", "color", "high", "resolution", "hrct", "3d", "4d",

  // 4. General Medical/Administrative Filler
  "routine", "urgent", "special", "guided", "guidance", "under", "procedure",
  "report", "film", "films", "screening", "diagnostic", "check", "and",
   // Generic Action Verbs
  "procedure", "procedures", "surgery", "operation", "management",
  "treatment", "excision", "incision", "repair", "removal", "fixation",
  "drainage", "biopsy", "resection", "closure", "reconstruction", "applied","minor","major","intermediate",
"fee","fees","global","block",
  
  // Operational Modifiers
  "stage", "stages", "under", "with", "without", "and", "for", "via","of", 
  "approach", "status", "unilateral", "bilateral", "including", "except"
]);

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

  pcm: "paracetamol",
  "mls":"ml"
};

function LordFuzzy(query){
 
   // Extract core vs noise arrays for the database entry
    const coreQueryWords = query.tokens.filter(item => !item.isNoise).map(item => item.text.toLowerCase()).join("");
    const noiseQueryWords = query.tokens.filter(item => item.isNoise).map(item => item.text.toLowerCase());
    
    const queryLen = coreQueryWords.length;
    const rtg = [];

    // Loop through the pre-computed dictionary
    for (const [search, item] of indexedEntries.entries()) {
      const targetCore = item.coreString;
      
      // FAST FAIL: If the length difference is too large, it's mathematically 
     
      if (Math.abs(targetCore.length - queryLen) > Math.ceil(queryLen * 0.5)) {
        continue; 
      }

      // Calculate score only for reasonably matched string lengths
      let score = getLevenshteinSimilarity(targetCore, coreQueryWords);

      if (score > 0.5) {
        let extra = calculateUniqueMatchScore(item.noiseArray, noiseQueryWords);
        if (extra==0) {
          score = score -0.25;
        }else{ score = score + extra;}
       
        rtg.push({ score:score.toFixed(2),service:item['state'], code: item.code });
      }
    }

    // Sort by score descending and return top 10
    return rtg.sort((a, b) => b.score - a.score).slice(0, 10);
  }

  return {
    normalizeAndSortAll,
    LordFuzzy,
    IgnoreList
  };
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
       const cart=cartegory.toUpperCase();

    console.log(cart)
    if(dictionary ===null){
      const res = await fetch("/api/hospital-pharmacy");
      const json = await res.json();
       const ret = json.data;
      rf = json.bad;
      ///GETTING ALL RECORDS FOR CATEGORY NOT FOUND
       const resAll = await fetch("/api/hospital-pharmacy-All");
      const jsonAll = await resAll.json();
       
       if (ret[cart]== undefined) {
        dictionary=jsonAll.bad
     
      }else if (cart =="VACCINES") {
          dictionary=ret["PHARMACY"];
      }
      else{dictionary=ret[cart];}
     
      


      switch (cart) {
        case 'PHARMACY':
              drut()
          break;
        case 'CONSULTATION':
                 const ConLord = ConsultLord();
                 dictionary.forEach((p,i) => {p['DESCRIPTION']=ConLord.consultNormalizeAndSort(p['DESCRIPTION']); }); 
                 consulp(ConLord);
        break;
         case 'SERVICES':
                 const ProcLord = ProcedureLord();
                 dictionary.forEach((p,i) => {p['DESCRIPTION']=ProcLord.normalizeAndSortProcedures(p['DESCRIPTION']); }); 
                  Procedu(ProcLord);
        break;

        case "RADIOLOGY":
                const RadioLord= RadLord();
                dictionary.forEach((p,i) => {p['DESCRIPTION']=RadioLord.normalizeAndSortRadiology(p['DESCRIPTION']); }); 
                Radiol(RadioLord);
        break;
        case "LABORATORY":
                const LaborLord= LabLord();
                dictionary.forEach((p,i) => {p['DESCRIPTION']=LaborLord.normalizeAndSortLab(p['DESCRIPTION']); }); 
                Labor(LaborLord);
        break;
         case "ACCOMMODATION":
                const AccomLord= AccLord();
                dictionary.forEach((p,i) => {p['DESCRIPTION']=AccomLord.normalizeAndSortAccom(p['DESCRIPTION']); }); 
               
                Accom(AccomLord);
        break;
         case "VACCINES":
                const VaccomLord= VaccLord();
                dictionary.forEach((p,i) => {p['DESCRIPTION']=VaccomLord.normalizeAndSortVaccine(p['DESCRIPTION']); }); 
                
                Vacc(VaccomLord);
        break;
        default:
           const Lord = LordForAll();
                dictionary.forEach((p) => {p['state']=p[1]; p[1]=Lord.normalizeAndSortAll(p[1]); }); 
                Mapcc(dictionary)
      }



      self.postMessage({ type: "loaded" });
    }
  } 
  
  
  
  if (type === "search") {

    if (!dictionary) return;
    const {data,cartegory} =e.data; 

    const cart=cartegory.toUpperCase();
        switch (cart) {


          case 'PHARMACY':
            const drugEngine = DrugLord();
                DrugReturn (data,drugEngine)
            break;


          case 'CONSULTATION':
            const ConLord = ConsultLord();
                  consReturn(data,ConLord)

            break;
          
         case "SERVICES":
             const procedureEngine = ProcedureLord();
                  procedureReturn(data,procedureEngine)
            break; 

             case "RADIOLOGY":
             const RadEngine = RadLord();
                  RadioReturn(data,RadEngine)
            break; 

             case "LABORATORY":
             const LabEngine = LabLord();
                  LaboReturn(data,LabEngine)
            break; 

             case "ACCOMMODATION":
             const AccEngine = AccLord();
                  AccReturn(data,AccEngine)
            break; 

             case "VACCINES":
             const VaccEngine = VaccLord();
                  VaccinReturn(data,VaccEngine)
            break; 

            default:
              MapAll(data)
        }
   

}

   
} 

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

for(const [B1,prop] of dupData.entries()){

   //EXACT MATCH
  const rtg = dictMap.get(B1);

  if (rtg !==undefined) {
      const realVT={id:prop['id'],service: rtg.DESCRIPTION, code: rtg.CODE, 'tariff':rtg.TARIFF,score: 1}
    
    
      const passer={id:prop['id'],parent:prop.SERVICE,matches:[realVT]};
    Matched.push(realVT)
   

   Allsearched.push(passer)

    dupData.delete(B1)
    dictMap.delete(B1)

    continue
  }else{
   const fuzz= drugEngine.smartFuzzyTop10(B1);
        if (fuzz.length > 0) {
      
          const passer={id:prop['id'],parent:B1,matches:fuzz}
           fuzz.forEach(f => {f['id']=prop['id'];Matched.push(f)});
            Allsearched.push(passer)
          fuzzyMatches.push(fuzz)
        }
          else{
            const passer={id:prop['id'],parent:B1,matches:[]}
              Allsearched.push(passer)
              notFound.push(B1);
        }
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
         
          return {original: item.DESCRIPTION.join(" "),code: item.CODE,tariff: item.TARIFF,tokens: weightedTokens};
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
                const real=rtg.DESCRIPTION.join(" ")
                const realVT={id:prop['id'],service: real, code: rtg.CODE, 'tariff':rtg.TARIFF,score: 1}
                const passer={id:prop['id'],parent:prop.SERVICE,matches:[realVT]};
            
              Matched.push(realVT)

            Allsearched.push(passer)

              dupData.delete(B1)
              dictMap.delete(B1)
                console.log(passer)

            }else{const fuzz= ConLord.smartFuzzyTop10(B1.split(" "))

               if (fuzz.length > 0) {
             
              const passer={id:prop['id'],parent:B1,matches:fuzz}
            fuzz.forEach(f => {f['id']=prop['id'];Matched.push(f)});
                Allsearched.push(passer)
              
            }else{
              const passer={id:prop['id'],parent:B1,matches:[]}
              Allsearched.push(passer)
              notFound.push(B1);
              
            }
            };
               
            }
            
            self.postMessage({type:'result',data:Allsearched,matched:Matched})
      }

      function Procedu(ProcLord) {
          indexedEntries=dictionary.map(item=>{
            const rawDescription = item.DESCRIPTION;
            const weightedTokens = rawDescription.map(word => ({
            text: word,
            isNoise: ProcLord.procedureIgnore.has(word)
          }));
         
          return {original: item.DESCRIPTION.join(" "),code: item.CODE,tariff: item.TARIFF,tokens: weightedTokens};
           }) 

      }

      function procedureReturn(data,procedureEngine) {
          const fuzzyMatches = [];
          const notFound = [];
          const Allsearched=[];
          const Matched=[];

            const dictMap = new Map( dictionary.map(item => [item.DESCRIPTION.join(" "),item]));
            let dupData =new Map(data.map(item => [procedureEngine.normalizeAndSortProcedures(item.SERVICE).join(" "),item]));
       
              for(const [B1,prop] of dupData.entries()){
                 //EXACT MATCH
            const rtg = dictMap.get(B1);
            if (rtg !==undefined) {
                const real=rtg.DESCRIPTION.join(" ")
                const realVT={id:prop['id'],service: real, code: rtg.CODE, 'tariff':rtg.TARIFF,score: 1}
                const passer={id:prop['id'],parent:prop.SERVICE,matches:[realVT]};
            
              Matched.push(realVT)

            Allsearched.push(passer)

              dupData.delete(B1)
              dictMap.delete(B1)

            }else{ const fuzz= procedureEngine.searchProceduresTop10(B1.split(" "))

               if (fuzz.length > 0) {
             
              const passer={id:prop['id'],parent:B1,matches:fuzz}
              
            fuzz.forEach(f => {f['id']=prop['id'];Matched.push(f)});
                Allsearched.push(passer)
              
            }else{
              const passer={id:prop['id'],parent:B1,matches:[]}
              Allsearched.push(passer)
              notFound.push(B1);
              
            }
            };
               
            }

            self.postMessage({type:'result',data:Allsearched,matched:Matched})
            
      }


        function Radiol(RadioLord) {
          indexedEntries=dictionary.map(item=>{
            const rawDescription = item.DESCRIPTION;
            const weightedTokens = rawDescription.map(word => ({
            text: word,
            isNoise: RadioLord.radiologyIgnore.has(word)
          }));
         
          return {original: item.DESCRIPTION.join(" "),code: item.CODE,tariff: item.TARIFF,tokens: weightedTokens};
           }) 

      }


      function RadioReturn(data,RadEngine) {
          const fuzzyMatches = [];
          const notFound = [];
          const Allsearched=[];
          const Matched=[];

            const dictMap = new Map( dictionary.map(item => [item.DESCRIPTION.join(" "),item]));
            let dupData =new Map(data.map(item => [RadEngine.normalizeAndSortRadiology(item.SERVICE).join(" "),item]));
       
              for(const [B1,prop] of dupData.entries()){
                 //EXACT MATCH
                 
            const rtg = dictMap.get(B1);
            if (rtg !==undefined) {
                const real=rtg.DESCRIPTION.join(" ")
                const realVT={id:prop['id'],service: real, code: rtg.CODE, 'tariff':rtg.TARIFF,score: 1}
                const passer={id:prop['id'],parent:prop.SERVICE,matches:[realVT]};
            
              Matched.push(realVT)

            Allsearched.push(passer)
            
              dupData.delete(B1)
              dictMap.delete(B1)

            }else{  const fuzz= RadEngine.searchRadiologyTop10(B1.split(" "))

               if (fuzz.length > 0) {
             
              const passer={id:prop['id'],parent:B1,matches:fuzz}

            fuzz.forEach(f => {f['id']=prop['id'];Matched.push(f)});
                Allsearched.push(passer)
              
            }else{
              const passer={id:prop['id'],parent:B1,matches:[]}
              Allsearched.push(passer)
              notFound.push(B1);
            } 
            };
               
            }
              console.log(notFound)
            self.postMessage({type:'result',data:Allsearched,matched:Matched})
            
      }


      function Labor(LaborLord) {
          indexedEntries=dictionary.map(item=>{
            const rawDescription = item.DESCRIPTION;
            const weightedTokens = rawDescription.map(word => ({
            text: word,
            isNoise: LaborLord.laboratoryIgnore.has(word)
          }));
         
          return {original: item.DESCRIPTION.join(" "),code: item.CODE,tariff: item.TARIFF,tokens: weightedTokens};
           }) 

      }

      function LaboReturn(data,LabEngine) {
         const fuzzyMatches = [];
          const notFound = [];
          const Allsearched=[];
          const Matched=[];

            const dictMap = new Map( dictionary.map(item => [LabEngine.labAliasMap.has(LabEngine.normalizeAndSortLab(item.original).join(" "))?LabEngine.labAliasMap.get(LabEngine.normalizeAndSortLab(item.original).join(" ")).join(" "):LabEngine.normalizeAndSortLab(item.original).join(" "),item]));
            let dupData =new Map(data.map(item => [LabEngine.labAliasMap.has(LabEngine.normalizeAndSortLab(item.SERVICE).join(" "))?LabEngine.labAliasMap.get(LabEngine.normalizeAndSortLab(item.SERVICE).join(" ")).join(" "):LabEngine.normalizeAndSortLab(item.SERVICE).join(" "),item]));
            
              for(const [B1,prop] of dupData.entries()){
                 //EXACT MATCH
                 
            const rtg = dictMap.get(B1);
            if (rtg !==undefined) {
                const real=rtg.DESCRIPTION.join(" ")
                const realVT={id:prop['id'],service: real, code: rtg.CODE, 'tariff':rtg.TARIFF,score: 1}
                const passer={id:prop['id'],parent:prop.SERVICE,matches:[realVT]};
            
              Matched.push(realVT)

            Allsearched.push(passer)
              dupData.delete(B1)
              dictMap.delete(B1)
              continue
            } else{
               const fuzz= LabEngine.searchLaboratoryTop10(B1.split(" "))

              if (fuzz.length > 0) {
              const passer={id:prop['id'],parent:B1,matches:fuzz}
                
            fuzz.forEach(f => {f['id']=prop['id'];Matched.push(f)});
                Allsearched.push(passer)
              
            }else{
              const passer={id:prop['id'],parent:B1,matches:[]}
              Allsearched.push(passer)
              notFound.push(B1);
              
            }  
            }; 

            }
              console.log(notFound)
            self.postMessage({type:'result',data:Allsearched,matched:Matched})
      }
      
        function Accom(AccLord) {
          indexedEntries=dictionary.map(item=>{
            const rawDescription = AccLord.convertAccommodationForm(item.DESCRIPTION);
            console.log(rawDescription)
            const weightedTokens = rawDescription.map(word => ({
            text: word,
            isNoise: AccLord.accommodationIgnore.has(word)
          }));
        
            return {original: item.DESCRIPTION.join(" "),code: item.CODE,tariff: item.TARIFF,tokens: weightedTokens};
           }) 

      }


      function AccReturn(data,AccEngine) {
          const fuzzyMatches = [];
          const notFound = [];
          const Allsearched=[];
          const Matched=[];

            const dictMap = new Map( dictionary.map(item => [item.DESCRIPTION.join(" "),item]));
            let dupData =new Map(data.map(item => [AccEngine.normalizeAndSortAccom(AccEngine.convertAccommodationForm(item.SERVICE.split(" ")).join(" ")).join(" "),item]));
       
              for(const [B1,prop] of dupData.entries()){
                 //EXACT MATCH
                 
            const rtg = dictMap.get(B1);

            if (rtg !==undefined) {
              const real=rtg.DESCRIPTION.join(" ")
                const realVT={id:prop['id'],service: real, code: rtg.CODE, 'tariff':rtg.TARIFF,score: 1}
              const passer={id:prop['id'],parent:prop.SERVICE,matches:[realVT]};
            
              Matched.push(realVT)

            Allsearched.push(passer)
            
              dupData.delete(B1)
              dictMap.delete(B1)

            }else{  const fuzz= AccEngine.searchAccomTop10(B1.split(" "))

               if (fuzz.length > 0) {
             
              const passer={id:prop['id'],parent:B1,matches:fuzz}

            fuzz.forEach(f => {f['id']=prop['id'];Matched.push(f)});
                Allsearched.push(passer)
              
            }else{
              const passer={id:prop['id'],parent:B1,matches:[]}
              Allsearched.push(passer)
              notFound.push(B1);
              
            } 
            };
               
            }
              console.log(notFound)
            self.postMessage({type:'result',data:Allsearched,matched:Matched})
            
      }


         function Vacc(VaccLord) {
          indexedEntries=dictionary.map(item=>{
            const rawDescription =item.DESCRIPTION;
            const weightedTokens = rawDescription.map(word => ({
            text: word,
            isNoise: VaccLord.vaccineIgnore.has(word)
          }));
        
            return {original: item.DESCRIPTION.join(" "),code: item.CODE,tariff: item.TARIFF,tokens: weightedTokens};
           }) 

      }


      function VaccinReturn(data,VaccEngine) {
          const fuzzyMatches = [];
          const notFound = [];
          const Allsearched=[];
          const Matched=[];

            const dictMap = new Map( dictionary.map(item => [item.DESCRIPTION.join(" "),item]));
            let dupData =new Map(data.map(item => [VaccEngine.normalizeAndSortVaccine(item.SERVICE).join(" "),item]));
       
              for(const [B1,prop] of dupData.entries()){
                 //EXACT MATCH
                 
            const rtg = dictMap.get(B1);

            if (rtg !==undefined) {
              const real=rtg.DESCRIPTION.join(" ")
                const realVT={id:prop['id'],service: real, code: rtg.CODE, 'tariff':rtg.TARIFF,score: 1}
              const passer={id:prop['id'],parent:prop.SERVICE,matches:[realVT]};
            
              Matched.push(realVT)

            Allsearched.push(passer)
            
              dupData.delete(B1)
              dictMap.delete(B1)

            }else{  const fuzz= VaccEngine.searchVaccineTop10(B1.split(" "))

               if (fuzz.length > 0) {
             
              const passer={id:prop['id'],parent:B1,matches:fuzz}

            fuzz.forEach(f => {f['id']=prop['id'];Matched.push(f)});
                Allsearched.push(passer)
              
            }else{
              const passer={id:prop['id'],parent:B1,matches:[]}
              Allsearched.push(passer)
              notFound.push(B1);
              
            } 
            };
               
            }
              console.log(notFound)
            self.postMessage({type:'result',data:Allsearched,matched:Matched})
            
      }

    // 2. Pre-compute the core and noise strings when compiling the dictionary
function Mapcc(dictionary) {
  const Lord=LordForAll()
  indexedEntries= new Map(dictionary.map(item => {
    const rawDescription = item[1];
    
    const weightedTokens = rawDescription.map(word => {
      const isNoise = Lord.IgnoreList.has(word) || STRENGTH_REGEX.test(word);
      return { text: word, isNoise: isNoise };
    });

    // PRE-COMPUTE: Do this once here, not during the fuzzy search loop!
    const coreString = weightedTokens.filter(t => !t.isNoise).map(t => t.text.toLowerCase()).join("");
    const noiseArray = weightedTokens.filter(t => t.isNoise).map(t => t.text.toLowerCase());

    return [rawDescription.join(""), {
      revamp: rawDescription,
      code: item[0],
      state: item["state"],
      tokens: weightedTokens,
      coreString: coreString,   // Stored for instant access
      noiseArray: noiseArray    // Stored for instant access
    }];
  }));
}
     
function MapAll(data) {
  const Lord = LordForAll();
  const notFound = [];
  const Allsearched = [];
  const Matched = [];

  let dupData = new Map(data.map((item) => {
    const desc = Lord.normalizeAndSortAll(item['SERVICE']);
    const weighed = desc.map((word) => {
      const isNoise = Lord.IgnoreList.has(word) || STRENGTH_REGEX.test(word);
      return { text: word, isNoise: isNoise };
    });
    item['tokens'] = weighed;
    return [desc.join(""), item];
  }));

  for (const [B1, prop] of dupData.entries()) {
    // EXACT MATCH
    const rtg = indexedEntries.get(B1);

    if (rtg !== undefined) {
      const real = rtg.state;
      const realVT = { id: prop['id'], service: real, code: rtg.code, score: 1 };
      const passer = { id: prop['id'], parent: prop.SERVICE, matches: [realVT] };

      Matched.push(realVT);
      Allsearched.push(passer);
      
      dupData.delete(B1);
      
      indexedEntries.delete(B1); 
       
      continue;
    } else {
      // Pass indexedEntries explicitly to the fuzzy matcher
      const fuzz = Lord.LordFuzzy(prop, indexedEntries);
      
      if (fuzz.length > 0) {
        const passer = { id: prop['id'], parent: B1, matches: fuzz };
        fuzz.forEach(f => { f['id'] = prop['id']; Matched.push(f); });
        Allsearched.push(passer);
         
      } else {
        const passer = { id: prop['id'], parent: B1, matches: [] };
        Allsearched.push(passer);
        notFound.push(B1);
      }
    }
  }
 self.postMessage({ type: 'result', data: Allsearched, matched: Matched });

}
let dictionary = null;
let indexedEntries;

function firstTwoLettersMatch(a, b) {
  const aRR = a.map(item => item.slice(0, 2));
  const bRR = b.map(item => item.slice(0, 2));
  return aRR.some(item => bRR.includes(item));
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

/*function searchProceduresTop10(searchTerm) {
  // 1. Check if query tokens exist
  const queryTokens = searchTerm; // Assuming this is already an array of string tokens passed in
  if (!queryTokens || queryTokens.length === 0) return [];

  // 2. Tag the incoming query words as Core vs Noise
  const weightedQuery = queryTokens.map(word => ({
    text: word,
    isNoise: procedureIgnore.has(word)
  }));

  // Separate them into flat word arrays
  let coreQueryWords = weightedQuery.filter(item => !item.isNoise).map(item => item.text);
  let noiseQueryWords = weightedQuery.filter(item => item.isNoise).map(item => item.text);

  // CRITICAL GATE: Exit if there are no core anatomical keywords
  if (coreQueryWords.length === 0) return [];

  const results = [];

  // 3. Loop through your pre-tokenized database rows
  for (const entry of indexedEntries) {
    const coreEntryWords = entry.tokens.filter(item => !item.isNoise).map(item => item.text);
    if (coreEntryWords.length === 0) continue;

    let totalCoreScore = 0;
    let matchedWordsCount = 0;

    // Track which database words have already been matched to avoid double-counting
    let matchedEntryWords = new Set();

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

      // LOOSE SPELLING GATE: We accept anything above 70% as a valid keyword connection!
      if (maxWordScore >= 0.70) {
        totalCoreScore += maxWordScore;
        matchedWordsCount++;
        if (bestEntryWordMatch) {
          matchedEntryWords.add(bestEntryWordMatch); // Lock this database word
        }
      }
    }

  
    const requiredMatches = coreQueryWords.length === 1 
      ? 1 
      : Math.max(2, Math.ceil(coreQueryWords.length * 0.5));

    // Hard Gate: Skip the item entirely if it doesn't hit the dynamic threshold requirement
    if (matchedWordsCount < requiredMatches) continue;


  
    let finalScore = 0;

    if (matchedWordsCount > 0) {
      // Score based on how well the matched words scored individually
      const matchAccuracy = totalCoreScore / matchedWordsCount;
      
      // Calculate how much of the dataset entry we successfully covered
      const entryCoverage = matchedWordsCount / coreEntryWords.length;

      // Combine them: rewarding high spelling accuracy and high coverage
      finalScore = (matchAccuracy * 0.7) + (entryCoverage * 0.3);
    }

    // Secondary threshold gate to keep bad matching scores from bleeding into results
    if (finalScore >= 0.50) {
    
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

        if (matchedNoiseCount > 0) {
          finalScore += (matchedNoiseCount / noiseQueryWords.length) * 0.25;
        }
      }

      // Record Packaging
      results.push({
        service: entry.original,
        code: entry.code,
        tariff: entry.tariff,
        score: Number(finalScore.toFixed(4))
      });
    }
  }

  // 5. Sort and return the top 10 matches
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}  */
function ProcedureLord() {
  /* CORE SMART FUZZY SEARCH ENGINE                      */
function searchProceduresTop10(searchTerm) {
  // 1. Check if query tokens exist
  const queryTokens = searchTerm; // Assuming this is an array of string tokens passed in
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
         case 'SERVICES':
                 const ProcLord = ProcedureLord();
                 dictionary.forEach((p,i) => {p['DESCRIPTION']=ProcLord.normalizeAndSortProcedures(p['DESCRIPTION']); }); 
                  Procedu(ProcLord);
        break;
        default:
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

            break;
          
         case "SERVICES":
             const procedureEngine = ProcedureLord();
                  procedureReturn(data,procedureEngine)
            break; 

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
                const realVT={id:prop['id'],service: rtg.DESCRIPTION, code: rtg.CODE, 'tariff':rtg.TARIFF,score: 1}
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
              notFound.push(B1);
              
            }
            };
               
            }
            console.log(notFound)
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
                const realVT={id:prop['id'],service: rtg.DESCRIPTION, code: rtg.CODE, 'tariff':rtg.TARIFF,score: 1}
              const passer={id:prop['id'],parent:prop.SERVICE,matches:[realVT]};
            
              Matched.push(realVT)

            Allsearched.push(passer)

              dupData.delete(B1)
              dictMap.delete(B1)

            }else{ const fuzz= procedureEngine.searchProceduresTop10(B1.split(" "))

               if (fuzz.length > 0) {
             
              const passer={id:prop['id'],parent:B1,matches:fuzz}
              console.log(passer)
            fuzz.forEach(f => {f['id']=prop['id'];Matched.push(f)});
                Allsearched.push(passer)
              
            }else{
              notFound.push(B1);
              
            }
            };
               
            }

            self.postMessage({type:'result',data:Allsearched,matched:Matched})
            
      }
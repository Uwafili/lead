<!-- filepath: c:\Users\Bishop\lead\resources\views\post\index.blade.php -->
@extends('layouts.layout')
@section('content')
<h1 class="text-3xl font-extrabold text-center mb-8 text-yellow-900 drop-shadow">It's Mapping Time</h1>

<!-- Text Slideshow -->
<div id="text-slideshow" class="w-full flex justify-center mb-8">
    <div
        id="slide-text"
        class="text-2xl md:text-2xl font-mono font-bold text-yellow-800 shadow-lg min-h-[70px] flex items-center justify-center px-6 py-4 rounded-xl bg-white bg-opacity-70 transition-opacity duration-700 opacity-100"
        style="will-change: opacity, transform; letter-spacing: 1px;"
    >
        Welcome to PMU Kitchen!
    </div>
</div>

<div id="container" class="flex justify-center items-center mt-8">
    <form action="" method="POST" enctype="multipart/form-data" class="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        @csrf
        <label class="block mb-2 text-sm font-medium text-gray-700" for="file">Choose file</label>
        <input type="file" name="file" id="file" class="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-400 mb-4" required>
        <button type="submit" class="w-full px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition">Upload</button>
    </form>
</div>

<script>
    const slides = [
        "Welcome to PMU Kitchen!",
        "We fried confusion till it turned golden brown.",
        "Contact bring request, we bring table spoon let’s eat!",
        "We roast tariff so well, even HR wan promote us to Kitchen Manager.",
        "Leadway don turn kitchen—tariff no fit survive!",
        "From Security post to Driver’s seat, from HR desk to ICT unit everybody dey chop this PMU stew!",
        "No be every chef dey wear apron some dey wear ID card.",
        "Light matter? Leave am for PMU kitchen e go don dey boil.",
        "If you no sabi mapping, no near our kitchen—e fit burn you!",
        "If claims confuse you, call PMU. We don add crayfish to your bill.",
        "Tariff wey bend, we straighten am like cleaner straighten table mat!",
        "Tariff enter wrong lane, Driver Unit reverse am sharp sharp!",
        "We no dey shout 'Up NEPA' we dey whisper 'Check your spreadsheet'",
        "One tariff try hide, we find am under sheet 6!",
        "We cook am so good, even Finance ask if we dey invoice NEPA!",
        "We no just cook tariff, we dey serve am with dispatch form!",
        "If confusion show face, PMU go chop am like fried plantain!",
        "We no dey chop rice, na tariff we dey slice!",
        "No gas, no stove, no NEPA just raw brain and Google Sheets!",
        "Chef by day, tariff slayer by night.",
        "We dey fry confusion with small audit oil e go come crisp!",
        "We roast tariff so well, even Legal Unit no fit object!",
        "We don’t use firewood. We use formulas.",
        "From PMU Kitchen to All Units: We don cook di light matter come chop clarity!",
        "Excel dey smoke, NEPA dey shock na we dey cook am like that!",
        "This data na correct pot of stew—one mistake and Audit go faint!",
        "Tariff choke? We loosen am like tight pot cover!",
        "Who need firewood when tariff heat dey enough?",
        "PHCN price dey run? We don hold am like thief for Oshodi!",
        "We no be chefs, but we dey cook data like Sunday stew!",
        "Omo, Excel nearly catch fire—tariff too plenty!",
        "Tariff wan enter coma, we use mapping revive am!",
        "We cook tariff until even the pot fear!",
        "Our data sheet sweet pass Claims spreadsheet—and e no even get error!",
        "PMU don cook tariff soup, and even Claims Unit dey rush am like jollof at wedding!",
        "No apron needed, we wear Excel sheets!",
        "Tariff dey stubborn? We call Security make dem bounce am from spreadsheet!",
        "We dey cook numbers, no gas leakage!",
        "Make dem no stress—our mapping sweet like Sunday rice!",
        "Tariff wan form jagaban? We don grind am like ogbono!",
        "Tariff too salty? We balanced am with pepper.",
        "We slice NEPA bills like Provider Relations dey slice onboarding forms!",
        "No recipe, no measurement—but Underwriting Unit go still approve am!",
        "We map tariff till Drivers begin ask if e be fuel price!",
        "This mapping hot pass Ops Team wey dey fix 20 issues before 9am!",
        "Even Internal Control no fit find error inside this stew of tariff!",
        "Even Enrollment Team no sabi register tariff like this!",
        "Our spreadsheet sharp pass Drivers’ steering—one mistake, e go turn corner!",
        "Tariff dey stress us? We hand am over to Customer Service make them hold for 30 minutes.",
        "We put sense inside nonsense tariffs.",
        "If tariff too stubborn, we escalate am to Management with correct soup spoon!",
        "Claims price high? We call Tech Team to reboot the stove!",
        "We roast tariffs, not just plantain.",
        "No recipe? No wahala. We cook with data.",
        "Our Excel sheet dey smoke like suya stand.",
        "Chef Team reporting live from PHCN HQ.",
        "Tariff too high? We added pepper!",
        "Data stew ready. Come chop!",
        "Make tariff form anyhow, Customer Service go still smile serve am!",
        "We mapped faster than NEPA flashes light!",
        "We dey blend confusion like Cleaning Unit dey blend air freshener!",
        "We don’t cook stew, we cook state tariffs.",
        "Even Legal Team dey fear this stew—‘objection overruled by pepper!’",
        "When NEPA off light, we use Claims folder fan the stove.",
        "We serve clarity like cafeteria serve eba—fast, hot and heavy!",
        "This mapping na like jollof—everyone wan collect take-away!"
    ];

    // Shuffle slides for random order
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    shuffle(slides);

    let current = 0;
    const slideText = document.getElementById('slide-text');

    function showSlide(next) {
        // Fade out and slide left
        slideText.style.opacity = 0;
        slideText.style.transform = "translateX(40px)";
        setTimeout(() => {
            slideText.textContent = slides[next];
            // Fade in and slide right
            slideText.style.transform = "translateX(-40px)";
            setTimeout(() => {
                slideText.style.opacity = 1;
                slideText.style.transform = "translateX(0)";
            }, 50);
        }, 700);
    }

    setInterval(() => {
        current = (current + 1) % slides.length;
        showSlide(current);
    }, 7000);
</script>
@endsection

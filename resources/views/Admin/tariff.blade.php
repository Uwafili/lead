@extends('layouts.layout')
@section('content')

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
  <style>
  .dropdown-item {
    @apply px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 cursor-pointer;
  }
</style>
</head>
<body>
  


@push('script')
<script src="{{ asset('js/tariffHandler.js') }}"></script>
@endpush
<div class="overflow-x-auto bg-white rounded-lg shadow">

<!-- Sticky Wrapper -->
<div class="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-200">

  <!-- Toolbar -->
  <div class="max-w-full px-4 py-3">
    <div class="flex flex-wrap items-center gap-3">



      <!-- Reduce Price -->
      <button id="reducePrice" class="px-3 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600">Reduce Price</button>
      <input type="number" placeholder="%" class="RedInp w-32 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-red-400"/>
  <!-- Divider -->
      <div class="hidden md:block h-6 w-px bg-gray-300 mx-2"></div>
        
      <!-- Increase Price -->
      <button id="increasePrice" class="px-3 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600">Increase Price</button>
        <input type="number" placeholder="%" class="w-32 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-red-400 INInp"/>


         <!-- Filter Dropdown -->
    <div class="relative">
        <button id="filter" class="px-3 py-2 text-sm bg-gray-100 rounded-md hover:bg-gray-200 flex items-center gap-1">
          Filter
          <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <!-- Dropdown Menu -->
        <div id="dropFilt" class="absolute  right-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg hidden group-hover:block">
         
       <div class="relative group">
            <button class="w-full text-left px-4 py-2 hover:bg-gray-100 flex justify-between items-center">Price<svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg> </button>

            <!-- Price Nested Dropdown -->
            <div class="absolute top-0 left-full mt-0 ml-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg hidden group-hover:block">
                <label class="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100" id="decPri">Decending</label>
                <label class="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100" id="ascPri">Ascending</label>
            
            </div>
          </div>

          <!-- Negotiation Filter -->
          <div class="relative group">
            <button class="w-full text-left px-4 py-2 hover:bg-gray-100 flex justify-between items-center">Negotiation<svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /> </svg></button>

            <!-- Negotiation Nested Dropdown -->
            <div class="absolute top-0 left-full mt-0 ml-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg hidden group-hover:block">
              <label class="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100" id="NN">Not Negotiated</label>
              <label class="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100" id="Ne" >Negotiated</label>
            </div>
          </div>

        </div>
      </div>


   
      <!-- Spacer -->
      <div class="flex-1"></div>

      <!-- Search -->
      <input id="sech" type="text"placeholder="Search..."  class="w-48 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"/>
      <button class="px-3 py-2 text-sm bg-gray-100 rounded-md hover:bg-gray-200">Reset</button>

    </div>
  </div>
</div>


    <div id="successAlert" class="hidden fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg">
        Updated successfully!
    </div>
<div class="w-full">
  <div class="flex justify-between mb-1 text-sm font-medium text-gray-700">
    <span>Progress</span>
    <span class="stySho">0%</span>
  </div>

  <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
    <div id="stWi"
      class="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500"
      style="width: 0%;"
    ></div>
  </div>
</div>


    <table class="min-w-full divide-y divide-gray-200">
       <thead class="bg-orange-50">
    <tr>
        <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">Service</th>
        <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">Stated Price</th>
        <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">Requested Price</th>
        <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
        <th class="px-6 py-3 text-center text-sm font-medium text-gray-700">Action</th>
        <th class="px-6 py-3 text-center text-sm font-medium text-gray-700"><input type="checkbox" id="selectAll" class="w-5 h-5 rounded-full accent-orange-500 cursor-pointer"></th>

    </tr>
</thead>


        <tbody class="bg-white divide-y divide-gray-100 allop" id={{count($tariffs)}}>
            @foreach ($tariffs as $tariff)
            <tr class="TarTR   tb{{$tariff['id']}}   @if($tariff['Mapped'] == 'Mapped') bg-blue-900 @endif" data-service="{{ $tariff['SERVICE'] }}">
               <td>
              <div class="relative inline-block text-left drops space-y-1">

        <!-- CURRENT / FAKE SERVICE (Dropdown trigger) -->
        @if(empty($tariff['Edited_Service']))
         <button  class=" btn{{$tariff['id']}} dropdownButton inline-flex w-full items-center justify-between gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">{{$tariff['SERVICE']}}<span class="text-amber-400">{{$tariff['score']}}</span></button>
            <span class="inline-block rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">Original:</span>
        @else
            <button  class="btn{{$tariff['id']}} dropdownButton inline-flex w-full items-center justify-between gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">{{$tariff['Edited_Service']}} <span class="text-amber-400">{{$tariff['score']}}</span></button>
            <span class="inline-block rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">Original:{{$tariff['SERVICE']}}</span>
        @endif

        <!-- Dropdown Menu -->
        <div id="btn{{$tariff['id']}}" class="dropdownMenu loop{{$tariff['id']}} hidden absolute z-50 mt-2 w-56 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
        </div>

    </div>
</td>

                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 staTar">{{ $tariff['TARIFF'] }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
<input type="text" id="inp{{$tariff['id']}}" index="{{$tariff['id']}}" value="{{ empty($tariff['Edited_Tariff']) ? $tariff['TARIFF'] : $tariff['Edited_Tariff'] }}" class="newTar w-40 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"placeholder="₦0"/>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 nepo{{$tariff['id']}} Nego">{{$tariff['Negotiated']}}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center text-sm">
                    <div class="inline-flex gap-2">
                        <button class="send px-3 py-1 bg-teal-500 text-white rounded hover:bg-teal-600 flex items-center gap-2" index=".btn{{$tariff['id']}}" nepo=".nepo{{$tariff['id']}}" data-id="{{ $tariff['id'] }}">
                            <svg class="hidden spinner animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                            </svg>
                            <span class="label">Send</span>
                        </button>
                        <button class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Reject</button>


                    </div>
                </td>
                <td><label class="hidden items-center gap-2 cursor-pointer check"><input  type="checkbox" index="#inp{{$tariff['id']}}"  class="peer hidden inpF"><span class="w-4 h-4 rounded-full border border-gray-400 peer-checked:bg-blue-500 peer-checked:border-blue-500"> </span></label></td>
            </tr>
            @endforeach
          
        </tbody>

    </table>
      {{ $tariffs->links() }}
</div>

@if($tariffs && $tariffs->count() > 0)
    <a href="{{ route('tariffs.export', ['id' => $tariffs->first()['user_id']]) }}" class="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white font-semibold rounded-xl shadow-md hover:bg-orange-700 hover:shadow-lg transition transform hover:scale-105">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        Save
    </a>
@endif

<script type="module">
 
       const tariffs = @json($tariffs).data;
    // Initialize Worker
    const worker = new Worker(
      new URL("{{ asset('workers/tariffWorker.js') }}", import.meta.url),
      { type: "module" }
    );
    worker.postMessage({ type: "load" });
   worker.onmessage = function(e) {

    if (e.data.type === "loaded") {
        tariffs.forEach((tariff,IOP) => {worker.postMessage({type: "search",id: tariff['id'],word: tariff['SERVICE'],IOP });});
    }

    // ================= WORKER MESSAGE =================

    if (e.data.type === "result") {

    const rowId=Number(event.data.id)
    const IOP=Number(event.data.IOP)+1
    const idName='.loop'+rowId;
    const ul=document.querySelector(idName);
    const div=document.createElement("div") 
    div.className="py-1" 
   const tb=".tb"+event.data.id;

    if (event.data.rest.length !==0) {
           const total=document.querySelector(".allop").id

        const rt=Math.ceil(eval((IOP/total)*100));
        document.querySelector("#stWi").style.width=rt+"%"
        document.querySelector(".stySho").innerHTML=rt+"%"
       
         if (event.data.score == 1) {
          const scoreValue = Number(event.data.score) || 0;
const scr = Number((scoreValue * 100).toFixed(2)) + "%";

             document.querySelector(tb).classList.add("bg-blue-900")
             let spn = document.createElement('span');
spn.className = "block ml-4 text-amber-400";
spn.textContent = scr;
        const dof=event.data.rest['tariff_desc'];
        const cof=event.data.rest['tariff_code']
        const ty="."+ul.id;
        document.querySelector(ty).innerHTML=dof;
        document.querySelector(ty).appendChild(spn)
        sert('drops',rowId,dof,cof,'100%')
    }else{

    console.log(event.data)
          event.data.rest.forEach(element => { 
          
       const li = document.createElement('div');
li.className = "item-list flex px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50";
li.id = event.data.id;

const scoreValue = Number(element.score) || 0;
const scr = Number((scoreValue * 100).toFixed(2)) + "%";

li.setAttribute("Code", element.code);
li.setAttribute("score", scr);
const st=document.createElement("span");
st.className="st"
st.textContent = element.service;

let spn = document.createElement('span');
spn.className = "block ml-4 text-amber-400";
spn.textContent = scr;

li.appendChild(st);
li.appendChild(spn);
div.append(li);
        
    });
     ul.append(div);
    select(ul) 
    }
    }else{
      document.querySelector(tb).classList.add("bg-yellow-900")
    }
}
};


// ================= DROPDOWN OPEN / CLOSE =================
const drops =document.querySelectorAll(".drops"); 
drops.forEach(element => { const btn = element.querySelector('.dropdownButton'); 
const menu = element.querySelector('.dropdownMenu');

 btn.addEventListener('click', () => {
            drops.forEach(d => { if (d !== element) {     
                d.querySelector('.dropdownMenu')?.classList.add('hidden'); } });
                menu.classList.toggle('hidden'); 
                 });
});



//click to choose

function select(parent) {
   const py= parent.querySelector(".py-1");
    const items=py.querySelectorAll(".item-list");

    items.forEach(d => {
        d.addEventListener('click',()=>{
               
            const rowId=Number(d.id)
            const ty="."+parent.id
            const st=d.querySelector(".st");
            const rfg=document.createElement("span");
            rfg.className='text-amber-400'
            const code=d.getAttribute("Code");
            const scr=d.getAttribute("score");
            document.querySelector(ty).innerHTML=st.innerHTML;
            rfg.textContent=scr
            document.querySelector(ty).appendChild(rfg)
             sert('drops',rowId,st.innerHTML,code,scr)
             const tb=".tb"+d.id;
              document.querySelector(tb).classList="bg-blue-900"
            parent.classList.toggle('hidden'); 
        })
    });
}
 
</script>

@endsection
</body>
</html>
@extends('layouts.layout')
@section('content')

<style>
  .dropdown-item {
    @apply px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 cursor-pointer;
  }
</style>

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
      <button class="px-3 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600">
        Reduce Price
      </button>

      <input type="number" placeholder="%" class="w-32 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-red-400"/>

      <!-- Increase Price -->
      <button class="px-3 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600">
        Increase Price
      </button>

      <!-- Divider -->
      <div class="hidden md:block h-6 w-px bg-gray-300 mx-2"></div>
              <input type="number" placeholder="%" class="w-32 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-red-400"/>


      <button class="px-4 py-2 text-sm font-medium bg-blue-500 text-white rounded-md hover:bg-blue-600">
        Apply
      </button>

      <!-- Spacer -->
      <div class="flex-1"></div>

      <!-- Search -->
      <input
        type="text"
        placeholder="Search..."
        class="w-48 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
      />

      <button class="px-3 py-2 text-sm bg-gray-100 rounded-md hover:bg-gray-200">
        Reset
      </button>

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
            </tr>
        </thead>

        <tbody class="bg-white divide-y divide-gray-100">
            @foreach ($tariffs as $tariff)
            <tr class="{{$loop->index}}" data-service="{{ $tariff['SERVICE'] }}">
               <td>
    <div class="relative inline-block text-left drops space-y-1">

        <!-- CURRENT / FAKE SERVICE (Dropdown trigger) -->
        @if(empty($tariff['Edited_Service']))
         <button  class="btn{{$tariff['id']}} dropdownButton inline-flex w-full items-center justify-between gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">{{$tariff['SERVICE']}}</button>
            <span class="inline-block rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">Original:</span>
        @else
            <button  class="btn{{$tariff['id']}} dropdownButton inline-flex w-full items-center justify-between gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">{{$tariff['Edited_Service']}}</button>
            <span class="inline-block rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">Original:{{$tariff['SERVICE']}}</span>
        @endif

        <!-- Dropdown Menu -->
        <div id="btn{{$tariff['id']}}" class="dropdownMenu loop{{$tariff['id']}} hidden absolute z-50 mt-2 w-56 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
        </div>

    </div>
</td>

                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ $tariff['TARIFF'] }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
<input type="text" value="{{ empty($tariff['Edited_Tariff']) ? $tariff['TARIFF'] : $tariff['Edited_Tariff'] }}" class="newTar w-40 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"placeholder="₦0"/>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 nepo{{$tariff['id']}}">{{$tariff['Negotiated']}}</span>
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
    const IOP=Number(event.data.IOP)
    const idName='.loop'+rowId;
    const ul=document.querySelector(idName);
    const div=document.createElement("div") 
    div.className="py-1" 
   
    if (event.data.rest.length !==0) {
        const total=200;
        const rt=Math.ceil(eval((IOP/total)*100));
        document.querySelector("#stWi").style.width=rt+"%"
        document.querySelector(".stySho").innerHTML=rt+"%"
       
         if (event.data.score == 1) {
        const dof=event.data.rest['tariff_desc'];
        const cof=event.data.rest['tariff_code']
        const ty="."+ul.id;
        document.querySelector(ty).innerHTML=dof;
        sert('drops',rowId,dof,cof)
    }else{
          event.data.rest.forEach(element => { 
          
        const li=document.createElement('div');
        li.className="item-list block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50";
        li.id=event.data.id
        li.setAttribute("Code",element.code)
        li.innerHTML=element.service;
        div.append(li) 
        
    });
     ul.append(div);
    select(ul) 
    }
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

// CSRF & Send button logic


const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

document.querySelectorAll(".send").forEach(button => {
    button.addEventListener("click", async () => {
        const spinner = button.querySelector(".spinner");
        const label = button.querySelector(".label");
        const rowId = button.dataset.id;
        const indexId=button.getAttribute("index");
        const nepo=button.getAttribute("nepo");

        const description=document.querySelector(indexId).innerHTML
        const newTar = button.closest("tr").querySelector(".newTar").value;
        spinner.classList.remove("hidden");
        label.textContent = "Loading...";
        button.disabled = true;

     sert('hj',rowId,description,'',newTar,spinner,label,button)


    });
});

// Success alert
function showAlert() {
    const alert = document.getElementById("successAlert");
    alert.classList.remove("hidden");
    setTimeout(() => alert.classList.add("hidden"), 2000);
}


//send update
async function sert(type,rowId,description,code,newTar,spinner,label,button) {
    let body={}

  if (type =='drops') {body={ id: rowId,des:description,code,type }}else{body={ id: rowId,'Tariff':newTar,des:description,type }}
      try {
            const res = await fetch('/UpdateSinTar', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrfToken },
                body: JSON.stringify(body)
            });
           
            const data = await res.json();
           if (type !=="drops")showAlert();
           
        }  catch (err) {
             if (type !=="drops")showAlert();
        } finally {
             if (type !=="drops") {
            spinner.classList.add("hidden");
            label.textContent = "Send";
             const nepo=button.getAttribute("nepo");
             document.querySelector(nepo).innerHTML='Negotaited'
            button.disabled = false;
            }   
    }
} 


//click to choose

function select(parent) {
   const py= parent.querySelector(".py-1");
    const items=py.querySelectorAll(".item-list");

    items.forEach(d => {
        d.addEventListener('click',()=>{
               
            const rowId=Number(d.id)
            const ty="."+parent.id
            document.querySelector(ty).innerHTML=d.innerHTML;
    const code=d.getAttribute("Code");
             sert('drops',rowId,d.innerHTML,code)
            parent.classList.toggle('hidden'); 
        })
    });
}
 
</script>

@endsection

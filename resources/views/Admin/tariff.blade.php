@extends('layouts.layout')
@section('content')

<style>
  .dropdown-item {
    @apply px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 cursor-pointer;
  }
</style>

<div class="overflow-x-auto bg-white rounded-lg shadow">

    <div id="successAlert" class="hidden fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg">
        Updated successfully!
    </div>

    <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-orange-50">
            <tr>
                <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">Service</th>
                <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">Current Price</th>
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
         {{$tariff['Edited']}}
       <button  class="btn{{ $loop->index }} dropdownButton inline-flex w-full items-center justify-between gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">{{ empty($tariff['Edited']) ? $tariff['SERVICE'] : $tariff['Edited'] }}</button>

        <!-- ORIGINAL SERVICE (Reference) -->
    <span class="inline-block rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">Original:{{ !empty($tariff['Edited']) ? $tariff['SERVICE'] : '' }}</span>


        <!-- Dropdown Menu -->
        <div
            id="btn{{$loop->index}}"
            class="dropdownMenu loop{{$loop->index}} hidden absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
        </div>

    </div>
</td>

                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ $tariff['TARIFF'] }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <input type="text" value="{{ $tariff['TARIFF'] }}" class="newTar w-40 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300" placeholder="₦0" />
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">Negotiated</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center text-sm">
                    <div class="inline-flex gap-2">
                        <button class="send px-3 py-1 bg-teal-500 text-white rounded hover:bg-teal-600 flex items-center gap-2" index=".btn{{$loop->index}}" data-id="{{ $tariff['id'] }}">
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

<a href="{{ route('tariffs.export', ['id' => 2]) }}" class="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white font-semibold rounded-xl shadow-md hover:bg-orange-700 hover:shadow-lg transition transform hover:scale-105">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
    </svg>
    Save
</a>

<script type="module">
import Tar from "{{ asset('js/Tar.js') }}";
const drugs = Tar.map(s => s.tariff_desc);
const tariffs = @json($tariffs).data;

// Initialize Worker
const worker = new Worker(new URL("{{ asset('workers/tariffWorker.js') }}", import.meta.url), { type: "module" });


// Send all tariffs to worker
tariffs.forEach((tariff,id) => {worker.postMessage({id:id, word: tariff['SERVICE'], dictionary: drugs });});


// ================= WORKER MESSAGE =================
worker.onmessage = function (event) { 

    const idName='.loop'+event.data.id;
    const ul=document.querySelector(idName);
    const div=document.createElement("div") 
    div.className="py-1" 
    console.log(event.data) 
   
    if (event.data.rest.length !==0) {
         if (event.data.rest[0].score == 1) {
        const ty="."+ul.id;
        console.log(event.data.rest[0].value)
        document.querySelector(ty).innerHTML=event.data.rest[0].value
    }
    }else{
         event.data.rest.forEach(element => { 
        const li=document.createElement('div');
        li.className="item-list block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50";
        li.innerHTML=element.value;
        div.append(li) 
    });
    }
   
   
    ul.append(div);
    select(ul)   
}


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
        const description=document.querySelector(indexId).innerHTML
        const newTar = button.closest("tr").querySelector(".newTar").value;

        spinner.classList.remove("hidden");
        label.textContent = "Loading...";
        button.disabled = true;

        try {
            const res = await fetch('/UpdateSinTar', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrfToken },
                body: JSON.stringify({ id: rowId, Tariff: newTar,des:description })
            });
            const data = await res.json();
            showAlert();
            console.log(data);
        } catch (err) {
            showAlert();
        } finally {
            spinner.classList.add("hidden");
            label.textContent = "Send";
            button.disabled = false;
        }


    });
});

// Success alert
function showAlert() {
    const alert = document.getElementById("successAlert");
    alert.classList.remove("hidden");
    setTimeout(() => alert.classList.add("hidden"), 2000);
}



//send update

/* function sert(rowId,newTar,description) {
      try {
            const res = await fetch('/UpdateSinTar', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrfToken },
                body: JSON.stringify({ id: rowId, Tariff: newTar,des:description })
            });
            const data = await res.json();
           
        } catch (err) {
          console.log(err)
        } 
} */


//click to choose

function select(parent) {
   const py= parent.querySelector(".py-1");
    const items=py.querySelectorAll(".item-list");

    items.forEach(d => {
        d.addEventListener('click',()=>{
            const ty="."+parent.id
            document.querySelector(ty).innerHTML=d.innerHTML;
            parent.classList.toggle('hidden'); 
        })
    });
}

</script>

@endsection

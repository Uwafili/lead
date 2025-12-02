@extends('layouts.layout')
@section('content')
 
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
                    <tr>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ $tariff['SERVICE'] }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ $tariff['TARIFF'] }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm">
                        <input type="text" value="{{ $tariff['TARIFF'] }}" id="newTar" placeholder="₦0" class="w-40 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300" />
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm">
                        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">Negotiated</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-center text-sm">
                        <div class="inline-flex gap-2">
<button 
    class="px-3 py-1 bg-teal-500 text-white rounded hover:bg-teal-600 flex items-center gap-2 send"
    row="{{$tariff['id']}}"
>
    <!-- Spinner (hidden by default) -->
    <svg class="hidden animate-spin h-4 w-4 text-white spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
    </div>

<a href="{{route('tariffs.export',['id' => 2])}}" class="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white font-semibold rounded-xl shadow-md hover:bg-orange-700 hover:shadow-lg transition transform hover:scale-105">
  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
  </svg>
  Save
</a>

  <script>
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');


const send=document.querySelectorAll(".send");
send.forEach(ele => {
    ele.addEventListener('click',()=>{
         ele.querySelector(".spinner").classList.remove("hidden");
        ele.querySelector(".label").textContent = "Loading...";
        ele.disabled = true;

        const row=ele.getAttribute("row");
        const Parent=ele.parentElement.parentElement.parentElement
const newTar=Parent.querySelector("#newTar").value;

const body={
    id:row,
    Tariff:newTar
}

fetch('/UpdateSinTar', {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken
    },
    body: JSON.stringify(body)
})
.then(response => response.json())
.then(data => {
    showAlert()
    console.log(data); 
     ele.querySelector(".spinner").classList.add("hidden");
        ele.querySelector(".label").textContent = "Send";
        ele.disabled = false;
        
})
.catch(error => {showAlert()}); 
    })
});



function showAlert() {
    const alert = document.getElementById("successAlert");
    alert.classList.remove("hidden");

    setTimeout(() => {
        alert.classList.add("hidden");
    }, 2000); // hides after 2 seconds
}

</script>

</html>


    @endsection
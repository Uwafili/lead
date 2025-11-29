@extends('layouts.layout')
@section('content')
 
 <div class="overflow-x-auto bg-white rounded-lg shadow">
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
                            <button class="px-3 py-1 bg-teal-500 text-white rounded hover:bg-teal-600 send" row="{{$tariff['id']}}" >Send</button>
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
    console.log(data); // {message: "Item created successfully", name: "Wooden Bed"}
})
.catch(error => console.error('Error:', error)); 

    })
});

</script>

</html>


    @endsection
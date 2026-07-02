 @extends('layouts.layout')

@section('content')

<div class="h-screen bg-gray-100 flex flex-col overflow-hidden">
 <div id="successAlert" class="hidden fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">Updated successfully!</div>
    <!-- Header -->
   <div class="p-6 pb-0">
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 class="text-2xl font-bold text-gray-800 whitespace-nowrap">Service Requests </h1>
       <p  id="mapIndicator" class="w-6 h-6 bg-gradient-to-tr rounded-full shadow-md shadow-blue-500/30 animate-pulse"></p>
        
        <div class="relative flex-1 max-w-md w-full sm:mx-4">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.603 10.601Z" />
                </svg>
            </div>
            <input type="text" placeholder="Search requests..." id="requestSearch"  class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm shadow-sm transition" />
        </div>

        <button class="bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700 transition whitespace-nowrap">
            + New Request
        </button>
    </div>
</div>
    <!-- Table Section (Scrollable Area) -->
    <div class="flex-1 p-6 overflow-hidden">
        <div class="max-w-7xl mx-auto h-full flex flex-col">

            <div class="relative bg-white rounded-2xl shadow-lg flex-1 flex flex-col overflow-hidden">
<div id="runningDB" class="hidden h-[4px] bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-pink-500 bg-[length:200%_200%] animate-gradient-shift"></div>
                <!-- Scroll container -->
                <div class="flex-1 overflow-auto">
                    
                    <!-- X scroll wrapper -->
                    <div class="min-w-[800px]">
                        <table class="w-full text-sm text-left">
                            
                            <thead class="bg-gray-50 text-gray-600 uppercase text-xs sticky top-0 z-10">
                                <tr>
                                    <th class="px-6 py-4">Service</th>
                                    <th class="px-6 py-4">Stated Price</th>
                                    <th class="px-6 py-4">Requested Price</th>
                                    <th class="px-6 py-4">Status</th>
                                    <th class="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>

                            <tbody class="divide-y d-bod"></tbody>

                        </table>
                    </div>

                </div>

            </div>

        </div>
    </div>

    <!-- Bottom Buttons (Fixed) -->
   <div class="bg-white border-t shadow-inner">
    <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex overflow-x-auto whitespace-nowrap pb-2">     
            @if(count($category) > 0)
                @foreach($category as $cat)
                    <button class="inline-block flex-shrink-0 py-4 px-6 m-2 rounded-2xl bg-blue-50 text-blue-600 font-semibold hover:bg-blue-100 transition Fac-sheets">
                        {{$cat}}
                    </button>
                @endforeach
            @endif
        </div>
    </div>
</div>

<div>
          <p  class="bg-orange-600 w-full text-white px-4 py-2 rounded-xl shadow hover:bg-orange-700 transition whitespace-nowrap"><a a href="{{route('tariff.dowload',['id'=>$id])}}">Download Tariff</a></p>
</div>

</div>
 <script src="{{ asset('js/Facility/TariffPageHandler.js') }}"></script>
 <script src="{{ asset('js/Facility/TariffMapHandler.js') }}"></script>
 <script src="https://cdn.jsdelivr.net/npm/fuse.js@6.6.2"></script>
 
  <script>
    const workerUrl = "{{ asset('workers/TarWorker.js') }}";
  const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

   document.addEventListener('DOMContentLoaded', () => {
    const cart=@json($category);
    const data=@json($tariff);

    ShowTariff(data,cart[0])
 
    WorkerWeb(cart[0],data)

          const FacSheet=document.querySelectorAll(".Fac-sheets");  
     FacSheet.forEach(sheet => {sheet.addEventListener('click',()=>{
        
     handleSheetChange(data,(sheet.innerHTML).trim());WorkerWeb((sheet.innerHTML).trim(),data)
    
    })});

})


</script>

@endsection

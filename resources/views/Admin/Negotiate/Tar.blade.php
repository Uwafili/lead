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


            <!-- Mapped Filter -->
          <div class="relative group">
            <button class="w-full text-left px-4 py-2 hover:bg-gray-100 flex justify-between items-center">Mapped<svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /> </svg></button>

            <!-- Mapped Nested Dropdown -->
            <div class="absolute top-0 left-full mt-0 ml-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg hidden group-hover:block">
              <label class="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100" id="NM">Not Mapped</label>
              <label class="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100" id="Mp" >Mapped</label>
            </div>


          </div>




        </div>
      </div>


   
      <!-- Spacer -->
      <div class="flex-1"></div>
      <button class="px-3 py-2 text-sm bg-gray-100 rounded-md hover:bg-gray-200">Reset</button>

    </div>
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

<div class="items-center gap-3 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl text-sm fixed top-20 right-5 " id="SaveTarError" role="alert"></div>


 <script src="{{ asset('js/Facility/TariffPageHandler.js') }}"></script>
 <script src="{{ asset('js/Facility/TariffMapHandler.js') }}"></script>
 <script src="{{ asset('js/Facility/TariffMenuHandler.js') }}"></script>
 
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

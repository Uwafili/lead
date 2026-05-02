@extends('layouts.layout')

@section('content')

<div class="h-screen bg-gray-100 flex flex-col overflow-hidden">

    <!-- Header -->
    <div class="p-6 pb-0">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
            <h1 class="text-2xl font-bold text-gray-800">Service Requests</h1>
            <button class="bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700 transition">
                + New Request
            </button>
        </div>
    </div>

    <!-- Table Section (Scrollable Area) -->
    <div class="flex-1 p-6 overflow-hidden">
        <div class="max-w-7xl mx-auto h-full flex flex-col">

            <div class="bg-white rounded-2xl shadow-lg flex-1 flex flex-col overflow-hidden">

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
            <div class="flex">     
                @if(count($category) > 0)

                    @foreach($category as $cat)
                        <button class="py-4 w-full m-2 rounded-2xl bg-blue-50 text-blue-600 font-semibold hover:bg-blue-100 transition Fac-sheets" >{{$cat}}</button>
                    @endforeach
                @endif
            </div>
        </div>
    </div>

</div>
<script src="{{ asset('js/Facility/Tariff.js') }}"></script>

  <script>
   document.addEventListener('DOMContentLoaded', () => {
    const cart=@json($category);
    const data=@json($tariff);
  
    ShowTariff(data,cart[0])


    const FacSheet=document.querySelectorAll(".Fac-sheets");

    FacSheet.forEach(sheet => {
        sheet.addEventListener('click',()=>{
             handleSheetChange(data,sheet.innerHTML)
        })
    });

})
</script>

@endsection

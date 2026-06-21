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

</div>
 <script src="{{ asset('js/Facility/Tariff.js') }}"></script>
 
  <script>
    const workerUrl = "{{ asset('workers/TarWorker.js') }}";
  const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

   document.addEventListener('DOMContentLoaded', () => {
    const cart=@json($category);
    const data=@json($tariff);
    ShowTariff(data,cart[0])
    let MatchedMap;


            //Web Worker handler.

             function WorkerWeb(cart) {
                const workerUl = "/workers/TarWorker.js";
                const worker = new Worker(workerUl);

                worker.postMessage({ type: "load",cartegory:cart });
                    worker.onmessage = function (e) {
                                document.querySelector("#mapIndicator").classList.add("from-red-600", "via-red-700", "to-red-800")
                            if (e.data.type === "loaded") {
                                const present= data.filter((val)=>val['category']==cart)  
                                worker.postMessage({type: "search",data: present,cartegory:cart});                    }
                    if (e.data.type === "result") {
                    document.querySelector("#mapIndicator").classList.add("from-blue-600", "via-blue-700", "to-blue-800")

                        const mapped=e.data.data;
                        MatchedMap=e.data.matched

                        console.log(mapped)
                        
                        mapped.forEach(map => {
                            handleMappedItem(map)
                        });
                         initDropMap()
                        clickToAddMapped() 
                    }
                        };      
            }
            WorkerWeb(cart[0])
         
                function handleMappedItem(props) {
                        const Id=`#itemHolder${props['id']}`
                        const ServiceTag=`#ServiceTag${props['id']}`;
                        const itemHolder =document.querySelector(Id);
                    const matches=props['matches'];
                    
                 //set Service Tag color based on mapped;
                 document.querySelector(ServiceTag).classList.remove("border-gray-200")
                 if (matches.length===1 && matches[0]['score']===1) {
                    document.querySelector(ServiceTag).classList.add("border-blue-400")
                 }else if(matches.length===0){
                   document.querySelector(ServiceTag).classList.add("border-red-400")
                 }else{
                   document.querySelector(ServiceTag).classList.add("border-green-400")                   
                 }
                    const ulElement = document.createElement('ul');
                    ulElement.className = "py-1 text-sm text-gray-700";

                    matches.forEach(pk => {
                        const li = document.createElement('li');
                        li.innerHTML = `<p id="${props['id']}"  class="mpb w-full text-left px-4 py-2 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium">${pk['service']}</p>`;
                        ulElement.appendChild(li);
                    });

                    const wrapperDiv = document.createElement('div');
                    wrapperDiv.className = `absolute drpMap${props['id']} z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto hidden`;
                    wrapperDiv.appendChild(ulElement);
                    itemHolder.appendChild(wrapperDiv);
 
            }


              
            function initDropMap(){
                const dropbtn=document.querySelectorAll(".drpMapClick");

                dropbtn.forEach(btn => {
                   
                    btn.addEventListener('click',()=>{
                        
                         const drpMapClass=".drpMap"+Number(btn.getAttribute("gth"));
                         const drpMap=document.querySelector(drpMapClass)
                            drpMap.classList.toggle('hidden');
                            
                    })
                });
                
            }

            function clickToAddMapped() {
               
                const mpb=document.querySelectorAll(".mpb");
                mpb.forEach(bp => {
                    bp.addEventListener('click',()=>{
                        const idcl=`.serput${Number(bp.id)}`
                        const ser=bp.innerHTML;
                        //change input to clicked dropped
                        document.querySelector(idcl).value=ser;
                        
                            //ADD CHOSEEN SERVICE TO DB
                            saveService(bp.innerHTML,bp.id)
                    })
                });
            }

           // BlurServiceInput()
        /*     function BlurServiceInput(){
                const serviceInput=document.querySelectorAll(".serviceInput");
                serviceInput.forEach(ser => {
                    ser.addEventListener('blur',()=>{
                         const drpMapClass=".drpMap"+Number(ser.getAttribute("index"));
                         const drpMap=document.querySelector(drpMapClass)
                        if (!drpMap.classList.contains('hidden')) {
                          drpMap.classList.add('hidden');
                            }   
                    })
                });
            } */

  
    
                const FacSheet=document.querySelectorAll(".Fac-sheets");  
     FacSheet.forEach(sheet => {sheet.addEventListener('click',()=>{handleSheetChange(data,sheet.innerHTML);WorkerWeb(sheet.innerHTML)})});


    //Functioning SearhBar
    requestSearch()

    function requestSearch(){
        const requestSearch =document.querySelector("#requestSearch");

        requestSearch.addEventListener('keyup',()=>{
            const requestValue=requestSearch.value.toLowerCase();
            const putTr=document.querySelectorAll(".putTr");
            putTr.forEach(tr => {
                const inputVal= tr.querySelector(".serviceInput").value.toLowerCase();

                if (inputVal.indexOf(requestValue) == -1) {
                        tr.classList.add('hidden')
                }else{
                  tr.classList.remove('hidden')
                }
            });
        })
    }


    //ADD CHOSEEN SERVICE TO DB

   async function saveService(text,id){
    console.log(MatchedMap)
        const filtMap=MatchedMap.filter((item)=>{
            if (item['service']==text && item['id']==id) {
              return true  
            }
        })

        const data =filtMap[0];
        console.log(data)
            const body={ id: data['id'],des:data['service'],code:data['code'],type:'drops',score:data['score']}
     const res = await fetch('/UpdateSinTar', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrfToken },
                body: JSON.stringify(body)
            }); 
    }


})


</script>

@endsection

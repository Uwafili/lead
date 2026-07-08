 // 1. Reusable debounce helper function
function debounce(func, delay = 500) {
    let timeoutId;
    return (...args) => {
        // Clear the previous timer if the user is still typing
        clearTimeout(timeoutId);
        // Start a new timer
        timeoutId = setTimeout(() => {
            func(...args);
        }, delay);
    };
}
 
 let MatchedMap;


            //Web Worker handler.

             function WorkerWeb(cart,data) {
                const workerUl = "/workers/TarWorker.js";
                const worker = new Worker(workerUl);
                let Ematches=[];
                worker.postMessage({ type: "load",cartegory:cart });
                    worker.onmessage = function (e) {
                                document.querySelector("#mapIndicator").classList.add("from-red-600", "via-red-700", "to-red-800")
                            if (e.data.type === "loaded") {
                                let present= data.filter((val)=>val['category']==cart)  
                                 present= present.filter((val)=>val['score']==0);
                                    
                              worker.postMessage({type: "search",data: present,cartegory:cart});    
                                              }
                    if (e.data.type === "result") {
                    document.querySelector("#mapIndicator").classList.remove("from-red-600", "via-red-700", "to-red-800")

                    document.querySelector("#mapIndicator").classList.add("from-blue-600", "via-blue-700", "to-blue-800")

                    setTimeout(()=>{document.querySelector("#mapIndicator").classList.remove("from-blue-600", "via-blue-700", "to-blue-800")},3000)
                        const mapped=e.data.data;
                        MatchedMap=e.data.matched
                        mapped.forEach(map => {
                           const matches= map['matches'];
                            
                           if (matches.length===1)  {
                            if (matches[0].score===1) {
                                
                                Ematches.push(matches[0])
                            }
                          
                           }
                            handleMappedItem(map)
                        });
                         
                        BulkSaveService(Ematches)
                        clickToAddMapped() 
                    }
                        };      
            }
           
         
                function handleMappedItem(props) {
                        const Id=`#itemHolder${props['id']}`
                        const ServiceTag=`#ServiceTag${props['id']}`;
                        const itemHolder =document.querySelector(Id);
                    const matches = props.matches;

const serviceTag = document.querySelector(ServiceTag);

if (!serviceTag) return;

serviceTag.classList.remove("border-gray-200","border-blue-400","border-red-400","border-green-400");

if (matches.length === 1 && matches[0].score === 1) {
  serviceTag.classList.add("border-blue-400");
} else if (matches.length === 0) {
    
  serviceTag.classList.add("border-red-400");
} else {
  serviceTag.classList.add("border-green-400");
}
                  let wrapperDiv =document.querySelector(`#WDE${props['id']}`)
                   if (wrapperDiv !==null) {
                     document.querySelector(`#WDE${props['id']}`).replaceChildren();
                    }else{
                    wrapperDiv= document.createElement('div');
                    wrapperDiv.id=`WDE${props['id']}`
                    wrapperDiv.className = `absolute drpMap${props['id']} z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto hidden`;
                    
                    }

                    const ulElement = document.createElement('ul');
                    ulElement.className = "py-1 text-sm text-gray-700";

                    matches.forEach(pk => {
                        const li = document.createElement('li');
                        li.innerHTML = `<p id="${props['id']}"  class="mpb w-full text-left px-4 py-2 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium">${pk['service']}</p>`;
                        ulElement.appendChild(li);
                    });

                    wrapperDiv.appendChild(ulElement);
                    itemHolder.appendChild(wrapperDiv);
 
            }


              
            function initDropMap(){
                const dropbtn=document.querySelectorAll(".drpMapClick");

                dropbtn.forEach(btn => {
                   
                    btn.addEventListener('click',()=>{
                        
                         const drpMapClass=".drpMap"+Number(btn.getAttribute("gth"));
                         const drpMap=document.querySelector(drpMapClass)
                         if ( drpMap !==null) {
                               drpMap.classList.toggle('hidden');
                         }
                         
                            
                    })
                });
                
            }

            function clickToAddMapped() {
               
                const mpb=document.querySelectorAll(".mpb");
                mpb.forEach(bp => {
                    
                    bp.addEventListener('click',()=>{
                        const idcl=`.serput${Number(bp.id)}`
                        const ser=bp.innerHTML;
                        let TC=bp.getAttribute("code");
                        let Ismapped;
                        if (TC !== null) {
                            Ismapped=false
                        }else{
                            Ismapped=true
                        }
                        //change input to clicked dropped
                        document.querySelector(idcl).value=ser;
                        console.log(document.querySelector(idcl).className)
                            //ADD CHOSEEN SERVICE TO DB
                            saveService(bp.innerHTML,bp.id,Ismapped,TC)
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

   async function saveService(text,id,Ismapped,TC){
    //GETTING AND SETTING THE BORDER COLORS OF INPUT ON SAVE
       document.querySelector("#runningDB").classList.remove('hidden')
   let body;
    if (Ismapped) {
             //trying to get the score from the mapped
        const filtMap=MatchedMap.filter((item)=>{
            if (item['service']==text && item['id']==id) {
              return true  
            }
        }) 

          const data =filtMap[0];

            body={ id: data['id'],des:data['service'],code:data['code'],type:'drops',score:data['score']}
    
    } else {
        body={ id: id,des:text,code:TC,type:'drops',score:'nill'}
    }
      

                try {
                const res = await fetch('/UpdateSinTar', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrfToken },
                    body: JSON.stringify(body)
                });
                    document.querySelector("#runningDB").classList.add('hidden')
                if (res.ok) {
                   
                } else {document.querySelector("#SaveTarError").innerHTML=`Request finished, but server responded with code: ${res.status}`}
            } catch (error) {cdocument.querySelector("#SaveTarError").innerHTML='The request failed entirely due to a network error:'}
            
    }


    // Add the search to the service input for filtering and mapping

async function searchService() {
    const res = await fetch("/js/Tar.json");
let dictionary = await res.json();

const serviceInput = document.querySelectorAll(".serviceInput");

serviceInput.forEach(ser => {
   ser.addEventListener("keyup", debounce((event) => {
        const ID=ser.getAttribute('index');
        
         let wrapperDiv =document.querySelector(`#WDE${ID}`)
                   if (wrapperDiv !==null) {
                     document.querySelector(`#WDE${ID}`).replaceChildren();
                    }else{
                    wrapperDiv= document.createElement('div');
                    wrapperDiv.id=`WDE${ID}`
                    wrapperDiv.className = `absolute drpMap${ID} z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto hidden`;
                    
                    }

            const retId= `#itemHolder${ID}`
        const itemHolder =document.querySelector(retId);
       let val = ser.value.toLowerCase().trim();

        // Filters the dictionary array safely and cleanly
        const matches = dictionary.filter(tr =>tr['tariff_desc'] && tr['tariff_desc'].toLowerCase().includes(val) );

                 const ulElement = document.createElement('ul');
                    ulElement.className = "py-1 text-sm text-gray-700";

                    
                    matches.forEach(pk => {
                        const li = document.createElement('li');
                        li.innerHTML = `<p id="${ID}" code="${pk['tariff_code']}"  class="mpb w-full text-left px-4 py-2 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium">${pk['tariff_desc']}</p>`;
                        ulElement.appendChild(li);
                    });

                    wrapperDiv.appendChild(ulElement);
                    itemHolder.appendChild(wrapperDiv);

                 clickToAddMapped()
   }, 500));
});


initDropMap()

}
 

async function BulkSaveService(body) {
       document.querySelector("#runningDB").classList.remove('hidden')
      try {
                const res = await fetch('/UpdateBulkTar', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrfToken },
                    body: JSON.stringify(body)
                });
                    document.querySelector("#runningDB").classList.add('hidden')
                if (res.ok) {
                   
                } else {document.querySelector("#SaveTarError").innerHTML=`Request finished, but server responded with code: ${res.status}`}
            } catch (error) {cdocument.querySelector("#SaveTarError").innerHTML='The request failed entirely due to a network error:'}
            
}
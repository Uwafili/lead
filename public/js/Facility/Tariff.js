const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');


function ShowTariff(data,cart) {

    const present= data.filter((val)=>val['category']==cart)
    const bodHold=document.querySelector(".d-bod");
    let html=''

    function strN(dt){
      if (!dt) {
        return dt
      }else{
     const ft=Number(dt.replace(/\D./g,''));
     return ft
    }
    }
    present.forEach(prep => {
         html +=`              <tr class="hover:bg-gray-50">
                                    <td class="px-6 py-4 font-medium btn${prep['id']}">${prep['SERVICE']}</td>
                                    <td class="px-6 py-4">#${strN(prep['TARIFF'])}</td>
                                    <td class="px-6 py-4"><div class="relative w-32"><span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₦</span><input type="number" index="${prep['id']}" name="requested" value="${ strN(prep['Edited_Tariff']?.trim() ? prep['Edited_Tariff'] : prep['TARIFF'])}"  class="w-full pl-7 pr-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition newTar" placeholder="0.00"></div></td>
                                    <td class="px-6 py-4"><span class="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700 nepo${prep['id']} Nego">${prep['Negotiated']}</span> </td>
                                    <td class="px-6 py-4 text-right space-x-2"> <div class="inline-flex gap-2"><button class="accept-price bg-green-500 text-white px-3 py-1 rounded-lg text-xs" index=".btn${prep['id']}" nepo=".nepo${prep['id']}" data-id="${prep['id']}">  <svg class="hidden spinner animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                            </svg><span class="label">${prep['accept']=='yes'?'Reject':'Accept'}</span></button></div></td>
                                </tr>
                        `
    });
    bodHold.innerHTML=html
    depend()
}


function handleSheetChange(data,cart) {
    ShowTariff(data,cart)
}


//SUBMITTING TARIFF TO DB ON KEYUP
function depend(){
    
const newTar=document.querySelectorAll(".newTar");

newTar.forEach(d => {
    d.addEventListener("blur",()=>{
        const val=d.value;
        const index=d.getAttribute("index"); 
        console.log(index)
        const ilo=".nepo"+index;
        document.querySelector(ilo).innerHTML="Negotiated"
        exp(index,val)
    })
});

async function exp(index,val) {
    const body={ id: index,'Tariff':val,des:'',type:'keyup' }
        try {
            const res = await fetch('/updatePrice', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrfToken },
                body: JSON.stringify(body)
            });
                   
        }catch(err){

        }
}

//Accept button logic

document.querySelectorAll(".accept-price").forEach(button => {
    button.addEventListener("click", async () => {
       
        const spinner = button.querySelector(".spinner");
        const label = button.querySelector(".label");
        const gt=label.innerHTML;
        const rowId = button.dataset.id;
        const indexId=button.getAttribute("index");
        const nepo=button.getAttribute("nepo");
        const description=document.querySelector(indexId).innerHTML;
        const newTar = button.closest("tr").querySelector(".newTar").value;
        spinner.classList.remove("hidden");
        label.textContent = "Loading...";
  

     sert('accept-price',rowId,description,'','',newTar,spinner,label,button,gt)

      button.disabled = true;
    });
});


//Accept update
async function sert(type,rowId,description,code,score,newTar,spinner,label,button,gt) {
    let body={}
    let accept='';
    console.log(gt)
    if (gt=="Reject") {accept='no'}else{accept='yes'}
    
  if (type =='drops') {body={ id: rowId,des:description,code,type,score }}else{body={ id: rowId,'Tariff':newTar,des:description,type, accept }}
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
            let ctg=''
            if (gt=="Reject"){ctg='Accept'}else{ctg='Reject'}
            label.textContent =ctg;
            console.log(button)
             const nepo=button.getAttribute("nepo");
             document.querySelector(nepo).innerHTML='Negotaited'
            button.disabled = false;
            }   
    }
} 

// Success alert
function showAlert() {
    const alert = document.getElementById("successAlert");
    alert.classList.remove("hidden");
    setTimeout(() => alert.classList.add("hidden"), 2000);
}

}


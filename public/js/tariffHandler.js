const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');


/// SETTING THE TRs TO CHECKED WHEN DOUBLE CLICKED

const TarTR=document.querySelectorAll(".TarTR");
TarTR.forEach(d => {
    d.addEventListener("dblclick",()=>{
       const label=d.querySelector(".check");
       if (label.classList.contains('flex')) {
         label.classList.remove("flex");
       label.classList.add("hidden");
       inp.checked=false;
       }else{
        const inp=label.querySelector("input");
        inp.checked=true
        label.classList.add("flex");
       label.classList.remove("hidden")
       }
      
    })
});

///USING THE REDUCE BUTTON

const reducePrice=document.querySelector("#reducePrice");

reducePrice.addEventListener('click',()=>{
    const inr=document.querySelector(".RedInp").value
    const per=1-(inr/100)
         rfd(per)
})
///USING THE INCREASE BUTTON
const increasePrice=document.querySelector("#increasePrice");

increasePrice.addEventListener('click',()=>{
    const inr=document.querySelector(".INInp").value
    const per=1+(inr/100)
         rfd(per)
})
function rfd(per) {
    const inpF=document.querySelectorAll(".inpF");
    inpF.forEach((d)=>{
        const rt=d.checked
      
         if (rt == true) {
            const id=d.getAttribute("index");
            const TarInput=document.querySelector(id);
             const index=TarInput.getAttribute("index");
             const ilo=".nepo"+index;
             document.querySelector(ilo).innerHTML="Negotiated"
            const sol=TarInput.value*per;
            document.querySelector(id).value=sol;
             exp(index,sol)
        }

    })
}
//SUBMITTING TARIFF TO DB ON KEYUP

const newTar=document.querySelectorAll(".newTar");

newTar.forEach(d => {
    d.addEventListener("keyup",()=>{
        const val=d.value;
        const index=d.getAttribute("index"); 
        const ilo=".nepo"+index;
        document.querySelector(ilo).innerHTML="Negotiated"
        exp(index,val)
    })
});

async function exp(index,val) {
    const body={ id: index,'Tariff':val,des:'',type:'keyup' }
        try {
            const res = await fetch('/UpdateSinTar', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrfToken },
                body: JSON.stringify(body)
            });
                   
        }catch(err){

        }
}


//Send button logic

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


///USING THE SEARCH INPUT

const sech=document.querySelector("#sech")

sech.addEventListener("keyup",()=>{
   const val=sech.value.toUpperCase()
   const drp=document.querySelectorAll(".dropdownButton");
   drp.forEach(d => {
     d.closest('tr').classList.remove('hidden')
        if (d.innerHTML.toUpperCase().indexOf(val) ==-1) {
            d.closest('tr').classList.add('hidden')
        }
   });
})


///Filter Dropdown

const filter=document.querySelector("#filter")
filter.addEventListener('click',()=>{
    const dropFilt=document.querySelector("#dropFilt");
    dropFilt.classList.toggle("hidden")
})



function ShowTariff(data,cart) {

    const present= data.filter((val)=>val['category']==cart)
    const bodHold=document.querySelector(".d-bod");
    let html=''
    function strN(dt){
     const ft=Number(dt.replace(/\D/g,''));
    return ft
    }
    present.forEach(prep => {
         html +=`              <tr class="hover:bg-gray-50">
                                    <td class="px-6 py-4 font-medium">${prep['SERVICE']}</td>
                                    <td class="px-6 py-4">#${strN(prep['TARIFF'])}</td>
                                    <td class="px-6 py-4"><div class="relative w-32"><span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₦</span><input type="number" name="requested" value="${strN(prep['TARIFF'])}" class="w-full pl-7 pr-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="0.00"></div></td>
                                    <td class="px-6 py-4"><span class="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">${prep['Negotiated']}</span> </td>
                                    <td class="px-6 py-4 text-right space-x-2"><button class="bg-green-500 text-white px-3 py-1 rounded-lg text-xs">Approve</button><button class="bg-red-500 text-white px-3 py-1 rounded-lg text-xs">Reject</button></td>
                                </tr>
                        `
    });
    bodHold.innerHTML=html

  console.log(present)
}


function handleSheetChange(data,cart) {
    ShowTariff(data,cart)
}
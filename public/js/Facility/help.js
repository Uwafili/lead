 function startWorker(data, cart,workerUrl) {
    const workerUl = "/workers/TarWorker.js";
    const worker = new Worker(workerUl);

    worker.postMessage({ type: "load" });
 worker.onmessage = function (e) {

        if (e.data.type === "loaded") {
               let present= data.filter((val)=>val['category']==cart);
               //send only unmapped
                 present= data.filter((val)=>val['score']==0);
                 console.log(present)
               //worker.postMessage({type: "search",data: present,});
               return "hi"
        }
if (e.data.type === "result") {
return e.data
}
    };

}

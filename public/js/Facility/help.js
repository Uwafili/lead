 function startWorker(data, cart,workerUrl) {
    const workerUl = "/workers/TarWorker.js";
    const worker = new Worker(workerUl);

    worker.postMessage({ type: "load" });
 worker.onmessage = function (e) {

        if (e.data.type === "loaded") {
               const present= data.filter((val)=>val['category']==cart)
          
                worker.postMessage({
                    type: "search",
                    data: present,
                });

     

        }

    };

}

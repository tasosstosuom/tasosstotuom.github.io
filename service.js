self.addEventListener("install", e=> {
    e.waitUntil(
        cache.open("static").then(cache=>
            {
                return cache.addAll(["./Wallet/index.html","./Wallet/btc.png","./Wallet/app.js","/Wallet/style.css"])
            })
    );
        });

       
        self.addEventListener("fetch",e =>
{
    e.respondWith(
        caches.match(e.request).then( response =>
            {
                return response || fetch(e.request);
            })
        
    );
    
});
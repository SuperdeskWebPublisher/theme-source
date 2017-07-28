var OFFLINE_URL = '/public/offlinePage.html';
// helper regex that matches success response.status
var successResponses = /^0|([123]\d\d)|(40[14567])|410$/;
toolbox.precache([OFFLINE_URL]);

toolbox.router.default = pagesCacheHandler;

/**
 * sw-toolbox custom strategy
 */
 function pagesCacheHandler(request, values, options) {
  return caches.match(request).then(function(response) {
    // if response is found it must be in articles-cache
    // we open that cache and run fetchAndCache helper function
    // in order to fetch latest version of article
    if (response){
      caches.open('articles-cache').then(function(cache){
        fetchAndCache(request.url, cache);
      });
      // fetchAndCache works in bg. We return response from cache
      return response.clone();
    }
    // else we fetch request
    console.log("pagesCacheHandler | fetch fired for: "+request.url);
    return fetch(request).catch(function(error){
      // in case of error we try pass request to function that returns offline page if possible
      return offlineHandler(request);
      throw Error('offline');
    });
  });
}


/**
 * Event Listener
 * handles communication with website and cahces received article urls
 */
 self.addEventListener('message', function(event) {
  var data = event.data;
  if (data.command == "pleaseCache") {
    caches.open('articles-cache').then(function(cache) {
      cache.match(data.url).then(function(response) {
        if(!response) fetchAndCache(data.url, cache);
      });
      return;
    });
  }
});

// --------------- HELPERS

/**
 * offlineHandler
 * @param {Request} request
 * @returns {Response}
 * returns offline page if possible
 */
 function offlineHandler(request){
  //  if U don't want to have custom offline page uncomment line below.
  //  throw Error('Offline');
  if (request.method === 'GET' && request.headers.get('accept').includes('text/html')){
    console.log("Getting offline page...");
    return caches.match(OFFLINE_URL).then(function(response) {
      if (response) return response;
      throw Error('The cached response that was expected is missing.');
    });
  }
}

/**
 * fetchAndCache
 * @param {string} url - url to fetch and cache
 * @param {Object} cache - cache object
 * @returns {Response}
 * fetches given url, puts result to given cache, clears given cache
 */
 function fetchAndCache(url, cache) {
  return fetch(url).then(function (response) {
    if (successResponses.test(response.status)) {
      // caching response
      console.log('got '+url);
      cache.put(url, response.clone());
      // clear cache. Maximum items in cache is 100
      cache.keys().then(function(keys) {
        if(keys.length > 100){
          var loopLength = keys.length - 100;
          for (var i = 0; i < loopLength; i++) {
            cache.delete(keys[i]);
            console.log("deleting: "+keys[i] );
          }
        }
      });
    }
    return response.clone();
  });
};

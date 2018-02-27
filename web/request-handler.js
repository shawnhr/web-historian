var path = require('path');
var archive = require('../helpers/archive-helpers');
var http = require('./http-helpers');
var worker = require('../workers/htmlfetcher')
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  if(req.method === 'GET') {
    // res.setHeader('Content-Type', 'application/json');
    if(req.url === '/') {
      var asset = __dirname + '/public/index.html';
      http.serveAssets(res, asset);
    }else{
       var asset = `${archive.paths.archivedSites}/${req.url}`;
       http.serveAssets(res, asset)
    }
  }
  if(req.method === 'POST') {
    req.on('data', (data) => {
      console.log('data', data.toString());
      var url = data.toString().slice(4);

      res.writeHead(302, url);
      archive.isUrlInList(url, (exists) => {
        if (!exists) {
          archive.addUrlToList(url, () =>{
            http.loadingPage(res);
            //archive.downloadUrls([url])
            archive.isUrlArchived(url, (isTrue) => {
              if(!isTrue){
                worker.download(url);
              }
            })
            //worker.download(url);
          });
        }else{
          archive.isUrlArchived(url, (isTrue) => {
            if(!isTrue){
              worker.download(url)
            }
          })
          var asset = `${archive.paths.archivedSites}/${url}`;
          http.serveAssets(res, asset);
        }
      })
    })
  }
};




// var collectData = function(request, callback){
//   var data = '';
//   request.on('data', function(chunk){
//    data += chunk;
//   });
//   request.on('end', function(){
//     callback(JSON.parse(data));
//   });
// };

// var objectId = 1;

// var messages = [
//  {
//    text: 'hello man',
//    username: 'sam',
//    objectId: objectId
//  }
// ];

// var actions = {
//   'GET': function(request, response){
//      sendResponse(response, {results: messages});
//   },
//   'POST': function(request, response){
//      collectData(request, function(message){
//         message
//         messages.push(message);
//         message.objectId += objectId;
//       sendResponse(response, {objectId: 1});
//      });
//   },
//   'OPTIONS': function(request, response){
//      sendResponse(response, null)
//   }
// };


// module.exports = function(request, response) {
//   console.log('Serving request type ' + request.method + ' for url ' + request.url);

//   var action = actions[request.method];
//   if( action ) {
//     action(request, response);
//   } else {
//     sendResponse(response, "Not Found", 404)
//   }


// };




// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var helper = require('../helpers/archive-helpers');

exports.download = function(url){

	helper.downloadUrls([url]);
}
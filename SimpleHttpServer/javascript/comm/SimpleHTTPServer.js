const HTTPUtil = nw.require("http");
const URLUtil = nw.require("url");
const queryStringUtil = nw.require("querystring");

exports.start = function(globalData, handle) {

	function onRequest(request, response) {
		console.log(request);
		var urlObj = URLUtil.parse(request.url);
		var pathname = urlObj.pathname;
		var query = urlObj.query;
		console.log("Request for " + pathname + " received." + " query: " + query);
		route(globalData, request, response, pathname, query, handle);
	};

	HTTPUtil.createServer(onRequest).listen(8888);
	console.log("Server has started.");

};

function parseQueryParam(query) {
	console.log("query: " + query);
	var queryObj = queryStringUtil.parse(query);
	console.log(queryObj); 
	return queryObj
};

function route(globalData, request, response, pathname, query, handle) {
	console.log("route for " + pathname);
	if (typeof handle[pathname] === 'function') {
		var params = parseQueryParam(query);
		handle[pathname](globalData, request, response, query, params);
	} else {
		console.log("No request handle found for " + pathname);
		response.writeHead(404, {"Content-Type": "text/plain"});
		response.write("404 not found");
		response.end();
	}
};

exports.defaultHandle = {
	"/" : function (globalData, request, response, query, params) {
		console.log("Main Page");
		response.writeHead(200, {"Content-Type": "text/plain"});
		response.write("This is main page");
		response.end();
	},
	"404" : function (globalData, request, response, query, params) {
		console.log("No request handle found for " + pathname);
		response.writeHead(404, {"Content-Type": "text/plain"});
		response.write("404 not found");
		response.end();
	}
};

exports.addHandle = function(handle1, handle2) {
	for (key in handle2) {
		console.log("key: " + key + ", value: " + handle2[key]);
		handle1[key] = handle2[key];
	}
	return handle1;
};


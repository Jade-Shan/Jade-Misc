const fs = require("fs");

function getText(response) {
	var text = "Winnie the Witch";
	console.log(text);
	response.writeHead(200, {"Content-Type": "text/plain"});
	response.write(text);
	response.end();
};

function getImage(response) {
	console.log("getImage");
	fs.readFile("./images/emj.jpg", "binary", function(error, file) {
		if(error) {
			response.writeHead(500, {"Content-Type": "text/plain"});
			response.write(error + "\n");
			response.end();
		} else {
			response.writeHead(200, {"Content-Type": "image/jpg"});
			response.write(file, "binary");
			response.end();
		}
	});
};

function getBigImage(response) {
	console.log("getBigImage");
	fs.readFile("./images/table.jpg", "binary", function(error, file) {
		if(error) {
			response.writeHead(500, {"Content-Type": "text/plain"});
			response.write(error + "\n");
			response.end();
		} else {
			response.writeHead(200, {"Content-Type": "image/jpg"});
			response.write(file, "binary");
			response.end();
		}
	});
};

exports.handle = {
	"/get" : function (globalData, request, response, query, params) {
		var type = params["type"];
		switch(type) {
			case "text"     : getText(response); break;
			case "image"    : getImage(response); break;
			case "bigimage" : getBigImage(response); break;
			default:
												var text = "type " + type + " is unknown.";
												console.log(text);
												response.writeHead(200, {"Content-Type": "text/plain"});
												response.write(text);
												response.end();
												break;
		}
	},
	"/api/hello" : function (globalData, request, response, query, params) {
		console.log("Hello World");
		response.writeHead(200, {"Content-Type": "text/plain"});
		response.write("Hello World");
		response.end();
	}
};

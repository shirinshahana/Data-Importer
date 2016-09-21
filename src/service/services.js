var fs = require('fs');
var Promise = require("bluebird");
var config = require("../../config/config.json")
		
module.exports.fileExists = function(files){
	return new Promise(function(resolve, reject) {
			
			if(files.indexOf( config.data)!= -1 && files.indexOf( config.master)!= -1) 
				resolve(true);
			else	
				reject("The given file doesn't exists")

			})
}




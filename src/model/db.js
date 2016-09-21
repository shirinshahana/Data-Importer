var mysql      = require('mysql');

var Promise = require("bluebird"); 
  Promise.promisifyAll(mysql)

var log = require("../../logs/log.js").log

var connection = mysql.createConnection({
   host     : 'localhost',
   user     : 'root' ,
   password : 'root' ,
   database : 'data'
 });

 module.exports.getConnection = function(){
	return new Promise(function(resolve, reject) {
connection.connect(function(err){
		

if(!err) {
	
    resolve(connection);    
} else {
	
    reject("Error connecting to database");    
}
})
} )
}
 
var mysql      = require('mysql');


var log = require("../../logs/log.js").log


 var connection = mysql.createConnection({
   host     : 'localhost',
   user     : 'root' ,
   password : 'rot' ,
   database : 'data'
 });

 
connection.connect(function(err){
if(!err) {
    log.info("Database is connected");    
} else {
    log.error("Error connecting to database");    
}
})
 
 module.exports = connection
 
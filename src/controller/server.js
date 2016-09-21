var db = require("../model/db.js");
var fs = require('fs');
var csvSync = require('csv-parse/lib/sync');
var Promise = require("bluebird"); 
var config = require("../../config/config.json")
var unzip = require('unzip')
var service = require("../service/services.js")


var log = require("../../logs/log.js").log



var error_flag = 0

Promise.promisifyAll(fs)

module.exports.import = function(req, res) {


fs.readdirAsync(config.path)
.then(function(files){
	
	return service.fileExists(files)

})

.then(function(exists){
		
	return [fs.createReadStream(config.path + config.data).pipe(unzip.Extract({ path: config.path }))._opts['path'],fs.createReadStream(config.path + config.master).pipe(unzip.Extract({ path: config.path }))._opts['path']] ;
})


 .then(function(path){
 	
 	return Promise.all([fs.readdirAsync(path[0]+config.munzip),fs.readdirAsync(path[1]+config.dunzip)])

})


.then(function(contents){
	
  return Promise.all([fs.readFileAsync(config.path+config.dunzip+contents[1][0]),fs.readFileAsync(config.path+config.munzip+contents[0][0])])
})

.then(function(contents){

  var data = csvSync(contents[0], {delimiter: ','})
  data.forEach(function(record){
    record= record.map(function(item) { return item == "" ? 0 : item; });
    })


    data= data.filter(function() { return data[0] != ""  });
    console.log(data.length)
    db.query('insert into item_table (sku , dayPrice , currentPrice , salesAmount , salesQuantity , stockQuantity , arrivalQuantity , salesQuantity10H , salesQuantity11H , salesQuantity12H , salesQuantity13H , salesQuantity14H , salesQuantity15H , salesQuantity16H , salesQuantity17H , salesQuantity18H , salesQuantity19H , salesQuantity20H , salesQuantity21H , salesQuantity22H , salesQuantity23H , regionCode ) values ?',[data],function(err,data){
        return (err ? log.error(err) : log.info(" Data Insertion Successful"));
  })



  data= data.filter(function() { return data[0] != ""  });
    console.log(data.length)

  var data = csvSync(contents[1], { delimiter: ','})
  data.forEach(function(record){
    record= record.map(function(item) { return item == "" ? "null" : item; });
    })

    db.query('insert into item_master (storeId, itemLocalName, itemCode, itemType,sku, itemLevel, colorCode, colorName, sizeCode, sizeName, patternLengthCode, core, seasonCode, deptCode, gDeptCode, gDeptName) values ?',[data],function(err,data){
         return (err ? log.error(err) : log.info(" Master Insertion Successful"));
  })

})



.catch(function(err){
	log.error(err)
  error_flag = 1

})



.finally(function(){
  
	 db.end()
   log.info("Closing Database Connection")
  if(error_flag)
    res.status(400).json({'status' : 400, 'message': err})
  else
    res.json({'status' : 200, 'message': "Insertion Successful"})}
	)


}










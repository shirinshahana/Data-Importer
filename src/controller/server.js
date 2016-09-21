var fs = require('fs');
var csvSync = require('csv-parse/lib/sync');
var Promise = require("bluebird"); 
var config = require("../../config/config.json")
var unzip = require('unzip')
var service = require("../service/services.js")
var log = require("../../logs/log.js").log
var mysql= Promise.promisifyAll(require('mysql'))
var error_flag 

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
	
    return Promise.all([fs.readFileAsync(config.path+config.dunzip+contents[1][0]),fs.readFileAsync(config.path+config.munzip+contents[0][0]),require("../model/db.js").getConnection()])
  })

  .then(function(contents){

    var data = csvSync(contents[0], {delimiter: ','})
    data.forEach(function(record){
      record= record.map(function(item) { return item == "" ? 0 : item; });
    })

    data= data.filter(function() { return data[0] != ""  });
    
    var data1 = csvSync(contents[1], { delimiter: ','})
    data1= data1.filter(function() { return data1[0] != ""  });
    data1.forEach(function(record){
      record= record.map(function(item) { return item == "" ? "null" : item; });
    })
    Promise.promisifyAll(contents[2])
    contents[2].queryAsync('insert into item_table (sku , dayPrice , currentPrice , salesAmount , salesQuantity , stockQuantity , arrivalQuantity , salesQuantity10H , salesQuantity11H , salesQuantity12H , salesQuantity13H , salesQuantity14H , salesQuantity15H , salesQuantity16H , salesQuantity17H , salesQuantity18H , salesQuantity19H , salesQuantity20H , salesQuantity21H , salesQuantity22H , salesQuantity23H , regionCode ) values ?',[data])
      .then(contents[2].queryAsync('insert into item_master (storeId, itemLocalName, itemCode, itemType,sku, itemLevel, colorCode, colorName, sizeCode, sizeName, patternLengthCode, core, seasonCode, deptCode, gDeptCode, gDeptName) values ?',[data1]))
         .catch(function(err){

   log.error(err)
    error_flag = err
  })

  })
  .then(function(data){
    
      res.json({'status' : 200, 'message': "Insertion Successful"})
  })
  .catch(function(err){

	 log.error(err)
    error_flag = err
  })

  .finally(function(){
  
     log.info("Closing Database Connection")
    if(error_flag)
      res.status(400).json({'status' : 400, 'message': error_flag})
    
	})


}


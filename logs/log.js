var bunyan = require('bunyan');
module.exports.log = bunyan.createLogger({name: 'data_importer',src : true,streams:[{
        stream: process.stdout},
        {level : "error",
        path: "./logs/error.log"}
      
        ] })

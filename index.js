var express = require('express');
var bodyParser = require("body-parser");
var routes = require('./src/router/routes');

var log = require("./logs/log.js").log
var app = express();
app.use(bodyParser.json());

routes(app);

var server = app.listen(5000, function () {

   var host = server.address().address
   var port = server.address().port

   log.info("Data Importer app listening at http://%s:%s", host, port)
}); 



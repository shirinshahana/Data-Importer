var controller = require('../controller/server.js')

module.exports = function(app) {

	app.get('/import', controller.import);
	
}
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/:hospital/', function(req, res, next) {
	console.log('got to hospital route');
	console.log('db', db)
	// Respond with the most recent timeRange days data (one, seven, or thirty), and the average over the past timeRange days
  	res.send('respond with a resource');
});

module.exports = router;

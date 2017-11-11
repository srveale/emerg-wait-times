const express = require('express');
const moment = require('moment');
const router = express.Router();

const Log = require('../db/logSchema');
const Average = require('../db/averageSchema');

/* GET users listing. */
router.get('/:hospital/', function(req, res, next) {
	const hospital = req.params.hospital
	// Find recent logs
	Log.find({ 
		"name": hospital,
		"currentDate": {"$gte": moment().add(-30, 'days').toDate()
	}})
	.then((logs) => {
		console.log('found logs', logs.length)
		console.log('hospital for average find', hospital);
		// Find Averages
		Average.find(
			{ "name": hospital }
		).sort({"dateGenerated": -1})
		.limit(1)
		.then((average) => {
			console.log('found average', average)
  			res.send({
  				hospital,
  				logs,
  				average
  			});
		})
		.catch((error) => console.log('error getting average', error))
		console.log('found the average')
	})
	.catch((error) => console.log('error in logs find', error))
	// Respond with the most recent timeRange days data (one, seven, or thirty), and the average over the past timeRange days
});

module.exports = router;
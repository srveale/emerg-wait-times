const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	// Respond with ACH recent data and all the current data for the rest
	res.render('index', { title: 'Express' });
});

module.exports = router;
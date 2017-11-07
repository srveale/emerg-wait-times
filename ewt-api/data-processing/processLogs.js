// Get all logs from database, sort by hospital
// For each hospital process into {Date: waitTime} JSON
// Then use recentAverages() and store and save to the averages collection
const mongoose = require('mongoose');
const moment = require('moment');
const _ = require('lodash');

const { Log } = require('../db/logSchema');
const { Average } = require('../db/averageSchema')
const { HOSPITALS } = require('../constants');
const recentAverages = require('./recentAverages');

const processLogs = () => {
	console.log('processing logs');

	mongoose.connect('mongodb://localhost/ewt')
	.then(()=> {
		console.log('Looping through hospital promises')

		// Loop through each hospital and find its logs
		return Promise.all(HOSPITALS.splice(0,1).map(hospital => {
			console.log('starting hospital', hospital)
			Log.find({ "name" : hospital })
			.then(logs => {

				// Create a timeData object to be fed to recentAverages
				console.log('found logs', logs.length)
				const timeData = {};
				logs.map((log, i) => {
					const [hours, minutes] = log.waitTime.split(':');
					const totalTime = Number(hours) * 60 + Number(minutes);
					timeData[log.currentDate.toString()] = totalTime;
				})
				console.log('timeData after map', Object.keys(timeData).length)
				// Save the averages to the db
				const averageLog = new Average();
				averageLog.averages = {
					"daily": recentAverages(timeData, "daily"),
					// "weekly": recentAverages(timeData, "weekly"),
					// "monthly": recentAverages(timeData, "monthly"),
				}
				console.log('averageLog.averages', averageLog.averages)
				averageLog.dateGenerated = new Date();
				averageLog.name = hospital;
				averageLog.save();
			})
		}))
		// .then(() => {
		// 	mongoose.disconnect();
		// })
	})
	.catch((err) => console.error("Mongoose error", err))
}

processLogs();

module.exports = processLogs;
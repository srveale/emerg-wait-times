const mongoose = require('mongoose');
const moment = require('moment');
const _ = require('lodash');

// Get all logs from database, sort by hospital
// For each hospital process into {Date: waitTime} JSON
// Then use recentAverages() and store and save to the averages collection

const { Log } = require('../db/logSchema');
const { Average } = require('../db/averageSchema')
const { HOSPITALS } = require('../constants');
const recentAverages = require('./recentAverages');

const processLogs = () => {
	mongoose.connect('mongodb://localhost/ewt')
	.then(()=> {
		return Promise.all(HOSPITALS.map(hospital => {
			const logs = Log.find({ "name": hospital })
			.then((logs) => {
				// Create a timeData object to be fed to recentAverages
				const timeData = {};
				logs.map(log => {
					const [hours, minutes] = log.waitTime.split(':');
					const totalTime = Number(hours) * 60 + Number(minutes);
					timeData[log.currentDate] = totalTime;
				})

				// Save the averages to the db
				const averageLog = new Average();
				averageLog.averages = {
					"daily": recentAverages(timeData, "daily");
					"weekly": recentAverages(timeData, "weekly");
					"monthly": recentAverages(timeData, "monthly");
				}
				averageLog.dateGenerates = new Date();
				averageLog.name = hospital;
				averageLog.save();
			})
		})
		.then(() => {
			mongoose.disconnect();
		})
	})
}

processLogs();

module.exports = processLogs;
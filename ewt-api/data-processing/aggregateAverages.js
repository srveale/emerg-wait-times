// Get all average documents for all hospitals
// Average the averages
const mongoose = require('mongoose');
const moment = require('moment');
const _ = require('lodash');

const Log = require('../db/logSchema');
const Average = require('../db/averageSchema')
const { HOSPITALS } = require('../constants');

const aggregateAverages = () => {
	console.log('aggregating hospital average times')
	mongoose.connect('mongodb://localhost/ewt')
	.then(() => {
		console.log('mapping throuhg')
		Average.find()
		.then(averageDocs => {
			console.log('found average docs', averageDocs.length)
			// I miss python
			const aggregate = {
				daily: [],
				weekly: [],
				monthly: [],
			}
			averageDocs.forEach(averageDoc => {
				aggregate.daily.push(averageDoc.averages[0].daily)
				aggregate.weekly.push(averageDoc.averages[0].weekly)
				aggregate.monthly.push(averageDoc.averages[0].monthly)
			})
			const dailyIncrementArray = [];
			_.range(aggregate.daily[0].length).forEach(i => {
				let sum = 0;
				aggregate.daily.forEach((hospital, j) => {
					sum += aggregate.daily[j][i];
				})
				dailyIncrementArray.push(sum / aggregate.daily.length);
			})

			const weeklyIncrementArray = [];
			_.range(aggregate.weekly[0].length).forEach(i => {
				let sum = 0;
				aggregate.weekly.forEach((hospital, j) => {
					sum += aggregate.weekly[j][i];
				})
				weeklyIncrementArray.push(sum / aggregate.weekly.length);
			})

			const monthlyIncrementArray = [];
			_.range(aggregate.monthly[0].length).forEach(i => {
				let sum = 0;
				aggregate.monthly.forEach((hospital, j) => {
					sum += aggregate.monthly[j][i];
				})
				monthlyIncrementArray.push(sum / aggregate.monthly.length);
			})

			const averageLog = new Average();
			averageLog.name = 'aggregate';
			averageLog.averages = {
				daily: dailyIncrementArray,
				weekly: weeklyIncrementArray,
				monthly: monthlyIncrementArray,
			}
			averageLog.save();
		})
		.then(() => {
			console.log('after finding everything')
			console.log('averageDocs', averageDocs)
		})
	})

}

aggregateAverages();
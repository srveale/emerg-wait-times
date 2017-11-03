const moment = require('moment')
const timeData = require('./times-nov-1');

// Find the interval: daily, weekly, monthly
// Increments: daily - 10 minutes, weekly - 1 hour, monthly - 1 day
// Cut up the interval into increments, and for each increment, find all the logs in that increment
// Eg a weekly 1 hr increment on Mon from 4-5am
// Average the wait time for each of those logs, and return [{"increment name" : average}, ...]


const processTimes = (timeData) => {
	// Find the average time for each 10 minute interval in a day

	// create an array of times five minutes apart, counting from 12:05 am to 11:55 pm
	const timeRange = [...Array(288).keys()].map(key => key * 5);

	const averageTimes = [];

	timeRange.map(minute => {
		if (minute === 0) return;

		const min = minute - 5;
		const max = minute + 5;

		logs = Object.keys(timeData).filter(logTime => {
			logTimeFromMidnight = moment(logTime).minutes() + moment(logTime).hours() * 60
			return logTimeFromMidnight > min && logTimeFromMidnight < max
		})

		averageTimes.push(averageTime(logs, timeData).toFixed(0));
	})

	return averageTimes;
}

const averageTime = (dates, timeData) => {
	// loop over dates, which are the keys of a waitTime array
	let sum = 0;
	let count = 0;

	dates.filter(date => !isNaN(timeData[date])).map(date => {
		sum += timeData[date];
		count ++;
	})

	return sum / count;
}

module.exports = processTimes;
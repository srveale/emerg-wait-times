// Find the interval: daily, weekly, monthly
// Increments: daily - 10 minutes, weekly - 1 hour, monthly - 1 day
// Cut up the interval into increments, and for each increment, find all the logs in that increment
// Eg a weekly 1 hr increment on Mon from 4-5am

// TODO: Find ALL logs in increment, instead of the logs from that most recent increment
// Ie, EVERY Mon from 4-5am, instead of LAST Mon from 4-5am
// Going to have to do an overall change, using moment.startOf('day') for example

// Average the wait time for each of those logs, and return [{"increment name" : average}, ...]
// Where increment name is the number of minutes since the start of the day, week, or month
// Expecting timeData in format {Date: waitTime}
const moment = require('moment')

const calculateAverages = (timeData, interval) => {
	console.log('calculating averages', Object.keys(timeData).length)
	// Find the average time for each 10 minute interval in a day

	const momentInterval = { "daily": "day", "weekly": "week", "monthly": "month" }[interval];
	// Need startTimes to be periodic, instead of just one start time.
	// const start = moment().add(-1, momentInterval);
	const start = moment().startOf(momentInterval)
	console.log("start", start);

	const timeRange = getTimeRange(interval);

	const averageTimes = [];
	const timeDataDates = Object.keys(timeData);
	timeRange.map((minute, ind) => {
		if (minute === 0) return; // Will need to handle wrapping of border cases

		const [min, max] = getIncrement(timeRange, interval, start, ind);
		console.log("min, max", min, max);

		const logs = filterLogs(timeDataDates, start, min, max, momentInterval);
		console.log("logs", logs.length);

		averageTimes.push(Number(averageTime(logs, timeData).toFixed(0)));
	})
	console.log('averageTimes', averageTimes.length)
	return averageTimes;
}

const getTimeRange = (interval) => {
	// Take the interval and return an array of times (in min) since the start of the period
	// Daily has 5 min increments, Weekly has one hour, Monthly has one day
	const numPoints = {"daily": 288, "weekly": 168, "monthly": 30}[interval];
	const minsPerPoint = {"daily": 5, "weekly": 60, "monthly": 1440}[interval];
	return [...Array(numPoints).keys()].map(key=> key * minsPerPoint);
}

const getIncrement = (timeRange, interval, start, ind) => {
	// Return [min, max] times for the current increment
	const [ minutesFromStartMin, minutesFromStartMax ] = [ timeRange[ind - 1], timeRange[ind + 1]];
	const [min, max] = [moment(start).add(minutesFromStartMin, 'minutes'), moment(start).add(minutesFromStartMax, 'minutes')];
	// return [ timeRange[ind - 1], timeRange[ind + 1]];
	return [min, max]
}

const filterLogs = (timeDataDates, start, min, max, momentInterval) => {
    console.log("momentInterval", momentInterval);
	// Each entry in timeData has format {Date: waitTime}
	// Allow if (diff start and Date) is btwn (diff start and min) and (diff start and max)
	const minDiff = min.diff(start, 'minutes');
	const maxDiff = max.diff(start, 'minutes');
	return timeDataDates.filter((logTime, i) => {
		// const startDiff = moment(logTime).startOf(momentInterval).diff(moment(logTime), 'minutes');
		const startDiff = moment(logTime).diff(moment(logTime).startOf(momentInterval), 'minutes')
		// console.log("startDiff", startDiff);

		return startDiff >= minDiff && startDiff <= maxDiff;
	})
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

module.exports = calculateAverages;
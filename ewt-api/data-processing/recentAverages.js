// Find the interval: daily, weekly, monthly
// Increments: daily - 10 minutes, weekly - 1 hour, monthly - 1 day
// Cut up the interval into increments, and for each increment, find all the logs in that increment
// Eg a weekly 1 hr increment on Mon from 4-5am

// Average the wait time for each of those logs, and return [{"increment name" : average}, ...]
// Where increment name is the number of minutes since the start of the day, week, or month
// Expecting timeData in format {Date: waitTime}
const moment = require('moment')

const calculateAverages = (timeData, interval) => {
	// Find the average time for each 10 minute interval in a day

	// Get most recent start of inteverval
	const momentInterval = { "daily": "day", "weekly": "week", "monthly": "month" }[interval];
	const start = moment().startOf(momentInterval)
	console.log("start", start);

	// Get array of increments
	const timeRange = getTimeRange(interval);

	const averageTimes = [];
	const timeDataDates = Object.keys(timeData);
	// Loop over timeData to populate averages
	timeRange.map((minute, ind) => {

		const [min, max] = getIncrement(timeRange, interval, start, ind);
		const logs = filterLogs(timeDataDates, start, min, max, momentInterval);

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

	let minutesFromStartMin, minutesFromStartMax;
	// Handle first element. timeRange[1] is a proxy for the size of an increment
	if (ind === 0) {
		minutesFromStartMin = timeRange[timeRange.length -1] - timeRange[1];
		minutesFromStartMax = timeRange[1];
	}
	// Handle the last element. (Is this the same interval as the first element? need coffee and a whiteboard)
	else if (ind === timeRange.length - 1 ) {
		minutesFromStartMin = timeRange[timeRange.length -1] - timeRange[1];
		minutesFromStartMax = timeRange[1];
	} 
	// Handle every other element
	else {
		minutesFromStartMin = timeRange[ind - 1];
		minutesFromStartMax = timeRange[ind + 1];
	}
	const [min, max] = [moment(start).add(minutesFromStartMin, 'minutes'), moment(start).add(minutesFromStartMax, 'minutes')];
	// return [ timeRange[ind - 1], timeRange[ind + 1]];
	return [min, max]
}

const filterLogs = (timeDataDates, start, min, max, momentInterval) => {
	// Each entry in timeData has format {Date: waitTime}
	// Allow if (diff start and Date) is btwn (diff start and min) and (diff start and max)
	// Where start is periodic - the beginning of each interval
	const minDiff = min.diff(start, 'minutes');
	// console.log("minDiff", minDiff);
	const maxDiff = max.diff(start, 'minutes');
	// console.log("maxDiff", maxDiff);

	return timeDataDates.filter((logTime, i) => {
		// console.log('starting filter', logTime)
		const startDiff = moment(logTime).diff(moment(logTime).startOf(momentInterval), 'minutes');

		// Handle first and last element
		if (maxDiff < minDiff) {
			// console.log('first or last element', minDiff, maxDiff)
			// console.log('returning from filter', startDiff > minDiff || startDiff < maxDiff)
			return startDiff > minDiff || startDiff < maxDiff;
		}
		// Handle last element
		// Leave it as being handled in the same way as the first element?

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
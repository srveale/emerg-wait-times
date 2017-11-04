const moment = require('moment');
const lodash = require('lodash');

// Get all logs from database, sort by hospital
// For each hospital process into {Date: waitTime} JSON
// Then use recentAverages() and store and save to the averages collection
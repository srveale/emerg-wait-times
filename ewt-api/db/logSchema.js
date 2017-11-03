const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const logSchema = new Schema({
  name:  String,
  waitTime: String,
  currentDate: { type: Date, default: Date.now },
});

const Log = mongoose.model('Log', logSchema);
module.exports = { Log };
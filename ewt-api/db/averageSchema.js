const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const averageSchema = new Schema({
  name:  String,
  averages: Array,
  dateGenerated: { type: Date, default: Date.now },
});

const Average = mongoose.model('Average', averageSchema);
module.exports = { Average };
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  slackId: Number,
  eventId: String,
  title: String,
  description: String,
  startTime: Date,
  endTime: Date,
  signUpUrl: String
});

module.exports = mongoose.model('Event', eventSchema);

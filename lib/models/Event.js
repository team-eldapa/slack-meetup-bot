const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  slackId: Number,
  eventId: String,
  title: String,
  description: String,
  startTime: Date,
  endTime: Date,
  signUpUrl: String
}, {
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;
    }
  }
});

module.exports = mongoose.model('Event', eventSchema);

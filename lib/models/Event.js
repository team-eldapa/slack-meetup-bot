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
      delete ret.__V;
    }
  }
});

eventSchema.statics.getUsersBySignedUpEvent = function(eventId) {
  return this.aggregate([{
    '$match': { 'eventId': `${eventId}` } }, {
    '$lookup': {
      'from': 'users',
      'localField': 'eventId', 
      'foreignField': 'signedUpEvents', 
      'as': 'usersSignedUp' } }, {
    '$project': {
      'eventId': '$eventId',
      'users': '$usersSignedUp.name' } }, {
    '$unwind': { 'path': '$users' } }
  ]);
};

module.exports = mongoose.model('Event', eventSchema);

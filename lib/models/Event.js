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

eventSchema.statics.getSignedUpUsers = function() {
  return this.aggregate([{
    '$lookup': {
      'from': 'users', 
      'localField': 'eventId', 
      'foreignField': 'signedUpEvents', 
      'as': 'usersSignedUp' } }, {
    '$project': {
      'slackId': '$slackId', 
      'eventId': '$eventId', 
      'title': '$title', 
      'signUpUrl': '$signUpUrl', 
      'usersSignedUp': '$usersSignedUp', 
      'numOfUsers': {
        '$size': '$usersSignedUp' } } }, {
    '$match': {
      'numOfUsers': {
        '$gte': 1 } } } 
  ]);
};

module.exports = mongoose.model('Event', eventSchema);

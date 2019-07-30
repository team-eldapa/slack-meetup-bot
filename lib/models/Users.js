const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  signedUpMeetups: String,
  pasdMeetups: String
});

module.exports = mongoose.model('User', userSchema);

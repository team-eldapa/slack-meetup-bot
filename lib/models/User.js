const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  signedUpEvents: Array
}, {
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;
    }
  }
}); 

module.exports = mongoose.model('User', userSchema);

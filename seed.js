require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./lib/models/Event');
// const User = require('./lib/models/user');
const eventScraper = require('./lib/services/events-scrapper');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

const seedData = async() => {
  await mongoose.connection.dropCollection('events');
  return eventScraper()
    .then(events => Event.create(events))
    .then(() => console.log('done'))
    .finally(() => mongoose.connection.close())
    .catch(console.log);
};

seedData();

require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./lib/models/event');
const eventScraper = require('./lib/services/events-scrapper');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

const seedData = () => {
  return eventScraper()
    .then(events => Event.create(events))
    .then(() => console.log('done'))
    .finally(() => mongoose.connection.close())
    .catch(console.log);
};

seedData();


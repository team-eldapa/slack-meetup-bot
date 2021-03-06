require('dotenv').config();
const mongoose = require('mongoose');
const eventScraper = require('./lib/services/events-scrapper');
const Event = require('./lib/models/Event');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

const seedData = async() => {
  try {
    await mongoose.connection.dropCollection('events');
  } catch(e) {
    console.log(e);
  }

  return eventScraper()
    .then(events => Event.create(events))
    // eslint-disable-next-line no-console
    .then(() => console.log('Done, scraped calagator and seeded database.'))
    .catch(console.log);
};

module.exports = seedData;

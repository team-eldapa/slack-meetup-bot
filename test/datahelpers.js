require('dotenv').config();
const seedData = require('./seed-data');
const Event = require('../lib/models/Event');
const User = require('../lib/models/User');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');

const url = process.env.MONGODB_TEST_URI || process.env.MONGODB_URI;

function seed(seedData) {
  Event
    .create(seedData);

  User
    .create({
      name: 'George Ludocrouix',
      signedUpEvents: ['1250475851', '1250475745', '1250475879']
    }, {
      name: 'Mark McFrank',
      signedUpEvents: ['1250475901', '1250475745', '1250475929', '1250475845']
    });
}

beforeAll(async() => {
  connect(url);
  await seed(seedData);
});

beforeAll(() => {
  return mongoose.connection.dropDatabase();
});

afterAll(() => {
  return mongoose.connection.close();
});

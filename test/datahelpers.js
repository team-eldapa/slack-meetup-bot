require('dotenv').config();
const seedData = require('./seed-data');
const Event = require('../lib/models/Event');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');

const url = process.env.MONGODB_TEST_URI || process.env.MONGODB_URI;

function seed(seedData) {
  Event
    .create(seedData);
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

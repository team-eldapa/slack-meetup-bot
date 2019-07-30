require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('gets all events with GET', () => {
    return request(app)
      .get('/api/v1/events')
      .then(res => {
        res.body.forEach(event => {
          expect(event).toEqual({
            _id: expect.any(String),
            startTime: expect.any(String),
            endTime: expect.any(String),
            eventId: expect.any(String),
            description: expect.any(String),
            signUpUrl: expect.any(String),
            title: expect.any(String)
          });
        });
      });
  });
});

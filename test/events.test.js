require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Event = require('../lib/models/Event');

describe('app routes', () => {
  let events = [];
  beforeAll(async() => {
    connect();
    events = await Event.find();
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

  it('gets an event by its Id with GET:id', () => {
    const event = events[0];
    return request(app)
      .get(`/api/v1/events/${event._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: event._id.toString(),
          startTime: event.startTime,
          endTime: event.endTime,
          eventId: event.eventId,
          description: event.description,
          signUpUrl: event.signUpUrl,
          title: event.title
        });
      });
  });
});

const { Router } = require('express');
const Event = require('../models/Event');

module.exports = Router()
  .get('/', (req, res, next) => {
    Event
      .find()
      .sort({ slackId: -1 })
      .then(events => res.send(events))
      .catch(next);
  })

  .get('/daily', (req, res, next) => {
    Event
      .find({
        startTime: {
          $gte: new Date(), 
          $lt: new Date(new Date().setHours(23, 59, 59, 999))
        }
      })
      .sort({ slackId: -1 })
      .then(events => res.send(events))
      .catch(next);
  })

  .get('/weekly', (req, res, next) => {
    Event
      .find({
        startTime: {
          $gte: new Date(), 
          $lt: new Date(new Date().setDate(new Date().getDate() + 7))
        }
      })
      .sort({ slackId: -1 })
      .then(events => res.send(events))
      .catch(next);
  })
    
  .get('/attending', (req, res, next) => {
    Event 
      .getSignedUpUsers()
      .then(events => res.send(events))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Event
      .find({ slackId: req.params.id })
      .then(event => res.send(event))
      .catch(next);
  });

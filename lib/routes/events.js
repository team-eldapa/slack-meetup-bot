const { Router } = require('express');
const Event = require('../models/Event');

module.exports = Router()
  .get('/', (req, res, next) => {
    Event
      .find()
      .select({ __v: false })
      .then(events => res.send(events))
      .catch(next);
  })
  .get('/:id', (req, res, next) => {
    Event
      .findById(req.params.id)
      .select({ __v: false })
      .then(event => res.send(event))
      .catch(next);
  });

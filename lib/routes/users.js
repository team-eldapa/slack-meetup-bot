const { Router } = require('express');
const User = require('../models/User');

module.exports = Router()
  .post('/', (req, res, next) => {
    const { name, eventId } = req.body;

    User
      .create({ name, signedUpEvents: [eventId] })
      .then(user => res.send(user))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    User
      .find({ name: req.params.id })
      .then(user => res.send(user))
      .catch(next);
  })

  .patch('/events/add/:id', (req, res, next) => {
    const { eventId } = req.body;
    User
      .findOneAndUpdate({ name: req.params.id }, { $addToSet: { signedUpEvents: [eventId] } })
      .then(updated => res.send(updated))
      .catch(next);
  })

  .patch('/events/remove/:id', (req, res, next) => {
    const { eventId } = req.body;
    User
      .findOneAndUpdate({ name: req.params.id }, { $pull: { signedUpEvents: eventId } })
      .then(updated => res.send(updated))
      .catch(next);
  });

const { Router } = require('express');
const User = require('../models/User');

module.exports = Router()
  .post('/', (req, res, next) => {
    const { name, eventId } = req.body;

    User
      .create({ name, signedUpEvents: eventId })
      .then(user => res.send(user))
      .catch(next);
  });
  
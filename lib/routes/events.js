const { Router } = require('express');
const Event = require('../models/Event');

module.exports = Router()
  .get('/', (req, res, next) => {
    Event
      .find()
      .select({ __v: false })
      .then(events => res.send(events))
      .catch(next);
  });

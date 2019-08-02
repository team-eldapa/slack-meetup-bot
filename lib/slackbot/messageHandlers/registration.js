const request = require('superagent');
const { sendMessage } = require('../bot');

const registerEvent = (channel, user, message) => {
  const slackId = message.split('register ')[1];
  let event;
  return request
    .get(`http://localhost:7890/api/v1/events/${slackId}`)
    .then(res => {
      event = res.body[0];
      if(!event) {
        sendMessage(channel, `Sorry <@${user}>, we didn't find an event matching that ID.`);
        return;
      }
      return request
        .get(`http://localhost:7890/api/v1/users/${user}`)
        .then(res => {
          const receivedUser = res.body[0];
          if(!receivedUser) {
            return request
              .post('http://localhost:7890/api/v1/users')
              .send({ name: user, eventId: event.eventId })
              .then(() => { 
                sendMessage(channel, `You have added \`${event.title}\` to your MeetupBot queue. \n
                To officially register please visit: ${event.signUpUrl} or http://calagator.org/events/${event.eventId}.
                `);
                return;
              });
          }
          return request
            .patch(`http://localhost:7890/api/v1/users/events/add/${user}`)
            .send({ eventId: event.eventId })
            .then(() => {
              sendMessage(channel, `You have added \`${event.title}\` to your MeetupBot queue.
              \n To officially register please visit: ${event.signUpUrl} or http://calagator.org/events/${event.eventId}.
              `);
            });
        });
    });
};

module.exports = { registerEvent };

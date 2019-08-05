const request = require('superagent');
const { sendMessage } = require('../bot');

const URL = process.env.URL;

const registerEvent = (channel, user, message) => {
  const slackId = message.split('register ')[1];
  let event;
  return request
    .get(`${URL}events/${slackId}`)
    .then(res => {
      event = res.body[0];
      if(!event) {
        sendMessage(channel, `Sorry <@${user}>, we didn't find an event matching that ID.`);
        return;
      }
      return request
        .get(`${URL}users/${user}`)
        .then(res => {
          const receivedUser = res.body[0];
          if(!receivedUser) {
            return request
              .post(`${URL}users`)
              .send({ name: user, eventId: event.eventId })
              .then(() => { 
                sendMessage(channel, `You have added \`${event.title}\` to your MeetupBot queue. \n
                To officially register please visit: ${event.signUpUrl} or http://calagator.org/events/${event.eventId}.
                `);
                return;
              });
          }
          return request
            .patch(`${URL}users/events/add/${user}`)
            .send({ eventId: event.eventId })
            .then(() => {
              sendMessage(channel, `You have added \`${event.title}\` to your MeetupBot queue.
              \n To officially register please visit: ${event.signUpUrl} or http://calagator.org/events/${event.eventId}.
              `);
            });
        });
    });
};

const unregisterEvent = (channel, user, message) => {
  const slackId = message.split('unregister ')[1];
  let event;
  return request
    .get(`${URL}events/${slackId}`)
    .then(res => {
      event = res.body[0];
      if(!event) {
        sendMessage(channel, `Sorry <@${user}>, we didn't find an event matching that ID.`);
        return;
      }
      return request
        .get(`${URL}users/${user}`)
        .then(res => {
          const receivedUser = res.body[0];
          if(!receivedUser) {
            sendMessage(channel, `Sorry <@${user}>, you are not a registered user.\n You can register for an event with \`@Meetup Bot /register <id>\`.`);
            return;
          }
          return request
            .patch(`${URL}users/events/remove/${user}`)
            .send({ eventId: event.eventId })
            .then(() => {
              sendMessage(channel, `You have removed \`${event.title}\` from your MeetupBot queue.`);
            });
        });
    });
};

const sendAttending = (channel) => {
  const formattedEvents = {
    text: '_*Alchemy members attending upcoming meetups:*_\n'
  };

  return request
    .get(`${URL}events/attending`)
    .then(res => {
      const events = res.body;
      events.forEach(event => {
        const usersAttending = [];
        event.usersSignedUp.forEach(attendingUser => {
          usersAttending.push(`<@${attendingUser.name}> `);
        });
        formattedEvents.text += `*${event.slackId}*: ${event.title}
        Users attending: ${usersAttending.toString()}
        \n`;
      });
    })
    .then(() => {
      sendMessage(channel, formattedEvents.text);
    });
};

module.exports = { registerEvent, unregisterEvent, sendAttending };

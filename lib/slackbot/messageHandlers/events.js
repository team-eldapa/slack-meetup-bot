const request = require('superagent');
const { sendMessage } = require('../bot');

const URL = process.env.URL;

const sendAllEvents = (channel) => {
  const formattedEvents = {
    text: ''
  };
  
  return request
    .get(`${URL}events`)
    .then(res => res.body)
    .then(events => {
      events.forEach(event => {
        const options = { hour: 'numeric', minute: 'numeric', hour12: true };
        const startDate = new Date(event.startTime).toLocaleDateString();
        const startTime = new Date(event.startTime).toLocaleString('en-US', options);
        const endTime = new Date(event.endTime).toLocaleString('en-US', options);

        formattedEvents.text += `*${event.slackId}*: \`${event.title}\`
        _${startDate}: ${startTime} - ${endTime}_ 
        \n`;
      });
    })
    .then(() => {
      sendMessage(
        channel,
        formattedEvents.text
      );
    })
    .then(() => {
      setTimeout(() => {
        sendMessage(
          channel,
          '*Quick Tip*: Register for an event above by using `@MeetupBot /register <id>`'
        );
      }, 1000);
    });
};

const sendEventDetails = (channel, user, message) => {
  const slackId = message.split('details ')[1];
  let event;
  const params = {
    icon_emoji: ':question:'
  };
  return request
    .get(`${URL}events/${slackId}`)
    .then(res => {
      event = res.body[0];
      if(!event) {
        sendMessage(channel, `Sorry <@${user}>, we didn't find an event matching that ID.`);
        return;
      }
      const options = { hour: 'numeric', minute: 'numeric', hour12: true };
      const startDate = new Date(event.startTime).toLocaleDateString();
      const startTime = new Date(event.startTime).toLocaleString('en-US', options);
      const endTime = new Date(event.endTime).toLocaleString('en-US', options);
      const formattedEvent = {
        text: `*${event.slackId}*: \`${event.title}\`
        _${startDate}: ${startTime} - ${endTime}_
        ${event.description}
        \n
        Click here to sign up: ${event.signUpUrl}
      `
      };
      sendMessage(channel, formattedEvent.text, params);
    });
};

const sendDailyEvents = (channel) => {
  const formattedEvents = {
    text: ''
  };
  
  return request
    .get(`${URL}events/daily`)
    .then(res => res.body)
    .then(events => {
      events.forEach(event => {
        const options = { hour: 'numeric', minute: 'numeric', hour12: true };
        const startDate = new Date(event.startTime).toLocaleDateString();
        const startTime = new Date(event.startTime).toLocaleString('en-US', options);
        const endTime = new Date(event.endTime).toLocaleString('en-US', options);

        formattedEvents.text += `*${event.slackId}*: \`${event.title}\`
        _${startDate}: ${startTime} - ${endTime}_ 
        \n`;
      });
    })
    .then(() => {
      sendMessage(
        channel,
        formattedEvents.text
      );
    })
    .then(() => {
      setTimeout(() => {
        sendMessage(
          channel,
          '*Quick Tip*: Register for an event above by using `@Meetup Bot /register <id>`'
        );
      }, 1000);
    });
};

const sendWeeklyEvents = (channel) => {
  const formattedEvents = {
    text: ''
  };
  
  return request
    .get(`${URL}events/weekly`)
    .then(res => res.body)
    .then(events => {
      events.forEach(event => {
        const options = { hour: 'numeric', minute: 'numeric', hour12: true };
        const startDate = new Date(event.startTime).toLocaleDateString();
        const startTime = new Date(event.startTime).toLocaleString('en-US', options);
        const endTime = new Date(event.endTime).toLocaleString('en-US', options);

        formattedEvents.text += `*${event.slackId}*: \`${event.title}\`
        _${startDate}: ${startTime} - ${endTime}_ 
        \n`;
      });
    })
    .then(() => {
      sendMessage(
        channel,
        formattedEvents.text
      );
    })
    .then(() => {
      setTimeout(() => {
        sendMessage(
          channel,
          '*Quick Tip*: Register for an event above by using `@Meetup Bot /register <id>`'
        );
      }, 1000);
    });
};

module.exports = { sendAllEvents, sendEventDetails, sendDailyEvents, sendWeeklyEvents };

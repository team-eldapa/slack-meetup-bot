const request = require('superagent');
const { sendMessage } = require('../bot');

const sendAllEvents = (channel) => {
  const formattedEvents = {
    text: ''
  };
  
  return request
    .get('http://localhost:7890/api/v1/events')
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

module.exports = { sendAllEvents };

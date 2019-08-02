const request = require('superagent');
const { sendMessage } = require('./bot');
const { registerEvent, unregisterEvent, sendAttending } = require('./messageHandlers/users');
const { sendAllEvents, sendEventDetails, sendDailyEvents } = require('./messageHandlers/events');

const sendHelp = (channel, user) => {
  const params = {
    icon_emoji: ':question:'
  };
  sendMessage(
    channel,
    `Hey, <@${user}>! \n *Here are the things you can ask me to do:*
      - \`@Meetup Bot /all\` to see all upcoming events.
      - \`@Meetup Bot /weekly\` to see weekly events.
      - \`@Meetup Bot /daily\` to see today's events.
      - \`@Meetup Bot /attending\` to see events that other students are attending.
      - \`@Meetup Bot /details <id>\` to see an events details.
      - \`@Meetup Bot /register <id>\` to add an event to your events.
      - \`@Meetup Bot /unregister <id>\` to remove an event from your events.
      `,
    params
  );
};

const sendUnrecognized = (channel, user) => {
  const params = {
    icon_emoji: ':interrobang:'
  };
  sendMessage(
    channel,
    `Uh oh <@${user}>, I didn't recognize that command. Try using \`@Meetup Bot /help\`.`,
    params
  );
};

const sendWeeklyEvents = (channel) => {
  const formattedEvents = {
    text: ''
  };
  
  return request
    .get('http://localhost:7890/api/v1/events/weekly')
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

const functionMap = {
  help: sendHelp,
  all: sendAllEvents,
  register: registerEvent,
  daily: sendDailyEvents,
  weekly: sendWeeklyEvents,
  details: sendEventDetails,
  attending: sendAttending,
  unregister: unregisterEvent
};

function handleMessage(channel, user, message) {
  // eslint-disable-next-line no-unused-vars
  const [pre, rawPath] = message.split(' /');
  // eslint-disable-next-line no-unused-vars
  const [path, slackId] = rawPath.split(' ');
  const sendFunction = functionMap[path];
  if(sendFunction){
    sendFunction(channel, user, message);
  } else {
    sendUnrecognized(channel, user);
  }
}

module.exports = { handleMessage };

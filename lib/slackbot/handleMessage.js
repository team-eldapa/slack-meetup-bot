const { registerEvent, unregisterEvent, sendAttending } = require('./messageHandlers/users');
const { sendAllEvents, sendEventDetails, sendDailyEvents, sendWeeklyEvents } = require('./messageHandlers/events');
const { sendHelp, sendUnrecognized } = require('./messageHandlers/helpers');

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

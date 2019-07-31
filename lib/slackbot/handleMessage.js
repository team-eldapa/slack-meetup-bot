const request = require('superagent');
const SlackBot = require('slackbots');
const token = process.env.SLACK_BOT;

const bot = new SlackBot({
  token,
  name: 'MeetupBot'
});

function handleMessage(user, message, channel) {
  if(message.includes(' /help')) {
    sendHelp(user, channel);
  } else if(message.includes(' /all-events')) {
    sendAllEvents(user, channel);
  } else {
    sendUnrecognized(user, channel);
  }
}

const sendAllEvents = (user, channel) => {
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
      bot.postMessage(
        channel,
        formattedEvents.text
      );
    })
    .then(() => {
      setTimeout(() => {
        bot.postMessage(
          channel,
          '*Quick Tip*: Register for an event above by using `@MeetupBot /register <id>`'
        );
      }, 1000);
    });
};

const sendHelp = (user, channel) => {
  const params = {
    icon_emoji: ':question:'
  };
  bot.postMessage(
    channel,
    `Hey, <@${user}>! \n *Here are the things you can ask me to do:*
      - \`@meetupbot /all-events\` to get all upcoming events.
      - \`@meetupbot /weekly\` for weekly events.`,
    params
  );
};

const sendUnrecognized = (user, channel) => {
  const params = {
    icon_emoji: ':interrobang:'
  };
  bot.postMessage(
    channel,
    `Uh oh <@${user}>, I didn't recognize that command. Try using '@meetupbot help'.`,
    params
  );
};

module.exports = handleMessage;

require('dotenv').config();
const SlackBot = require('slackbots');
const token = process.env.SLACK_BOT;
const request = require('superagent');
// const app = require('../lib/app');

const bot = new SlackBot({
  token,
  name: 'MeetupBot'
});

bot.on('start', () => {
  const params = {
    icon_emoji: ':handshake:'
  };
  bot.postMessageToChannel(
    'general',
    'Hello, <!channel>! I\'m MeetupBot, your helper for finding PDX tech meetups.',
    params
  );
});

bot.on('message', data => {
  if(data.type !== 'message' || data.subtype === 'bot_message') return;
  const user = data.user;
  const message = data.text;
  const channel = data.channel;
  handleMessage(user, message, channel);
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
        const options = {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true
        };

        const startTime = new Date(event.startTime);
        const endTime = new Date(event.endTime);

        formattedEvents.text += `*${event.slackId}*: \`${event.title}\`
        _${startTime.toLocaleDateString()}: ${startTime.toLocaleString('en-US', options)} - ${endTime.toLocaleString('en-US', options)}_ 
        \n`;

      });
    })
    .then(() => {
      bot.postMessage(
        channel,
        formattedEvents.text
      );
      console.log('sent');
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




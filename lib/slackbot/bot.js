require('dotenv').config();
const SlackBot = require('slackbots');
const token = process.env.SLACK_BOT;

const bot = new SlackBot({
  token,
  name: 'MeetupBot'
});

const sendMessage = (channel, message) => {
  bot.postMessage(
    channel,
    message
  );
};

module.exports = { sendMessage, bot };

require('dotenv').config();
const SlackBot = require('slackbots');
const token = process.env.SLACK_BOT;
const handleMessage = require('./handleMessage');

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

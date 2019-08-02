const { handleMessage } = require('./handleMessage');
const { bot } = require('./bot');

bot.on('message', data => {
  if(data.type !== 'message' || data.subtype === 'bot_message' || !data.text.includes('<@ULJA5GZ26>')) return;
  const user = data.user;
  const message = data.text;
  const channel = data.channel;
  handleMessage(channel, user, message);
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

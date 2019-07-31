require('dotenv').config();
const SlackBot = require('slackbots');
const token = process.env.SLACK_BOT;

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
    'Hello TEstiNG teSTINg',
    params
  );
});

bot.on('message', data => {
  if(!data.content) return;
  const user = data.content.split(': @MeetupBot ')[0];
  const message = data.content.split(': @MeetupBot ')[1];

  handleMessage(user, message);
});

function handleMessage(user, message) {
  if(message.includes(' help')) {
    sendHelp(user);
  } else {
    sendUnrecognized(user);
  }
}

const sendHelp = user => {
  const params = {
    icon_emoji: ':question:'
  };
  bot.postMessageToChannel(
    'general',
    `Hey ${user}! Here are the things you can ask me to do:
      - '@meetupbot weekly' for weekly events.....`,
    params
  );
};

const sendUnrecognized = user => {
  const params = {
    icon_emoji: ':interrobang:'
  };
  bot.postMessageToChannel(
    'general',
    `Uh oh ${user}, I didn't recognize that command. Try using '@meetupbot help'.`,
    params
  );
};




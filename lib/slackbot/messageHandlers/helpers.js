const { sendMessage } = require('../bot');

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

module.exports = { sendHelp, sendUnrecognized };

const token = process.env.SLACK_BOT;

const request = require('superagent');
const SlackBot = require('slackbots');

const bot = new SlackBot({
  token,
  name: 'MeetupBot'
});

function handleMessage(user, message, channel) {
  if(message.includes(' /help')) {
    sendHelp(user, channel);
  } else if(message.includes(' /all')) {
    sendAllEvents(user, channel);
  } else if(message.includes(' /register')) {
    registerEvent(user, message, channel);
  } else if(message.includes(' /daily')) {
    sendDailyEvents(user, channel);
  } else if(message.includes(' /weekly')) {
    sendWeeklyEvents(user, channel);
  } else if(message.includes(' /details')) {
    sendEventDetails(user, message, channel);
  } else if(message.includes(' /attending')) {
    sendAttending(channel);
  } else {
    sendUnrecognized(user, channel);
  }
}

const sendAttending = (channel) => {
  const formattedEvents = {
    text: ''
  };

  return request
    .get('http://localhost:7890/api/v1/events/attending')
    .then(res => {
      const events = res.body;
      events.forEach(event => {
        const usersAttending = [];
        event.usersSignedUp.forEach(attendingUser => {
          usersAttending.push(`<@${attendingUser.name}> `);
        });
        formattedEvents.text += `*${event.slackId}*: ${event.title}
        Users attending: ${usersAttending.toString()}
        \n`;
      });
    })
    .then(() => {
      console.log(formattedEvents.text);
      sendMessage(channel, formattedEvents.text);
    });
};

const sendEventDetails = (user, message, channel) => {
  const slackId = message.split('details ')[1];
  let event;
  const params = {
    icon_emoji: ':question:'
  };
  return request
    .get(`http://localhost:7890/api/v1/events/${slackId}`)
    .then(res => {
      event = res.body[0];
      if(!event) {
        sendMessage(channel, `Sorry <@${user}>, we didn't find an event matching that ID.`);
        return;
      }
      const options = { hour: 'numeric', minute: 'numeric', hour12: true };
      const startDate = new Date(event.startTime).toLocaleDateString();
      const startTime = new Date(event.startTime).toLocaleString('en-US', options);
      const endTime = new Date(event.endTime).toLocaleString('en-US', options);
      const formattedEvent = {
        text: `*${event.slackId}*: \`${event.title}\`
        _${startDate}: ${startTime} - ${endTime}_
        \n
        ${event.description}
        \n
        Click here to sign up: ${event.signUpUrl}
      `
      };
      sendMessage(channel, formattedEvent.text, params);
    });
};

const registerEvent = (user, message, channel) => {
  const slackId = message.split('register ')[1];
  let event;
  return request
    .get(`http://localhost:7890/api/v1/events/${slackId}`)
    .then(res => {
      event = res.body[0];
      if(!event) {
        sendMessage(channel, `Sorry <@${user}>, we didn't find an event matching that ID.`);
        return;
      }
      return request
        .get(`http://localhost:7890/api/v1/users/${user}`)
        .then(res => {
          const receivedUser = res.body[0];
          if(!receivedUser) {
            return request
              .post('http://localhost:7890/api/v1/users')
              .send({ name: user, eventId: event.eventId })
              .then(() => { 
                return;
              });
          }
          return request
            .patch(`http://localhost:7890/api/v1/users/${user}`)
            .send({ eventId: event.eventId })
            // eslint-disable-next-line no-console
            .then(console.log);
        });
    });
};

const sendMessage = (channel, message) => {
  bot.postMessage(
    channel,
    message
  );
};

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
      - \`@Meetup Bot /all\` to see all upcoming events.
      - \`@Meetup Bot /weekly\` to see weekly events.
      - \`@Meetup Bot /daily\` to see today's events.
      - \`@Meetup Bot /details <id>\` to see an events details.
      - \`@Meetup Bot /register <id>\` to add an event to your events.

      `,
    params
  );
};

const sendUnrecognized = (user, channel) => {
  const params = {
    icon_emoji: ':interrobang:'
  };
  bot.postMessage(
    channel,
    `Uh oh <@${user}>, I didn't recognize that command. Try using \`@Meetup Bot /help\`.`,
    params
  );
};

const sendDailyEvents = (user, channel) => {
  const formattedEvents = {
    text: ''
  };
  
  return request
    .get('http://localhost:7890/api/v1/events/daily')
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
          '*Quick Tip*: Register for an event above by using `@Meetup Bot /register <id>`'
        );
      }, 1000);
    });
};

const sendWeeklyEvents = (user, channel) => {
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
      bot.postMessage(
        channel,
        formattedEvents.text
      );
    })
    .then(() => {
      setTimeout(() => {
        bot.postMessage(
          channel,
          '*Quick Tip*: Register for an event above by using `@Meetup Bot /register <id>`'
        );
      }, 1000);
    });
};

module.exports = handleMessage;

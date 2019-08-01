const token = process.env.SLACK_BOT;

const request = require('superagent');
const SlackBot = require('slackbots');

const bot = new SlackBot({
  token,
  name: 'MeetupBot'
});

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
      sendMessage(channel, formattedEvents.text);
    });
};

const sendEventDetails = (channel, user, message) => {
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
        ${event.description}
        \n
        Click here to sign up: ${event.signUpUrl}
      `
      };
      sendMessage(channel, formattedEvent.text, params);
    });
};

const registerEvent = (channel, user, message) => {
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
                sendMessage(channel, `You have added \`${event.title}\` to your MeetupBot queue. \n
                To officially register please visit: ${event.signUpUrl} or http://calagator.org/events/${event.eventId}.
                `);
                return;
              });
          }
          return request
            .patch(`http://localhost:7890/api/v1/users/events/add/${user}`)
            .send({ eventId: event.eventId })
            .then(() => {
              sendMessage(channel, `You have added \`${event.title}\` to your MeetupBot queue.
              \n To officially register please visit: ${event.signUpUrl} or http://calagator.org/events/${event.eventId}.
              `);
            });
        });
    });
};
          
const unregisterEvent = (channel, user, message) => {
  const slackId = message.split('unregister ')[1];
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
            sendMessage(channel, `Sorry <@${user}>, you are not a registered user.\n You can register for an event with \`@Meetup Bot /register <id>\`.`);
            return;
          }
          return request
            .patch(`http://localhost:7890/api/v1/users/events/remove/${user}`)
            .send({ eventId: event.eventId })
            .then(() => {
              sendMessage(channel, `You have removed \`${event.title}\` from your MeetupBot queue.`);
            });
        });
    });
};

const sendMessage = (channel, message) => {
  bot.postMessage(
    channel,
    message
  );
};

const sendAllEvents = (channel) => {
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

const sendHelp = (channel, user) => {
  const params = {
    icon_emoji: ':question:'
  };
  bot.postMessage(
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
  bot.postMessage(
    channel,
    `Uh oh <@${user}>, I didn't recognize that command. Try using \`@Meetup Bot /help\`.`,
    params
  );
};

const sendDailyEvents = (channel) => {
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

module.exports = handleMessage;

const request = require('superagent');
const cheerio = require('cheerio');

function eventScraper() {
  const eventsArr = [];
  return request
    .get('http://www.calagator.org/events')
    .then(res => {
      const $ = cheerio.load(res.text);

      $('.event_summary').each((i, event) => {
        if(i > 0) {
          const startTime = $(event)
            .find('.dt-start')
            .prop('title');

          const endTime = $(event)
            .find('.dt-end')
            .prop('title');

          const title = $(event)
            .find('.p-name')
            .text();

          const description = $(event)
            .find('.e-description')
            .text()
            .trim()
            .replace(/\n+/g, ' ')
            .concat();

          const signUpUrl = $(event)
            .find('.url')
            .prop('href');

          const eventId = $(event)
            .find('.p-name')
            .prop('id')
            .split('-')[1];

          const eventObj = {
            eventId,
            title,
            description: description || 'No description for this event.',
            startTime,
            endTime,
            signUpUrl: signUpUrl || 'No URL for this event.'
          };

          eventsArr.push(eventObj);
        }
      });
      return eventsArr;
    });
}

module.exports = eventScraper;

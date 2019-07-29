const request = require('request');
const cheerio = require('cheerio');

request('http://calagator.org/events/', (err, res, html) => {
  if(!err && res.statusCode === 200) {
    const $ = cheerio.load(html);
    const eventsArr = [];

    $('.event_summary').each((i, event) => {
      const startTime = $(event).find('.dt-start').text();
      const endTime = $(event).find('.dt-end').text();
      const title = $(event).find('.p-name').text();
      const description = $(event).find('.e-description').text();
      const signUpUrl = $(event).find('.url').prop('href');
      const eventId = $(event).find('.p-name').text();
    
      const eventObj = {
        eventId,
        title,
        description: description || 'No description for this event.',
        startTime,
        endTime,
        signUpUrl: signUpUrl || 'No URL for this event.'
      };

      eventsArr.push(eventObj);
    });
    console.log(eventsArr);
  }
});

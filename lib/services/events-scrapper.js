const request = require('superagent');
const { parse } = require('node-html-parser');

// http://calagator.org/events

const getMeetups = () => {
  return request
    .get('http://calagator.org/events')
    .then(res => res.text)
    .then(parse)
    .then(getDetails);
};

const getDetails = html => {
  const startTimes = html.querySelectorAll('.dt-start')
    .map(st => st.rawAttrs.split('datetime=')[1]);

  const endTimes = html.querySelectorAll('.dt-end')
    .map(et => et.rawAttrs.split('datetime=')[1]);

  const titles = html.querySelectorAll('.p-name')
    .map(t => t.childNodes[0].rawText);
    
  const descriptions = html.querySelectorAll('.e-description')
    .map(d => d.childNodes[1].rawText);

  const signUpUrls = html.querySelectorAll('.url')
    .map(url => url.rawAttrs.split('href=')[1]);

  const eventIds = html.querySelectorAll('.p-name')
    .map(url => url.id.split('-')[1]);

  console.log(startTimes.length, 'st');
  console.log(endTimes.length, 'et');
  console.log(titles.length, 'titles');
  console.log(descriptions.length, 'desc');
  console.log(signUpUrls.length, 'urls');
  console.log(eventIds.length, 'urls');
};

getMeetups();

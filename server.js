require('dotenv').config();
require('./lib/utils/connect')();
// require('./lib/slackbot/bot');
require('./lib/slackbot/botActions');
const cron = require('node-cron');
const seedData = require('./seed');

const app = require('./lib/app');

const PORT = process.env.PORT || 7890;

cron.schedule('0 */12 * * *', function(){
  console.log('Server just scraped calagator.');
  seedData();
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Started on ${PORT}`);
});

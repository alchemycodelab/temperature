require('dotenv').config();
require('./lib/utils/connect')();
const Client = require('./lib/models/Client');
const LocationClient = require('./lib/models/LocationClient');

setInterval(() => {
  Client.statusUpdate();
}, 30000);

setInterval(() => {
  LocationClient.updateTemp();
}, 60000);

const app = require('./lib/app');

const PORT = process.env.PORT || 7890;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Started on ${PORT}`);
});

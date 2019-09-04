const mongoose = require('mongoose');
const request = require('superagent');
const chance = require('chance').Chance;

const clientLocationSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  clientId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  }
});

clientLocationSchema.statics.locations = function() {
  return [
    'Mars',
    'Moon',
    'Portland',
    'Saturn',
    'Jupiter',
    'C-137',
    'Mercury',
    'Venus',
    'Neptune',
    'Halley\'s comet',
    'Ceres',
    'Nibiru'
  ];
};

clientLocationSchema.statics.updateTemp = async function() {
  const temps = this.locations().reduce((acc, name) => {
    acc[name] = chance().floating({ min: -100, max: 500, fixed: 2 });
    return acc;
  }, {});

  const locationClients = await this.find();

  await Promise.all(locationClients.map(locationClient => {
    return request
      .post(`${locationClient.url}/temp/${locationClient.clientId}`)
      .send({ temperature: temps[locationClient.name] })
      .catch(console.log);
  }));
};

module.exports = mongoose.model('LocationClient', clientLocationSchema);

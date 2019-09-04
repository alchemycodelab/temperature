const mongoose = require('mongoose');
const request = require('superagent');

const clientSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      delete ret.__v;
      return ret;
    }
  }
});

clientSchema.statics.removeByUrl = function(url) {
  return this.findOneAndDelete({ url })
    .then(() => this.model('LocationClient').deleteMany({ url }));
};

clientSchema.statics.statusUpdate = async function() {
  const clients = await this.find();
  const ress = await Promise.all(clients.map(({ url }) => {
    return request(`${url}/status`)
      .catch(() => this.removeByUrl(url));
  }));

  return Promise.all(ress
    .map(({ status }, i) => ({ url: clients[i].url, status }))
    .filter(({ status }) => status !== 204)
    .map(({ url }) => this.removeByUrl(url)));
};

module.exports = mongoose.model('Client', clientSchema);

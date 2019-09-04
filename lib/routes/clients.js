const { Router } = require('express');
const request = require('superagent');
const Client = require('../models/Client');
const LocationClient = require('../models/LocationClient');

module.exports = Router()
  .post('/', async(req, res, next) => {
    const { url } = req.body;

    try {
      const client = await Client.create({ url });
      res.send(client);
    } catch(e) {
      next(e);
    }

    try {
      const { status } = await request(`${url}/status`);
      if(status !== 204) {
        return await Client.findOneAndDelete({ url });
      }

      const ress = await Promise.all(LocationClient.locations().map(name => {
        return request
          .post(`${url}/register`)
          .send({ name });
      }));

      const correct = ress
        .every(res => res.status === 200 && res.body.id);
      if(!correct) throw 'Wrong status';

      await LocationClient.create(LocationClient.locations().map((name, i) => ({
        url,
        name,
        clientId: ress[i].body.id
      })));

    } catch(e) {
      await Client.findOneAndDelete({ url });
    }
  });

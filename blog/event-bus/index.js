const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const morgan = require('morgan');

const app = express();

const events = [];

app.use(bodyParser.json());
app.use(morgan());
app.post('/events', (req, res) => {
  const event = req.body;

  events.push(event);

  ['posts-clusterip-srv:4000', 'comments-clusterip-srv:4001', 'query-clusterip-srv:4002', 'moderation-clusterip-srv:4003'].forEach(async hostname => {
    await axios.post(`http://${hostname}/events`, event);
  });
  res.send({ status: 'OK' });
});

app.get('/events', (req, res) => {
  res.send(events);
})

app.listen(4005, () => {
  console.log('Listening to 4005');
});
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const morgan = require('morgan');

const axios = require('axios');

const app = express();

const posts = {};

app.use(cors());
app.use(bodyParser.json());
app.use(morgan());

app.get('/', (req, res) => {
  res.send(posts);
});

app.post('/', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const post = { ...req.body, id }
  posts[id] = post;

  await axios.post('http://event-bus-srv:4005/events', {
    type: 'PostCreated',
    data: post,
  });

  res.status(201).send(post);
});

app.post('/events', (req, res) => {
  console.log(`Received event ${req.body.type}`);

  res.send({});
});

app.listen(4000);
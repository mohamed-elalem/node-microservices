const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const morgan = require('morgan');

const app = express();

app.use(bodyParser.json());
app.use(morgan());

app.post('/events', async (req, res) => {
  const { type, data } = req.body;
  console.log(`Received ${type} event...`);
  switch (type) {
    case 'CommentCreated': {
      const status = data.content.includes('orange') ? 'rejected' : 'approved';

      await axios.post('http://event-bus-srv:4005/events', {
        type: 'CommentModerated',
        data: {
          ...data,
          status
        }
      });
    }
  }

  res.sendStatus(200);
});

app.listen(4003, () => {
  console.log('Listening on 4003...');
})
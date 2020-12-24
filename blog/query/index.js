const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const morgan = require('morgan');

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(morgan());

const posts = {};

app.get('/posts', (req, res) => {
  res.send(posts);
});


app.post('/events', (req, res) => {
  const { type, data } = req.body;
  console.log(`Received event ${type}`);
  handleEvent(type, data);
  res.send({});
});

const handleEvent = (type, data) => {
  switch (type) {
    case 'PostCreated': {
      const { id, title } = data; 
      posts[id] = {
        id, title,
        comments: []
      };
      break;
    }
    case 'CommentCreated': {
      const { postId, id, content, status } = data;
      posts[postId].comments.push({
        id, content, status
      });
      break;
    }
    case 'CommentUpdated': {
      const { postId, id, content, status } = data;
      console.log(data, posts);
      const comment = posts[postId].comments.find(comment => comment.id === id);
      comment.content = content;
      comment.status = status;
    }
  }
};

app.listen(4002, async () => {
  console.log('Listening to 4002');

  const { data } = await axios.get('http://event-bus-srv:4005/events');

  data.forEach(event => {
    console.log(`Processing event ${event.type}`);
    handleEvent(event.type, event.data);
  });

});
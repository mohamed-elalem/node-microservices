const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { randomBytes } = require('crypto');
const axios = require('axios');
const morgan = require('morgan');

const app = express();

const commentsByPostId = {};

app.use(morgan());
app.use(cors());
app.use(bodyParser.json());

app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});


app.post('/posts/:id/comments', async (req, res) => {
  const commentId = randomBytes(4).toString('hex');
  const { content } = req.body;
  const id = req.params.id;
  const status = 'pending';
  if (!(id in commentsByPostId)) {
    commentsByPostId[id] = [];
  }

  commentsByPostId[id].push({
    id: commentId,
    content,
    status
  });

  await axios.post('http://event-bus-srv:4005/events', {
    type: 'CommentCreated',
    data: {
      id: commentId,
      content,
      postId: id,
      status
    }
  });

  res.status(201).send(commentsByPostId[id]);
});

app.post('/events', async (req, res) => {
  const { type, data } = req.body;
  console.log(`Received event ${type}`);

  switch (type) {
    case 'CommentModerated': {
      const { postId, id, status } = data;
      const comments = commentsByPostId[postId];
      const comment = comments.find(comment => {
        return comment.id === id;
      });

      comment.status = status;

      await axios.post('http://event-bus-srv:4005/events', {
        type: 'CommentUpdated',
        data: {
          ...comment,
          postId
        }
      })
    }
  }

  res.send({});
});

app.listen(4001, () => {
  console.log('Listening on port 4001...');
});
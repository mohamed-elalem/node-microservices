import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

import CommentCreate from './CommentCreate';
import CommentList from './CommentList';

export default function() {
  const [posts, setPosts] = useState({});

  const fetchPosts = useCallback(async () => {
    const res = await axios.get('http://api.query.com/posts');
    console.log(res.data);
    setPosts(res.data)
  }, []);

  const renderedPosts = Object.values(posts).map(post => {
    return (
      <div key={post.id} className="card" style={{width: '30%', marginBottom: '20px'}}>
        <div className="card-body">
          <h3>
            {post.title}
          </h3>
          <CommentCreate postId={post.id} />
          <CommentList comments={post.comments} />
        </div>
      </div>
    );
  });

  useEffect(async () => {
    await fetchPosts();
  }, []);
  return (
    <div className="d-flex flex-row flex-wrap justify-content-between">
      {renderedPosts}
    </div>
  );
};
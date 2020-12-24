import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export default function ({ comments }) {

  // const fetchComments = useCallback(async () => {
  //   const res = await axios.get(`http://localhost:4001/posts/${postId}/comments`);
  //   setComments(res.data);
  // }, []);

  // useEffect(() => {
  //   fetchComments();
  // }, []);


  const renderedComments = comments.map(comment => {
    let content;

    if (comment.status === 'approved') {
      content = comment.content;
    } else if (comment.status === 'pending') {
      content = 'Pending approval';
    } else if (comment.status === 'rejected') {
      content = 'Rejected!';
    }

    return (
      <li key={comment.id}>
        {content}
      </li>
    )
  });

  return (
    <div>
      <ul>
        {renderedComments}
      </ul>
    </div>
  );
}
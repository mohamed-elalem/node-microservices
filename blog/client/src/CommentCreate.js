import React, { useState } from 'react';
import axios from 'axios';

export default function({ postId }) {
  const [content, setContent] = useState('');

  const onSubmit = async e => {
    e.preventDefault();

    await axios.post(`http://api.comments.com/posts/${postId}/comments`, {
      content
    });

    setContent('');
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>New comment</label>
          <input className="form-control" name="content" value={content} onChange={e => setContent(e.target.value)} />
        </div>
        <button className="btn btn-primary" type="submit">Submit</button>
      </form>
    </div>
  );
}

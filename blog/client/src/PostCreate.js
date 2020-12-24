import React, { useState } from 'react';
import axios from 'axios';

export default () => {
  const [title, setTitle] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();

    const res = await axios.post('http://api.posts.com/posts', {
      title: title
    });

    setTitle('');
  };

  const onChange = e => {
    console.log(e.event.target);
    setTitle(e.event.target);
    console.log(title);
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input className="form-control" name="title" value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <button className="btn btn-primary" type="submit">Submitt</button>
      </form>
    </div>
  );
};
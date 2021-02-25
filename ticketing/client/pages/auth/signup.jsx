import React, { useState } from 'react';
import Router from 'next/router';

import useRequest from '../..//hooks/use-request';

export default () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { errors, doRequest } = useRequest({ url: '/api/users/signup', method: 'post', 'body': { email, password }, onSuccess: () => Router.push('/')});
  
  const onSubmit = async e => {
    e.preventDefault();

    await doRequest();
  
    Router.push('/');    
  }

  return (
    <form onSubmit={onSubmit}>
      <h1>Sign up</h1>
      <div className="form-group">
        <label>Email Address</label>
        <input className="form-control" onChange={e => setEmail(e.target.value)} value={email} />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input type="password" className="form-control" onChange={e => setPassword(e.target.value)} value={password} />
      </div>
      {errors}
      <button type="submit" className="btn btn-primary">Sign up</button>
    </form>
  );
};
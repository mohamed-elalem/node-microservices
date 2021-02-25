import React from 'react';
import buildClient from '../api/build-client';
const LandingPage = ({ currentUser }) => {
  return (
    <h1>
      {currentUser ? 'You are signed in' : 'You are not signed in'}
    </h1>
  );
};

// LandingPage.getInitialProps = async (context) => {
//   // let url = '/api/users/currentuser';
//   // let headers = {};
//   // if (typeof window === 'undefined') {
//   //   url = 'http://ingress-nginx-controller.kube-system.svc.cluster.local/api/users/currentuser';
//   //   // headers['Host'] = 'ticketing.dev';
//   //   // headers['Cookie'] = req.headers['Cookie'];
//   //   headers = req.headers;
//   // }

//   const { data } = await buildClient(context).get('/api/users/currentuser');
//   return data;

// };

export default LandingPage;
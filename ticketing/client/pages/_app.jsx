import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <React.Fragment>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component { ...pageProps} currentUser={currentUser} />
      </div>
    </React.Fragment>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const client = await buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, data.currentUser);
  }
  return {
    pageProps,
    ...data
  };
};

export default AppComponent;

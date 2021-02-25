import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <React.Fragment>
      <Header currentUser={currentUser} />
      <Component { ...pageProps} currentUser={currentUser} />
    </React.Fragment>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const { data } = await buildClient(appContext.ctx).get('/api/users/currentuser');
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }
  return {
    pageProps,
    ...data
  };
};

export default AppComponent;

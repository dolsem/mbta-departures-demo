import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

import ErrorBoundary from './ErrorBoundary';
import App from './App';

export default () => (
  <ErrorBoundary>
    <Router>
      <Route path="/" exact component={() => <Redirect to="/place-north?api_key=null"/>} />
      <Route path="/:stopId" component={App} />
    </Router>
  </ErrorBoundary>
);

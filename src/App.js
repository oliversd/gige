import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import withAsyncWeb3 from './HOC/withAsyncWeb3';

import TopBar from './components/TopBar';

import Home from './screens/Home';
import CreateService from './screens/CreateService';
import NotFound from './screens/NotFound';

const App = () => (
  <Router>
    <div className="app">
      <TopBar />
      <div className="container">
        <Switch>
          {/* keep the /:lang? optional argument for internationalization in all routes */}
          <Route exact path="/" component={withAsyncWeb3(Home)} />
          <Route exact path="/:lang?" component={Home} />
          <Route exact path="/service/create" component={withAsyncWeb3(CreateService)} />
          <Route exact path="/:lang?/service/create" component={CreateService} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  </Router>
);

export default App;

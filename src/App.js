import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import withAsyncWeb3 from './HOC/withAsyncWeb3';

import TopBar from './components/TopBar';
import StatusBar from './components/StatusBar';

import Home from './screens/Home';
import CreateService from './screens/CreateService';
import SingleService from './screens/SingleService';
import Quote from './screens/Quote';
import Orders from './screens/Orders';
import NotFound from './screens/NotFound';

const App = () => (
  <Router>
    <div className="app">
      <TopBar />
      <div className="container">
        <StatusBar />
        <Switch>
          {/* keep the /:lang? optional argument for internationalization in all routes */}
          <Route exact path="/" component={withAsyncWeb3(Home)} />
          <Route exact path="/orders/" component={withAsyncWeb3(Orders)} />
          <Route
            exact
            path="/service/create"
            component={withAsyncWeb3(CreateService)}
          />
          <Route
            exact
            path="/service/:id"
            component={withAsyncWeb3(SingleService)}
          />
          <Route
            exact
            path="/quote/create/:serviceId"
            component={withAsyncWeb3(Quote)}
          />
          <Route exact path="/:lang?" component={Home} />
          <Route
            exact
            path="/:lang?/service/create"
            component={CreateService}
          />
          <Route exact path="/:lang?/service/:id" component={SingleService} />
          <Route exact path="/:lang?/quote/create" component={Quote} />
          <Route
            exact
            path="/:lang?/orders/"
            component={withAsyncWeb3(Orders)}
          />
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  </Router>
);

export default App;

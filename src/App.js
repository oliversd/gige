import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Home from "./screens/Home";
import LanguageSwitcher from "./components/LanguageSwitcher";
import NotFound from "./screens/NotFound";

const App = () => (
  <Router>
    <div className="app">
      <div className="container">
        <Switch>
          {/* keep the /:lang? optional argument for internationalization in all routes */}
          <Route exact path="/" component={Home} />
          <Route exact path="/:lang?" component={Home} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  </Router>
);

export default App;

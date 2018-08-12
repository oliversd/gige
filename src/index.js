import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

import { lang } from "./services/i18n/lang";
import configureStore from "./store/configureStore";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import theme1 from "./themes/theme1/";

lang
  .init({
    debug: true
  })
  .then(() => {
    const store = configureStore();

    const theme = createMuiTheme(theme1);

    ReactDOM.render(
      <Provider store={store}>
        <MuiThemeProvider theme={theme}>
          <App />
        </MuiThemeProvider>
      </Provider>,
      document.getElementById("root")
    );
    registerServiceWorker();
  })
  .catch(e => console.log(e));

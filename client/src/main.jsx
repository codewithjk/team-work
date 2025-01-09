import React from "react";
import ReactDOM from "react-dom/client";
// import store from "./application/store";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";

import { persistor, store } from './application/store';
import { PersistGate } from 'redux-persist/integration/react';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
          <Router>
            <App />
          </Router>
    </PersistGate>
    </Provider>
  </React.StrictMode>
);

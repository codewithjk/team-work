import React from "react";
import ReactDOM from "react-dom/client";
import store from "./application/store";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
    <Router>
        <App />
    </Router>
    </Provider>
  </React.StrictMode>
);

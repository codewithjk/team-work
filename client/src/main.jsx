import React from "react";
import ReactDOM from "react-dom/client";
import store from "./application/store";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

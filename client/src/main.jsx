import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./presentation/pages/auth/LoginPage";
import SignupPage from "./presentation/pages/auth/SignupPage";
import store from "./application/store";
import { Provider } from "react-redux";
import HomePage from "./presentation/pages/HomePage";
import "./index.css";
import PrivateRoute from "@/components/PrivateRoute";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route element={<PrivateRoute />}>
            <Route path="/home" element={<HomePage />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  </React.StrictMode>
);

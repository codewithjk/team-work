import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const RedirectAuthenticatedUser = ({ children }) => {
  const auth = useSelector((state) => state.auth);
  const { isAuthenticated, user } = auth;

  if (isAuthenticated && user.isVerified) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default RedirectAuthenticatedUser;

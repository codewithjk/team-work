import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

function PrivateRoute() {
  const auth = useSelector((state) => state.auth);
  const { user } = auth;
  return user ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute;

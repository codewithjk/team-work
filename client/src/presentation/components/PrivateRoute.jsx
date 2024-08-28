import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { checkAuth } from "../../application/actions/authActions";

function PrivateRoute() {
  const auth = useSelector((state) => state.auth);
  const token = Cookies.get("token");
  const dispatch = useDispatch();
  dispatch(checkAuth());

  console.log(token);
  const { isAuthenticated } = auth;
  console.log(isAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute;

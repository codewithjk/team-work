import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { getProfile } from "../../application/actions/profileActions";
import { Skeleton } from "@/components/ui/skeleton";
import PrivatePageLayout from "@/layouts/PrivatePageLayout";
import { checkAuth } from "../../application/actions/authActions";

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const { isAuthenticated, user, loading } = auth;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // console.log("App refreshed");
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    if (user && !loading) {
      dispatch(getProfile(user.id)).finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [user, loading, dispatch]);

  console.log(user)
  if (loading || isLoading) {
    return <Skeleton className="w-full h-full">{children}</Skeleton>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (user && !user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return <PrivatePageLayout>{children}</PrivatePageLayout>;
};

export default ProtectedRoute;

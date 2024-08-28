import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { getProfile } from "../../application/actions/profileActions";
import { Skeleton } from "@/components/ui/skeleton";

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const { isAuthenticated, user, loading } = auth;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user && !loading) {
      dispatch(getProfile(user.id)).finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [user, loading, dispatch]);

  if (loading || isLoading) {
    // return <h1>loading </h1>;
    return <Skeleton className="w-full h-full">{children}</Skeleton>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user && !user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
};

export default ProtectedRoute;

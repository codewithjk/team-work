import ProtectedRoute from "@/components/ProtectedRoute";
import RedirectAuthenticatedUser from "@/components/RedirectAuthenticatedUser";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import HandleGithubOauthPage from "@/pages/auth/HandleGithubOauthPage";
import HandleGoogleOauthPage from "@/pages/auth/HandleGoogleOauthPage";
import LoginPage from "@/pages/auth/LoginPage";
import ResetPassword from "@/pages/auth/ResetPassword";
import SignupPage from "@/pages/auth/SignupPage";
import VerifyEmail from "@/pages/auth/VerifyEmail";
import HomePage from "@/pages/HomePage";
import React from "react";
import { useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { checkAuth } from "./application/actions/authActions";
import { useEffect } from "react";
import ProfileSettingsPage from "@/pages/ProfileSettingsPage";
import { useSelector } from "react-redux";

function App() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const { user } = auth;
  useEffect(() => {
    console.log("App refershed");
    console.log("dispatch callled");
    dispatch(checkAuth());
  }, []);

  return (
    <div>
      <Router>
        <Routes>
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <RedirectAuthenticatedUser>
                <SignupPage />
              </RedirectAuthenticatedUser>
            }
          />
          <Route
            path="/login"
            element={
              <RedirectAuthenticatedUser>
                <LoginPage />
              </RedirectAuthenticatedUser>
            }
          />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route
            path="/forgot-password"
            element={
              <RedirectAuthenticatedUser>
                <ForgotPassword />
              </RedirectAuthenticatedUser>
            }
          />

          <Route
            path="/reset-password/:token"
            element={
              <RedirectAuthenticatedUser>
                <ResetPassword />
              </RedirectAuthenticatedUser>
            }
          />
          <Route
            path="/handle-google-auth/:token"
            element={<HandleGoogleOauthPage />}
          />
          <Route
            path="/handle-github-auth/:token"
            element={<HandleGithubOauthPage />}
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfileSettingsPage />
              </ProtectedRoute>
            }
          />
          {/* catch all routes */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

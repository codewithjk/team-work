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
import { ThemeProvider } from "@/components/ui/theme-provider";
import ProjectPage from "@/pages/ProjectPage";
import ProjectSettingsPage from "@/pages/ProjectSettingsPage";
import VerifyInvitationPage from "@/pages/VerifyInvitePage";
import ModulePage from "@/pages/ModulePage";
import TaskPage from "@/pages/TaskPage";
import ChatPage from "@/pages/chat/ChatPage";
import {
  socketConnected,
  socketDisconnected,
} from "./application/slice/socketSlice";

import { initSocket } from "@/utils/socketClient.config";
import MeetingPage from "@/pages/meeting/MeetingPage";

function App() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const { user } = auth;
  const socketURL = import.meta.env.VITE_SOCKET_BASE_URL;
  useEffect(() => {
    console.log("App refershed");
    dispatch(checkAuth());
  }, []);

  useEffect(() => {
    const socket = initSocket(socketURL || "http://localhost:3000");

    socket.on("connect", () => {
      console.log("socket connected ");

      dispatch(socketConnected());
    });

    socket.on("disconnect", () => {
      dispatch(socketDisconnected());
    });

    // Clean up when component unmounts
    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

  return (
    <div className=" bg-white">
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
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
            <Route
              path="/projects"
              element={
                <ProtectedRoute>
                  <ProjectPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/:projectId/settings"
              element={
                <ProtectedRoute>
                  <ProjectSettingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/verify-invite/:token"
              element={
                <ProtectedRoute>
                  <VerifyInvitationPage />
                </ProtectedRoute>
              }
            />

            {/* module routes */}
            <Route
              path="/projects/:projectId/modules"
              element={
                <ProtectedRoute>
                  <ModulePage />
                </ProtectedRoute>
              }
            />

            {/* task routes */}
            <Route
              path="/projects/:projectId/tasks"
              element={
                <ProtectedRoute>
                  <TaskPage />
                </ProtectedRoute>
              }
            />

            {/* chat routes */}
            <Route
              path="/chats"
              element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chats/:projectId"
              element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              }
            />

            {/* meeting routes */}
            <Route
              path="/meetings"
              element={
                <ProtectedRoute>
                  <MeetingPage />
                </ProtectedRoute>
              }
            />
            {/* catch all routes */}
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </div>
  );
}

export default App;

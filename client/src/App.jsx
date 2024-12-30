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

import { getSocket, initSocket } from "@/utils/socketClient.config";
import MeetingPage from "@/pages/meeting/MeetingPage";
import NotificationPage from "@/pages/notification/NotificationPage";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { setNotification } from "./application/slice/notificationSlice";
import LandingPage from "@/pages/LandingPage";
import { useState } from "react";
import NotFoundPage from "@/pages/error/Error404";
import ErrorPage from "@/pages/error/ErrorPage";
import { useNavigate } from "react-router-dom";

function App() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const { user } = auth;
  const [socket, setSocket] = useState(null);
  const socketURL =
    import.meta.env.VITE_SOCKET_BASE_URL || "http://localhost:3000";
  const navigate = useNavigate()
  const accessToken = localStorage.getItem("accessToken");
  useEffect(() => {
    console.log("App refreshed");
    dispatch(checkAuth());
  }, [dispatch]);


  const handleNotification = (notification) => {
    toast.info(notification.title);
    dispatch(setNotification(notification));
  };

  useEffect(() => {
    if (user?.id && !socket) {
      const newSocket = initSocket(user.id, socketURL);

      newSocket.on("connect", () => {
        console.log("Socket connected ", newSocket);
        dispatch(socketConnected());
      });

      newSocket.on("disconnect", () => {
        dispatch(socketDisconnected());
      });

      newSocket.on("receiveNotification", (data) => {
        handleNotification(data);
      });

      setSocket(newSocket);
    }

    // Clean up when component unmounts or user changes
    return () => {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    };
  }, [user, dispatch, socketURL]);
  return (
    <div className=" bg-white">
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Toaster richColors position="top-right" />
     
          <Routes>
            <Route
              path="/"
              element={
                <RedirectAuthenticatedUser>
                  <LandingPage />
                </RedirectAuthenticatedUser>
              }
            />

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
            {/* notification routes */}
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <NotificationPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/error/403"
              element={
           
                  <ErrorPage status={403} title="Forbiden" message="We are sorry. You do not have access to this page"/>
               
              }
            />
            {/* catch all routes */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
     
      </ThemeProvider>
    </div>
  );
}

export default App;

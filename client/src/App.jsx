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
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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

import {  initSocket } from "@/utils/socketClient.config";
import MeetingPage from "@/pages/meeting/MeetingPage";
import NotificationPage from "@/pages/notification/NotificationPage";
import { toast } from "sonner";
import { Toaster } from "sonner";
import LandingPage from "@/pages/LandingPage";
import NotFoundPage from "@/pages/error/Error404";
import ErrorPage from "@/pages/error/ErrorPage";
import { setNotification } from "./application/slice/notificationSlice";
import { setMessages } from "./application/slice/chatSlice";

function App() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const { user } = auth;

  console.log("this is from app ",user)
  const socketURL =
  import.meta.env.VITE_SOCKET_BASE_URL || "http://localhost:3000";


  const handleNotification = (notification) => {
    toast.info(notification.title);
    dispatch(setNotification(notification));
  };
    useEffect(() => {
      if (user) {
        const newSocket = initSocket(user.id, socketURL);
  
        newSocket.on("receiveNotification", (data) => {
          handleNotification(data);
        });
        newSocket.on("receiveMessage", (data) => {
          console.log("message recieved == ", data)
          dispatch(setMessages(data))
        })
        // Clean up when component unmounts or user changes
        return () => {
          if (newSocket) {
            newSocket.disconnect();
          }
        }
      }
    }, []);



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
                  <VerifyInvitationPage />
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

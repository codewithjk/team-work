import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // React Router Hooks
import { ChatLayout } from "./chat-layout";

function ChatPage() {
  const navigate = useNavigate();
  const { projectId } = useParams(); // Get projectId from the route parameters

  return <ChatLayout navCollapsedSize={8} />;
}

export default ChatPage;

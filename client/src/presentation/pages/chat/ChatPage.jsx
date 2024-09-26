import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // React Router Hooks
import { ChatLayout } from "./chat-layout";

function ChatPage() {
  const navigate = useNavigate();
  const { projectId } = useParams(); // Get projectId from the route parameters
  // const [selectedGroup, setSelectedGroup] = useState(null);

  // const groups = [
  //   { id: 1, name: "Project A" },
  //   { id: 2, name: "Project B" },
  //   // Add more groups as needed
  // ];

  // useEffect(() => {
  //   if (projectId) {
  //     const group = groups.find((g) => g.id === parseInt(projectId));
  //     setSelectedGroup(group);
  //   }
  // }, [projectId]);

  // const handleGroupClick = (group) => {
  //   setSelectedGroup(group);
  //   navigate(`/chats/${group.id}`); // Change the route when a group is clicked
  // };

  // const handleBackClick = () => {
  //   setSelectedGroup(null);
  //   navigate("/chats"); // Navigate back to the group list
  // };

  return <ChatLayout navCollapsedSize={8} />;
}

export default ChatPage;

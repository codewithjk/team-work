import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom"; // React Router Hooks
import { ChatLayout } from "./chat-layout";
import { setGroups } from "../../../application/slice/chatSlice";
import projectApi from "../../../infrastructure/api/projectApi";
import chatApi from "../../../infrastructure/api/chatApi";
import { useDispatch, useSelector } from "react-redux";

function ChatPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { projectId } = useParams(); // Get projectId from the route parameters

  const groups = useSelector((state) => state.chat.groups); // Access groups from Redux
  const [isDataLoaded, setIsDataLoaded] = useState(false); // State to track if data is loaded

  const fetchGroups = useCallback(async () => {
    try {
      const response = await projectApi.getAllProjects({ allProjects: true });
      const groups = response.data.projects;

      const groupsWithMessages = await Promise.all(
        groups.map(async (group) => {
          const chatResponse = await chatApi.getAllChats(group._id, new Date().toISOString());
          const fetchedMessages = chatResponse.data.messages;
          return { ...group, messages: fetchedMessages };
        })
      );

      const sortedGroups = groupsWithMessages.sort((a, b) => {
        const latestMessageA = a.messages?.at(-1)?.timestamp || 0;
        const latestMessageB = b.messages?.at(-1)?.timestamp || 0;
        return new Date(latestMessageB) - new Date(latestMessageA);
      });

      dispatch(setGroups(sortedGroups));
      setIsDataLoaded(true); // Mark data as loaded
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  // Conditionally render ChatLayout only when data is loaded
  if (!isDataLoaded) {
    return <div>Loading...</div>; // Or a custom loading spinner
  }

  return <ChatLayout navCollapsedSize={8} />;
}

export default ChatPage;

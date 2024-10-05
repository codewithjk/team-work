import React, { useRef, useEffect, useState, useCallback } from "react";
import ChatBottombar from "./chat-bottombar";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChatBubbleAvatar,
  ChatBubbleMessage,
  ChatBubbleTimestamp,
  ChatBubble,
} from "@/components/ui/chat/chat-bubble";

import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { getSocket } from "@/utils/socketClient.config";
import { useSelector, useDispatch } from "react-redux";
import {
  resetMessages,
  setMessages,
  addOldMessages,
} from "../../../application/slice/chatSlice";

import chatApi from "../../../infrastructure/api/chatApi";

const getMessageVariant = (senderId, userId) =>
  senderId === userId ? "sent" : "received";

export function ChatList({ selectedGroup, sendMessage, isMobile }) {
  console.log("chat list rendered");

  const groupId = selectedGroup._id;
  const { profileData } = useSelector((state) => state.profile);
  const userId = profileData?._id;
  const dispatch = useDispatch();
  const { messages } = useSelector((state) => state.chat);

  const messagesContainerRef = useRef(null);
  const [loadingOldMessages, setLoadingOldMessages] = useState(false);
  const [loadingRecentMessages, setLoadingRecentMessages] = useState(true);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);

  const fetchRecentMessages = useCallback(async () => {
    try {
      setLoadingRecentMessages(true);
      const response = await chatApi.getAllChats(
        groupId,
        new Date().toISOString()
      );
      const fetchedMessages = response.data.messages;
      console.log(fetchedMessages);

      if (fetchedMessages.length > 0) {
        dispatch(addOldMessages(fetchedMessages));
      }
    } catch (error) {
      console.error("Error fetching recent messages:", error);
    } finally {
      setLoadingRecentMessages(false);
    }
  }, [groupId, dispatch]);

  const fetchOldMessages = useCallback(async () => {
    if (!hasMoreMessages || loadingOldMessages || messages.length === 0) return;

    const oldestMessage = messages[0];
    setLoadingOldMessages(true);

    try {
      const response = await chatApi.getAllChats(
        groupId,
        oldestMessage.timestamp
      );
      console.log(response);

      const fetchedMessages = response.data.messages;
      if (fetchedMessages.length > 0) {
        dispatch(addOldMessages(fetchedMessages));
      } else {
        setHasMoreMessages(false);
      }
    } catch (error) {
      console.error("Error fetching old messages:", error);
    } finally {
      setLoadingOldMessages(false);
    }
  }, [groupId, hasMoreMessages, loadingOldMessages, messages, dispatch]);

  const handleScroll = () => {
    console.log("scrolling");

    if (
      messagesContainerRef.current &&
      messagesContainerRef.current.scrollTop === 0
    ) {
      fetchOldMessages();
    }
  };

  useEffect(() => {
    const socket = getSocket();
    console.log(socket);

    socket.emit("joinProjectGroup", { groupId, userId });

    const handleReceiveMessage = (message) => {
      dispatch(setMessages(message));
    };

    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("receiveNotification", (data) => {
      // handleNotificaiton(data);
      console.log("++++++++++++notification from chat list++++++++++++", data);
    });

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.emit("leaveProjectGroup", { groupId, userId });
      dispatch(resetMessages());
    };
  }, [selectedGroup, userId, groupId, dispatch]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    fetchRecentMessages();
  }, [fetchRecentMessages]);

  return (
    <div className="w-full overflow-y-auto h-full flex flex-col">
      <ChatMessageList ref={messagesContainerRef} onScroll={handleScroll}>
        <AnimatePresence>
          {messages.map((message, index) => {
            const variant = getMessageVariant(message.senderId, userId);
            return (
              <motion.div
                key={index}
                layout
                initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
                animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
                transition={{
                  opacity: { duration: 0.1 },
                  layout: {
                    type: "spring",
                    bounce: 0.3,
                    duration: index * 0.05 + 0.2,
                  },
                }}
                style={{ originX: 0.5, originY: 0.5 }}
                className="flex flex-col gap-2 p-4"
              >
                <ChatBubble variant={variant}>
                  <ChatBubbleAvatar src={message.avatar} />
                  <ChatBubbleMessage
                    variant={variant}
                    isLoading={message.isLoading}
                  >
                    {profileData._id !== message.senderId && (
                      <p className=" text-sm"> ~ {message.senderName}</p>
                    )}

                    {message.content}
                    {message.timestamp && (
                      <ChatBubbleTimestamp timestamp={message.timestamp} />
                    )}
                  </ChatBubbleMessage>
                </ChatBubble>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </ChatMessageList>

      {/* Loading spinner for recent messages */}
      {loadingRecentMessages && (
        <div className="flex justify-center items-center py-2">
          <span>Loading recent messages...</span>
        </div>
      )}

      {/* Loading spinner for fetching old messages */}
      {loadingOldMessages && (
        <div className="flex justify-center items-center py-2">
          <span>Loading old messages...</span>
        </div>
      )}

      <ChatBottombar isMobile={isMobile} selectedGroup={selectedGroup} />
    </div>
  );
}

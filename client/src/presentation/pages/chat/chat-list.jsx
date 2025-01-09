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
import { useSelector, useDispatch } from "react-redux";

import ImageWithDownload from "@/components/imageWithDownload";
import { getSocket } from "@/utils/socketClient.config";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const getMessageVariant = (senderId, userId) =>
  senderId === userId ? "sent" : "received";

export function ChatList({ selectedGroup, isMobile }) {

  // const groupId = selectedGroup._id;
  const { profileData } = useSelector((state) => state.profile);
  const userId = profileData?._id;
  // const dispatch = useDispatch();
  // const { groups } = useSelector(state => state.chat);
  // const currentGroup = groups.filter((ele) => ele._id == groupId);
  // const messages = currentGroup?.messages || [];
  const selectedGroupFromRedux = useSelector((state) =>
    state.chat.groups.find((group) => group._id === selectedGroup._id)
  );
  const messages = selectedGroupFromRedux?.messages || [];
  
  console.log("chat-list rendered",selectedGroup.messages)

  const messagesContainerRef = useRef(null);
  const [loadingOldMessages, setLoadingOldMessages] = useState(false);
  const [loadingRecentMessages, setLoadingRecentMessages] = useState(true);
  // const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState(new Map());


  useEffect(() => {
    const socket = getSocket();

    socket.emit("getOnlineUsers", { groupId: "123" });
// socket.on("onlineUsers", (users) => {
//   console.log("Online users:", users);
// });


    // Handle existing online users
    socket.on("onlineUsers", (users) => {
      const usersMap = new Map();
      users.forEach((user) => {
        if (user._id !== userId) {
          usersMap.set(user._id, user);
        }
      });
      setOnlineUsers(usersMap);
    });
   
     // Handle new user joining
     socket.on("userJoined", ({groupId,user}) => {
      console.log("user joined ",user.name);
 
      if (selectedGroup._id !== groupId) {
        setOnlineUsers((prev) => {
          const newMap = new Map(prev);
          newMap.set(user._id, user);
          return newMap;
        });
      }
     });
    // Handle user leaving
    socket.on("userLeft", ({ user }) => {
      console.log("user left ",user.name);
      let leftUserId = user._id;
      if (leftUserId !== userId) {
        setOnlineUsers((prev) => {
          const newMap = new Map(prev);
          newMap.delete(leftUserId);
          return newMap;
        });
        console.log(onlineUsers)
      }
    });
    return () => {
      socket.emit("leftGroup", { groupId: selectedGroup._id, user: profileData });
      setOnlineUsers(new Map());
    }
  },[selectedGroup._id, profileData, userId])

  // Fetch messages implementation...
  // const fetchRecentMessages = useCallback(async () => {
  //   try {
  //     setLoadingRecentMessages(true);
  //     const response = await chatApi.getAllChats(
  //       groupId,
  //       new Date().toISOString()
  //     );
  //     const fetchedMessages = response.data.messages;
  //     if (fetchedMessages.length > 0) {
  //       dispatch(addOldMessages(fetchedMessages));
  //     }
  //   } catch (error) {
  //     console.error("Error fetching recent messages:", error);
  //   } finally {
  //     setLoadingRecentMessages(false);
  //   }
  // }, [groupId, dispatch]);

  // const fetchOldMessages = useCallback(async () => {
  //   if (!hasMoreMessages || loadingOldMessages || messages.length === 0) return;

  //   const oldestMessage = messages[0];
  //   setLoadingOldMessages(true);

  //   try {
  //     const response = await chatApi.getAllChats(
  //       groupId,
  //       oldestMessage.timestamp
  //     );
  //     const fetchedMessages = response.data.messages;
  //     if (fetchedMessages.length > 0) {
  //       dispatch(addOldMessages(fetchedMessages));
  //     } else {
  //       setHasMoreMessages(false);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching old messages:", error);
  //   } finally {
  //     setLoadingOldMessages(false);
  //   }
  // }, [groupId, hasMoreMessages, loadingOldMessages, messages, dispatch]);



  // Scroll handling
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // fetchRecentMessages();
  }, []);

  const handleScroll = () => {
    if (
      messagesContainerRef.current &&
      messagesContainerRef.current.scrollTop === 0
    ) {
      // fetchOldMessages();
    }
  };

  const renderOnlineUsers = () => {
    console.log("online users == ",onlineUsers)
    if (onlineUsers.size === 0) return null;
    return (
      <div className="flex items-center gap-2 p-2 bg-secondary/50 mb-2">
        <div className="flex -space-x-2">
          {Array.from(onlineUsers.values()).map((user) => (
            user._id != userId &&(<div key={user._id} className="relative">
              <Avatar className="h-8 w-8 border-2 border-background">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
            </div>)
          ))}
        </div>
        <span className="text-sm text-muted-foreground">
          ({onlineUsers.size -1} online)
        </span>
      </div>
    );
  };

  return (
    <div className="w-full overflow-y-auto h-full flex flex-col">
      {renderOnlineUsers()}

      <ChatMessageList ref={messagesContainerRef} onScroll={handleScroll}>
        <AnimatePresence>
          {messages.map((message, index) => (
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
              <ChatBubble variant={getMessageVariant(message.senderId, userId)}>
                <ChatBubbleAvatar src={message.avatar} />
                <ChatBubbleMessage
                  variant={getMessageVariant(message.senderId, userId)}
                  isLoading={message.isLoading}
                >
                  {profileData._id !== message.senderId && (
                    <p className="text-sm"> ~ {message.senderName}</p>
                  )}

                  {message.attachmentUrl && (
                    <div className="">
                      {message.messageType === "file" ? (
                        <ImageWithDownload message={message} />
                      ) : (
                        <div className="flex items-center justify-between">
                          <p className="text-sm">
                            {message.attachmentUrl.split("/").pop()}
                          </p>
                          <a
                            href={message.attachmentUrl}
                            download
                            className="text-blue-500 hover:underline"
                          >
                            Download
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {message.content}

                  {message.timestamp && (
                    <ChatBubbleTimestamp timestamp={message.timestamp} />
                  )}
                </ChatBubbleMessage>
              </ChatBubble>
            </motion.div>
          ))}
        </AnimatePresence>
      </ChatMessageList>

      {/* {loadingRecentMessages && (
        <div className="flex justify-center items-center py-2">
          <span>Loading recent messages...</span>
        </div>
      )} */}

      {loadingOldMessages && (
        <div className="flex justify-center items-center py-2">
          <span>Loading old messages...</span>
        </div>
      )}

      <ChatBottombar isMobile={isMobile} selectedGroup={selectedGroup} />
    </div>
   
  );
}

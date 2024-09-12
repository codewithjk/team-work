import React, { useEffect, useState } from "react";
// import { Message, UserData } from "@/app/data";
import ChatTopbar from "./chat-topbar";
import { ChatList } from "./chat-list";
// import useChatStore from "@/hooks/useChatStore";

const Chat = ({ messages, selectedUser, isMobile }) => {
  const messagesState = [{}];

  const sendMessage = (newMessage) => {
    useChatStore.setState((state) => ({
      messages: [...state.messages, newMessage],
    }));
  };

  return (
    <div className="flex flex-col justify-between w-full h-full">
      <ChatTopbar selectedUser={selectedUser} />
      <ChatList
        messages={messagesState}
        selectedUser={selectedUser}
        sendMessage={sendMessage}
        isMobile={isMobile}
      />
    </div>
  );
};

export default Chat;

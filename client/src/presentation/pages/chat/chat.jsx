import React, { useEffect, useState } from "react";
// import { Message, GroupData } from "@/app/data";
import ChatTopbar from "./chat-topbar";
import { ChatList } from "./chat-list";
// import useChatStore from "@/hooks/useChatStore";

const Chat = ({ messages, selectedGroup, isMobile }) => {
  // const { selectedGroup } = useSelector((state) => state.chat);
  const sendMessage = (newMessage) => {
    useChatStore.setState((state) => ({
      messages: [...state.messages, newMessage],
    }));
  };

  return (
    <div className="flex flex-col justify-between w-full h-full">
      <ChatTopbar selectedGroup={selectedGroup} />
      <ChatList
        selectedGroup={selectedGroup}
        sendMessage={sendMessage}
        isMobile={isMobile}
      />
    </div>
  );
};

export default Chat;

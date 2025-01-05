import React, { useEffect, useState } from "react";
// import { Message, GroupData } from "@/app/data";
import ChatTopbar from "./chat-topbar";
import { ChatList } from "./chat-list";
// import useChatStore from "@/hooks/useChatStore";

const Chat = ({ selectedGroup, isMobile }) => {
 
 console.log("chat rendered");
 
  return (
    <div className="flex flex-col justify-between w-full h-full">
      <ChatTopbar selectedGroup={selectedGroup} />
      <ChatList
        selectedGroup={selectedGroup}
        isMobile={isMobile}
      />
    </div>
  );
};

export default Chat;

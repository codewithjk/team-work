import {
  FileImage,
  Mic,
  Paperclip,
  PlusCircle,
  SendHorizontal,
  ThumbsUp,
} from "lucide-react";

import React, { useEffect, useRef, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChatInput } from "@/components/ui/chat/chat-input";
// import useChatStore from "@/hooks/useChatStore";
import { EmojiPicker } from "./emoji-picker";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import { getSocket } from "@/utils/socketClient.config";
import { setMessages } from "../../../application/slice/chatSlice";

const BottombarIcons = [{ icon: FileImage }, { icon: Paperclip }];

export default function ChatBottombar({ isMobile, selectedGroup }) {
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const { setHasInitialResponse, hasInitialResponse } = useSelector(
    (state) => state.chat
  );
  const { profileData } = useSelector((state) => state.profile);

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (event) => {
    setMessage(event.target.value);
  };

  const handleThumbsUp = () => {
    const newMessage = {
      senderName: profileData.name,
      senderId: profileData._id,
      name: profileData.name,
      avatar: profileData.avatar,
      content: "👍",
    };
    const socket = getSocket();
    socket.emit("sendMessage", {
      groupId: selectedGroup._id,
      message: newMessage,
    });
    setMessage("");
  };

  const handleSend = () => {
    if (message.trim()) {
      const newMessage = {
        senderName: profileData.name,
        senderId: profileData._id,
        name: profileData.name,
        avatar: profileData.avatar,
        content: message.trim(),
      };
      const socket = getSocket();
      socket.emit("sendMessage", {
        groupId: selectedGroup._id,
        message: newMessage,
      });
      setMessage("");

      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

    if (!hasInitialResponse) {
      console.log(isLoading);
      // setIsLoading(true);
      // setTimeout(() => {
      //   setMessages((messages) => [
      //     ...messages.slice(0, messages.length - 1),
      //     {
      //       id: messages.length + 1,
      //       avatar:
      //         "https://images.freeimages.com/images/large-previews/971/basic-shape-avatar-1632968.jpg?fmt=webp&h=350",
      //       name: "Jane Doe",
      //       message: "Awesome! I am just chilling outside.",
      //       timestamp: formattedTime,
      //     },
      //   ]);
      //   setIsLoading(false);
      //   setHasInitialResponse(true);
      // }, 2500);
    }
  }, []);

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }

    if (event.key === "Enter" && event.shiftKey) {
      event.preventDefault();
      setMessage((prev) => prev + "\n");
    }
  };

  return (
    <div className="px-2 py-4 flex justify-between w-full items-center gap-2">
      <div className="flex">
        <Popover>
          <PopoverTrigger asChild>
            <Link
              href="#"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "h-9 w-9",
                "shrink-0"
              )}
            >
              <PlusCircle size={22} className="text-muted-foreground" />
            </Link>
          </PopoverTrigger>
          <PopoverContent side="top" className="w-full p-2">
            {message.trim() || isMobile ? (
              <div className="flex gap-2">
                <Link
                  href="#"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                    "h-9 w-9",
                    "shrink-0"
                  )}
                >
                  <Mic size={22} className="text-muted-foreground" />
                </Link>
                {BottombarIcons.map((icon, index) => (
                  <Link
                    key={index}
                    href="#"
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
                      "h-9 w-9",
                      "shrink-0"
                    )}
                  >
                    <icon.icon size={22} className="text-muted-foreground" />
                  </Link>
                ))}
              </div>
            ) : (
              <Link
                href="#"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                  "h-9 w-9",
                  "shrink-0"
                )}
              >
                <Mic size={22} className="text-muted-foreground" />
              </Link>
            )}
          </PopoverContent>
        </Popover>
        {!message.trim() && !isMobile && (
          <div className="flex">
            {BottombarIcons.map((icon, index) => (
              <Link
                key={index}
                href="#"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                  "h-9 w-9",
                  "shrink-0"
                )}
              >
                <icon.icon size={22} className="text-muted-foreground" />
              </Link>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence initial={false}>
        <motion.div
          key="input"
          className="w-full relative"
          layout
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{
            opacity: { duration: 0.05 },
            layout: {
              type: "spring",
              bounce: 0.15,
            },
          }}
        >
          <ChatInput
            value={message}
            ref={inputRef}
            onKeyDown={handleKeyPress}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className="rounded-full"
          />
          <div className="absolute right-4 bottom-2  ">
            <EmojiPicker
              onChange={(value) => {
                setMessage(message + value);
                if (inputRef.current) {
                  inputRef.current.focus();
                }
              }}
            />
          </div>
        </motion.div>

        {message.trim() ? (
          <Button
            className="h-9 w-9 shrink-0"
            onClick={handleSend}
            disabled={isLoading}
            variant="ghost"
            size="icon"
          >
            <SendHorizontal size={22} className="text-muted-foreground" />
          </Button>
        ) : (
          <Button
            className="h-9 w-9 shrink-0"
            onClick={handleThumbsUp}
            disabled={isLoading}
            variant="ghost"
            size="icon"
          >
            <ThumbsUp size={22} className="text-muted-foreground" />
          </Button>
        )}
      </AnimatePresence>
    </div>
  );
}

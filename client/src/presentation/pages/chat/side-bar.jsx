import { MoreHorizontal, SquarePen } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import moment from "moment/moment";
import { useEffect } from "react";
import { useState } from "react";
import { sortGroupsInitially } from "../../../application/slice/chatSlice";
import { useDispatch } from "react-redux";

const Sidebar = ({ chats, isCollapsed, isMobile, setSelectedGroup }) => {
  const {user} = useSelector(state=>state.auth);
  const { groups } = useSelector(state => state.chat);

  const [sortedChats, setSortedChats] = useState([]);
  useEffect(() => {
    console.log("this useEffect");
  
    let sorted = [...groups].sort((a, b) => {
      // Get the latest message's timestamp for each chat, or null if there are no messages
      const latestMessageA = a.messages.length > 0 ? a.messages[a.messages.length - 1] : null;
      const latestMessageB = b.messages.length > 0 ? b.messages[b.messages.length - 1] : null;
  
      // If both chats have no messages, consider them equal
      if (!latestMessageA && !latestMessageB) {
        return 0;
      }
  
      // If only one chat has no messages, prioritize the one with messages
      if (!latestMessageA) {
        return 1; // Move b to the front
      }
      if (!latestMessageB) {
        return -1; // Move a to the front
      }
  
      // Both chats have messages, so compare their timestamps
      return new Date(latestMessageB.timestamp) - new Date(latestMessageA.timestamp);
    });
  
    setSortedChats(sorted);
  }, [groups]);
  

  return (
    // ToDo :  sort the chat list according to the latest chat.
    // ToDo :  show the latest message in the group list bar.

    <div
      data-collapsed={isCollapsed}
      className="relative group flex flex-col h-full bg-muted/10 dark:bg-muted/20 gap-4 p-2 data-[collapsed=true]:p-2 "
    >
      {!isCollapsed && (
        <div className="flex justify-between p-2 items-center">
          <div className="flex gap-2 items-center text-2xl">
            <p className="font-medium">Chats</p>
            <span className="text-zinc-300">({chats.length})</span>
          </div>

          {/* <div>
            <Link
              href="#"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "h-9 w-9"
              )}
            >
              <MoreHorizontal size={20} />
            </Link>

            <Link
              href="#"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "h-9 w-9"
              )}
            >
              <SquarePen size={20} />
            </Link>
          </div> */}
        </div>
      )}
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {sortedChats.map((chat, index) =>
          isCollapsed ? (
            <TooltipProvider key={index}>
              <Tooltip key={index} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    onClick={() => setSelectedGroup(chat)}
                    to={`/chats/${chat._id}`}
                    className={cn(
                      buttonVariants({ variant: chat.variant, size: "icon" }),
                      "h-11 w-11 md:h-16 md:w-16",
                      chat.variant === "secondary" &&
                        "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
                    )}
                  >
                    <Avatar className="flex justify-center items-center">
                      <AvatarImage
                        src={chat.coverImage}
                        alt={chat.coverImage}
                        width={6}
                        height={6}
                        className="w-10 h-10 "
                      />
                    </Avatar>{" "}
                    <span className="sr-only">{chat.name} </span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="flex items-center gap-4"
                >
                  {chat.name}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Link
              onClick={() => setSelectedGroup(chat)}
              key={index}
              to={`/chats/${chat._id}`}
              className={cn(
                buttonVariants({ variant: chat.variant, size: "xl" }),
                chat.variant !== "secondary" &&
                  "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white shrink",
                "justify-start gap-4","p-2 flex content-end  items-center relative"
              )}
            >
              <Avatar className="flex justify-center items-center">
                <AvatarImage
                  src={chat.coverImage}
                  alt={chat.avatar}
                  width={6}
                  height={6}
                  className="w-10 h-10 "
                />
              </Avatar>
              <div className="flex flex-col max-w-28">
                <span>{chat.name}</span>
                {chat.messages.length > 0 && (
                  <span className="text-zinc-400 text-xs truncate ">
                    {(chat.messages[chat.messages.length - 1].senderId != user.id)?(chat.lastMessage?chat.lastMessage.senderName:chat.messages[chat.messages.length - 1].senderName.split(" ")[0]):"you"}
                    :{" "}
                    {chat.messages[chat.messages.length - 1].isLoading
                      ? "Typing..."
                      :(chat.lastMessage?chat.lastMessage.content :chat.messages[chat.messages.length - 1].content)}
                  </span>
                )}
                </div>
                
                {(chat.messages[chat.messages.length - 1]) && <div className="text-muted-foreground ">
                  {moment(chat.messages[chat.messages.length - 1]?.timestamp).fromNow()}
                </div>}
            </Link>
          )
        )}
      </nav>
    </div>
  );
};

export default Sidebar;

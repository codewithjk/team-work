import React from "react";
import { MoreHorizontal, SquarePen } from "lucide-react";
import { cn } from "@/lib/utils"; // Adjust path based on your project structure
import { buttonVariants } from "@/components/ui/button"; // ShadCN Button component
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

import { Avatar, AvatarImage } from "@/components/ui/avatar"; // Ensure this matches your project structure

const GroupList = ({
  groups,
  selectedGroup,
  onGroupClick,
  isCollapsed,
  isMobile,
}) => {
  return (
    <div
      className={cn(
        "bg-background p-4 md:flex-col md:w-1/3 lg:w-1/4", // Show this section on larger screens
        selectedGroup ? "hidden md:flex" : "flex-col w-full" // Show full screen on small devices
      )}
    >
      {/* Header section (collapsed/expanded view handling) */}
      {!isCollapsed && (
        <div className="flex justify-between p-2 items-center">
          <div className="flex gap-2 items-start text-2xl">
            <p className="font-medium">Chats</p>
            <span className="text-zinc-300">({groups.length})</span>
          </div>

          <div>
            <a
              href="#"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "h-9 w-9"
              )}
            >
              <MoreHorizontal size={20} />
            </a>

            <a
              href="#"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "h-9 w-9"
              )}
            >
              <SquarePen size={20} />
            </a>
          </div>
        </div>
      )}

      {/* Group list section */}
      <nav className="grid gap-1 px-2">
        {groups.map((group, index) =>
          isCollapsed ? (
            // Collapsed view (only avatars with tooltips)
            <TooltipProvider key={index}>
              <Tooltip key={index} delayDuration={0}>
                <TooltipTrigger asChild>
                  <a
                    href="#"
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
                      "h-11 w-11 md:h-16 md:w-16"
                    )}
                    onClick={() => onGroupClick(group)}
                  >
                    <Avatar className="flex justify-center items-center">
                      <AvatarImage
                        src={group.avatar}
                        alt={group.name}
                        className="w-10 h-10"
                      />
                    </Avatar>
                    <span className="sr-only">{group.name}</span>
                  </a>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="flex items-center gap-4"
                >
                  {group.name}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            // Expanded view with full group info
            <a
              key={group.id}
              href="#"
              className={cn(
                buttonVariants({ variant: "ghost", size: "xl" }),
                "justify-start gap-4 w-full"
              )}
              onClick={() => onGroupClick(group)}
            >
              <Avatar className="flex justify-center items-center">
                <AvatarImage
                  src={group.avatar}
                  alt={group.name}
                  className="w-10 h-10"
                />
              </Avatar>
              <div className="flex flex-col max-w-28">
                <span>{group.name}</span>
              </div>
            </a>
          )
        )}
      </nav>
    </div>
  );
};

export default GroupList;

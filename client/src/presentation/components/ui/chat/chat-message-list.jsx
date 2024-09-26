import * as React from "react";
import { cn } from "@/lib/utils";

const ChatMessageList = React.forwardRef(
  ({ className, children, onScroll, ...props }, ref) => (
    <div
      className={cn(
        "flex flex-col w-full h-full p-4 gap-6 overflow-y-auto",
        className
      )}
      ref={ref}
      onScroll={onScroll} // Attach onScroll event handler
      {...props}
    >
      {children}
    </div>
  )
);

ChatMessageList.displayName = "ChatMessageList";

export { ChatMessageList };

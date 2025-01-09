import React, { useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import Chat from "./chat";
import Sidebar from "./side-bar";
import { useSelector } from "react-redux";
import { useEffect } from "react";


export function ChatLayout({ defaultLayout = [320, 480], defaultCollapsed = false, navCollapsedSize }) {
  const groups = useSelector((state) => state.chat.groups);
  console.log("chat layout is rendered",groups);

  const [selectedGroup, setSelectedGroup] = useState(groups[0]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  console.log(selectedGroup)


    ;
  useEffect(() => {

      const checkScreenWidth = () => {
          const isMobileView = window.innerWidth <= 768;
          setIsMobile((prev) => (prev !== isMobileView ? isMobileView : prev));
      };

      // Set initial screen width
      window.addEventListener("resize", checkScreenWidth);

      return () => {
          window.removeEventListener("resize", checkScreenWidth);
      };
  }, []);
  return (
    groups.length > 0 && (
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(sizes)}`;
        }}
        className="h-full items-stretch"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={isMobile ? 0 : 24}
          maxSize={isMobile ? 8 : 30}
          onCollapse={() => {
            setIsCollapsed(true);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(true)}`;
          }}
          onExpand={() => {
            setIsCollapsed(false);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(false)}`;
          }}
          className={cn(
            isCollapsed
              ? "min-w-[50px] md:min-w-[70px] transition-all duration-300 ease-in-out"
              : "min-w-fit"
          )}
        >
          <Sidebar
            isCollapsed={isCollapsed || isMobile}
            chats={groups.map((group) => ({
              _id: group._id,
              name: group.name,
              messages: group.messages ?? [],
              avatar: group.coverImage,
              variant: selectedGroup._id === group._id ? "secondary" : "ghost",
            }))}
            isMobile={isMobile}
            setSelectedGroup={setSelectedGroup}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <Chat  selectedGroup={selectedGroup} isMobile={isMobile} />
        </ResizablePanel>
      </ResizablePanelGroup>
    )
  );
}

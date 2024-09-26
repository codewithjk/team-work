import React, { useEffect, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import Chat from "./chat";
import Sidebar from "./side-bar";
import projectApi from "../../../infrastructure/api/projectApi";

export function ChatLayout({
  defaultLayout = [320, 480],
  defaultCollapsed = false,
  navCollapsedSize,
}) {
  const [groups, setGroups] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [selectedGroup, setSelectedGroup] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  console.log(selectedGroup);

  useEffect(() => {
    async function getAllGroups() {
      const response = await projectApi.getAllProjects({ allProjects: true });
      setGroups(response.data.projects);
      setSelectedGroup(response.data.projects[0]);
    }
    getAllGroups();
    const checkScreenWidth = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    // Initial check
    checkScreenWidth();
    // Event listener for screen width changes
    window.addEventListener("resize", checkScreenWidth);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", checkScreenWidth);
    };
  }, []);

  return (
    groups.length > 0 && (
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(
            sizes
          )}`;
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
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              true
            )}`;
          }}
          onExpand={() => {
            setIsCollapsed(false);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              false
            )}`;
          }}
          className={cn(
            isCollapsed &&
              "min-w-[50px] md:min-w-[70px] transition-all duration-300 ease-in-out"
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
          <Chat
            messages={selectedGroup.messages}
            selectedGroup={selectedGroup}
            isMobile={isMobile}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    )
  );
}

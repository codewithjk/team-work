import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LucideHome,
  InboxIcon,
  Calendar,
  UserIcon,
  Bell,
  MenuSquare,
  SidebarCloseIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSelector } from "react-redux";
import { ModeToggle } from "./ui/mode-toggle";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const profile = useSelector((state) => state.profile);
  const { profileData } = profile;

  const menuItems = [
    { name: "Home", icon: <LucideHome className="w-5 h-5" />, path: "/" },
    { name: "Inbox", icon: <InboxIcon className="w-5 h-5" />, path: "/inbox" },
    {
      name: "Meeting",
      icon: <Calendar className="w-5 h-5" />,
      path: "/meeting",
    },
    {
      name: "Projects",
      icon: <UserIcon className="w-5 h-5" />,
      path: "/projects",
    },
    {
      name: "Notifications",
      icon: <Bell className="w-5 h-5" />,
      path: "/notifications",
    },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex min-h-screen">
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-background border border-foreground-50 text-foreground w-64 transition-transform transform md:translate-x-0",
          {
            "-translate-x-full": !isOpen,
            "translate-x-0": isOpen,
          }
        )}
      >
        {/* Avatar Section */}
        <div className="flex items-center justify-between p-4 ">
          <Avatar className="cursor-pointer">
            <Link to="/profile">
              <AvatarImage src={profileData?.avatar} alt="User Profile" />
              <AvatarFallback>U</AvatarFallback>
            </Link>
          </Avatar>
          <div className="px-2 md:block">
            <Link to="/profile" className="text-sm font-medium text-primary">
              {profileData?.name}
            </Link>
          </div>
          <Button
            className="md:hidden ml-auto"
            onClick={toggleSidebar}
            variant="ghost"
            size="icon"
          >
            {isOpen ? (
              <SidebarCloseIcon className="md:w-6 md:h-6 sm:w-4 sm:h-4" />
            ) : (
              <MenuSquare className="md:w-6 md:h-6 sm:w-4 sm:h-4" />
            )}
          </Button>
        </div>
        {/* Menu Items */}
        <nav className="flex flex-col flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex items-center p-2 rounded-md hover:bg-muted transition-colors",
                {
                  "bg-muted": location.pathname === item.path,
                }
              )}
              onClick={() => setIsOpen(false)} // Close sidebar after navigation
            >
              <span className="mr-3">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
          <ModeToggle />
        </nav>
      </div>

      <div className={cn("flex-1 transition-all sm:w-0 md:ml-64 ")}>
        <Button
          className="md:hidden mb-4 fixed top-4 left-4"
          onClick={toggleSidebar}
          variant="ghost"
          size="icon"
        >
          {isOpen ? (
            <SidebarCloseIcon className="md:w-6 md:h-6 sm:w-4 sm:h-4" />
          ) : (
            <MenuSquare className="md:w-6 md:h-6 sm:w-4 sm:h-4" />
          )}
        </Button>
        {/* Your main content here */}
      </div>
    </div>
  );
}

export default Sidebar;

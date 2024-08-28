import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  InboxIcon,
  UserIcon,
  SidebarCloseIcon,
  LucideHome,
  Calendar,
  MenuSquare,
  Bell,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const profile = useSelector((state) => state.profile);
  const { profileData } = profile;

  const menuItems = [
    { name: "Home", icon: <LucideHome />, path: "/" },
    { name: "Inbox", icon: <InboxIcon />, path: "/inbox" },
    { name: "Meeting", icon: <Calendar />, path: "/meeting" },
    { name: "Projects", icon: <UserIcon />, path: "/projects" },
    { name: "Notifications", icon: <Bell />, path: "/notifications" },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex min-h-screen">
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-gray-800 text-white w-64 transition-transform transform md:translate-x-0",
          {
            "-translate-x-full": !isOpen,
            "translate-x-0": isOpen,
          }
        )}
      >
        {/* Avatar Section */}
        <div className="flex items-center justify-between p-4">
          <Avatar className="cursor-pointer" asChild>
            <Link to="/profile">
              <AvatarImage src={profileData?.avatar} alt="User Profile" />
              <AvatarFallback>U</AvatarFallback>
            </Link>
          </Avatar>
          <div className=" px-2 md:block">
            <Link to="/profile" className="text-sm font-medium">
              {profileData?.name}
            </Link>
          </div>
          <Button
            className="md:hidden ml-auto"
            onClick={toggleSidebar}
            variant="ghost"
            size="icon"
          >
            {isOpen ? <SidebarCloseIcon /> : <MenuSquare />}
          </Button>
        </div>
        {/* Menu Items */}
        <nav className="flex flex-col flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex items-center p-2 rounded-md hover:bg-gray-700 transition-colors",
                {
                  "bg-gray-700": location.pathname === item.path,
                }
              )}
              onClick={() => setIsOpen(false)} // Close sidebar after navigation
            >
              <span className="mr-3">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div
        className={cn(
          "flex-1 p-4 transition-all md:ml-64"
          // isOpen ? "sm:ml-0" : "ml-0"
        )}
      >
        <Button
          className="md:hidden mb-4 fixed top-4 left-4"
          onClick={toggleSidebar}
          variant="ghost"
          size="icon"
        >
          {isOpen ? <SidebarCloseIcon /> : <MenuSquare />}
        </Button>
        {/* Your main content here */}
      </div>
    </div>
  );
}

export default Sidebar;

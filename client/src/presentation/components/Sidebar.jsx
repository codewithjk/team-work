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
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSelector } from "react-redux";

import { useEffect } from "react";
import projectApi from "../../infrastructure/api/projectApi";
import { Badge } from "./ui/badge";
import { getSocket } from "@/utils/socketClient.config";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [projectsDropdownOpen, setProjectsDropdownOpen] = useState(false);
  const [openProjectDropdowns, setOpenProjectDropdowns] = useState({});
  const location = useLocation();
  const [projects, setProjects] = useState([]);
  const profile = useSelector((state) => state.profile);
  const { profileData } = profile;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectApi.getAllProjects({ allProjects: true });
        const data = response.data.projects;
        if (response.status === 200) {
          setProjects(data);
        } else {
          // toast.error("Failed to fetch projects.");
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  //function to join the project group
  const handleSelectTask = (project) => {
    const userId = profileData._id;
    const socket = getSocket();
    socket.emit("joinProjectTask", { projectId: project._id, userId });
  };

  const { unread } = useSelector((state) => state.notification);

  const menuItems = [
    { name: "Home", icon: <LucideHome className="w-5 h-5" />, path: "/home" },
    { name: "Inbox", icon: <InboxIcon className="w-5 h-5" />, path: "/chats" },
    {
      name: "Meetings",
      icon: <Calendar className="w-5 h-5" />,
      path: "/meetings",
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
      //todo : add iconbutton from radis ui
    },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleProjectsDropdown = () => {
    setProjectsDropdownOpen(!projectsDropdownOpen);
  };

  const toggleProjectMenu = (projectId) => {
    setOpenProjectDropdowns((prevState) => ({
      [projectId]: !prevState[projectId],
    }));
  };

  return (
    <div className="flex min-h-screen w-fit">
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-background border border-foreground-50 text-foreground md:w-64 transition-transform transform md:translate-x-0",
          {
            "-translate-x-full": !isOpen,
            "translate-x-0": isOpen,
          }
        )}
      >
        {/* Avatar Section */}
        <div className="flex items-center justify-between p-4 ">
          <Avatar className="cursor-pointer overflow-hidden">
            <Link to="/profile">
              <AvatarImage
                src={profileData?.avatar}
                className="object-cover w-full h-full"
              />
              <AvatarFallback className=" font-extrabold text-2xl">
                {profileData?.name[0].toUpperCase()}
              </AvatarFallback>
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
                "flex items-center p-2 rounded-md hover:bg-muted transition-colors gap-2",
                {
                  "bg-muted": location.pathname === item.path,
                }
              )}
              onClick={() => setIsOpen(false)} // Close sidebar after navigation
            >
              <span className="mr-3">{item.icon}</span>
              <span>{item.name}</span>
              {item.name == "Notifications" && unread.length > 0 && (
                <Badge>{unread.length}</Badge>
              )}
            </Link>
          ))}

          {/* Projects Dropdown */}
          <div className="mt-4">
            <button
              onClick={toggleProjectsDropdown}
              className="flex items-center w-full p-2 rounded-md hover:bg-muted transition-colors"
            >
              <span className="mr-3">
                <UserIcon className="w-5 h-5" />
              </span>
              <span>Your Projects</span>
              {projectsDropdownOpen ? (
                <ChevronDown className="ml-auto w-4 h-4" />
              ) : (
                <ChevronRight className="ml-auto w-4 h-4" />
              )}
            </button>

            {/* Projects List */}
            {projectsDropdownOpen && (
              <div className="ml-4 mt-2 space-y-2">
                {projects.map((project) => (
                  <div key={project._id}>
                    <button
                      onClick={() => toggleProjectMenu(project._id)}
                      className="flex items-center w-full p-2 rounded-md hover:bg-muted transition-colors"
                    >
                      <span>{project.name}</span>
                      {openProjectDropdowns[project._id] ? (
                        <ChevronDown className="ml-auto w-4 h-4" />
                      ) : (
                        <ChevronRight className="ml-auto w-4 h-4" />
                      )}
                    </button>

                    {/* Project Menu Items */}
                    {openProjectDropdowns[project._id] && (
                      <div className="ml-4 space-y-2">
                        <Link
                          onClick={() => handleSelectTask(project)}
                          to={`/projects/${project._id}/tasks`}
                          className="block p-2 text-sm rounded-md hover:bg-muted"
                        >
                          Tasks
                        </Link>

                        <Link
                          to={`/projects/${project._id}/modules`}
                          className="block p-2 text-sm rounded-md hover:bg-muted"
                        >
                          Modules
                        </Link>
                        {/* Add more project-specific links as needed */}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
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

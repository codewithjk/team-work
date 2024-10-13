import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Toaster, toast } from "sonner";
import DateRangePicker from "@/components/date-range-picker/DateRangePicker";
import { useParams } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { MoreVertical } from "lucide-react";
import { CalendarDaysIcon } from "lucide-react";
import ConfirmationPopover from "@/components/ui/conformationPopover";
import notificationApi from "../../../infrastructure/api/notificationApi";
import projectApi from "../../../infrastructure/api/projectApi";
import { Video } from "lucide-react";
import { MessageCircleIcon } from "lucide-react";
import { clearNotification } from "../../../application/slice/notificationSlice";
import { useDispatch } from "react-redux";

const NotificationPage = () => {
  // const { projectId } = useParams();

  const [notifications, setNotifications] = useState([]);
  const [currentNotification, setCurrentNotification] = useState(null);
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  const handleOpenPopover = () => setPopoverOpen(true);
  const handleClosePopover = () => setPopoverOpen(false);
  const [projects, setProjects] = useState([]);
  const [selectedProjectName, setSelectedProjectName] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(clearNotification());
    const fetchProjects = async () => {
      try {
        const response = await projectApi.getAllProjects();
        const data = response.data.projects;
        if (response.status === 200) {
          setProjects(data);
        } else {
          toast.error("Failed to fetch projects.");
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();

    async function getNotifications() {
      const allProjectsResponse = await projectApi.getAllProjects({
        allProjects: true,
      });
      let projects = allProjectsResponse.data.projects;
      let projectIds = projects.map((pro) => pro._id);

      const response = await notificationApi.getAllNotifications({
        projectIds,
      });

      setNotifications(response.data.notifications.reverse());
    }
    getNotifications();
  }, []);

  console.log(projects);
  console.log(notifications);

  const handleDeleteNotification = async (notification) => {
    setCurrentNotification(notification);
    handleOpenPopover();
  };
  const handleConfirm = async () => {
    try {
      const response = await notificationApi.deleteNotification(
        currentNotification._id
      );
      if (response.status === 200) {
        setNotifications((prevNotifications) =>
          prevNotifications.filter(
            (notification) => notification._id !== currentNotification._id
          )
        ); // Remove the deleted notification from the list
        toast.success("Notification deleted successfully");
      } else {
        toast.error("Failed to delete notification");
      }
    } catch (error) {
      toast.error("Failed to delete notification");
    } finally {
      setCurrentNotification(null);
      handleClosePopover();
    }
  };

  const handleCancelDelete = () => {
    setCurrentNotification(null);
    handleClosePopover();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleCleatAll = async () => {
    const response = await notificationApi.clearAll();
    if (response.status === 200) {
      setNotifications([]);
    } else {
      toast.error("Failed to clear notification");
    }
  };

  return (
    <div className="min-h-screen p-4 max-w-screen">
      {/* Add notification Button */}
      <div className="flex justify-end pb-2 ">
        <Button onClick={handleCleatAll}>clear all</Button>
      </div>
      <div className="flex flex-col gap-2">
        {notifications.map((notification) => (
          <Card
            key={notification.id}
            className="shadow-md dark:bg-gray-800 p-4 flex flex-col md:flex-row justify-between items-center"
          >
            <div className="flex items-center space-x-4">
              <div
                className="radial-progress text-blue-500"
                style={{ "--value": notification.progress, "--size": "3rem" }}
              >
                <MessageCircleIcon />
              </div>
              <div className="">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {notification.notification.title}
                </h2>
                <p className=" text-sm text-zinc-500">
                  {notification.notification.message}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              {/* <a
                href={notification.notification.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button>View</Button>
              </a> */}

              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant="ghost">
                    <MoreVertical className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => handleDeleteNotification(notification)}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Card>
        ))}

        <ConfirmationPopover
          isOpen={isPopoverOpen}
          title="Delete Notification"
          description="Are you sure you want to proceed with this action?"
          onCancel={handleCancelDelete}
          onConfirm={handleConfirm}
        />
      </div>

      {/* <Toaster /> */}
    </div>
  );
};

export default NotificationPage;

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/ui/navbar";
import { getSocket } from "@/utils/socketClient.config";
import React from "react";
import { Toaster } from "sonner";
import { toast } from "sonner";

function PrivatePageLayout({ children }) {
  const handleNotification = (notification) => {
    toast.error(notification.title);
  };
  const socket = getSocket();
  console.log(socket);
  socket.on("receiveNotification", (data) => {
    handleNotification(data);
    console.log(
      "++++++++++++notification from privete layout++++++++++++",
      data
    );
  });
  return (
    <div className=" flex flex-row bg-background h-screen  overflow-hidden">
      <Toaster />
      <Sidebar />
      <div className=" flex flex-col overflow-hidden  flex-grow">
        <Navbar />
        <div className="flex-grow overflow-auto">{children}</div>
      </div>
    </div>
  );
}

export default PrivatePageLayout;

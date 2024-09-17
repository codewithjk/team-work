import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/ui/navbar";
import React from "react";

function PrivatePageLayout({ children }) {
  return (
    <div className=" flex flex-row bg-background h-screen  overflow-hidden">
      <Sidebar />
      <div className=" flex flex-col overflow-hidden  flex-grow">
        <Navbar />
        <div className="flex-grow overflow-auto">{children}</div>
      </div>
    </div>
  );
}

export default PrivatePageLayout;

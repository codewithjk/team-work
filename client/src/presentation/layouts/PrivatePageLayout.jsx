import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/ui/navbar";
import React from "react";

function PrivatePageLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-row bg-background overflow-hidden">
      <Sidebar />
      <div className="flex-1 ">
        <Navbar />
        {children}
      </div>
    </div>
  );
}

export default PrivatePageLayout;

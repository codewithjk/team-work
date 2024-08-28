import Sidebar from "@/components/Sidebar";
import React from "react";

function PrivatePageLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-row bg-gray-100">
      <Sidebar />
      <div className="flex-1 ">{children}</div>
    </div>
  );
}

export default PrivatePageLayout;

import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../application/actions/authActions";
import PrivatePageLayout from "@/layouts/PrivatePageLayout";

function HomePage() {
  const dispatch = useDispatch();
  const handleclick = () => {
    dispatch(logout());
    console.log("logout clicked");
  };
  return (
    <PrivatePageLayout>
      <h1>home</h1>
      <Button onClick={handleclick}>Logout</Button>
    </PrivatePageLayout>
  );
}

export default HomePage;

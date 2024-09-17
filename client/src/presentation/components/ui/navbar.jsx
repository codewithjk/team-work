import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "./breadcrumb";
import { useDispatch } from "react-redux";
import { logout } from "../../../application/actions/authActions";
import { Button } from "./button";
import { ModeToggle } from "./mode-toggle";

function Navbar() {
  const dispatch = useDispatch();
  const handleclick = () => {
    dispatch(logout());
  };
  return (
    <div className=" p-2 border border-foreground-50 flex justify-between align-middle ">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className=" flex justify-center items-center gap-2">
        <ModeToggle />
        <Button onClick={handleclick}>Logout</Button>
      </div>
    </div>
  );
}

export default Navbar;

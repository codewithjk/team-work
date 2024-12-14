import Lottie from "lottie-react";
import React from "react";

import rocketAnimation from "../../../asset/animations/rocket-animation.json";
import { Button } from "../ui/button";
import { useState } from "react";
import { useEffect } from "react";

function NoProjects({ ButtonAction, isProjectFormOpen }) {
  const [isLaunched, setIsLaunched] = useState(true);

  const handleClick = () => {
    // setIsLaunched(!isLaunched);
    ButtonAction();
  };
  useEffect(() => {
    setIsLaunched(!isLaunched);
  }, [isProjectFormOpen]);

  return (
    <div className="flex flex-col max-w-full items-center justify-center">
      <div
        className={`transition-transform duration-700 ease-out relative  ${
          isLaunched ? " translate-y-[-700px] " : "opacity-100 "
        }`}
      >
        <Lottie animationData={rocketAnimation} className="max-w-md" />
      </div>

      <Button onClick={handleClick}>Create New Project</Button>
    </div>
  );
}

export default NoProjects;

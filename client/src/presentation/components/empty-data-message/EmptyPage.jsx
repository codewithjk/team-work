import Lottie from "lottie-react";
import React from "react";
import emptyfolder from "../../../asset/animations/empty-folder.json";
function EmptyPage({ title,description }) {
 

  return (
      <div className="flex flex-col items-center justify-center">
          <h1 className=" text-5xl font-bold text-muted-foreground  ">{title}</h1>
           <Lottie loop={false} animationData={emptyfolder}  className="w-fit h-fit m-0 p-0" />
    </div>
  );
}

export default EmptyPage;

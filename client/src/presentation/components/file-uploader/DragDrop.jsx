import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";

const fileTypes = ["JPG", "PNG", "GIF", "PDF"];

function DragDrop({files,setFiles}) {
 
  const handleChange = (file) => {
    setFiles([...files,file]);
  };
  return (
    <FileUploader handleChange={handleChange} name="file" types={fileTypes} />
  );
}

export default DragDrop;
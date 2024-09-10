import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const KanbanCard = ({ task }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-background text-foreground rounded-lg shadow border p-4 mb-2"
      {...attributes}
      {...listeners}
    >
      <h4 className="font-semibold">{task.name}</h4>
      <p className="text-sm">{task.description}</p>
    </div>
  );
};

export default KanbanCard;

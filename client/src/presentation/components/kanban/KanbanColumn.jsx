import React from "react";
import KanbanCard from "./KanbanCard";
import { cn } from "@/lib/utils";
import { CSS } from "@dnd-kit/utilities";
import { useDroppable } from "@dnd-kit/core";

const KanbanColumn = ({ state, tasks, isOverlay, isOwner }) => {
  const { setNodeRef } = useDroppable({
    id: state.title,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "bg-background  min-h-screen p-4 w-50 border  border-r flex flex-col gap-2 ",
        isOverlay ? "ring-0 ring-foreground-50" : "border-1 border-transparent"
      )}
    >
      <h3 className="text font-bold mb-4">{state.title}</h3>

      {tasks.map((task) => (
        <KanbanCard key={task._id} task={task} isOwner={isOwner} />
      ))}
    </div>
  );
};

export default KanbanColumn;

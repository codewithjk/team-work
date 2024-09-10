import React from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import KanbanCard from "./KanbanCard";

const KanbanColumn = ({ state, tasks }) => {
  return (
    <div className="bg-background rounded-lg shadow-md min-h-full p-4 w-64 border border-foreground-50">
      <h3 className="text-xl font-bold mb-4">{state}</h3>
      <SortableContext
        items={tasks.map((task) => task._id)}
        strategy={verticalListSortingStrategy}
      >
        {tasks.map((task) => (
          <KanbanCard key={task._id} task={task} />
        ))}
      </SortableContext>
    </div>
  );
};

export default KanbanColumn;

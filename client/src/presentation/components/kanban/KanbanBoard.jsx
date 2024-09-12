import React, { useEffect, useState } from "react";
import {
  DndContext,
  useSensor,
  useSensors,
  MouseSensor,
  closestCenter,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import io from "socket.io-client";
import axios from "axios";
import KanbanColumn from "./KanbanColumn";

// const socket = io("http://localhost:5000");

const KanbanBoard = ({ initialTasks }) => {
  const [tasks, setTasks] = useState(initialTasks ?? []);
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } })
  );

  useEffect(() => {
    // Listen for real-time task updates
    socket.on("taskUpdated", (updatedTask) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === updatedTask._id ? updatedTask : task
        )
      );
    });

    return () => {
      socket.off("taskUpdated");
    };
  }, []);

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over) return;

    const activeTask = tasks.find((task) => task._id === active.id);
    const overColumn = over.data.current?.state;

    if (overColumn && activeTask.state !== overColumn) {
      const updatedTask = { ...activeTask, state: overColumn };

      // Update task state locally
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === activeTask._id ? updatedTask : task
        )
      );

      try {
        // Update task state on the backend
        await axios.put(`/api/tasks/${activeTask._id}/state`, {
          state: overColumn,
        });

        // Emit the real-time update to other clients
        socket.emit("taskUpdated", updatedTask);
      } catch (error) {
        console.error("Failed to update task state", error);
      }
    }
  };

  const states = [
    "backlog",
    "planned",
    "in-progress",
    "paused",
    "completed",
    "cancelled",
  ];

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="flex space-x-4 overflow-x-auto">
        {states.map((state) => (
          <KanbanColumn
            key={state}
            state={state}
            tasks={tasks.filter((task) => task.state === state)}
          />
        ))}
      </div>
    </DndContext>
  );
};

export default KanbanBoard;

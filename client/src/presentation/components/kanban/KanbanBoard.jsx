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
import { useSelector } from "react-redux";
import { updateTask } from "../../../application/actions/taskActions";
import { useDispatch } from "react-redux";

// const socket = io("http://localhost:5000");

const KanbanBoard = ({ isOwner }) => {
  const { tasks } = useSelector((state) => state.task);
  const dispatch = useDispatch();

  // const [tasks, setTasks] = useState(initialTasks);
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } })
  );

  // useEffect(() => {
  //   // Listen for real-time task updates
  //   socket.on("taskUpdated", (updatedTask) => {
  //     setTasks((prevTasks) =>
  //       prevTasks.map((task) =>
  //         task._id === updatedTask._id ? updatedTask : task
  //       )
  //     );
  //   });

  //   return () => {
  //     socket.off("taskUpdated");
  //   };
  // }, []);

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    console.log(event);

    if (!over) return;

    const taskId = active.id;
    const state = over.id;
    dispatch(updateTask(taskId, { state }));

    // const activeTask = tasks.find((task) => task._id === active.id);
    // const overColumn = over.data.current?.state;

    // if (overColumn && activeTask.state !== overColumn) {
    //   const updatedTask = { ...activeTask, state: overColumn };

    //   // Update task state locally
    //   setTasks((prevTasks) =>
    //     prevTasks.map((task) =>
    //       task._id === activeTask._id ? updatedTask : task
    //     )
    //   );

    //   try {
    //     // Update task state on the backend
    //     await axios.put(`/api/tasks/${activeTask._id}/state`, {
    //       state: overColumn,
    //     });

    //     // Emit the real-time update to other clients
    //     socket.emit("taskUpdated", updatedTask);
    //   } catch (error) {
    //     console.error("Failed to update task state", error);
    //   }
    // }
  };

  const states = [
    { id: 1, title: "backlog" },
    { id: 2, title: "planned" },
    { id: 3, title: "in-progress" },
    { id: 4, title: "paused" },
    { id: 5, title: "completed" },
    { id: 6, title: "cancelled" },
  ];

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-full overflow-x-scroll w-fit border border-t border-foreground-50 ">
        {states.map((state) => (
          <div key={state.id} className="flex-shrink-1 w-80  h-full">
            <KanbanColumn
              state={state}
              tasks={tasks.filter((task) => task.state === state.title)}
              isOverlay
              isOwner={isOwner}
            />
          </div>
        ))}
      </div>
    </DndContext>
  );
};

export default KanbanBoard;

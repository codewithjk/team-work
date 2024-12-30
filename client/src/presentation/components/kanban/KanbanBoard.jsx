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
import { getSocket } from "@/utils/socketClient.config";
import { useParams } from "react-router-dom";
import { updateTasksSuccess } from "../../../application/slice/taskSlice";
import { toast } from "sonner";

const KanbanBoard = ({ isOwner }) => {
  const { tasks } = useSelector((state) => state.task);
  const { user } = useSelector((state) => state.auth);
  const { projectId } = useParams();
  const dispatch = useDispatch();

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } })
  );
  const socket = getSocket();

  useEffect(() => {
    console.log(socket);
    
    if (socket) {
      socket.on("receiveUpdatedTask", (updatedTask) => {
        console.log("receives the updatedTask ===== ", updatedTask);
        dispatch(updateTasksSuccess(updatedTask));
      });
    }
  });

  const handleDragEnd = async (event) => {
   
    if (!event.activatorEvent.srcElement.classList.contains("drag")) {
      event.stopPropagation();
      return
    }
    const { active, over } = event;

    if (!over) return;
    console.log(event);

    const task = active.data.current;

    const taskId = active.id;
    const state = over.id;
    // dispatch(updateTask(taskId, { state }));
    const socket = getSocket();
    if (!task.assignees.includes(user.id)) {
      console.log("not assigned task");
    }
    if (socket?.connected) {
      socket.emit("updateTask", { projectId, taskId, state });
      dispatch(updateTask(taskId, { state }));
      toast.success("task updated successfully")
    } else {
      toast.error("unable to change state ");
    }
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

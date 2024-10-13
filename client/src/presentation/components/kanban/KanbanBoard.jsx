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

const KanbanBoard = ({ isOwner }) => {
  const { tasks } = useSelector((state) => state.task);
  const { projectId } = useParams();
  const dispatch = useDispatch();

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } })
  );

  useEffect(() => {
    const socket = getSocket();
    if (socket) {
      socket.on("receiveUpdatedTask", (state) => {
        console.log("receives the state ===== ", state);
      });
    }
  });

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    console.log(event);

    if (!over) return;

    const taskId = active.id;
    const state = over.id;
    dispatch(updateTask(taskId, { state }));
    const socket = getSocket();
    socket.emit("updateTask", { projectId, taskId, state });
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

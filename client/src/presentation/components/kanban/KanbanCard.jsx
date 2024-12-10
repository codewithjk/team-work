import React from "react";

import { CSS } from "@dnd-kit/utilities";
import { useDraggable } from "@dnd-kit/core";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { CalendarDaysIcon } from "lucide-react";

import { MoreHorizontal } from "lucide-react";

import PriorityButton from "./priorityButton";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setCurrentTask } from "../../../application/slice/taskSlice";
import taskApi from "../../../infrastructure/api/taskApi";
import ConfirmationPopover from "../ui/conformationPopover";
import { Toaster } from "sonner";
import TaskForm from "../ui/TaskForm";
import projectApi from "../../../infrastructure/api/projectApi";
import moduleApi from "../../../infrastructure/api/moduleApi";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { toast } from "sonner";
import {
  deleteTask,
  updateTask,
} from "../../../application/actions/taskActions";

const KanbanCard = ({ task, isOwner }) => {
  const { projectId } = useParams();
  const { currentTask } = useSelector((state) => state.task);
  const dispatch = useDispatch();
  const [openEditForm, setOpenEditForm] = useState(false);
  const [members, setMembers] = useState([]);
  const [modules, setModules] = useState([]);
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  const handleOpenPopover = () => setPopoverOpen(true);
  const handleClosePopover = () => setPopoverOpen(false);

  useEffect(() => {
    async function getMembers() {
      const response = await projectApi.getMembers(projectId);
      setMembers(response.data.members);
    }
    getMembers();
    // async function getTasks() {
    //   const response = await taskApi.getAllTasks(projectId);
    //   setTasks(response.data.tasks);
    // }
    // getTasks();
    async function getModules() {
      const response = await moduleApi.getAllModules(projectId);
      setModules(response.data.modules);
    }
    getModules();
  }, [projectId]);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task._id,
    data: task,
  });
  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const handleEditTask = async (task) => {
    const response = await taskApi.getTask(task._id);

    await dispatch(setCurrentTask(response.data.task[0]));
    setOpenEditForm(true);
  };
  const submitEditForm = async (data) => {
    try {
      dispatch(updateTask(currentTask._id, data));
      toast.success("Task updated successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update task");
    } finally {
      dispatch(setCurrentTask(null));
      setOpenEditForm(false);
    }
  };

  const handleDeleteTask = async (task) => {
    dispatch(setCurrentTask(task));
    handleOpenPopover();
  };

  const handleConfirm = async () => {
    try {
      dispatch(deleteTask(currentTask._id));
      toast.success("Task deleted successfully");
    } catch (error) {
      toast.error("Failed to delete task");
    } finally {
      dispatch(setCurrentTask(null));
      handleClosePopover();
    }
  };

  const handleCancelDelete = () => {
    dispatch(setCurrentTask(null));
    handleClosePopover();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className=" group shadow bg-background p-2 flex-col justify-between items-center border border-foreground-50 rounded hover:border-blue-400"
      {...attributes}
      {...listeners}
    >
      <div className="flex items-center justify-between p-0 mb-2 ">
        <p className="p-0 m-0 font-normal md:text-sm">{task.name}</p>
        {isOwner && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreHorizontal className="m-0 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEditTask(task)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDeleteTask(task)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <div className="flex flex-col gap-2 items-start space-x-4 mt-4 md:mt-0 text-gray-600 dark:text-gray-400 ">
        <div className=" grid grid-flow-col gap-2">
          <button className="border rounded border-foreground-50 p-1 text-sm ">
            {task.state}
          </button>
          <PriorityButton task={task} />
        </div>
        <p className="text-sm  flex items-start m-0 p-0">
          <CalendarDaysIcon className="w-4 h-4 " />
          {formatDate(task.startDate)} - {formatDate(task.endDate)}
        </p>
      </div>

      {openEditForm && currentTask && (
        <TaskForm
          isOpen={openEditForm}
          onClose={() => setOpenEditForm(false)}
          submitHandler={submitEditForm}
          members={members}
          modules={modules}
          initialData={currentTask}
        />
      )}

      <ConfirmationPopover
        isOpen={isPopoverOpen}
        title="Delete Module"
        description="Are you sure you want to proceed with this action?"
        onCancel={handleCancelDelete}
        onConfirm={handleConfirm}
      />
    </div>
  );
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default KanbanCard;

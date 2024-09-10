import React, { useState, useEffect } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Toaster, toast } from "sonner";
import DateRangePicker from "@/components/date-range-picker/DateRangePicker";
import { useParams } from "react-router-dom";
import projectApi from "../../infrastructure/api/projectApi";
import taskApi from "../../infrastructure/api/taskApi";
import { Badge } from "@/components/ui/badge";
import { MoreVertical } from "lucide-react";
import { CalendarDaysIcon } from "lucide-react";
import TaskForm from "@/components/ui/TaskForm"; // Change ModuleForm to TaskForm
import ConfirmationPopover from "@/components/ui/conformationPopover";
import moduleApi from "../../infrastructure/api/moduleApi";
import KanbanBoard from "@/components/kanban/KanbanBoard";

// Zod schema for form validation
const taskSchema = z.object({
  name: z.string().min(1, "Title is required"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: z
    .enum([
      "backlog",
      "planned",
      "in-progress",
      "paused",
      "completed",
      "cancelled",
    ])
    .default("planned"),
  lead: z.string().optional(),
  members: z.array(z.string()).optional(),
});

const TaskPage = () => {
  const { projectId } = useParams();

  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false); // Change isModuleFormOpen to isTaskFormOpen

  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [modules, setModules] = useState([]);

  const [openEditForm, setOpenEditForm] = useState(false);
  const [currentTask, setCurrentTask] = useState(null); // Change currentModule to currentTask
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  const handleOpenPopover = () => setPopoverOpen(true);
  const handleClosePopover = () => setPopoverOpen(false);

  useEffect(() => {
    async function getMembers() {
      const response = await projectApi.getMembers(projectId);
      setMembers(response.data.members);
    }
    getMembers();
    async function getTasks() {
      const response = await taskApi.getAllTasks(projectId); // Change getAllModules to getAllTasks
      setTasks(response.data.tasks);
    }
    getTasks();
    async function getModules() {
      const response = await moduleApi.getAllModules(projectId);
      setModules(response.data.modules);
    }
    getModules();
    async function getTasks() {
      const response = await taskApi.getAllTasks(projectId);
      console.log(response);
      setTasks(response.data.tasks);
    }
    getTasks();
  }, [projectId]);

  const handleAddTask = async (data) => {
    try {
      const response = await taskApi.createTask(projectId, data);
      setTasks([...tasks, response.data.task]);
      toast.success("Task created successfully!");
      setIsTaskFormOpen(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to create task");
    }
  };

  const handleDateRange = (range) => {
    const startDate = range?.from
      ? new Date(range.from).toISOString().split("T")[0]
      : null;
    const endDate = range?.to
      ? new Date(range.to).toISOString().split("T")[0]
      : null;

    setValue("startDate", startDate);
    setValue("endDate", endDate);

    setDateRange(range);
  };

  const submitEditForm = async (data) => {
    // Change submitEditForm
    console.log(data);
    try {
      const response = await taskApi.updateTask(currentTask._id, data); // Change updateModule to updateTask
      console.log(response);

      if (response.status === 200) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === currentTask._id ? response.data.task : task
          )
        ); // Replace the old task with the updated one
        toast.success("Task updated successfully!");
      }
    } catch (error) {
      toast.error("Failed to update task");
    } finally {
      setCurrentTask(null);
      setOpenEditForm(false);
    }
  };

  const handleEditTask = async (task) => {
    const response = await taskApi.getTask(task._id);
    console.log("handle edit task:", response);

    await setCurrentTask(response.data.task[0]);
    setOpenEditForm(true);
  };

  const handleDeleteTask = async (task) => {
    setCurrentTask(task);
    handleOpenPopover();
  };

  const handleConfirm = async () => {
    try {
      const response = await taskApi.deleteTask(currentTask._id);
      if (response.status === 200) {
        setTasks((prevTasks) =>
          prevTasks.filter((task) => task._id !== currentTask._id)
        );
        toast.success("Task deleted successfully");
      } else {
        toast.error("Failed to delete task");
      }
    } catch (error) {
      toast.error("Failed to delete task");
    } finally {
      setCurrentTask(null);
      handleClosePopover();
    }
  };

  const handleCancelDelete = () => {
    setCurrentTask(null); // Change currentModule to currentTask
    handleClosePopover();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen p-4 max-w-screen">
      {/* Add task Button */}
      <div className="flex justify-end pb-2">
        <Button onClick={() => setIsTaskFormOpen(true)}>Add Task</Button>{" "}
        {/* Change setIsModuleFormOpen to setIsTaskFormOpen */}
      </div>
      {/* <div className="flex flex-col gap-2">
        {tasks.map(
          (
            task // Change modules to tasks
          ) => (
            <Card
              key={task.id}
              className="shadow-md dark:bg-gray-800 p-4 flex flex-col md:flex-row justify-between items-center"
            >
              <div className="flex items-center space-x-4">
                <div
                  className="radial-progress text-blue-500"
                  style={{ "--value": task.progress, "--size": "3rem" }}
                >
                  {task.progress}%
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {task.name}
                  </h2>
                </div>
              </div>
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                  <CalendarDaysIcon className="w-4 h-4 mr-1" />
                  {formatDate(task.startDate)} - {formatDate(task.endDate)}
                </p>
                <Badge className="px-2 py-1 bg-background text-foreground border border-foreground-500">
                  {task.status}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button variant="ghost">
                      <MoreVertical className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </Button>
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
              </div>
            </Card>
          )
        )}
      </div> */}

      <div className="w-full overflow-x-auto whitespace-nowrap">
        <KanbanBoard Tasks={tasks} />
      </div>

      {isTaskFormOpen && (
        <TaskForm
          isOpen={isTaskFormOpen}
          onClose={() => setIsTaskFormOpen(false)}
          submitHandler={handleAddTask}
          members={members}
          modules={modules}
          initialData={{}}
        />
      )}

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

      <Toaster richColors />
    </div>
  );
};

export default TaskPage;

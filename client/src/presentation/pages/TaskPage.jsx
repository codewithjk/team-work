import React, { useState, useEffect } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import { useParams } from "react-router-dom";
import projectApi from "../../infrastructure/api/projectApi";
import taskApi from "../../infrastructure/api/taskApi";
import TaskForm from "@/components/ui/TaskForm"; // Change ModuleForm to TaskForm
import moduleApi from "../../infrastructure/api/moduleApi";
import KanbanBoard from "@/components/kanban/KanbanBoard";
import { useDispatch } from "react-redux";
import { getTasks } from "../../application/actions/taskActions";
import { useSelector } from "react-redux";
import { getSocket } from "@/utils/socketClient.config";

const TaskPage = () => {
  console.log(" task page rendered");

  const dispatch = useDispatch();

  const { projectId } = useParams();
  dispatch(getTasks(projectId));

  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);

  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [modules, setModules] = useState([]);
  const [project, setProject] = useState([]);
  const { profileData } = useSelector((state) => state.profile);

  useEffect(() => {
    async function getMembers() {
      const response = await projectApi.getMembers(projectId);
      setMembers(response.data.members);
    }
    getMembers();
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
    async function getProject(projectId) {
      const response = await projectApi.getProject(projectId);
      console.log(response);
      setProject(response.data.project);
    }
    getProject(projectId);
  }, [projectId]);

  const isOwner = project.ownerId === profileData?._id;
  console.log(isOwner, project.ownerId, profileData?._id);

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

  return (
    <div className="min-h-screen  max-w-screen ">
      {/* Add task Button */}
      <div className="flex justify-end p-2">
        {isOwner && (
          <Button onClick={() => setIsTaskFormOpen(true)}>Add Task</Button>
        )}
        {/* Change setIsModuleFormOpen to setIsTaskFormOpen */}
      </div>

      <div className=" overflow-scroll">
        <KanbanBoard isOwner={isOwner} />
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
    </div>
  );
};

export default TaskPage;

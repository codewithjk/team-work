import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {  toast } from "sonner";
import { useParams } from "react-router-dom";
import projectApi from "../../infrastructure/api/projectApi";
import taskApi from "../../infrastructure/api/taskApi";
import TaskForm from "@/components/ui/TaskForm"; // Change ModuleForm to TaskForm
import moduleApi from "../../infrastructure/api/moduleApi";
import KanbanBoard from "@/components/kanban/KanbanBoard";
import { useDispatch } from "react-redux";
import { getTasks } from "../../application/actions/taskActions";
import { useSelector } from "react-redux";
import { uploadFiles } from "@/utils/uploadFiles";

const TaskPage = () => {
  const dispatch = useDispatch();

  const { projectId } = useParams();

  dispatch(getTasks(projectId));

  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);

  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [modules, setModules] = useState([]);
  const [project, setProject] = useState({});
  const [files, setFiles] = useState([]);

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
      setTasks(response.data.tasks);
    }
    getTasks();
    async function getProject(projectId) {
      const response = await projectApi.getProject(projectId);
      setProject(response.data.project);
    }
    getProject(projectId);
    
  }, [projectId]);

  const isOwner = project.ownerId === profileData?._id;

  const handleAddTask = async (data) => {

    try {
      if (files.length > 0) {
        const fileData = await uploadFiles(files);
        if (fileData) {
          data.files = fileData
        }
      }
     
      const response = await taskApi.createTask(projectId, data);
      setTasks([...tasks, response.data.task]);
      toast.success("Task created successfully!");
      setIsTaskFormOpen(false);
      setFiles([])
    } catch (error) {
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
      {isOwner && ( <div className="flex justify-end p-2">   
          <Button onClick={() => setIsTaskFormOpen(true)}>Add Task</Button>
      </div> )}

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
          files = {files}
          setFiles={setFiles}
        />
      )}
    </div>
  );
};

export default TaskPage;

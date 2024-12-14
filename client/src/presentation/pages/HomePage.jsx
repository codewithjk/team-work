

"use client";

import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../application/actions/authActions";
import PrivatePageLayout from "@/layouts/PrivatePageLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FcTodoList } from "react-icons/fc";
import taskApi from "../../infrastructure/api/taskApi";
import projectApi from "../../infrastructure/api/projectApi";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

ChartJS.register(ArcElement, Tooltip, Legend);

function HomePage() {
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const { user } = auth;
  const profile = useSelector((state) => state.profile);
  const { profileData } = profile;

  useEffect(() => {
    const stripePaymentLink = localStorage.getItem("stripePaymentLink");
    if (stripePaymentLink && user !== null && profileData?.plan === "free") {
      const fullLink = `${stripePaymentLink}?prefilled_email=${user.email}`;
      localStorage.removeItem("stripePaymentLink");
      // navigate(`${stripePaymentLink}?prefilled_email=${user.email}`);
      window.open(fullLink, "_blank");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksResponse, projectsResponse] = await Promise.all([
          taskApi.getAllTasks(),
          projectApi.getAllProjects(),
        ]);

        setAssignedTasks(tasksResponse.data.tasksAssignedToUser);
        setProjects(projectsResponse.data.projects);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const filterAssignedTasksByState = (state) =>
    assignedTasks.filter((task) => task.state === state);
  const filterAssignedTasksByPriority = (priority) =>
    assignedTasks.filter((task) => task.priority === priority);

  const taskStates = [
    "backlog",
    "planned",
    "in-progress",
    "paused",
    "completed",
    "cancelled",
  ];
  const taskCounts = taskStates.map(
    (state) => filterAssignedTasksByState(state).length
  );
  const Taskcolors = [
    "#B0BEC5",
    "#42A5F5",
    "#FFA726",
    "#FFEB3B",
    "#66BB6A",
    "#EF5350",
  ];

  const StateData = {
    labels: taskStates,
    datasets: [
      {
        label: "Tasks",
        data: taskCounts,
        backgroundColor: Taskcolors,
        borderColor: "#1E1E1E",
        borderWidth: 1,
      },
    ],
  };

  const taskPriorities = ["urgent", "high", "medium", "low", "none"];
  const taskPriorityCounts = taskPriorities.map(
    (priority) => filterAssignedTasksByPriority(priority).length
  );
  const priorityColors = [
    "#E53935",
    "#FB8C00",
    "#FDD835",
    "#42A5F5",
    "#BDBDBD",
  ];

  const PriorityData = {
    labels: taskPriorities,
    datasets: [
      {
        label: "Tasks",
        data: taskPriorityCounts,
        backgroundColor: priorityColors,
        borderColor: "#1E1E1E",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: { enabled: true },
    },
  };

  return (
    <>
      <div className="flex gap-2 p-2 justify-around ">
        <Card className="hover:border-blue-800 ">
          <CardHeader className="flex flex-row justify-between gap-8">
            <p>Total Tasks</p>
            <FcTodoList />
          </CardHeader>
          <CardContent>{assignedTasks.length}</CardContent>
        </Card>
        <Card className="hover:border-blue-800">
          <CardHeader className="flex flex-row justify-between gap-8">
            <p>Tasks Assigned</p>
            <FcTodoList />
          </CardHeader>
          <CardContent>{assignedTasks.length}</CardContent>
        </Card>
        <Card className="hover:border-blue-800">
          <CardHeader className="flex flex-row justify-between gap-8">
            <p>Tasks Completed</p>
            <FcTodoList />
          </CardHeader>
          <CardContent>
            {filterAssignedTasksByState("completed").length}
          </CardContent>
        </Card>
        <Card className="hover:border-blue-800">
          <CardHeader className="flex flex-row justify-between gap-8">
            <p>Total Projects</p>
            <FcTodoList />
          </CardHeader>
          <CardContent>{projects.length}</CardContent>
        </Card>
      </div>

      {assignedTasks.length > 0 && (
        <div className="flex justify-start p-4 gap-4">
          <Card className="sm:w-1/2 max-w-1/2 hover:border-blue-800">
            <CardHeader className="flex flex-row justify-between gap-8">
              <p>Tasks Overview By State</p>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Doughnut data={StateData} options={options} />
            </CardContent>
          </Card>
          <Card className="sm:w-1/2 max-w-1/2 hover:border-blue-800">
            <CardHeader className="flex flex-row justify-between gap-8">
              <p>Tasks Overview By Priority</p>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Doughnut data={PriorityData} options={options} />
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

export default HomePage;

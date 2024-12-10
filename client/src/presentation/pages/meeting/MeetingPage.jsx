import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

import { Badge } from "@/components/ui/badge";
import { MoreVertical } from "lucide-react";
import { CalendarDaysIcon } from "lucide-react";
import ConfirmationPopover from "@/components/ui/conformationPopover";
import meetingApi from "../../../infrastructure/api/meetingApi";
import projectApi from "../../../infrastructure/api/projectApi";
import { Video } from "lucide-react";
import MeetingScreen from "./MeetingScreen";

// Zod schema for form validation
const meetingSchema = z.object({
  name: z.string().min(1, "Title is required"),
  subject: z.string().min(1, "link is required"),
  projectId: z.string().min(1, "link is required"),
});

const MeetingPage = () => {
  const { projectId } = useParams();

  const [isMeetingFormOpen, setIsMeetingFormOpen] = useState(false);
  const [meetings, setMeetings] = useState([]);
  const [currentMeeting, setCurrentMeeting] = useState(null);
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  const handleOpenPopover = () => setPopoverOpen(true);
  const handleClosePopover = () => setPopoverOpen(false);
  const [projects, setProjects] = useState([]);
  const [selectedProjectName, setSelectedProjectName] = useState(null);

  const [roomId, setRoomId] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectApi.getAllProjects();
        const data = response.data.projects;
        if (response.status === 200) {
          setProjects(data);
        } else {
          toast.error("Failed to fetch projects.");
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();

    async function getMeetings() {
      const allProjectsResponse = await projectApi.getAllProjects({
        allProjects: true,
      });
      let projects = allProjectsResponse.data.projects;
      let projectIds = projects.map((pro) => pro._id);

      const response = await meetingApi.getAllMeetings({ projectIds });

      setMeetings(response.data.meetings);
    }
    getMeetings();
  }, []);

  console.log(projects);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(meetingSchema),
  });

  const handleAddMeeting = async (data) => {
    try {
      const response = await meetingApi.createMeeting(data);
      setMeetings([...meetings, response.data.meeting]);
      toast.success("Meeting created successfully!");
      setIsMeetingFormOpen(false);
      reset();
    } catch (error) {
      toast.error("Failed to create meeting");
    }
  };

  const handleEditMeeting = async (meeting) => {
    const response = await meetingApi.getMeeting(meeting._id);
    await setCurrentMeeting(response.data.meeting[0]);
    setOpenEditForm(true);
  };

  const handleDeleteMeeting = async (meeting) => {
    setCurrentMeeting(meeting);
    handleOpenPopover();
  };
  const handleConfirm = async () => {
    try {
      const response = await meetingApi.deleteMeeting(currentMeeting._id);
      if (response.status === 200) {
        setMeetings((prevMeetings) =>
          prevMeetings.filter((meeting) => meeting._id !== currentMeeting._id)
        ); // Remove the deleted meeting from the list
        toast.success("Meeting deleted successfully");
      } else {
        toast.error("Failed to delete meeting");
      }
    } catch (error) {
      toast.error("Failed to delete meeting");
    } finally {
      setCurrentMeeting(null);
      handleClosePopover();
    }
  };

  const handleCancelDelete = () => {
    setCurrentMeeting(null);
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
      {/* Add meeting Button */}
      <div className="flex justify-end pb-2 ">
        <Button onClick={() => setIsMeetingFormOpen(true)}>Add Meeting</Button>
      </div>
      <div className="flex flex-col gap-2">
        {meetings.map((meeting) => (
          <Card
            key={meeting.id}
            className="shadow-md dark:bg-gray-800 p-4 flex flex-col md:flex-row justify-between items-center"
          >
            <div className="flex items-center space-x-4">
              <div
                className="radial-progress text-blue-500"
                style={{ "--value": meeting.progress, "--size": "3rem" }}
              >
                <Video />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {meeting.name}
                </h2>
              </div>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              

              <Button onClick={() => setRoomId(meeting.roomId)}>
                Join now
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant="ghost">
                    <MoreVertical className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {/* <DropdownMenuItem onClick={() => handleEditMeeting(meeting)}>
                    Edit
                  </DropdownMenuItem> */}
                  <DropdownMenuItem
                    onClick={() => handleDeleteMeeting(meeting)}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Card>
        ))}

        <ConfirmationPopover
          isOpen={isPopoverOpen}
          title="Delete Meeting"
          description="Are you sure you want to proceed with this action?"
          onCancel={handleCancelDelete}
          onConfirm={handleConfirm}
        />
      </div>
      {isMeetingFormOpen && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Card className="p-6 w-full max-w-xl bg-background shadow-lg">
            <h2 className="text-xl font-bold mb-4">Add Meeting</h2>
            <form onSubmit={handleSubmit(handleAddMeeting)}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Title</Label>
                  <Input
                    id="name"
                    placeholder="Meeting title"
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-red-500">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="subject">Meeting subject</Label>
                  <Input
                    id="subject"
                    placeholder="enter meeting subject here"
                    {...register("subject")}
                  />
                  {errors.subject && (
                    <p className="text-red-500">{errors.subject.message}</p>
                  )}
                </div>

                <div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        {selectedProjectName || "Project"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {projects.map((project) => (
                        <DropdownMenuItem
                          key={project._id}
                          onClick={() => {
                            setValue("projectId", project._id);
                            setSelectedProjectName(project.name);
                          }}
                        >
                          {project.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {errors.projectId && (
                    <p className="text-red-500">{errors.projectId.message}</p>
                  )}
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button
                  variant="ghost"
                  className="mr-2"
                  type="button"
                  onClick={() => {
                    setIsMeetingFormOpen(false);
                    reset();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Add Meeting</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {roomId && <MeetingScreen setRoomId={setRoomId} roomId={roomId} />}

      <Toaster />
    </div>
  );
};

export default MeetingPage;

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Toaster, toast } from "sonner";
import { useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { MoreVertical } from "lucide-react";
import ConfirmationPopover from "@/components/ui/conformationPopover";
import meetingApi from "../../../infrastructure/api/meetingApi";
import projectApi from "../../../infrastructure/api/projectApi";
import { Video } from "lucide-react";
import MeetingScreen from "./MeetingScreen";
import PricingPopover from "@/components/ui/pricingPopover";
import moment from "moment/moment";
import PaginationFooter from "@/components/pagination";

// Zod schema for form validation
const meetingSchema = z.object({
  name: z.string().min(1, "Title is required"),
  subject: z.string().min(1, "Subject is required"),
  projectId: z.string().min(1, "Project is required"),
  startTime: z.string().refine((val) => !!val, "Start time is required"),
  endTime: z.string().refine((val) => !!val, "End time is required")
}).superRefine((data, ctx) => {
  const start = new Date(data.startTime);
  const end = new Date(data.endTime);
  if (end <= start) {
    ctx.addIssue({
      path: ["endTime"],
      code: z.ZodIssueCode.custom,
      message: "End time must be after start time",
    });
  }
});




const MeetingPage = () => {

  const { projectId } = useParams();
  const now = new Date();
  const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
  const [isMeetingFormOpen, setIsMeetingFormOpen] = useState(false);
  const [meetings, setMeetings] = useState([]);
  const [currentMeeting, setCurrentMeeting] = useState(null);
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  const handleOpenPopover = () => setPopoverOpen(true);
  const handleClosePopover = () => setPopoverOpen(false);
  const [projects, setProjects] = useState([]);
  const [selectedProjectName, setSelectedProjectName] = useState(null);
  const [isPaymentPopup, setIsPaymentPopup] = useState(false)
  const [pageNumber, setPageNumber] = useState(1)
  const [totalPages,setTotalPages] = useState(null)
  const [roomId, setRoomId] = useState(null);
console.log(pageNumber,totalPages)
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
      const response = await meetingApi.getAllMeetings(pageNumber,10);
      setTotalPages(response.data.totalPages)
      setMeetings(response.data.meetings);
      console.log(response.data.meetings);
    }
    getMeetings();
  }, [pageNumber]);
  

    // Pagination handlers
    const handleNextPage = () => {
      if (pageNumber < totalPages) {
        setPageNumber(prev => prev + 1);
      }
    };
  
    const handlePrevPage = () => {
      if (pageNumber > 1) {
        setPageNumber(prev => prev - 1);
      }
    };

  // initial value for the form 
  const initialValue = {
    
    startTime: getFormattedDates(now),
    endTime: getFormattedDates(oneHourLater)
  };
  

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(meetingSchema),
    defaultValues:initialValue
  });

  const handleAddMeeting = async (data) => {
    try {
      const response = await meetingApi.createMeeting(data);
      setMeetings([...meetings, response.data.meeting]);
      toast.success("Meeting created successfully!");
      setIsMeetingFormOpen(false);
      reset();
    } catch (error) {
      if(error.response.status == 402){
        setIsPaymentPopup(true)
      }else{
        toast.error("Failed to create meeting");
      }
     
   
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

  const handleCloseMeeting = () => {
    setRoomId(null)
  };


  return (
    <div className="min-h-screen p-4 max-w-screen relative ">
      {/* Add meeting Button */}
      <div className="flex justify-end pb-2 ">
        <Button onClick={() => setIsMeetingFormOpen(true)}>Add Meeting</Button>
      </div>
      <div className="flex flex-col gap-2">
        {meetings.map((meeting) => {
          // Parse the endTime to a Date object
          const meetingStartTime = new Date(meeting.startTime);
          const meetingEndTime = new Date(meeting.endTime);
          // Compare meeting end time with current time
          const beforMeetingStart = meetingStartTime > now
          const afterMeetingEnd = meetingEndTime  < now
          const canJoinMeeting = meetingEndTime > now && now > meetingStartTime;
          return (
          
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
                  <p className="text-muted-foreground">{meeting.subject}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
              
              {canJoinMeeting && (
          <Button onClick={() => setRoomId(meeting.roomId)}>
            Join now
          </Button>
                )}
                
                {afterMeetingEnd && (<Badge variant="destructive"> meeting ended {moment(meeting.endTime).fromNow() }</Badge>)}
                {beforMeetingStart && (<Badge variant="secondary"> meeting will start {moment(meeting.startTime).fromNow() }</Badge>)}

                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button variant="ghost">
                      <MoreVertical className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => handleDeleteMeeting(meeting)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Card>
          )
        })}

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
                <div>
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input type="datetime-local"   id="startTime" {...register("startTime")} />
                  {errors.startTime && <p className="text-red-500">{errors.startTime.message}</p>}
                </div>

                <div>
                  <Label htmlFor="endTime">End Time</Label>
                  <Input type="datetime-local"  id="endTime" {...register("endTime")} />
                  {errors.endTime && <p className="text-red-500">{errors.endTime.message}</p>}
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
      {isPaymentPopup && <PricingPopover closepopup={setIsPaymentPopup}/>
      }

      {roomId && <MeetingScreen setRoomId={setRoomId} roomId={roomId} onClose={handleCloseMeeting} />}
      <PaginationFooter
        handleNext={handleNextPage}
        handlePrev={handlePrevPage}
        page={pageNumber}
        totalPages={totalPages}
      />
     
    </div>
  );
};

export default MeetingPage;


function getFormattedDates(date) {

return date.toISOString().slice(0, 16);

}

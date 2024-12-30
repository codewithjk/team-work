import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import projectApi from "../../infrastructure/api/projectApi";
import { toast, Toaster } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ConfirmationPopover from "@/components/ui/conformationPopover";
import ImageSelectorPopover from "@/components/ui/image-selector-popover";
import AddMemberPopover from "@/components/ui/addMemberPopover";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDispatch } from "react-redux";
import { setProjcetAction } from "../../application/actions/projectAction";

// Zod schema for form validation
const projectSchema = z.object({
  name: z.string().min(1, { message: "Project name is required" }),
  description: z
    .string()
    .min(5, { message: "Description must be at least 5 characters" }),
  coverImage: z
    .string()
    .url({ message: "Cover photo URL is required" })
    .optional(),
});

function ProjectSettingsPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [coverImage, setCoverPhoto] = useState("");
  const [activeSection, setActiveSection] = useState("general");
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const dispatch = useDispatch()

  // Initialize form with react-hook-form
  const form = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
      coverImage: "",
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = form;

  useEffect(() => {
    async function fetchProject(id) {
      const response = await projectApi.getProject(id);
      if (response.status === 200) {
        const fetchedProject = response.data.project;
        setProject(fetchedProject);
        reset({
          name: fetchedProject.name || "",
          description: fetchedProject.description || "",
          coverImage: fetchedProject.coverImage || "",
        });
        setCoverPhoto(fetchedProject.coverImage || "");
      }
    }
    fetchProject(projectId);
    async function getMembers() {
      const response = await projectApi.getMembers(projectId);
      setMembers(response.data.members);
    }
    getMembers();
  }, [projectId, reset]);

  const handleOpenPopover = () => setPopoverOpen(true);
  const handleClosePopover = () => setPopoverOpen(false);
  const handleConfirm = () => {
    handleDeleteProject();
    handleClosePopover();
  };

  const handleDeleteProject = async () => {
    const response = await projectApi.deleteProject(projectId);
    if (response.status === 200) {
      dispatch(setProjcetAction())
      toast.success("Project deleted successfully");
      navigate("/projects");
    } else {
      toast.error("Failed to delete project");
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      const response = await projectApi.updateProject(projectId, data);
      if (response.status === 200) {
        dispatch(setProjcetAction())
        toast.success("Project updated successfully!");
        const fetchedProject = response.data.project;
        setProject(fetchedProject);
        reset({
          name: fetchedProject.name || "",
          description: fetchedProject.description || "",
          coverImage: fetchedProject.coverImage || "",
        });
        setCoverPhoto(fetchedProject.coverImage || "");
      } else {
        toast.error("Failed to update project.");
      }
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project.");
    }
  };

  const handleImageSelect = (imageUrl) => {
    setCoverPhoto(imageUrl);
    setValue("coverImage", imageUrl); // Update cover photo field in the form
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="min-h-screen p-4 max-w-screen flex">
      {/* Sidebar Navigation */}
      <div className="w-1/4 p-4">
        <nav className="space-y-2">
          <a
            onClick={() => handleSectionChange("general")}
            className={`block py-2 px-4 rounded ${
              activeSection === "general"
                ? "bg-gray-800 text-white"
                : "text-gray-400 hover:bg-gray-800"
            }`}
          >
            General
          </a>
          <a
            onClick={() => handleSectionChange("members")}
            className={`block py-2 px-4 rounded ${
              activeSection === "members"
                ? "bg-gray-800 text-white"
                : "text-gray-400 hover:bg-gray-800"
            }`}
          >
            Members
          </a>
          {/* Add other sections */}
        </nav>
      </div>

      {/* Main Content */}
      <div className="w-3/4 p-8">
        {activeSection === "general" && (
          <div className="flex items-center justify-center bg-background ">
            <Form {...form}>
              <form
                onSubmit={handleSubmit(handleFormSubmit)}
                className="w-full space-y-4"
              >
                <div>
                  <h3 className="text-lg font-medium">Update Project</h3>
                </div>
                <div className="relative h-48 bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={coverImage || "default-cover.jpg"}
                    alt="Cover"
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute bottom-0 right-1 flex justify-center items-center bg-opacity-25">
                    <ImageSelectorPopover onSelectImage={handleImageSelect} />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Project Name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Project Description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-4">
                  <Button  type="submit">
                    Update Project
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}

        {activeSection === "members" && (
          <div className="space-y-4 relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Project Members</h3>
              <Button onClick={handleOpenPopover}>Add member</Button>
            </div>
            <div>
              <Table>
              
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Member</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Email</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => (
                    <TableRow>
                      <TableCell className="font-medium flex gap-2 items-center flex-grow">
                        <Avatar className="cursor-pointer overflow-hidden">
                          <AvatarImage
                            src={member.user.avatar}
                            className="object-cover w-full h-full"
                          />
                          <AvatarFallback className=" font-extrabold text-2xl">
                            {member.user.name[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {member.user.name}
                      </TableCell>
                      <TableCell>{member.status}</TableCell>
                      <TableCell>{member.role}</TableCell>
                      <TableCell className="text-right">
                        {member.user.email}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Actions */}
        {activeSection === "general" && (
          <div className="mt-12 space-y-4">
            <Button variant="destructive" onClick={handleOpenPopover}>
              Delete project
            </Button>
            <ConfirmationPopover
              isOpen={isPopoverOpen}
              title="Delete project"
              description="Are you sure you want to proceed with this action?"
              onCancel={handleClosePopover}
              onConfirm={handleConfirm}
            />
          </div>
        )}
      </div>

      {/* {isPopoverOpen && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-100 p-4 rounded-lg shadow-md w-80">
            <h4 className="text-md font-medium">Add New Member</h4>
            <form className="space-y-4">
              <Input placeholder="Enter email address" />
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClosePopover}
                >
                  Cancel
                </Button>
                <Button type="button" variant="primary">
                  Add Member
                </Button>
              </div>
            </form>
          </div>
        </div>
      )} */}
      <AddMemberPopover isOpen={isPopoverOpen} onClose={handleClosePopover} />
    </div>
  );
}

export default ProjectSettingsPage;

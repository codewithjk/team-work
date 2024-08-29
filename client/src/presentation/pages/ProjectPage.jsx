import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Toaster, toast } from "sonner";
import ImageSelectorPopover from "@/components/ui/image-selector-popover";
import projectApi from "../../infrastructure/api/projectApi";
import { SettingsIcon } from "lucide-react";
import { Link } from "react-router-dom";

// Zod schema for form validation
const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  coverImage: z.string().url("Cover photo URL is required"),
});

function ProjectPage() {
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [coverImage, setCoverPhoto] = useState("");
  const [projects, setProjects] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(projectSchema),
  });

  useEffect(() => {
    // Fetch the list of projects initially
    const fetchProjects = async () => {
      try {
        const response = await projectApi.getAllProjects();
        const data = response.data.projects;
        console.log(data);
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
  }, []);

  const handleFormSubmit = async (data) => {
    try {
      // Save the project to the backend
      const response = await projectApi.createProject(data);
      console.log(response);

      if (response.status === 200) {
        const newProject = await response.data;
        console.log("new proect : ", newProject);

        // Update the project list
        setProjects((prevProjects) => [...prevProjects, newProject]);
        toast.success("Project added successfully!");
        setIsProjectFormOpen(false);
        reset(); // Reset the form after submission
      } else {
        toast.error("Failed to add project.");
      }
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error("Failed to add project.");
    }
  };

  const handleImageSelect = (imageUrl) => {
    setCoverPhoto(imageUrl);
    setValue("coverImage", imageUrl); // Update cover photo field in the form
  };

  return (
    <div className="min-h-screen p-4 max-w-screen">
      {/* Add Project Button */}
      <div className="flex justify-end ">
        <Button onClick={() => setIsProjectFormOpen(true)}>Add Project</Button>
      </div>

      {/* Project List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {projects.map((project) => (
          <Card key={project._id}>
            <CardHeader>
              <img
                src={project.coverImage || "default-cover.jpg"}
                alt="Cover"
                className="object-cover w-full h-32 rounded-t-lg"
              />
              <h3 className="text-lg font-medium mt-2">{project.name}</h3>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between">
                <p>{project.description}</p>
                <Link to={`/projects/${project._id}/settings`}>
                  <SettingsIcon />
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {isProjectFormOpen && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Card className="w-[90%] max-w-md mx-auto p-4 bg-background">
            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <CardHeader>
                <h3 className="text-lg font-medium">Add New Project</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cover Photo Input */}
                <div className="relative h-48 bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={coverImage || "default-cover.jpg"}
                    alt="Cover"
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute bottom-0 right-1 flex justify-center items-center  bg-opacity-25">
                    <ImageSelectorPopover onSelectImage={handleImageSelect} />
                  </div>
                </div>
                {errors.coverImage && (
                  <p className="text-red-500">{errors.coverImage.message}</p>
                )}

                {/* Project Name Input */}
                <Input
                  type="text"
                  placeholder="Project Name"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-red-500">{errors.name.message}</p>
                )}

                {/* Description Input */}
                <Textarea
                  placeholder="Project Description"
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-red-500">{errors.description.message}</p>
                )}
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button
                  variant="secondary"
                  onClick={() => setIsProjectFormOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Add Project</Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      )}

      <Toaster />
    </div>
  );
}

export default ProjectPage;
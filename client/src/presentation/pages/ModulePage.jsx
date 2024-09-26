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
import projectApi from "../../infrastructure/api/projectApi";
import moduleApi from "../../infrastructure/api/moduleApi";
import { Badge } from "@/components/ui/badge";
import { MoreVertical } from "lucide-react";
import { CalendarDaysIcon } from "lucide-react";
import ModuleForm from "@/components/ui/ModuleForm";
import ConfirmationPopover from "@/components/ui/conformationPopover";

// Zod schema for form validation
const moduleSchema = z.object({
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

const ModulePage = () => {
  const { projectId } = useParams();
  const [members, setMembers] = useState([]);
  const [isModuleFormOpen, setIsModuleFormOpen] = useState(false);
  const [modules, setModules] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);

  const [selectedMemberNames, setSelectedMemberNames] = useState([]);
  const [selectedLeadName, setSelectedLeadName] = useState(null);

  const [openEditForm, setOpenEditForm] = useState(false);
  const [currentModule, setCurrentModule] = useState(null);
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  const handleOpenPopover = () => setPopoverOpen(true);
  const handleClosePopover = () => setPopoverOpen(false);

  useEffect(() => {
    async function getMembers() {
      const response = await projectApi.getMembers(projectId);
      setMembers(response.data.members);
    }
    getMembers();
    async function getModules() {
      const response = await moduleApi.getAllModules(projectId);
      console.log(response);
      setModules(response.data.modules);
    }
    getModules();
  }, [projectId]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(moduleSchema),
  });

  const handleAddModule = async (data) => {
    try {
      const response = await moduleApi.createModule(projectId, data);
      setModules([...modules, response.data.module]);
      toast.success("Module created successfully!");
      setIsModuleFormOpen(false);
      reset();
      setSelectedMemberNames([]);
      setSelectedLeadName(null);
    } catch (error) {
      toast.error("Failed to create module");
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

  const handleMemberChange = (memberId, memberName) => {
    const currentMembers = watch("members") || [];
    const currentNames = [...selectedMemberNames];

    if (currentMembers.includes(memberId)) {
      setValue(
        "members",
        currentMembers.filter((m) => m !== memberId)
      );
      setSelectedMemberNames(
        currentNames.filter((name) => name !== memberName)
      );
    } else {
      setValue("members", [...currentMembers, memberId]);
      setSelectedMemberNames([...currentNames, memberName]);
    }
  };
  const submitEditForm = async (data) => {
    try {
      const response = await moduleApi.updateModule(currentModule._id, data);
      if (response.status === 200) {
        setModules((prevModules) =>
          prevModules.map((mod) =>
            mod._id === currentModule._id ? response.data.module : mod
          )
        ); // Replace the old module with the updated one
        toast.success("Module updated successfully!");
      }
    } catch (error) {
      toast.error("Failed to update module");
    } finally {
      setCurrentModule(null);
      setOpenEditForm(false);
    }
  };

  const handleEditModule = async (module) => {
    const response = await moduleApi.getModule(module._id);
    await setCurrentModule(response.data.module[0]);
    setOpenEditForm(true);
  };

  const handleDeleteModule = async (module) => {
    setCurrentModule(module);
    handleOpenPopover();
  };
  const handleConfirm = async () => {
    try {
      const response = await moduleApi.deleteModule(currentModule._id);
      if (response.status === 200) {
        setModules((prevModules) =>
          prevModules.filter((mod) => mod._id !== currentModule._id)
        ); // Remove the deleted module from the list
        toast.success("Module deleted successfully");
      } else {
        toast.error("Failed to delete module");
      }
    } catch (error) {
      toast.error("Failed to delete module");
    } finally {
      setCurrentModule(null);
      handleClosePopover();
    }
  };

  const handleCancelDelete = () => {
    setCurrentModule(null);
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
      {/* Add module Button */}
      <div className="flex justify-end pb-2 ">
        <Button onClick={() => setIsModuleFormOpen(true)}>Add Module</Button>
      </div>
      <div className="flex flex-col gap-2">
        {modules.map((module) => (
          <Card
            key={module.id}
            className="shadow-md dark:bg-gray-800 p-4 flex flex-col md:flex-row justify-between items-center"
          >
            <div className="flex items-center space-x-4">
              <div
                className="radial-progress text-blue-500"
                style={{ "--value": module.progress, "--size": "3rem" }}
              >
                {module.progress}%
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {module.name}
                </h2>
              </div>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <CalendarDaysIcon className="w-4 h-4 mr-1" />
                {formatDate(module.startDate)} - {formatDate(module.endDate)}
              </p>
              <Badge className="px-2 py-1 bg-background text-foreground border border-foreground-500">
                {module.status}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant="ghost">
                    <MoreVertical className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleEditModule(module)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDeleteModule(module)}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Card>
        ))}

        <ConfirmationPopover
          isOpen={isPopoverOpen}
          title="Delete Module"
          description="Are you sure you want to proceed with this action?"
          onCancel={handleCancelDelete}
          onConfirm={handleConfirm}
        />
      </div>
      {isModuleFormOpen && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Card className="p-6 w-full max-w-xl bg-background shadow-lg">
            <h2 className="text-xl font-bold mb-4">Add Module</h2>
            <form onSubmit={handleSubmit(handleAddModule)}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Title</Label>
                  <Input
                    id="name"
                    placeholder="Module title"
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-red-500">{errors.name.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Module description"
                    {...register("description")}
                  />
                  {errors.description && (
                    <p className="text-red-500">{errors.description.message}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        {watch("startDate") || "Start date"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DateRangePicker
                        selected={dateRange}
                        onSelect={handleDateRange}
                      />
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        {watch("status") || "Status"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {[
                        "backlog",
                        "planned",
                        "in-progress",
                        "paused",
                        "completed",
                        "cancelled",
                      ].map((status) => (
                        <DropdownMenuItem
                          key={status}
                          onClick={() => setValue("status", status)}
                        >
                          {status}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        {selectedLeadName || "Lead"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {members.map((member) => (
                        <DropdownMenuItem
                          key={member._id}
                          onClick={() => {
                            setValue("lead", member._id);
                            setSelectedLeadName(member.user.name);
                          }}
                        >
                          {member.user.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        {selectedMemberNames.length > 0
                          ? selectedMemberNames.join(", ")
                          : "Select Members"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {members.map((member) => (
                        <DropdownMenuItem
                          key={member._id}
                          onClick={() =>
                            handleMemberChange(member._id, member.user.name)
                          }
                        >
                          {member.user.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button
                  variant="ghost"
                  className="mr-2"
                  type="button"
                  onClick={() => {
                    setIsModuleFormOpen(false);
                    reset();
                    setSelectedMemberNames([]);
                    setSelectedLeadName(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Add Module</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {openEditForm && (
        <ModuleForm
          module={currentModule}
          setIsOpen={setOpenEditForm}
          members={members}
          onSubmit={submitEditForm}
        />
      )}

      <Toaster />
    </div>
  );
};

export default ModulePage;

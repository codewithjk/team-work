import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "./card";
import { Label } from "./label";
import { Input } from "./input";
import { Textarea } from "./textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import DateRangePicker from "../date-range-picker/DateRangePicker";
import { useState } from "react";
import { useEffect } from "react";
import DragDrop from "../file-uploader/DragDrop";

// Zod schema
const taskSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  state: z.string(
    ["backlog", "planned", "in-progress", "paused", "completed", "cancelled"],
    { required_error: "State is required" }
  ).refine(val => ["backlog", "planned", "in-progress", "paused", "completed", "cancelled"].includes(val), {
    message: "Please choose a valid state."
  }),
  priority: z.string(["urgent", "high", "medium", "low", "none"], {
    required_error: "Priority is required",
  }).refine(val => ["urgent", "high", "medium", "low", "none"].includes(val), {
    message: "Please select a valid priority."
  }),
  assignees: z.array(z.string()).min(1, "At least one assignee is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  module: z.string().min(1, "Module is required"),
});

export default function TaskForm({
  setIsOpen,
  submitHandler,
  members,
  modules,
  onClose,
  initialData,
  files,
  setFiles,
  title = "Create Task"
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      assignees: initialData?.assignees?.map((assignee) => assignee._id) || [],
      state: initialData?.state || "",
      priority: initialData?.priority || "",
      module: initialData?.module?._id || "",
      startDate: initialData?.startDate || "",
      endDate: initialData?.endDate || "",
    },
  });


  const handleDateRange = (range) => {
    const startDate = range?.from
      ? new Date(range.from).toISOString().split("T")[0]
      : null;
    const endDate = range?.to
      ? new Date(range.to).toISOString().split("T")[0]
      : null;

    setValue("startDate", startDate);
    setValue("endDate", endDate);

    // setDateRange(range);
  };

  const [selectedMemberNames, setSelectedMemberNames] = useState(
    initialData?.assignees?.map((a) => a.name) || []
  );
  const [selectedModuleName, setSelectedModuleName] = useState(
    initialData?.module?.name || ""
  );

  const handleMemberChange = (memberId, memberName) => {
    const selectedMembers = watch("assignees");
    if (selectedMembers.includes(memberId)) {
      setSelectedMemberNames((prev) =>
        prev.filter((name) => name !== memberName)
      );
      setValue(
        "assignees",
        selectedMembers.filter((id) => id !== memberId)
      );
    } else {
      setSelectedMemberNames((prev) => [...prev, memberName]);
      setValue("assignees", [...selectedMembers, memberId]);
    }
  };
  const handleModuleChange = (moduelId, moduleName) => {
    setValue("module", moduelId);
    setSelectedModuleName(moduleName);
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ">
      <Card className="p-6 w-full max-w-fit bg-background shadow-lg">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <form onSubmit={handleSubmit(submitHandler)}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Task name" {...register("name")} />
              {errors.name && (
                <p className="text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Task description"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-red-500">{errors.description.message}</p>
              )}
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[150px]">
                <Select onValueChange={(value) => setValue("state", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={watch("state") || "state"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="backlog">Backlog</SelectItem>
                    <SelectItem value="planned">Planned</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                {errors.state && (
                  <p className="text-red-500">{errors.state.message}</p>
                )}
              </div>

              <div className="flex-1 min-w-[150px]">
                <Select onValueChange={(value) => setValue("priority", value)}>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={watch("priority") || "priority"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
                {errors.priority && (
                  <p className="text-red-500">{errors.priority.message}</p>
                )}
              </div>

              <div className="flex-1 min-w-[150px]">
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
                {errors.assignees && (
                  <p className="text-red-500">{errors.assignees.message}</p>
                )}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    {watch("startDate")
                      ? new Date(watch("startDate")).toLocaleDateString()
                      : "Start date"}
                    -
                    {watch("endDate")
                      ? new Date(watch("endDate")).toLocaleDateString()
                      : "end date"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DateRangePicker
                    selected={{
                      startDate: watch("startDate"),
                      endDate: watch("endDate"),
                    }}
                    onSelect={handleDateRange}
                  />
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="flex-1 min-w-[150px]">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      {selectedModuleName.length > 0
                        ? selectedModuleName
                        : "Module"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {modules.map((module) => (
                      <DropdownMenuItem
                        key={module._id}
                        onClick={() =>
                          handleModuleChange(module._id, module.name)
                        }
                      >
                        {module.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                {errors.module && (
                  <p className="text-red-500">{errors.module.message}</p>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <DragDrop files={files} setFiles={setFiles} />
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button
              variant="ghost"
              className="mr-2"
              type="button"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit">{title}</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}




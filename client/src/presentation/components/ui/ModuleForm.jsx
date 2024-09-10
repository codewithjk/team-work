import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Card } from "./card";
import { Label } from "./label";
import { Input } from "./input";
import { Textarea } from "./textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Button } from "./button";
import DateRangePicker from "@/components/date-range-picker/DateRangePicker";

function ModuleForm({ module, setIsOpen, onSubmit, members }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
    reset,
  } = useForm({
    defaultValues: {
      name: module?.name || "",
      description: module?.description || "",
      startDate: module?.startDate || "",
      endDate: module?.endDate || "",
      status: module?.status || "",
      lead: module?.lead?._id || "",
      members: module?.members?.map((member) => member._id) || [],
    },
  });

  const [selectedLeadName, setSelectedLeadName] = useState(
    module?.lead?.name || ""
  );
  const [selectedMemberNames, setSelectedMemberNames] = useState(
    module?.members?.map((m) => m.name) || []
  );

  useEffect(() => {
    if (module) {
      setSelectedLeadName(module?.lead?.name || "");
      setSelectedMemberNames(module?.members?.map((m) => m.name) || []);
    }
  }, [module]);

  const handleDateRange = (dateRange) => {
    setValue("startDate", dateRange.startDate);
    setValue("endDate", dateRange.endDate);
  };

  const handleMemberChange = (memberId, memberName) => {
    const selectedMembers = watch("members");
    if (selectedMembers.includes(memberId)) {
      setSelectedMemberNames((prev) =>
        prev.filter((name) => name !== memberName)
      );
      setValue(
        "members",
        selectedMembers.filter((id) => id !== memberId)
      );
    } else {
      setSelectedMemberNames((prev) => [...prev, memberName]);
      setValue("members", [...selectedMembers, memberId]);
    }
  };

  const handleFormSubmit = (data) => {
    onSubmit(data);
    reset();
    setIsOpen(false);
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <Card className="p-6 w-full max-w-xl bg-background shadow-lg">
        <h2 className="text-xl font-bold mb-4">
          {module ? "Edit Module" : "Add Module"}
        </h2>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Title</Label>
              <Input
                id="name"
                placeholder="Module title"
                {...register("name", { required: "Title is required" })}
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
                {...register("description", {
                  required: "Description is required",
                })}
              />
              {errors.description && (
                <p className="text-red-500">{errors.description.message}</p>
              )}
            </div>
            <div className="flex gap-2">
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
                setIsOpen(false);
                reset();
                setSelectedMemberNames([]);
                setSelectedLeadName(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!isDirty}>
              {module ? "Update" : "Add"} Module
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default ModuleForm;

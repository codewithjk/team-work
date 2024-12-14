import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useParams } from "react-router-dom";
import projectApi from "../../../infrastructure/api/projectApi";

// Zod schema for validation
const addMemberSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  role: z.string().min(1, { message: "Role is required" }),
});

const roles = [
  { value: "admin", label: "Admin" },
  { value: "developer", label: "Developer" },
  { value: "tester", label: "Tester" },
  { value: "viewer", label: "Viewer" },
];

function AddMemberPopover({ isOpen, onClose }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(addMemberSchema),
  });
  const { projectId } = useParams("projectId");
  const selectedRole = watch("role");

  const handleAddMember = async (data) => {
    try {
      const response = await projectApi.addMember(projectId, data);
      if (response.status === 200) {
        toast.success("Invitation sent successfully!");
        onClose();
      }
    } catch (error) {
      if (error.response.status == 403) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to invite member. or member already exists ");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-background border border-foreground-50 p-4 rounded-lg shadow-md w-80">
        <h4 className="text-md font-medium">Add New Member</h4>
        <form onSubmit={handleSubmit(handleAddMember)} className="space-y-4">
          <Input placeholder="Enter email address" {...register("email")} />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}

          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Role
            </label>
            <Select
              id="role"
              value={selectedRole}
              onValueChange={(value) => setValue("role", value)}
              className="w-full mt-1 border border-gray-300 rounded-md shadow-sm"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-red-500 text-sm">{errors.role.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="border border-foreground-50 hover:bg-slate-500"
            >
              Add Member
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddMemberPopover;

import {
  LucideAlertCircle,
  LucideChartNoAxesColumnIncreasing,
  LucideBan,
} from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { cn } from "@/lib/utils";

export const priorities = [
  { value: "urgent", text: "Urgent", style: "text-red-500" },
  { value: "high", text: "High", style: "text-blue-500" },
  { value: "medium", text: "Medium", style: "text-yellow-500" },
  { value: "low", text: "Low", style: "text-green-500" },
  { value: "none", text: "None", style: "text-gray-500" },
];

const PriorityButton = ({ task }) => {
  const priorityInfo = priorities.find(
    (priority) => task.priority === priority.value
  );

  const icon =
    task.priority === "urgent" ? (
      <LucideAlertCircle />
    ) : task.priority === "none" ? (
      <LucideBan />
    ) : (
      <LucideChartNoAxesColumnIncreasing />
    );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <button
            className={cn(
              "border rounded border-foreground-50 p-1 text-sm",
              priorityInfo?.style // Apply the style based on priority
            )}
          >
            {icon}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{priorityInfo?.text || "Unknown"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default PriorityButton;

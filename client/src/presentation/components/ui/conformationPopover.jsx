import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog"; // Import Shadcn components
import { Button } from "@/components/ui/button"; // Import Shadcn button

const ConfirmationPopover = ({
  isOpen,
  title,
  description,
  onCancel,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="max-w-sm w-full bg-background rounded-lg shadow-lg p-6 mx-auto">
        <DialogHeader>
          <h3 className="text-lg font-semibold">{title}</h3>
        </DialogHeader>
        <div className="mt-4">
          <p>{description}</p>
        </div>
        <DialogFooter className="mt-6 flex justify-end space-x-2">
          <Button type="button" className="bg-gray-500" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={onConfirm}>
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationPopover;

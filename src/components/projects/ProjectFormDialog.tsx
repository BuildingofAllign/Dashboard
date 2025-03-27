
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProjectForm, ProjectFormValues } from "./ProjectForm";

interface ProjectFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: ProjectFormValues;
  mode: "create" | "edit";
}

export const ProjectFormDialog = ({
  open,
  onOpenChange,
  initialData,
  mode
}: ProjectFormDialogProps) => {
  const handleSuccess = () => {
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Opret nyt projekt" : "Rediger projekt"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create" 
              ? "Udfyld detaljerne for at oprette et nyt projekt." 
              : "Opdater projektinformationen herunder."}
          </DialogDescription>
        </DialogHeader>
        <ProjectForm 
          initialData={initialData} 
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
};

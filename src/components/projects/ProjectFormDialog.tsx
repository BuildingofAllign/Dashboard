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
  initialData?: Partial<ProjectFormValues>;
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

  // Format the initial data for the form, ensuring dates are proper Date objects
  const formattedInitialData = initialData ? {
    ...initialData,
    project_id: initialData.project_id || '',
    name: initialData.name || '',
    type: initialData.type || '',
    category: initialData.category || 'bolig',
    status: initialData.status || 'aktiv',
    priority: initialData.priority || 'green',
    description: initialData.description || '',
    // Convert string dates to Date objects or keep as undefined
    start_date: initialData.start_date 
      ? (initialData.start_date instanceof Date 
          ? initialData.start_date 
          : new Date(initialData.start_date)) 
      : undefined,
    end_date: initialData.end_date 
      ? (initialData.end_date instanceof Date 
          ? initialData.end_date 
          : new Date(initialData.end_date)) 
      : undefined,
  } : undefined;

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
          initialData={formattedInitialData} 
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
};

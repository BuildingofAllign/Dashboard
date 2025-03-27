
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

  // Map database field names to form field names if needed
  const formattedInitialData = initialData ? {
    ...initialData,
    project_id: initialData.project_id || '',
    name: initialData.name || '',
    type: initialData.type || '',
    category: initialData.category || 'bolig',
    status: initialData.status || 'aktiv',
    progress: initialData.progress || 0,
    priority: initialData.priority || 'green',
    description: initialData.description || '',
    start_date: initialData.start_date || '',
    end_date: initialData.end_date || '',
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

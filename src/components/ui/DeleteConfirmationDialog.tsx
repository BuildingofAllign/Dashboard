
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface DeleteConfirmationDialogProps {
  title?: string;
  description?: string;
  onDelete: () => void;
  trigger?: React.ReactNode;
  variant?: "icon" | "button";
  size?: "sm" | "md" | "lg";
}

export const DeleteConfirmationDialog = ({
  title = "Er du sikker?",
  description = "Denne handling kan ikke fortrydes. Dette vil permanent slette dataen.",
  onDelete,
  trigger,
  variant = "icon",
  size = "sm"
}: DeleteConfirmationDialogProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6"
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger || (
          variant === "icon" ? (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className={sizeClasses[size]} />
            </Button>
          ) : (
            <Button 
              variant="destructive" 
              size="sm"
              className="gap-1"
            >
              <Trash2 className="h-4 w-4" />
              Slet
            </Button>
          )
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuller</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Slet
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};


import React from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, Copy, Trash, UserPlus, Tag, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BulkAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  action: () => void;
  variant?: "default" | "destructive" | "ghost" | "link" | "outline" | "secondary";
}

interface BulkActionsBarProps {
  selectedCount: number;
  primaryActions: BulkAction[];
  secondaryActions?: BulkAction[];
  onClearSelection: () => void;
  className?: string;
}

export const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedCount,
  primaryActions,
  secondaryActions = [],
  onClearSelection,
  className,
}) => {
  if (selectedCount === 0) return null;

  return (
    <div 
      className={cn(
        "fixed bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-background/90 backdrop-blur-sm border rounded-lg shadow-lg z-50 transition-all",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <CheckSquare className="h-4 w-4 text-primary" />
        <Badge variant="outline" className="font-semibold">
          {selectedCount} selected
        </Badge>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClearSelection}
          className="text-xs h-7"
        >
          Clear
        </Button>
      </div>

      <div className="h-8 w-px bg-border mx-1" />

      <div className="flex items-center gap-2">
        {primaryActions.map((action) => (
          <Button
            key={action.id}
            variant={action.variant || "default"}
            size="sm"
            onClick={action.action}
            className="h-8"
          >
            {action.icon}
            {action.label}
          </Button>
        ))}

        {secondaryActions.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                More actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {secondaryActions.map((action) => (
                <DropdownMenuItem 
                  key={action.id}
                  onClick={action.action}
                  className={cn(
                    "flex items-center gap-2",
                    action.variant === "destructive" && "text-destructive focus:text-destructive"
                  )}
                >
                  {action.icon}
                  {action.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

// Common bulk actions that can be used across pages
export const commonBulkActions = {
  delete: (onDelete: () => void): BulkAction => ({
    id: "delete",
    label: "Delete",
    icon: <Trash className="h-4 w-4 mr-1" />,
    action: onDelete,
    variant: "destructive"
  }),
  
  assignTo: (onAssign: () => void): BulkAction => ({
    id: "assign",
    label: "Assign to",
    icon: <UserPlus className="h-4 w-4 mr-1" />,
    action: onAssign
  }),
  
  duplicate: (onDuplicate: () => void): BulkAction => ({
    id: "duplicate",
    label: "Duplicate",
    icon: <Copy className="h-4 w-4 mr-1" />,
    action: onDuplicate
  }),
  
  tag: (onTag: () => void): BulkAction => ({
    id: "tag",
    label: "Add tag",
    icon: <Tag className="h-4 w-4 mr-1" />,
    action: onTag
  }),
  
  changeStatus: (status: string, onChangeStatus: () => void): BulkAction => ({
    id: `status-${status}`,
    label: `Mark as ${status}`,
    action: onChangeStatus
  }),
  
  changePriority: (priority: "high" | "low", onChangePriority: () => void): BulkAction => ({
    id: `priority-${priority}`,
    label: `Set ${priority} priority`,
    icon: priority === "high" ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />,
    action: onChangePriority
  })
};

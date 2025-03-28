
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Camera, MapPin, Clock, User, CheckCircle, XCircle, 
  MoreHorizontal, MessageSquare, FileText, Image
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DeviationCardProps {
  deviation: {
    id: string;
    title: string;
    description: string;
    status: string;
    date: string;
    location?: string;
    project_name?: string;
    assignee?: string;
    hasPhotos?: boolean;
    hasComments?: number;
    hasDocuments?: boolean;
  };
  onView?: (id: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

export const DeviationCard: React.FC<DeviationCardProps> = ({ 
  deviation, 
  onView,
  onApprove,
  onReject
}) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "åben":
      case "open":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "godkendt":
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "afvist":
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "afventer":
      case "pending":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  return (
    <Card className="h-full overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-4 pb-2 space-y-2">
        <div className="flex items-start justify-between">
          <h3 className="font-medium text-base">{deviation.title}</h3>
          <Badge className={cn("rounded-full", getStatusColor(deviation.status))}>
            {deviation.status}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
          {deviation.project_name && (
            <span className="font-medium text-foreground">{deviation.project_name}</span>
          )}
          
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{deviation.date}</span>
          </div>
          
          {deviation.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              <span>{deviation.location}</span>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-2">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {deviation.description}
        </p>
        
        <div className="flex items-center gap-3 mt-3 text-sm">
          {deviation.assignee && (
            <div className="flex items-center gap-1">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{deviation.assignee}</span>
            </div>
          )}
          
          <div className="flex gap-2 ml-auto">
            {deviation.hasPhotos && (
              <Badge variant="outline" className="px-2 py-0 h-5 bg-background flex items-center gap-1">
                <Image className="h-3 w-3" />
                <span className="text-xs">Fotos</span>
              </Badge>
            )}
            
            {deviation.hasComments && (
              <Badge variant="outline" className="px-2 py-0 h-5 bg-background flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                <span className="text-xs">{deviation.hasComments}</span>
              </Badge>
            )}
            
            {deviation.hasDocuments && (
              <Badge variant="outline" className="px-2 py-0 h-5 bg-background flex items-center gap-1">
                <FileText className="h-3 w-3" />
                <span className="text-xs">Docs</span>
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8"
          onClick={() => onView && onView(deviation.id)}
        >
          <span>Se detaljer</span>
        </Button>
        
        <div className="flex items-center gap-2">
          {["åben", "afventer", "open", "pending"].includes(deviation.status.toLowerCase()) && (
            <>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-green-600"
                onClick={() => onApprove && onApprove(deviation.id)}
              >
                <CheckCircle className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-red-600"
                onClick={() => onReject && onReject(deviation.id)}
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Handlinger</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Camera className="mr-2 h-4 w-4" />
                <span>Tilføj billede</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MessageSquare className="mr-2 h-4 w-4" />
                <span>Tilføj kommentar</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="mr-2 h-4 w-4" />
                <span>Vedhæft dokument</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <MapPin className="mr-2 h-4 w-4" />
                <span>Opdater lokation</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardFooter>
    </Card>
  );
};

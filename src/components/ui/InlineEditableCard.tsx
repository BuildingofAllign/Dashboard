
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pencil, MoreHorizontal, ChevronDown, MessageSquare, History, Paperclip, X } from "lucide-react";
import { CommentInput } from "./CommentInput";
import { cn } from "@/lib/utils";

export interface Comment {
  id: string;
  author: string;
  authorInitials: string;
  text: string;
  createdAt: Date;
}

export interface HistoryItem {
  id: string;
  action: string;
  actor: string;
  actorInitials: string;
  timestamp: Date;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

interface InlineEditableCardProps {
  id: string;
  title: string;
  subtitle?: string;
  status?: string;
  statusColor?: string;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: (id: string, selected: boolean) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onStatusChange?: (id: string, status: string) => void;
  statusOptions?: { label: string; value: string; color?: string }[];
  comments?: Comment[];
  history?: HistoryItem[];
  attachments?: Attachment[];
  onAddComment?: (text: string) => void;
  onAddAttachment?: (file: File) => void;
  onRemoveAttachment?: (id: string) => void;
  children?: React.ReactNode;
  className?: string;
  hasComments?: boolean;
  hasHistory?: boolean;
  hasAttachments?: boolean;
}

export const InlineEditableCard: React.FC<InlineEditableCardProps> = ({
  id,
  title,
  subtitle,
  status,
  statusColor,
  selectable = false,
  selected = false,
  onSelect,
  onEdit,
  onDelete,
  onStatusChange,
  statusOptions = [],
  comments = [],
  history = [],
  attachments = [],
  onAddComment,
  onAddAttachment,
  onRemoveAttachment,
  children,
  className,
  hasComments = true,
  hasHistory = true,
  hasAttachments = true,
}) => {
  const [activeTab, setActiveTab] = useState("details");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSelectChange = (checked: boolean) => {
    if (onSelect) {
      onSelect(id, checked);
    }
  };

  const handleAttachmentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && onAddAttachment) {
      onAddAttachment(files[0]);
    }
  };

  return (
    <Card className={cn("transition-all hover:shadow-md", selected && "ring-2 ring-primary", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-2">
            {selectable && (
              <Checkbox
                checked={selected}
                onCheckedChange={handleSelectChange}
                className="mt-1"
              />
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">{title}</h3>
                {status && (
                  <Badge 
                    className={cn(
                      "text-xs",
                      statusColor === "green" && "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
                      statusColor === "amber" && "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
                      statusColor === "red" && "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
                      statusColor === "blue" && "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
                      statusColor === "purple" && "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
                    )}
                  >
                    {status}
                  </Badge>
                )}
              </div>
              {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center gap-1">
            {onEdit && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onEdit(id)}
                className="h-8 w-8"
              >
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {statusOptions.length > 0 && onStatusChange && (
                  <>
                    {statusOptions.map((option) => (
                      <DropdownMenuItem 
                        key={option.value}
                        onClick={() => onStatusChange(id, option.value)}
                      >
                        Set status: {option.label}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuItem className="border-t" />
                  </>
                )}
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(id)}>
                    Edit
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem 
                    className="text-destructive focus:text-destructive"
                    onClick={() => onDelete(id)}
                  >
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {children}
      </CardContent>

      {(hasComments || hasHistory || hasAttachments) && (
        <CardFooter className="flex-col items-stretch p-0">
          <Collapsible
            open={isExpanded}
            onOpenChange={setIsExpanded}
            className="w-full"
          >
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className="flex w-full justify-center py-1 h-8 hover:bg-muted/50 rounded-none"
              >
                <ChevronDown className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-180")} />
                <span className="sr-only">{isExpanded ? "Show less" : "Show more"}</span>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pb-4">
              <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 mb-2">
                  {hasComments && (
                    <TabsTrigger value="comments" className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span className="hidden sm:inline">Comments</span>
                      {comments.length > 0 && (
                        <Badge variant="secondary" className="ml-1">{comments.length}</Badge>
                      )}
                    </TabsTrigger>
                  )}
                  {hasHistory && (
                    <TabsTrigger value="history" className="flex items-center gap-1">
                      <History className="h-4 w-4" />
                      <span className="hidden sm:inline">History</span>
                    </TabsTrigger>
                  )}
                  {hasAttachments && (
                    <TabsTrigger value="attachments" className="flex items-center gap-1">
                      <Paperclip className="h-4 w-4" />
                      <span className="hidden sm:inline">Files</span>
                      {attachments.length > 0 && (
                        <Badge variant="secondary" className="ml-1">{attachments.length}</Badge>
                      )}
                    </TabsTrigger>
                  )}
                </TabsList>

                {hasComments && (
                  <TabsContent value="comments" className="space-y-4">
                    <ScrollArea className="h-48 pr-4">
                      {comments.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-8">No comments yet</p>
                      ) : (
                        <div className="space-y-4">
                          {comments.map((comment) => (
                            <div key={comment.id} className="flex gap-2">
                              <div className="w-8 h-8 rounded-full bg-primary flex-shrink-0 flex items-center justify-center text-primary-foreground font-bold text-sm">
                                {comment.authorInitials}
                              </div>
                              <div className="flex-1 bg-muted p-3 rounded-lg text-sm">
                                <div className="flex justify-between">
                                  <p className="font-medium">{comment.author}</p>
                                  <span className="text-xs text-muted-foreground">
                                    {comment.createdAt.toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="mt-1">{comment.text}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                    {onAddComment && (
                      <CommentInput 
                        onSubmit={onAddComment}
                        placeholder="Add a comment..."
                        authorInitials="BL"
                      />
                    )}
                  </TabsContent>
                )}

                {hasHistory && (
                  <TabsContent value="history" className="space-y-2">
                    <ScrollArea className="h-48 pr-4">
                      {history.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-8">No history available</p>
                      ) : (
                        <div className="space-y-2">
                          {history.map((item) => (
                            <div key={item.id} className="flex items-start gap-2 py-2 border-b border-border">
                              <div className="w-7 h-7 rounded-full bg-muted flex-shrink-0 flex items-center justify-center text-muted-foreground font-medium text-xs">
                                {item.actorInitials}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm">
                                  <span className="font-medium">{item.actor}</span>
                                  <span className="text-muted-foreground"> {item.action}</span>
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {item.timestamp.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  </TabsContent>
                )}

                {hasAttachments && (
                  <TabsContent value="attachments" className="space-y-4">
                    <ScrollArea className="h-48 pr-4">
                      {attachments.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-8">No files attached</p>
                      ) : (
                        <div className="space-y-2">
                          {attachments.map((file) => (
                            <div key={file.id} className="flex items-center justify-between p-2 border rounded-md">
                              <div className="flex items-center gap-2">
                                <div className="flex-shrink-0 w-8 h-8 bg-muted rounded flex items-center justify-center">
                                  <Paperclip className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium">{file.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {file.type} • {(file.size / 1024).toFixed(0)} KB
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" asChild>
                                  <a href={file.url} target="_blank" rel="noopener noreferrer">
                                    View
                                  </a>
                                </Button>
                                {onRemoveAttachment && (
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => onRemoveAttachment(file.id)}
                                    className="h-8 w-8 text-destructive hover:text-destructive"
                                  >
                                    <X className="h-4 w-4" />
                                    <span className="sr-only">Remove</span>
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                    {onAddAttachment && (
                      <div>
                        <input
                          type="file"
                          id={`file-upload-${id}`}
                          className="sr-only"
                          onChange={handleAttachmentUpload}
                        />
                        <label htmlFor={`file-upload-${id}`}>
                          <Button 
                            variant="outline" 
                            className="w-full" 
                            asChild
                          >
                            <span>
                              <Paperclip className="h-4 w-4 mr-2" />
                              Attach file
                            </span>
                          </Button>
                        </label>
                      </div>
                    )}
                  </TabsContent>
                )}
              </Tabs>
            </CollapsibleContent>
          </Collapsible>
        </CardFooter>
      )}
    </Card>
  );
};

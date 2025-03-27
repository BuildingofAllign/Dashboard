import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { SearchBar } from "@/components/ui/SearchBar";
import { FilterSelect } from "@/components/ui/FilterButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAdditionalTasks } from "@/hooks/use-additional-tasks";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { BreadcrumbNav } from "@/components/ui/BreadcrumbNav";
import { CommentInput } from "@/components/ui/CommentInput";
import { AdditionalTaskForm } from "@/components/additional-tasks/AdditionalTaskForm";
import { 
  AlertCircle, 
  Clock, 
  FileText,
  Image,
  MapPin, 
  Plus, 
  CheckCircle, 
  XCircle,
  MessageSquare,
  DollarSign,
  Calendar,
  Package,
  Loader2,
  Search,
  RefreshCw
} from "lucide-react";

const getStatusColor = (status: string) => {
  switch (status) {
    case "Afventer":
      return "bg-yellow-100 text-yellow-800";
    case "Godkendt":
      return "bg-green-100 text-green-800";
    case "Afvist":
      return "bg-red-100 text-red-800";
    case "Færdig":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Afventer":
      return <Clock className="h-4 w-4 mr-1.5" />;
    case "Godkendt":
      return <CheckCircle className="h-4 w-4 mr-1.5" />;
    case "Afvist":
      return <XCircle className="h-4 w-4 mr-1.5" />;
    case "Færdig":
      return <CheckCircle className="h-4 w-4 mr-1.5" />;
    default:
      return <AlertCircle className="h-4 w-4 mr-1.5" />;
  }
};

const Tillagsopgaver: React.FC = () => {
  const {
    additionalTasks,
    filteredTasks,
    loadingAdditionalTasks,
    searchQuery,
    setSearchQuery,
    projectFilter,
    setProjectFilter,
    statusFilter,
    setStatusFilter,
    refreshAdditionalTasks,
    handleApproveTask,
    handleRejectTask,
    handleSendToQA
  } = useAdditionalTasks();
  
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshAdditionalTasks();
    setIsRefreshing(false);
  };

  const handleOpenCommentDialog = (task: any) => {
    setSelectedTask(task);
    setCommentDialogOpen(true);
  };

  const handleAddCommentSubmit = async (text: string) => {
    // In a real app, this would add a comment
    setCommentDialogOpen(false);
  };

  const breadcrumbItems = [
    { label: "Tillægsopgaver" }
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Tillægsopgaver" userInitials="BL" />
        
        <div className="p-6 pb-3">
          <BreadcrumbNav items={breadcrumbItems} className="mb-4" />
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div className="flex items-center">
              <SearchBar 
                placeholder="Søg efter tillægsopgave..." 
                onChange={setSearchQuery}
              />
              <Button
                variant="outline"
                size="icon"
                className="ml-2"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="sr-only">Opdater</span>
              </Button>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <FilterSelect onChange={(e) => setProjectFilter(e.target.value)}>
                <option value="all">Alle projekter</option>
                <option value="Projekt Skovvej 12">Projekt Skovvej 12</option>
                <option value="Projekt Havnegade 8">Projekt Havnegade 8</option>
                <option value="Projekt Stationsvej 23">Projekt Stationsvej 23</option>
              </FilterSelect>
              <FilterSelect onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">Alle statuser</option>
                <option value="Afventer">Afventer</option>
                <option value="Godkendt">Godkendt</option>
                <option value="Afvist">Afvist</option>
                <option value="Færdig">Færdig</option>
              </FilterSelect>
              <Button 
                className="bg-indigo-600 hover:bg-indigo-700" 
                onClick={() => setCreateTaskOpen(true)}
              >
                <Plus className="h-5 w-5 mr-1" />
                Opret tillægsopgave
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
            <div>
              Viser {filteredTasks.length} af {additionalTasks.length} tillægsopgaver
            </div>
          </div>
        </div>
        
        <div className="p-6 pt-0 overflow-auto">
          {loadingAdditionalTasks ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
              <span className="ml-2 text-lg text-gray-700 dark:text-gray-300">Indlæser tillægsopgaver...</span>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                <Search className="h-8 w-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Ingen tillægsopgaver fundet</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">Der er ingen tillægsopgaver der matcher dine filtre. Prøv at justere søgekriterier eller opret en ny tillægsopgave.</p>
              <Button 
                className="mt-4"
                onClick={() => setCreateTaskOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Opret tillægsopgave
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <Card key={task.id} className="overflow-hidden dark:bg-gray-800">
                  <CardContent className="p-0">
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row justify-between mb-3">
                        <div>
                          <div className="flex items-center flex-wrap gap-2">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{task.title}</h3>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                              {task.task_id}
                            </span>
                            {task.from_deviation_id && (
                              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 flex items-center">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Fra afvigelse
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{task.project_id}</p>
                        </div>
                        <div className="mt-2 md:mt-0">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                            {getStatusIcon(task.status)}
                            {task.status}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 dark:text-gray-300 mb-4">{task.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 mb-4">
                        <div className="flex items-center text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-300 p-3 rounded-lg">
                          <DollarSign className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Pris</p>
                            <p className="font-medium">{parseFloat(task.price).toLocaleString()} kr.</p>
                          </div>
                        </div>
                        <div className="flex items-center text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-300 p-3 rounded-lg">
                          <Calendar className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Tidsforbrug</p>
                            <p className="font-medium">{task.time_required}</p>
                          </div>
                        </div>
                        <div className="flex items-center text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-300 p-3 rounded-lg">
                          <Package className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Materialer</p>
                            <p className="font-medium">{task.materials}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <FileText className="h-4 w-4 mr-1.5" />
                          <span>{task.drawing}</span>
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <Clock className="h-4 w-4 mr-1.5" />
                          <span>Oprettet {new Date(task.created_at).toLocaleDateString('da-DK')}</span>
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-400 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400">
                          <MapPin className="h-4 w-4 mr-1.5" />
                          <span>Se på tegning</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-6">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold mr-2 text-sm">
                            {task.assigned_to.split(' ')?.map((name: string) => name[0]).join('') || 'U'}
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">Tildelt: {task.assigned_to}</span>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center"
                            onClick={() => handleOpenCommentDialog(task)}
                          >
                            <MessageSquare className="h-4 w-4 mr-1.5" />
                            Kommentarer
                          </Button>
                          
                          {task.status === "Afventer" && (
                            <>
                              <Button 
                                onClick={() => handleApproveTask(task.id)}
                                size="sm" 
                                className="flex items-center bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-4 w-4 mr-1.5" />
                                Godkend
                              </Button>
                              <Button 
                                onClick={() => handleRejectTask(task.id)}
                                size="sm" 
                                className="flex items-center bg-red-600 hover:bg-red-700"
                              >
                                <XCircle className="h-4 w-4 mr-1.5" />
                                Afvis
                              </Button>
                            </>
                          )}
                          
                          {task.status === "Godkendt" && (
                            <Button 
                              onClick={() => handleSendToQA(task.id)}
                              size="sm" 
                              className="flex items-center bg-indigo-600 hover:bg-indigo-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-1.5" />
                              Markér udført og send til KS
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Comment Dialog */}
      <Dialog open={commentDialogOpen} onOpenChange={setCommentDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tilføj kommentar</DialogTitle>
            <DialogDescription>
              Kommentaren vil blive tilføjet til tillægsopgave {selectedTask?.task_id}
            </DialogDescription>
          </DialogHeader>
          
          <div className="my-4">
            <CommentInput 
              onSubmit={handleAddCommentSubmit} 
              authorInitials="BL"
              placeholder="Skriv din kommentar her..."
            />
          </div>
          
          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setCommentDialogOpen(false)}
            >
              Annuller
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Task Dialog */}
      <AdditionalTaskForm
        open={createTaskOpen}
        onOpenChange={setCreateTaskOpen}
      />
    </div>
  );
};

export default Tillagsopgaver;

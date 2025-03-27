
import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { SearchBar } from "@/components/ui/SearchBar";
import { FilterSelect } from "@/components/ui/FilterButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDeviations } from "@/hooks/use-deviations";
import { useAdditionalTasks } from "@/hooks/use-additional-tasks";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { CommentInput } from "@/components/ui/CommentInput";
import { BreadcrumbNav } from "@/components/ui/BreadcrumbNav";
import { DeviationForm } from "@/components/deviations/DeviationForm";
import { ZoomablePannable } from "@/components/ui/ZoomablePannable";
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
  Camera,
  UserCheck,
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
    default:
      return <AlertCircle className="h-4 w-4 mr-1.5" />;
  }
};

const Afvigelser: React.FC = () => {
  const {
    deviations,
    filteredDeviations,
    loadingDeviations,
    searchQuery,
    setSearchQuery,
    projectFilter,
    setProjectFilter,
    statusFilter,
    setStatusFilter,
    approverFilter,
    setApproverFilter,
    refreshDeviations,
    handleCreateDeviation,
    handleApproveDeviation,
    handleRejectDeviation,
    handleAddComment
  } = useDeviations();
  
  const { convertDeviationToTask } = useAdditionalTasks();
  const [selectedDeviation, setSelectedDeviation] = useState<any>(null);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [createDeviationOpen, setCreateDeviationOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshDeviations();
    setIsRefreshing(false);
  };

  const handleConvertToAdditionalTask = async (deviation: any) => {
    await convertDeviationToTask(deviation);
  };

  const handleOpenCommentDialog = (deviation: any) => {
    setSelectedDeviation(deviation);
    setCommentDialogOpen(true);
  };

  const handleAddCommentSubmit = async (text: string) => {
    if (selectedDeviation && text) {
      await handleAddComment(selectedDeviation.id, "BL", text);
      setCommentDialogOpen(false);
    }
  };

  const openImagePreview = (imageUrl: string) => {
    setPreviewImage(imageUrl);
    setImagePreviewOpen(true);
  };

  const breadcrumbItems = [
    { label: "Afvigelser" }
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Afvigelser" userInitials="BL" />
        
        <div className="p-6 pb-3">
          <BreadcrumbNav items={breadcrumbItems} className="mb-4" />
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div className="flex items-center">
              <SearchBar 
                placeholder="Søg efter afvigelser..." 
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
            <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
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
              </FilterSelect>
              <FilterSelect onChange={(e) => setApproverFilter(e.target.value)}>
                <option value="all">Alle godkendere</option>
                <option value="Ingeniør">Ingeniør</option>
                <option value="Kunderepræsentant">Kunderepræsentant</option>
                <option value="Byggeleder">Byggeleder</option>
              </FilterSelect>
              <Button 
                className="bg-indigo-600 hover:bg-indigo-700"
                onClick={() => setCreateDeviationOpen(true)}
              >
                <Plus className="h-5 w-5 mr-1" />
                Opret afvigelse
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
            <div>
              Viser {filteredDeviations.length} af {deviations.length} afvigelser
            </div>
          </div>
        </div>
        
        <div className="p-6 pt-0 overflow-auto">
          {loadingDeviations ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
              <span className="ml-2 text-lg text-gray-700 dark:text-gray-300">Indlæser afvigelser...</span>
            </div>
          ) : filteredDeviations.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                <Search className="h-8 w-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Ingen afvigelser fundet</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">Der er ingen afvigelser der matcher dine filtre. Prøv at justere søgekriterier eller opret en ny afvigelse.</p>
              <Button 
                className="mt-4"
                onClick={() => setCreateDeviationOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Opret afvigelse
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDeviations.map((deviation) => (
                <Card key={deviation.id} className="overflow-hidden dark:bg-gray-800">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row w-full">
                      <div 
                        className="w-full md:w-64 h-48 md:h-auto relative bg-gray-100 dark:bg-gray-700 cursor-pointer"
                        onClick={() => deviation.image_url && openImagePreview(deviation.image_url)}
                      >
                        <img 
                          src={deviation.image_url || "https://images.unsplash.com/photo-1461749280684-dccba630e2f6"} 
                          alt={deviation.title} 
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute bottom-2 right-2">
                          <button className="bg-white dark:bg-gray-700 p-1.5 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-600">
                            <Camera className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                          </button>
                        </div>
                      </div>
                      <div className="p-6 flex-1">
                        <div className="flex flex-col md:flex-row justify-between mb-3">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{deviation.title}</h3>
                              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                                {deviation.deviation_id}
                              </span>
                              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 flex items-center">
                                <UserCheck className="h-3 w-3 mr-1" />
                                {deviation.approver_role}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{deviation.project_id}</p>
                          </div>
                          <div className="mt-2 md:mt-0">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(deviation.status)}`}>
                              {getStatusIcon(deviation.status)}
                              {deviation.status}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 dark:text-gray-300 mb-4">{deviation.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mt-4">
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <FileText className="h-4 w-4 mr-1.5" />
                            <span>{deviation.drawing}</span>
                          </div>
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <Clock className="h-4 w-4 mr-1.5" />
                            <span>Oprettet {new Date(deviation.created_at).toLocaleDateString('da-DK')}</span>
                          </div>
                          <div className="flex items-center text-gray-600 dark:text-gray-400 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400">
                            <MapPin className="h-4 w-4 mr-1.5" />
                            <span>Se på tegning</span>
                          </div>
                        </div>
                        
                        {deviation.deviation_comments && deviation.deviation_comments.length > 0 && (
                          <div className="mt-4 border-t dark:border-gray-700 pt-4">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Seneste kommentarer</h4>
                            <div className="space-y-2">
                              {deviation.deviation_comments.slice(0, 2).map((comment: any, i: number) => (
                                <div key={i} className="flex items-start">
                                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm mr-2">
                                    {comment.author}
                                  </div>
                                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2 flex-1">
                                    <p className="text-sm dark:text-gray-300">{comment.text}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{new Date(comment.created_at).toLocaleDateString('da-DK')}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                            {deviation.deviation_comments.length > 2 && (
                              <button className="text-sm text-indigo-600 dark:text-indigo-400 mt-2 hover:underline">
                                Vis alle {deviation.deviation_comments.length} kommentarer
                              </button>
                            )}
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center mt-6">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold mr-2 text-sm">
                              {deviation.assigned_to.split(' ')?.map((name: string) => name[0]).join('') || 'U'}
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Tildelt: {deviation.assigned_to}</span>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 justify-end">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex items-center"
                              onClick={() => handleOpenCommentDialog(deviation)}
                            >
                              <MessageSquare className="h-4 w-4 mr-1.5" />
                              Tilføj kommentar
                            </Button>
                            
                            {deviation.status === "Afventer" && (
                              <>
                                <Button 
                                  size="sm" 
                                  className="flex items-center bg-green-600 hover:bg-green-700"
                                  onClick={() => handleApproveDeviation(deviation.id)}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1.5" />
                                  Godkend
                                </Button>
                                <Button 
                                  size="sm" 
                                  className="flex items-center bg-red-600 hover:bg-red-700"
                                  onClick={() => handleRejectDeviation(deviation.id)}
                                >
                                  <XCircle className="h-4 w-4 mr-1.5" />
                                  Afvis
                                </Button>
                              </>
                            )}
                            
                            {deviation.status === "Afvist" && (
                              <Button 
                                size="sm" 
                                className="flex items-center bg-indigo-600 hover:bg-indigo-700"
                                onClick={() => handleConvertToAdditionalTask(deviation)}
                              >
                                <Plus className="h-4 w-4 mr-1.5" />
                                Konverter til tillægsopgave
                              </Button>
                            )}
                            
                            {deviation.status === "Godkendt" && (
                              <Button 
                                size="sm" 
                                className="flex items-center bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-4 w-4 mr-1.5" />
                                Til kvalitetssikring
                              </Button>
                            )}
                          </div>
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
              Kommentaren vil blive tilføjet til afvigelse {selectedDeviation?.deviation_id}
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

      {/* Create Deviation Dialog */}
      <DeviationForm 
        open={createDeviationOpen}
        onOpenChange={setCreateDeviationOpen}
      />

      {/* Image Preview Dialog */}
      <Dialog open={imagePreviewOpen} onOpenChange={setImagePreviewOpen}>
        <DialogContent className="sm:max-w-4xl p-0 overflow-hidden">
          <div className="h-[80vh]">
            <ZoomablePannable>
              <img 
                src={previewImage} 
                alt="Preview" 
                className="w-full h-full object-contain" 
              />
            </ZoomablePannable>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Afvigelser;

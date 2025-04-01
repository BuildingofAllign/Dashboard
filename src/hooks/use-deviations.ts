
import { useState, useCallback, useEffect } from 'react';
import { useData } from '@/context/DataContext';
import { toast } from 'sonner';

export const useDeviations = () => {
  const { 
    deviations, 
    loadingDeviations, 
    fetchDeviations: contextFetchDeviations,
    createDeviation,
    updateDeviation,
    addDeviationComment
  } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [projectFilter, setProjectFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [approverFilter, setApproverFilter] = useState("all");
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Enhanced fetchDeviations with better error handling
  const fetchDeviations = useCallback(async () => {
    try {
      setFetchError(null);
      await contextFetchDeviations();
    } catch (error) {
      console.error("Error fetching deviations:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      setFetchError(errorMessage);
      toast.error("Failed to load deviations", {
        description: "Please try again later"
      });
    }
  }, [contextFetchDeviations]);

  // Fetch deviations on component mount
  useEffect(() => {
    fetchDeviations();
  }, [fetchDeviations]);

  // Get filtered deviations based on current filters
  const filteredDeviations = deviations.filter((deviation) => {
    // Search filter
    const matchesSearch = 
      deviation.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deviation.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deviation.project_id?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      deviation.deviation_id?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Project filter
    const matchesProject = projectFilter === "all" || 
      deviation.project_id === projectFilter;
    
    // Status filter
    const matchesStatus = statusFilter === "all" || 
      deviation.status?.toLowerCase() === statusFilter.toLowerCase();
    
    // Approver filter
    const matchesApprover = approverFilter === "all" || 
      deviation.approver_role?.toLowerCase() === approverFilter.toLowerCase();
    
    return matchesSearch && matchesProject && matchesStatus && matchesApprover;
  });

  // Action handlers
  const handleCreateDeviation = async (deviationData: any) => {
    try {
      await createDeviation(deviationData);
      toast.success("Ny afvigelse oprettet!", {
        description: "Afvigelse tildelt et unikt ID og afventer godkendelse."
      });
      return true;
    } catch (error) {
      console.error("Error creating deviation:", error);
      toast.error("Kunne ikke oprette afvigelse", {
        description: "Prøv igen senere"
      });
      return false;
    }
  };

  const handleApproveDeviation = async (id: string) => {
    try {
      await updateDeviation(id, { status: "Godkendt" });
      toast.success(`Afvigelse godkendt`, {
        description: "Afvigelsen er nu sendt til kvalitetssikring."
      });
      return true;
    } catch (error) {
      console.error("Error approving deviation:", error);
      toast.error("Kunne ikke godkende afvigelse", {
        description: "Prøv igen senere"
      });
      return false;
    }
  };

  const handleRejectDeviation = async (id: string) => {
    try {
      await updateDeviation(id, { status: "Afvist" });
      toast.error(`Afvigelse afvist`, {
        description: "Afvigelsen kan konverteres til en tillægsopgave."
      });
      return true;
    } catch (error) {
      console.error("Error rejecting deviation:", error);
      toast.error("Kunne ikke afvise afvigelse", {
        description: "Prøv igen senere"
      });
      return false;
    }
  };

  const handleConvertToAdditionalTask = async (deviation: any) => {
    try {
      // This will be handled by the additional tasks hook
      return true;
    } catch (error) {
      console.error("Error converting to additional task:", error);
      toast.error("Kunne ikke konvertere til tillægsopgave", {
        description: "Prøv igen senere"
      });
      return false;
    }
  };

  const handleAddComment = async (id: string, author: string, text: string) => {
    try {
      await addDeviationComment(id, author, text);
      toast.success(`Kommentar tilføjet`, {
        description: "Alle involverede parter er blevet notificeret."
      });
      return true;
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Kunne ikke tilføje kommentar", {
        description: "Prøv igen senere"
      });
      return false;
    }
  };

  return {
    deviations,
    filteredDeviations,
    loadingDeviations,
    fetchError,
    searchQuery,
    setSearchQuery,
    projectFilter,
    setProjectFilter,
    statusFilter,
    setStatusFilter,
    approverFilter,
    setApproverFilter,
    refreshDeviations: fetchDeviations,
    handleCreateDeviation,
    handleApproveDeviation,
    handleRejectDeviation,
    handleConvertToAdditionalTask,
    handleAddComment
  };
};

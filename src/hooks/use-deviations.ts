
import { useState } from 'react';
import { useData } from '@/context/DataContext';
import { toast } from 'sonner';

export const useDeviations = () => {
  const { 
    deviations, 
    loadingDeviations, 
    fetchDeviations,
    createDeviation,
    updateDeviation,
    addDeviationComment
  } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [projectFilter, setProjectFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [approverFilter, setApproverFilter] = useState("all");

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
      return false;
    }
  };

  const handleConvertToAdditionalTask = async (deviation: any) => {
    try {
      // This will be handled by the additional tasks hook
      return true;
    } catch (error) {
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
      return false;
    }
  };

  return {
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
    refreshDeviations: fetchDeviations,
    handleCreateDeviation,
    handleApproveDeviation,
    handleRejectDeviation,
    handleConvertToAdditionalTask,
    handleAddComment
  };
};

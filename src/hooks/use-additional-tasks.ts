
import { useState } from 'react';
import { useData } from '@/context/DataContext';
import { toast } from 'sonner';

export const useAdditionalTasks = () => {
  const { 
    additionalTasks, 
    loadingAdditionalTasks, 
    fetchAdditionalTasks,
    createAdditionalTask,
    updateAdditionalTask
  } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [projectFilter, setProjectFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Get filtered tasks based on current filters
  const filteredTasks = additionalTasks.filter(task => {
    const matchesSearch = 
      task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.project_id?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.task_id?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesProject = projectFilter === "all" || 
      task.project_id === projectFilter;
    
    const matchesStatus = statusFilter === "all" || 
      task.status?.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesProject && matchesStatus;
  });

  // Action handlers
  const handleCreateTask = async (taskData: any) => {
    try {
      await createAdditionalTask(taskData);
      toast.success("Ny tillægsopgave oprettet!", {
        description: "Du kan redigere detaljerne nu."
      });
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleApproveTask = async (id: string) => {
    try {
      await updateAdditionalTask(id, { status: "Godkendt" });
      toast.success(`Tillægsopgave godkendt`, {
        description: "Opgaven er nu klar til udførelse."
      });
      return true;
    } catch (error) {
      return false;
    }
  };
  
  const handleRejectTask = async (id: string) => {
    try {
      await updateAdditionalTask(id, { status: "Afvist" });
      toast.error(`Tillægsopgave afvist`, {
        description: "Se kommentarer for detaljer."
      });
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleSendToQA = async (id: string) => {
    try {
      await updateAdditionalTask(id, { status: "Færdig" });
      toast.success(`Tillægsopgave sendt til kvalitetssikring`, {
        description: "Arbejdet er markeret som udført og klar til KS."
      });
      return true;
    } catch (error) {
      return false;
    }
  };

  const convertDeviationToTask = async (deviation: any) => {
    try {
      const taskData = {
        title: `${deviation.title} (fra afvigelse)`,
        project_id: deviation.project_id,
        drawing: deviation.drawing,
        status: "Afventer",
        price: 0, // Needs to be set by user
        time_required: "0 timer", // Needs to be set by user
        materials: "", // Needs to be set by user
        description: deviation.description,
        assigned_to: deviation.assigned_to,
        from_deviation_id: deviation.id
      };
      
      await createAdditionalTask(taskData);
      toast.success(`Afvigelse konverteret til tillægsopgave`, {
        description: "Gå til Tillægsopgaver for at se den nye opgave."
      });
      return true;
    } catch (error) {
      return false;
    }
  };

  return {
    additionalTasks,
    filteredTasks,
    loadingAdditionalTasks,
    searchQuery,
    setSearchQuery,
    projectFilter,
    setProjectFilter,
    statusFilter,
    setStatusFilter,
    refreshAdditionalTasks: fetchAdditionalTasks,
    handleCreateTask,
    handleApproveTask,
    handleRejectTask,
    handleSendToQA,
    convertDeviationToTask
  };
};


import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useAdditionalTasks } from '@/hooks/use-additional-tasks';

interface AdditionalTaskFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: any;
  isEditing?: boolean;
}

export const AdditionalTaskForm: React.FC<AdditionalTaskFormProps> = ({
  open,
  onOpenChange,
  initialData,
  isEditing = false
}) => {
  const { handleCreateTask } = useAdditionalTasks();
  
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    project_id: initialData?.project_id || '',
    drawing: initialData?.drawing || '',
    description: initialData?.description || '',
    price: initialData?.price || 0,
    time_required: initialData?.time_required || '',
    materials: initialData?.materials || '',
    assigned_to: initialData?.assigned_to || '',
    status: initialData?.status || 'Afventer'
  });
  
  const [submitting, setSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async () => {
    // Basic validation
    if (!formData.title || !formData.project_id || !formData.drawing || !formData.description) {
      toast.error('Udfyld venligst alle påkrævede felter');
      return;
    }
    
    setSubmitting(true);
    
    try {
      if (isEditing && initialData?.id) {
        // Update logic would go here
        toast.success('Tillægsopgave opdateret');
      } else {
        // Create new task
        await handleCreateTask(formData);
      }
      onOpenChange(false);
    } catch (error: any) {
      toast.error('Der opstod en fejl', { description: error.message });
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Rediger tillægsopgave' : 'Opret ny tillægsopgave'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Rediger detaljerne for den valgte tillægsopgave' 
              : 'Udfyld detaljerne for at registrere en ny tillægsopgave'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Titel*
            </Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="col-span-3"
              placeholder="Kort beskrivende titel"
              required
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="project_id" className="text-right">
              Projekt*
            </Label>
            <select
              id="project_id"
              name="project_id"
              value={formData.project_id}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 col-span-3"
              required
            >
              <option value="">Vælg projekt</option>
              <option value="Projekt Skovvej 12">Projekt Skovvej 12</option>
              <option value="Projekt Havnegade 8">Projekt Havnegade 8</option>
              <option value="Projekt Stationsvej 23">Projekt Stationsvej 23</option>
            </select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="drawing" className="text-right">
              Tegning*
            </Label>
            <Input
              id="drawing"
              name="drawing"
              value={formData.drawing}
              onChange={handleChange}
              className="col-span-3"
              placeholder="f.eks. K01, E03"
              required
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Pris (kr)*
            </Label>
            <Input
              id="price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="time_required" className="text-right">
              Tidsforbrug*
            </Label>
            <Input
              id="time_required"
              name="time_required"
              value={formData.time_required}
              onChange={handleChange}
              className="col-span-3"
              placeholder="f.eks. 4 timer, 2 dage"
              required
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="materials" className="text-right">
              Materialer*
            </Label>
            <Input
              id="materials"
              name="materials"
              value={formData.materials}
              onChange={handleChange}
              className="col-span-3"
              placeholder="Liste over nødvendige materialer"
              required
            />
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right pt-2">
              Beskrivelse*
            </Label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 col-span-3"
              placeholder="Detaljeret beskrivelse af tillægsopgaven"
              required
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="assigned_to" className="text-right">
              Tildelt til
            </Label>
            <Input
              id="assigned_to"
              name="assigned_to"
              value={formData.assigned_to}
              onChange={handleChange}
              className="col-span-3"
              placeholder="Navnet på den ansvarlige person"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="secondary" 
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Annuller
          </Button>
          <Button 
            type="button" 
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? 'Gemmer...' : isEditing ? 'Gem ændringer' : 'Opret tillægsopgave'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

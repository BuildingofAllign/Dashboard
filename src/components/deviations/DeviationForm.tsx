
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { FileUpload } from '@/components/ui/FileUpload';
import { toast } from 'sonner';
import { useDeviations } from '@/hooks/use-deviations';

interface DeviationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: any;
  isEditing?: boolean;
}

export const DeviationForm: React.FC<DeviationFormProps> = ({
  open,
  onOpenChange,
  initialData,
  isEditing = false
}) => {
  const { handleCreateDeviation } = useDeviations();
  
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    project_id: initialData?.project_id || '',
    drawing: initialData?.drawing || '',
    description: initialData?.description || '',
    assigned_to: initialData?.assigned_to || '',
    approver_role: initialData?.approver_role || 'Ingeniør',
    image_url: initialData?.image_url || '',
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
  
  const handleImageUpload = (url: string) => {
    setFormData(prev => ({
      ...prev,
      image_url: url
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
        toast.success('Afvigelse opdateret');
      } else {
        // Create new deviation
        await handleCreateDeviation(formData);
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
          <DialogTitle>{isEditing ? 'Rediger afvigelse' : 'Opret ny afvigelse'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Rediger detaljerne for den valgte afvigelse' 
              : 'Udfyld detaljerne for at registrere en ny afvigelse'}
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
              placeholder="Detaljeret beskrivelse af afvigelsen"
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
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="approver_role" className="text-right">
              Godkender
            </Label>
            <select
              id="approver_role"
              name="approver_role"
              value={formData.approver_role}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 col-span-3"
            >
              <option value="Ingeniør">Ingeniør</option>
              <option value="Kunderepræsentant">Kunderepræsentant</option>
              <option value="Byggeleder">Byggeleder</option>
            </select>
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2">
              Billede
            </Label>
            <div className="col-span-3">
              <FileUpload 
                onUploadComplete={handleImageUpload}
                bucketName="deviation-images"
                storageFolder="deviations"
              />
              {formData.image_url && (
                <div className="mt-2 text-sm text-gray-500">
                  Billede uploadet
                </div>
              )}
            </div>
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
            {submitting ? 'Gemmer...' : isEditing ? 'Gem ændringer' : 'Opret afvigelse'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

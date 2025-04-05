
import React from 'react';
import { Building, User, MapPin, Briefcase, Calendar, CreditCard } from 'lucide-react';
import { Project } from '@/hooks/projects-types';
import { Separator } from '@/components/ui/separator';
import { formatCurrency, formatDateRange, formatDate } from './DateUtils';

interface CustomerInfoProps {
  project: Project;
}

export const CustomerInfo: React.FC<CustomerInfoProps> = ({ project }) => {
  return (
    <div className="space-y-5">
      <div>
        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
          Kundeoplysninger
        </h4>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <Building className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
            <div>
              <p className="font-medium">{project.customer || 'Ikke angivet'}</p>
              <p className="text-sm text-muted-foreground">Kunde</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <User className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
            <div>
              <p className="font-medium">{project.contact_person || 'Ikke angivet'}</p>
              <p className="text-sm text-muted-foreground">Kontaktperson</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <MapPin className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
            <div>
              <p className="font-medium">{project.address || 'Ikke angivet'}</p>
              <p className="text-sm text-muted-foreground">Adresse</p>
            </div>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <ProjectDetails project={project} />
    </div>
  );
};

interface ProjectDetailsProps {
  project: Project;
}

export const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project }) => {
  return (
    <div>
      <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
        Projektdetaljer
      </h4>
      
      <div className="space-y-4">
        <div className="flex items-start">
          <Briefcase className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
          <div>
            <p className="font-medium">{project.project_name || project.name}</p>
            <p className="text-sm text-muted-foreground">Projektnavn</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <Calendar className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
          <div>
            <p className="font-medium">{formatDateRange(project.start_date, project.end_date)}</p>
            <p className="text-sm text-muted-foreground">Tidsplan</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <CreditCard className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
          <div>
            <p className="font-medium">{formatCurrency(project.budget)}</p>
            <p className="text-sm text-muted-foreground">Budget</p>
          </div>
        </div>
      </div>
    </div>
  );
};

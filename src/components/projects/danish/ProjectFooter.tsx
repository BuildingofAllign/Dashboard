
import React from 'react';
import { Project } from '@/hooks/projects-types';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { da } from 'date-fns/locale';

interface ProjectFooterProps {
  project: Project;
}

export const ProjectFooter: React.FC<ProjectFooterProps> = ({ project }) => {
  // Function to format a single date
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = parseISO(dateString);
    return format(date, 'd. MMMM yyyy', { locale: da });
  };

  return (
    <div className="bg-muted/20 p-4 border-t flex justify-between items-center">
      <div className="text-sm text-muted-foreground">
        <span>Oprettet: {formatDate(project.created_at)}</span>
        {project.updated_at && project.updated_at !== project.created_at && (
          <span> · Opdateret: {formatDate(project.updated_at)}</span>
        )}
      </div>
      
      <div className="flex space-x-2">
        <Badge variant="outline" className="bg-card">
          ID: {project.id.substring(0, 8)}
        </Badge>
      </div>
    </div>
  );
};


import React from 'react';
import { Project } from '@/hooks/projects-types';
import { Separator } from '@/components/ui/separator';
import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProjectContentProps {
  project: Project;
}

export const ProjectContent: React.FC<ProjectContentProps> = ({ project }) => {
  return (
    <div className="space-y-5">
      <div>
        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Beskrivelse</h4>
        
        <div className="bg-muted/30 p-4 rounded-md border">
          <p className="text-foreground whitespace-pre-line">
            {project.description || 'Ingen beskrivelse tilgængelig'}
          </p>
        </div>
      </div>
      
      <Separator />
      
      <ProjectDocuments />
    </div>
  );
};

export const ProjectDocuments: React.FC = () => {
  return (
    <div>
      <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Dokumenter og bilag</h4>
      
      <div className="space-y-3">
        {/* Example document items */}
        <div className="flex items-center p-3 rounded-md bg-muted/20 border hover:bg-muted/30 cursor-pointer transition-colors">
          <FileText className="h-5 w-5 text-blue-500 mr-3" />
          <div className="flex-1">
            <p className="font-medium">Projektbeskrivelse</p>
            <p className="text-xs text-muted-foreground">PDF - 2.5 MB</p>
          </div>
          <Button variant="ghost" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center p-3 rounded-md bg-muted/20 border hover:bg-muted/30 cursor-pointer transition-colors">
          <FileText className="h-5 w-5 text-green-500 mr-3" />
          <div className="flex-1">
            <p className="font-medium">Tidsplan</p>
            <p className="text-xs text-muted-foreground">XLSX - 1.2 MB</p>
          </div>
          <Button variant="ghost" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center p-3 rounded-md bg-muted/20 border hover:bg-muted/30 cursor-pointer transition-colors">
          <FileText className="h-5 w-5 text-orange-500 mr-3" />
          <div className="flex-1">
            <p className="font-medium">Kontrakt</p>
            <p className="text-xs text-muted-foreground">PDF - 3.8 MB</p>
          </div>
          <Button variant="ghost" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

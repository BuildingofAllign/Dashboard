
import React from 'react';
import { Project } from '@/hooks/projects-types';
import { 
  ProjectHeader,
  CustomerInfo,
  ProjectStatus,
  ProjectContent,
  ProjectFooter
} from './danish';

interface DanishProjectListProps {
  projects: Project[];
}

export const DanishProjectList: React.FC<DanishProjectListProps> = ({ projects }) => {
  return (
    <div className="space-y-8">
      {projects.map((project) => (
        <div 
          key={project.id} 
          className="bg-card rounded-lg shadow-md border overflow-hidden hover:shadow-lg transition-shadow duration-200"
        >
          {/* Project header with name and badges */}
          <ProjectHeader project={project} />
          
          {/* Project content grid */}
          <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column - Customer info */}
            <CustomerInfo project={project} />
            
            {/* Middle column - Project status and progress */}
            <ProjectStatus project={project} />
            
            {/* Right column - Description and details */}
            <ProjectContent project={project} />
          </div>
          
          {/* Project footer */}
          <ProjectFooter project={project} />
        </div>
      ))}
    </div>
  );
};

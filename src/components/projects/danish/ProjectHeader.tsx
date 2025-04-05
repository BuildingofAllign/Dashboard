
import React from 'react';
import { Project } from '@/hooks/projects-types';
import { Badge } from '@/components/ui/badge';

interface ProjectHeaderProps {
  project: Project;
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({ project }) => {
  // Function to determine the status badge color
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'aktiv':
        return <Badge className="bg-blue-500 hover:bg-blue-600 text-white">Aktiv</Badge>;
      case 'problem':
        return <Badge className="bg-amber-500 hover:bg-amber-600 text-white">Problem</Badge>;
      case 'udfordring':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">Udfordring</Badge>;
      case 'afsluttet':
        return <Badge className="bg-green-500 hover:bg-green-600 text-white">Afsluttet</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Function to get the type badge
  const getTypeBadge = (type: string) => {
    const bgColor = type.toLowerCase() === 'fagtilsyn' ? 'bg-blue-500' : 'bg-orange-500';
    return <Badge className={`${bgColor} text-white hover:opacity-90`}>{type}</Badge>;
  };

  return (
    <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold">{project.name}</h3>
          <p className="text-slate-300 mt-1">#{project.project_id}</p>
        </div>
        <div className="flex space-x-2">
          {getStatusBadge(project.status)}
          {getTypeBadge(project.type)}
        </div>
      </div>
    </div>
  );
};

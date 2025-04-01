
import React from 'react';
import { format, parseISO } from 'date-fns';
import { da } from 'date-fns/locale';
import { Project } from '@/hooks/projects-types';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface DanishProjectListProps {
  projects: Project[];
}

export const DanishProjectList: React.FC<DanishProjectListProps> = ({ projects }) => {
  // Function to format currency in Danish format
  const formatCurrency = (amount: number | undefined) => {
    if (!amount) return '';
    return new Intl.NumberFormat('da-DK', {
      style: 'currency',
      currency: 'DKK',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Function to format date range
  const formatDateRange = (startDate?: string, endDate?: string) => {
    if (!startDate || !endDate) return '';
    
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    
    const startFormatted = format(start, 'MMMM yyyy', { locale: da });
    const endFormatted = format(end, 'MMMM yyyy', { locale: da });
    
    return `${startFormatted} - ${endFormatted}`;
  };

  // Function to determine the status badge color
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'aktiv':
        return <Badge className="bg-green-500 text-white">Aktiv</Badge>;
      case 'problem':
        return <Badge className="bg-red-500 text-white">Problem</Badge>;
      case 'udfordring':
        return <Badge className="bg-yellow-500 text-white">Udfordring</Badge>;
      case 'afsluttet':
        return <Badge className="bg-gray-500 text-white">Afsluttet</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Function to get the type badge
  const getTypeBadge = (type: string) => {
    const bgColor = type.toLowerCase() === 'fagtilsyn' ? 'bg-blue-500' : 'bg-orange-500';
    return <Badge className={`${bgColor} text-white`}>{type}</Badge>;
  };

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <div key={project.id} className="bg-white rounded-md shadow-sm border overflow-hidden">
          {/* Project header with name and background */}
          <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-white p-4">
            <h3 className="text-lg font-semibold">{project.name}</h3>
          </div>
          
          {/* Project content grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
            {/* Left column - Customer info */}
            <div className="space-y-4">
              <div>
                <h4 className="text-xs text-gray-500 font-medium mb-1">Kunde</h4>
                <p className="text-sm font-medium">{project.customer}</p>
              </div>
              
              <div>
                <h4 className="text-xs text-gray-500 font-medium mb-1">Projektnavn</h4>
                <p className="text-sm">{project.project_name}</p>
              </div>
              
              <div>
                <h4 className="text-xs text-gray-500 font-medium mb-1">Adresse</h4>
                <p className="text-sm">{project.address}</p>
              </div>
            </div>
            
            {/* Middle column - Project info */}
            <div className="space-y-4">
              <div>
                <h4 className="text-xs text-gray-500 font-medium mb-1">Projektleder</h4>
                <p className="text-sm font-medium">
                  {project.team?.[0]?.name || 'Ikke tildelt'}
                </p>
              </div>
              
              <div>
                <h4 className="text-xs text-gray-500 font-medium mb-1">Projekttype</h4>
                <div>{getTypeBadge(project.type)}</div>
              </div>
              
              <div>
                <h4 className="text-xs text-gray-500 font-medium mb-1">Status</h4>
                <div>{getStatusBadge(project.status)}</div>
              </div>
              
              <div>
                <h4 className="text-xs text-gray-500 font-medium mb-1">Påbegyndt</h4>
                <div className="flex items-center space-x-4">
                  <Progress value={project.progress} className="h-2 w-24" />
                  <span className="text-sm font-medium">{project.progress}%</span>
                  <span className="text-xs text-gray-500">
                    {project.progress === 100 ? 'Afsluttet' : 'Aktiv'}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Right column - Description and details */}
            <div className="space-y-4">
              <div>
                <h4 className="text-xs text-gray-500 font-medium mb-1">Beskrivelse</h4>
                <p className="text-sm line-clamp-4">{project.description}</p>
              </div>
              
              <div>
                <h4 className="text-xs text-gray-500 font-medium mb-1">Tidsplan</h4>
                <p className="text-sm">{formatDateRange(project.start_date, project.end_date)}</p>
              </div>
              
              <div>
                <h4 className="text-xs text-gray-500 font-medium mb-1">Kontraktsum</h4>
                <p className="text-sm font-medium">{formatCurrency(project.budget)}</p>
              </div>
              
              <div>
                <h4 className="text-xs text-gray-500 font-medium mb-1">Kontaktperson</h4>
                <p className="text-sm">{project.contact_person}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

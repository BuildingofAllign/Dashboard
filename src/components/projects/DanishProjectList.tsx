
import React from 'react';
import { format, parseISO } from 'date-fns';
import { da } from 'date-fns/locale';
import { 
  Calendar, 
  MapPin, 
  Phone, 
  User, 
  Briefcase, 
  FileText, 
  CreditCard, 
  Building 
} from 'lucide-react';
import { Project } from '@/hooks/projects-types';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ProjectTag } from '@/components/ui/ProjectTag';
import { Separator } from '@/components/ui/separator';
import { PriorityIndicator } from '@/components/ui/PriorityIndicator';
import { formatCurrency } from '@/lib/date-utils';

interface DanishProjectListProps {
  projects: Project[];
}

export const DanishProjectList: React.FC<DanishProjectListProps> = ({ projects }) => {
  // Function to format currency in Danish format
  const formatCurrency = (amount: number | undefined) => {
    if (!amount && amount !== 0) return 'Ikke angivet';
    return new Intl.NumberFormat('da-DK', {
      style: 'currency',
      currency: 'DKK',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Function to format date range
  const formatDateRange = (startDate?: string, endDate?: string) => {
    if (!startDate && !endDate) return 'Ingen datoer';
    if (startDate && !endDate) return `Fra ${formatDate(startDate)}`;
    if (!startDate && endDate) return `Til ${formatDate(endDate)}`;
    
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  // Function to format a single date
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = parseISO(dateString);
    return format(date, 'd. MMMM yyyy', { locale: da });
  };

  // Function to determine the status badge color
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'aktiv':
        return <Badge className="bg-green-500 text-white hover:bg-green-600">Aktiv</Badge>;
      case 'problem':
        return <Badge className="bg-red-500 text-white hover:bg-red-600">Problem</Badge>;
      case 'udfordring':
        return <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">Udfordring</Badge>;
      case 'afsluttet':
        return <Badge className="bg-gray-500 text-white hover:bg-gray-600">Afsluttet</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Function to get the type badge
  const getTypeBadge = (type: string) => {
    const bgColor = type.toLowerCase() === 'fagtilsyn' ? 'bg-blue-500' : 'bg-orange-500';
    return <Badge className={`${bgColor} text-white hover:opacity-90`}>{type}</Badge>;
  };

  // Function to get priority indicator based on priority
  const getPriorityIndicator = (priority: string) => {
    let priorityValue: "red" | "yellow" | "green" | "grey" = "grey";
    
    if (priority.toLowerCase() === 'høj') priorityValue = "red";
    else if (priority.toLowerCase() === 'mellem') priorityValue = "yellow";
    else if (priority.toLowerCase() === 'lav') priorityValue = "green";
    
    return <PriorityIndicator priority={priorityValue} showLabel={true} />;
  };

  return (
    <div className="space-y-6">
      {projects.map((project) => (
        <div 
          key={project.id} 
          className="bg-white rounded-lg shadow-md border overflow-hidden hover:shadow-lg transition-shadow duration-200"
        >
          {/* Project header with name and badges */}
          <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white p-5">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold">{project.name}</h3>
                <p className="text-gray-300 mt-1">#{project.project_id}</p>
              </div>
              <div className="flex space-x-2">
                {getStatusBadge(project.status)}
                {getTypeBadge(project.type)}
              </div>
            </div>
          </div>
          
          {/* Project content grid */}
          <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column - Customer info */}
            <div className="space-y-5">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">Kundeoplysninger</h4>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Building className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium">{project.customer || 'Ikke angivet'}</p>
                      <p className="text-sm text-gray-500">Kunde</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <User className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium">{project.contact_person || 'Ikke angivet'}</p>
                      <p className="text-sm text-gray-500">Kontaktperson</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium">{project.address || 'Ikke angivet'}</p>
                      <p className="text-sm text-gray-500">Adresse</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">Projektdetaljer</h4>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Briefcase className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium">{project.project_name || project.name}</p>
                      <p className="text-sm text-gray-500">Projektnavn</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium">{formatDateRange(project.start_date, project.end_date)}</p>
                      <p className="text-sm text-gray-500">Tidsplan</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <CreditCard className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium">{formatCurrency(project.budget)}</p>
                      <p className="text-sm text-gray-500">Budget</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Middle column - Project status and progress */}
            <div className="space-y-5">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">Status</h4>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-full">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">Fremgang</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <Progress 
                        value={project.progress} 
                        className="h-2.5 w-full" 
                        indicatorClassName={cn(
                          project.status.toLowerCase() === 'problem' && "bg-red-500",
                          project.status.toLowerCase() === 'udfordring' && "bg-yellow-500",
                          project.status.toLowerCase() === 'aktiv' && "bg-green-500",
                          project.status.toLowerCase() === 'afsluttet' && "bg-blue-500",
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-full">
                      <div className="flex justify-between mb-2 items-center">
                        <span className="font-medium">Prioritet</span>
                        <div>{getPriorityIndicator(project.priority || "")}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-full">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">Kategori</span>
                        <ProjectTag 
                          label={project.category} 
                          type="category" 
                          className="uppercase"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">Team</h4>
                
                <div className="space-y-3">
                  {project.team && project.team.length > 0 ? (
                    project.team.map((member, index) => (
                      <div key={index} className="flex items-center p-3 rounded-md bg-gray-50 border">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white mr-3"
                          style={{ backgroundColor: member.color || '#6366F1' }}
                        >
                          {member.initials}
                        </div>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-xs text-gray-500">{member.role || 'Teammedlem'}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">Ingen teammedlemmer tildelt</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Right column - Description and details */}
            <div className="space-y-5">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">Beskrivelse</h4>
                
                <div className="bg-gray-50 p-4 rounded-md border">
                  <p className="text-gray-700 whitespace-pre-line">
                    {project.description || 'Ingen beskrivelse tilgængelig'}
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">Dokumenter og bilag</h4>
                
                <div className="space-y-3">
                  {/* Example document items - static for now */}
                  <div className="flex items-center p-3 rounded-md bg-gray-50 border hover:bg-gray-100 cursor-pointer transition-colors">
                    <FileText className="h-5 w-5 text-blue-500 mr-3" />
                    <div>
                      <p className="font-medium">Projektbeskrivelse</p>
                      <p className="text-xs text-gray-500">PDF - 2.5 MB</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 rounded-md bg-gray-50 border hover:bg-gray-100 cursor-pointer transition-colors">
                    <FileText className="h-5 w-5 text-green-500 mr-3" />
                    <div>
                      <p className="font-medium">Tidsplan</p>
                      <p className="text-xs text-gray-500">XLSX - 1.2 MB</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 rounded-md bg-gray-50 border hover:bg-gray-100 cursor-pointer transition-colors">
                    <FileText className="h-5 w-5 text-orange-500 mr-3" />
                    <div>
                      <p className="font-medium">Kontrakt</p>
                      <p className="text-xs text-gray-500">PDF - 3.8 MB</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Project footer */}
          <div className="bg-gray-50 p-4 border-t flex justify-between items-center">
            <div className="text-sm text-gray-500">
              <span>Oprettet: {formatDate(project.created_at)}</span>
              {project.updated_at && project.updated_at !== project.created_at && (
                <span> · Opdateret: {formatDate(project.updated_at)}</span>
              )}
            </div>
            
            <div className="flex space-x-2">
              <Badge variant="outline" className="bg-white">
                ID: {project.id.substring(0, 8)}
              </Badge>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

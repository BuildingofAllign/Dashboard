
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
  Building,
  Download
} from 'lucide-react';
import { Project } from '@/hooks/projects-types';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ProjectTag } from '@/components/ui/ProjectTag';
import { Separator } from '@/components/ui/separator';
import { PriorityIndicator } from '@/components/ui/PriorityIndicator';
import { Button } from '@/components/ui/button';

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

  // Function to get priority indicator based on priority
  const getPriorityIndicator = (priority: string) => {
    let priorityValue: "red" | "yellow" | "green" | "grey" = "grey";
    
    if (priority.toLowerCase() === 'høj') priorityValue = "red";
    else if (priority.toLowerCase() === 'mellem') priorityValue = "yellow";
    else if (priority.toLowerCase() === 'lav') priorityValue = "green";
    
    return <PriorityIndicator priority={priorityValue} showLabel={true} />;
  };

  return (
    <div className="space-y-8">
      {projects.map((project) => (
        <div 
          key={project.id} 
          className="bg-card rounded-lg shadow-md border overflow-hidden hover:shadow-lg transition-shadow duration-200"
        >
          {/* Project header with name and badges */}
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
          
          {/* Project content grid */}
          <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column - Customer info */}
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
            </div>
            
            {/* Middle column - Project status and progress */}
            <div className="space-y-5">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Status</h4>
                
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
                          project.status.toLowerCase() === 'problem' && "bg-amber-500",
                          project.status.toLowerCase() === 'udfordring' && "bg-yellow-500",
                          project.status.toLowerCase() === 'aktiv' && "bg-blue-500",
                          project.status.toLowerCase() === 'afsluttet' && "bg-green-500",
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
                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Team</h4>
                
                <div className="space-y-3">
                  {project.team && project.team.length > 0 ? (
                    project.team.map((member, index) => (
                      <div key={index} className="flex items-center p-3 rounded-md bg-muted/20 border">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white mr-3"
                          style={{ backgroundColor: member.color || '#6366F1' }}
                        >
                          {member.initials}
                        </div>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.role || 'Teammedlem'}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground italic">Ingen teammedlemmer tildelt</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Right column - Description and details */}
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
            </div>
          </div>
          
          {/* Project footer */}
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
        </div>
      ))}
    </div>
  );
};

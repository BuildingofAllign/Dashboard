
import React from "react";
import { Button } from "@/components/ui/button";

type TeamMember = {
  initials: string;
  color: string;
};

type Project = {
  id: number;
  name: string;
  type: string;
  status: "igangværende" | "planlagt" | "afsluttet";
  progress: number;
  team?: TeamMember[];
  additionalTeamMembers?: number;
  deviations?: number;
  additions?: number;
  qualityAssurance?: number;
  communicationTools?: string[];
  startDate?: string;
  endDate?: string;
  completionDate?: string;
  duration?: string;
};

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  // Helper to determine status badge color
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "igangværende":
        return "bg-green-100 text-green-800";
      case "planlagt":
        return "bg-yellow-100 text-yellow-800";
      case "afsluttet":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  // Helper to determine progress bar color
  const getProgressBarClass = (status: string) => {
    switch (status) {
      case "igangværende":
        return "bg-green-600";
      case "planlagt":
        return "bg-yellow-500";
      case "afsluttet":
        return "bg-gray-600";
      default:
        return "bg-blue-600";
    }
  };

  // Helper for Danish status text
  const getStatusText = (status: string) => {
    switch (status) {
      case "igangværende":
        return "Igangværende";
      case "planlagt":
        return "Planlagt";
      case "afsluttet":
        return "Afsluttet";
      default:
        return status;
    }
  };

  // Different card content based on status
  const renderCardContent = () => {
    if (project.status === "planlagt") {
      return (
        <>
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <span className="text-xs text-gray-500 ml-2">Tildel medarbejdere</span>
          </div>
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="text-xs font-medium text-gray-700">Fremgang</span>
              <span className="text-xs font-medium text-gray-700">{project.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className={`${getProgressBarClass(project.status)} h-2 rounded-full`} style={{ width: `${project.progress}%` }}></div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-2 mt-2">
            <p className="text-sm text-gray-600">Planlagt start: {project.startDate}</p>
            <p className="text-sm text-gray-600">Forventet afslutning: {project.endDate}</p>
            <Button variant="outline" className="mt-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Redigér projektdetaljer
            </Button>
          </div>
        </>
      );
    } else if (project.status === "afsluttet") {
      return (
        <>
          <div className="flex items-center mb-4">
            {project.team?.map((member, index) => (
              <div key={index} className={`w-8 h-8 rounded-full ${member.color} flex items-center justify-center text-white text-xs mr-2`}>
                {member.initials}
              </div>
            ))}
          </div>
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="text-xs font-medium text-gray-700">Fremgang</span>
              <span className="text-xs font-medium text-gray-700">{project.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className={`${getProgressBarClass(project.status)} h-2 rounded-full`} style={{ width: `${project.progress}%` }}></div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-2 mt-2">
            <p className="text-sm text-gray-600">Afsluttet: {project.completionDate}</p>
            <p className="text-sm text-gray-600">Varighed: {project.duration}</p>
            <Button variant="outline" className="mt-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Se slutrapport
            </Button>
          </div>
        </>
      );
    } else {
      // Default for active projects
      return (
        <>
          <div className="flex items-center mb-4">
            {project.team?.map((member, index) => (
              <div key={index} className={`w-8 h-8 rounded-full ${member.color} flex items-center justify-center text-white text-xs mr-2`}>
                {member.initials}
              </div>
            ))}
            {project.additionalTeamMembers && project.additionalTeamMembers > 0 && (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs">
                +{project.additionalTeamMembers}
              </div>
            )}
          </div>
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="text-xs font-medium text-gray-700">Fremgang</span>
              <span className="text-xs font-medium text-gray-700">{project.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className={`${getProgressBarClass(project.status)} h-2 rounded-full`} style={{ width: `${project.progress}%` }}></div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
            <div className="flex flex-col items-center p-2 rounded-lg bg-gray-50">
              <span className="font-medium text-gray-800">{project.deviations}</span>
              <span>Afvigelser</span>
            </div>
            <div className="flex flex-col items-center p-2 rounded-lg bg-gray-50">
              <span className="font-medium text-gray-800">{project.additions}</span>
              <span>Tillæg</span>
            </div>
            <div className="flex flex-col items-center p-2 rounded-lg bg-gray-50">
              <span className="font-medium text-gray-800">{project.qualityAssurance}%</span>
              <span>KS</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            {project.communicationTools?.includes("meet") && (
              <button className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="text-red-500 mr-2">
                  <path fill="currentColor" d="M19.7,11h-1.5v-1c0-0.6-0.4-1-1-1h-7.5c-0.6,0-1,0.4-1,1v4c0,0.6,0.4,1,1,1h7.5c0.6,0,1-0.4,1-1v-1h1.5c0.6,0,1-0.4,1-1v-1C20.7,11.4,20.3,11,19.7,11z" />
                  <path fill="currentColor" d="M4.3,13v-2c0-0.6,0.4-1,1-1h1.5v4H5.3C4.7,14,4.3,13.6,4.3,13z" />
                </svg>
                <span className="text-xs font-medium">Meet</span>
              </button>
            )}
            {project.communicationTools?.includes("teams") && (
              <button className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="text-blue-600 mr-2">
                  <path fill="currentColor" d="M19.2,6.4C19.2,5.1,18.1,4,16.8,4h-4c-1.3,0-2.4,1.1-2.4,2.4v3.2c0,1.3,1.1,2.4,2.4,2.4h4c1.3,0,2.4-1.1,2.4-2.4V6.4z" />
                  <path fill="currentColor" d="M12,11.8V20c0,0,0,0-0.1,0c-2.3-0.9-4.3-2.4-5.9-4.4V9.4C7,9.2,8.2,9,9.4,9h0.3C9.5,10,10.7,11.5,12,11.8z" />
                </svg>
                <span className="text-xs font-medium">Teams</span>
              </button>
            )}
            {project.communicationTools?.includes("zoom") && (
              <button className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="text-blue-500 mr-2">
                  <path fill="currentColor" d="M16.6,9.4L16.6,9.4L16.6,9.4c0.2-0.1,0.4-0.1,0.6-0.1c0.7,0,1.3,0.6,1.3,1.3v4.4c0,0.7-0.6,1.3-1.3,1.3c-0.2,0-0.4,0-0.6-0.1l0,0l0,0L14,15V9L16.6,9.4z" />
                  <path fill="currentColor" d="M12,8H6.7C5.7,8,5,8.7,5,9.7v4.7c0,0.9,0.7,1.7,1.7,1.7H12c0.9,0,1.7-0.7,1.7-1.7V9.7C13.7,8.7,12.9,8,12,8z" />
                </svg>
                <span className="text-xs font-medium">Zoom</span>
              </button>
            )}
          </div>
        </>
      );
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm overflow-hidden ${project.status === 'afsluttet' ? 'opacity-75' : ''}`}>
      <div className="p-5 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">{project.name}</h3>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(project.status)}`}>
            {getStatusText(project.status)}
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-1">{project.type}</p>
      </div>
      <div className="p-5">
        {renderCardContent()}
      </div>
    </div>
  );
};

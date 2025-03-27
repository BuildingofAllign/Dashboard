
import React, { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { SearchBar } from "@/components/ui/SearchBar";
import { FilterSelect, FilterButton } from "@/components/ui/FilterButton";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { AddProjectCard } from "@/components/projects/AddProjectCard";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

// Project data
const projects = [
  {
    id: 1,
    name: "Projekt Skovvej 12",
    type: "Nybyggeri - Villa",
    status: "igangværende" as const,
    progress: 75,
    team: [
      { initials: "JP", color: "bg-indigo-600" },
      { initials: "BS", color: "bg-red-500" },
      { initials: "MN", color: "bg-yellow-500" },
    ],
    additionalTeamMembers: 3,
    deviations: 12,
    additions: 4,
    qualityAssurance: 85,
    communicationTools: ["meet", "teams", "zoom"],
  },
  {
    id: 2,
    name: "Projekt Havnegade 8",
    type: "Renovering - Kontorbygning",
    status: "igangværende" as const,
    progress: 45,
    team: [
      { initials: "KL", color: "bg-green-600" },
      { initials: "TS", color: "bg-purple-500" },
    ],
    additionalTeamMembers: 4,
    deviations: 8,
    additions: 2,
    qualityAssurance: 60,
    communicationTools: ["meet", "teams", "zoom"],
  },
  {
    id: 3,
    name: "Projekt Stationsvej 23",
    type: "Tilbygning - Institition",
    status: "igangværende" as const,
    progress: 90,
    team: [
      { initials: "MN", color: "bg-blue-600" },
      { initials: "PH", color: "bg-orange-500" },
      { initials: "JA", color: "bg-indigo-500" },
    ],
    additionalTeamMembers: 2,
    deviations: 5,
    additions: 1,
    qualityAssurance: 95,
    communicationTools: ["meet", "teams", "zoom"],
  },
  {
    id: 4,
    name: "Projekt Bredgade 45",
    type: "Nybyggeri - Erhverv",
    status: "planlagt" as const,
    progress: 0,
    startDate: "01-06-2025",
    endDate: "01-12-2025",
  },
  {
    id: 5,
    name: "Projekt Købmagergade 18",
    type: "Renovering - Butik",
    status: "afsluttet" as const,
    progress: 100,
    team: [
      { initials: "LT", color: "bg-green-600" },
      { initials: "OH", color: "bg-indigo-500" },
    ],
    completionDate: "15-03-2025",
    duration: "8 måneder",
  }
];

const Projects = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredProjects = projects.filter(
    (project) => {
      // Search filter
      const matchesSearch = 
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.type.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Type filter
      const matchesType = typeFilter === "all" || 
        project.type.toLowerCase().includes(typeFilter.toLowerCase());
      
      // Status filter
      const matchesStatus = statusFilter === "all" || 
        project.status.toLowerCase() === statusFilter.toLowerCase();
      
      return matchesSearch && matchesType && matchesStatus;
    }
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Header title="Projekter" userInitials="BL" />

        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <SearchBar
              placeholder="Søg efter projekt..."
              onChange={setSearchQuery}
            />
            <div className="flex space-x-2 mt-4 md:mt-0">
              <FilterSelect 
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">Alle typer</option>
                <option value="nybyggeri">Nybyggeri</option>
                <option value="renovering">Renovering</option>
                <option value="tilbygning">Tilbygning</option>
              </FilterSelect>
              <FilterSelect
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Alle status</option>
                <option value="igangværende">Igangværende</option>
                <option value="planlagt">Planlagt</option>
                <option value="afsluttet">Afsluttet</option>
              </FilterSelect>
              <Button className="flex items-center">
                <Plus className="h-5 w-5 mr-1" />
                Nyt Projekt
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
            <AddProjectCard />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Projects;

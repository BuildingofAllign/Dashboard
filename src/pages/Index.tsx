
import React, { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { SearchBar } from "@/components/ui/SearchBar";
import { FilterSelect } from "@/components/ui/FilterButton";
import { EmployeeCard } from "@/components/employees/EmployeeCard";

const employees = [
  {
    initials: "JP",
    name: "Jens Paulsen",
    role: "Håndværker - Tømrer",
    status: "online" as const,
    project: "Skovvej 12",
    phone: "+45 20 23 34 45",
    communicationTools: ["meet", "teams", "zoom"],
  },
  {
    initials: "BS",
    name: "Boktogan Saruhan",
    role: "Håndværker - Elektriker",
    status: "online" as const,
    project: "Havnegade 8",
    phone: "+45 31 45 56 67",
    communicationTools: ["meet", "teams", "zoom"],
  },
  {
    initials: "MN",
    name: "Mette Nielsen",
    role: "Ingeniør",
    status: "busy" as const,
    project: "Stationsvej 23",
    phone: "+45 28 34 45 56",
    communicationTools: ["meet"],
  },
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");

  const filteredEmployees = employees.filter(
    (employee) => {
      // Search filter
      const matchesSearch = 
        employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.project.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Role filter
      const matchesRole = roleFilter === "all" || 
        employee.role.toLowerCase().includes(roleFilter.toLowerCase());
      
      // Project filter
      const matchesProject = projectFilter === "all" || 
        employee.project === projectFilter;
      
      return matchesSearch && matchesRole && matchesProject;
    }
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Header title="Medarbejdere" userInitials="BL" />

        <div className="p-6 pb-0">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <SearchBar
              placeholder="Søg efter medarbejder..."
              onChange={setSearchQuery}
            />
            <div className="flex space-x-2 mt-4 md:mt-0">
              <FilterSelect 
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">Alle roller</option>
                <option value="håndværker">Håndværker</option>
                <option value="byggeleder">Byggeleder</option>
                <option value="ingeniør">Ingeniør</option>
              </FilterSelect>
              <FilterSelect
                onChange={(e) => setProjectFilter(e.target.value)}
              >
                <option value="all">Alle projekter</option>
                <option value="Skovvej 12">Projekt Skovvej 12</option>
                <option value="Havnegade 8">Projekt Havnegade 8</option>
                <option value="Stationsvej 23">Projekt Stationsvej 23</option>
              </FilterSelect>
            </div>
          </div>
        </div>

        <div className="p-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployees.map((employee, index) => (
              <EmployeeCard key={index} {...employee} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;

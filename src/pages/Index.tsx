
import React, { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { SearchBar } from "@/components/ui/SearchBar";
import { FilterButton } from "@/components/ui/FilterButton";
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

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.project.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1">
        <Header title="Medarbejdere" userInitials="BL" />

        <div className="flex justify-between mt-6 px-6 py-0 max-sm:flex-col max-sm:gap-4">
          <SearchBar
            placeholder="Søg efter medarbejder..."
            onChange={setSearchQuery}
          />
          <div className="flex gap-2 max-sm:w-full">
            <FilterButton>Alle roller</FilterButton>
            <FilterButton>Alle projekter</FilterButton>
          </div>
        </div>

        <div className="flex gap-6 flex-wrap p-6 max-md:flex-col">
          {filteredEmployees.map((employee, index) => (
            <EmployeeCard key={index} {...employee} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;

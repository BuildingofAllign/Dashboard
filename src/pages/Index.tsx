
import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { SearchBar } from "@/components/ui/SearchBar";
import { FilterSelect } from "@/components/ui/FilterButton";
import { EmployeeCard } from "@/components/employees/EmployeeCard";
import { useData } from "@/context/DataContext";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ComboboxOption } from "@/components/ui/Combobox";

const Index = () => {
  const { employees, loadingEmployees, fetchEmployees } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const filteredEmployees = employees.filter(
    (employee) => {
      // Search filter
      const matchesSearch = 
        employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (employee.project && employee.project.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Role filter
      const matchesRole = roleFilter === "all" || 
        employee.role.toLowerCase().includes(roleFilter.toLowerCase());
      
      // Project filter
      const matchesProject = projectFilter === "all" || 
        employee.project === projectFilter;
      
      return matchesSearch && matchesRole && matchesProject;
    }
  );

  // Get unique projects for filter dropdown
  const uniqueProjects = [...new Set(employees.map(emp => emp.project))].filter(Boolean);
  
  // Get unique roles for filter dropdown
  const uniqueRoles = [...new Set(employees.map(emp => emp.role))].filter(Boolean);
  
  // Create ComboboxOption arrays for our filters
  const roleOptions: ComboboxOption[] = [
    { value: "all", label: "Alle roller" },
    ...uniqueRoles.map(role => ({ value: role, label: role }))
  ];
  
  const projectOptions: ComboboxOption[] = [
    { value: "all", label: "Alle projekter" },
    ...uniqueProjects.map(project => ({ value: project, label: `Projekt ${project}` }))
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-100">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <Header title="Medarbejdere" userInitials="BL" />

          <div className="p-6 pb-0">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <SearchBar
                placeholder="Søg efter medarbejder..."
                onChange={setSearchQuery}
                value={searchQuery}
              />
              <div className="flex space-x-2 mt-4 md:mt-0">
                <FilterSelect 
                  options={roleOptions}
                  value={roleFilter}
                  onValueChange={setRoleFilter}
                  className="min-w-[150px]"
                />
                <FilterSelect
                  options={projectOptions}
                  value={projectFilter}
                  onValueChange={setProjectFilter}
                  className="min-w-[180px]"
                />
              </div>
            </div>
          </div>

          <div className="p-6 pt-0">
            {loadingEmployees ? (
              <div className="flex justify-center items-center h-64">
                <LoadingSpinner size="lg" />
              </div>
            ) : filteredEmployees.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEmployees.map((employee, index) => (
                  <EmployeeCard 
                    key={employee.id || index} 
                    initials={employee.initials} 
                    name={employee.name}
                    role={employee.role}
                    status={employee.status}
                    project={employee.project}
                    phone={employee.phone}
                    communicationTools={employee.employee_communication_tools?.map(tool => tool.tool) || []}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">Ingen medarbejdere fundet med de valgte filtre.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;

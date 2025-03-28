
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './components/ui/ThemeProvider';
import { Toaster } from './components/ui/toaster';
import { DataProvider } from './context/DataContext';
import { TooltipProvider } from './components/ui/tooltip';
import { SidebarProvider } from './components/ui/sidebar';
import { Sidebar } from './components/layout/Sidebar';
import { SidebarTrigger } from './components/ui/sidebar';
import { CommandPaletteProvider } from './components/ui/CommandPalette';

// Pages
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import Afvigelser from './pages/Afvigelser';
import Kvalitetssikring from './pages/Kvalitetssikring';
import Tegninger from './pages/Tegninger';
import Tillagsopgaver from './pages/Tillagsopgaver';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import Index from './pages/Index';

// Configure the query client with better error handling and caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/projekter" element={<Projects />} />
      <Route path="/projekter/:id" element={<ProjectDetails />} />
      <Route path="/afvigelser" element={<Afvigelser />} />
      <Route path="/kvalitetssikring" element={<Kvalitetssikring />} />
      <Route path="/tegninger" element={<Tegninger />} />
      <Route path="/tillagsopgaver" element={<Tillagsopgaver />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function AppContent() {
  return (
    <div className="flex h-screen w-full bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto p-0">
        <div className="p-4 md:hidden">
          <SidebarTrigger />
        </div>
        <AppRoutes />
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <DataProvider>
          <TooltipProvider>
            <Router>
              <SidebarProvider>
                <CommandPaletteProvider>
                  <AppContent />
                  <Toaster />
                </CommandPaletteProvider>
              </SidebarProvider>
            </Router>
          </TooltipProvider>
        </DataProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

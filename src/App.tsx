
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './components/ui/ThemeProvider';
import { Toaster } from './components/ui/toaster';

// Pages
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import Afvigelser from './pages/Afvigelser';
import Kvalitetssikring from './pages/Kvalitetssikring';
import Tegninger from './pages/Tegninger';
import Tillagsopgaver from './pages/Tillagsopgaver';
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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/project/:id" element={<ProjectDetails />} />
            <Route path="/afvigelser" element={<Afvigelser />} />
            <Route path="/kvalitetssikring" element={<Kvalitetssikring />} />
            <Route path="/tegninger" element={<Tegninger />} />
            <Route path="/tillagsopgaver" element={<Tillagsopgaver />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

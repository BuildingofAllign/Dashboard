
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Tegninger from "./pages/Tegninger";
import Dashboard from "./pages/Dashboard";
import Afvigelser from "./pages/Afvigelser";
import Tillagsopgaver from "./pages/Tillagsopgaver";
import Kvalitetssikring from "./pages/Kvalitetssikring";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/projekter" element={<Projects />} />
          <Route path="/projekter/:id" element={<ProjectDetails />} />
          <Route path="/tegninger" element={<Tegninger />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/afvigelser" element={<Afvigelser />} />
          <Route path="/tillagsopgaver" element={<Tillagsopgaver />} />
          <Route path="/kvalitetssikring" element={<Kvalitetssikring />} />
          <Route path="/indstillinger" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

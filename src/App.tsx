import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/i18n/LanguageContext";
import Index from "./pages/Index";
import ExpertProfile from "./pages/ExpertProfile";
import Dashboard from "./pages/Dashboard";
import Team from "./pages/Team";
import Tasks from "./pages/Tasks";
import Alerts from "./pages/Alerts";
import Reports from "./pages/Reports";
import Marketplace from "./pages/Marketplace";
import Settings from "./pages/Settings";
import Pricing from "./pages/Pricing";
import AgentWorkspace from "./pages/AgentWorkspace";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Marketing pages — transparent overlay navbar */}
            <Route path="/" element={<Index />} />
            <Route path="/pricing" element={<Pricing />} />

            {/* App pages — sidebar layout */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/team" element={<Team />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/expert/:id" element={<ExpertProfile />} />
            <Route path="/workspace/:agentId" element={<AgentWorkspace />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

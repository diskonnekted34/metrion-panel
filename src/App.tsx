import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { RBACProvider } from "@/contexts/RBACContext";
import { PackProvider } from "@/contexts/PackContext";
import { IntegrationProvider } from "@/contexts/IntegrationContext";
import { ActionModeProvider } from "@/contexts/ActionModeContext";
import { TenantProvider } from "@/core/store/TenantContext";
import Index from "./pages/Index";
import ExpertProfile from "./pages/ExpertProfile";
import Dashboard from "./pages/Dashboard";
import Team from "./pages/Team";
import Kadro from "./pages/Kadro";
import Tasks from "./pages/Tasks";
import Alerts from "./pages/Alerts";
import AlertDetail from "./pages/AlertDetail";
import Reports from "./pages/Reports";
import ReportViewer from "./pages/ReportViewer";
import Marketplace from "./pages/Marketplace";
import Settings from "./pages/Settings";
import Pricing from "./pages/Pricing";
import AgentWorkspace from "./pages/AgentWorkspace";
import Departments from "./pages/Departments";
import DepartmentDetail from "./pages/DepartmentDetail";
import DepartmentReports from "./pages/DepartmentReports";
import DepartmentActions from "./pages/DepartmentActions";
import DepartmentModules from "./pages/DepartmentModules";
import DepartmentIntelligenceView from "./pages/DepartmentIntelligenceView";
import DataSources from "./pages/DataSources";
import ActionCenter from "./pages/ActionCenter";
import CreativeWorkspace from "./pages/CreativeWorkspace";
import IntelligenceView from "./pages/IntelligenceView";
import DecisionLab from "./pages/DecisionLab";
import TechDataSources from "./pages/TechDataSources";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <RBACProvider>
        <TenantProvider>
        <PackProvider>
        <IntegrationProvider>
        <ActionModeProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Marketing pages — transparent overlay navbar */}
              <Route path="/" element={<Index />} />
              <Route path="/pricing" element={<Pricing />} />

              {/* App pages — sidebar layout */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/departments" element={<Departments />} />
              <Route path="/departments/:deptId" element={<DepartmentDetail />} />
              <Route path="/departments/:deptId/reports" element={<DepartmentReports />} />
              <Route path="/departments/:deptId/actions" element={<DepartmentActions />} />
              <Route path="/departments/:deptId/modules" element={<DepartmentModules />} />
              <Route path="/departments/:deptId/intelligence/:metricId" element={<DepartmentIntelligenceView />} />
              <Route path="/team" element={<Team />} />
              <Route path="/kadro" element={<Kadro />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/alerts/:alertId" element={<AlertDetail />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/reports/:reportId" element={<ReportViewer />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/data-sources" element={<DataSources />} />
              <Route path="/tech-data-sources" element={<TechDataSources />} />
              <Route path="/action-center" element={<ActionCenter />} />
              <Route path="/decision-lab" element={<DecisionLab />} />
              <Route path="/creative-workspace" element={<CreativeWorkspace />} />
              <Route path="/intelligence/:clusterId" element={<IntelligenceView />} />
              <Route path="/expert/:id" element={<ExpertProfile />} />
              <Route path="/workspace/:agentId" element={<AgentWorkspace />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ActionModeProvider>
        </IntegrationProvider>
        </PackProvider>
        </TenantProvider>
        </RBACProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

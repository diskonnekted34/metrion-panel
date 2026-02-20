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
import { OKRProvider } from "@/core/store/OKRContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { PageMetaProvider } from "@/contexts/PageMetaContext";
import Index from "./pages/Index";
import ExpertProfile from "./pages/ExpertProfile";
import Dashboard from "./pages/Dashboard";
import Kadro from "./pages/Kadro";
import SeatDetail from "./pages/SeatDetail";
import Strategy from "./pages/Strategy";
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
import TechIntegrationDetail from "./pages/TechIntegrationDetail";
import OKRPage from "./pages/OKR";
import IntegrationDetail from "./pages/IntegrationDetail";
import PositionHistory from "./pages/PositionHistory";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <ThemeProvider>
        <RBACProvider>
        <TenantProvider>
        <PackProvider>
        <IntegrationProvider>
        <OKRProvider>
        <ActionModeProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <PageMetaProvider>
            <Routes>
              {/* Marketing pages */}
              <Route path="/" element={<Index />} />
              <Route path="/pricing" element={<Pricing />} />

              {/* Main navigation (7 items) */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/strategy" element={<Strategy />} />
              <Route path="/decision-lab" element={<DecisionLab />} />
              <Route path="/action-center" element={<ActionCenter />} />
              <Route path="/data-sources" element={<DataSources />} />
              <Route path="/data-sources/:integrationId" element={<IntegrationDetail />} />
              <Route path="/tech-data-sources" element={<TechDataSources />} />
              <Route path="/tech-data-sources/:connectorId" element={<TechIntegrationDetail />} />
              <Route path="/kadro" element={<Kadro />} />
              <Route path="/seat/:seatKey" element={<SeatDetail />} />
              <Route path="/settings" element={<Settings />} />

              {/* Supporting pages */}
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/alerts/:alertId" element={<AlertDetail />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/reports/:reportId" element={<ReportViewer />} />
              <Route path="/okr" element={<OKRPage />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/departments" element={<Departments />} />
              <Route path="/departments/:deptId" element={<DepartmentDetail />} />
              <Route path="/departments/:deptId/reports" element={<DepartmentReports />} />
              <Route path="/departments/:deptId/actions" element={<DepartmentActions />} />
              <Route path="/departments/:deptId/modules" element={<DepartmentModules />} />
              <Route path="/departments/:deptId/intelligence/:metricId" element={<DepartmentIntelligenceView />} />
              <Route path="/creative-workspace" element={<CreativeWorkspace />} />
              <Route path="/intelligence/:clusterId" element={<IntelligenceView />} />
              <Route path="/expert/:id" element={<ExpertProfile />} />
              <Route path="/workspace/:agentId" element={<AgentWorkspace />} />
              <Route path="/executive/position-history" element={<PositionHistory />} />
              {/* Legacy redirects */}
              <Route path="/command-structure" element={<Kadro />} />
              <Route path="/team" element={<Kadro />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </PageMetaProvider>
          </BrowserRouter>
        </ActionModeProvider>
        </OKRProvider>
        </IntegrationProvider>
        </PackProvider>
        </TenantProvider>
        </RBACProvider>
        </ThemeProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

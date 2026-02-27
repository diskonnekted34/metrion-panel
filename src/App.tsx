import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProviders } from "@/contexts/AppProviders";
import { PageMetaProvider } from "@/contexts/PageMetaContext";
import AppErrorBoundary from "@/components/system/AppErrorBoundary";
import Index from "./pages/Index";
import ExpertProfile from "./pages/ExpertProfile";
import Dashboard from "./pages/Dashboard";
import Kadro from "./pages/Kadro";
import Organization from "./pages/Organization";
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
import Analysis from "./pages/Analysis";
import TechDataSources from "./pages/TechDataSources";
import TechIntegrationDetail from "./pages/TechIntegrationDetail";
import OKRPage from "./pages/OKR";
import IntegrationDetail from "./pages/IntegrationDetail";
import PositionHistory from "./pages/PositionHistory";
import DevDebug from "./pages/DevDebug";
import NotFound from "./pages/NotFound";

const App = () => (
  <AppProviders>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <AppErrorBoundary>
        <PageMetaProvider>
          <Routes>
            {/* Marketing pages */}
            <Route path="/" element={<Index />} />
            <Route path="/pricing" element={<Pricing />} />

            {/* Main navigation */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/strategy" element={<Strategy />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/decision-lab" element={<DecisionLab />} />
            <Route path="/action-center" element={<ActionCenter />} />
            <Route path="/data-sources" element={<DataSources />} />
            <Route path="/data-sources/:integrationId" element={<IntegrationDetail />} />
            <Route path="/tech-data-sources" element={<TechDataSources />} />
            <Route path="/tech-data-sources/:connectorId" element={<TechIntegrationDetail />} />
            <Route path="/organization" element={<Organization />} />
            <Route path="/kadro" element={<Organization />} />
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
            <Route path="/command-structure" element={<Organization />} />
            <Route path="/team" element={<Organization />} />

            {/* Dev-only debug panel */}
            {import.meta.env.DEV && (
              <Route path="/dev-debug" element={<DevDebug />} />
            )}

            <Route path="*" element={<NotFound />} />
          </Routes>
        </PageMetaProvider>
      </AppErrorBoundary>
    </BrowserRouter>
  </AppProviders>
);

export default App;

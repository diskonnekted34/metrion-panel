import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProviders } from "@/contexts/AppProviders";
import { PageMetaProvider } from "@/contexts/PageMetaContext";
import AppErrorBoundary from "@/components/system/AppErrorBoundary";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Public pages
import Index from "./pages/Index";
import Pricing from "./pages/Pricing";
import Checkout from "./pages/Checkout";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import CheckoutFailure from "./pages/CheckoutFailure";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyEmail from "./pages/VerifyEmail";

// App pages (protected)
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
import ExpertProfile from "./pages/ExpertProfile";
import Onboarding from "./pages/Onboarding";
import DevDebug from "./pages/DevDebug";
import NotFound from "./pages/NotFound";

const P = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>{children}</ProtectedRoute>
);

const App = () => (
  <AppProviders>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <AppErrorBoundary>
        <PageMetaProvider>
          <Routes>
            {/* Public / marketing */}
            <Route path="/" element={<Index />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/checkout/success" element={<CheckoutSuccess />} />
            <Route path="/checkout/failure" element={<CheckoutFailure />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/onboarding" element={<Onboarding />} />

            {/* Protected app routes */}
            <Route path="/dashboard" element={<P><Dashboard /></P>} />
            <Route path="/strategy" element={<P><Strategy /></P>} />
            <Route path="/analysis" element={<P><Analysis /></P>} />
            <Route path="/decision-lab" element={<P><DecisionLab /></P>} />
            <Route path="/action-center" element={<P><ActionCenter /></P>} />
            <Route path="/data-sources" element={<P><DataSources /></P>} />
            <Route path="/data-sources/:integrationId" element={<P><IntegrationDetail /></P>} />
            <Route path="/tech-data-sources" element={<P><TechDataSources /></P>} />
            <Route path="/tech-data-sources/:connectorId" element={<P><TechIntegrationDetail /></P>} />
            <Route path="/organization" element={<P><Organization /></P>} />
            <Route path="/kadro" element={<P><Organization /></P>} />
            <Route path="/seat/:seatKey" element={<P><SeatDetail /></P>} />
            <Route path="/settings" element={<P><Settings /></P>} />
            <Route path="/alerts" element={<P><Alerts /></P>} />
            <Route path="/alerts/:alertId" element={<P><AlertDetail /></P>} />
            <Route path="/tasks" element={<P><Tasks /></P>} />
            <Route path="/reports" element={<P><Reports /></P>} />
            <Route path="/reports/:reportId" element={<P><ReportViewer /></P>} />
            <Route path="/okr" element={<P><OKRPage /></P>} />
            <Route path="/marketplace" element={<P><Marketplace /></P>} />
            <Route path="/departments" element={<P><Departments /></P>} />
            <Route path="/departments/:deptId" element={<P><DepartmentDetail /></P>} />
            <Route path="/departments/:deptId/reports" element={<P><DepartmentReports /></P>} />
            <Route path="/departments/:deptId/actions" element={<P><DepartmentActions /></P>} />
            <Route path="/departments/:deptId/modules" element={<P><DepartmentModules /></P>} />
            <Route path="/departments/:deptId/intelligence/:metricId" element={<P><DepartmentIntelligenceView /></P>} />
            <Route path="/creative-workspace" element={<P><CreativeWorkspace /></P>} />
            <Route path="/intelligence/:clusterId" element={<P><IntelligenceView /></P>} />
            <Route path="/expert/:id" element={<P><ExpertProfile /></P>} />
            <Route path="/workspace/:agentId" element={<P><AgentWorkspace /></P>} />
            <Route path="/executive/position-history" element={<P><PositionHistory /></P>} />
            <Route path="/command-structure" element={<P><Organization /></P>} />
            <Route path="/team" element={<P><Organization /></P>} />

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

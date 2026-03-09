import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProviders } from "@/contexts/AppProviders";
import { PageMetaProvider } from "@/contexts/PageMetaContext";
import AppErrorBoundary from "@/components/system/AppErrorBoundary";
import { AuthorizedRoute } from "@/components/auth/AuthorizedRoute";
import { lazy, Suspense } from "react";
import PageLoading from "@/components/ui/PageLoading";

// Public pages (eager — small)
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";

// Lazy-loaded public pages
const Pricing = lazy(() => import("./pages/Pricing"));
const Checkout = lazy(() => import("./pages/Checkout"));
const CheckoutSuccess = lazy(() => import("./pages/CheckoutSuccess"));
const CheckoutFailure = lazy(() => import("./pages/CheckoutFailure"));
const Onboarding = lazy(() => import("./pages/Onboarding"));

// Lazy-loaded protected pages
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Organization = lazy(() => import("./pages/Organization"));
const SeatDetail = lazy(() => import("./pages/SeatDetail"));
const Strategy = lazy(() => import("./pages/Strategy"));
const Tasks = lazy(() => import("./pages/Tasks"));
const Alerts = lazy(() => import("./pages/Alerts"));
const AlertDetail = lazy(() => import("./pages/AlertDetail"));
const Reports = lazy(() => import("./pages/Reports"));
const ReportViewer = lazy(() => import("./pages/ReportViewer"));
const Marketplace = lazy(() => import("./pages/Marketplace"));
const Settings = lazy(() => import("./pages/Settings"));
const AgentWorkspace = lazy(() => import("./pages/AgentWorkspace"));
const Departments = lazy(() => import("./pages/Departments"));
const DepartmentDetail = lazy(() => import("./pages/DepartmentDetail"));
const DepartmentReports = lazy(() => import("./pages/DepartmentReports"));
const DepartmentActions = lazy(() => import("./pages/DepartmentActions"));
const DepartmentModules = lazy(() => import("./pages/DepartmentModules"));
const DepartmentIntelligenceView = lazy(() => import("./pages/DepartmentIntelligenceView"));
const DataSources = lazy(() => import("./pages/DataSources"));
const ActionCenter = lazy(() => import("./pages/ActionCenter"));
const CreativeWorkspace = lazy(() => import("./pages/CreativeWorkspace"));
const IntelligenceView = lazy(() => import("./pages/IntelligenceView"));
const DecisionLab = lazy(() => import("./pages/DecisionLab"));
const Analysis = lazy(() => import("./pages/Analysis"));
const TechDataSources = lazy(() => import("./pages/TechDataSources"));
const TechIntegrationDetail = lazy(() => import("./pages/TechIntegrationDetail"));
const OKRPage = lazy(() => import("./pages/OKR"));
const IntegrationDetail = lazy(() => import("./pages/IntegrationDetail"));
const PositionHistory = lazy(() => import("./pages/PositionHistory"));
const ExpertProfile = lazy(() => import("./pages/ExpertProfile"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Dev-only
const DevDebug = lazy(() => import("./pages/DevDebug"));

const P = ({ children }: { children: React.ReactNode }) => (
  <AuthorizedRoute>{children}</AuthorizedRoute>
);

const SuspenseWrap = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoading label="Yükleniyor…" rows={3} />}>
    {children}
  </Suspense>
);

const App = () => (
  <AppProviders>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <AppErrorBoundary>
        <PageMetaProvider>
          <SuspenseWrap>
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
              <Route path="/reset-password" element={<ResetPassword />} />
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
          </SuspenseWrap>
        </PageMetaProvider>
      </AppErrorBoundary>
    </BrowserRouter>
  </AppProviders>
);

export default App;

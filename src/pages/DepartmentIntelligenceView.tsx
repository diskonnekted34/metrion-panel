import { useParams, Navigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { useRBAC, type DepartmentId } from "@/contexts/RBACContext";
import { usePacks } from "@/contexts/PackContext";
import { getMetricIntelligence } from "@/data/intelligenceMetrics";
import IntelligenceContextBar from "@/components/intelligence/IntelligenceContextBar";
import IntelligenceMainView from "@/components/intelligence/IntelligenceMainView";
import IntelligenceSidePanel from "@/components/intelligence/IntelligenceSidePanel";
import IntelligenceDeepTabs from "@/components/intelligence/IntelligenceDeepTabs";

const DepartmentIntelligenceView = () => {
  const { deptId, metricId } = useParams<{ deptId: string; metricId: string }>();
  const { departments, hasAccessToDepartment } = useRBAC();
  const { isDepartmentUnlocked } = usePacks();

  const dept = departments.find(d => d.id === deptId);
  if (!dept) return <Navigate to="/departments" />;
  if (!isDepartmentUnlocked(dept.id as DepartmentId) || !hasAccessToDepartment(dept.id as DepartmentId)) {
    return <Navigate to={`/departments/${deptId}`} />;
  }

  const metric = metricId ? getMetricIntelligence(deptId as DepartmentId, metricId) : undefined;
  if (!metric) return <Navigate to={`/departments/${deptId}`} />;

  return (
    <AppLayout>
      <div className="p-4 md:p-6 max-w-[1400px] mx-auto">
        {/* Context Bar */}
        <IntelligenceContextBar metric={metric} dept={dept} />

        {/* Main Content: Left 70% + Right 30% */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4 mt-4">
          {/* Left - Metric Deep View */}
          <IntelligenceMainView metric={metric} />

          {/* Right - Intelligence Panel */}
          <IntelligenceSidePanel metric={metric} deptId={deptId!} />
        </div>

        {/* Bottom Deep Analysis Tabs */}
        <IntelligenceDeepTabs metric={metric} />
      </div>
    </AppLayout>
  );
};

export default DepartmentIntelligenceView;

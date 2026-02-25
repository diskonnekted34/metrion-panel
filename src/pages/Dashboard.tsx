import AppLayout from "@/components/AppLayout";
import { useIsMobile } from "@/hooks/use-mobile";
import StatusStrip from "@/components/dashboard/StatusStrip";
import KPIWall from "@/components/dashboard/KPIWall";
import InterventionPanel from "@/components/dashboard/InterventionPanel";
import RiskConsole from "@/components/dashboard/RiskConsole";
import DepartmentTable from "@/components/dashboard/DepartmentTable";
import DecisionImpactTable from "@/components/dashboard/DecisionImpactTable";
import ExecutiveHealth from "@/components/dashboard/ExecutiveHealth";

const Dashboard = () => {
  const isMobile = useIsMobile();

  return (
    <AppLayout>
      <div className={`${isMobile ? "p-4 max-w-lg" : "p-5 max-w-[1600px]"} mx-auto`}>
        {/* 1. Executive Status Strip */}
        {!isMobile && <StatusStrip onInboxClick={() => {
          document.getElementById("intervention-panel")?.scrollIntoView({ behavior: "smooth" });
        }} />}

        {/* 1. KPI Wall + Executive Health (3:1) */}
        <div className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-4"} gap-4 mb-5 items-stretch`}>
          <div className="lg:col-span-3 flex flex-col">
            <KPIWall />
          </div>
          <div className="flex flex-col">
            <ExecutiveHealth />
          </div>
        </div>

        {/* 2. Intervention Panel + Risk Console — side by side */}
        <div className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"} gap-4 mb-5`} id="intervention-panel">
          <InterventionPanel />
          <RiskConsole />
        </div>

        {/* 3. Department Table */}
        <div className="mb-5">
          <DepartmentTable />
        </div>

        {/* 4. Decision Impact Table */}
        <div className="mb-5">
          <DecisionImpactTable />
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;

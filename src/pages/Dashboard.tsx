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

        {/* 2. KPI Wall + Intervention Panel */}
        <div className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-12"} gap-4 mb-5`}>
          <div className="lg:col-span-9">
            <KPIWall />
          </div>
          <div className="lg:col-span-3" id="intervention-panel">
            <InterventionPanel />
          </div>
        </div>

        {/* 3. Risk Console + Executive Health */}
        <div className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-12"} gap-4 mb-5`}>
          <div className="lg:col-span-8">
            <RiskConsole />
          </div>
          <div className="lg:col-span-4">
            <ExecutiveHealth />
          </div>
        </div>

        {/* 4. Department Table */}
        <div className="mb-5">
          <DepartmentTable />
        </div>

        {/* 5. Decision Impact Table */}
        <div className="mb-5">
          <DecisionImpactTable />
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;

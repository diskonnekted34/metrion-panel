import { motion } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import { useIsMobile } from "@/hooks/use-mobile";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import InsightBar from "@/components/dashboard/InsightBar";
import CompanyHealthScore from "@/components/CompanyHealthScore";
import TeamMatrix from "@/components/dashboard/TeamMatrix";
import PrioritizedTasks from "@/components/dashboard/PrioritizedTasks";
import WeeklyRhythm from "@/components/dashboard/WeeklyRhythm";
import ImpactSnapshot from "@/components/dashboard/ImpactSnapshot";
import DataSourceEmptyState from "@/components/dashboard/DataSourceEmptyState";

const Dashboard = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <AppLayout>
        <div className="p-4 max-w-lg mx-auto">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <DashboardHeader />
          </motion.div>
          <CompanyHealthScore />
          <InsightBar />
          <PrioritizedTasks />
          <TeamMatrix />
          <ImpactSnapshot />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <DashboardHeader />
        </motion.div>
        <InsightBar />
        <CompanyHealthScore />
        <TeamMatrix />
        <WeeklyRhythm />
        <PrioritizedTasks />
        <ImpactSnapshot />
        <DataSourceEmptyState />
      </div>
    </AppLayout>
  );
};

export default Dashboard;

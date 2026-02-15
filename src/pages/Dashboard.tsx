import { motion } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import { useIsMobile } from "@/hooks/use-mobile";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import IntegrationBanner from "@/components/dashboard/IntegrationBanner";
import ExecutiveSummary from "@/components/dashboard/ExecutiveSummary";
import IntelligenceTabs from "@/components/dashboard/IntelligenceTabs";
import TeamMatrix from "@/components/dashboard/TeamMatrix";
import WeeklyRhythm from "@/components/dashboard/WeeklyRhythm";

const Dashboard = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <AppLayout>
        <div className="p-4 max-w-lg mx-auto">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <DashboardHeader />
          </motion.div>
          <ExecutiveSummary />
          <IntelligenceTabs />
          <TeamMatrix />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <DashboardHeader />
        </motion.div>
        <IntegrationBanner />
        <ExecutiveSummary />
        <IntelligenceTabs />
        <TeamMatrix />
        <WeeklyRhythm />
      </div>
    </AppLayout>
  );
};

export default Dashboard;

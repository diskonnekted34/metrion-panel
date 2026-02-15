import { motion } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import { useIsMobile } from "@/hooks/use-mobile";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import IntegrationBanner from "@/components/dashboard/IntegrationBanner";
import PriorityInsights from "@/components/dashboard/PriorityInsights";
import IntelligenceLauncher from "@/components/dashboard/IntelligenceLauncher";
import ExecutiveSummary from "@/components/dashboard/ExecutiveSummary";
import IntelligenceClusters from "@/components/dashboard/IntelligenceClusters";
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
          <PriorityInsights />
          <IntelligenceLauncher />
          <ExecutiveSummary />
          <IntelligenceClusters />
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
        {/* Section 1: AI Priority Insights */}
        <PriorityInsights />
        {/* Section 2: Intelligence Launcher */}
        <IntelligenceLauncher />
        {/* Section 3+4: Executive Scores + Financial View */}
        <ExecutiveSummary />
        {/* Section 5: Intelligence Clusters */}
        <IntelligenceClusters />
        {/* Section 6: AI Team Status Matrix */}
        <TeamMatrix />
        {/* Section 7: Weekly Executive Rhythm */}
        <WeeklyRhythm />
      </div>
    </AppLayout>
  );
};

export default Dashboard;

import { motion } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import { useIsMobile } from "@/hooks/use-mobile";
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
        <IntegrationBanner />
        <PriorityInsights />
        <IntelligenceLauncher />
        <ExecutiveSummary />
        <IntelligenceClusters />
        <TeamMatrix />
        <WeeklyRhythm />
      </div>
    </AppLayout>
  );
};

export default Dashboard;

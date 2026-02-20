import AppLayout from "@/components/AppLayout";
import { useIsMobile } from "@/hooks/use-mobile";
import IntegrationBanner from "@/components/dashboard/IntegrationBanner";
import MerkezLayer1 from "@/components/dashboard/MerkezLayer1";
import MerkezLayer2 from "@/components/dashboard/MerkezLayer2";
import MerkezLayer3 from "@/components/dashboard/MerkezLayer3";

const Dashboard = () => {
  const isMobile = useIsMobile();

  return (
    <AppLayout>
      <div className={`${isMobile ? "p-4 max-w-lg" : "p-7 max-w-7xl"} mx-auto`}>
        {!isMobile && <IntegrationBanner />}
        <MerkezLayer1 />
        <MerkezLayer2 />
        <MerkezLayer3 />
      </div>
    </AppLayout>
  );
};

export default Dashboard;

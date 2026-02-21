import AppLayout from "@/components/AppLayout";
import { useIsMobile } from "@/hooks/use-mobile";
import IntegrationBanner from "@/components/dashboard/IntegrationBanner";
import ExecutiveStatusBar from "@/components/dashboard/ExecutiveStatusBar";
import CEOInbox from "@/components/dashboard/CEOInbox";
import RiskRadar from "@/components/dashboard/RiskRadar";
import ExecutiveHealth from "@/components/dashboard/ExecutiveHealth";
import CompanyPulse from "@/components/dashboard/CompanyPulse";
import DecisionImpact from "@/components/dashboard/DecisionImpact";
import AIBriefingPanel from "@/components/dashboard/AIBriefingPanel";
import { useState } from "react";

const Dashboard = () => {
  const isMobile = useIsMobile();
  const [scrollToInbox, setScrollToInbox] = useState(false);

  return (
    <AppLayout>
      <div className={`${isMobile ? "p-4 max-w-lg" : "p-7 max-w-7xl"} mx-auto`}>
        {!isMobile && <IntegrationBanner />}

        {/* 1. Executive Status Bar */}
        <ExecutiveStatusBar
          onHealthClick={() => {}}
          onInboxClick={() => {
            document.getElementById("ceo-inbox")?.scrollIntoView({ behavior: "smooth" });
          }}
        />

        {/* 2-column layout: Inbox+Risk+Health | Briefing */}
        <div className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-4"} gap-5 mb-6`}>
          {/* Left: Primary content */}
          <div className="lg:col-span-3 space-y-5">
            {/* 2. CEO Inbox (Primary) */}
            <div id="ceo-inbox">
              <CEOInbox />
            </div>

            {/* 3. Risk Radar */}
            <RiskRadar />

            {/* 4. Executive Health */}
            <ExecutiveHealth />
          </div>

          {/* Right: AI Briefing */}
          <div className="lg:col-span-1">
            <AIBriefingPanel />
          </div>
        </div>

        {/* 5. Company Pulse (Reduced KPIs) */}
        <div className="mb-6">
          <CompanyPulse />
        </div>

        {/* 6. Decision → Impact */}
        <div className="mb-6">
          <DecisionImpact />
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;

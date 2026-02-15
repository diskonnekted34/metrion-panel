import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, Settings2, Shield, LineChart } from "lucide-react";
import FinansTab from "./tabs/FinansTab";
import BuyumeTab from "./tabs/BuyumeTab";
import OperasyonTab from "./tabs/OperasyonTab";
import RiskTab from "./tabs/RiskTab";
import TahminlerTab from "./tabs/TahminlerTab";

const tabs = [
  { id: "finans", label: "Finans", icon: BarChart3 },
  { id: "buyume", label: "Büyüme", icon: TrendingUp },
  { id: "operasyon", label: "Operasyon", icon: Settings2 },
  { id: "risk", label: "Risk", icon: Shield },
  { id: "tahminler", label: "Tahminler", icon: LineChart },
];

const IntelligenceTabs = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
      <Tabs defaultValue="finans" className="w-full">
        <TabsList className="w-full bg-secondary/40 border border-border/50 rounded-2xl p-1 h-auto flex-wrap">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="flex-1 min-w-[100px] gap-1.5 rounded-xl py-2.5 text-xs font-medium data-[state=active]:bg-primary/15 data-[state=active]:text-primary data-[state=active]:shadow-none"
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="finans"><FinansTab /></TabsContent>
        <TabsContent value="buyume"><BuyumeTab /></TabsContent>
        <TabsContent value="operasyon"><OperasyonTab /></TabsContent>
        <TabsContent value="risk"><RiskTab /></TabsContent>
        <TabsContent value="tahminler"><TahminlerTab /></TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default IntelligenceTabs;

import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, Crown, Shield } from "lucide-react";
import AppLayout from "@/components/AppLayout";

// Lazy-loaded tab content
import DepartmentsTab from "@/components/organization/DepartmentsTab";
import KadroTab from "@/components/organization/KadroTab";
import PermissionsTab from "@/components/organization/PermissionsTab";

const TABS = [
  { key: "departments", label: "Departmanlar", icon: Building2 },
  { key: "kadro", label: "Kadro", icon: Crown },
  { key: "permissions", label: "Yetkiler", icon: Shield },
] as const;

type TabKey = typeof TABS[number]["key"];

const Organization = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get("tab") as TabKey) || "departments";
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  return (
    <AppLayout>
      <div className="min-h-screen relative">
        <div className="relative z-10 p-6 md:p-8 max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-lg font-bold text-foreground">Organizasyon</h1>
            <p className="text-[11px] text-muted-foreground">Departman yapısı, emir-komuta zinciri ve yetki yönetimi</p>
          </div>

          {/* Tab bar */}
          <div className="flex items-center gap-1 p-1 rounded-xl border border-border/40 bg-secondary/20 w-fit mb-8">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => handleTabChange(tab.key)}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-medium transition-all duration-200 ${
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="org-tab-bg"
                      className="absolute inset-0 rounded-lg bg-primary/10 border border-primary/20"
                      transition={{ duration: 0.2 }}
                    />
                  )}
                  <tab.icon className="h-3.5 w-3.5 relative z-10" />
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "departments" && <DepartmentsTab />}
            {activeTab === "kadro" && <KadroTab />}
            {activeTab === "permissions" && <PermissionsTab />}
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Organization;

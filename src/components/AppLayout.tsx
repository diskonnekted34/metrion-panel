import { ReactNode } from "react";
import AppSidebar from "./AppSidebar";
import BottomNav from "./BottomNav";
import GlobalTopBar from "./GlobalTopBar";
import { useIsMobile } from "@/hooks/use-mobile";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background relative">
      <AppSidebar />
      <BottomNav />
      <div
        className={`min-h-screen relative z-10 flex flex-col ${
          isMobile ? "pt-12 pb-20" : "pl-[290px]"
        }`}
      >
        <GlobalTopBar />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;

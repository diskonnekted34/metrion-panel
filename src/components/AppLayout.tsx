import { ReactNode } from "react";
import AppSidebar from "./AppSidebar";
import BottomNav from "./BottomNav";
import { useIsMobile } from "@/hooks/use-mobile";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <BottomNav />
      <main
        className={`min-h-screen ${
          isMobile ? "pt-12 pb-20" : "pl-[220px]"
        }`}
      >
        {children}
      </main>
    </div>
  );
};

export default AppLayout;

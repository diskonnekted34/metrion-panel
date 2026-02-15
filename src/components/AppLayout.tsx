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
    <div className="min-h-screen bg-background bg-grid relative">
      {/* Amorphic light blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] blob-cyan blob-move opacity-60" />
        <div className="absolute top-1/2 -left-48 w-[400px] h-[400px] blob-violet blob-move-2 opacity-50" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[300px] blob-mixed opacity-40" />
      </div>
      <AppSidebar />
      <BottomNav />
      <main
        className={`min-h-screen relative z-10 ${
          isMobile ? "pt-12 pb-20" : "pl-[220px]"
        }`}
      >
        {children}
      </main>
    </div>
  );
};

export default AppLayout;

import { motion } from "framer-motion";
import { Activity, AlertTriangle, Banknote, Inbox, Sparkles } from "lucide-react";

interface StatusItem {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
  onClick?: () => void;
}

interface ExecutiveStatusBarProps {
  onHealthClick: () => void;
  onInboxClick: () => void;
}

const ExecutiveStatusBar = ({ onHealthClick, onInboxClick }: ExecutiveStatusBarProps) => {
  const items: StatusItem[] = [
    { icon: Activity, label: "Health", value: "78", color: "22,199,132", onClick: onHealthClick },
    { icon: AlertTriangle, label: "Risk", value: "Medium", color: "245,158,11" },
    { icon: Banknote, label: "Runway", value: "9.4 ay", color: "0,229,255" },
    { icon: Inbox, label: "Inbox", value: "3 bekleyen", color: "239,68,68", onClick: onInboxClick },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-5"
    >
      <div
        className="flex flex-wrap items-center gap-3 px-5 py-3"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.4) 100%)",
          backdropFilter: "blur(20px)",
          border: "0.5px solid rgba(255,255,255,0.08)",
          borderRadius: "var(--radius-card, 16px)",
        }}
      >
        {items.map((item, i) => (
          <button
            key={item.label}
            onClick={item.onClick}
            className={`flex items-center gap-2 px-3.5 py-2 transition-all duration-200 ${
              item.onClick ? "hover:bg-white/[0.04] cursor-pointer" : "cursor-default"
            }`}
            style={{ borderRadius: "var(--radius-inner, 12px)" }}
          >
            <div
              className="h-7 w-7 flex items-center justify-center"
              style={{
                background: `rgba(${item.color},0.1)`,
                borderRadius: "var(--radius-inner, 12px)",
              }}
            >
              <item.icon className="h-3.5 w-3.5" style={{ color: `rgb(${item.color})` }} />
            </div>
            <div className="text-left">
              <p className="text-[0.55rem] text-muted-foreground/60 font-medium uppercase tracking-wider">{item.label}</p>
              <p className="text-[0.8rem] font-semibold text-foreground leading-none">{item.value}</p>
            </div>
            {i < items.length - 1 && (
              <div className="hidden sm:block ml-3 h-6 w-px" style={{ background: "rgba(255,255,255,0.06)" }} />
            )}
          </button>
        ))}

        {/* Today's Focus */}
        <div className="flex-1 min-w-0 flex items-center gap-2 pl-2">
          <Sparkles className="h-3.5 w-3.5 text-primary/60 shrink-0" />
          <p className="text-[0.7rem] text-muted-foreground truncate">
            2 onay ve 1 finansal risk dikkat gerektiriyor
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ExecutiveStatusBar;

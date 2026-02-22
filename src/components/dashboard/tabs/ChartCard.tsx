import { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  agent?: string;
  children: ReactNode;
  className?: string;
}

const ChartCard = ({ title, agent, children, className = "" }: ChartCardProps) => (
  <div className={`rounded-[14px] border border-border bg-card p-5 ${className}`}>
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {agent && (
        <span className="text-[9px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
          {agent}
        </span>
      )}
    </div>
    {children}
  </div>
);

export default ChartCard;

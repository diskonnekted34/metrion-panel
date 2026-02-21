/**
 * SecurityBadge — Visual indicator for policy-controlled entities.
 * Shows classification level and protection status.
 */

import { Shield, ShieldCheck, ShieldAlert, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { DataClassification } from "@/core/security/policy/types";

interface SecurityBadgeProps {
  classification?: DataClassification;
  showLabel?: boolean;
  size?: "sm" | "md";
}

const CONFIG: Record<DataClassification, {
  icon: typeof Shield;
  label: string;
  className: string;
  tooltip: string;
}> = {
  public: {
    icon: Shield,
    label: "Açık",
    className: "bg-muted/50 text-muted-foreground border-border",
    tooltip: "Bu veri herkese açıktır",
  },
  sensitive: {
    icon: ShieldCheck,
    label: "Hassas",
    className: "bg-amber-500/10 text-amber-500 border-amber-500/30",
    tooltip: "Hassas veri — Politika kontrolü altında",
  },
  secret: {
    icon: Lock,
    label: "Gizli",
    className: "bg-red-500/10 text-red-500 border-red-500/30",
    tooltip: "Gizli veri — Yalnızca yetkili erişim",
  },
};

export function SecurityBadge({ classification = "public", showLabel = true, size = "sm" }: SecurityBadgeProps) {
  const config = CONFIG[classification];
  const Icon = config.icon;
  const iconSize = size === "sm" ? 12 : 14;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge
          variant="outline"
          className={`${config.className} gap-1 cursor-help ${size === "sm" ? "text-[10px] px-1.5 py-0" : "text-xs px-2 py-0.5"}`}
        >
          <Icon className="shrink-0" style={{ width: iconSize, height: iconSize }} />
          {showLabel && <span>{config.label}</span>}
        </Badge>
      </TooltipTrigger>
      <TooltipContent side="top">
        <p className="text-xs">{config.tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
}

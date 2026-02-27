/**
 * Design Tokens — semantic constants for colors, risk levels, and department theming.
 * Use these instead of inline hex/hsl in components.
 * CSS custom properties are defined in index.css; these are JS-side companions.
 */

/** Department accent colors (HSL strings for style attributes) */
export const DEPT_COLORS: Record<string, string> = {
  executive: "hsl(220, 100%, 56%)",
  technology: "hsl(190, 90%, 50%)",
  marketing: "hsl(280, 70%, 55%)",
  finance: "hsl(160, 76%, 44%)",
  operations: "hsl(38, 92%, 50%)",
  creative: "hsl(330, 70%, 55%)",
  marketplace: "hsl(25, 85%, 55%)",
  legal: "hsl(210, 30%, 55%)",
  hr: "hsl(350, 65%, 55%)",
  sales: "hsl(140, 60%, 45%)",
} as const;

/** Risk level semantic colors (Tailwind classes) */
export const RISK_COLORS = {
  critical: "text-destructive bg-destructive/10 border-destructive/20",
  high: "text-destructive bg-destructive/10 border-destructive/20",
  medium: "text-warning bg-warning/10 border-warning/20",
  low: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  none: "text-muted-foreground bg-secondary border-border",
} as const;

/** Action risk color coding for Permission Matrix and governance UI */
export const ACTION_RISK_COLORS = {
  view: { bg: "bg-secondary", text: "text-muted-foreground", label: "Görüntüle" },
  create: { bg: "bg-primary/10", text: "text-primary", label: "Oluştur" },
  propose: { bg: "bg-primary/15", text: "text-primary", label: "Öner" },
  approve: { bg: "bg-warning/10", text: "text-warning", label: "Onayla" },
  execute: { bg: "bg-destructive/10", text: "text-destructive", label: "Yürüt" },
  admin: { bg: "bg-purple-500/10", text: "text-purple-400", label: "Yönet" },
} as const;

/** Health score thresholds */
export const HEALTH_THRESHOLDS = {
  good: 80,
  warning: 70,
} as const;

/** Agent status indicator colors (Tailwind classes) */
export const AGENT_STATUS_COLORS: Record<string, string> = {
  Monitoring: "bg-emerald-500",
  "Running Task": "bg-blue-500",
  Idle: "bg-muted-foreground/40",
  Alerting: "bg-destructive",
} as const;

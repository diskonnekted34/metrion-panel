/**
 * PageLoading — Full-page skeleton loader for async pages.
 * Matches dark premium UI with pulsing glass cards.
 */

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface PageLoadingProps {
  label?: string;
  rows?: number;
}

export default function PageLoading({ label = "Yükleniyor…", rows = 4 }: PageLoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 gap-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
        <p className="text-sm text-muted-foreground">{label}</p>
      </motion.div>

      {/* Skeleton cards */}
      <div className="w-full max-w-2xl space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card p-4 animate-pulse"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-muted/40" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-2/3 rounded bg-muted/40" />
                <div className="h-2.5 w-1/3 rounded bg-muted/30" />
              </div>
              <div className="w-16 h-6 rounded-full bg-muted/30" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

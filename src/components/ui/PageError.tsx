/**
 * PageError — Full-page error state with retry button.
 * Matches dark premium UI.
 */

import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageErrorProps {
  message?: string;
  onRetry?: () => void;
}

export default function PageError({
  message = "Veriler yüklenirken bir hata oluştu.",
  onRetry,
}: PageErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4 text-center max-w-sm"
      >
        <div className="w-14 h-14 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center">
          <AlertTriangle className="w-7 h-7 text-destructive" />
        </div>

        <div>
          <h3 className="text-base font-semibold text-foreground mb-1">Bir şeyler ters gitti</h3>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>

        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry} className="gap-2 mt-2">
            <RefreshCw className="w-3.5 h-3.5" />
            Tekrar Dene
          </Button>
        )}
      </motion.div>
    </div>
  );
}

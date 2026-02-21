/**
 * AuditTimeline — Drawer component showing audit log entries for an entity.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, X, Shield, ChevronRight } from "lucide-react";
import { auditLogger } from "@/core/engine/audit";

interface AuditTimelineProps {
  entityType: string;
  entityId: string;
  tenantId: string;
  isOpen: boolean;
  onClose: () => void;
}

const actionTypeLabels: Record<string, string> = {
  create: "Oluşturuldu",
  update: "Güncellendi",
  delete: "Silindi",
  approve: "Onaylandı",
  reject: "Reddedildi",
  override: "Override",
  execute: "Yürütüldü",
  rollback: "Geri Alındı",
  state_transition: "Durum Değişimi",
  login: "Giriş",
  logout: "Çıkış",
};

const AuditTimeline = ({ entityType, entityId, tenantId, isOpen, onClose }: AuditTimelineProps) => {
  const logs = auditLogger.query(tenantId, { entity_type: entityType, entity_id: entityId });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-[#0A0F1F] border-l border-white/[0.06] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-[#0A0F1F]/95 backdrop-blur-xl border-b border-white/[0.06] px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-semibold text-foreground">Denetim Günlüğü</h2>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {logs.length} kayıt
                </span>
              </div>
              <button onClick={onClose} className="h-8 w-8 rounded-lg hover:bg-secondary flex items-center justify-center">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="px-5 py-4 space-y-1">
              {logs.length === 0 ? (
                <div className="text-center py-12">
                  <History className="h-8 w-8 text-muted-foreground/20 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Henüz denetim kaydı yok.</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-1">
                    Komut katmanı üzerinden yapılan işlemler burada görünecek.
                  </p>
                </div>
              ) : (
                logs.map((log, i) => (
                  <div key={log.id} className="relative pl-6">
                    {/* Timeline line */}
                    {i < logs.length - 1 && (
                      <div className="absolute left-[9px] top-6 bottom-0 w-px bg-white/[0.06]" />
                    )}
                    {/* Dot */}
                    <div className={`absolute left-0 top-1.5 h-[18px] w-[18px] rounded-full flex items-center justify-center ${
                      log.action_type === "approve" ? "bg-emerald-400/15 border border-emerald-400/30" :
                      log.action_type === "reject" ? "bg-destructive/15 border border-destructive/30" :
                      log.action_type === "create" ? "bg-primary/15 border border-primary/30" :
                      "bg-secondary border border-white/[0.08]"
                    }`}>
                      <div className={`h-1.5 w-1.5 rounded-full ${
                        log.action_type === "approve" ? "bg-emerald-400" :
                        log.action_type === "reject" ? "bg-destructive" :
                        log.action_type === "create" ? "bg-primary" :
                        "bg-muted-foreground"
                      }`} />
                    </div>
                    {/* Content */}
                    <div className="pb-4">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-semibold text-foreground">
                          {actionTypeLabels[log.action_type] || log.action_type}
                        </span>
                        <span className="text-[9px] text-muted-foreground/60">
                          {new Date(log.created_at).toLocaleString("tr-TR")}
                        </span>
                      </div>
                      {log.reason && (
                        <p className="text-[10px] text-muted-foreground">{log.reason}</p>
                      )}
                      {log.before_snapshot && log.after_snapshot && (
                        <div className="mt-1.5 flex items-center gap-1.5 text-[9px]">
                          <span className="px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
                            {JSON.stringify(log.before_snapshot).slice(0, 40)}
                          </span>
                          <ChevronRight className="h-2.5 w-2.5 text-muted-foreground/40" />
                          <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                            {JSON.stringify(log.after_snapshot).slice(0, 40)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuditTimeline;

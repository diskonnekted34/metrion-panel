/**
 * Scope Configuration Modal — Configures scope for a permission cell.
 */

import { useState } from "react";
import { X, Globe, Building2, User, Tag, Armchair } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import type { ScopeType, DataClassificationTag } from "@/core/security/authorization/types";
import { CLASSIFICATION_LABELS } from "@/core/security/authorization/types";

const ALL_DEPARTMENTS = [
  { id: "executive", label: "Yönetim" },
  { id: "marketing", label: "Pazarlama" },
  { id: "finance", label: "Finans" },
  { id: "operations", label: "Operasyon" },
  { id: "technology", label: "Teknoloji" },
  { id: "hr", label: "İnsan Kaynakları" },
  { id: "sales", label: "Satış" },
  { id: "legal", label: "Hukuk" },
  { id: "creative", label: "Kreatif" },
];

const SCOPE_OPTIONS: { type: ScopeType; label: string; icon: typeof Globe; desc: string }[] = [
  { type: "org", label: "Organizasyon", icon: Globe, desc: "Tüm tenant geneli" },
  { type: "dept", label: "Departman", icon: Building2, desc: "Belirli departmanlar" },
  { type: "seat", label: "Kadro", icon: Armchair, desc: "Pozisyon bazlı" },
  { type: "self", label: "Kişisel", icon: User, desc: "Sadece kendi verisi" },
  { type: "tag", label: "Sınıflandırma", icon: Tag, desc: "Veri etiketine göre" },
];

const TAG_OPTIONS = Object.entries(CLASSIFICATION_LABELS) as [DataClassificationTag, string][];

export interface ScopeConfig {
  type: ScopeType;
  targets: string[];
}

interface ScopeConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (scope: ScopeConfig) => void;
  resource: string;
  action: string;
  roleName: string;
  initialScope?: ScopeConfig;
}

export default function ScopeConfigModal({
  isOpen,
  onClose,
  onConfirm,
  resource,
  action,
  roleName,
  initialScope,
}: ScopeConfigModalProps) {
  const [scopeType, setScopeType] = useState<ScopeType>(initialScope?.type ?? "org");
  const [targets, setTargets] = useState<string[]>(initialScope?.targets ?? []);

  const toggleTarget = (id: string) => {
    setTargets((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));
  };

  const handleConfirm = () => {
    onConfirm({ type: scopeType, targets: scopeType === "org" || scopeType === "self" ? [] : targets });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div className="rounded-2xl border border-border bg-popover p-6 shadow-2xl space-y-5">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Kapsam Ayarla</h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    <span className="text-primary font-medium">{roleName}</span> → {resource}.{action}
                  </p>
                </div>
                <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>

              {/* Scope type selection */}
              <div className="space-y-2">
                <p className="text-[11px] font-medium text-muted-foreground">Kapsam Tipi</p>
                <div className="grid grid-cols-2 gap-2">
                  {SCOPE_OPTIONS.map((opt) => (
                    <button
                      key={opt.type}
                      onClick={() => {
                        setScopeType(opt.type);
                        setTargets([]);
                      }}
                      className={`flex items-center gap-2.5 p-3 rounded-xl text-left transition-all text-xs ${
                        scopeType === opt.type
                          ? "bg-primary/10 border border-primary/30 text-foreground"
                          : "bg-muted/30 border border-transparent text-muted-foreground hover:bg-muted/50"
                      }`}
                    >
                      <opt.icon className="h-3.5 w-3.5 shrink-0" />
                      <div>
                        <p className="font-medium">{opt.label}</p>
                        <p className="text-[9px] opacity-70">{opt.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dept multi-select */}
              {scopeType === "dept" && (
                <div className="space-y-2">
                  <p className="text-[11px] font-medium text-muted-foreground">Departmanlar</p>
                  <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
                    {ALL_DEPARTMENTS.map((dept) => (
                      <label
                        key={dept.id}
                        className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-muted/30 cursor-pointer transition-colors"
                      >
                        <Checkbox
                          checked={targets.includes(dept.id)}
                          onCheckedChange={() => toggleTarget(dept.id)}
                        />
                        <span className="text-xs text-foreground">{dept.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Tag multi-select */}
              {scopeType === "tag" && (
                <div className="space-y-2">
                  <p className="text-[11px] font-medium text-muted-foreground">Sınıflandırma Etiketleri</p>
                  <div className="flex flex-wrap gap-2">
                    {TAG_OPTIONS.map(([tag, label]) => (
                      <button
                        key={tag}
                        onClick={() => toggleTarget(tag)}
                        className="transition-all"
                      >
                        <Badge
                          variant={targets.includes(tag) ? "default" : "outline"}
                          className="text-[10px] cursor-pointer"
                        >
                          {label}
                        </Badge>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:bg-muted/50 transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-4 py-2 rounded-xl text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Kaydet
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

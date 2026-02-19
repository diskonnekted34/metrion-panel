import { AlertTriangle, Shield, Zap } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useActionMode } from "@/contexts/ActionModeContext";
import { useRBAC } from "@/contexts/RBACContext";
import { Link } from "react-router-dom";

interface ActionModeToggleProps {
  integrationId: string;
  integrationName: string;
}

const ActionModeToggle = ({ integrationId, integrationName: _integrationName }: ActionModeToggleProps) => {
  const { isActionModeEnabled, toggleActionMode, pendingCount } = useActionMode();
  const { currentUser } = useRBAC();
  const enabled = isActionModeEnabled(integrationId);
  const isAdmin = currentUser.role === "owner" || currentUser.role === "admin";

  if (!isAdmin && !enabled) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className={`h-3.5 w-3.5 ${enabled ? "text-warning" : "text-muted-foreground"}`} />
          <span className="text-xs font-medium text-foreground">Aksiyon Modu</span>
          <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${
            enabled ? "bg-warning/15 text-warning" : "bg-secondary text-muted-foreground"
          }`}>
            {enabled ? "Yazma Erişimi" : "Salt Okunur"}
          </span>
        </div>
        {isAdmin ? (
          <Switch
            checked={enabled}
            onCheckedChange={(checked) => toggleActionMode(integrationId, checked)}
          />
        ) : (
          <span className="text-[10px] text-muted-foreground">Yalnızca Sahip/Yönetici değiştirebilir</span>
        )}
      </div>

      {enabled && (
        <div className="p-3 rounded-xl bg-warning/5 border border-warning/15 space-y-2">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-3.5 w-3.5 text-warning mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] text-warning font-medium">
                Aksiyon Modu kampanya oluşturabilir, düzenleyebilir ve bütçe harcayabilir.
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">
                Tüm aksiyonlar onay gerektirir. Doğrudan yayınlama yapılamaz.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 pt-1">
            <Shield className="h-3 w-3 text-success" />
            <span className="text-[10px] text-success">Çift onay sistemi aktif.</span>
          </div>
          {pendingCount > 0 && (
            <Link
              to="/action-center"
              className="flex items-center gap-1.5 text-[10px] text-primary hover:text-primary/80 transition-colors mt-1"
            >
              <Zap className="h-3 w-3" />
              {pendingCount} bekleyen aksiyon — Aksiyon Merkezi'ne git
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default ActionModeToggle;

/**
 * RedactedField — Displays masked/redacted values with optional reveal.
 * Reveal triggers a policy check and emits an audit event.
 */

import { useState } from "react";
import { Eye, EyeOff, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useSecurityPolicy } from "@/hooks/useSecurityPolicy";
import type { ResourceType } from "@/core/security/policy/types";

interface RedactedFieldProps {
  value: string;
  entityType: ResourceType;
  entityId: string;
  fieldName: string;
  /** If true, value is already a masked placeholder */
  isMasked?: boolean;
  className?: string;
}

export function RedactedField({
  value,
  entityType,
  entityId,
  fieldName,
  isMasked = false,
  className = "",
}: RedactedFieldProps) {
  const [revealed, setRevealed] = useState(false);
  const [denied, setDenied] = useState(false);
  const { revealField, maskValue: mask } = useSecurityPolicy();

  const displayValue = isMasked ? value : mask(value);

  const handleReveal = () => {
    const result = revealField(entityType, entityId, fieldName);
    if (result.allowed) {
      setRevealed(true);
      setDenied(false);
    } else {
      setDenied(true);
      setTimeout(() => setDenied(false), 2000);
    }
  };

  if (revealed) {
    return (
      <span className={`inline-flex items-center gap-1.5 ${className}`}>
        <span>{value}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5 text-muted-foreground hover:text-foreground"
          onClick={() => setRevealed(false)}
        >
          <EyeOff className="h-3 w-3" />
        </Button>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className="font-mono text-muted-foreground">{displayValue}</span>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={`h-5 w-5 ${denied ? "text-destructive" : "text-muted-foreground hover:text-foreground"}`}
            onClick={handleReveal}
          >
            {denied ? <ShieldAlert className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {denied ? "Erişim reddedildi" : "Değeri göster (denetim kaydı oluşturulur)"}
        </TooltipContent>
      </Tooltip>
    </span>
  );
}

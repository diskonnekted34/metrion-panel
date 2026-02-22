/**
 * Premium dark error fallback — prevents white-screen-of-death.
 */
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { useNavigate } from "react-router-dom";
import { useState, type ReactNode } from "react";
import { AlertTriangle, RotateCcw, Home, ChevronDown } from "lucide-react";

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const err = error as Error | undefined;
  const [showStack, setShowStack] = useState(false);
  let navigate: ReturnType<typeof useNavigate> | null = null;
  try {
    navigate = useNavigate();
  } catch {
    /* outside router — no navigate available */
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "#000" }}>
      <div
        className="w-full max-w-md p-8 text-center"
        style={{
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(18px)",
          border: "0.5px solid rgba(255,255,255,0.08)",
          borderRadius: "var(--radius-card, 16px)",
        }}
      >
        <div className="mx-auto mb-5 h-12 w-12 rounded-full flex items-center justify-center" style={{ background: "rgba(239,68,68,0.12)" }}>
          <AlertTriangle className="h-6 w-6" style={{ color: "#EF4444" }} />
        </div>

        <h2 className="text-xl font-semibold text-foreground mb-2">Bir şey ters gitti</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Beklenmeyen bir hata oluştu. Lütfen yeniden deneyin.
        </p>

        <div className="flex items-center justify-center gap-3 mb-4">
          <button
            onClick={resetErrorBoundary}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium btn-primary"
            style={{ borderRadius: "var(--radius-inner, 12px)" }}
          >
            <RotateCcw className="h-4 w-4" />
            Yeniden Dene
          </button>
          {navigate && (
            <button
              onClick={() => { navigate!("/dashboard"); resetErrorBoundary(); }}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium btn-accent"
              style={{ borderRadius: "var(--radius-inner, 12px)" }}
            >
              <Home className="h-4 w-4" />
              Ana Sayfa
            </button>
          )}
        </div>

        {import.meta.env.DEV && err?.stack && (
          <div className="mt-4 text-left">
            <button
              onClick={() => setShowStack((s) => !s)}
              className="flex items-center gap-1 text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
            >
              <ChevronDown className={`h-3 w-3 transition-transform ${showStack ? "rotate-180" : ""}`} />
              Hata Detayı
            </button>
            {showStack && (
              <pre className="mt-2 p-3 text-[0.6rem] leading-relaxed text-destructive/70 overflow-auto max-h-48 rounded-lg" style={{ background: "rgba(239,68,68,0.06)" }}>
                {err?.stack}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface Props {
  children: ReactNode;
}

export default function AppErrorBoundary({ children }: Props) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      {children}
    </ErrorBoundary>
  );
}

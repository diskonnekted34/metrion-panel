import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { apiGet, ApiError } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { Bug, Play, CheckCircle2, XCircle, Loader2 } from "lucide-react";

type TestStatus = "idle" | "loading" | "success" | "error";

const DevDebug = () => {
  const [status, setStatus] = useState<TestStatus>("idle");
  const [result, setResult] = useState<string>("");

  const useMock = import.meta.env.VITE_USE_MOCK;
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "(not set)";

  const handleTestApi = async () => {
    setStatus("loading");
    setResult("");
    try {
      const res = await apiGet<unknown>(API_ROUTES.governance.decisions);
      setStatus("success");
      setResult(JSON.stringify(res, null, 2).slice(0, 2000));
    } catch (err) {
      setStatus("error");
      if (err instanceof ApiError) {
        setResult(`ApiError ${err.status}: ${err.message}`);
      } else if (err instanceof Error) {
        setResult(err.message);
      } else {
        setResult("Unknown error");
      }
    }
  };

  return (
    <AppLayout>
      <div className="p-6 max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Bug className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-bold text-foreground">Dev Debug Panel</h1>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-warning/10 text-warning border border-warning/20 font-mono">DEV ONLY</span>
        </div>

        {/* Environment Variables */}
        <div className="glass-card p-5 space-y-3">
          <h2 className="text-sm font-semibold text-foreground">Environment</h2>
          <div className="grid grid-cols-[140px_1fr] gap-2 text-xs">
            <span className="text-muted-foreground font-mono">VITE_USE_MOCK</span>
            <span className={`font-mono font-bold ${useMock === "true" ? "text-warning" : "text-emerald-400"}`}>
              {useMock ?? "(undefined)"}
            </span>
            <span className="text-muted-foreground font-mono">VITE_API_BASE_URL</span>
            <span className="font-mono text-foreground">{baseUrl}</span>
          </div>
        </div>

        {/* API Test */}
        <div className="glass-card p-5 space-y-4">
          <h2 className="text-sm font-semibold text-foreground">API Connection Test</h2>
          <p className="text-[11px] text-muted-foreground">
            Calls <code className="px-1.5 py-0.5 rounded bg-secondary text-foreground font-mono text-[10px]">GET {API_ROUTES.governance.decisions}</code>
          </p>
          <button
            onClick={handleTestApi}
            disabled={status === "loading"}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors disabled:opacity-50"
          >
            {status === "loading" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
            Test API
          </button>

          {status === "success" && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-emerald-400/5 border border-emerald-400/15">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <pre className="text-[10px] text-emerald-400 font-mono whitespace-pre-wrap overflow-auto max-h-60">{result}</pre>
            </div>
          )}

          {status === "error" && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-destructive/5 border border-destructive/15">
              <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
              <pre className="text-[10px] text-destructive font-mono whitespace-pre-wrap">{result}</pre>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default DevDebug;

import { useState } from "react";
import { FileText, Clock, ChevronRight, Send } from "lucide-react";
import { decisionDrafts, type DecisionDraft } from "@/data/strategyMock";
import { Badge } from "@/components/ui/badge";

type Filter = "all" | "my" | "review";

const DecisionQueue = ({ onOpenBuilder }: { onOpenBuilder: () => void }) => {
  const [filter, setFilter] = useState<Filter>("all");
  const [drafts, setDrafts] = useState<DecisionDraft[]>(decisionDrafts);

  const filtered = filter === "all" ? drafts
    : filter === "review" ? drafts.filter(d => d.status === "review")
    : drafts.filter(d => d.owner === "Ahmet Yılmaz");

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: "Tümü" },
    { id: "my", label: "Taslaklarım" },
    { id: "review", label: "İnceleme" },
  ];

  return (
    <div className="bg-card border border-border rounded-[14px] p-5 flex flex-col h-full flex-1">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">Karar Taslakları</h2>
          <p className="text-[10px] text-muted-foreground mt-0.5">Onay bekleyen karar taslakları.</p>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">
          {drafts.length} taslak
        </span>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-3">
        {filters.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-colors ${
              filter === f.id ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-2 flex-1">
        {filtered.map(d => (
          <div key={d.id} className="p-3 rounded-xl bg-secondary/30 border border-border hover:border-primary/20 transition-colors group">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium text-foreground truncate">{d.title}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  {d.tags.map(t => (
                    <span key={t} className="text-[8px] px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground">{t}</span>
                  ))}
                  <span className="text-[9px] text-muted-foreground">· %{d.confidence}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button className="text-[10px] text-primary hover:underline flex items-center gap-0.5">
                  Aç <ChevronRight className="h-2.5 w-2.5" />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-[9px] text-muted-foreground flex items-center gap-1">
                <Clock className="h-2.5 w-2.5" /> {d.lastEdited} · {d.owner}
              </span>
              <button
                disabled={d.status === "draft"}
                className="text-[9px] px-2 py-0.5 rounded-md bg-primary/10 text-primary disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-0.5 hover:bg-primary/20 transition-colors"
              >
                <Send className="h-2.5 w-2.5" /> Gönder
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Audit trail */}
      <div className="mt-3 pt-3 border-t border-border">
        <p className="text-[9px] text-muted-foreground">
          Son değişiklik: Ahmet Yılmaz · 12 dk önce
        </p>
      </div>
    </div>
  );
};

export default DecisionQueue;

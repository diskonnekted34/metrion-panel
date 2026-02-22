/**
 * Deterministic mock data for the Merkez dashboard.
 * Each TimeRange has a fixed dataset — no random jitter.
 */
import type { CompanySnapshot, TimeRange, KpiCard } from "@/types/dashboard";

const SERIES_D = (base: number[]) =>
  base.map((v, i) => ({ t: `2024-03-${String(i + 1).padStart(2, "0")}`, v }));
const SERIES_W = (base: number[]) =>
  base.map((v, i) => ({ t: `W${i + 1}`, v }));
const SERIES_M = (base: number[]) =>
  base.map((v, i) => ({ t: `${["Oca","Şub","Mar","Nis","May","Haz","Tem"][i]}`, v }));
const SERIES_Y = (base: number[]) =>
  base.map((v, i) => ({ t: `${2018 + i}`, v }));

const seriesFn: Record<TimeRange, (b: number[]) => { t: string; v: number }[]> = {
  D: SERIES_D, W: SERIES_W, M: SERIES_M, Y: SERIES_Y,
};

interface KpiSeed {
  id: string;
  title: string;
  datasets: Record<TimeRange, { values: number[]; value: string; delta: string; trend: "up"|"down"|"flat"; min: string; max: string }>;
}

const seeds: KpiSeed[] = [
  {
    id: "revenue", title: "Gelir (MRR)",
    datasets: {
      D: { values: [238,240,242,241,243,244,240], value: "$240K", delta: "+0.8%", trend: "up", min: "$238K", max: "$244K" },
      W: { values: [215,225,230,235,238,242,240], value: "$240K", delta: "+5.8%", trend: "up", min: "$215K", max: "$242K" },
      M: { values: [180,195,210,220,230,235,240], value: "$2.4M", delta: "+12.4%", trend: "up", min: "$180K", max: "$240K" },
      Y: { values: [120,140,165,185,200,220,240], value: "$2.4M", delta: "+28.6%", trend: "up", min: "$120K", max: "$240K" },
    },
  },
  {
    id: "profit", title: "Net Kâr",
    datasets: {
      D: { values: [48,50,49,51,52,53,52], value: "$52K", delta: "+2.1%", trend: "up", min: "$48K", max: "$53K" },
      W: { values: [42,44,46,48,50,51,52], value: "$52K", delta: "+8.3%", trend: "up", min: "$42K", max: "$52K" },
      M: { values: [35,38,42,45,48,50,52], value: "$520K", delta: "+15.6%", trend: "up", min: "$35K", max: "$52K" },
      Y: { values: [20,28,32,38,42,48,52], value: "$520K", delta: "+42.1%", trend: "up", min: "$20K", max: "$52K" },
    },
  },
  {
    id: "margin", title: "Katkı Marjı",
    datasets: {
      D: { values: [41.8,42,42.1,42,42.2,42.1,42.1], value: "%42.1", delta: "+0.3pp", trend: "up", min: "%41.8", max: "%42.2" },
      W: { values: [40.5,41,41.5,41.8,42,42.1,42.1], value: "%42.1", delta: "+1.6pp", trend: "up", min: "%40.5", max: "%42.1" },
      M: { values: [38,39,40,40.8,41.2,41.8,42.1], value: "%42.1", delta: "+1.3pp", trend: "up", min: "%38", max: "%42.1" },
      Y: { values: [35,36.5,38,39.5,40.5,41.5,42.1], value: "%42.1", delta: "+3.1pp", trend: "up", min: "%35", max: "%42.1" },
    },
  },
  {
    id: "runway", title: "Runway",
    datasets: {
      D: { values: [9.2,9.3,9.3,9.4,9.4,9.4,9.4], value: "9.4 ay", delta: "+0.1", trend: "up", min: "9.2", max: "9.4" },
      W: { values: [8.5,8.8,9.0,9.1,9.2,9.3,9.4], value: "9.4 ay", delta: "+0.9", trend: "up", min: "8.5", max: "9.4" },
      M: { values: [7.2,7.8,8.1,8.5,8.9,9.1,9.4], value: "9.4 ay", delta: "+0.8", trend: "up", min: "7.2", max: "9.4" },
      Y: { values: [5.0,5.8,6.5,7.2,8.0,8.8,9.4], value: "9.4 ay", delta: "+2.4", trend: "up", min: "5.0", max: "9.4" },
    },
  },
  {
    id: "growth", title: "Büyüme Hızı",
    datasets: {
      D: { values: [12.2,12.4,12.5,12.6,12.5,12.7,12.8], value: "%12.8", delta: "+0.3pp", trend: "up", min: "%12.2", max: "%12.8" },
      W: { values: [10.5,11,11.5,12,12.3,12.5,12.8], value: "%12.8", delta: "+2.3pp", trend: "up", min: "%10.5", max: "%12.8" },
      M: { values: [8.2,9.1,10,10.8,11.5,12.2,12.8], value: "%12.8", delta: "+1.8pp", trend: "up", min: "%8.2", max: "%12.8" },
      Y: { values: [5.5,6.8,8.1,9.5,10.8,11.8,12.8], value: "%12.8", delta: "+4.2pp", trend: "up", min: "%5.5", max: "%12.8" },
    },
  },
  {
    id: "activeUsers", title: "Aktif Kullanıcı",
    datasets: {
      D: { values: [12400,12500,12550,12600,12650,12700,12780], value: "12.8K", delta: "+2.4%", trend: "up", min: "12.4K", max: "12.8K" },
      W: { values: [11200,11500,11800,12100,12400,12600,12780], value: "12.8K", delta: "+7.1%", trend: "up", min: "11.2K", max: "12.8K" },
      M: { values: [9500,10200,10800,11200,11800,12300,12780], value: "12.8K", delta: "+12.2%", trend: "up", min: "9.5K", max: "12.8K" },
      Y: { values: [6000,7200,8500,9800,10800,11800,12780], value: "12.8K", delta: "+38.5%", trend: "up", min: "6.0K", max: "12.8K" },
    },
  },
];

const healthDrivers = [
  { label: "Marj artışı sürdürülebilir", impact: "pos" as const },
  { label: "Reklam verimliliği yükseliyor", impact: "pos" as const },
  { label: "Nakit varyansı plan üzerinde", impact: "pos" as const },
  { label: "Operasyonel yığılma artıyor", impact: "neg" as const },
  { label: "Churn oranı hafif yükseldi", impact: "neg" as const },
  { label: "Tech borcu büyüyor", impact: "neg" as const },
];

export function getCompanySnapshot(range: TimeRange): CompanySnapshot {
  const kpis: KpiCard[] = seeds.map((s) => {
    const d = s.datasets[range];
    return {
      id: s.id,
      title: s.title,
      value: d.value,
      deltaLabel: d.delta,
      trend: d.trend,
      series: seriesFn[range](d.values),
      minLabel: d.min,
      maxLabel: d.max,
    };
  });

  return {
    updatedAt: new Date().toISOString(),
    healthScore: 78,
    healthDelta: "+3.2%",
    healthDrivers,
    kpis,
  };
}

/**
 * OKR Seed Data
 * Realistic mock data for cycles, objectives, key results, and links.
 */

import { OKRCycle, Objective, KeyResult, OKRLink, CorrectiveDecisionDraft } from "../types/okr";
import { DEFAULT_TENANT_ID } from "./seed";

// ── Cycles ──────────────────────────────────────────────
export const seedCycles: OKRCycle[] = [
  {
    id: "cycle_2026_annual",
    tenant_id: DEFAULT_TENANT_ID,
    name: "2026 Yıllık Strateji",
    type: "annual",
    start_date: "2026-01-01T00:00:00Z",
    end_date: "2026-12-31T23:59:59Z",
    status: "active",
    is_global: true,
    created_at: "2025-12-01T00:00:00Z",
  },
  {
    id: "cycle_2026_q1",
    tenant_id: DEFAULT_TENANT_ID,
    name: "2026 Q1",
    type: "quarterly",
    start_date: "2026-01-01T00:00:00Z",
    end_date: "2026-03-31T23:59:59Z",
    status: "active",
    is_global: false,
    created_at: "2025-12-15T00:00:00Z",
  },
  {
    id: "cycle_2026_q2",
    tenant_id: DEFAULT_TENANT_ID,
    name: "2026 Q2",
    type: "quarterly",
    start_date: "2026-04-01T00:00:00Z",
    end_date: "2026-06-30T23:59:59Z",
    status: "planned",
    is_global: false,
    created_at: "2026-01-10T00:00:00Z",
  },
];

// ── Strategic Objectives (Annual) ───────────────────────
const makeHealthExplanation = (p: number, r: number, v: number) => ({
  progress_component: `İlerleme katkısı: ${(p * 0.5).toFixed(1)}`,
  risk_component: `Risk düşüşü: -${(r * 0.25).toFixed(1)}`,
  velocity_component: `Hız katkısı: ${(v * 12.5).toFixed(1)}`,
  summary: `Sağlık = ${(p * 0.5 - r * 0.25 + v * 12.5).toFixed(1)}`,
});

export const seedObjectives: Objective[] = [
  // Strategic (annual)
  {
    id: "obj_s1", tenant_id: DEFAULT_TENANT_ID, cycle_id: "cycle_2026_annual",
    parent_objective_id: null, level: "strategic", owner_seat: "CEO",
    department_key: "executive", title: "Yıllık Geliri %30 Artır",
    description: "Toplam geliri $10M'dan $13M'a çıkar",
    status: "active", health_score: 72, risk_score: 28, probability_of_success: 68,
    health_explanation: makeHealthExplanation(65, 28, 1.05),
    risk_explanation: "Risk = Sapma(12×0.4) + Hız(5×0.3) + Zaman(12) = 28",
    success_explanation: "Başarı = İlerleme(26) + Hız(31.5) + RiskDüşüklüğü(21.6) = %68",
    deviation_flag: false, deviation_delta: -5, alignment_score: 85,
    created_at: "2026-01-02T00:00:00Z",
  },
  {
    id: "obj_s2", tenant_id: DEFAULT_TENANT_ID, cycle_id: "cycle_2026_annual",
    parent_objective_id: null, level: "strategic", owner_seat: "COO",
    department_key: "executive", title: "Operasyonel Verimliliği %20 İyileştir",
    description: "Süreç otomasyonu ve maliyet optimizasyonu ile verimlilik artışı",
    status: "active", health_score: 58, risk_score: 42, probability_of_success: 52,
    health_explanation: makeHealthExplanation(48, 42, 0.88),
    risk_explanation: "Risk = Sapma(22×0.4) + Hız(12×0.3) + Zaman(18) = 42",
    success_explanation: "Başarı = İlerleme(19.2) + Hız(26.4) + RiskDüşüklüğü(17.4) = %52",
    deviation_flag: true, deviation_delta: 22, alignment_score: 70,
    created_at: "2026-01-02T00:00:00Z",
  },
  {
    id: "obj_s3", tenant_id: DEFAULT_TENANT_ID, cycle_id: "cycle_2026_annual",
    parent_objective_id: null, level: "strategic", owner_seat: "CTO",
    department_key: "executive", title: "Ürün Platformunu Yeni Nesil Mimariye Taşı",
    description: "Monolitik yapıdan mikroservis mimarisine geçiş",
    status: "active", health_score: 81, risk_score: 18, probability_of_success: 78,
    health_explanation: makeHealthExplanation(75, 18, 1.12),
    risk_explanation: "Risk = Sapma(5×0.4) + Hız(0×0.3) + Zaman(10) = 18",
    success_explanation: "Başarı = İlerleme(30) + Hız(33.6) + RiskDüşüklüğü(24.6) = %78",
    deviation_flag: false, deviation_delta: -8, alignment_score: 90,
    created_at: "2026-01-02T00:00:00Z",
  },

  // Tactical (Q1) — children of strategic objectives
  {
    id: "obj_t1", tenant_id: DEFAULT_TENANT_ID, cycle_id: "cycle_2026_q1",
    parent_objective_id: "obj_s1", level: "tactical", owner_seat: "CMO",
    department_key: "marketing", title: "Dijital Pazarlama ROI'sini %40 Artır",
    description: "Kanal optimizasyonu ve yeni müşteri kazanım stratejileri",
    status: "active", health_score: 65, risk_score: 35, probability_of_success: 60,
    health_explanation: makeHealthExplanation(58, 35, 0.95),
    risk_explanation: "Risk = Sapma(18×0.4) + Hız(6×0.3) + Zaman(15) = 35",
    success_explanation: "Başarı = İlerleme(23.2) + Hız(28.5) + RiskDüşüklüğü(19.5) = %60",
    deviation_flag: true, deviation_delta: 18, alignment_score: 78,
    created_at: "2026-01-05T00:00:00Z",
  },
  {
    id: "obj_t2", tenant_id: DEFAULT_TENANT_ID, cycle_id: "cycle_2026_q1",
    parent_objective_id: "obj_s1", level: "tactical", owner_seat: "SALES_DIRECTOR",
    department_key: "sales", title: "Yeni Müşteri Sayısını 150'ye Çıkar",
    description: "Enterprise segment odaklı satış stratejisi",
    status: "active", health_score: 78, risk_score: 22, probability_of_success: 73,
    health_explanation: makeHealthExplanation(72, 22, 1.08),
    risk_explanation: "Risk = Sapma(8×0.4) + Hız(0×0.3) + Zaman(12) = 22",
    success_explanation: "Başarı = İlerleme(28.8) + Hız(32.4) + RiskDüşüklüğü(23.4) = %73",
    deviation_flag: false, deviation_delta: -3, alignment_score: 82,
    created_at: "2026-01-05T00:00:00Z",
  },
  {
    id: "obj_t3", tenant_id: DEFAULT_TENANT_ID, cycle_id: "cycle_2026_q1",
    parent_objective_id: "obj_s2", level: "tactical", owner_seat: "CFO",
    department_key: "finance", title: "Operasyonel Giderleri %10 Azalt",
    description: "Süreç otomasyonu ve tedarikçi konsolidasyonu",
    status: "active", health_score: 45, risk_score: 55, probability_of_success: 38,
    health_explanation: makeHealthExplanation(35, 55, 0.72),
    risk_explanation: "Risk = Sapma(30×0.4) + Hız(18×0.3) + Zaman(20) = 55",
    success_explanation: "Başarı = İlerleme(14) + Hız(21.6) + RiskDüşüklüğü(13.5) = %38",
    deviation_flag: true, deviation_delta: 30, alignment_score: 65,
    created_at: "2026-01-05T00:00:00Z",
  },
  {
    id: "obj_t4", tenant_id: DEFAULT_TENANT_ID, cycle_id: "cycle_2026_q1",
    parent_objective_id: "obj_s3", level: "tactical", owner_seat: "CTO",
    department_key: "technology", title: "Core API'yi Mikroservis Mimarisine Geçir",
    description: "3 kritik servisin ayrıştırılması",
    status: "active", health_score: 85, risk_score: 15, probability_of_success: 82,
    health_explanation: makeHealthExplanation(80, 15, 1.15),
    risk_explanation: "Risk = Sapma(3×0.4) + Hız(0×0.3) + Zaman(8) = 15",
    success_explanation: "Başarı = İlerleme(32) + Hız(34.5) + RiskDüşüklüğü(25.5) = %82",
    deviation_flag: false, deviation_delta: -10, alignment_score: 92,
    created_at: "2026-01-05T00:00:00Z",
  },
  {
    id: "obj_t5", tenant_id: DEFAULT_TENANT_ID, cycle_id: "cycle_2026_q1",
    parent_objective_id: "obj_s2", level: "tactical", owner_seat: "CHRO",
    department_key: "hr", title: "Çalışan Bağlılık Skorunu %15 Artır",
    description: "Yetenek gelişimi ve çalışan deneyimi programları",
    status: "active", health_score: 62, risk_score: 38, probability_of_success: 55,
    health_explanation: makeHealthExplanation(52, 38, 0.92),
    risk_explanation: "Risk = Sapma(20×0.4) + Hız(8×0.3) + Zaman(16) = 38",
    success_explanation: "Başarı = İlerleme(20.8) + Hız(27.6) + RiskDüşüklüğü(18.6) = %55",
    deviation_flag: true, deviation_delta: 20, alignment_score: 60,
    created_at: "2026-01-05T00:00:00Z",
  },
];

// ── Key Results ─────────────────────────────────────────
export const seedKeyResults: KeyResult[] = [
  // obj_s1 KRs
  { id: "kr_s1_1", tenant_id: DEFAULT_TENANT_ID, objective_id: "obj_s1", title: "Toplam Gelir", metric_type: "currency", target_value: 13000000, current_value: 10850000, baseline_value: 10000000, aggregation_logic: "latest", data_source: "finance.revenue", weight: 0.5, status: "on_track", last_calculated_at: "2026-02-18T08:00:00Z" },
  { id: "kr_s1_2", tenant_id: DEFAULT_TENANT_ID, objective_id: "obj_s1", title: "Yeni ARR", metric_type: "currency", target_value: 2000000, current_value: 620000, baseline_value: 0, aggregation_logic: "sum", data_source: "sales.arr", weight: 0.3, status: "on_track", last_calculated_at: "2026-02-18T08:00:00Z" },
  { id: "kr_s1_3", tenant_id: DEFAULT_TENANT_ID, objective_id: "obj_s1", title: "Müşteri Elde Tutma Oranı", metric_type: "percentage", target_value: 95, current_value: 91, baseline_value: 88, aggregation_logic: "latest", data_source: "sales.retention", weight: 0.2, status: "at_risk", last_calculated_at: "2026-02-18T08:00:00Z" },

  // obj_s2 KRs
  { id: "kr_s2_1", tenant_id: DEFAULT_TENANT_ID, objective_id: "obj_s2", title: "Operasyonel Maliyet Oranı", metric_type: "percentage", target_value: 60, current_value: 72, baseline_value: 75, aggregation_logic: "latest", data_source: "finance.opex_ratio", weight: 0.4, status: "behind", last_calculated_at: "2026-02-18T08:00:00Z" },
  { id: "kr_s2_2", tenant_id: DEFAULT_TENANT_ID, objective_id: "obj_s2", title: "Süreç Otomasyon Oranı", metric_type: "percentage", target_value: 80, current_value: 52, baseline_value: 45, aggregation_logic: "latest", data_source: "operations.automation", weight: 0.35, status: "at_risk", last_calculated_at: "2026-02-18T08:00:00Z" },
  { id: "kr_s2_3", tenant_id: DEFAULT_TENANT_ID, objective_id: "obj_s2", title: "SLA Uyumluluk Oranı", metric_type: "percentage", target_value: 99, current_value: 96.5, baseline_value: 95, aggregation_logic: "average", data_source: "operations.sla", weight: 0.25, status: "on_track", last_calculated_at: "2026-02-18T08:00:00Z" },

  // obj_t1 KRs (Marketing)
  { id: "kr_t1_1", tenant_id: DEFAULT_TENANT_ID, objective_id: "obj_t1", title: "Dijital Pazarlama ROI", metric_type: "ratio", target_value: 5.5, current_value: 3.8, baseline_value: 3.2, aggregation_logic: "latest", data_source: "marketing.roi", weight: 0.5, status: "at_risk", last_calculated_at: "2026-02-18T08:00:00Z" },
  { id: "kr_t1_2", tenant_id: DEFAULT_TENANT_ID, objective_id: "obj_t1", title: "Lead Dönüşüm Oranı", metric_type: "percentage", target_value: 8, current_value: 5.2, baseline_value: 4.5, aggregation_logic: "latest", data_source: "marketing.conversion", weight: 0.3, status: "on_track", last_calculated_at: "2026-02-18T08:00:00Z" },
  { id: "kr_t1_3", tenant_id: DEFAULT_TENANT_ID, objective_id: "obj_t1", title: "CAC (Müşteri Edinme Maliyeti)", metric_type: "currency", target_value: 150, current_value: 210, baseline_value: 280, aggregation_logic: "latest", data_source: "marketing.cac", weight: 0.2, status: "on_track", last_calculated_at: "2026-02-18T08:00:00Z" },

  // obj_t2 KRs (Sales)
  { id: "kr_t2_1", tenant_id: DEFAULT_TENANT_ID, objective_id: "obj_t2", title: "Yeni Müşteri Sayısı", metric_type: "count", target_value: 150, current_value: 48, baseline_value: 0, aggregation_logic: "sum", data_source: "sales.new_customers", weight: 0.6, status: "on_track", last_calculated_at: "2026-02-18T08:00:00Z" },
  { id: "kr_t2_2", tenant_id: DEFAULT_TENANT_ID, objective_id: "obj_t2", title: "Enterprise Deal Sayısı", metric_type: "count", target_value: 20, current_value: 7, baseline_value: 0, aggregation_logic: "sum", data_source: "sales.enterprise_deals", weight: 0.4, status: "on_track", last_calculated_at: "2026-02-18T08:00:00Z" },

  // obj_t3 KRs (Finance)
  { id: "kr_t3_1", tenant_id: DEFAULT_TENANT_ID, objective_id: "obj_t3", title: "Operasyonel Gider Azaltma", metric_type: "percentage", target_value: 10, current_value: 3.5, baseline_value: 0, aggregation_logic: "latest", data_source: "finance.opex_reduction", weight: 0.5, status: "behind", last_calculated_at: "2026-02-18T08:00:00Z" },
  { id: "kr_t3_2", tenant_id: DEFAULT_TENANT_ID, objective_id: "obj_t3", title: "Tedarikçi Konsolidasyonu", metric_type: "count", target_value: 5, current_value: 1, baseline_value: 0, aggregation_logic: "sum", data_source: "finance.vendor_consolidation", weight: 0.3, status: "behind", last_calculated_at: "2026-02-18T08:00:00Z" },
  { id: "kr_t3_3", tenant_id: DEFAULT_TENANT_ID, objective_id: "obj_t3", title: "Otomasyon Tasarruf ($)", metric_type: "currency", target_value: 250000, current_value: 65000, baseline_value: 0, aggregation_logic: "sum", data_source: "finance.automation_savings", weight: 0.2, status: "at_risk", last_calculated_at: "2026-02-18T08:00:00Z" },

  // obj_t4 KRs (Technology)
  { id: "kr_t4_1", tenant_id: DEFAULT_TENANT_ID, objective_id: "obj_t4", title: "Ayrıştırılan Servis Sayısı", metric_type: "count", target_value: 3, current_value: 2, baseline_value: 0, aggregation_logic: "sum", data_source: "technology.microservices", weight: 0.5, status: "on_track", last_calculated_at: "2026-02-18T08:00:00Z" },
  { id: "kr_t4_2", tenant_id: DEFAULT_TENANT_ID, objective_id: "obj_t4", title: "API Latency (ms)", metric_type: "count", target_value: 50, current_value: 62, baseline_value: 120, aggregation_logic: "average", data_source: "technology.api_latency", weight: 0.3, status: "on_track", last_calculated_at: "2026-02-18T08:00:00Z" },
  { id: "kr_t4_3", tenant_id: DEFAULT_TENANT_ID, objective_id: "obj_t4", title: "Test Coverage", metric_type: "percentage", target_value: 90, current_value: 82, baseline_value: 65, aggregation_logic: "latest", data_source: "technology.test_coverage", weight: 0.2, status: "on_track", last_calculated_at: "2026-02-18T08:00:00Z" },

  // obj_t5 KRs (HR)
  { id: "kr_t5_1", tenant_id: DEFAULT_TENANT_ID, objective_id: "obj_t5", title: "Çalışan Bağlılık Skoru", metric_type: "score", target_value: 82, current_value: 72, baseline_value: 68, aggregation_logic: "latest", data_source: "hr.engagement", weight: 0.4, status: "at_risk", last_calculated_at: "2026-02-18T08:00:00Z" },
  { id: "kr_t5_2", tenant_id: DEFAULT_TENANT_ID, objective_id: "obj_t5", title: "İç Terfi Oranı", metric_type: "percentage", target_value: 30, current_value: 18, baseline_value: 15, aggregation_logic: "latest", data_source: "hr.internal_promotion", weight: 0.3, status: "at_risk", last_calculated_at: "2026-02-18T08:00:00Z" },
  { id: "kr_t5_3", tenant_id: DEFAULT_TENANT_ID, objective_id: "obj_t5", title: "Eğitim Tamamlama Oranı", metric_type: "percentage", target_value: 85, current_value: 58, baseline_value: 40, aggregation_logic: "latest", data_source: "hr.training_completion", weight: 0.3, status: "behind", last_calculated_at: "2026-02-18T08:00:00Z" },
];

// ── OKR Links ───────────────────────────────────────────
export const seedOKRLinks: OKRLink[] = [
  { id: "link_1", tenant_id: DEFAULT_TENANT_ID, entity_type: "decision", entity_id: "dec_001", objective_id: "obj_s1", impact_estimate: 15, created_at: "2026-01-20T00:00:00Z" },
  { id: "link_2", tenant_id: DEFAULT_TENANT_ID, entity_type: "action", entity_id: "act_001", objective_id: "obj_t1", impact_estimate: 8, created_at: "2026-01-25T00:00:00Z" },
  { id: "link_3", tenant_id: DEFAULT_TENANT_ID, entity_type: "decision", entity_id: "dec_002", objective_id: "obj_t3", impact_estimate: -5, created_at: "2026-02-01T00:00:00Z" },
];

// ── Corrective Decision Drafts (pre-seeded for at-risk objectives) ──
export const seedCorrectiveDrafts: CorrectiveDecisionDraft[] = [
  {
    id: "corr_seed_1", tenant_id: DEFAULT_TENANT_ID,
    linked_objective_id: "obj_t3",
    impact_estimate: -30,
    recommended_action: "Bütçe tahsisini gözden geçirin, maliyet optimizasyonu senaryosu çalıştırın. Tedarikçi konsolidasyonunu hızlandırın.",
    rationale: "Hedef 'Operasyonel Giderleri %10 Azalt' sapma durumunda (sapma: %30). Risk skoru: 55/100 (eşik: 60). Başarı olasılığı: %38 (eşik: %40). Düzeltici aksiyon önerilmektedir.",
    simulation_option: "finance_correction_sim",
    risk_score: 55,
    created_at: "2026-02-15T00:00:00Z",
    status: "draft",
  },
  {
    id: "corr_seed_2", tenant_id: DEFAULT_TENANT_ID,
    linked_objective_id: "obj_t5",
    impact_estimate: -20,
    recommended_action: "Yetenek boşluğu analizi yapın, kritik pozisyon önceliklendirmesi güncelleyin. Eğitim programı takvimini yeniden yapılandırın.",
    rationale: "Hedef 'Çalışan Bağlılık Skorunu %15 Artır' sapma durumunda (sapma: %20). Risk skoru: 38/100. Başarı olasılığı: %55. Eğitim tamamlama KR'si ciddi şekilde geride.",
    simulation_option: "hr_correction_sim",
    risk_score: 38,
    created_at: "2026-02-16T00:00:00Z",
    status: "draft",
  },
];

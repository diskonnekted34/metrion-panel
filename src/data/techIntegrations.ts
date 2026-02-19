// ─── TECHNOLOGY DEPARTMENT: DATA SOURCES / CONNECTORS ────────────────

export type TechConnectorStatus = "available" | "connected" | "error" | "disabled";
export type TechDataSensitivity = "low" | "med" | "high";
export type TechAccessMethod = "oauth" | "api_key" | "webhook" | "export";
export type TechRefreshFrequency = "realtime" | "hourly" | "daily" | "manual";
export type TechSyncStatus = "ok" | "partial" | "failed" | "never";

export type TechConnectorCategory =
  | "vcs"
  | "issue_tracking"
  | "cicd"
  | "cloud"
  | "containers"
  | "observability"
  | "logging"
  | "error_tracking"
  | "security"
  | "iam"
  | "waf_edge"
  | "incident"
  | "status_page"
  | "finops"
  | "databases"
  | "data_pipelines"
  | "docs"
  | "support"
  | "communication";

export interface TechConnectorEntity {
  name: string;
  fields: string[];
}

export interface TechConnectorSetupStep {
  step_id: string;
  title_tr: string;
  description_tr: string;
  fields: { name: string; type: "select" | "text" | "toggle" | "checkbox_group"; label_tr: string; options?: string[] }[];
}

export interface TechConnectorCoverage {
  metrics_covered: string[];
  agents_impacted: string[];
}

export interface TechConnector {
  id: string;
  name_tr: string;
  vendor: string;
  category: TechConnectorCategory;
  description_tr: string;
  status: TechConnectorStatus;
  environments_supported: ("dev" | "stage" | "prod")[];
  environment_scope_selected: ("dev" | "stage" | "prod")[];
  data_sensitivity: TechDataSensitivity;
  access_method: TechAccessMethod;
  refresh_frequency: TechRefreshFrequency;
  entities: TechConnectorEntity[];
  events: string[];
  required_permissions: string[];
  least_privilege_notes_tr: string;
  common_failure_modes: string[];
  setup_steps: TechConnectorSetupStep[];
  coverage_impact: TechConnectorCoverage;
  last_sync_at: string | null;
  last_sync_status: TechSyncStatus;
  error_message_tr: string | null;
  ui_assets: { icon_name: string; badge_label_tr: string };
}

export interface TechConnectorCategoryDef {
  id: TechConnectorCategory;
  name_tr: string;
  description_tr: string;
  icon_name: string;
  owner: "cto" | "cio" | "shared";
}

// ─── CATEGORIES ────────────────────────────────────────────
export const techCategories: TechConnectorCategoryDef[] = [
  { id: "vcs", name_tr: "Versiyon Kontrol & Kod", description_tr: "Kaynak kod depoları, commit geçmişi, PR akışları", icon_name: "GitBranch", owner: "cto" },
  { id: "issue_tracking", name_tr: "İş / Proje / Sprint Yönetimi", description_tr: "Görev takibi, sprint metrikleri, iş yükü analizi", icon_name: "ListTodo", owner: "cto" },
  { id: "cicd", name_tr: "CI/CD & Dağıtım", description_tr: "Pipeline'lar, build süreleri, deployment frekansı", icon_name: "Rocket", owner: "cto" },
  { id: "cloud", name_tr: "Bulut Sağlayıcılar", description_tr: "AWS, GCP, Azure altyapı metrikleri", icon_name: "Cloud", owner: "cio" },
  { id: "containers", name_tr: "Konteyner & Orkestrasyon", description_tr: "Kubernetes, ECS, Docker cluster yönetimi", icon_name: "Container", owner: "cio" },
  { id: "observability", name_tr: "Gözlemlenebilirlik (Metrik & İzleme)", description_tr: "APM, trace, metrik toplama ve analiz", icon_name: "Activity", owner: "cio" },
  { id: "logging", name_tr: "Loglama", description_tr: "Merkezi log toplama ve analiz", icon_name: "FileText", owner: "cio" },
  { id: "error_tracking", name_tr: "Hata İzleme & RUM", description_tr: "Uygulama hataları, crash raporları, kullanıcı deneyimi", icon_name: "Bug", owner: "cto" },
  { id: "security", name_tr: "Güvenlik / AppSec / Zafiyet", description_tr: "Zafiyet tarama, bağımlılık denetimi, SAST/DAST", icon_name: "Shield", owner: "cio" },
  { id: "iam", name_tr: "Kimlik & Erişim Yönetimi (SSO/IAM)", description_tr: "SSO, MFA, rol bazlı erişim kontrolü", icon_name: "Key", owner: "cio" },
  { id: "waf_edge", name_tr: "WAF / Edge Güvenlik", description_tr: "Web uygulama güvenlik duvarı, DDoS koruma", icon_name: "ShieldCheck", owner: "cio" },
  { id: "incident", name_tr: "Olay Yönetimi & Nöbet", description_tr: "Incident response, on-call rotasyonları, eskalasyon", icon_name: "Siren", owner: "shared" },
  { id: "status_page", name_tr: "Durum Sayfası", description_tr: "Servis durumu, uptime izleme, kullanıcı bildirimleri", icon_name: "Globe", owner: "shared" },
  { id: "finops", name_tr: "FinOps / Faturalama / Maliyet", description_tr: "Bulut harcama analizi, maliyet optimizasyonu", icon_name: "DollarSign", owner: "cio" },
  { id: "databases", name_tr: "Veritabanı & Veri Altyapısı", description_tr: "DB performansı, replikasyon, kapasite izleme", icon_name: "Database", owner: "cio" },
  { id: "data_pipelines", name_tr: "Veri Pipeline / ELT / Orkestrasyon", description_tr: "dbt, Airflow, Fivetran — veri akış izleme", icon_name: "Workflow", owner: "shared" },
  { id: "docs", name_tr: "Dokümantasyon / Bilgi Tabanı", description_tr: "Teknik dokümanlar, runbook'lar, ADR'ler", icon_name: "BookOpen", owner: "shared" },
  { id: "support", name_tr: "Müşteri Destek (Teknik Sinyaller)", description_tr: "Teknik ticket'lar, bug raporları, müşteri geri bildirimleri", icon_name: "Headphones", owner: "shared" },
  { id: "communication", name_tr: "İletişim / War Room", description_tr: "Slack, Teams — incident iletişim kanalları", icon_name: "MessageSquare", owner: "shared" },
];

export const techCategoryOrder: TechConnectorCategory[] = techCategories.map(c => c.id);

// ─── COMMON SETUP STEPS ──────────────────────────────────────
const commonSetupSteps: TechConnectorSetupStep[] = [
  {
    step_id: "env_scope",
    title_tr: "Ortam Kapsamı",
    description_tr: "Hangi ortamlardan veri çekilecek?",
    fields: [{ name: "environments", type: "checkbox_group", label_tr: "Ortamlar", options: ["dev", "stage", "prod"] }],
  },
  {
    step_id: "auth",
    title_tr: "Kimlik Doğrulama",
    description_tr: "OAuth2 veya API anahtarı ile yetkilendirme",
    fields: [{ name: "auth_method", type: "select", label_tr: "Yöntem", options: ["OAuth2", "API Anahtarı", "Kişisel Token"] }],
  },
  {
    step_id: "permissions",
    title_tr: "İzinler",
    description_tr: "Minimum yetki ilkesine uygun erişim kapsamı",
    fields: [],
  },
  {
    step_id: "data_selection",
    title_tr: "Veri Seçimi",
    description_tr: "Hangi varlık ve olaylar senkronize edilecek?",
    fields: [],
  },
  {
    step_id: "review",
    title_tr: "Gözden Geçir & Bağlan",
    description_tr: "Seçimlerinizi doğrulayın",
    fields: [],
  },
];

// ─── MOCK CONNECTORS (20+) ──────────────────────────────────
export const techConnectors: TechConnector[] = [
  // ── VCS ──
  {
    id: "github",
    name_tr: "GitHub",
    vendor: "GitHub / Microsoft",
    category: "vcs",
    description_tr: "Kaynak kod, PR'lar, commit geçmişi, code review metrikleri",
    status: "connected",
    environments_supported: ["dev", "stage", "prod"],
    environment_scope_selected: ["prod"],
    data_sensitivity: "high",
    access_method: "oauth",
    refresh_frequency: "realtime",
    entities: [
      { name: "Repository", fields: ["id", "name", "language", "stars", "last_push"] },
      { name: "PullRequest", fields: ["id", "title", "author", "status", "review_count", "merge_time"] },
      { name: "Commit", fields: ["sha", "author", "message", "timestamp", "files_changed"] },
    ],
    events: ["push", "pull_request.opened", "pull_request.merged", "review.submitted", "release.published"],
    required_permissions: ["repo:read", "pull_request:read", "actions:read"],
    least_privilege_notes_tr: "Yalnızca okuma erişimi gereklidir. Yazma scope'u vermeyin.",
    common_failure_modes: ["Token süresi doldu", "Rate limit aşıldı (5000/saat)", "Org erişim izni eksik"],
    setup_steps: commonSetupSteps,
    coverage_impact: {
      metrics_covered: ["commit_frequency", "pr_cycle_time", "review_coverage", "code_churn"],
      agents_impacted: ["eng-manager", "quality-reliability", "release-change"],
    },
    last_sync_at: "2026-02-15T08:30:00Z",
    last_sync_status: "ok",
    error_message_tr: null,
    ui_assets: { icon_name: "Github", badge_label_tr: "Bağlı" },
  },
  {
    id: "gitlab",
    name_tr: "GitLab",
    vendor: "GitLab Inc.",
    category: "vcs",
    description_tr: "Monorepo, MR akışları, CI pipeline tetikleme verileri",
    status: "available",
    environments_supported: ["dev", "stage", "prod"],
    environment_scope_selected: [],
    data_sensitivity: "high",
    access_method: "oauth",
    refresh_frequency: "realtime",
    entities: [
      { name: "Project", fields: ["id", "name", "visibility", "last_activity"] },
      { name: "MergeRequest", fields: ["id", "title", "author", "status", "approvals"] },
    ],
    events: ["push", "merge_request.opened", "merge_request.merged", "pipeline.completed"],
    required_permissions: ["read_api", "read_repository"],
    least_privilege_notes_tr: "read_api yeterlidir. write scope kullanmayın.",
    common_failure_modes: ["Self-hosted instance bağlantı hatası", "Token yetkisiz"],
    setup_steps: commonSetupSteps,
    coverage_impact: {
      metrics_covered: ["commit_frequency", "mr_cycle_time", "pipeline_success_rate"],
      agents_impacted: ["eng-manager", "release-change"],
    },
    last_sync_at: null,
    last_sync_status: "never",
    error_message_tr: null,
    ui_assets: { icon_name: "GitBranch", badge_label_tr: "Kullanılabilir" },
  },
  {
    id: "bitbucket",
    name_tr: "Bitbucket",
    vendor: "Atlassian",
    category: "vcs",
    description_tr: "Atlassian ekosistemi ile entegre kaynak kod yönetimi",
    status: "available",
    environments_supported: ["dev", "prod"],
    environment_scope_selected: [],
    data_sensitivity: "high",
    access_method: "oauth",
    refresh_frequency: "hourly",
    entities: [
      { name: "Repository", fields: ["uuid", "slug", "language", "last_updated"] },
      { name: "PullRequest", fields: ["id", "title", "state", "author"] },
    ],
    events: ["repo:push", "pullrequest:created", "pullrequest:fulfilled"],
    required_permissions: ["repository:read", "pullrequest:read"],
    least_privilege_notes_tr: "Repository read scope yeterlidir.",
    common_failure_modes: ["Workspace erişim izni gerekli", "App password süresi dolmuş"],
    setup_steps: commonSetupSteps,
    coverage_impact: {
      metrics_covered: ["commit_frequency", "pr_cycle_time"],
      agents_impacted: ["eng-manager"],
    },
    last_sync_at: null,
    last_sync_status: "never",
    error_message_tr: null,
    ui_assets: { icon_name: "GitBranch", badge_label_tr: "Kullanılabilir" },
  },

  // ── ISSUE TRACKING ──
  {
    id: "jira",
    name_tr: "Jira",
    vendor: "Atlassian",
    category: "issue_tracking",
    description_tr: "Sprint metrikleri, velocity, backlog sağlığı, iş yükü dağılımı",
    status: "connected",
    environments_supported: ["prod"],
    environment_scope_selected: ["prod"],
    data_sensitivity: "med",
    access_method: "oauth",
    refresh_frequency: "hourly",
    entities: [
      { name: "Issue", fields: ["key", "summary", "status", "assignee", "priority", "story_points"] },
      { name: "Sprint", fields: ["id", "name", "state", "start_date", "end_date", "goal"] },
      { name: "Board", fields: ["id", "name", "type", "project_key"] },
    ],
    events: ["issue.created", "issue.updated", "sprint.started", "sprint.completed"],
    required_permissions: ["read:jira-work", "read:jira-user"],
    least_privilege_notes_tr: "Yalnızca okuma scope'ları yeterlidir. Admin erişimi vermeyin.",
    common_failure_modes: ["Cloud vs Server API farkları", "Proje erişim kısıtlaması", "Rate limit (429)"],
    setup_steps: commonSetupSteps,
    coverage_impact: {
      metrics_covered: ["sprint_velocity", "cycle_time", "backlog_health", "bug_ratio"],
      agents_impacted: ["eng-manager", "product-analytics"],
    },
    last_sync_at: "2026-02-15T07:00:00Z",
    last_sync_status: "ok",
    error_message_tr: null,
    ui_assets: { icon_name: "ListTodo", badge_label_tr: "Bağlı" },
  },
  {
    id: "linear",
    name_tr: "Linear",
    vendor: "Linear Inc.",
    category: "issue_tracking",
    description_tr: "Modern proje yönetimi, cycle takibi, otomatik triage",
    status: "available",
    environments_supported: ["prod"],
    environment_scope_selected: [],
    data_sensitivity: "med",
    access_method: "oauth",
    refresh_frequency: "realtime",
    entities: [
      { name: "Issue", fields: ["id", "title", "state", "assignee", "priority", "estimate"] },
      { name: "Cycle", fields: ["id", "name", "starts_at", "ends_at", "progress"] },
    ],
    events: ["issue.create", "issue.update", "cycle.started", "cycle.completed"],
    required_permissions: ["read"],
    least_privilege_notes_tr: "read scope yeterlidir.",
    common_failure_modes: ["API key rotasyonu", "Workspace ID hatalı"],
    setup_steps: commonSetupSteps,
    coverage_impact: {
      metrics_covered: ["cycle_velocity", "cycle_time", "triage_time"],
      agents_impacted: ["eng-manager", "product-analytics"],
    },
    last_sync_at: null,
    last_sync_status: "never",
    error_message_tr: null,
    ui_assets: { icon_name: "ListTodo", badge_label_tr: "Kullanılabilir" },
  },

  // ── CI/CD ──
  {
    id: "github-actions",
    name_tr: "GitHub Actions",
    vendor: "GitHub / Microsoft",
    category: "cicd",
    description_tr: "Workflow çalışmaları, build süreleri, deployment frekansı",
    status: "connected",
    environments_supported: ["dev", "stage", "prod"],
    environment_scope_selected: ["prod"],
    data_sensitivity: "med",
    access_method: "oauth",
    refresh_frequency: "realtime",
    entities: [
      { name: "WorkflowRun", fields: ["id", "name", "status", "conclusion", "duration_ms", "branch"] },
      { name: "Deployment", fields: ["id", "environment", "status", "created_at"] },
    ],
    events: ["workflow_run.completed", "deployment.created", "deployment_status.created"],
    required_permissions: ["actions:read", "deployments:read"],
    least_privilege_notes_tr: "actions:read ve deployments:read yeterlidir.",
    common_failure_modes: ["Workflow log erişim kısıtlaması", "OIDC token hatası"],
    setup_steps: commonSetupSteps,
    coverage_impact: {
      metrics_covered: ["deployment_frequency", "build_success_rate", "build_duration", "lead_time"],
      agents_impacted: ["release-change", "quality-reliability"],
    },
    last_sync_at: "2026-02-15T09:15:00Z",
    last_sync_status: "ok",
    error_message_tr: null,
    ui_assets: { icon_name: "Rocket", badge_label_tr: "Bağlı" },
  },
  {
    id: "gitlab-ci",
    name_tr: "GitLab CI",
    vendor: "GitLab Inc.",
    category: "cicd",
    description_tr: "Pipeline süreleri, job başarı oranları, artifact yönetimi",
    status: "available",
    environments_supported: ["dev", "stage", "prod"],
    environment_scope_selected: [],
    data_sensitivity: "med",
    access_method: "api_key",
    refresh_frequency: "hourly",
    entities: [
      { name: "Pipeline", fields: ["id", "status", "duration", "ref", "created_at"] },
      { name: "Job", fields: ["id", "name", "status", "duration", "stage"] },
    ],
    events: ["pipeline.success", "pipeline.failed", "job.failed"],
    required_permissions: ["read_api"],
    least_privilege_notes_tr: "read_api token yeterlidir.",
    common_failure_modes: ["Self-hosted API URL hatası", "Token rotasyonu"],
    setup_steps: commonSetupSteps,
    coverage_impact: {
      metrics_covered: ["pipeline_success_rate", "build_duration"],
      agents_impacted: ["release-change"],
    },
    last_sync_at: null,
    last_sync_status: "never",
    error_message_tr: null,
    ui_assets: { icon_name: "Rocket", badge_label_tr: "Kullanılabilir" },
  },
  {
    id: "jenkins",
    name_tr: "Jenkins",
    vendor: "Jenkins Community",
    category: "cicd",
    description_tr: "Build durumu, pipeline metrikleri, eski CI/CD altyapısı izleme",
    status: "error",
    environments_supported: ["prod"],
    environment_scope_selected: ["prod"],
    data_sensitivity: "med",
    access_method: "api_key",
    refresh_frequency: "hourly",
    entities: [
      { name: "Build", fields: ["number", "result", "duration", "timestamp"] },
      { name: "Job", fields: ["name", "color", "last_build", "health_report"] },
    ],
    events: ["build.completed", "build.failed"],
    required_permissions: ["Overall/Read", "Job/Read"],
    least_privilege_notes_tr: "Ayrı bir read-only kullanıcı oluşturun.",
    common_failure_modes: ["Self-hosted bağlantı zaman aşımı", "Eklenti uyumsuzluğu", "API sürüm farkı"],
    setup_steps: commonSetupSteps,
    coverage_impact: {
      metrics_covered: ["build_success_rate", "build_duration"],
      agents_impacted: ["release-change"],
    },
    last_sync_at: "2026-02-14T23:00:00Z",
    last_sync_status: "failed",
    error_message_tr: "Bağlantı zaman aşımı — Jenkins sunucusu yanıt vermiyor (10s timeout).",
    ui_assets: { icon_name: "Rocket", badge_label_tr: "Hata" },
  },

  // ── CLOUD ──
  {
    id: "aws",
    name_tr: "Amazon Web Services",
    vendor: "Amazon",
    category: "cloud",
    description_tr: "EC2, RDS, Lambda, S3, CloudWatch metrikleri ve maliyet verileri",
    status: "connected",
    environments_supported: ["dev", "stage", "prod"],
    environment_scope_selected: ["prod", "stage"],
    data_sensitivity: "high",
    access_method: "api_key",
    refresh_frequency: "hourly",
    entities: [
      { name: "EC2Instance", fields: ["instance_id", "type", "state", "cpu_util", "region"] },
      { name: "RDSInstance", fields: ["db_id", "engine", "storage_used", "connections"] },
      { name: "LambdaFunction", fields: ["name", "runtime", "invocations", "errors", "duration_avg"] },
    ],
    events: ["cloudwatch.alarm", "ec2.state_change", "rds.failover"],
    required_permissions: ["ec2:Describe*", "rds:Describe*", "cloudwatch:GetMetricData", "ce:GetCostAndUsage"],
    least_privilege_notes_tr: "ReadOnlyAccess IAM politikası kullanın. Yönetici erişimi vermeyin.",
    common_failure_modes: ["IAM credential rotasyonu", "Cross-account assume role hatası", "Region kısıtlaması"],
    setup_steps: commonSetupSteps,
    coverage_impact: {
      metrics_covered: ["infra_uptime", "cpu_utilization", "cloud_cost", "lambda_error_rate"],
      agents_impacted: ["infra-ops", "finops-cost", "security-risk"],
    },
    last_sync_at: "2026-02-15T08:00:00Z",
    last_sync_status: "ok",
    error_message_tr: null,
    ui_assets: { icon_name: "Cloud", badge_label_tr: "Bağlı" },
  },
  {
    id: "gcp",
    name_tr: "Google Cloud Platform",
    vendor: "Google",
    category: "cloud",
    description_tr: "Compute Engine, GKE, BigQuery, Cloud Monitoring metrikleri",
    status: "available",
    environments_supported: ["dev", "stage", "prod"],
    environment_scope_selected: [],
    data_sensitivity: "high",
    access_method: "oauth",
    refresh_frequency: "hourly",
    entities: [
      { name: "ComputeInstance", fields: ["name", "zone", "status", "machine_type"] },
      { name: "GKECluster", fields: ["name", "node_count", "status", "version"] },
    ],
    events: ["monitoring.alert", "compute.instance.stateChange"],
    required_permissions: ["monitoring.viewer", "compute.viewer", "billing.viewer"],
    least_privilege_notes_tr: "Viewer rolü yeterlidir. Editor/Owner vermeyin.",
    common_failure_modes: ["Service account key rotasyonu", "Proje ID hatası"],
    setup_steps: commonSetupSteps,
    coverage_impact: {
      metrics_covered: ["infra_uptime", "gke_health", "cloud_cost"],
      agents_impacted: ["infra-ops", "finops-cost"],
    },
    last_sync_at: null,
    last_sync_status: "never",
    error_message_tr: null,
    ui_assets: { icon_name: "Cloud", badge_label_tr: "Kullanılabilir" },
  },

  // ── OBSERVABILITY ──
  {
    id: "datadog",
    name_tr: "Datadog",
    vendor: "Datadog Inc.",
    category: "observability",
    description_tr: "APM, altyapı metrikleri, trace analizi, SLO izleme",
    status: "connected",
    environments_supported: ["dev", "stage", "prod"],
    environment_scope_selected: ["prod"],
    data_sensitivity: "med",
    access_method: "api_key",
    refresh_frequency: "realtime",
    entities: [
      { name: "Monitor", fields: ["id", "name", "status", "type", "query"] },
      { name: "SLO", fields: ["id", "name", "target", "current", "type"] },
      { name: "Service", fields: ["name", "env", "type", "hit_rate", "error_rate", "latency_p99"] },
    ],
    events: ["monitor.alert", "slo.breach", "incident.created"],
    required_permissions: ["monitors_read", "metrics_read", "apm_read"],
    least_privilege_notes_tr: "API ve Application key ile okuma erişimi verin.",
    common_failure_modes: ["Application key eksik", "API key rotasyonu", "Org scope kısıtlaması"],
    setup_steps: commonSetupSteps,
    coverage_impact: {
      metrics_covered: ["service_latency", "error_rate", "slo_burn_rate", "infra_metrics"],
      agents_impacted: ["infra-ops", "quality-reliability", "incident-commander"],
    },
    last_sync_at: "2026-02-15T09:00:00Z",
    last_sync_status: "ok",
    error_message_tr: null,
    ui_assets: { icon_name: "Activity", badge_label_tr: "Bağlı" },
  },
  {
    id: "grafana",
    name_tr: "Grafana / Prometheus",
    vendor: "Grafana Labs",
    category: "observability",
    description_tr: "Dashboard metrikleri, Prometheus uyarıları, panel verileri",
    status: "available",
    environments_supported: ["dev", "stage", "prod"],
    environment_scope_selected: [],
    data_sensitivity: "med",
    access_method: "api_key",
    refresh_frequency: "realtime",
    entities: [
      { name: "Dashboard", fields: ["uid", "title", "folder", "panels_count"] },
      { name: "Alert", fields: ["id", "name", "state", "severity"] },
    ],
    events: ["alert.firing", "alert.resolved"],
    required_permissions: ["Viewer"],
    least_privilege_notes_tr: "Service account ile Viewer rolü yeterlidir.",
    common_failure_modes: ["Self-hosted URL erişim hatası", "API key yetkisiz"],
    setup_steps: commonSetupSteps,
    coverage_impact: {
      metrics_covered: ["custom_metrics", "alert_frequency", "dashboard_usage"],
      agents_impacted: ["infra-ops", "data-governance"],
    },
    last_sync_at: null,
    last_sync_status: "never",
    error_message_tr: null,
    ui_assets: { icon_name: "Activity", badge_label_tr: "Kullanılabilir" },
  },

  // ── ERROR TRACKING ──
  {
    id: "sentry",
    name_tr: "Sentry",
    vendor: "Sentry (Functional Software)",
    category: "error_tracking",
    description_tr: "Uygulama hataları, crash raporları, performans izleme, release sağlığı",
    status: "connected",
    environments_supported: ["dev", "stage", "prod"],
    environment_scope_selected: ["prod", "stage"],
    data_sensitivity: "med",
    access_method: "api_key",
    refresh_frequency: "realtime",
    entities: [
      { name: "Issue", fields: ["id", "title", "level", "count", "first_seen", "last_seen", "assigned_to"] },
      { name: "Release", fields: ["version", "date_released", "new_groups", "crash_free_rate"] },
    ],
    events: ["issue.created", "issue.resolved", "release.deployed"],
    required_permissions: ["project:read", "event:read", "org:read"],
    least_privilege_notes_tr: "Internal integration ile minimum scope verin.",
    common_failure_modes: ["DSN yapılandırma hatası", "Rate limit (org seviyesi)", "Token süresi doldu"],
    setup_steps: commonSetupSteps,
    coverage_impact: {
      metrics_covered: ["error_rate", "crash_free_rate", "regression_count", "release_health"],
      agents_impacted: ["quality-reliability", "eng-manager", "release-change"],
    },
    last_sync_at: "2026-02-15T09:10:00Z",
    last_sync_status: "ok",
    error_message_tr: null,
    ui_assets: { icon_name: "Bug", badge_label_tr: "Bağlı" },
  },

  // ── SECURITY ──
  {
    id: "snyk",
    name_tr: "Snyk",
    vendor: "Snyk Ltd.",
    category: "security",
    description_tr: "Bağımlılık zafiyet tarama, container güvenliği, IaC denetimi",
    status: "available",
    environments_supported: ["prod"],
    environment_scope_selected: [],
    data_sensitivity: "high",
    access_method: "api_key",
    refresh_frequency: "daily",
    entities: [
      { name: "Vulnerability", fields: ["id", "title", "severity", "package", "version", "fix_available"] },
      { name: "Project", fields: ["id", "name", "type", "critical_count", "high_count"] },
    ],
    events: ["vuln.new_critical", "vuln.fixed"],
    required_permissions: ["org.read", "project.read"],
    least_privilege_notes_tr: "Viewer rolü yeterlidir. Kuruluş admin yetkisi vermeyin.",
    common_failure_modes: ["Org slug hatası", "API token süresi doldu"],
    setup_steps: commonSetupSteps,
    coverage_impact: {
      metrics_covered: ["vuln_count", "critical_vulns", "mean_time_to_fix"],
      agents_impacted: ["security-risk", "quality-reliability"],
    },
    last_sync_at: null,
    last_sync_status: "never",
    error_message_tr: null,
    ui_assets: { icon_name: "Shield", badge_label_tr: "Kullanılabilir" },
  },

  // ── WAF / EDGE ──
  {
    id: "cloudflare",
    name_tr: "Cloudflare WAF",
    vendor: "Cloudflare Inc.",
    category: "waf_edge",
    description_tr: "WAF kuralları, DDoS koruma, bot tespiti, edge metrikleri",
    status: "error",
    environments_supported: ["prod"],
    environment_scope_selected: ["prod"],
    data_sensitivity: "high",
    access_method: "api_key",
    refresh_frequency: "realtime",
    entities: [
      { name: "Zone", fields: ["id", "name", "status", "plan"] },
      { name: "FirewallEvent", fields: ["ray_id", "action", "rule_id", "source_ip", "country"] },
    ],
    events: ["firewall.block", "ddos.attack_detected", "waf.rule_triggered"],
    required_permissions: ["Zone.Analytics:Read", "Zone.Firewall:Read"],
    least_privilege_notes_tr: "Analytics ve Firewall read token'ları oluşturun.",
    common_failure_modes: ["Zone ID hatalı", "API token izin kısıtlaması", "Enterprise plan gerekli"],
    setup_steps: commonSetupSteps,
    coverage_impact: {
      metrics_covered: ["blocked_threats", "ddos_events", "waf_rule_hits", "bot_score"],
      agents_impacted: ["security-risk"],
    },
    last_sync_at: "2026-02-14T20:00:00Z",
    last_sync_status: "failed",
    error_message_tr: "API Token yetkisiz — Zone.Firewall:Read izni eksik. Token'ı güncelleyin.",
    ui_assets: { icon_name: "ShieldCheck", badge_label_tr: "Hata" },
  },

  // ── IAM ──
  {
    id: "okta",
    name_tr: "Okta",
    vendor: "Okta Inc.",
    category: "iam",
    description_tr: "SSO oturumları, MFA uyumu, kullanıcı yaşam döngüsü, grup yönetimi",
    status: "available",
    environments_supported: ["prod"],
    environment_scope_selected: [],
    data_sensitivity: "high",
    access_method: "api_key",
    refresh_frequency: "hourly",
    entities: [
      { name: "User", fields: ["id", "email", "status", "last_login", "mfa_enrolled"] },
      { name: "Group", fields: ["id", "name", "member_count"] },
      { name: "Application", fields: ["id", "label", "sign_on_mode", "status"] },
    ],
    events: ["user.session.start", "user.mfa.factor.activate", "user.lifecycle.deactivate"],
    required_permissions: ["okta.users.read", "okta.groups.read", "okta.apps.read"],
    least_privilege_notes_tr: "Read-only admin rolü oluşturun. Super admin vermeyin.",
    common_failure_modes: ["SSWS token rotasyonu", "Org URL hatası", "Rate limit (600/dk)"],
    setup_steps: commonSetupSteps,
    coverage_impact: {
      metrics_covered: ["mfa_adoption", "sso_coverage", "inactive_accounts", "login_anomalies"],
      agents_impacted: ["iam-agent", "security-risk"],
    },
    last_sync_at: null,
    last_sync_status: "never",
    error_message_tr: null,
    ui_assets: { icon_name: "Key", badge_label_tr: "Kullanılabilir" },
  },

  // ── INCIDENT ──
  {
    id: "pagerduty",
    name_tr: "PagerDuty",
    vendor: "PagerDuty Inc.",
    category: "incident",
    description_tr: "Incident yönetimi, on-call rotasyonları, eskalasyon politikaları",
    status: "connected",
    environments_supported: ["prod"],
    environment_scope_selected: ["prod"],
    data_sensitivity: "med",
    access_method: "api_key",
    refresh_frequency: "realtime",
    entities: [
      { name: "Incident", fields: ["id", "title", "status", "urgency", "service", "created_at", "resolved_at"] },
      { name: "OnCallSchedule", fields: ["id", "name", "current_oncall", "escalation_policy"] },
    ],
    events: ["incident.triggered", "incident.acknowledged", "incident.resolved"],
    required_permissions: ["read"],
    least_privilege_notes_tr: "Read-only API key oluşturun.",
    common_failure_modes: ["API key yetkisiz", "Subdomain hatası"],
    setup_steps: commonSetupSteps,
    coverage_impact: {
      metrics_covered: ["mttr", "incident_frequency", "escalation_rate", "oncall_load"],
      agents_impacted: ["incident-commander", "infra-ops"],
    },
    last_sync_at: "2026-02-15T09:05:00Z",
    last_sync_status: "ok",
    error_message_tr: null,
    ui_assets: { icon_name: "Siren", badge_label_tr: "Bağlı" },
  },

  // ── FINOPS ──
  {
    id: "aws-cost-explorer",
    name_tr: "AWS Cost Explorer",
    vendor: "Amazon",
    category: "finops",
    description_tr: "Bulut harcama trendleri, servis bazlı maliyet, tasarruf önerileri",
    status: "connected",
    environments_supported: ["prod"],
    environment_scope_selected: ["prod"],
    data_sensitivity: "high",
    access_method: "api_key",
    refresh_frequency: "daily",
    entities: [
      { name: "CostReport", fields: ["date", "service", "amount", "currency", "account_id"] },
      { name: "Recommendation", fields: ["type", "savings_amount", "resource_id"] },
    ],
    events: ["budget.threshold_exceeded", "anomaly.detected"],
    required_permissions: ["ce:GetCostAndUsage", "ce:GetReservationUtilization", "ce:GetSavingsPlansUtilization"],
    least_privilege_notes_tr: "Billing scope IAM politikası oluşturun. Sadece Cost Explorer okuma erişimi.",
    common_failure_modes: ["Billing hesap erişim izni", "Cross-account billing yapılandırması"],
    setup_steps: commonSetupSteps,
    coverage_impact: {
      metrics_covered: ["monthly_cloud_cost", "cost_trend", "savings_potential", "reserved_utilization"],
      agents_impacted: ["finops-cost", "infra-ops"],
    },
    last_sync_at: "2026-02-15T06:00:00Z",
    last_sync_status: "ok",
    error_message_tr: null,
    ui_assets: { icon_name: "DollarSign", badge_label_tr: "Bağlı" },
  },

  // ── DOCS ──
  {
    id: "notion",
    name_tr: "Notion",
    vendor: "Notion Labs Inc.",
    category: "docs",
    description_tr: "Teknik dokümanlar, ADR'ler, runbook'lar, wiki sayfaları",
    status: "available",
    environments_supported: ["prod"],
    environment_scope_selected: [],
    data_sensitivity: "low",
    access_method: "oauth",
    refresh_frequency: "daily",
    entities: [
      { name: "Page", fields: ["id", "title", "last_edited_by", "last_edited_time"] },
      { name: "Database", fields: ["id", "title", "properties"] },
    ],
    events: ["page.updated", "page.created"],
    required_permissions: ["read_content"],
    least_privilege_notes_tr: "Salt okunur integration oluşturun.",
    common_failure_modes: ["Workspace erişim onayı eksik", "Sayfa paylaşım izni"],
    setup_steps: commonSetupSteps,
    coverage_impact: {
      metrics_covered: ["docs_freshness", "runbook_coverage"],
      agents_impacted: ["docs-standards"],
    },
    last_sync_at: null,
    last_sync_status: "never",
    error_message_tr: null,
    ui_assets: { icon_name: "BookOpen", badge_label_tr: "Kullanılabilir" },
  },
  {
    id: "confluence",
    name_tr: "Confluence",
    vendor: "Atlassian",
    category: "docs",
    description_tr: "Teknik wiki, postmortem'ler, mimari dokümanlar",
    status: "available",
    environments_supported: ["prod"],
    environment_scope_selected: [],
    data_sensitivity: "low",
    access_method: "oauth",
    refresh_frequency: "daily",
    entities: [
      { name: "Page", fields: ["id", "title", "space_key", "last_modified"] },
      { name: "Space", fields: ["key", "name", "type"] },
    ],
    events: ["page.updated", "page.created"],
    required_permissions: ["read:confluence-content.all"],
    least_privilege_notes_tr: "Content okuma scope'u yeterlidir.",
    common_failure_modes: ["Cloud/Server API farkları", "Space erişim kısıtlaması"],
    setup_steps: commonSetupSteps,
    coverage_impact: {
      metrics_covered: ["docs_freshness", "postmortem_count"],
      agents_impacted: ["docs-standards"],
    },
    last_sync_at: null,
    last_sync_status: "never",
    error_message_tr: null,
    ui_assets: { icon_name: "BookOpen", badge_label_tr: "Kullanılabilir" },
  },

  // ── COMMUNICATION ──
  {
    id: "slack-tech",
    name_tr: "Slack (Teknoloji Kanalları)",
    vendor: "Salesforce / Slack",
    category: "communication",
    description_tr: "Incident kanalları, deployment bildirimleri, alert yönlendirme",
    status: "available",
    environments_supported: ["prod"],
    environment_scope_selected: [],
    data_sensitivity: "med",
    access_method: "oauth",
    refresh_frequency: "realtime",
    entities: [
      { name: "Channel", fields: ["id", "name", "topic", "member_count"] },
      { name: "Message", fields: ["ts", "text", "user", "channel", "thread_ts"] },
    ],
    events: ["message.posted", "channel.created", "reaction.added"],
    required_permissions: ["channels:read", "channels:history"],
    least_privilege_notes_tr: "Yalnızca belirli kanallara erişim verin. Tüm workspace okuma vermeyin.",
    common_failure_modes: ["Bot token scope eksik", "Workspace onay gerekli", "Rate limit"],
    setup_steps: commonSetupSteps,
    coverage_impact: {
      metrics_covered: ["incident_response_time", "alert_channel_activity"],
      agents_impacted: ["incident-commander"],
    },
    last_sync_at: null,
    last_sync_status: "never",
    error_message_tr: null,
    ui_assets: { icon_name: "MessageSquare", badge_label_tr: "Kullanılabilir" },
  },

  // ── CONTAINERS ──
  {
    id: "kubernetes",
    name_tr: "Kubernetes",
    vendor: "CNCF",
    category: "containers",
    description_tr: "Cluster sağlığı, pod metrikleri, node kapasitesi, HPA durumu",
    status: "available",
    environments_supported: ["dev", "stage", "prod"],
    environment_scope_selected: [],
    data_sensitivity: "high",
    access_method: "api_key",
    refresh_frequency: "realtime",
    entities: [
      { name: "Node", fields: ["name", "status", "cpu_capacity", "memory_capacity", "pods_count"] },
      { name: "Pod", fields: ["name", "namespace", "status", "restarts", "cpu_usage", "memory_usage"] },
      { name: "Deployment", fields: ["name", "namespace", "replicas", "available_replicas"] },
    ],
    events: ["pod.crash_loop", "node.not_ready", "hpa.scale"],
    required_permissions: ["get", "list", "watch"],
    least_privilege_notes_tr: "ClusterRole ile read-only binding oluşturun.",
    common_failure_modes: ["Kubeconfig süresi doldu", "RBAC izin hatası", "API server erişim engeli"],
    setup_steps: commonSetupSteps,
    coverage_impact: {
      metrics_covered: ["pod_health", "node_utilization", "restart_rate", "hpa_efficiency"],
      agents_impacted: ["infra-ops", "incident-commander"],
    },
    last_sync_at: null,
    last_sync_status: "never",
    error_message_tr: null,
    ui_assets: { icon_name: "Container", badge_label_tr: "Kullanılabilir" },
  },

  // ── LOGGING ──
  {
    id: "elk",
    name_tr: "ELK Stack (Elasticsearch)",
    vendor: "Elastic NV",
    category: "logging",
    description_tr: "Merkezi log toplama, log pattern analizi, anomali tespiti",
    status: "available",
    environments_supported: ["dev", "stage", "prod"],
    environment_scope_selected: [],
    data_sensitivity: "med",
    access_method: "api_key",
    refresh_frequency: "realtime",
    entities: [
      { name: "Index", fields: ["name", "docs_count", "store_size", "status"] },
      { name: "LogPattern", fields: ["pattern", "count", "severity", "source"] },
    ],
    events: ["error_spike", "anomaly.detected"],
    required_permissions: ["monitor", "read"],
    least_privilege_notes_tr: "Read-only rol oluşturun. Cluster admin vermeyin.",
    common_failure_modes: ["Cluster sağlık hatası", "Index pattern bulunamadı", "TLS sertifika sorunu"],
    setup_steps: commonSetupSteps,
    coverage_impact: {
      metrics_covered: ["log_volume", "error_log_ratio", "anomaly_count"],
      agents_impacted: ["infra-ops", "quality-reliability"],
    },
    last_sync_at: null,
    last_sync_status: "never",
    error_message_tr: null,
    ui_assets: { icon_name: "FileText", badge_label_tr: "Kullanılabilir" },
  },

  // ── STATUS PAGE ──
  {
    id: "statuspage",
    name_tr: "Atlassian Statuspage",
    vendor: "Atlassian",
    category: "status_page",
    description_tr: "Servis durumu, planlı bakım, incident iletişimi",
    status: "available",
    environments_supported: ["prod"],
    environment_scope_selected: [],
    data_sensitivity: "low",
    access_method: "api_key",
    refresh_frequency: "realtime",
    entities: [
      { name: "Component", fields: ["id", "name", "status", "group"] },
      { name: "ScheduledMaintenance", fields: ["id", "name", "scheduled_for", "status"] },
    ],
    events: ["component.status_change", "incident.created", "maintenance.scheduled"],
    required_permissions: ["page:read"],
    least_privilege_notes_tr: "Read-only API key kullanın.",
    common_failure_modes: ["Page ID hatası", "API key süresi doldu"],
    setup_steps: commonSetupSteps,
    coverage_impact: {
      metrics_covered: ["uptime_percentage", "component_health", "maintenance_frequency"],
      agents_impacted: ["incident-commander", "infra-ops"],
    },
    last_sync_at: null,
    last_sync_status: "never",
    error_message_tr: null,
    ui_assets: { icon_name: "Globe", badge_label_tr: "Kullanılabilir" },
  },
];

// ─── COVERAGE MODEL ──────────────────────────────────────────
export interface CoverageResult {
  category: TechConnectorCategory;
  category_name_tr: string;
  total: number;
  connected: number;
  percent: number;
}

export function calculateCoverage(connectors: TechConnector[]): CoverageResult[] {
  return techCategories.map(cat => {
    const items = connectors.filter(c => c.category === cat.id);
    const connected = items.filter(c => c.status === "connected").length;
    return {
      category: cat.id,
      category_name_tr: cat.name_tr,
      total: items.length,
      connected,
      percent: items.length > 0 ? Math.round((connected / items.length) * 100) : 0,
    };
  }).filter(r => r.total > 0);
}

export function getCTOImpact(connectors: TechConnector[]): { covered: number; total: number } {
  const ctoCategories: TechConnectorCategory[] = ["vcs", "issue_tracking", "cicd", "error_tracking"];
  const relevant = connectors.filter(c => ctoCategories.includes(c.category));
  const connected = relevant.filter(c => c.status === "connected").length;
  return { covered: connected, total: relevant.length };
}

export function getCIOImpact(connectors: TechConnector[]): { covered: number; total: number } {
  const cioCategories: TechConnectorCategory[] = ["cloud", "observability", "logging", "iam", "security", "waf_edge", "finops", "incident"];
  const relevant = connectors.filter(c => cioCategories.includes(c.category));
  const connected = relevant.filter(c => c.status === "connected").length;
  return { covered: connected, total: relevant.length };
}

// ─── HEALTH SCORE CALCULATOR ─────────────────────────────────
export interface HealthResult {
  score: number;
  state: "green" | "yellow" | "red";
  reasons: string[];
}

export function computeHealthScore(c: TechConnector): HealthResult {
  if (c.status !== "connected") return { score: 0, state: "red", reasons: ["Sistem bağlı değil"] };

  let score = 0;
  const reasons: string[] = [];

  // Auth valid (+40)
  if (c.status === "connected" && c.last_sync_status !== "failed") {
    score += 40;
  } else if (c.last_sync_status === "partial") {
    score += 20;
    reasons.push("Token süresi yaklaşıyor olabilir");
  } else {
    reasons.push("Kimlik doğrulama sorunu");
  }

  // Last sync freshness (+20)
  if (c.last_sync_at) {
    const ageMs = Date.now() - new Date(c.last_sync_at).getTime();
    const expectedMs =
      c.refresh_frequency === "realtime" ? 3_600_000 :
      c.refresh_frequency === "hourly" ? 7_200_000 :
      c.refresh_frequency === "daily" ? 172_800_000 : 604_800_000;
    if (ageMs <= expectedMs) { score += 20; }
    else if (ageMs <= expectedMs * 3) { score += 10; reasons.push("Senkronizasyon gecikmiş"); }
    else { reasons.push("Senkronizasyon çok gecikmiş"); }
  } else {
    reasons.push("Hiç senkronize edilmemiş");
  }

  // Success rate (+20)
  if (c.last_sync_status === "ok") { score += 20; }
  else if (c.last_sync_status === "partial") { score += 10; reasons.push("Kısmi senkronizasyon"); }
  else { reasons.push("Son senkronizasyon başarısız"); }

  // Scope completeness (+10)
  if (c.environment_scope_selected.length > 0) { score += 10; }
  else { reasons.push("Ortam kapsamı seçilmemiş"); }

  // General (+10)
  score += 10;

  const state: HealthResult["state"] = score >= 80 ? "green" : score >= 50 ? "yellow" : "red";
  return { score: Math.min(score, 100), state, reasons };
}

// ─── RISK LEVEL CALCULATOR ───────────────────────────────────
export interface RiskResult {
  level: "low" | "medium" | "high" | "critical";
  reasons: string[];
}

export function computeRiskLevel(c: TechConnector): RiskResult {
  const reasons: string[] = [];
  let severity = 0;

  if (c.status === "error") {
    severity += 3;
    reasons.push("Sistem hata durumunda");
  }
  if (c.data_sensitivity === "high" && c.status !== "connected") {
    severity += 2;
    reasons.push("Yüksek hassasiyetli kaynak bağlı değil");
  }
  if (c.last_sync_status === "failed") {
    severity += 2;
    reasons.push("Son senkronizasyon başarısız");
  }
  if (c.status === "available" && ["security", "waf_edge", "iam"].includes(c.category)) {
    severity += 2;
    reasons.push("Güvenlik kategorisinde eksik bağlantı");
  }

  const level: RiskResult["level"] =
    severity >= 5 ? "critical" : severity >= 3 ? "high" : severity >= 1 ? "medium" : "low";
  return { level, reasons };
}

// ─── AI INSIGHTS (MOCK) ─────────────────────────────────────
export interface AIInsightResult {
  insights: string[];
  recommendations: string[];
}

export function getAIInsights(c: TechConnector): AIInsightResult {
  const insights: string[] = [];
  const recommendations: string[] = [];

  if (c.status === "connected") {
    const records = 1200 + Math.floor(c.name_tr.length * 317 % 4800);
    insights.push(`Son 24 saatte ${records.toLocaleString()} kayıt senkronize edildi.`);
    insights.push(`${c.coverage_impact.metrics_covered.length} metrik aktif olarak besleniyor.`);
    insights.push(`${c.coverage_impact.agents_impacted.length} AI ajanı bu kaynaktan veri alıyor.`);
    if (c.refresh_frequency === "realtime") {
      insights.push("Gerçek zamanlı veri akışı aktif — gecikme <1dk.");
    }
  }

  if (c.status === "error") {
    insights.push("Hata durumu devam ediyor — veri akışı durmuş.");
    recommendations.push("Bağlantıyı yeniden kurarak veri akışını başlatın.");
  }
  if (c.refresh_frequency === "daily" && c.status === "connected") {
    recommendations.push("Senkronizasyon sıklığını saatlik yaparak daha güncel veri elde edin.");
  }
  if (c.environment_scope_selected.length === 1 && c.environments_supported.length > 1) {
    recommendations.push("Birden fazla ortam ekleyerek veri kapsamını genişletin.");
  }
  if (c.data_sensitivity === "high") {
    recommendations.push("Token rotasyonu için otomatik hatırlatıcı kurun (90 gün).");
  }
  if (c.status === "available") {
    recommendations.push(`${c.name_tr} bağlayarak ${c.coverage_impact.metrics_covered.length} ek metrik kazanın.`);
  }

  return { insights, recommendations };
}

// ─── MOCK METRICS 24H ────────────────────────────────────────
export interface Metrics24h {
  successRatePct: number;
  errorRatePct: number;
  rateLimitHits: number;
  recordsSynced: number;
}

export function getMockMetrics24h(c: TechConnector): Metrics24h {
  if (c.status !== "connected") {
    return { successRatePct: 0, errorRatePct: 0, rateLimitHits: 0, recordsSynced: 0 };
  }
  const seed = c.id.length * 7;
  return {
    successRatePct: 95 + (seed % 5),
    errorRatePct: seed % 5,
    rateLimitHits: seed % 12,
    recordsSynced: 800 + (seed * 137) % 5000,
  };
}

// ─── MOCK SYNC JOBS ──────────────────────────────────────────
export interface SyncJob {
  id: string;
  startedAt: string;
  duration: string;
  records: number;
  status: "success" | "error";
  traceId: string;
  error: string | null;
}

export function generateSyncJobs(c: TechConnector): SyncJob[] {
  if (c.status !== "connected") return [];
  const base = new Date("2026-02-19T09:00:00Z");
  return Array.from({ length: 6 }, (_, i) => ({
    id: `SJ-${3000 - i}`,
    startedAt: new Date(base.getTime() - i * 6 * 3_600_000).toISOString(),
    duration: `${8 + ((c.id.length + i) * 3) % 25}s`,
    records: i === 3 ? 0 : 500 + ((c.id.length + i) * 317) % 3000,
    status: (i === 3 ? "error" : "success") as "success" | "error",
    traceId: `tr-${c.id.slice(0, 3)}${(1000 + i * 111).toString(36)}`,
    error: i === 3 ? "Timeout — upstream API did not respond within 30s." : null,
  }));
}

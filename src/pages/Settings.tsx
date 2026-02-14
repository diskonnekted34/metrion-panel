import { useState } from "react";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, User, Building2, CreditCard, Bell, ChevronDown, ChevronUp, Users, Shield, Plus, Trash2, Package, X } from "lucide-react";
import { Link } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { useRBAC, UserRole, DepartmentId } from "@/contexts/RBACContext";
import { usePacks } from "@/contexts/PackContext";

const Settings = () => {
  const { currentUser, team, roleLabels, departments, canPerform, setCurrentUser } = useRBAC();
  const { activeTier, getActivePacks, getMonthlyTotal, deactivateAddon, isTrial, trialDaysRemaining } = usePacks();
  const [notifOpen, setNotifOpen] = useState(false);
  const [teamOpen, setTeamOpen] = useState(false);
  const [roleSimOpen, setRoleSimOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(false);
  const [notifPrefs, setNotifPrefs] = useState({
    level: "critical_reco",
    email: false,
    inApp: true,
    digest: false,
  });

  const sections = [
    { icon: User, title: "Profile", desc: "Manage your account details and preferences" },
    { icon: Building2, title: "Company", desc: "Company info and workspace settings" },
  ];

  const allRoles: UserRole[] = ["owner", "admin", "department_lead", "operator", "viewer"];
  const allDepts: DepartmentId[] = ["executive", "marketing", "finance", "operations", "technology", "legal"];
  const permissionMatrix = [
    { label: "All Departments", roles: { owner: true, admin: true, department_lead: false, operator: false, viewer: false } },
    { label: "Create Tasks", roles: { owner: true, admin: true, department_lead: true, operator: false, viewer: false } },
    { label: "Edit Thresholds", roles: { owner: true, admin: true, department_lead: false, operator: false, viewer: false } },
    { label: "Manage Billing", roles: { owner: true, admin: false, department_lead: false, operator: false, viewer: false } },
    { label: "Invite Users", roles: { owner: true, admin: true, department_lead: false, operator: false, viewer: false } },
    { label: "Assign Tasks", roles: { owner: true, admin: true, department_lead: true, operator: false, viewer: false } },
    { label: "Finance Data", roles: { owner: true, admin: true, department_lead: false, operator: false, viewer: false } },
  ];

  const simulateRole = (role: UserRole) => {
    const deptMap: Record<UserRole, DepartmentId[]> = {
      owner: allDepts,
      admin: allDepts,
      department_lead: ["marketing"],
      operator: ["operations", "technology"],
      viewer: ["marketing", "finance"],
    };
    setCurrentUser({ ...currentUser, role, departments: deptMap[role] });
  };

  const activePacks = getActivePacks();
  const monthlyTotal = getMonthlyTotal();

  return (
    <AppLayout>
      <div className="p-6 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
              <SettingsIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Settings</h1>
              <p className="text-sm text-muted-foreground">Account & platform configuration</p>
            </div>
          </div>

          <div className="space-y-3">
            {sections.map((section) => (
              <div key={section.title} className="glass-card p-5 flex items-center gap-4 cursor-pointer">
                <div className="h-10 w-10 rounded-2xl bg-white/[0.06] flex items-center justify-center shrink-0">
                  <section.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{section.title}</p>
                  <p className="text-xs text-muted-foreground">{section.desc}</p>
                </div>
              </div>
            ))}

            {/* Subscription Management */}
            <div className="glass-card overflow-hidden">
              <button onClick={() => setSubOpen(!subOpen)} className="w-full p-5 flex items-center gap-4 text-left">
                <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Subscription</p>
                  <p className="text-xs text-muted-foreground">
                    {activeTier.name}{activePacks.length > 0 ? ` + ${activePacks.length} add-on${activePacks.length !== 1 ? "s" : ""}` : ""} · ${monthlyTotal}/mo
                  </p>
                </div>
                {subOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
              </button>
              {subOpen && (
                <div className="px-5 pb-5 pt-0 border-t border-border space-y-4">
                  <div className="pt-4">
                    {/* Current Tier */}
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-primary/5 border border-primary/10">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Shield className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{activeTier.name}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {activeTier.cumulativeAgentIds.length} agents · Current Tier
                            {isTrial && <span className="text-warning ml-2">Trial: {trialDaysRemaining} days left</span>}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-foreground">${activeTier.monthlyPrice}/mo</span>
                    </div>

                    {/* Active Add-ons */}
                    {activePacks.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Active Add-ons</p>
                        {activePacks.map(pack => (
                          <div key={pack.id} className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30">
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-xl bg-accent/10 flex items-center justify-center">
                                <Package className="h-4 w-4 text-accent" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-foreground">{pack.name}</p>
                                <p className="text-[10px] text-muted-foreground">{pack.agents.length} agents</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-bold text-foreground">${pack.monthlyPrice}/mo</span>
                              {canPerform("canManageBilling") && (
                                <button
                                  onClick={() => deactivateAddon(pack.id)}
                                  className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors"
                                  title="Remove Pack"
                                >
                                  <X className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Total */}
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <span className="text-sm font-medium text-foreground">Monthly Total</span>
                      <span className="text-lg font-bold text-primary">${monthlyTotal}/mo</span>
                    </div>

                    <Link to="/marketplace" className="text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5 mt-2">
                      <Plus className="h-3 w-3" /> Upgrade Tier or Add Packs
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Role Simulator */}
            <div className="glass-card overflow-hidden">
              <button onClick={() => setRoleSimOpen(!roleSimOpen)} className="w-full p-5 flex items-center gap-4 text-left">
                <div className="h-10 w-10 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0">
                  <Shield className="h-5 w-5 text-accent" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Role Simulator</p>
                  <p className="text-xs text-muted-foreground">Current: <span className="text-accent font-medium">{roleLabels[currentUser.role]}</span> — Test different roles</p>
                </div>
                {roleSimOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
              </button>
              {roleSimOpen && (
                <div className="px-5 pb-5 pt-0 border-t border-border">
                  <div className="pt-4 flex flex-wrap gap-2">
                    {allRoles.map(role => (
                      <button
                        key={role}
                        onClick={() => simulateRole(role)}
                        className={`px-4 py-2 rounded-2xl text-xs font-medium transition-colors ${
                          currentUser.role === role
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary hover:bg-secondary/80 text-foreground"
                        }`}
                      >
                        {roleLabels[role]}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-3">
                    Switching roles updates navigation and department access instantly.
                  </p>
                </div>
              )}
            </div>

            {/* Team Management */}
            <div className="glass-card overflow-hidden">
              <button onClick={() => setTeamOpen(!teamOpen)} className="w-full p-5 flex items-center gap-4 text-left">
                <div className="h-10 w-10 rounded-2xl bg-white/[0.06] flex items-center justify-center shrink-0">
                  <Users className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Team Management</p>
                  <p className="text-xs text-muted-foreground">Invite users, assign roles and department access</p>
                </div>
                {teamOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
              </button>
              {teamOpen && (
                <div className="px-5 pb-5 pt-0 border-t border-border space-y-5">
                  <div className="pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-semibold text-foreground">{team.length} Members</p>
                      {canPerform("canInviteUsers") && (
                        <button className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                          <Plus className="h-3.5 w-3.5" /> Invite
                        </button>
                      )}
                    </div>
                    <div className="space-y-2">
                      {team.map(member => (
                        <div key={member.id} className="flex items-center justify-between p-3 rounded-2xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary">
                              {member.name.split(" ").map(n => n[0]).join("")}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">{member.name}</p>
                              <p className="text-[10px] text-muted-foreground">{member.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                              member.role === "owner" ? "bg-accent/15 text-accent" :
                              member.role === "admin" ? "bg-primary/15 text-primary" :
                              "bg-secondary text-muted-foreground"
                            }`}>
                              {roleLabels[member.role]}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {member.departments.length === 6 ? "All Depts." : member.departments.length + " Depts."}
                            </span>
                            {canPerform("canInviteUsers") && member.id !== currentUser.id && (
                              <button className="p-1 rounded-lg hover:bg-destructive/10 transition-colors">
                                <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Role Matrix */}
                  <div>
                    <p className="text-xs font-semibold text-foreground mb-3">Permission Matrix</p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-2 pr-4 text-muted-foreground font-medium">Permission</th>
                            {allRoles.map(role => (
                              <th key={role} className={`py-2 px-2 text-center font-medium ${currentUser.role === role ? "text-primary" : "text-muted-foreground"}`}>
                                {roleLabels[role]}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {permissionMatrix.map((perm) => (
                            <tr key={perm.label} className="border-b border-border/50">
                              <td className="py-2.5 pr-4 text-foreground">{perm.label}</td>
                              {allRoles.map(role => (
                                <td key={role} className="py-2.5 px-2 text-center">
                                  {perm.roles[role]
                                    ? <span className="text-success">✓</span>
                                    : <span className="text-muted-foreground/30">—</span>
                                  }
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Notification Preferences */}
            <div className="glass-card overflow-hidden">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="w-full p-5 flex items-center gap-4 text-left"
              >
                <div className="h-10 w-10 rounded-2xl bg-white/[0.06] flex items-center justify-center shrink-0">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Notifications</p>
                  <p className="text-xs text-muted-foreground">Configure alert and notification preferences</p>
                </div>
                {notifOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
              </button>

              {notifOpen && (
                <div className="px-5 pb-5 pt-0 border-t border-border space-y-4">
                  <div className="pt-4">
                    <p className="text-xs font-semibold text-foreground mb-3">Signal Level</p>
                    <div className="space-y-2">
                      {[
                        { value: "critical_only", label: "Critical Only", desc: "Only critical operational signals" },
                        { value: "critical_reco", label: "Critical + Recommendations", desc: "Critical signals and agent recommendations" },
                        { value: "digest", label: "Daily Digest", desc: "All signals as a daily summary report" },
                      ].map((opt) => (
                        <label key={opt.value} className={`flex items-start gap-3 p-3 rounded-2xl cursor-pointer transition-colors ${notifPrefs.level === opt.value ? "bg-primary/10 border border-primary/20" : "bg-secondary/30 hover:bg-secondary/50"}`}>
                          <input type="radio" name="notif_level" checked={notifPrefs.level === opt.value} onChange={() => setNotifPrefs({ ...notifPrefs, level: opt.value })} className="mt-0.5 accent-primary" />
                          <div>
                            <p className="text-sm font-medium text-foreground">{opt.label}</p>
                            <p className="text-xs text-muted-foreground">{opt.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground mb-3">Channel Preferences</p>
                    <div className="space-y-2">
                      {[
                        { key: "inApp" as const, label: "In-App", desc: "Platform notifications" },
                        { key: "email" as const, label: "Email Notifications", desc: "Receive critical signals via email" },
                        { key: "digest" as const, label: "Daily Digest Email", desc: "Signal summary daily at 09:00" },
                      ].map((ch) => (
                        <label key={ch.key} className="flex items-center justify-between p-3 rounded-2xl bg-secondary/30 hover:bg-secondary/50 cursor-pointer transition-colors">
                          <div>
                            <p className="text-sm font-medium text-foreground">{ch.label}</p>
                            <p className="text-xs text-muted-foreground">{ch.desc}</p>
                          </div>
                          <div className={`w-10 h-6 rounded-full flex items-center transition-colors ${notifPrefs[ch.key] ? "bg-primary" : "bg-secondary"}`}>
                            <div
                              className={`w-4 h-4 rounded-full bg-foreground transition-transform mx-1 ${notifPrefs[ch.key] ? "translate-x-4" : ""}`}
                              onClick={(e) => { e.preventDefault(); setNotifPrefs({ ...notifPrefs, [ch.key]: !notifPrefs[ch.key] }); }}
                            />
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Settings;

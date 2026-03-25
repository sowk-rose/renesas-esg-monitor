import { ScrollView, Text, View, TouchableOpacity, Modal } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { ACTION_ITEMS, DEPARTMENTS, COMPANIES, REGULATIONS, NEWS_ITEMS, getESGColor, getImpactColor, getStatusColor, type ActionItem } from "@/lib/esg-data";
import { IconSymbol } from "@/components/ui/icon-symbol";

type FilterStatus = "all" | "completed" | "in-progress" | "not-started" | "blocked";
type FilterDepartment = "all" | string;
type ViewMode = "actions" | "templates" | "report";

function ProgressBar({ progress, color, height = 8 }: { progress: number; color: string; height?: number }) {
  return (
    <View style={{ height, backgroundColor: color + "20", borderRadius: height / 2, width: "100%" }}>
      <View style={{ height, backgroundColor: color, borderRadius: height / 2, width: `${progress}%` as any }} />
    </View>
  );
}

function ActionCard({ action }: { action: ActionItem }) {
  const [expanded, setExpanded] = useState(false);
  const daysUntil = Math.ceil((new Date(action.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const isOverdue = daysUntil < 0;
  const isUrgent = daysUntil >= 0 && daysUntil <= 30;

  return (
    <TouchableOpacity
      className="bg-surface rounded-xl border mb-3 overflow-hidden"
      style={{ borderColor: isOverdue ? "#EF4444" : isUrgent ? "#F97316" : "#E2E8F0", borderWidth: isOverdue || isUrgent ? 1.5 : 1 }}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.7}
    >
      {/* Urgency Banner */}
      {(isOverdue || isUrgent) && (
        <View style={{ backgroundColor: isOverdue ? "#FEE2E2" : "#FEF3C7", paddingHorizontal: 12, paddingVertical: 4 }} className="flex-row items-center gap-1">
          <IconSymbol name="clock.fill" size={12} color={isOverdue ? "#EF4444" : "#F59E0B"} />
          <Text style={{ fontSize: 11, fontWeight: "600", color: isOverdue ? "#991B1B" : "#92400E" }}>
            {isOverdue ? `${Math.abs(daysUntil)} days overdue` : `${daysUntil} days remaining`}
          </Text>
        </View>
      )}

      <View className="p-4">
        {/* Header */}
        <View className="flex-row items-start justify-between mb-2">
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text className="text-sm font-bold text-foreground">{action.title}</Text>
          </View>
          <View style={{ backgroundColor: getImpactColor(action.priority) + "18", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}>
            <Text style={{ color: getImpactColor(action.priority), fontSize: 10, fontWeight: "700" }}>{action.priority.toUpperCase()}</Text>
          </View>
        </View>

        {/* Tags */}
        <View className="flex-row items-center gap-2 mb-3">
          <View style={{ backgroundColor: getESGColor(action.category) + "18", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}>
            <Text style={{ color: getESGColor(action.category), fontSize: 10, fontWeight: "700" }}>{action.category}</Text>
          </View>
          <View style={{ backgroundColor: getStatusColor(action.status) + "18", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}>
            <Text style={{ color: getStatusColor(action.status), fontSize: 10, fontWeight: "600" }}>
              {action.status.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <IconSymbol name="person.3.fill" size={12} color="#64748B" />
            <Text className="text-xs text-muted">{action.assignedDepartment}</Text>
          </View>
        </View>

        {/* Progress */}
        <View className="flex-row items-center gap-2 mb-1">
          <View style={{ flex: 1 }}>
            <ProgressBar progress={action.progress} color={getStatusColor(action.status)} />
          </View>
          <Text className="text-xs font-bold text-muted">{action.progress}%</Text>
        </View>
        <Text className="text-xs text-muted">Due: {action.dueDate}</Text>

        {/* Expanded */}
        {expanded && (
          <View className="mt-3 pt-3 border-t border-border">
            <Text className="text-xs text-foreground leading-5 mb-2">{action.description}</Text>
            {action.relatedRegulation && (
              <View className="flex-row items-center gap-1">
                <IconSymbol name="doc.text.fill" size={12} color="#6366F1" />
                <Text style={{ fontSize: 11, color: "#6366F1", fontWeight: "500" }}>Related: {action.relatedRegulation}</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

function TemplatesView() {
  const templates = [
    {
      title: "ESG Materiality Assessment Template",
      description: "Structured template for conducting double materiality assessment per CSRD requirements.",
      category: "ESG" as const,
      items: ["Stakeholder identification", "Impact assessment matrix", "Financial materiality analysis", "Topic prioritization framework"],
    },
    {
      title: "Supply Chain Due Diligence Checklist",
      description: "Comprehensive checklist for human rights and environmental due diligence across supply chain.",
      category: "S" as const,
      items: ["Supplier risk mapping", "Human rights impact assessment", "Environmental compliance verification", "Remediation action plan"],
    },
    {
      title: "Carbon Emissions Reporting Workflow",
      description: "Step-by-step workflow for Scope 1, 2, and 3 emissions calculation and reporting.",
      category: "E" as const,
      items: ["Data collection from facilities", "Emission factor application", "Scope 3 category assessment", "Verification and assurance"],
    },
    {
      title: "Board ESG Oversight Decision Tree",
      description: "Decision framework for board-level ESG governance and oversight responsibilities.",
      category: "G" as const,
      items: ["Issue identification criteria", "Escalation thresholds", "Committee assignment logic", "Reporting frequency determination"],
    },
    {
      title: "Regulatory Impact Assessment Framework",
      description: "Framework for evaluating the impact of new ESG regulations on Renesas operations.",
      category: "ESG" as const,
      items: ["Regulatory scope analysis", "Operational impact mapping", "Compliance gap assessment", "Resource requirement estimation"],
    },
    {
      title: "Cross-Functional ESG Alignment Workflow",
      description: "Workflow for ensuring HR, Procurement, Legal, and Sustainability alignment on ESG initiatives.",
      category: "ESG" as const,
      items: ["RACI matrix definition", "Communication cadence", "Shared KPI tracking", "Escalation protocol"],
    },
  ];

  return (
    <View className="gap-3">
      {templates.map((template, idx) => (
        <View key={idx} className="bg-surface rounded-xl p-4 border border-border">
          <View className="flex-row items-center gap-2 mb-2">
            <View style={{ backgroundColor: getESGColor(template.category) + "18", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}>
              <Text style={{ color: getESGColor(template.category), fontSize: 10, fontWeight: "700" }}>{template.category}</Text>
            </View>
            <Text className="text-sm font-bold text-foreground flex-1">{template.title}</Text>
          </View>
          <Text className="text-xs text-muted mb-3">{template.description}</Text>
          <View className="gap-1">
            {template.items.map((item, i) => (
              <View key={i} className="flex-row items-center gap-2">
                <View style={{ width: 16, height: 16, borderRadius: 4, borderWidth: 1.5, borderColor: "#CBD5E1", alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ fontSize: 8, color: "#94A3B8" }}>{i + 1}</Text>
                </View>
                <Text className="text-xs text-foreground">{item}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

function ExecutiveReportView() {
  const renesas = COMPANIES.find((c) => c.id === "renesas")!;
  const leader = [...COMPANIES].sort((a, b) => b.scores.total - a.scores.total)[0];
  const criticalActions = ACTION_ITEMS.filter((a) => a.priority === "critical" || a.priority === "high");
  const completedActions = ACTION_ITEMS.filter((a) => a.status === "completed");
  const inProgressActions = ACTION_ITEMS.filter((a) => a.status === "in-progress");
  const criticalRegs = REGULATIONS.filter((r) => r.impactLevel === "critical" || r.impactLevel === "high");
  const highImpactNews = NEWS_ITEMS.filter((n) => n.impactLevel === "high");

  return (
    <View className="gap-4">
      {/* Report Header */}
      <View style={{ backgroundColor: "#00336610", borderWidth: 1, borderColor: "#00336630" }} className="rounded-xl p-4">
        <Text style={{ fontSize: 16, fontWeight: "800", color: "#003366", marginBottom: 4 }}>Executive ESG Summary</Text>
        <Text className="text-xs text-muted">Renesas Electronics Corporation</Text>
        <Text className="text-xs text-muted">Report Date: {new Date().toISOString().split("T")[0]}</Text>
      </View>

      {/* ESG Position */}
      <View className="bg-surface rounded-xl p-4 border border-border">
        <Text style={{ fontSize: 14, fontWeight: "700", color: "#003366", marginBottom: 8 }}>ESG Competitive Position</Text>
        <View className="flex-row items-center justify-between mb-3">
          <View>
            <Text className="text-xs text-muted">Overall ESG Score</Text>
            <Text style={{ fontSize: 28, fontWeight: "800", color: "#003366" }}>{renesas.scores.total}</Text>
          </View>
          <View className="items-end">
            <Text className="text-xs text-muted">Peer Rank</Text>
            <Text style={{ fontSize: 28, fontWeight: "800", color: "#003366" }}>#{renesas.rank}/8</Text>
          </View>
        </View>
        <View className="gap-2">
          <View className="flex-row items-center justify-between">
            <Text className="text-xs text-muted">Environmental</Text>
            <Text style={{ fontSize: 13, fontWeight: "700", color: getESGColor("E") }}>{renesas.scores.environmental} (Leader: {leader.shortName} {leader.scores.environmental})</Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-xs text-muted">Social</Text>
            <Text style={{ fontSize: 13, fontWeight: "700", color: getESGColor("S") }}>{renesas.scores.social} (Leader: {leader.shortName} {leader.scores.social})</Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-xs text-muted">Governance</Text>
            <Text style={{ fontSize: 13, fontWeight: "700", color: getESGColor("G") }}>{renesas.scores.governance} (Leader: {leader.shortName} {leader.scores.governance})</Text>
          </View>
        </View>
      </View>

      {/* Key Regulatory Developments */}
      <View className="bg-surface rounded-xl p-4 border border-border">
        <Text style={{ fontSize: 14, fontWeight: "700", color: "#003366", marginBottom: 8 }}>Key Regulatory Developments</Text>
        {criticalRegs.slice(0, 4).map((reg) => (
          <View key={reg.id} className="flex-row items-start gap-2 mb-2">
            <View style={{ backgroundColor: getImpactColor(reg.impactLevel), width: 6, height: 6, borderRadius: 3, marginTop: 5 }} />
            <View style={{ flex: 1 }}>
              <Text className="text-xs font-semibold text-foreground">{reg.name}</Text>
              <Text className="text-xs text-muted">Status: {reg.responseStatus.replace("-", " ")} | Deadline: {reg.deadline || "Ongoing"}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Action Items Summary */}
      <View className="bg-surface rounded-xl p-4 border border-border">
        <Text style={{ fontSize: 14, fontWeight: "700", color: "#003366", marginBottom: 8 }}>Action Items Overview</Text>
        <View className="flex-row gap-3 mb-3">
          <View className="flex-1 items-center p-2 rounded-lg" style={{ backgroundColor: "#10B98110" }}>
            <Text style={{ fontSize: 18, fontWeight: "800", color: "#10B981" }}>{completedActions.length}</Text>
            <Text className="text-xs text-muted">Completed</Text>
          </View>
          <View className="flex-1 items-center p-2 rounded-lg" style={{ backgroundColor: "#3B82F610" }}>
            <Text style={{ fontSize: 18, fontWeight: "800", color: "#3B82F6" }}>{inProgressActions.length}</Text>
            <Text className="text-xs text-muted">In Progress</Text>
          </View>
          <View className="flex-1 items-center p-2 rounded-lg" style={{ backgroundColor: "#94A3B810" }}>
            <Text style={{ fontSize: 18, fontWeight: "800", color: "#94A3B8" }}>{ACTION_ITEMS.length - completedActions.length - inProgressActions.length}</Text>
            <Text className="text-xs text-muted">Not Started</Text>
          </View>
        </View>
        {criticalActions.slice(0, 3).map((action) => (
          <View key={action.id} className="flex-row items-center justify-between mb-2 pb-2 border-b border-border">
            <View style={{ flex: 1 }}>
              <Text className="text-xs font-semibold text-foreground">{action.title}</Text>
              <Text className="text-xs text-muted">{action.assignedDepartment} · Due: {action.dueDate}</Text>
            </View>
            <Text style={{ fontSize: 12, fontWeight: "700", color: getStatusColor(action.status) }}>{action.progress}%</Text>
          </View>
        ))}
      </View>

      {/* Cross-Functional Alignment */}
      <View className="bg-surface rounded-xl p-4 border border-border">
        <Text style={{ fontSize: 14, fontWeight: "700", color: "#003366", marginBottom: 8 }}>Cross-Functional Alignment</Text>
        {["Sustainability", "Legal", "Procurement", "HR"].map((dept) => {
          const deptActions = ACTION_ITEMS.filter((a) => a.assignedDepartment === dept);
          const avgProgress = deptActions.length > 0
            ? Math.round(deptActions.reduce((sum, a) => sum + a.progress, 0) / deptActions.length)
            : 0;
          return (
            <View key={dept} className="mb-3">
              <View className="flex-row items-center justify-between mb-1">
                <Text className="text-xs font-semibold text-foreground">{dept}</Text>
                <Text className="text-xs text-muted">{deptActions.length} items · {avgProgress}% avg</Text>
              </View>
              <ProgressBar progress={avgProgress} color="#003366" height={6} />
            </View>
          );
        })}
      </View>

      {/* Recent High-Impact News */}
      <View className="bg-surface rounded-xl p-4 border border-border">
        <Text style={{ fontSize: 14, fontWeight: "700", color: "#003366", marginBottom: 8 }}>High-Impact Developments</Text>
        {highImpactNews.map((news) => (
          <View key={news.id} className="mb-3 pb-3 border-b border-border">
            <View className="flex-row items-center gap-2 mb-1">
              <View style={{ backgroundColor: getESGColor(news.category) + "18", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                <Text style={{ color: getESGColor(news.category), fontSize: 9, fontWeight: "700" }}>{news.category}</Text>
              </View>
              <Text className="text-xs text-muted">{news.date}</Text>
            </View>
            <Text className="text-xs font-semibold text-foreground mb-1">{news.title}</Text>
            {news.aiAnalysis && (
              <Text className="text-xs text-muted italic" numberOfLines={2}>{news.aiAnalysis}</Text>
            )}
          </View>
        ))}
      </View>

      {/* Recommendations */}
      <View style={{ backgroundColor: "#6366F108", borderWidth: 1, borderColor: "#6366F130" }} className="rounded-xl p-4">
        <View className="flex-row items-center gap-2 mb-3">
          <IconSymbol name="brain" size={18} color="#6366F1" />
          <Text style={{ fontSize: 14, fontWeight: "700", color: "#6366F1" }}>AI Recommendations</Text>
        </View>
        <View className="gap-3">
          {[
            "Accelerate CSRD double materiality assessment to meet June 2026 deadline. Current progress (45%) requires increased resource allocation.",
            "Benchmark carbon neutrality roadmap against Infineon's 2030 achievement. Consider advancing Renesas target from 2050.",
            "Initiate EU CSDDD preparation immediately. Supply chain due diligence program needs to start by Q2 2026 for July 2027 compliance.",
            "Strengthen cross-functional coordination between Sustainability and Procurement teams for Scope 3 emissions measurement.",
          ].map((rec, idx) => (
            <View key={idx} className="flex-row items-start gap-2">
              <Text style={{ color: "#6366F1", fontSize: 12, fontWeight: "700", marginTop: 1 }}>{idx + 1}.</Text>
              <Text className="text-xs text-foreground leading-5 flex-1">{rec}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

export default function ActionsScreen() {
  const colors = useColors();
  const [viewMode, setViewMode] = useState<ViewMode>("actions");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [filterDepartment, setFilterDepartment] = useState<FilterDepartment>("all");

  const filtered = ACTION_ITEMS.filter((a) => {
    if (filterStatus !== "all" && a.status !== filterStatus) return false;
    if (filterDepartment !== "all" && a.assignedDepartment !== filterDepartment) return false;
    return true;
  });

  const overallProgress = Math.round(ACTION_ITEMS.reduce((sum, a) => sum + a.progress, 0) / ACTION_ITEMS.length);

  return (
    <ScreenContainer className="px-0">
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-5 pt-2 pb-3">
          <Text className="text-2xl font-bold text-foreground">Action Center</Text>
          <Text className="text-sm text-muted mt-1">Plans, Templates & Executive Reports</Text>
        </View>

        {/* View Mode Tabs */}
        <View className="px-5 mb-4">
          <View className="flex-row bg-surface rounded-xl p-1 border border-border">
            {([
              { key: "actions" as ViewMode, label: "Actions" },
              { key: "templates" as ViewMode, label: "Templates" },
              { key: "report" as ViewMode, label: "Exec Report" },
            ]).map((mode) => (
              <TouchableOpacity
                key={mode.key}
                className="flex-1 py-2 rounded-lg items-center"
                style={{ backgroundColor: viewMode === mode.key ? "#003366" : "transparent" }}
                onPress={() => setViewMode(mode.key)}
              >
                <Text style={{ fontSize: 12, fontWeight: "700", color: viewMode === mode.key ? "#FFFFFF" : "#64748B" }}>
                  {mode.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {viewMode === "actions" && (
          <>
            {/* Overall Progress */}
            <View className="px-5 mb-4">
              <View className="bg-surface rounded-xl p-4 border border-border">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-sm font-bold text-foreground">Overall Progress</Text>
                  <Text style={{ fontSize: 18, fontWeight: "800", color: "#003366" }}>{overallProgress}%</Text>
                </View>
                <ProgressBar progress={overallProgress} color="#003366" />
                <View className="flex-row justify-between mt-2">
                  <Text className="text-xs text-muted">{ACTION_ITEMS.filter((a) => a.status === "completed").length} completed</Text>
                  <Text className="text-xs text-muted">{ACTION_ITEMS.filter((a) => a.status === "in-progress").length} in progress</Text>
                  <Text className="text-xs text-muted">{ACTION_ITEMS.filter((a) => a.status === "not-started").length} not started</Text>
                </View>
              </View>
            </View>

            {/* Status Filter */}
            <View className="px-5 mb-3">
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-2">
                  {([
                    { key: "all" as FilterStatus, label: "All" },
                    { key: "in-progress" as FilterStatus, label: "In Progress" },
                    { key: "not-started" as FilterStatus, label: "Not Started" },
                    { key: "completed" as FilterStatus, label: "Completed" },
                    { key: "blocked" as FilterStatus, label: "Blocked" },
                  ]).map((opt) => (
                    <TouchableOpacity
                      key={opt.key}
                      style={{
                        backgroundColor: filterStatus === opt.key ? "#003366" : "transparent",
                        borderWidth: 1,
                        borderColor: filterStatus === opt.key ? "#003366" : "#E2E8F0",
                        paddingHorizontal: 14,
                        paddingVertical: 6,
                        borderRadius: 20,
                      }}
                      onPress={() => setFilterStatus(opt.key)}
                    >
                      <Text style={{ fontSize: 12, fontWeight: "600", color: filterStatus === opt.key ? "#FFFFFF" : "#64748B" }}>
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Department Filter */}
            <View className="px-5 mb-4">
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-2">
                  <TouchableOpacity
                    style={{
                      backgroundColor: filterDepartment === "all" ? "#64748B" : "transparent",
                      borderWidth: 1,
                      borderColor: filterDepartment === "all" ? "#64748B" : "#E2E8F0",
                      paddingHorizontal: 12,
                      paddingVertical: 5,
                      borderRadius: 16,
                    }}
                    onPress={() => setFilterDepartment("all")}
                  >
                    <Text style={{ fontSize: 11, fontWeight: "600", color: filterDepartment === "all" ? "#FFFFFF" : "#94A3B8" }}>All Depts</Text>
                  </TouchableOpacity>
                  {DEPARTMENTS.filter((d) => ACTION_ITEMS.some((a) => a.assignedDepartment === d)).map((dept) => (
                    <TouchableOpacity
                      key={dept}
                      style={{
                        backgroundColor: filterDepartment === dept ? "#64748B" : "transparent",
                        borderWidth: 1,
                        borderColor: filterDepartment === dept ? "#64748B" : "#E2E8F0",
                        paddingHorizontal: 12,
                        paddingVertical: 5,
                        borderRadius: 16,
                      }}
                      onPress={() => setFilterDepartment(dept)}
                    >
                      <Text style={{ fontSize: 11, fontWeight: "600", color: filterDepartment === dept ? "#FFFFFF" : "#94A3B8" }}>{dept}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Action Cards */}
            <View className="px-5">
              <Text className="text-xs text-muted mb-3">{filtered.length} action items</Text>
              {filtered.map((action) => (
                <ActionCard key={action.id} action={action} />
              ))}
            </View>
          </>
        )}

        {viewMode === "templates" && (
          <View className="px-5">
            <Text className="text-sm text-muted mb-4">
              Reusable templates, checklists, and decision frameworks for ESG management.
            </Text>
            <TemplatesView />
          </View>
        )}

        {viewMode === "report" && (
          <View className="px-5">
            <ExecutiveReportView />
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

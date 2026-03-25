import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { REGULATIONS, getESGColor, getImpactColor, getStatusColor, type Regulation } from "@/lib/esg-data";
import { IconSymbol } from "@/components/ui/icon-symbol";

type FilterCategory = "all" | "E" | "S" | "G" | "ESG";
type FilterImpact = "all" | "critical" | "high" | "medium" | "low";

function ImpactBadge({ level }: { level: string }) {
  const color = getImpactColor(level as any);
  return (
    <View style={{ backgroundColor: color + "18", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}>
      <Text style={{ color, fontSize: 10, fontWeight: "700", textTransform: "uppercase" }}>{level}</Text>
    </View>
  );
}

function StatusBadge({ status }: { status: string }) {
  const color = getStatusColor(status);
  const label = status.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return (
    <View style={{ backgroundColor: color + "18", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}>
      <Text style={{ color, fontSize: 10, fontWeight: "700" }}>{label}</Text>
    </View>
  );
}

function getDaysUntil(dateStr?: string): number | null {
  if (!dateStr) return null;
  const target = new Date(dateStr);
  const now = new Date();
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function RegulationCard({ regulation, expanded, onToggle }: { regulation: Regulation; expanded: boolean; onToggle: () => void }) {
  const daysUntil = getDaysUntil(regulation.deadline);
  const isUrgent = daysUntil !== null && daysUntil <= 90 && daysUntil > 0;

  return (
    <TouchableOpacity
      className="bg-surface rounded-xl border mb-3 overflow-hidden"
      style={{ borderColor: isUrgent ? "#F97316" : "#E2E8F0", borderWidth: isUrgent ? 1.5 : 1 }}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      {/* Urgency Banner */}
      {isUrgent && (
        <View style={{ backgroundColor: "#FEF3C7", paddingHorizontal: 12, paddingVertical: 4 }} className="flex-row items-center gap-1">
          <IconSymbol name="clock.fill" size={12} color="#F59E0B" />
          <Text style={{ fontSize: 11, fontWeight: "600", color: "#92400E" }}>
            {daysUntil} days until deadline
          </Text>
        </View>
      )}

      <View className="p-4">
        {/* Header Row */}
        <View className="flex-row items-start justify-between mb-2">
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text className="text-sm font-bold text-foreground" numberOfLines={expanded ? undefined : 2}>{regulation.name}</Text>
          </View>
          <IconSymbol name={expanded ? "arrow.up" : "arrow.down"} size={14} color="#94A3B8" />
        </View>

        {/* Tags Row */}
        <View className="flex-row flex-wrap items-center gap-2 mb-2">
          <View style={{ backgroundColor: getESGColor(regulation.category) + "18", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}>
            <Text style={{ color: getESGColor(regulation.category), fontSize: 10, fontWeight: "700" }}>{regulation.category}</Text>
          </View>
          <ImpactBadge level={regulation.impactLevel} />
          <StatusBadge status={regulation.responseStatus} />
          <View style={{ backgroundColor: "#F1F5F9", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}>
            <Text style={{ fontSize: 10, fontWeight: "600", color: "#64748B" }}>{regulation.region}</Text>
          </View>
        </View>

        {/* Status Row */}
        <View className="flex-row items-center gap-3">
          <Text className="text-xs text-muted">Effective: {regulation.effectiveDate}</Text>
          {regulation.deadline && (
            <Text className="text-xs text-muted">Deadline: {regulation.deadline}</Text>
          )}
        </View>

        {/* Expanded Content */}
        {expanded && (
          <View className="mt-4 pt-3 border-t border-border">
            <View className="mb-3">
              <Text style={{ fontSize: 12, fontWeight: "700", color: "#003366", marginBottom: 4 }}>Overview</Text>
              <Text className="text-xs text-foreground leading-5">{regulation.description}</Text>
            </View>
            <View className="mb-3">
              <Text style={{ fontSize: 12, fontWeight: "700", color: "#F97316", marginBottom: 4 }}>Impact on Renesas</Text>
              <Text className="text-xs text-foreground leading-5">{regulation.renesasImpact}</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Text style={{ fontSize: 12, fontWeight: "700", color: "#64748B" }}>Status:</Text>
              <View style={{ backgroundColor: "#F1F5F9", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}>
                <Text style={{ fontSize: 11, fontWeight: "600", color: getStatusColor(regulation.status) }}>
                  {regulation.status.charAt(0).toUpperCase() + regulation.status.slice(1)}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function RegulationsScreen() {
  const colors = useColors();
  const [filterCategory, setFilterCategory] = useState<FilterCategory>("all");
  const [filterImpact, setFilterImpact] = useState<FilterImpact>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = REGULATIONS.filter((r) => {
    if (filterCategory !== "all" && r.category !== filterCategory) return false;
    if (filterImpact !== "all" && r.impactLevel !== filterImpact) return false;
    return true;
  });

  const criticalCount = REGULATIONS.filter((r) => r.impactLevel === "critical").length;
  const highCount = REGULATIONS.filter((r) => r.impactLevel === "high").length;
  const upcomingDeadlines = REGULATIONS.filter((r) => {
    const days = getDaysUntil(r.deadline);
    return days !== null && days > 0 && days <= 180;
  }).length;

  return (
    <ScreenContainer className="px-0">
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-5 pt-2 pb-3">
          <Text className="text-2xl font-bold text-foreground">Regulation Tracker</Text>
          <Text className="text-sm text-muted mt-1">ESG Regulatory Landscape Monitoring</Text>
        </View>

        {/* Summary Stats */}
        <View className="px-5 mb-4">
          <View className="flex-row gap-3">
            <View className="flex-1 bg-surface rounded-xl p-3 border border-border items-center">
              <Text style={{ fontSize: 22, fontWeight: "800", color: "#EF4444" }}>{criticalCount}</Text>
              <Text className="text-xs text-muted font-medium">Critical</Text>
            </View>
            <View className="flex-1 bg-surface rounded-xl p-3 border border-border items-center">
              <Text style={{ fontSize: 22, fontWeight: "800", color: "#F97316" }}>{highCount}</Text>
              <Text className="text-xs text-muted font-medium">High Impact</Text>
            </View>
            <View className="flex-1 bg-surface rounded-xl p-3 border border-border items-center">
              <Text style={{ fontSize: 22, fontWeight: "800", color: "#003366" }}>{upcomingDeadlines}</Text>
              <Text className="text-xs text-muted font-medium">Deadlines</Text>
            </View>
          </View>
        </View>

        {/* Category Filter */}
        <View className="px-5 mb-3">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              {([
                { key: "all" as FilterCategory, label: "All", color: "#003366" },
                { key: "E" as FilterCategory, label: "Environmental", color: getESGColor("E") },
                { key: "S" as FilterCategory, label: "Social", color: getESGColor("S") },
                { key: "G" as FilterCategory, label: "Governance", color: getESGColor("G") },
                { key: "ESG" as FilterCategory, label: "ESG", color: "#003366" },
              ]).map((opt) => (
                <TouchableOpacity
                  key={opt.key}
                  style={{
                    backgroundColor: filterCategory === opt.key ? opt.color : "transparent",
                    borderWidth: 1,
                    borderColor: filterCategory === opt.key ? opt.color : "#E2E8F0",
                    paddingHorizontal: 14,
                    paddingVertical: 6,
                    borderRadius: 20,
                  }}
                  onPress={() => setFilterCategory(opt.key)}
                >
                  <Text style={{ fontSize: 12, fontWeight: "600", color: filterCategory === opt.key ? "#FFFFFF" : "#64748B" }}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Impact Filter */}
        <View className="px-5 mb-4">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              {([
                { key: "all" as FilterImpact, label: "All Impact" },
                { key: "critical" as FilterImpact, label: "Critical" },
                { key: "high" as FilterImpact, label: "High" },
                { key: "medium" as FilterImpact, label: "Medium" },
                { key: "low" as FilterImpact, label: "Low" },
              ]).map((opt) => (
                <TouchableOpacity
                  key={opt.key}
                  style={{
                    backgroundColor: filterImpact === opt.key ? "#64748B" : "transparent",
                    borderWidth: 1,
                    borderColor: filterImpact === opt.key ? "#64748B" : "#E2E8F0",
                    paddingHorizontal: 12,
                    paddingVertical: 5,
                    borderRadius: 16,
                  }}
                  onPress={() => setFilterImpact(opt.key)}
                >
                  <Text style={{ fontSize: 11, fontWeight: "600", color: filterImpact === opt.key ? "#FFFFFF" : "#94A3B8" }}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Regulation Cards */}
        <View className="px-5">
          <Text className="text-xs text-muted mb-3">{filtered.length} regulations found</Text>
          {filtered.map((reg) => (
            <RegulationCard
              key={reg.id}
              regulation={reg}
              expanded={expandedId === reg.id}
              onToggle={() => setExpandedId(expandedId === reg.id ? null : reg.id)}
            />
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

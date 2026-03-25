import { ScrollView, Text, View, TouchableOpacity, Dimensions } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { COMPANIES, REGULATIONS, NEWS_ITEMS, ACTION_ITEMS, getESGColor, getImpactColor, getStatusColor } from "@/lib/esg-data";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useRouter } from "expo-router";

const renesas = COMPANIES.find((c) => c.id === "renesas")!;
const criticalRegulations = REGULATIONS.filter((r) => r.impactLevel === "critical" || r.impactLevel === "high");
const activeActions = ACTION_ITEMS.filter((a) => a.status !== "completed");
const latestNews = NEWS_ITEMS.slice(0, 3);

function ScoreRing({ score, label, color, size = 72 }: { score: number; label: string; color: string; size?: number }) {
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <View className="items-center gap-1">
      <View style={{ width: size, height: size, position: "relative", alignItems: "center", justifyContent: "center" }}>
        <View
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: color + "20",
            position: "absolute",
          }}
        />
        <View
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: color,
            borderTopColor: color,
            borderRightColor: score > 25 ? color : color + "20",
            borderBottomColor: score > 50 ? color : color + "20",
            borderLeftColor: score > 75 ? color : color + "20",
            position: "absolute",
          }}
        />
        <Text style={{ fontSize: size * 0.26, fontWeight: "800", color }}>{score}</Text>
      </View>
      <Text className="text-xs text-muted font-medium">{label}</Text>
    </View>
  );
}

function AlertBanner({ count, label, color }: { count: number; label: string; color: string }) {
  return (
    <View style={{ backgroundColor: color + "15", borderLeftWidth: 3, borderLeftColor: color }} className="rounded-lg px-4 py-3 flex-row items-center justify-between">
      <View className="flex-row items-center gap-2">
        <View style={{ backgroundColor: color, width: 24, height: 24, borderRadius: 12, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}>{count}</Text>
        </View>
        <Text className="text-sm font-semibold text-foreground">{label}</Text>
      </View>
      <IconSymbol name="chevron.right" size={16} color={color} />
    </View>
  );
}

export default function DashboardScreen() {
  const colors = useColors();
  const router = useRouter();

  return (
    <ScreenContainer className="px-0">
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-5 pt-2 pb-4">
          <Text className="text-2xl font-bold text-foreground">ESG Dashboard</Text>
          <Text className="text-sm text-muted mt-1">Renesas Electronics Corporation</Text>
        </View>

        {/* ESG Score Overview Card */}
        <View className="mx-5 bg-surface rounded-2xl p-5 border border-border mb-4">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-base font-bold text-foreground">ESG Total Score</Text>
              <Text className="text-xs text-muted">Updated: {renesas.lastUpdated}</Text>
            </View>
            <View className="flex-row items-center gap-1" style={{ backgroundColor: "#10B98120", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 }}>
              <IconSymbol name="arrow.up" size={12} color="#10B981" />
              <Text style={{ color: "#10B981", fontSize: 12, fontWeight: "600" }}>Improving</Text>
            </View>
          </View>

          {/* Main Score */}
          <View className="items-center mb-5">
            <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: "#00336610", alignItems: "center", justifyContent: "center", borderWidth: 4, borderColor: "#003366" }}>
              <Text style={{ fontSize: 32, fontWeight: "800", color: "#003366" }}>{renesas.scores.total}</Text>
            </View>
            <Text className="text-xs text-muted mt-2">Rank #{renesas.rank} among 8 peers</Text>
          </View>

          {/* E/S/G Breakdown */}
          <View className="flex-row justify-around">
            <ScoreRing score={renesas.scores.environmental} label="Environmental" color={getESGColor("E")} />
            <ScoreRing score={renesas.scores.social} label="Social" color={getESGColor("S")} />
            <ScoreRing score={renesas.scores.governance} label="Governance" color={getESGColor("G")} />
          </View>
        </View>

        {/* Risk Alerts */}
        <View className="px-5 mb-4">
          <Text className="text-base font-bold text-foreground mb-3">Risk Alerts</Text>
          <View className="gap-2">
            <AlertBanner
              count={criticalRegulations.length}
              label="High-impact regulations requiring action"
              color="#F97316"
            />
            <AlertBanner
              count={activeActions.filter((a) => a.priority === "critical").length}
              label="Critical action items pending"
              color="#EF4444"
            />
            <AlertBanner
              count={NEWS_ITEMS.filter((n) => n.impactLevel === "high").length}
              label="High-impact ESG developments"
              color="#003366"
            />
          </View>
        </View>

        {/* Quick Actions Grid */}
        <View className="px-5 mb-4">
          <Text className="text-base font-bold text-foreground mb-3">Quick Access</Text>
          <View className="flex-row flex-wrap gap-3">
            {[
              { label: "Benchmark", icon: "chart.bar.fill" as const, color: "#003366", tab: "benchmark" },
              { label: "Regulations", icon: "doc.text.fill" as const, color: "#6366F1", tab: "regulations" },
              { label: "AI Insights", icon: "lightbulb.fill" as const, color: "#F59E0B", tab: "insights" },
              { label: "Actions", icon: "checklist" as const, color: "#10B981", tab: "actions" },
            ].map((item) => (
              <TouchableOpacity
                key={item.label}
                className="bg-surface rounded-xl p-4 border border-border"
                style={{ width: "47%", minWidth: 140 }}
                onPress={() => router.push(`/(tabs)/${item.tab}` as any)}
              >
                <View style={{ backgroundColor: item.color + "15", width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
                  <IconSymbol name={item.icon} size={20} color={item.color} />
                </View>
                <Text className="text-sm font-semibold text-foreground">{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Latest News Preview */}
        <View className="px-5 mb-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-base font-bold text-foreground">Latest ESG News</Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/insights" as any)}>
              <Text style={{ color: "#00A0E9", fontSize: 13, fontWeight: "600" }}>View All</Text>
            </TouchableOpacity>
          </View>
          <View className="gap-3">
            {latestNews.map((news) => (
              <View key={news.id} className="bg-surface rounded-xl p-4 border border-border">
                <View className="flex-row items-center gap-2 mb-2">
                  <View style={{ backgroundColor: getESGColor(news.category) + "20", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}>
                    <Text style={{ color: getESGColor(news.category), fontSize: 11, fontWeight: "700" }}>{news.category}</Text>
                  </View>
                  <View style={{ backgroundColor: getImpactColor(news.impactLevel) + "20", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}>
                    <Text style={{ color: getImpactColor(news.impactLevel), fontSize: 11, fontWeight: "600" }}>{news.impactLevel.toUpperCase()}</Text>
                  </View>
                  <Text className="text-xs text-muted ml-auto">{news.date}</Text>
                </View>
                <Text className="text-sm font-semibold text-foreground mb-1" numberOfLines={2}>{news.title}</Text>
                <Text className="text-xs text-muted" numberOfLines={2}>{news.summary}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Active Actions Preview */}
        <View className="px-5 mb-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-base font-bold text-foreground">Priority Actions</Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/actions" as any)}>
              <Text style={{ color: "#00A0E9", fontSize: 13, fontWeight: "600" }}>View All</Text>
            </TouchableOpacity>
          </View>
          <View className="gap-3">
            {activeActions.filter((a) => a.priority === "critical" || a.priority === "high").slice(0, 3).map((action) => (
              <View key={action.id} className="bg-surface rounded-xl p-4 border border-border">
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center gap-2">
                    <View style={{ backgroundColor: getESGColor(action.category) + "20", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}>
                      <Text style={{ color: getESGColor(action.category), fontSize: 11, fontWeight: "700" }}>{action.category}</Text>
                    </View>
                    <View style={{ backgroundColor: getImpactColor(action.priority) + "20", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}>
                      <Text style={{ color: getImpactColor(action.priority), fontSize: 11, fontWeight: "600" }}>{action.priority.toUpperCase()}</Text>
                    </View>
                  </View>
                  <Text className="text-xs text-muted">{action.assignedDepartment}</Text>
                </View>
                <Text className="text-sm font-semibold text-foreground mb-2">{action.title}</Text>
                {/* Progress Bar */}
                <View className="flex-row items-center gap-2">
                  <View style={{ flex: 1, height: 6, backgroundColor: "#E2E8F0", borderRadius: 3 }}>
                    <View style={{ width: `${action.progress}%`, height: 6, backgroundColor: getStatusColor(action.status), borderRadius: 3 }} />
                  </View>
                  <Text className="text-xs font-semibold text-muted">{action.progress}%</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

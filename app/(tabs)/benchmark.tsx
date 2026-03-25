import { ScrollView, Text, View, TouchableOpacity, Dimensions } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { COMPANIES, getESGColor, type CompanyESG } from "@/lib/esg-data";
import { IconSymbol } from "@/components/ui/icon-symbol";

type SortKey = "total" | "environmental" | "social" | "governance";
type ViewMode = "ranking" | "comparison" | "detail";

const sortedByKey = (companies: CompanyESG[], key: SortKey) => {
  return [...companies].sort((a, b) => {
    if (key === "total") return b.scores.total - a.scores.total;
    return b.scores[key] - a.scores[key];
  });
};

function RankBadge({ rank }: { rank: number }) {
  const bg = rank === 1 ? "#F59E0B" : rank === 2 ? "#94A3B8" : rank === 3 ? "#CD7F32" : "#E2E8F0";
  const text = rank <= 3 ? "#FFFFFF" : "#64748B";
  return (
    <View style={{ backgroundColor: bg, width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ color: text, fontSize: 13, fontWeight: "800" }}>{rank}</Text>
    </View>
  );
}

function ScoreBar({ score, maxScore = 100, color, height = 8 }: { score: number; maxScore?: number; color: string; height?: number }) {
  const width = `${(score / maxScore) * 100}%`;
  return (
    <View style={{ height, backgroundColor: color + "20", borderRadius: height / 2, width: "100%" }}>
      <View style={{ height, backgroundColor: color, borderRadius: height / 2, width: width as any }} />
    </View>
  );
}

function CompanyRankCard({ company, rank, isRenesas }: { company: CompanyESG; rank: number; isRenesas: boolean }) {
  return (
    <View
      className="bg-surface rounded-xl p-4 border mb-3"
      style={{ borderColor: isRenesas ? "#003366" : "#E2E8F0", borderWidth: isRenesas ? 2 : 1 }}
    >
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-3">
          <RankBadge rank={rank} />
          <View>
            <Text className="text-sm font-bold text-foreground">{company.shortName}</Text>
            <Text className="text-xs text-muted">{company.country} · {company.ticker}</Text>
          </View>
        </View>
        <View className="items-end">
          <Text style={{ fontSize: 22, fontWeight: "800", color: "#003366" }}>{company.scores.total}</Text>
          <View className="flex-row items-center gap-1">
            {company.trend === "up" && <IconSymbol name="arrow.up" size={10} color="#10B981" />}
            {company.trend === "down" && <IconSymbol name="arrow.down" size={10} color="#EF4444" />}
            <Text style={{ fontSize: 10, color: company.trend === "up" ? "#10B981" : company.trend === "down" ? "#EF4444" : "#94A3B8", fontWeight: "600" }}>
              {company.trend === "up" ? "Improving" : company.trend === "down" ? "Declining" : "Stable"}
            </Text>
          </View>
        </View>
      </View>

      {/* E/S/G Score Bars */}
      <View className="gap-2">
        <View className="flex-row items-center gap-2">
          <Text style={{ width: 14, fontSize: 11, fontWeight: "700", color: getESGColor("E") }}>E</Text>
          <View style={{ flex: 1 }}><ScoreBar score={company.scores.environmental} color={getESGColor("E")} /></View>
          <Text style={{ width: 28, fontSize: 12, fontWeight: "700", color: getESGColor("E"), textAlign: "right" }}>{company.scores.environmental}</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Text style={{ width: 14, fontSize: 11, fontWeight: "700", color: getESGColor("S") }}>S</Text>
          <View style={{ flex: 1 }}><ScoreBar score={company.scores.social} color={getESGColor("S")} /></View>
          <Text style={{ width: 28, fontSize: 12, fontWeight: "700", color: getESGColor("S"), textAlign: "right" }}>{company.scores.social}</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Text style={{ width: 14, fontSize: 11, fontWeight: "700", color: getESGColor("G") }}>G</Text>
          <View style={{ flex: 1 }}><ScoreBar score={company.scores.governance} color={getESGColor("G")} /></View>
          <Text style={{ width: 28, fontSize: 12, fontWeight: "700", color: getESGColor("G"), textAlign: "right" }}>{company.scores.governance}</Text>
        </View>
      </View>
    </View>
  );
}

function ComparisonTable({ companies, sortKey }: { companies: CompanyESG[]; sortKey: SortKey }) {
  const sorted = sortedByKey(companies, sortKey);
  return (
    <View className="bg-surface rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <View className="flex-row px-4 py-3 border-b border-border" style={{ backgroundColor: "#F8FAFC" }}>
        <Text style={{ width: 40, fontSize: 11, fontWeight: "700", color: "#64748B" }}>#</Text>
        <Text style={{ flex: 1, fontSize: 11, fontWeight: "700", color: "#64748B" }}>Company</Text>
        <Text style={{ width: 44, fontSize: 11, fontWeight: "700", color: getESGColor("E"), textAlign: "center" }}>E</Text>
        <Text style={{ width: 44, fontSize: 11, fontWeight: "700", color: getESGColor("S"), textAlign: "center" }}>S</Text>
        <Text style={{ width: 44, fontSize: 11, fontWeight: "700", color: getESGColor("G"), textAlign: "center" }}>G</Text>
        <Text style={{ width: 50, fontSize: 11, fontWeight: "700", color: "#003366", textAlign: "center" }}>Total</Text>
      </View>
      {/* Rows */}
      {sorted.map((company, idx) => {
        const isRenesas = company.id === "renesas";
        return (
          <View
            key={company.id}
            className="flex-row px-4 py-3 items-center"
            style={{
              backgroundColor: isRenesas ? "#00336608" : idx % 2 === 0 ? "#FFFFFF" : "#F8FAFC",
              borderBottomWidth: idx < sorted.length - 1 ? 0.5 : 0,
              borderBottomColor: "#E2E8F0",
            }}
          >
            <View style={{ width: 40 }}><RankBadge rank={idx + 1} /></View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, fontWeight: isRenesas ? "800" : "600", color: isRenesas ? "#003366" : "#0F172A" }}>{company.shortName}</Text>
              <Text style={{ fontSize: 10, color: "#94A3B8" }}>{company.country}</Text>
            </View>
            <Text style={{ width: 44, fontSize: 12, fontWeight: "600", color: getESGColor("E"), textAlign: "center" }}>{company.scores.environmental}</Text>
            <Text style={{ width: 44, fontSize: 12, fontWeight: "600", color: getESGColor("S"), textAlign: "center" }}>{company.scores.social}</Text>
            <Text style={{ width: 44, fontSize: 12, fontWeight: "600", color: getESGColor("G"), textAlign: "center" }}>{company.scores.governance}</Text>
            <Text style={{ width: 50, fontSize: 13, fontWeight: "800", color: "#003366", textAlign: "center" }}>{company.scores.total}</Text>
          </View>
        );
      })}
    </View>
  );
}

function CompanyDetailCard({ company }: { company: CompanyESG }) {
  return (
    <View className="bg-surface rounded-xl p-4 border border-border mb-3">
      <View className="flex-row items-center justify-between mb-3">
        <View>
          <Text className="text-base font-bold text-foreground">{company.name}</Text>
          <Text className="text-xs text-muted">{company.country} · {company.ticker}</Text>
        </View>
        <Text style={{ fontSize: 24, fontWeight: "800", color: "#003366" }}>{company.scores.total}</Text>
      </View>

      {/* Strengths */}
      <View className="mb-3">
        <Text style={{ fontSize: 12, fontWeight: "700", color: "#10B981", marginBottom: 4 }}>Strengths</Text>
        {company.highlights.map((h, i) => (
          <View key={i} className="flex-row items-start gap-2 mb-1">
            <Text style={{ color: "#10B981", fontSize: 10, marginTop: 2 }}>●</Text>
            <Text className="text-xs text-foreground flex-1">{h}</Text>
          </View>
        ))}
      </View>

      {/* Risks */}
      <View>
        <Text style={{ fontSize: 12, fontWeight: "700", color: "#EF4444", marginBottom: 4 }}>Risks</Text>
        {company.risks.map((r, i) => (
          <View key={i} className="flex-row items-start gap-2 mb-1">
            <Text style={{ color: "#EF4444", fontSize: 10, marginTop: 2 }}>●</Text>
            <Text className="text-xs text-foreground flex-1">{r}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function BenchmarkScreen() {
  const colors = useColors();
  const [viewMode, setViewMode] = useState<ViewMode>("ranking");
  const [sortKey, setSortKey] = useState<SortKey>("total");

  const sorted = sortedByKey(COMPANIES, sortKey);

  return (
    <ScreenContainer className="px-0">
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-5 pt-2 pb-3">
          <Text className="text-2xl font-bold text-foreground">ESG Benchmark</Text>
          <Text className="text-sm text-muted mt-1">8 Semiconductor Companies Comparison</Text>
        </View>

        {/* View Mode Tabs */}
        <View className="px-5 mb-4">
          <View className="flex-row bg-surface rounded-xl p-1 border border-border">
            {(["ranking", "comparison", "detail"] as ViewMode[]).map((mode) => (
              <TouchableOpacity
                key={mode}
                className="flex-1 py-2 rounded-lg items-center"
                style={{ backgroundColor: viewMode === mode ? "#003366" : "transparent" }}
                onPress={() => setViewMode(mode)}
              >
                <Text style={{ fontSize: 12, fontWeight: "700", color: viewMode === mode ? "#FFFFFF" : "#64748B" }}>
                  {mode === "ranking" ? "Ranking" : mode === "comparison" ? "Table" : "Detail"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Sort Options */}
        <View className="px-5 mb-4">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              {([
                { key: "total" as SortKey, label: "Total ESG", color: "#003366" },
                { key: "environmental" as SortKey, label: "Environmental", color: getESGColor("E") },
                { key: "social" as SortKey, label: "Social", color: getESGColor("S") },
                { key: "governance" as SortKey, label: "Governance", color: getESGColor("G") },
              ]).map((opt) => (
                <TouchableOpacity
                  key={opt.key}
                  style={{
                    backgroundColor: sortKey === opt.key ? opt.color : "transparent",
                    borderWidth: 1,
                    borderColor: sortKey === opt.key ? opt.color : "#E2E8F0",
                    paddingHorizontal: 14,
                    paddingVertical: 6,
                    borderRadius: 20,
                  }}
                  onPress={() => setSortKey(opt.key)}
                >
                  <Text style={{ fontSize: 12, fontWeight: "600", color: sortKey === opt.key ? "#FFFFFF" : "#64748B" }}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Renesas Position Summary */}
        <View className="px-5 mb-4">
          <View style={{ backgroundColor: "#00336610", borderWidth: 1, borderColor: "#00336630" }} className="rounded-xl p-4">
            <View className="flex-row items-center justify-between">
              <View>
                <Text style={{ fontSize: 12, fontWeight: "600", color: "#003366" }}>Renesas Position</Text>
                <Text style={{ fontSize: 24, fontWeight: "800", color: "#003366" }}>
                  #{sortedByKey(COMPANIES, sortKey).findIndex((c) => c.id === "renesas") + 1}
                  <Text style={{ fontSize: 14, fontWeight: "500", color: "#64748B" }}> of 8</Text>
                </Text>
              </View>
              <View className="items-end">
                <Text style={{ fontSize: 12, color: "#64748B" }}>
                  {sortKey === "total" ? "Total" : sortKey.charAt(0).toUpperCase() + sortKey.slice(1)} Score
                </Text>
                <Text style={{ fontSize: 28, fontWeight: "800", color: "#003366" }}>
                  {sortKey === "total"
                    ? COMPANIES.find((c) => c.id === "renesas")!.scores.total
                    : COMPANIES.find((c) => c.id === "renesas")!.scores[sortKey]}
                </Text>
              </View>
            </View>
            <View className="flex-row items-center gap-2 mt-2">
              <Text style={{ fontSize: 11, color: "#64748B" }}>
                Peer Average: {(sorted.reduce((sum, c) => sum + (sortKey === "total" ? c.scores.total : c.scores[sortKey]), 0) / sorted.length).toFixed(1)}
              </Text>
              <Text style={{ fontSize: 11, color: "#64748B" }}>·</Text>
              <Text style={{ fontSize: 11, color: "#64748B" }}>
                Leader: {sorted[0].shortName} ({sortKey === "total" ? sorted[0].scores.total : sorted[0].scores[sortKey]})
              </Text>
            </View>
          </View>
        </View>

        {/* Content based on view mode */}
        <View className="px-5">
          {viewMode === "ranking" && sorted.map((company, idx) => (
            <CompanyRankCard
              key={company.id}
              company={company}
              rank={idx + 1}
              isRenesas={company.id === "renesas"}
            />
          ))}

          {viewMode === "comparison" && (
            <ComparisonTable companies={COMPANIES} sortKey={sortKey} />
          )}

          {viewMode === "detail" && sorted.map((company) => (
            <CompanyDetailCard key={company.id} company={company} />
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

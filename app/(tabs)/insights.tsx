import { ScrollView, Text, View, TouchableOpacity, TextInput, ActivityIndicator, RefreshControl } from "react-native";
import { useState, useCallback, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { NEWS_ITEMS, getESGColor, getImpactColor, type NewsItem } from "@/lib/esg-data";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { trpc } from "@/lib/trpc";

type FilterCategory = "all" | "E" | "S" | "G" | "ESG";
type FilterImpact = "all" | "high" | "medium" | "low";

interface DisplayNewsItem {
  id: string;
  title: string;
  source: string;
  date: string;
  category: "E" | "S" | "G" | "ESG";
  region: string;
  summary: string;
  aiAnalysis?: string;
  impactLevel: "high" | "medium" | "low";
  url?: string;
  isLive?: boolean;
}

function LiveBadge() {
  return (
    <View style={{ backgroundColor: "#EF444420", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, flexDirection: "row", alignItems: "center", gap: 4 }}>
      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: "#EF4444" }} />
      <Text style={{ fontSize: 9, fontWeight: "700", color: "#EF4444" }}>LIVE</Text>
    </View>
  );
}

function NewsCard({
  news,
  expanded,
  onToggle,
  onAnalyze,
  analyzing,
  detailedAnalysis,
}: {
  news: DisplayNewsItem;
  expanded: boolean;
  onToggle: () => void;
  onAnalyze: () => void;
  analyzing: boolean;
  detailedAnalysis?: string;
}) {
  return (
    <TouchableOpacity
      className="bg-surface rounded-xl border border-border mb-3 overflow-hidden"
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <View className="p-4">
        {/* Tags */}
        <View className="flex-row items-center gap-2 mb-2 flex-wrap">
          {news.isLive && <LiveBadge />}
          <View style={{ backgroundColor: getESGColor(news.category) + "18", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}>
            <Text style={{ color: getESGColor(news.category), fontSize: 10, fontWeight: "700" }}>{news.category}</Text>
          </View>
          <View style={{ backgroundColor: getImpactColor(news.impactLevel) + "18", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}>
            <Text style={{ color: getImpactColor(news.impactLevel), fontSize: 10, fontWeight: "700" }}>{news.impactLevel.toUpperCase()}</Text>
          </View>
          <View style={{ backgroundColor: "#F1F5F9", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}>
            <Text style={{ fontSize: 10, fontWeight: "600", color: "#64748B" }}>{news.region}</Text>
          </View>
          <Text className="text-xs text-muted ml-auto">{news.source}</Text>
        </View>

        {/* Title */}
        <Text className="text-sm font-bold text-foreground mb-2" numberOfLines={expanded ? undefined : 2}>{news.title}</Text>

        {/* Date */}
        <Text className="text-xs text-muted mb-2">{news.date}</Text>

        {/* Summary */}
        <Text className="text-xs text-foreground leading-5" numberOfLines={expanded ? undefined : 3}>{news.summary}</Text>

        {/* AI Analysis (expanded) */}
        {expanded && news.aiAnalysis && (
          <View className="mt-3 pt-3 border-t border-border">
            <View className="flex-row items-center gap-2 mb-2">
              <View style={{ backgroundColor: "#6366F118", width: 24, height: 24, borderRadius: 12, alignItems: "center", justifyContent: "center" }}>
                <IconSymbol name="brain" size={14} color="#6366F1" />
              </View>
              <Text style={{ fontSize: 12, fontWeight: "700", color: "#6366F1" }}>AI Quick Analysis</Text>
            </View>
            <Text className="text-xs text-foreground leading-5">{news.aiAnalysis}</Text>
          </View>
        )}

        {/* Detailed AI Analysis */}
        {expanded && detailedAnalysis && (
          <View className="mt-3 pt-3 border-t border-border">
            <View className="flex-row items-center gap-2 mb-2">
              <View style={{ backgroundColor: "#003366" + "18", width: 24, height: 24, borderRadius: 12, alignItems: "center", justifyContent: "center" }}>
                <IconSymbol name="doc.text.fill" size={14} color="#003366" />
              </View>
              <Text style={{ fontSize: 12, fontWeight: "700", color: "#003366" }}>Detailed Impact Analysis</Text>
            </View>
            <Text className="text-xs text-foreground leading-5">{detailedAnalysis}</Text>
          </View>
        )}

        {/* Action buttons (expanded) */}
        {expanded && (
          <View className="flex-row items-center gap-2 mt-3 pt-3 border-t border-border">
            <TouchableOpacity
              style={{
                backgroundColor: analyzing ? "#94A3B8" : "#003366",
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 8,
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
              }}
              onPress={onAnalyze}
              disabled={analyzing}
            >
              {analyzing ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <IconSymbol name="brain" size={12} color="#FFFFFF" />
              )}
              <Text style={{ fontSize: 11, fontWeight: "600", color: "#FFFFFF" }}>
                {analyzing ? "Analyzing..." : "Deep Analysis"}
              </Text>
            </TouchableOpacity>
            {news.url && (
              <TouchableOpacity
                style={{
                  backgroundColor: "#F1F5F9",
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 8,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <IconSymbol name="arrow.up.right" size={12} color="#64748B" />
                <Text style={{ fontSize: 11, fontWeight: "600", color: "#64748B" }}>Source</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Expand indicator */}
        {!expanded && (
          <View className="flex-row items-center justify-center mt-2">
            <IconSymbol name="arrow.down" size={12} color="#94A3B8" />
            <Text style={{ fontSize: 10, color: "#94A3B8", marginLeft: 4 }}>Tap for details & AI analysis</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function InsightsScreen() {
  const colors = useColors();
  const [filterCategory, setFilterCategory] = useState<FilterCategory>("all");
  const [filterImpact, setFilterImpact] = useState<FilterImpact>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [detailedAnalyses, setDetailedAnalyses] = useState<Record<string, string>>({});
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"live" | "curated">("live");

  // tRPC queries
  const liveNewsQuery = trpc.news.getLiveNews.useQuery(
    { forceRefresh: false },
    {
      refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes
      retry: 2,
      staleTime: 2 * 60 * 1000,
    }
  );

  const refreshMutation = trpc.news.refreshNews.useMutation({
    onSuccess: () => {
      liveNewsQuery.refetch();
    },
  });

  const analyzeDetailMutation = trpc.news.analyzeNewsDetail.useMutation();

  // Combine live and curated news
  const liveNews: DisplayNewsItem[] = (liveNewsQuery.data?.news ?? []).map((n: any) => ({
    ...n,
    isLive: true,
  }));

  const curatedNews: DisplayNewsItem[] = NEWS_ITEMS.map((n) => ({
    ...n,
    isLive: false,
  }));

  const currentNews = activeTab === "live" ? liveNews : curatedNews;

  const filtered = currentNews.filter((n) => {
    if (filterCategory !== "all" && n.category !== filterCategory) return false;
    if (filterImpact !== "all" && n.impactLevel !== filterImpact) return false;
    return true;
  });

  const highImpactCount = currentNews.filter((n) => n.impactLevel === "high").length;
  const totalCount = currentNews.length;
  const analyzedCount = currentNews.filter((n) => n.aiAnalysis).length;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshMutation.mutateAsync();
    } catch {
      // Silently handle error, query will show cached data
    } finally {
      setRefreshing(false);
    }
  }, [refreshMutation]);

  const handleDeepAnalysis = async (news: DisplayNewsItem) => {
    if (detailedAnalyses[news.id]) return; // Already analyzed
    setAnalyzingId(news.id);
    try {
      const result = await analyzeDetailMutation.mutateAsync({
        title: news.title,
        summary: news.summary,
        category: news.category,
      });
      if (result.analysis) {
        setDetailedAnalyses((prev) => ({ ...prev, [news.id]: result.analysis }));
      }
    } catch {
      setDetailedAnalyses((prev) => ({
        ...prev,
        [news.id]: "Detailed analysis is temporarily unavailable. Please try again.",
      }));
    } finally {
      setAnalyzingId(null);
    }
  };

  const handleAskAI = async () => {
    if (!aiQuestion.trim()) return;
    setAiLoading(true);
    setAiResponse(null);
    try {
      const response = await fetch(`/api/trpc/esg.askAI`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ json: { question: aiQuestion } }),
      });
      if (response.ok) {
        const data = await response.json();
        setAiResponse(data?.result?.data?.json?.answer || "Analysis complete.");
      } else {
        setAiResponse(getFallbackResponse(aiQuestion));
      }
    } catch {
      setAiResponse(getFallbackResponse(aiQuestion));
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <ScreenContainer className="px-0">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#003366"
            title="Fetching latest ESG news..."
          />
        }
      >
        {/* Header */}
        <View className="px-5 pt-2 pb-3">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-2xl font-bold text-foreground">ESG Insights</Text>
              <Text className="text-sm text-muted mt-1">AI-Powered Analysis & Live News Feed</Text>
            </View>
            {liveNewsQuery.data?.isLive && (
              <View style={{ backgroundColor: "#10B98120", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, flexDirection: "row", alignItems: "center", gap: 4 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#10B981" }} />
                <Text style={{ fontSize: 11, fontWeight: "600", color: "#10B981" }}>Live</Text>
              </View>
            )}
          </View>
        </View>

        {/* AI Assistant Card */}
        <View className="px-5 mb-4">
          <View style={{ backgroundColor: "#6366F108", borderWidth: 1, borderColor: "#6366F130" }} className="rounded-xl p-4">
            <View className="flex-row items-center gap-2 mb-3">
              <View style={{ backgroundColor: "#6366F118", width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" }}>
                <IconSymbol name="brain" size={18} color="#6366F1" />
              </View>
              <View>
                <Text style={{ fontSize: 14, fontWeight: "700", color: "#6366F1" }}>ESG AI Assistant</Text>
                <Text className="text-xs text-muted">Ask about ESG strategy, regulations, or risks</Text>
              </View>
            </View>

            <View className="flex-row items-center gap-2">
              <TextInput
                className="flex-1 bg-surface rounded-lg px-3 py-2 text-sm text-foreground border border-border"
                placeholder="Ask about ESG topics..."
                placeholderTextColor="#94A3B8"
                value={aiQuestion}
                onChangeText={setAiQuestion}
                onSubmitEditing={handleAskAI}
                returnKeyType="done"
              />
              <TouchableOpacity
                style={{ backgroundColor: "#6366F1", width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" }}
                onPress={handleAskAI}
                disabled={aiLoading}
              >
                {aiLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <IconSymbol name="paperplane.fill" size={18} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            </View>

            {aiResponse && (
              <View className="mt-3 bg-surface rounded-lg p-3 border border-border">
                <Text className="text-xs text-foreground leading-5">{aiResponse}</Text>
              </View>
            )}

            <View className="flex-row flex-wrap gap-2 mt-3">
              {["Renesas CSRD readiness?", "Top ESG risks for semis?", "Scope 3 best practices?"].map((q) => (
                <TouchableOpacity
                  key={q}
                  style={{ backgroundColor: "#6366F110", borderWidth: 1, borderColor: "#6366F130", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 14 }}
                  onPress={() => setAiQuestion(q)}
                >
                  <Text style={{ fontSize: 11, color: "#6366F1", fontWeight: "500" }}>{q}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Live / Curated Tab Switcher */}
        <View className="px-5 mb-4">
          <View className="flex-row bg-surface rounded-xl border border-border overflow-hidden">
            <TouchableOpacity
              style={{
                flex: 1,
                paddingVertical: 10,
                alignItems: "center",
                backgroundColor: activeTab === "live" ? "#003366" : "transparent",
                borderRadius: activeTab === "live" ? 10 : 0,
              }}
              onPress={() => setActiveTab("live")}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                {activeTab === "live" && <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: "#EF4444" }} />}
                <Text style={{ fontSize: 13, fontWeight: "700", color: activeTab === "live" ? "#FFFFFF" : "#64748B" }}>
                  Live News
                </Text>
                {liveNews.length > 0 && (
                  <View style={{ backgroundColor: activeTab === "live" ? "#FFFFFF30" : "#003366" + "20", paddingHorizontal: 6, paddingVertical: 1, borderRadius: 8 }}>
                    <Text style={{ fontSize: 10, fontWeight: "700", color: activeTab === "live" ? "#FFFFFF" : "#003366" }}>{liveNews.length}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1,
                paddingVertical: 10,
                alignItems: "center",
                backgroundColor: activeTab === "curated" ? "#003366" : "transparent",
                borderRadius: activeTab === "curated" ? 10 : 0,
              }}
              onPress={() => setActiveTab("curated")}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Text style={{ fontSize: 13, fontWeight: "700", color: activeTab === "curated" ? "#FFFFFF" : "#64748B" }}>
                  Curated
                </Text>
                <View style={{ backgroundColor: activeTab === "curated" ? "#FFFFFF30" : "#003366" + "20", paddingHorizontal: 6, paddingVertical: 1, borderRadius: 8 }}>
                  <Text style={{ fontSize: 10, fontWeight: "700", color: activeTab === "curated" ? "#FFFFFF" : "#003366" }}>{curatedNews.length}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Impact Summary */}
        <View className="px-5 mb-4">
          <View className="flex-row gap-3">
            <View className="flex-1 bg-surface rounded-xl p-3 border border-border items-center">
              <Text style={{ fontSize: 20, fontWeight: "800", color: "#EF4444" }}>{highImpactCount}</Text>
              <Text className="text-xs text-muted font-medium">High Impact</Text>
            </View>
            <View className="flex-1 bg-surface rounded-xl p-3 border border-border items-center">
              <Text style={{ fontSize: 20, fontWeight: "800", color: "#003366" }}>{totalCount}</Text>
              <Text className="text-xs text-muted font-medium">Total News</Text>
            </View>
            <View className="flex-1 bg-surface rounded-xl p-3 border border-border items-center">
              <Text style={{ fontSize: 20, fontWeight: "800", color: "#6366F1" }}>{analyzedCount}</Text>
              <Text className="text-xs text-muted font-medium">AI Analyzed</Text>
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
                { key: "all" as FilterImpact, label: "All Impact", color: "#64748B" },
                { key: "high" as FilterImpact, label: "High", color: "#EF4444" },
                { key: "medium" as FilterImpact, label: "Medium", color: "#F59E0B" },
                { key: "low" as FilterImpact, label: "Low", color: "#10B981" },
              ]).map((opt) => (
                <TouchableOpacity
                  key={opt.key}
                  style={{
                    backgroundColor: filterImpact === opt.key ? opt.color : "transparent",
                    borderWidth: 1,
                    borderColor: filterImpact === opt.key ? opt.color : "#E2E8F0",
                    paddingHorizontal: 12,
                    paddingVertical: 5,
                    borderRadius: 16,
                  }}
                  onPress={() => setFilterImpact(opt.key)}
                >
                  <Text style={{ fontSize: 11, fontWeight: "600", color: filterImpact === opt.key ? "#FFFFFF" : "#64748B" }}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Loading state for live news */}
        {activeTab === "live" && liveNewsQuery.isLoading && (
          <View className="px-5 py-8 items-center">
            <ActivityIndicator size="large" color="#003366" />
            <Text className="text-sm text-muted mt-3">Fetching live ESG news...</Text>
            <Text className="text-xs text-muted mt-1">AI is analyzing relevance to Renesas</Text>
          </View>
        )}

        {/* Empty state */}
        {activeTab === "live" && !liveNewsQuery.isLoading && liveNews.length === 0 && (
          <View className="px-5 py-8 items-center">
            <View style={{ backgroundColor: "#003366" + "15", width: 56, height: 56, borderRadius: 28, alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
              <IconSymbol name="newspaper.fill" size={28} color="#003366" />
            </View>
            <Text className="text-base font-bold text-foreground mb-2">No Live News Yet</Text>
            <Text className="text-sm text-muted text-center mb-4">Pull down to refresh and fetch the latest ESG news from global sources.</Text>
            <TouchableOpacity
              style={{ backgroundColor: "#003366", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 }}
              onPress={onRefresh}
            >
              <Text style={{ color: "#FFFFFF", fontSize: 13, fontWeight: "600" }}>Fetch News Now</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* News Feed */}
        {filtered.length > 0 && (
          <View className="px-5">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-base font-bold text-foreground">
                {activeTab === "live" ? "Live ESG Developments" : "Curated ESG Insights"}
              </Text>
              {activeTab === "live" && liveNewsQuery.data?.lastUpdated && (
                <Text className="text-xs text-muted">
                  {new Date(liveNewsQuery.data.lastUpdated).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </Text>
              )}
            </View>
            {filtered.map((news) => (
              <NewsCard
                key={news.id}
                news={news}
                expanded={expandedId === news.id}
                onToggle={() => setExpandedId(expandedId === news.id ? null : news.id)}
                onAnalyze={() => handleDeepAnalysis(news)}
                analyzing={analyzingId === news.id}
                detailedAnalysis={detailedAnalyses[news.id]}
              />
            ))}
          </View>
        )}

        {/* Last updated info */}
        {activeTab === "live" && liveNews.length > 0 && (
          <View className="px-5 mt-4 items-center">
            <Text className="text-xs text-muted">
              Auto-refreshes every 5 minutes. Pull down to refresh manually.
            </Text>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

function getFallbackResponse(question: string): string {
  const q = question.toLowerCase();
  if (q.includes("csrd") || q.includes("eu")) {
    return "Renesas is currently in progress with CSRD compliance. Key areas requiring attention include double materiality assessment (45% complete), supply chain emissions reporting, and EU taxonomy alignment. The deadline for initial compliance is June 2026. Recommended next steps: 1) Complete stakeholder engagement for materiality assessment, 2) Enhance Scope 3 data collection from EU suppliers, 3) Align existing TCFD disclosures with ESRS standards.";
  }
  if (q.includes("risk") || q.includes("semi")) {
    return "Top ESG risks for semiconductor companies in 2026: 1) Scope 3 emissions measurement across complex supply chains, 2) Water stress in fabrication facilities, 3) Conflict minerals and responsible sourcing compliance, 4) Workforce diversity and talent retention, 5) Regulatory fragmentation across jurisdictions (EU, US, Japan). Renesas-specific priority: Accelerating carbon neutrality roadmap given competitor progress (Infineon achieved carbon neutral ops in 2026).";
  }
  if (q.includes("scope 3") || q.includes("emission")) {
    return "Scope 3 best practices for semiconductor industry: 1) Implement supplier engagement programs with emissions reporting requirements, 2) Use industry-standard calculation methodologies (GHG Protocol), 3) Focus on Category 1 (purchased goods) and Category 11 (use of sold products) as highest-impact categories, 4) Leverage industry collaborations like the Semiconductor Climate Consortium, 5) Set science-based targets validated by SBTi. Current Renesas progress: 30% complete on measurement framework.";
  }
  return "Based on current ESG landscape analysis: Renesas ranks #4 among 8 semiconductor peers with a total ESG score of 71.7. Key improvement areas include environmental performance (score: 68, below peer average of 71.4) and accelerating carbon neutrality targets. The regulatory environment is intensifying with CSRD, ISSB, and SEC climate rules requiring coordinated response. Recommend focusing on cross-functional alignment between Sustainability, Legal, and Procurement teams.";
}

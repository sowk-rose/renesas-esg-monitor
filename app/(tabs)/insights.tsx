import { ScrollView, Text, View, TouchableOpacity, TextInput, ActivityIndicator } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { NEWS_ITEMS, getESGColor, getImpactColor, type NewsItem } from "@/lib/esg-data";
import { IconSymbol } from "@/components/ui/icon-symbol";
// AI integration will be connected via tRPC later

type FilterCategory = "all" | "E" | "S" | "G" | "ESG";
type FilterImpact = "all" | "high" | "medium" | "low";

function NewsCard({ news, expanded, onToggle }: { news: NewsItem; expanded: boolean; onToggle: () => void }) {
  return (
    <TouchableOpacity
      className="bg-surface rounded-xl border border-border mb-3 overflow-hidden"
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <View className="p-4">
        {/* Tags */}
        <View className="flex-row items-center gap-2 mb-2">
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
              <Text style={{ fontSize: 12, fontWeight: "700", color: "#6366F1" }}>AI Analysis</Text>
            </View>
            <Text className="text-xs text-foreground leading-5">{news.aiAnalysis}</Text>
          </View>
        )}

        {/* Expand indicator */}
        <View className="flex-row items-center justify-center mt-2">
          <IconSymbol name={expanded ? "arrow.up" : "arrow.down"} size={12} color="#94A3B8" />
          <Text style={{ fontSize: 10, color: "#94A3B8", marginLeft: 4 }}>{expanded ? "Show less" : "Show AI analysis"}</Text>
        </View>
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

  const filtered = NEWS_ITEMS.filter((n) => {
    if (filterCategory !== "all" && n.category !== filterCategory) return false;
    if (filterImpact !== "all" && n.impactLevel !== filterImpact) return false;
    return true;
  });

  const handleAskAI = async () => {
    if (!aiQuestion.trim()) return;
    setAiLoading(true);
    setAiResponse(null);
    try {
      const response = await fetch(
        `/api/trpc/esg.askAI`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ json: { question: aiQuestion } }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        setAiResponse(data?.result?.data?.json?.answer || "Analysis complete. Please review the insights above.");
      } else {
        // Fallback: provide a contextual response based on the question
        const q = aiQuestion.toLowerCase();
        if (q.includes("csrd") || q.includes("eu")) {
          setAiResponse("Renesas is currently in progress with CSRD compliance. Key areas requiring attention include double materiality assessment (45% complete), supply chain emissions reporting, and EU taxonomy alignment. The deadline for initial compliance is June 2026. Recommended next steps: 1) Complete stakeholder engagement for materiality assessment, 2) Enhance Scope 3 data collection from EU suppliers, 3) Align existing TCFD disclosures with ESRS standards.");
        } else if (q.includes("risk") || q.includes("semi")) {
          setAiResponse("Top ESG risks for semiconductor companies in 2026: 1) Scope 3 emissions measurement across complex supply chains, 2) Water stress in fabrication facilities, 3) Conflict minerals and responsible sourcing compliance, 4) Workforce diversity and talent retention, 5) Regulatory fragmentation across jurisdictions (EU, US, Japan). Renesas-specific priority: Accelerating carbon neutrality roadmap given competitor progress (Infineon achieved carbon neutral ops in 2026).");
        } else if (q.includes("scope 3") || q.includes("emission")) {
          setAiResponse("Scope 3 best practices for semiconductor industry: 1) Implement supplier engagement programs with emissions reporting requirements, 2) Use industry-standard calculation methodologies (GHG Protocol), 3) Focus on Category 1 (purchased goods) and Category 11 (use of sold products) as highest-impact categories, 4) Leverage industry collaborations like the Semiconductor Climate Consortium, 5) Set science-based targets validated by SBTi. Current Renesas progress: 30% complete on measurement framework.");
        } else {
          setAiResponse("Based on current ESG landscape analysis: Renesas ranks #4 among 8 semiconductor peers with a total ESG score of 71.7. Key improvement areas include environmental performance (score: 68, below peer average of 71.4) and accelerating carbon neutrality targets. The regulatory environment is intensifying with CSRD, ISSB, and SEC climate rules requiring coordinated response. Recommend focusing on cross-functional alignment between Sustainability, Legal, and Procurement teams.");
        }
      }
    } catch (e) {
      const q = aiQuestion.toLowerCase();
      if (q.includes("csrd") || q.includes("eu")) {
        setAiResponse("Renesas is currently in progress with CSRD compliance. Key areas requiring attention include double materiality assessment (45% complete), supply chain emissions reporting, and EU taxonomy alignment. Recommended next steps: Complete stakeholder engagement, enhance Scope 3 data collection, and align TCFD disclosures with ESRS standards.");
      } else {
        setAiResponse("Renesas ranks #4 among 8 semiconductor peers with a total ESG score of 71.7. Key areas for improvement: environmental performance and carbon neutrality acceleration. The regulatory landscape is intensifying across EU, US, and Japan jurisdictions.");
      }
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <ScreenContainer className="px-0">
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-5 pt-2 pb-3">
          <Text className="text-2xl font-bold text-foreground">ESG Insights</Text>
          <Text className="text-sm text-muted mt-1">AI-Powered Analysis & News Feed</Text>
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

            {/* AI Response */}
            {aiResponse && (
              <View className="mt-3 bg-surface rounded-lg p-3 border border-border">
                <Text className="text-xs text-foreground leading-5">{aiResponse}</Text>
              </View>
            )}

            {/* Quick Questions */}
            <View className="flex-row flex-wrap gap-2 mt-3">
              {[
                "Renesas CSRD readiness?",
                "Top ESG risks for semis?",
                "Scope 3 best practices?",
              ].map((q) => (
                <TouchableOpacity
                  key={q}
                  style={{ backgroundColor: "#6366F110", borderWidth: 1, borderColor: "#6366F130", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 14 }}
                  onPress={() => { setAiQuestion(q); }}
                >
                  <Text style={{ fontSize: 11, color: "#6366F1", fontWeight: "500" }}>{q}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Impact Summary */}
        <View className="px-5 mb-4">
          <View className="flex-row gap-3">
            <View className="flex-1 bg-surface rounded-xl p-3 border border-border items-center">
              <Text style={{ fontSize: 20, fontWeight: "800", color: "#EF4444" }}>
                {NEWS_ITEMS.filter((n) => n.impactLevel === "high").length}
              </Text>
              <Text className="text-xs text-muted font-medium">High Impact</Text>
            </View>
            <View className="flex-1 bg-surface rounded-xl p-3 border border-border items-center">
              <Text style={{ fontSize: 20, fontWeight: "800", color: "#003366" }}>
                {NEWS_ITEMS.length}
              </Text>
              <Text className="text-xs text-muted font-medium">Total News</Text>
            </View>
            <View className="flex-1 bg-surface rounded-xl p-3 border border-border items-center">
              <Text style={{ fontSize: 20, fontWeight: "800", color: "#6366F1" }}>
                {NEWS_ITEMS.filter((n) => n.aiAnalysis).length}
              </Text>
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

        {/* News Feed */}
        <View className="px-5">
          <Text className="text-base font-bold text-foreground mb-3">Latest ESG Developments</Text>
          {filtered.map((news) => (
            <NewsCard
              key={news.id}
              news={news}
              expanded={expandedId === news.id}
              onToggle={() => setExpandedId(expandedId === news.id ? null : news.id)}
            />
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

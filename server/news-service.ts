/**
 * ESG News Service
 * Fetches real-time ESG/sustainability news from multiple sources,
 * categorizes them, and provides AI-powered analysis for Renesas context.
 */
import { invokeLLM } from "./_core/llm";

export interface LiveNewsItem {
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
  isLive: boolean;
}

// In-memory cache for fetched news
let newsCache: LiveNewsItem[] = [];
let lastFetchTime = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

// ESG-related search keywords for news fetching
const ESG_KEYWORDS = [
  "ESG semiconductor",
  "sustainability regulation semiconductor",
  "carbon emissions electronics",
  "CSRD compliance",
  "SEC climate disclosure",
  "supply chain due diligence",
  "Renesas ESG",
  "semiconductor carbon neutral",
  "ISSB sustainability reporting",
  "EU taxonomy semiconductor",
];

// RSS feed sources for ESG news
const RSS_SOURCES = [
  {
    url: "https://news.google.com/rss/search?q=ESG+semiconductor+sustainability&hl=en&gl=US&ceid=US:en",
    name: "Google News",
  },
  {
    url: "https://news.google.com/rss/search?q=Renesas+Electronics+ESG&hl=en&gl=US&ceid=US:en",
    name: "Google News (Renesas)",
  },
  {
    url: "https://news.google.com/rss/search?q=CSRD+ISSB+semiconductor+regulation&hl=en&gl=US&ceid=US:en",
    name: "Google News (Regulations)",
  },
];

/**
 * Parse RSS XML to extract news items
 */
function parseRSSItems(xml: string, sourceName: string): Array<{ title: string; link: string; pubDate: string; description: string; source: string }> {
  const items: Array<{ title: string; link: string; pubDate: string; description: string; source: string }> = [];

  // Simple XML parsing for RSS items
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];

    const titleMatch = itemXml.match(/<title><!\[CDATA\[(.*?)\]\]>|<title>(.*?)<\/title>/);
    const linkMatch = itemXml.match(/<link>(.*?)<\/link>/);
    const pubDateMatch = itemXml.match(/<pubDate>(.*?)<\/pubDate>/);
    const descMatch = itemXml.match(/<description><!\[CDATA\[(.*?)\]\]>|<description>(.*?)<\/description>/);
    const sourceMatch = itemXml.match(/<source[^>]*>(.*?)<\/source>/);

    const title = titleMatch?.[1] || titleMatch?.[2] || "";
    const link = linkMatch?.[1] || "";
    const pubDate = pubDateMatch?.[1] || "";
    const description = (descMatch?.[1] || descMatch?.[2] || "").replace(/<[^>]*>/g, "").trim();
    const source = sourceMatch?.[1] || sourceName;

    if (title) {
      items.push({ title, link, pubDate, description, source });
    }
  }

  return items;
}

/**
 * Fetch news from RSS feeds
 */
async function fetchRSSNews(): Promise<Array<{ title: string; link: string; pubDate: string; description: string; source: string }>> {
  const allItems: Array<{ title: string; link: string; pubDate: string; description: string; source: string }> = [];

  for (const feed of RSS_SOURCES) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(feed.url, {
        signal: controller.signal,
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; ESGMonitor/1.0)",
          Accept: "application/rss+xml, application/xml, text/xml",
        },
      });
      clearTimeout(timeout);

      if (response.ok) {
        const xml = await response.text();
        const items = parseRSSItems(xml, feed.name);
        allItems.push(...items);
      }
    } catch (err) {
      console.warn(`RSS fetch failed for ${feed.name}:`, (err as Error).message);
    }
  }

  return allItems;
}

/**
 * Use LLM to categorize and analyze a batch of news items for ESG relevance
 */
async function categorizeNewsWithAI(
  newsItems: Array<{ title: string; description: string; source: string; link: string; pubDate: string }>
): Promise<LiveNewsItem[]> {
  if (newsItems.length === 0) return [];

  // Take up to 15 items for analysis
  const batch = newsItems.slice(0, 15);

  const newsListText = batch
    .map((n, i) => `[${i}] Title: ${n.title}\nDescription: ${n.description}\nSource: ${n.source}\nDate: ${n.pubDate}`)
    .join("\n\n");

  try {
    const result = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `You are an ESG analyst for Renesas Electronics (Japanese semiconductor company). Analyze each news item and return a JSON array.

For each item, provide:
- "index": the original index number
- "category": one of "E" (Environmental), "S" (Social), "G" (Governance), "ESG" (cross-cutting)
- "region": geographic region (e.g., "Global", "EU", "USA", "Japan", "Asia")
- "impactLevel": "high", "medium", or "low" based on relevance to Renesas and semiconductor industry
- "summary": a concise 1-2 sentence summary focused on ESG implications
- "aiAnalysis": 2-3 sentences analyzing the specific impact on Renesas Electronics, including recommended actions
- "relevant": boolean, true if the news is relevant to ESG/sustainability in semiconductor industry

Return ONLY a valid JSON array. No markdown, no explanation.`,
        },
        {
          role: "user",
          content: `Analyze these news items for ESG relevance to Renesas Electronics:\n\n${newsListText}`,
        },
      ],
      responseFormat: { type: "json_object" },
    });

    const content = typeof result.choices[0]?.message?.content === "string"
      ? result.choices[0].message.content
      : "";

    // Parse the JSON response
    let analyses: any[];
    try {
      const parsed = JSON.parse(content);
      analyses = Array.isArray(parsed) ? parsed : (parsed.items || parsed.news || parsed.results || [parsed]);
    } catch {
      // Try to extract JSON array from the response
      const arrayMatch = content.match(/\[[\s\S]*\]/);
      if (arrayMatch) {
        analyses = JSON.parse(arrayMatch[0]);
      } else {
        analyses = [];
      }
    }

    const liveNews: LiveNewsItem[] = [];

    for (const analysis of analyses) {
      const idx = analysis.index ?? analyses.indexOf(analysis);
      const original = batch[idx];
      if (!original) continue;
      if (analysis.relevant === false) continue;

      const dateStr = original.pubDate
        ? new Date(original.pubDate).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];

      liveNews.push({
        id: `live-${Date.now()}-${idx}`,
        title: original.title,
        source: original.source,
        date: dateStr,
        category: (["E", "S", "G", "ESG"].includes(analysis.category) ? analysis.category : "ESG") as "E" | "S" | "G" | "ESG",
        region: analysis.region || "Global",
        summary: analysis.summary || original.description,
        aiAnalysis: analysis.aiAnalysis || undefined,
        impactLevel: (["high", "medium", "low"].includes(analysis.impactLevel) ? analysis.impactLevel : "medium") as "high" | "medium" | "low",
        url: original.link || undefined,
        isLive: true,
      });
    }

    return liveNews;
  } catch (err) {
    console.error("AI categorization failed:", (err as Error).message);
    // Fallback: return items with basic categorization
    return batch.map((item, idx) => {
      const dateStr = item.pubDate
        ? new Date(item.pubDate).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];

      return {
        id: `live-${Date.now()}-${idx}`,
        title: item.title,
        source: item.source,
        date: dateStr,
        category: "ESG" as const,
        region: "Global",
        summary: item.description || item.title,
        impactLevel: "medium" as const,
        url: item.link || undefined,
        isLive: true,
      };
    });
  }
}

/**
 * Main function: fetch and process ESG news
 */
export async function fetchESGNews(forceRefresh = false): Promise<LiveNewsItem[]> {
  const now = Date.now();

  // Return cache if still valid
  if (!forceRefresh && newsCache.length > 0 && now - lastFetchTime < CACHE_TTL_MS) {
    return newsCache;
  }

  try {
    // Fetch from RSS sources
    const rawNews = await fetchRSSNews();

    if (rawNews.length === 0) {
      // If no RSS results, return cached or empty
      return newsCache.length > 0 ? newsCache : [];
    }

    // Deduplicate by title similarity
    const seen = new Set<string>();
    const unique = rawNews.filter((item) => {
      const key = item.title.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 50);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // AI categorization and analysis
    const categorized = await categorizeNewsWithAI(unique);

    // Sort by date (newest first) then by impact
    const impactOrder = { high: 0, medium: 1, low: 2 };
    categorized.sort((a, b) => {
      const dateCompare = b.date.localeCompare(a.date);
      if (dateCompare !== 0) return dateCompare;
      return (impactOrder[a.impactLevel] || 1) - (impactOrder[b.impactLevel] || 1);
    });

    // Update cache
    newsCache = categorized;
    lastFetchTime = now;

    return categorized;
  } catch (err) {
    console.error("News fetch failed:", (err as Error).message);
    return newsCache.length > 0 ? newsCache : [];
  }
}

/**
 * Get cached news without triggering a new fetch
 */
export function getCachedNews(): LiveNewsItem[] {
  return newsCache;
}

/**
 * Clear the news cache
 */
export function clearNewsCache(): void {
  newsCache = [];
  lastFetchTime = 0;
}

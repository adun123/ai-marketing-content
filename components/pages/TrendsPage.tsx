"use client";
import type { ElementType } from "react";
import { useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  BookmarkPlus,
  Check,
  ChevronRight,
  Filter,
  Hash,
  Lightbulb,
  Loader2,
  MessageSquare,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

type Platform = "All" | "TikTok" | "Instagram" | "X/Twitter" | "LinkedIn" | "YouTube";
type Industry = "All" | "Fashion" | "SaaS" | "Food & Beverage" | "Beauty" | "Education" | "Finance";
type Audience = "All" | "Gen Z" | "Millennials" | "Professionals" | "Small Business Owners" | "Parents" | "Creators";

type Trend = {
  id: string;
  topic: string;
  platform: Exclude<Platform, "All">;
  industry: Exclude<Industry, "All">;
  category: string;
  score: number; // 0..100
  growthPct: number; // e.g. 340 for +340%
  audienceMatch: number; // 0..100
  reason: string;
};

type Insight = {
  trendId: string;
  trendTopic: string;
  platform: Trend["platform"];
  summary: {
    headline: string;
    whyRelevant: string;
  };
  hooks: string[];
  angles: string[];
  ctas: string[];
  audience: {
    description: string;
    painPoint: string;
    motivation: string;
  };
  ideas: string[];
};

const platforms: Platform[] = ["All", "TikTok", "Instagram", "X/Twitter", "LinkedIn", "YouTube"];
const industries: Industry[] = ["All", "Fashion", "SaaS", "Food & Beverage", "Beauty", "Education", "Finance"];
const audiences: Audience[] = ["All", "Gen Z", "Millennials", "Professionals", "Small Business Owners", "Parents", "Creators"];

const mockTrends: Trend[] = [
  {
    id: "t1",
    topic: "#SustainableFashion",
    platform: "Instagram",
    industry: "Fashion",
    category: "Lifestyle",
    score: 92,
    growthPct: 340,
    audienceMatch: 86,
    reason: "Eco-conscious buying is becoming identity-driven content — great for brand trust and UGC loops.",
  },
  {
    id: "t2",
    topic: "#AIProductivity",
    platform: "LinkedIn",
    industry: "SaaS",
    category: "Tech",
    score: 90,
    growthPct: 285,
    audienceMatch: 82,
    reason: "Decision-makers are actively searching for AI workflow wins; strong fit for B2B proof-based storytelling.",
  },
  {
    id: "t3",
    topic: "#GreenTech2024",
    platform: "TikTok",
    industry: "Finance",
    category: "Environment",
    score: 86,
    growthPct: 220,
    audienceMatch: 73,
    reason: "Short-form explainers are converting “complex” into “shareable”; opportunity for simple visual education.",
  },
  {
    id: "t4",
    topic: "#WorkFromAnywhere",
    platform: "X/Twitter",
    industry: "Education",
    category: "Work",
    score: 84,
    growthPct: 195,
    audienceMatch: 79,
    reason: "High engagement around routines + tools; ideal for threads that position your product as a daily habit.",
  },
  {
    id: "t5",
    topic: "#MindfulBusiness",
    platform: "LinkedIn",
    industry: "Food & Beverage",
    category: "Business",
    score: 81,
    growthPct: 178,
    audienceMatch: 70,
    reason: "Values-first brand narratives outperform hard selling; strong angle for mission-led positioning.",
  },
  {
    id: "t6",
    topic: "#CreatorEconomy",
    platform: "YouTube",
    industry: "SaaS",
    category: "Content",
    score: 83,
    growthPct: 165,
    audienceMatch: 88,
    reason: "Long-form tutorials + case studies are driving conversions; great for creator-friendly feature storytelling.",
  },
  {
    id: "t7",
    topic: "#DigitalWellness",
    platform: "Instagram",
    industry: "Beauty",
    category: "Health",
    score: 78,
    growthPct: 142,
    audienceMatch: 76,
    reason: "Wellness micro-habits are trending; perfect for mini-series content and product-as-ritual framing.",
  },
  {
    id: "t8",
    topic: "#SmallBizTips",
    platform: "TikTok",
    industry: "Finance",
    category: "Business",
    score: 76,
    growthPct: 130,
    audienceMatch: 81,
    reason: "Practical, tactical content performs; ideal for “do this now” hooks and templates/checklists.",
  },
];

const platformColors: Record<string, string> = {
  "TikTok": "bg-pink-50 text-pink-600",
  "Instagram": "bg-purple-50 text-purple-600",
  "X/Twitter": "bg-sky-50 text-sky-600",
  "LinkedIn": "bg-blue-50 text-blue-600",
  "YouTube": "bg-red-50 text-red-600",
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function formatGrowth(pct: number) {
  const sign = pct >= 0 ? "+" : "";
  return `${sign}${pct}%`;
}

function scoreTone(score: number) {
  if (score >= 85) return { bar: "bg-emerald-500", text: "text-emerald-700", chip: "bg-emerald-50 text-emerald-700 border-emerald-200" };
  if (score >= 70) return { bar: "bg-blue-600", text: "text-blue-700", chip: "bg-blue-50 text-blue-700 border-blue-200" };
  return { bar: "bg-slate-400", text: "text-slate-700 dark:text-slate-300", chip: "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700" };
}

function buildMockInsight(trend: Trend, industry: Industry, audience: Audience, query: string): Insight {
  const topic = trend.topic.replace("#", "");
  const industryLabel = industry === "All" ? trend.industry : industry;
  const audienceLabel = audience === "All" ? "your target audience" : audience;
  const queryHint = query.trim() ? ` for “${query.trim()}”` : "";

  return {
    trendId: trend.id,
    trendTopic: trend.topic,
    platform: trend.platform,
    summary: {
      headline: `${topic} is spiking on ${trend.platform} — a high-signal opportunity${queryHint}.`,
      whyRelevant: `This trend aligns with ${industryLabel} intent and is resonating with ${audienceLabel}. Use it to position your brand as timely, useful, and worth saving/sharing.`,
    },
    hooks: [
      `POV: you’re doing ${topic} wrong — here’s the 15-second fix.`,
      `3 things nobody tells you about ${topic} (and why it matters this week).`,
      `If you care about ${topic}, start with this simple checklist.`,
    ],
    angles: [
      `Behind the scenes: how we apply ${topic} in real life`,
      `Myth vs fact: what ${topic} actually means (with quick proof)`,
      `Before/after: the measurable impact of adopting ${topic}`,
    ],
    ctas: [
      `Get the template →`,
      `Save this for later and try it today`,
      `Comment “INFO” and we’ll send the full guide`,
    ],
    audience: {
      description: `${audience === "All" ? "Content-savvy buyers" : audience} looking for quick wins in ${industryLabel}. They prefer proof, simplicity, and content that feels immediately actionable.`,
      painPoint: `They’re overwhelmed by options and don’t know what to trust — most content feels generic.`,
      motivation: `They want a clear “what to do next” that makes them feel confident and ahead of the curve.`,
    },
    ideas: [
      `30-sec breakdown: why ${topic} is trending (and what to copy)`,
      `Swipe/Carousel: ${topic} checklist for ${industryLabel}`,
      `Mini case study: “we tried ${topic} for 7 days”`,
      `Creator collab: react to top ${topic} posts + add your expert take`,
    ],
  };
}

export default function TrendsPage({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const [activePlatform, setActivePlatform] = useState<Platform>("All");
  const [activeIndustry, setActiveIndustry] = useState<Industry>("All");
  const [activeAudience, setActiveAudience] = useState<Audience>("All");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [insight, setInsight] = useState<Insight | null>(null);
  const [saved, setSaved] = useState(false);
  const [sent, setSent] = useState(false);
  const insightPanelRef = useRef<HTMLDivElement | null>(null);

  const filtered = useMemo(() => {
    return mockTrends
      .filter(t => (activePlatform === "All" ? true : t.platform === activePlatform))
      .filter(t => (activeIndustry === "All" ? true : t.industry === activeIndustry))
      .filter(t => {
        const q = query.trim().toLowerCase();
        if (!q) return true;
        return (
          t.topic.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.reason.toLowerCase().includes(q) ||
          t.industry.toLowerCase().includes(q)
        );
      })
      .filter(t => {
        if (activeAudience === "All") return true;
        if (activeAudience === "Gen Z") return t.audienceMatch >= 80;
        if (activeAudience === "Creators") return t.platform === "YouTube" || t.platform === "TikTok";
        if (activeAudience === "Professionals") return t.platform === "LinkedIn" || t.platform === "X/Twitter";
        if (activeAudience === "Small Business Owners") return t.category === "Business" || t.industry === "Finance";
        if (activeAudience === "Parents") return t.industry === "Education" || t.category === "Health";
        if (activeAudience === "Millennials") return t.audienceMatch >= 75;
        return true;
      });
  }, [activeAudience, activeIndustry, activePlatform, query]);

  const selectedTrend = useMemo(() => {
    const byId = selectedId ? filtered.find(t => t.id === selectedId) : undefined;
    return byId ?? filtered[0] ?? null;
  }, [filtered, selectedId]);

  const scrollToInsightPanelOnMobile = () => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(max-width: 1023px)").matches) return;
    insightPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const runGenerate = (kind: "generate" | "analyze") => {
    const base = selectedTrend ?? filtered[0] ?? null;
    if (!base) return;

    scrollToInsightPanelOnMobile();
    setLoadingInsight(true);
    setSaved(false);
    setSent(false);

    setTimeout(() => {
      setInsight(buildMockInsight(base, activeIndustry, activeAudience, query));
      setLoadingInsight(false);
      if (kind === "analyze") setSelectedId(base.id);
    }, 1200);
  };

  const handleSave = () => {
    if (!insight) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 1400);
  };

  const handleSendToDraft = () => {
    if (!insight) return;
    try {
      localStorage.setItem(
        "aiContentDashboard.trendInsight",
        JSON.stringify({
          insight,
          filters: { platform: activePlatform, industry: activeIndustry, audience: activeAudience, query },
          createdAt: Date.now(),
        }),
      );
      localStorage.setItem("aiContentDashboard.draftSource", "trend");
    } catch {
      // ignore (mock-only)
    }
    setSent(true);
    setTimeout(() => setSent(false), 1200);
    onNavigate?.("draft");
  };

  return (
    <div className="space-y-6 fade-in pb-24 lg:pb-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-1 dark:text-slate-200">Step 1 of 3: Discover</span>
            <ChevronRight className="w-4 h-4 text-slate-300" />
            <span className="rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-slate-600">Draft</span>
            <ChevronRight className="w-4 h-4 text-slate-300" />
            <span className="rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-slate-600">Generate</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mt-2">Trend &amp; Social Insight</h1>
          <p className="text-slate-500 text-sm mt-1">
            Discover trending topics, audience signals, and AI-ready content opportunities.
          </p>
        </div>

        <button
          onClick={() => runGenerate("generate")}
          disabled={loadingInsight || filtered.length === 0}
          className="btn-gradient inline-flex items-center justify-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-xl disabled:opacity-70"
        >
          {loadingInsight ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          Generate Insight
        </button>
      </div>

      {/* Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Search + Trends */}
        <div className="lg:col-span-7 space-y-4">
          {/* Search & filters */}
          <div className="bg-white dark:bg-slate-900/70 rounded-2xl p-5 card-shadow border border-slate-200 dark:border-slate-800">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Search &amp; Filters</p>
                <h2 className="font-semibold text-slate-900 dark:text-slate-100 mt-1">Find the right trend signal</h2>
              </div>
              <div className="h-9 w-9 rounded-2xl bg-slate-100 flex items-center justify-center">
                <Filter className="w-4 h-4 text-slate-700 dark:text-slate-300" />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">
                Search brand, industry, product, or topic
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="e.g. sustainable fashion, B2B SaaS, skincare, personal finance…"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 rounded-xl text-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-400/30 focus:bg-white dark:focus:bg-slate-800 transition-all"
                />
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <FilterRow
                label="Platform"
                options={platforms}
                value={activePlatform}
                onChange={setActivePlatform}
              />
              <FilterRow
                label="Industry"
                options={industries}
                value={activeIndustry}
                onChange={setActiveIndustry}
              />
              <FilterRow
                label="Audience"
                options={audiences}
                value={activeAudience}
                onChange={setActiveAudience}
              />
            </div>
          </div>

          {/* Trending topics */}
          <div className="bg-white dark:bg-slate-900/70 rounded-2xl p-5 card-shadow border border-slate-200 dark:border-slate-800">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Trending Topics</p>
                <h2 className="font-semibold text-slate-900 dark:text-slate-100 mt-1">Ranked opportunities</h2>
                <p className="text-xs text-slate-500 mt-1">Select a trend to analyze with AI-ready insight.</p>
              </div>
              <div className="text-xs text-slate-500">
                <span className="inline-flex items-center gap-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2">
                  <span className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600" />
                  {filtered.length} results
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {filtered.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center mx-auto">
                    <TrendingUp className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                  </div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-3">No trends match your filters</p>
                  <p className="text-xs text-slate-500 mt-1">Try clearing filters or using a broader query.</p>
                </div>
              ) : (
                filtered.map((t, idx) => (
                  <TrendCard
                    key={t.id}
                    trend={t}
                    rank={idx + 1}
                    selected={selectedTrend?.id === t.id}
                    onSelect={() => setSelectedId(t.id)}
                    onAnalyze={() => {
                      setSelectedId(t.id);
                      runGenerate("analyze");
                    }}
                    platformBadgeClass={platformColors[t.platform] ?? "bg-slate-100 text-slate-600"}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right column: AI Insight */}
        <div ref={insightPanelRef} className="lg:col-span-5">
          <div className="sticky top-24 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">AI Insight Panel</h2>
              {selectedTrend && (
                <span className="text-xs font-semibold text-slate-500">
                  Selected: <span className="text-slate-700 dark:text-slate-300">{selectedTrend.topic.replace("#", "")}</span>
                </span>
              )}
            </div>

            {!insight && !loadingInsight ? (
              <div className="bg-white dark:bg-slate-900/70 rounded-2xl p-6 card-shadow border border-slate-200 dark:border-slate-800 text-center">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-6 h-6 text-blue-500" />
                </div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">AI trend research assistant</p>
                <p className="text-xs text-slate-500 mt-1">
                  Select a trend or search your industry to generate AI-powered content insights.
                </p>
                <button
                  onClick={() => {
                    setSelectedId(mockTrends[0]?.id ?? null);
                    runGenerate("generate");
                  }}
                  className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all"
                >
                  Try sample insight
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : null}

            {loadingInsight ? <InsightSkeleton /> : null}

            {insight && !loadingInsight ? (
              <div className="space-y-3 fade-in">
                <div className="bg-white dark:bg-slate-900/70 rounded-2xl p-5 card-shadow border border-slate-200 dark:border-slate-800">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Trend Summary</p>
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100 mt-1">{insight.summary.headline}</h3>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">{insight.summary.whyRelevant}</p>
                    </div>
                    <div className="h-9 w-9 rounded-2xl bg-slate-900 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>

                <InsightCard icon={Lightbulb} title="Hook Ideas" tone="amber" items={insight.hooks} />
                <InsightCard icon={TrendingUp} title="Content Angles" tone="blue" items={insight.angles} />
                <InsightCard icon={MessageSquare} title="CTA Suggestions" tone="emerald" items={insight.ctas} />

                <div className="bg-white dark:bg-slate-900/70 rounded-2xl p-5 card-shadow border border-slate-200 dark:border-slate-800">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Audience Insight</p>
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100 mt-1">What your audience cares about</h3>
                    </div>
                    <div className="h-9 w-9 rounded-2xl bg-purple-50 flex items-center justify-center">
                      <Users className="w-4 h-4 text-purple-600" />
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <MiniInsight label="Target audience" value={insight.audience.description} />
                    <MiniInsight label="Pain point" value={insight.audience.painPoint} />
                    <MiniInsight label="Motivation" value={insight.audience.motivation} />
                  </div>
                </div>

                <InsightCard icon={Target} title="Content Ideas" tone="rose" items={insight.ideas} />
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Workflow action bar */}
      {insight ? (
        <div className="fixed bottom-4 left-4 right-4 lg:left-[calc(var(--sidebar-width)+1rem)] lg:right-6 z-30">
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                Using insight: <span className="text-slate-600">{insight.trendTopic.replace("#", "")}</span>
              </p>
              <p className="text-[11px] text-slate-500">
                This insight will be used as context for your marketing draft.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all"
              >
                {saved ? <Check className="w-4 h-4 text-emerald-600" /> : <BookmarkPlus className="w-4 h-4" />}
                {saved ? "Saved" : "Save Insight"}
              </button>
              <button
                onClick={handleSendToDraft}
                className="btn-gradient inline-flex items-center justify-center gap-2 text-white text-xs font-semibold px-4 py-2 rounded-xl"
              >
                {sent ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                {sent ? "Sent" : "Send to Marketing Draft"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function FilterRow<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">{label}</p>
      <div className="mt-2 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={cn(
              "shrink-0 text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-all",
              value === opt
                ? "border-transparent bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-sm"
                : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/80",
            )}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function TrendCard({
  trend,
  rank,
  selected,
  onSelect,
  onAnalyze,
  platformBadgeClass,
}: {
  trend: Trend;
  rank: number;
  selected: boolean;
  onSelect: () => void;
  onAnalyze: () => void;
  platformBadgeClass: string;
}) {
  const tone = scoreTone(trend.score);
  return (
    <div
      className={cn(
        "rounded-2xl border bg-white dark:bg-slate-900/70 p-4 transition-all card-shadow hover:shadow-md cursor-pointer",
        selected ? "border-blue-400 ring-2 ring-blue-500/10" : "border-slate-200 dark:border-slate-700",
      )}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === "Enter" || e.key === " ") onSelect();
      }}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex items-start gap-4 min-w-0 flex-1">
          <div className="w-9 h-9 rounded-2xl gradient-bg flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">{rank}</span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full", platformBadgeClass)}>{trend.platform}</span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {trend.category}
              </span>
              <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full border", tone.chip)}>
                Growth {formatGrowth(trend.growthPct)}
              </span>
            </div>

            <div className="mt-2 flex items-center gap-2 min-w-0">
              <Hash className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{trend.topic.replace("#", "")}</p>
            </div>

            <p className="text-xs text-slate-500 mt-1 line-clamp-2">{trend.reason}</p>

            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Metric label="Trend score" value={`${trend.score}/100`} tone={tone.text} />
              <Metric label="Audience match" value={`${trend.audienceMatch}%`} tone="text-slate-700 dark:text-slate-300" />
            </div>

            <div className="mt-3">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                <span>Signal strength</span>
                <span className={cn("font-bold", tone.text)}>{trend.score}%</span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className={cn("h-full rounded-full", tone.bar)} style={{ width: `${trend.score}%` }} />
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onAnalyze();
          }}
          className={cn(
            "w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition-all",
            selected ? "border-blue-200 dark:border-blue-500/40 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-500/15" : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800",
          )}
        >
          Analyze Trend
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function Metric({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2">
      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">{label}</p>
      <p className={cn("text-sm font-bold mt-1", tone)}>{value}</p>
    </div>
  );
}

function MiniInsight({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3">
      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">{label}</p>
      <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">{value}</p>
    </div>
  );
}

function InsightCard({
  icon: Icon,
  title,
  tone,
  items,
}: {
  icon: ElementType;
  title: string;
  tone: "amber" | "blue" | "emerald" | "rose";
  items: string[];
}) {
  const toneMap = {
    amber: { bg: "bg-amber-50", text: "text-amber-600" },
    blue: { bg: "bg-blue-50", text: "text-blue-600" },
    emerald: { bg: "bg-emerald-50", text: "text-emerald-600" },
    rose: { bg: "bg-rose-50", text: "text-rose-600" },
  }[tone];

  return (
    <div className="bg-white dark:bg-slate-900/70 rounded-2xl p-5 card-shadow border border-slate-200 dark:border-slate-800">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{title}</p>
          <p className="text-xs text-slate-500 mt-1">AI-generated options you can paste into the next step.</p>
        </div>
        <div className={cn("h-9 w-9 rounded-2xl flex items-center justify-center", toneMap.bg)}>
          <Icon className={cn("w-4 h-4", toneMap.text)} />
        </div>
      </div>

      <ul className="mt-4 space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-0.5 text-slate-300">•</span>
            <span className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function InsightSkeleton() {
  return (
    <div className="space-y-3">
      <div className="bg-white dark:bg-slate-900/70 rounded-2xl p-5 card-shadow border border-slate-200 dark:border-slate-800">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2 flex-1">
            <div className="skeleton h-3 rounded-lg w-32" />
            <div className="skeleton h-5 rounded-lg w-[90%]" />
            <div className="skeleton h-3 rounded-lg w-[70%]" />
          </div>
          <div className="skeleton h-9 w-9 rounded-2xl" />
        </div>
      </div>
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white dark:bg-slate-900/70 rounded-2xl p-5 card-shadow border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="skeleton h-3 rounded-lg w-28" />
            <div className="skeleton h-9 w-9 rounded-2xl" />
          </div>
          <div className="space-y-2">
            <div className="skeleton h-3 rounded-lg w-[85%]" />
            <div className="skeleton h-3 rounded-lg w-[78%]" />
            <div className="skeleton h-3 rounded-lg w-[70%]" />
          </div>
        </div>
      ))}
    </div>
  );
}

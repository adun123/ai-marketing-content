"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, BookmarkPlus, Check, CircleHelp, Copy, Loader2, Pencil, RefreshCw, Sparkles, Target, Wand2 } from "lucide-react";
import GuidedTour from "@/components/GuidedTour";

type Platform = "Instagram" | "TikTok" | "LinkedIn" | "YouTube" | "X/Twitter";
type Goal = "Awareness" | "Engagement" | "Lead Generation" | "Conversion" | "Retention";
type Tone = "Professional" | "Friendly" | "Bold" | "Luxury" | "Gen Z";
type ContentType = "Caption" | "Short Video Script" | "Carousel Copy" | "Ads Copy" | "LinkedIn Post";
type DraftMode = "insight" | "manual";
type OutputTab = "hooks" | "caption" | "cta" | "hashtags" | "structure";

type ImportedInsight = {
  trendTopic: string;
  platform: Platform;
  targetAudience: string;
  selectedHook: string;
  contentAngle: string;
  ctaSuggestion: string;
};

type InsightForm = {
  campaignGoal: Goal;
  brandTone: Tone;
  targetPlatform: Platform;
  contentType: ContentType;
};

type ManualForm = {
  topic: string;
  audience: string;
  campaignGoal: Goal;
  brandTone: Tone;
  platform: Platform;
  contentType: ContentType;
  keyMessage: string;
  notes: string;
};

type DraftOutput = {
  mode: DraftMode;
  hooks: string[];
  caption: string;
  ctaOptions: string[];
  hashtags: string[];
  structure: Array<{ label: string; value: string }>;
  quality: {
    clarity: number;
    audienceMatch: number;
    ctaStrength: number;
  };
};

const goals: Goal[] = ["Awareness", "Engagement", "Lead Generation", "Conversion", "Retention"];
const tones: Tone[] = ["Professional", "Friendly", "Bold", "Luxury", "Gen Z"];
const platforms: Platform[] = ["Instagram", "TikTok", "LinkedIn", "YouTube", "X/Twitter"];
const contentTypes: ContentType[] = ["Caption", "Short Video Script", "Carousel Copy", "Ads Copy", "LinkedIn Post"];

const fallbackInsight: ImportedInsight = {
  trendTopic: "#SustainableFashion",
  platform: "Instagram",
  targetAudience: "Eco-conscious Millennials & Gen Z who want credible sustainable products.",
  selectedHook: "Stop posting products. Start posting proof of impact.",
  contentAngle: "Behind-the-scenes proof-first storytelling with actionable tips.",
  ctaSuggestion: "Save this and explore our eco collection.",
};

const defaultInsightForm: InsightForm = {
  campaignGoal: "Awareness",
  brandTone: "Professional",
  targetPlatform: "Instagram",
  contentType: "Caption",
};

const defaultManualForm: ManualForm = {
  topic: "",
  audience: "",
  campaignGoal: "Awareness",
  brandTone: "Friendly",
  platform: "Instagram",
  contentType: "Caption",
  keyMessage: "",
  notes: "",
};
const draftTourStorageKey = "aiContentDashboard.onboarding.draft.v1";
const draftTourSteps = [
  {
    targetId: "draft-tour-header",
    title: "Marketing Draft Generator",
    description: "Bagian ini digunakan untuk membuat draft marketing dari insight trend atau dari input manual.",
  },
  {
    targetId: "draft-tour-mode",
    title: "Pilih Mode Draft",
    description: "Gunakan mode Trend Insight untuk alur otomatis, atau Start from Scratch untuk ide baru dari nol.",
  },
  {
    targetId: "draft-tour-inputs",
    title: "Form Input Campaign",
    description: "Isi goal, tone, platform, dan pesan utama supaya hasil draft lebih sesuai kebutuhan kampanye.",
  },
  {
    targetId: "draft-tour-output",
    title: "Draft Output Panel",
    description: "Di panel ini kamu bisa review hook, caption, CTA, hashtags, lalu copy hasil untuk dipakai tim.",
  },
  {
    targetId: "draft-tour-send",
    title: "Kirim ke Content Generation",
    description: "Jika draft sudah oke, kirim ke halaman Content Generation agar langsung dipakai sebagai context.",
  },
];

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function readImportedInsight(): ImportedInsight {
  try {
    const raw = localStorage.getItem("aiContentDashboard.trendInsight");
    if (!raw) return fallbackInsight;
    const parsed = JSON.parse(raw) as { insight?: any };
    const insight = parsed.insight;
    if (!insight) return fallbackInsight;
    return {
      trendTopic: insight.trendTopic ?? fallbackInsight.trendTopic,
      platform: (insight.platform ?? fallbackInsight.platform) as Platform,
      targetAudience: insight.audience?.description ?? fallbackInsight.targetAudience,
      selectedHook: insight.hooks?.[0] ?? fallbackInsight.selectedHook,
      contentAngle: insight.angles?.[0] ?? fallbackInsight.contentAngle,
      ctaSuggestion: insight.ctas?.[0] ?? fallbackInsight.ctaSuggestion,
    };
  } catch {
    return fallbackInsight;
  }
}

function buildMockDraft(mode: DraftMode, insight: ImportedInsight, insightForm: InsightForm, manualForm: ManualForm, seed: number): DraftOutput {
  const topic = mode === "insight" ? insight.trendTopic.replace("#", "") : manualForm.topic;
  const audience = mode === "insight" ? insight.targetAudience : manualForm.audience;
  const keyMessage = mode === "insight" ? insight.contentAngle : manualForm.keyMessage;
  const goal = mode === "insight" ? insightForm.campaignGoal : manualForm.campaignGoal;
  const platform = mode === "insight" ? insightForm.targetPlatform : manualForm.platform;
  const tone = mode === "insight" ? insightForm.brandTone : manualForm.brandTone;
  const ctaHint = mode === "insight" ? insight.ctaSuggestion : "Send us a message to get the full offer.";

  const hooks = [
    `You are not late to ${topic}. You are just one clear strategy away.`,
    `Most brands talk about ${topic}. Few explain it for ${audience}.`,
    `Want stronger ${goal.toLowerCase()} results? Start your ${topic} content with this angle.`,
  ];

  const caption = [
    `Campaign focus: ${topic} on ${platform}`,
    "",
    `Audience: ${audience}`,
    `Tone: ${tone}`,
    "",
    `Hook: ${hooks[seed % hooks.length]}`,
    "",
    `Core message: ${keyMessage}`,
    mode === "manual" && manualForm.notes ? `Notes: ${manualForm.notes}` : "",
    "",
    `CTA: ${ctaHint}`,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    mode,
    hooks,
    caption,
    ctaOptions: [ctaHint, "Save this post and revisit your strategy this week.", "Comment \"GUIDE\" and we will send a practical checklist."],
    hashtags: [`#${topic.replace(/\s+/g, "")}`, "#MarketingDraft", "#ContentStrategy", "#AIAssistant", "#CampaignPlanning"],
    structure: [
      { label: "Opening Hook", value: hooks[0] },
      { label: "Audience Problem", value: `Many ${audience} still get generic content that lacks clear value.` },
      { label: "Core Value", value: keyMessage },
      { label: "Proof / Social Signal", value: `Use one metric, one customer signal, or one trend observation from ${topic}.` },
      { label: "Call to Action", value: ctaHint },
    ],
    quality: {
      clarity: 82 + (seed % 9),
      audienceMatch: 78 + (seed % 10),
      ctaStrength: 74 + (seed % 12),
    },
  };
}

export default function DraftPage({ onNavigate, tourRestartToken = 0 }: { onNavigate?: (page: string) => void; tourRestartToken?: number }) {
  const [mode, setMode] = useState<DraftMode>("manual");
  const [importedInsight, setImportedInsight] = useState<ImportedInsight>(fallbackInsight);
  const [insightForm, setInsightForm] = useState<InsightForm>(defaultInsightForm);
  const [manualForm, setManualForm] = useState<ManualForm>(defaultManualForm);
  const [loading, setLoading] = useState(false);
  const [seed, setSeed] = useState(1);
  const [draft, setDraft] = useState<DraftOutput | null>(null);
  const [activeTab, setActiveTab] = useState<OutputTab>("hooks");
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [sent, setSent] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);
  const outputPanelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const imported = readImportedInsight();
    setImportedInsight(imported);
    setInsightForm(prev => ({ ...prev, targetPlatform: imported.platform }));
    const fromTrend = localStorage.getItem("aiContentDashboard.draftSource") === "trend";
    setMode(fromTrend ? "insight" : "manual");
    localStorage.removeItem("aiContentDashboard.draftSource");
  }, []);

  useEffect(() => {
    try {
      const done = localStorage.getItem(draftTourStorageKey) === "done";
      if (!done) setTourOpen(true);
    } catch {
      setTourOpen(true);
    }
  }, []);

  useEffect(() => {
    if (tourRestartToken > 0) setTourOpen(true);
  }, [tourRestartToken]);

  const handleTourClose = (completed: boolean) => {
    setTourOpen(false);
    localStorage.setItem(draftTourStorageKey, "done");
    if (!completed) return;
  };

  const isGenerateDisabled = useMemo(() => {
    if (mode === "insight") {
      return !insightForm.campaignGoal || !insightForm.brandTone || !insightForm.targetPlatform || !insightForm.contentType;
    }
    return !manualForm.topic.trim() || !manualForm.audience.trim() || !manualForm.keyMessage.trim();
  }, [insightForm, manualForm, mode]);

  const tabs = [
    { id: "hooks" as const, label: "Hook Options" },
    { id: "caption" as const, label: "Caption Draft" },
    { id: "cta" as const, label: "CTA Options" },
    { id: "hashtags" as const, label: "Hashtags" },
    { id: "structure" as const, label: "Content Structure" },
  ];

  const switchMode = (nextMode: DraftMode) => {
    if (mode === "insight" && nextMode === "manual") {
      setManualForm(prev => ({
        ...prev,
        topic: prev.topic || importedInsight.trendTopic.replace("#", ""),
        audience: prev.audience || importedInsight.targetAudience,
        keyMessage: prev.keyMessage || importedInsight.contentAngle,
      }));
    }
    setMode(nextMode);
  };

  const scrollToOutputPanel = () => {
    outputPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const runGenerate = (nextSeed: number) => {
    scrollToOutputPanel();
    setLoading(true);
    setDraft(null);
    setSaved(false);
    setSent(false);
    setCopied(false);
    setTimeout(() => {
      setDraft(buildMockDraft(mode, importedInsight, insightForm, manualForm, nextSeed));
      setActiveTab("hooks");
      setLoading(false);
    }, 1200);
  };

  const handleGenerate = () => runGenerate(seed);
  const handleRegenerate = () => {
    const next = seed + 1;
    setSeed(next);
    runGenerate(next);
  };

  const handleSample = () => {
    if (mode === "manual") {
      setManualForm({
        ...defaultManualForm,
        topic: "AI-powered skincare advisor",
        audience: "Busy professionals looking for simple routines",
        keyMessage: "Get a personalized skincare routine in under 60 seconds.",
        notes: "Highlight easy onboarding and expert-backed recommendations.",
      });
    }
    const next = seed + 1;
    setSeed(next);
    runGenerate(next);
  };

  const handleSave = () => {
    if (!draft) return;
    try {
      localStorage.setItem(
        "aiContentDashboard.marketingDraft",
        JSON.stringify({
          mode,
          draft,
          insightForm,
          manualForm,
          importedInsight,
          createdAt: Date.now(),
        }),
      );
    } catch {
      // mock only
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
  };

  const handleSend = () => {
    if (!draft) return;
    handleSave();
    setSent(true);
    setTimeout(() => setSent(false), 1200);
    onNavigate?.("content");
  };

  const copyActive = () => {
    if (!draft) return;
    const tabText: Record<OutputTab, string> = {
      hooks: draft.hooks.join("\n"),
      caption: draft.caption,
      cta: draft.ctaOptions.join("\n"),
      hashtags: draft.hashtags.join(" "),
      structure: draft.structure.map(item => `${item.label}: ${item.value}`).join("\n"),
    };
    navigator.clipboard.writeText(tabText[activeTab]).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    });
  };

  return (
    <div className="space-y-6 pb-10 fade-in bg-slate-50 dark:bg-transparent">
      <div id="draft-tour-header" className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center rounded-full border border-slate-200 dark:border-slate-700 px-3 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
              Step 2 of 3: Draft
            </span>
            <h1 className="mt-3 text-2xl font-bold text-slate-900 dark:text-slate-100">Marketing Draft Generator</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Turn insights or ideas into campaign-ready marketing drafts.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTourOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <CircleHelp className="h-4 w-4" />
              Help
            </button>
            <button
              type="button"
              disabled={loading || isGenerateDisabled}
              onClick={handleGenerate}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
              Generate Draft
            </button>
          </div>
        </div>

        <div id="draft-tour-mode" className="mt-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 p-1 flex w-full sm:w-fit">
          <button
            type="button"
            onClick={() => switchMode("insight")}
            className={cn(
              "relative rounded-xl px-4 py-2 text-sm font-semibold transition-all",
              mode === "insight" ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-sm" : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100",
            )}
          >
            Use Trend Insight
            <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase">Recommended</span>
          </button>
          <button
            type="button"
            onClick={() => switchMode("manual")}
            className={cn(
              "rounded-xl px-4 py-2 text-sm font-semibold transition-all",
              mode === "manual" ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-sm" : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100",
            )}
          >
            Start from Scratch
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <section id="draft-tour-inputs" className="xl:col-span-7 space-y-4 transition-all duration-300">
          {mode === "insight" ? (
            <>
              <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Source Insight</p>
                    <h2 className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">Imported from Trend &amp; Social Insight</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate?.("trends")}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <Pencil className="h-4 w-4" />
                    Change Insight
                  </button>
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <DataCard label="Trend topic" value={importedInsight.trendTopic.replace("#", "")} />
                  <DataCard label="Platform" value={importedInsight.platform} />
                  <DataCard label="Audience" value={importedInsight.targetAudience} />
                  <DataCard label="Hook" value={importedInsight.selectedHook} />
                  <DataCard label="Content angle" value={importedInsight.contentAngle} />
                  <DataCard label="CTA suggestion" value={importedInsight.ctaSuggestion} />
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Lightweight Campaign Inputs</p>
                <h2 className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">Refine request</h2>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SelectField label="Campaign goal" value={insightForm.campaignGoal} onChange={(v: Goal) => setInsightForm(prev => ({ ...prev, campaignGoal: v }))} options={goals} />
                  <SelectField label="Brand tone" value={insightForm.brandTone} onChange={(v: Tone) => setInsightForm(prev => ({ ...prev, brandTone: v }))} options={tones} />
                  <SelectField label="Target platform" value={insightForm.targetPlatform} onChange={(v: Platform) => setInsightForm(prev => ({ ...prev, targetPlatform: v }))} options={platforms} />
                  <ChipSelector label="Content type" value={insightForm.contentType} onChange={(v: ContentType) => setInsightForm(prev => ({ ...prev, contentType: v }))} options={contentTypes} />
                </div>
                <button
                  type="button"
                  disabled={loading || isGenerateDisabled}
                  onClick={handleGenerate}
                  className="btn-gradient sm:hidden mt-3 w-full inline-flex items-center justify-center gap-2 text-white text-sm font-semibold px-4 py-2.5 rounded-xl disabled:opacity-70"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                  Generate Draft
                </button>
              </div>
              
            </>
          ) : (
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Manual Draft Input</p>
              <h2 className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">Start from your own campaign idea</h2>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField label="Topic / Product Name" value={manualForm.topic} onChange={v => setManualForm(prev => ({ ...prev, topic: v }))} placeholder="e.g. Smart hydration bottle" />
                <TextField label="Target audience" value={manualForm.audience} onChange={v => setManualForm(prev => ({ ...prev, audience: v }))} placeholder="e.g. Fitness-focused millennials" />
                <SelectField label="Campaign goal" value={manualForm.campaignGoal} onChange={(v: Goal) => setManualForm(prev => ({ ...prev, campaignGoal: v }))} options={goals} />
                <SelectField label="Brand tone" value={manualForm.brandTone} onChange={(v: Tone) => setManualForm(prev => ({ ...prev, brandTone: v }))} options={tones} />
                <SelectField label="Platform" value={manualForm.platform} onChange={(v: Platform) => setManualForm(prev => ({ ...prev, platform: v }))} options={platforms} />
                <ChipSelector label="Content type" value={manualForm.contentType} onChange={(v: ContentType) => setManualForm(prev => ({ ...prev, contentType: v }))} options={contentTypes} />
              </div>
              <div className="mt-4">
                <TextField label="Key message / selling point" value={manualForm.keyMessage} onChange={v => setManualForm(prev => ({ ...prev, keyMessage: v }))} placeholder="e.g. Personalized recommendations in under 60 seconds." />
              </div>
              <div className="mt-4">
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">Additional notes</label>
                <textarea
                  rows={4}
                  value={manualForm.notes}
                  onChange={e => setManualForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Optional: promo details, constraints, language style..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <button
                  type="button"
                  disabled={loading || isGenerateDisabled}
                  onClick={handleGenerate}
                  className="btn-gradient sm:hidden mt-3 w-full inline-flex items-center justify-center gap-2 text-white text-sm font-semibold px-4 py-2.5 rounded-xl disabled:opacity-70"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                  Generate Draft
                </button>
            </div>
          )}
        </section>

        <section className="xl:col-span-5 space-y-4">
          <div id="draft-tour-output" ref={outputPanelRef} className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Draft Output Panel</p>
                <h2 className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">AI-generated marketing draft</h2>
              </div>
              {draft ? (
                <button
                  type="button"
                  onClick={copyActive}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              ) : null}
            </div>

            {!draft && !loading ? (
              <div className="mt-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-6 text-center">
                <Sparkles className="mx-auto h-6 w-6 text-slate-500 dark:text-slate-400" />
                <p className="mt-3 text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {mode === "insight"
                    ? "Select or import a trend insight to start generating your draft."
                    : "Fill in the form to generate your marketing draft."}
                </p>
                <button
                  type="button"
                  onClick={handleSample}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Try sample draft
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ) : null}

            {loading ? (
              <div className="mt-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-5 flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                <p className="text-sm text-slate-600 dark:text-slate-300">Generating campaign draft...</p>
              </div>
            ) : null}

            {draft && !loading ? (
              <div className="mt-4 space-y-3">
                <div className="flex gap-2 overflow-auto pb-1">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "shrink-0 rounded-xl border px-3 py-2 text-xs font-semibold transition-all",
                        activeTab === tab.id
                          ? "border-transparent bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                          : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700",
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-4">
                  {activeTab === "hooks" ? <ul className="space-y-2">{draft.hooks.map((item, idx) => <li key={idx} className="text-sm text-slate-700 dark:text-slate-200">- {item}</li>)}</ul> : null}
                  {activeTab === "caption" ? <p className="text-sm whitespace-pre-line text-slate-700 dark:text-slate-200">{draft.caption}</p> : null}
                  {activeTab === "cta" ? <ul className="space-y-2">{draft.ctaOptions.map((item, idx) => <li key={idx} className="text-sm text-slate-700 dark:text-slate-200">- {item}</li>)}</ul> : null}
                  {activeTab === "hashtags" ? <div className="flex flex-wrap gap-2">{draft.hashtags.map((tag, idx) => <span key={idx} className="rounded-full border border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300">{tag}</span>)}</div> : null}
                  {activeTab === "structure" ? (
                    <div className="space-y-2">
                      {draft.structure.map((item, idx) => (
                        <div key={idx} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{item.label}</p>
                          <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-emerald-600" />
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">AI Quality Score</p>
                  </div>
                  <div className="mt-3 space-y-2">
                    <ScoreBar label="Clarity" score={draft.quality.clarity} />
                    <ScoreBar label="Audience Match" score={draft.quality.audienceMatch} />
                    <ScoreBar label="CTA Strength" score={draft.quality.ctaStrength} />
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </div>

      {draft ? (
        <div id="draft-tour-send" className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-4 sm:p-5">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">This draft will be used to generate image or video creative.</p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleRegenerate}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <RefreshCw className="h-4 w-4" />
              Regenerate
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              {saved ? <Check className="h-4 w-4 text-emerald-600" /> : <BookmarkPlus className="h-4 w-4" />}
              {saved ? "Saved" : "Save Draft"}
            </button>
            <button
              type="button"
              onClick={handleSend}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-xs font-semibold text-white"
            >
              {sent ? <Check className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
              {sent ? "Sent" : "Send to Content Generation"}
            </button>
          </div>
        </div>
      ) : null}
      <GuidedTour isOpen={tourOpen} steps={draftTourSteps} onClose={handleTourClose} />
    </div>
  );
}

function DataCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 text-xs leading-relaxed text-slate-700 dark:text-slate-200">{value}</p>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">{label}</label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      />
    </div>
  );
}

function SelectField<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: readonly T[];
}) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value as T)}
        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      >
        {options.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function ChipSelector<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: readonly T[];
}) {
  return (
    <div>
      <p className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map(option => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-semibold transition-all",
              value === option
                ? "border-transparent bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700",
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
        <span>{label}</span>
        <span>{score}%</span>
      </div>
      <div className="mt-1 h-2 rounded-full bg-slate-100 dark:bg-slate-700">
        <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-purple-600" style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}
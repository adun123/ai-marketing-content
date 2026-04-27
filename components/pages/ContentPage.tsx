"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookmarkPlus,
  Check,
  ChevronRight,
  Copy,
  Download,
  Film,
  Image as ImageIcon,
  Loader2,
  Pencil,
  RefreshCw,
  Sparkles,
  Trash2,
  Upload,
  Wand2,
} from "lucide-react";

type CreativeType = "image" | "video";
type Platform = "instagram" | "tiktok" | "youtube" | "linkedin" | "x" | "custom";
type Aspect = "1:1" | "4:5" | "9:16" | "16:9" | "custom";
type Tone = "Professional" | "Friendly" | "Bold" | "Luxury" | "Gen Z";

type ImageGoal = "Product promo" | "Campaign poster" | "Social media post" | "Thumbnail" | "Banner" | "Educational visual";
type VisualStyle = "Clean corporate" | "Minimal luxury" | "Bold colorful" | "Futuristic AI" | "Lifestyle" | "Editorial";

type VideoGoal =
  | "TikTok/Reels short video"
  | "YouTube Shorts"
  | "Product demo"
  | "Brand awareness ad"
  | "Educational explainer"
  | "Testimonial style video";
type VideoDuration = "6s" | "10s" | "15s" | "30s" | "60s";
type VideoStyle = "Fast-paced" | "Storytelling" | "Cinematic" | "UGC style" | "Professional" | "Motion graphics";

type AssetType = "Product photo" | "Brand logo" | "Background image" | "Reference image" | "Additional material";
type UploadedAsset = {
  id: string;
  name: string;
  file: File;
  url: string;
  assetType: AssetType;
  useAsReference: boolean;
};

type StoredSource = {
  insight: {
    topic: string;
    audience: string;
    hook: string;
  };
  draft: {
    hookDraft: string;
    captionPreview: string;
    cta: string;
  };
  campaign?: {
    goal?: string;
    product?: string;
    platform?: string;
    tone?: string;
    contentType?: string;
    notes?: string;
  };
};

type SourceMode = "imported" | "manual";
type ManualSourceForm = {
  topic: string;
  audience: string;
  hook: string;
  hookDraft: string;
  captionPreview: string;
  cta: string;
  goal: string;
  product: string;
  platform: string;
  tone: Tone;
  notes: string;
};

type OutputTab = "output" | "prompt" | "script" | "scenes";

const tones: Tone[] = ["Professional", "Friendly", "Bold", "Luxury", "Gen Z"];

const platformOptions: Array<{ id: Platform; label: string }> = [
  { id: "instagram", label: "Instagram" },
  { id: "tiktok", label: "TikTok" },
  { id: "youtube", label: "YouTube" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "x", label: "X/Twitter" },
  { id: "custom", label: "Custom" },
];

const aspectOptions: Array<{ id: Aspect; label: string; hint: string }> = [
  { id: "1:1", label: "1:1", hint: "Instagram Feed" },
  { id: "4:5", label: "4:5", hint: "Feed Ads" },
  { id: "9:16", label: "9:16", hint: "TikTok / Reels / Shorts" },
  { id: "16:9", label: "16:9", hint: "YouTube / Website" },
  { id: "custom", label: "Custom", hint: "Your size" },
];

const mockSource: StoredSource = {
  insight: {
    topic: "AI Personalization for Beauty Ecommerce",
    audience: "Urban Gen Z shoppers (18–25)",
    hook: "Your skincare routine shouldn’t feel like guessing — it should adapt to you.",
  },
  draft: {
    hookDraft: "POV: your skincare finally learns what your skin actually needs.",
    captionPreview:
      "Meet the routine that updates with you. Our AI analyzes your skin signals and recommends the right steps — day by day.",
    cta: "Try the AI routine builder — free for 7 days.",
  },
  campaign: {
    goal: "Awareness",
    product: "GlowRoutine AI",
    platform: "Instagram",
    tone: "Professional",
    contentType: "Caption",
    notes: "Keep it premium and minimal. Avoid overpromising.",
  },
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function aspectClass(aspect: Aspect) {
  if (aspect === "1:1") return "aspect-square";
  if (aspect === "4:5") return "aspect-[4/5]";
  if (aspect === "9:16") return "aspect-[9/16]";
  if (aspect === "16:9") return "aspect-video";
  return "aspect-[9/16]";
}

function platformLabel(p: Platform) {
  if (p === "instagram") return "Instagram";
  if (p === "tiktok") return "TikTok";
  if (p === "youtube") return "YouTube";
  if (p === "linkedin") return "LinkedIn";
  if (p === "x") return "X/Twitter";
  return "Custom";
}

function prettyAspect(aspect: Aspect, customW: number, customH: number) {
  if (aspect !== "custom") return aspect;
  return `${customW}×${customH}`;
}

function readSourceFromStorage(): StoredSource {
  try {
    const rawDraft = localStorage.getItem("aiContentDashboard.marketingDraft");
    if (rawDraft) {
      const parsed = JSON.parse(rawDraft) as any;
      const imported = parsed?.importedInsight;
      const draft = parsed?.draft;
      if (imported && draft) {
        const topic = imported.trendTopic ?? mockSource.insight.topic;
        const audience = imported.targetAudience ?? mockSource.insight.audience;
        const hook = imported.selectedHook ?? mockSource.insight.hook;

        const hookDraft = draft.hooks?.[0]?.text ?? mockSource.draft.hookDraft;
        const captionPreview = draft.captions?.primary ?? mockSource.draft.captionPreview;
        const cta = draft.ctas?.[0] ?? mockSource.draft.cta;

        return {
          insight: { topic, audience, hook },
          draft: { hookDraft, captionPreview, cta },
          campaign: parsed?.campaign ?? mockSource.campaign,
        };
      }
    }

    const rawInsight = localStorage.getItem("aiContentDashboard.trendInsight");
    if (rawInsight) {
      const parsed = JSON.parse(rawInsight) as any;
      const insight = parsed?.insight;
      if (insight) {
        const topic = insight.trendTopic ?? mockSource.insight.topic;
        const audience = insight.audience?.description ?? mockSource.insight.audience;
        const hook = insight.hooks?.[0] ?? mockSource.insight.hook;
        const hookDraft = insight.hooks?.[0] ?? mockSource.draft.hookDraft;
        const captionPreview = insight.summary?.headline ?? mockSource.draft.captionPreview;
        const cta = insight.ctas?.[0] ?? mockSource.draft.cta;
        return {
          insight: { topic, audience, hook },
          draft: { hookDraft, captionPreview, cta },
          campaign: mockSource.campaign,
        };
      }
    }
  } catch {
    // ignore
  }
  return mockSource;
}

function sourceFromManualForm(manual: ManualSourceForm): StoredSource {
  return {
    insight: {
      topic: manual.topic || "[Topic]",
      audience: manual.audience || "[Audience]",
      hook: manual.hook || "[Hook]",
    },
    draft: {
      hookDraft: manual.hookDraft || manual.hook || "[Hook Draft]",
      captionPreview: manual.captionPreview || "[Caption Preview]",
      cta: manual.cta || "[CTA]",
    },
    campaign: {
      goal: manual.goal || "Awareness",
      product: manual.product || "[Product Name]",
      platform: manual.platform || "Instagram",
      tone: manual.tone,
      notes: manual.notes,
    },
  };
}

export default function ContentPage({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const [creativeType, setCreativeType] = useState<CreativeType>("image");
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [aspect, setAspect] = useState<Aspect>("9:16");
  const [customWidth, setCustomWidth] = useState(1080);
  const [customHeight, setCustomHeight] = useState(1920);
  const [tone, setTone] = useState<Tone>("Professional");

  const [imageGoal, setImageGoal] = useState<ImageGoal>("Social media post");
  const [visualStyle, setVisualStyle] = useState<VisualStyle>("Minimal luxury");

  const [videoGoal, setVideoGoal] = useState<VideoGoal>("TikTok/Reels short video");
  const [videoDuration, setVideoDuration] = useState<VideoDuration>("15s");
  const [videoStyle, setVideoStyle] = useState<VideoStyle>("Fast-paced");
  const [scenes, setScenes] = useState<
    Array<{
      id: string;
      duration: string;
      visual: string;
      onScreenText: string;
      voiceOver: string;
      note: string;
    }>
  >([]);

  const [loading, setLoading] = useState(false);
  const [outputReady, setOutputReady] = useState(false);
  const [activeTab, setActiveTab] = useState<OutputTab>("output");
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [exported, setExported] = useState(false);
  const [sentToDashboard, setSentToDashboard] = useState(false);

  const [assets, setAssets] = useState<UploadedAsset[]>([]);
  const [source, setSource] = useState<StoredSource>(mockSource);
  const [sourceMode, setSourceMode] = useState<SourceMode>("imported");
  const [manualSource, setManualSource] = useState<ManualSourceForm>({
    topic: mockSource.insight.topic,
    audience: mockSource.insight.audience,
    hook: mockSource.insight.hook,
    hookDraft: mockSource.draft.hookDraft,
    captionPreview: mockSource.draft.captionPreview,
    cta: mockSource.draft.cta,
    goal: mockSource.campaign?.goal ?? "Awareness",
    product: mockSource.campaign?.product ?? "",
    platform: mockSource.campaign?.platform ?? "Instagram",
    tone: mockSource.campaign?.tone === "Friendly" || mockSource.campaign?.tone === "Bold" || mockSource.campaign?.tone === "Luxury" || mockSource.campaign?.tone === "Gen Z" ? mockSource.campaign.tone : "Professional",
    notes: mockSource.campaign?.notes ?? "",
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const s = readSourceFromStorage();
    setSource(s);
    setManualSource({
      topic: s.insight.topic,
      audience: s.insight.audience,
      hook: s.insight.hook,
      hookDraft: s.draft.hookDraft,
      captionPreview: s.draft.captionPreview,
      cta: s.draft.cta,
      goal: s.campaign?.goal ?? "Awareness",
      product: s.campaign?.product ?? "",
      platform: s.campaign?.platform ?? "Instagram",
      tone: s.campaign?.tone === "Friendly" || s.campaign?.tone === "Bold" || s.campaign?.tone === "Luxury" || s.campaign?.tone === "Gen Z" ? s.campaign.tone : "Professional",
      notes: s.campaign?.notes ?? "",
    });

    const suggestedPlatform = (s.campaign?.platform ?? "").toLowerCase();
    const matchPlatform = platformOptions.find(p => p.label.toLowerCase() === suggestedPlatform)?.id;
    if (matchPlatform) setPlatform(matchPlatform);

    const suggestedTone = s.campaign?.tone as Tone | undefined;
    if (suggestedTone && tones.includes(suggestedTone)) setTone(suggestedTone);

    setScenes([
      {
        id: `s1-${Date.now()}`,
        duration: "0:00–0:04",
        visual: "Pattern interrupt with bold text + quick cut montage (3 cuts).",
        onScreenText: s.insight.hook,
        voiceOver: "Hook with a bold statement. Keep it under 2 seconds.",
        note: "Hard cut → checklist",
      },
      {
        id: `s2-${Date.now() + 1}`,
        duration: "0:04–0:10",
        visual: "Show solution as a simple 3-step checklist with icons.",
        onScreenText: "1) Identify  2) Prove  3) Act",
        voiceOver: "Explain the problem-solution in one sentence and show one proof point.",
        note: "Add product/logo overlay",
      },
      {
        id: `s3-${Date.now() + 2}`,
        duration: "0:10–0:15",
        visual: "Outcome shot + CTA end card.",
        onScreenText: s.draft.cta,
        voiceOver: "End with a single CTA.",
        note: "Music hit + end frame",
      },
    ]);
  }, []);

  const activeSource = useMemo(() => (sourceMode === "manual" ? sourceFromManualForm(manualSource) : source), [manualSource, source, sourceMode]);
  const sourceLabel = sourceMode === "manual" ? "manual prompt context" : "selected trend insight & marketing draft";

  const initialPrompt = useMemo(() => {
    const { insight, draft } = activeSource;
    const campaignGoal = activeSource.campaign?.goal ?? "Awareness";
    const product = activeSource.campaign?.product ?? "[Product Name]";
    const platformDest = platformLabel(platform);
    const sizeLabel = prettyAspect(aspect, customWidth, customHeight);
    const assetsText =
      assets.length === 0
        ? "No manual assets attached."
        : assets.map(a => `- ${a.assetType}: ${a.name}${a.useAsReference ? " (reference)" : ""}`).join("\n");

    const baseContext = [
      `Creative Source`,
      `- Trend topic: ${insight.topic}`,
      `- Audience: ${insight.audience}`,
      `- Hook: ${insight.hook}`,
      ``,
      `Marketing Draft (preview)`,
      `- Hook draft: ${draft.hookDraft}`,
      `- Caption preview: ${draft.captionPreview}`,
      `- CTA: ${draft.cta}`,
      ``,
      `Campaign Settings`,
      `- Goal: ${campaignGoal}`,
      `- Product: ${product}`,
      `- Platform destination: ${platformDest}`,
      `- Format/size: ${sizeLabel}`,
      `- Brand tone: ${tone}`,
      ``,
      `Manual assets`,
      assetsText,
      ``,
    ].join("\n");

    if (creativeType === "image") {
      return [
        `You are an expert creative director. Generate an IMAGE creative.`,
        baseContext,
        `Image intent`,
        `- Image goal: ${imageGoal}`,
        `- Visual style: ${visualStyle}`,
        ``,
        `Deliverables`,
        `- 1 visual prompt`,
        `- Suggested headline`,
        `- Suggested overlay copy`,
        `- Suggested caption`,
        `- CTA line`,
        `- Design direction (layout, hierarchy, typography)`,
      ].join("\n");
    }

    return [
      `You are an expert creative director. Generate a VIDEO creative package.`,
      baseContext,
      `Video intent`,
      `- Video goal: ${videoGoal}`,
      `- Duration: ${videoDuration}`,
      `- Style: ${videoStyle}`,
      ``,
      `Deliverables`,
      `- 1 video prompt`,
      `- Script (VO + on-screen text)`,
      `- Scene breakdown (3–6 scenes)`,
      `- Suggested music/mood`,
      `- CTA line`,
      `- Final caption`,
    ].join("\n");
  }, [
    aspect,
    assets,
    creativeType,
    customHeight,
    customWidth,
    imageGoal,
    platform,
    activeSource,
    tone,
    videoDuration,
    videoGoal,
    videoStyle,
    visualStyle,
  ]);

  const [prompt, setPrompt] = useState(initialPrompt);
  useEffect(() => setPrompt(initialPrompt), [initialPrompt]);

  useEffect(() => {
    return () => {
      for (const a of assets) URL.revokeObjectURL(a.url);
    };
  }, [assets]);

  const generatedImage = useMemo(() => {
    const { insight, draft } = activeSource;
    const product = activeSource.campaign?.product ?? "[Product Name]";
    const sizeLabel = prettyAspect(aspect, customWidth, customHeight);
    const pLabel = platformLabel(platform);

    return {
      prompt: `Create a modern ${pLabel} campaign visual for ${product}, targeting ${insight.audience}. Use the hook “${insight.hook}” and CTA “${draft.cta}”. Visual style: ${visualStyle}. Goal: ${imageGoal}. Format: ${sizeLabel}. Premium, minimal layout with strong hierarchy and high legibility.`,
      headline: `${product} — made for ${insight.audience.split(",")[0] ?? "your audience"}`,
      overlayCopy: `${insight.hook}\n${draft.cta}`,
      caption: `${draft.captionPreview}\n\n${draft.cta}`,
      cta: draft.cta,
      direction:
        "Layout: bold headline top, supporting line mid, CTA button bottom. Use generous whitespace, soft gradient accents (blue→purple), and one focal product/hero element. Typography: clean sans, high contrast.",
    };
  }, [activeSource, aspect, customHeight, customWidth, imageGoal, platform, visualStyle]);

  const generatedVideo = useMemo(() => {
    const { insight, draft } = activeSource;
    const product = activeSource.campaign?.product ?? "[Product Name]";
    const sizeLabel = prettyAspect(aspect, customWidth, customHeight);
    const pLabel = platformLabel(platform);

    const sceneBreakdown = scenes
      .map((s, idx) => {
        return [
          `Scene ${idx + 1} (${s.duration})`,
          `- Visual: ${s.visual}`,
          `- On-screen: ${s.onScreenText}`,
          `- Voice-over: ${s.voiceOver}`,
          `- Note: ${s.note}`,
        ].join("\n");
      })
      .join("\n\n");

    const script = scenes
      .map((s, idx) => `SCENE ${idx + 1}\nON-SCREEN: ${s.onScreenText}\nVO: ${s.voiceOver}`)
      .join("\n\n");

    return {
      prompt: `Create a ${videoDuration} ${pLabel} video in ${sizeLabel}. Product: ${product}. Audience: ${insight.audience}. Hook: “${insight.hook}”. Style: ${videoStyle}. Use clear problem-solution structure, bold overlays, and end with CTA: “${draft.cta}”. Provide scene breakdown, VO, and caption.`,
      script,
      scenes: sceneBreakdown,
      captionOverlay: `${insight.hook}\n${draft.cta}`,
      musicMood: videoStyle === "Cinematic" ? "Cinematic ambient + subtle hit impacts" : "Upbeat modern pop + quick transitions",
      cta: draft.cta,
      finalCaption: `${draft.captionPreview}\n\n${draft.cta}\n\n#Marketing #Content #${pLabel.replace("/", "")}`,
    };
  }, [activeSource, aspect, customHeight, customWidth, platform, scenes, videoDuration, videoStyle]);

  const handleGenerate = () => {
    setLoading(true);
    setOutputReady(false);
    setCopied(false);
    setDownloaded(false);
    setSaved(false);
    setExported(false);
    setSentToDashboard(false);
    setTimeout(() => {
      setLoading(false);
      setOutputReady(true);
      setActiveTab("output");
    }, 1400);
  };

  const handleCopy = () => {
    const text =
      creativeType === "image"
        ? activeTab === "prompt"
          ? generatedImage.prompt
          : [
              `Generated from selected trend & marketing draft`,
              ``,
              `Headline: ${generatedImage.headline}`,
              `Overlay: ${generatedImage.overlayCopy}`,
              `Caption: ${generatedImage.caption}`,
              `CTA: ${generatedImage.cta}`,
              `Direction: ${generatedImage.direction}`,
            ].join("\n")
        : activeTab === "prompt"
          ? generatedVideo.prompt
          : activeTab === "script"
            ? generatedVideo.script
            : activeTab === "scenes"
              ? generatedVideo.scenes
              : [
                  `Generated from selected trend & marketing draft`,
                  ``,
                  `Overlay: ${generatedVideo.captionOverlay}`,
                  `Music/mood: ${generatedVideo.musicMood}`,
                  `CTA: ${generatedVideo.cta}`,
                  `Final caption: ${generatedVideo.finalCaption}`,
                ].join("\n");

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  };

  const handleRegenerate = () => handleGenerate();

  const handleDownload = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 1400);
  };

  const handleEditSource = () => {
    if (sourceMode === "manual") return;
    onNavigate?.("draft");
  };

  const handleUploadClick = () => fileInputRef.current?.click();
  const handleUploadFiles = (files: FileList | null) => {
    if (!files) return;
    const next: UploadedAsset[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      next.push({
        id: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(16).slice(2)}`,
        name: file.name,
        file,
        url: URL.createObjectURL(file),
        assetType: "Reference image",
        useAsReference: true,
      });
    }
    if (next.length === 0) return;
    setAssets(prev => [...prev, ...next].slice(0, 12));
  };

  const onDropUpload = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleUploadFiles(e.dataTransfer.files);
  };

  const removeAsset = (id: string) => {
    setAssets(prev => {
      const item = prev.find(a => a.id === id);
      if (item) URL.revokeObjectURL(item.url);
      return prev.filter(a => a.id !== id);
    });
  };

  const updateAsset = (id: string, patch: Partial<UploadedAsset>) => {
    setAssets(prev => prev.map(a => (a.id === id ? { ...a, ...patch } : a)));
  };

  const addScene = () => {
    setScenes(prev => [
      ...prev,
      {
        id: `s${prev.length + 1}-${Date.now()}`,
        duration: "0:00–0:05",
        visual: "Describe visual direction…",
        onScreenText: "On-screen text…",
        voiceOver: "Voice-over…",
        note: "Transition/CTA note…",
      },
    ]);
  };
  const removeScene = (id: string) => setScenes(prev => prev.filter(s => s.id !== id));

  const regenScenes = () => {
    const { insight, draft } = activeSource;
    setScenes([
      {
        id: `s1-${Date.now()}`,
        duration: "0:00–0:03",
        visual: "Pattern interrupt: bold text + quick cut to product/hero.",
        onScreenText: insight.hook,
        voiceOver: "Hit the hook fast. One sentence.",
        note: "Hard cut",
      },
      {
        id: `s2-${Date.now() + 1}`,
        duration: "0:03–0:09",
        visual: "3-step checklist with icons + subtle gradient background.",
        onScreenText: "1) Problem  2) Proof  3) Fix",
        voiceOver: "Explain the problem-solution in simple terms.",
        note: "Swipe transition",
      },
      {
        id: `s3-${Date.now() + 2}`,
        duration: "0:09–0:15",
        visual: "End card with logo + CTA button.",
        onScreenText: draft.cta,
        voiceOver: "Close with one CTA.",
        note: "Music hit + end frame",
      },
    ]);
  };

  const saveCreativeToStorage = (payload: any) => {
    try {
      const raw = localStorage.getItem("aiContentDashboard.creatives");
      const list = raw ? (JSON.parse(raw) as any[]) : [];
      list.unshift(payload);
      localStorage.setItem("aiContentDashboard.creatives", JSON.stringify(list.slice(0, 50)));
    } catch {
      // ignore
    }
  };

  const handleSaveCreative = () => {
    const payload =
      creativeType === "image"
        ? {
            id: `c-${Date.now()}`,
            createdAt: Date.now(),
            type: "image",
            platform,
            aspect,
            customSize: aspect === "custom" ? { width: customWidth, height: customHeight } : null,
            tone,
            source,
            assets: assets.map(a => ({ name: a.name, assetType: a.assetType, useAsReference: a.useAsReference })),
            output: generatedImage,
          }
        : {
            id: `c-${Date.now()}`,
            createdAt: Date.now(),
            type: "video",
            platform,
            aspect,
            customSize: aspect === "custom" ? { width: customWidth, height: customHeight } : null,
            tone,
            source,
            assets: assets.map(a => ({ name: a.name, assetType: a.assetType, useAsReference: a.useAsReference })),
            output: { ...generatedVideo, scenes },
          };
    saveCreativeToStorage(payload);
    setSaved(true);
    setTimeout(() => setSaved(false), 1400);
  };

  const handleExport = () => {
    const data =
      creativeType === "image"
        ? { type: "image", platform, aspect, customWidth, customHeight, tone, source, assets, output: generatedImage }
        : { type: "video", platform, aspect, customWidth, customHeight, tone, source, assets, output: generatedVideo, scenes };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `creative-export-${creativeType}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExported(true);
    setTimeout(() => setExported(false), 1400);
  };

  const handleSendToDashboard = () => {
    handleSaveCreative();
    setSentToDashboard(true);
    setTimeout(() => setSentToDashboard(false), 1200);
    onNavigate?.("dashboard");
  };

  return (
    <div className="space-y-6 fade-in pb-24 lg:pb-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-slate-600">Discover</span>
            <ChevronRight className="w-4 h-4 text-slate-300" />
            <span className="rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-slate-600">Draft</span>
            <ChevronRight className="w-4 h-4 text-slate-300" />
            <span className="rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-1 dark:text-slate-200">Step 3 of 3: Create</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mt-2">Content Generation</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Transform your marketing draft into ready-to-publish image or video creative.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Generated from selected trend insight and marketing draft.</p>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="btn-gradient inline-flex items-center justify-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-xl disabled:opacity-70"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
          Generate Creative
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <aside className="lg:col-span-3 space-y-4 order-1">
          <div className="bg-white dark:bg-slate-900/70 rounded-2xl p-5 card-shadow border border-slate-200 dark:border-slate-800">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Creative Source</p>
                <h2 className="font-semibold text-slate-900 dark:text-slate-100 mt-1">
                  {sourceMode === "manual" ? "Manual prompt context" : "Imported context"}
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  {sourceMode === "manual" ? "Fill your own prompt context here." : "Imported from Trend &amp; Social Insight + Marketing Draft"}
                </p>
              </div>
              <div className="h-9 w-9 rounded-2xl bg-blue-50 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-blue-600" />
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 dark:border-slate-700 p-1 grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() => setSourceMode("imported")}
                className={cn(
                  "rounded-xl px-3 py-2 text-xs font-semibold transition-all",
                  sourceMode === "imported" ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800",
                )}
              >
                Imported Draft
              </button>
              <button
                type="button"
                onClick={() => setSourceMode("manual")}
                className={cn(
                  "rounded-xl px-3 py-2 text-xs font-semibold transition-all",
                  sourceMode === "manual" ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800",
                )}
              >
                Manual Prompt
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {sourceMode === "manual" ? (
                <>
                  <TextInput label="Trend topic / product" value={manualSource.topic} onChange={value => setManualSource(prev => ({ ...prev, topic: value }))} />
                  <TextInput label="Audience" value={manualSource.audience} onChange={value => setManualSource(prev => ({ ...prev, audience: value }))} />
                  <TextInput label="Hook" value={manualSource.hook} onChange={value => setManualSource(prev => ({ ...prev, hook: value }))} />
                  <TextInput label="Hook draft" value={manualSource.hookDraft} onChange={value => setManualSource(prev => ({ ...prev, hookDraft: value }))} />
                  <TextInput label="Caption preview" value={manualSource.captionPreview} onChange={value => setManualSource(prev => ({ ...prev, captionPreview: value }))} />
                  <TextInput label="CTA" value={manualSource.cta} onChange={value => setManualSource(prev => ({ ...prev, cta: value }))} />
                </>
              ) : (
                <>
                  <InfoRow label="Trend topic" value={activeSource.insight.topic.replace("#", "")} />
                  <InfoRow label="Audience" value={activeSource.insight.audience} />
                  <InfoRow label="Hook" value={activeSource.insight.hook} />
                  <InfoRow label="Marketing draft preview" value={activeSource.draft.captionPreview} clamp />
                  <InfoRow label="CTA" value={activeSource.draft.cta} />
                  <InfoRow label="Platform suggestion" value={activeSource.campaign?.platform ?? "Instagram"} />
                </>
              )}
            </div>

            <button
              onClick={handleEditSource}
              disabled={sourceMode === "manual"}
              className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 transition-all"
            >
              <Pencil className="w-4 h-4" />
              {sourceMode === "manual" ? "Manual mode active" : "Edit Source"}
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900/70 rounded-2xl p-5 card-shadow border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Creative Type</p>
                <p className="text-[11px] text-slate-500 mt-1">Choose output mode</p>
              </div>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1">
                {creativeType === "image" ? "Image Mode" : "Video Mode"}
              </span>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => setCreativeType("image")}
                className={cn(
                  "rounded-2xl border p-3.5 text-left transition-all",
                  creativeType === "image"
                    ? "border-transparent bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-sm"
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800",
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    <span className="text-sm font-semibold">Image / Photo</span>
                  </div>
                  <span
                    className={cn(
                      "text-[10px] font-semibold rounded-full px-2 py-0.5",
                      creativeType === "image" ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300",
                    )}
                  >
                    Visual
                  </span>
                </div>
                <p className={cn("text-xs mt-1.5", creativeType === "image" ? "text-white/85" : "text-slate-500")}>
                  Posters, thumbnails, social graphics.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setCreativeType("video")}
                className={cn(
                  "rounded-2xl border p-3.5 text-left transition-all",
                  creativeType === "video"
                    ? "border-transparent bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-sm"
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800",
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Film className="w-4 h-4" />
                    <span className="text-sm font-semibold">Video</span>
                  </div>
                  <span
                    className={cn(
                      "text-[10px] font-semibold rounded-full px-2 py-0.5",
                      creativeType === "video" ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300",
                    )}
                  >
                    Motion
                  </span>
                </div>
                <p className={cn("text-xs mt-1.5", creativeType === "video" ? "text-white/85" : "text-slate-500")}>
                  Scripts, scenes, captions, prompts.
                </p>
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {(creativeType === "image"
                ? ["Campaign visual", "Poster", "Thumbnail"]
                : ["Short video", "Scene builder", "Voice-over"]).map(tag => (
                <span
                  key={tag}
                  className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-2.5 py-1"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </aside>

        <section className="lg:col-span-5 space-y-4 order-2">
          <div className="bg-white dark:bg-slate-900/70 rounded-2xl p-5 card-shadow border border-slate-200 dark:border-slate-800">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Platform &amp; Format</p>
                <h2 className="font-semibold text-slate-900 dark:text-slate-100 mt-1">Destination settings</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Choose platform, size, and tone for output.</p>
              </div>
              <div className="h-9 w-9 rounded-2xl bg-slate-900 flex items-center justify-center">
                <Wand2 className="w-4 h-4 text-white" />
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Platform</p>
              <div className="flex flex-wrap gap-2">
                {platformOptions.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setPlatform(p.id)}
                    className={cn(
                      "text-xs font-semibold px-4 py-2 rounded-xl border transition-all",
                      platform === p.id
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent"
                        : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-900",
                    )}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Aspect ratio / size</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {aspectOptions.map(a => (
                  <button
                    key={a.id}
                    onClick={() => setAspect(a.id)}
                    className={cn(
                      "rounded-2xl border p-3 text-left transition-all",
                      aspect === a.id ? "border-blue-400 ring-2 ring-blue-500/10" : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60",
                    )}
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{a.label}</span>
                      <span className="text-[10px] text-slate-400">{a.hint}</span>
                    </div>
                    <div className="mt-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2">
                      <div className={cn("w-full rounded-lg bg-gradient-to-br from-blue-200 via-purple-200 to-slate-200", aspectClass(a.id))} />
                    </div>
                  </button>
                ))}
              </div>

              {aspect === "custom" ? (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Width</label>
                    <input
                      type="number"
                      value={customWidth}
                      onChange={e => setCustomWidth(Number(e.target.value))}
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 rounded-xl text-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-400/30 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Height</label>
                    <input
                      type="number"
                      value={customHeight}
                      onChange={e => setCustomHeight(Number(e.target.value))}
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 rounded-xl text-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-400/30 transition-all"
                    />
                  </div>
                </div>
              ) : null}
            </div>

            <div className="mt-5">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Brand tone</p>
              <div className="flex flex-wrap gap-2">
                {tones.map(t => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    className={cn(
                      "text-xs font-semibold px-4 py-2 rounded-xl border transition-all",
                      tone === t ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent" : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-900",
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {creativeType === "image" ? (
            <div className="bg-white dark:bg-slate-900/70 rounded-2xl p-5 card-shadow border border-slate-200 dark:border-slate-800">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Image / Photo Mode</p>
              
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Select
                  label="Image goal"
                  value={imageGoal}
                  onChange={setImageGoal}
                  options={["Product promo", "Campaign poster", "Social media post", "Thumbnail", "Banner", "Educational visual"] as const}
                />
                <Select
                  label="Visual style"
                  value={visualStyle}
                  onChange={setVisualStyle}
                  options={["Clean corporate", "Minimal luxury", "Bold colorful", "Futuristic AI", "Lifestyle", "Editorial"] as const}
                />
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Manual assets upload</p>
                  <button
                    onClick={handleUploadClick}
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-900 text-white px-3 py-2 text-xs font-semibold hover:bg-slate-800 transition-all"
                  >
                    <Upload className="w-4 h-4" />
                    Upload
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={e => handleUploadFiles(e.target.files)}
                  />
                </div>

                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5" onDrop={onDropUpload} onDragOver={e => e.preventDefault()}>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Drag &amp; drop assets here</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Add product photo, logo, background, reference image, and other visuals. Toggle “Use as reference” per asset.
                  </p>
                </div>

                {assets.length ? (
                  <div className="mt-4 space-y-2">
                    {assets.map(a => (
                      <div key={a.id} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3">
                        <div className="flex items-start gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={a.url} alt={a.name} className="h-14 w-14 rounded-xl object-cover border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{a.name}</p>
                            <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2">
                              <select
                                value={a.assetType}
                                onChange={e => updateAsset(a.id, { assetType: e.target.value as AssetType })}
                                className="w-full sm:w-auto px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300"
                              >
                                {["Product photo", "Brand logo", "Background image", "Reference image", "Additional material"].map(t => (
                                  <option key={t} value={t}>
                                    {t}
                                  </option>
                                ))}
                              </select>

                              <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                                <input
                                  type="checkbox"
                                  checked={a.useAsReference}
                                  onChange={e => updateAsset(a.id, { useAsReference: e.target.checked })}
                                  className="h-4 w-4 rounded border-slate-300"
                                />
                                Use as reference
                              </label>
                            </div>
                          </div>

                          <button
                            onClick={() => removeAsset(a.id)}
                            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 p-2"
                            aria-label="Remove asset"
                          >
                            <Trash2 className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Image AI Prompt</p>
                  <button onClick={() => setPrompt(initialPrompt)} className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-all">
                    Reset
                  </button>
                </div>
                <textarea
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  rows={7}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 rounded-xl text-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-400/30 focus:bg-white dark:focus:bg-slate-800 transition-all resize-none"
                />
              </div>
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="btn-gradient sm:hidden mt-3 w-full inline-flex items-center justify-center gap-2 text-white text-sm font-semibold px-4 py-2.5 rounded-xl disabled:opacity-70"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                Generate Creative
              </button>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900/70 rounded-2xl p-5 card-shadow border border-slate-200 dark:border-slate-800">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Video Mode</p>
             
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Select
                  label="Video goal"
                  value={videoGoal}
                  onChange={setVideoGoal}
                  options={[
                    "TikTok/Reels short video",
                    "YouTube Shorts",
                    "Product demo",
                    "Brand awareness ad",
                    "Educational explainer",
                    "Testimonial style video",
                  ] as const}
                />
                <Select label="Duration" value={videoDuration} onChange={setVideoDuration} options={["6s", "10s", "15s", "30s", "60s"] as const} />
                <Select
                  label="Video style"
                  value={videoStyle}
                  onChange={setVideoStyle}
                  options={["Fast-paced", "Storytelling", "Cinematic", "UGC style", "Professional", "Motion graphics"] as const}
                />
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Scene Builder</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={regenScenes}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Regenerate Scenes
                    </button>
                    <button
                      onClick={addScene}
                      className="inline-flex items-center gap-2 rounded-xl bg-slate-900 text-white px-3 py-2 text-xs font-semibold hover:bg-slate-800 transition-all"
                    >
                      + Add Scene
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {scenes.map((s, idx) => (
                    <div key={s.id} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Scene {idx + 1}</p>
                          <input
                            value={s.duration}
                            onChange={e => setScenes(prev => prev.map(x => (x.id === s.id ? { ...x, duration: e.target.value } : x)))}
                            className="mt-1 w-full sm:w-40 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300"
                          />
                        </div>
                        <button
                          onClick={() => removeScene(s.id)}
                          className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 p-2"
                          aria-label="Remove scene"
                        >
                          <Trash2 className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                        </button>
                      </div>

                      <div className="mt-3 grid grid-cols-1 gap-3">
                        <TextArea label="Visual direction" value={s.visual} onChange={v => setScenes(prev => prev.map(x => (x.id === s.id ? { ...x, visual: v } : x)))} />
                        <TextArea label="On-screen text" value={s.onScreenText} onChange={v => setScenes(prev => prev.map(x => (x.id === s.id ? { ...x, onScreenText: v } : x)))} />
                        <TextArea label="Voice-over" value={s.voiceOver} onChange={v => setScenes(prev => prev.map(x => (x.id === s.id ? { ...x, voiceOver: v } : x)))} />
                        <TextArea label="CTA / transition note" value={s.note} onChange={v => setScenes(prev => prev.map(x => (x.id === s.id ? { ...x, note: v } : x)))} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Video AI Prompt</p>
                  <button onClick={() => setPrompt(initialPrompt)} className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-all">
                    Reset
                  </button>
                </div>
                <textarea
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  rows={7}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 rounded-xl text-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-400/30 focus:bg-white dark:focus:bg-slate-800 transition-all resize-none"
                />
              </div>
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="btn-gradient sm:hidden mt-3 w-full inline-flex items-center justify-center gap-2 text-white text-sm font-semibold px-4 py-2.5 rounded-xl disabled:opacity-70"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                Generate Creative
              </button>
            </div>
          )}
        </section>

        <section className="lg:col-span-4 space-y-4 order-3">
          <div className="bg-white dark:bg-slate-900/70 rounded-2xl p-5 card-shadow border border-slate-200 dark:border-slate-800">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Preview &amp; Output</p>
                <h2 className="font-semibold text-slate-900 dark:text-slate-100 mt-1">Production-ready results</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {platformLabel(platform)} · {prettyAspect(aspect, customWidth, customHeight)} · {tone}
                </p>
              </div>
              <div className="h-9 w-9 rounded-2xl bg-emerald-50 flex items-center justify-center">
                {creativeType === "image" ? <ImageIcon className="w-4 h-4 text-emerald-600" /> : <Film className="w-4 h-4 text-emerald-600" />}
              </div>
            </div>

            <div className="mt-4">
              {!outputReady && !loading ? (
                <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-6 text-center">
                  <div className="h-12 w-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center mx-auto">
                    <Wand2 className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                  </div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-3">Your preview will appear here</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Click “Generate Creative” to produce studio-ready outputs from your {sourceLabel}.
                  </p>
                </div>
              ) : null}

              {loading ? (
                <div className="space-y-3">
                  <div className={cn("rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden relative w-full", aspectClass(aspect))}>
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-purple-100 to-slate-100 animate-pulse" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="inline-flex items-center gap-2 rounded-xl bg-white/80 border border-white px-4 py-2 text-sm font-semibold text-slate-700">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        AI is generating your creative…
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {[90, 70, 85, 60].map((w, i) => (
                      <div key={i} className="skeleton h-3 rounded-lg" style={{ width: `${w}%` }} />
                    ))}
                  </div>
                </div>
              ) : null}

              {outputReady && !loading ? (
                <div className="fade-in">
                  <div className={cn("rounded-2xl border border-slate-200 overflow-hidden relative w-full", aspectClass(aspect))}>
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-slate-900" />
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_20%,white,transparent_35%),radial-gradient(circle_at_70%_70%,white,transparent_40%)]" />
                    <div className="absolute inset-0 p-4 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-white/90 rounded-full bg-white/10 border border-white/15 px-3 py-1">
                          {creativeType === "image" ? "Generated Image Preview" : "Mock Video Preview"}
                        </span>
                        <span className="text-xs font-semibold text-white/80">{prettyAspect(aspect, customWidth, customHeight)}</span>
                      </div>

                      {creativeType === "video" ? (
                        <div className="rounded-2xl bg-white/10 border border-white/15 p-4 backdrop-blur-sm">
                          <p className="text-sm font-semibold text-white">Timeline</p>
                          <div className="mt-2 h-2 rounded-full bg-white/15 overflow-hidden">
                            <div className="h-full w-2/3 bg-white/50 rounded-full" />
                          </div>
                          <p className="text-xs text-white/80 mt-2">Scenes: {scenes.length} · Style: {videoStyle}</p>
                        </div>
                      ) : (
                        <div className="rounded-2xl bg-white/10 border border-white/15 p-4 backdrop-blur-sm">
                          <p className="text-xs font-semibold text-white/80">Overlay copy</p>
                          <p className="text-sm font-semibold text-white mt-1 whitespace-pre-line">{generatedImage.overlayCopy}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <TabButton active={activeTab === "output"} onClick={() => setActiveTab("output")} label="Output" />
                    <TabButton active={activeTab === "prompt"} onClick={() => setActiveTab("prompt")} label="Prompt" />
                    {creativeType === "video" ? (
                      <>
                        <TabButton active={activeTab === "script"} onClick={() => setActiveTab("script")} label="Script" />
                        <TabButton active={activeTab === "scenes"} onClick={() => setActiveTab("scenes")} label="Scenes" />
                      </>
                    ) : null}
                  </div>

                  <div className="mt-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4">
                    {creativeType === "image" ? (
                      activeTab === "prompt" ? (
                        <pre className="text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">{generatedImage.prompt}</pre>
                      ) : (
                        <div className="space-y-3">
                          <OutputRow label="Generated from" value={sourceLabel} />
                          <OutputRow label="Suggested headline" value={generatedImage.headline} />
                          <OutputRow label="Suggested overlay copy" value={generatedImage.overlayCopy} pre />
                          <OutputRow label="Suggested caption" value={generatedImage.caption} pre />
                          <OutputRow label="CTA" value={generatedImage.cta} />
                          <OutputRow label="Design direction" value={generatedImage.direction} pre />
                        </div>
                      )
                    ) : activeTab === "prompt" ? (
                      <pre className="text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">{generatedVideo.prompt}</pre>
                    ) : activeTab === "script" ? (
                      <pre className="text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">{generatedVideo.script}</pre>
                    ) : activeTab === "scenes" ? (
                      <pre className="text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">{generatedVideo.scenes}</pre>
                    ) : (
                      <div className="space-y-3">
                        <OutputRow label="Generated from" value={sourceLabel} />
                        <OutputRow label="Caption overlay" value={generatedVideo.captionOverlay} pre />
                        <OutputRow label="Suggested music/mood" value={generatedVideo.musicMood} />
                        <OutputRow label="CTA" value={generatedVideo.cta} />
                        <OutputRow label="Final caption" value={generatedVideo.finalCaption} pre />
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button onClick={handleCopy} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 text-white px-3 py-2 text-xs font-semibold hover:bg-slate-800 transition-all">
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? "Copied!" : "Copy"}
                    </button>
                    <button onClick={handleRegenerate} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all">
                      <RefreshCw className="w-4 h-4" />
                      Regenerate
                    </button>
                    <button onClick={handleDownload} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all">
                      {downloaded ? <Check className="w-4 h-4 text-emerald-600" /> : <Download className="w-4 h-4" />}
                      {downloaded ? "Downloaded" : creativeType === "image" ? "Download Mock Image" : "Download Mock Video"}
                    </button>
                    <button onClick={handleSaveCreative} className="inline-flex items-center gap-2 rounded-xl bg-blue-50 hover:bg-blue-100 px-3 py-2 text-xs font-semibold text-blue-700 transition-all">
                      {saved ? <Check className="w-4 h-4 text-emerald-600" /> : <BookmarkPlus className="w-4 h-4" />}
                      {saved ? "Saved" : "Save Creative"}
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      </div>

      <div className="fixed bottom-4 left-4 right-4 lg:left-[calc(var(--sidebar-width)+1rem)] lg:right-6 z-30">
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
              Studio mode: <span className="text-slate-600 dark:text-slate-300">{creativeType === "image" ? "Image/Photo" : "Video"}</span> ·{" "}
              <span className="text-slate-600 dark:text-slate-300">{platformLabel(platform)}</span> ·{" "}
              <span className="text-slate-600 dark:text-slate-300">{prettyAspect(aspect, customWidth, customHeight)}</span>
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Saved creatives can later be tracked in Marketing Dashboard.</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => onNavigate?.("draft")}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Marketing Draft
            </button>
            <button
              onClick={handleSaveCreative}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all"
            >
              {saved ? <Check className="w-4 h-4 text-emerald-600" /> : <BookmarkPlus className="w-4 h-4" />}
              {saved ? "Saved" : "Save Creative"}
            </button>
            <button
              onClick={handleExport}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all"
            >
              {exported ? <Check className="w-4 h-4 text-emerald-600" /> : <ArrowRight className="w-4 h-4" />}
              {exported ? "Exported" : "Export"}
            </button>
            <button onClick={handleSendToDashboard} className="btn-gradient inline-flex items-center justify-center gap-2 text-white text-xs font-semibold px-4 py-2 rounded-xl">
              {sentToDashboard ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              {sentToDashboard ? "Sent" : "Send to Marketing Dashboard"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, clamp }: { label: string; value: string; clamp?: boolean }) {
  return (
    <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 px-4 py-3">
      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">{label}</p>
      <p className={cn("text-xs text-slate-800 dark:text-slate-200 mt-1 leading-relaxed", clamp && "line-clamp-3")}>{value}</p>
    </div>
  );
}

function OutputRow({ label, value, pre }: { label: string; value: string; pre?: boolean }) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className={cn("text-sm text-slate-800 dark:text-slate-200 mt-2 leading-relaxed", pre && "whitespace-pre-line")}>{value}</p>
    </div>
  );
}

function TabButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "shrink-0 px-3 py-2 rounded-xl text-xs font-semibold border transition-all",
        active ? "border-transparent bg-gradient-to-r from-blue-600 to-purple-600 text-white" : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800",
      )}
    >
      {label}
    </button>
  );
}

function Select<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: readonly T[];
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value as T)}
        className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 rounded-xl text-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-400/30 transition-all appearance-none"
      >
        {options.map(o => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">{label}</label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={2}
        className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 rounded-xl text-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-400/30 focus:bg-white dark:focus:bg-slate-800 transition-all resize-none"
      />
    </div>
  );
}

function TextInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">{label}</label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 rounded-xl text-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-400/30 transition-all"
      />
    </div>
  );
}

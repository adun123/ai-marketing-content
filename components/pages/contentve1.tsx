"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, BookmarkPlus, Check, Copy, Download, Film, Image as ImageIcon, Loader2, Sparkles, Trash2, Upload, Wand2 } from "lucide-react";

type Mode = "draft" | "manual";
type ContentType = "image" | "video";
type Platform = "Instagram" | "TikTok" | "YouTube" | "LinkedIn" | "Custom";
type AspectRatio = "1:1" | "4:5" | "9:16" | "16:9" | "Custom";
type StudioStyle = "Professional" | "Friendly" | "Bold" | "Luxury" | "Gen Z";
type ImagePurpose = "Social post" | "Poster" | "Thumbnail" | "Banner" | "Product visual";
type VisualStyle = "Clean corporate" | "Bold colorful" | "Minimal luxury" | "Lifestyle" | "Futuristic AI";
type VideoGoal = "TikTok/Reels" | "Shorts" | "Ads" | "Product demo";
type VideoDuration = "6s" | "10s" | "15s" | "30s" | "60s";
type VideoStyle = "Fast-paced" | "Storytelling" | "UGC" | "Cinematic";

type DraftData = {
  hook: string;
  caption: string;
  cta: string;
  platform: Platform;
  audience: string;
  topic: string;
  goal: string;
};

type ManualInput = {
  topic: string;
  audience: string;
  goal: string;
  keyMessage: string;
  style: StudioStyle;
  additionalInstructions: string;
};

type UploadedAsset = {
  id: string;
  name: string;
  url: string;
  type: "Upload images" | "Add logo" | "Add product photos" | "Add references";
  useAsReference: boolean;
};

type Scene = {
  id: string;
  title: string;
  duration: string;
  visualDirection: string;
  textOverlay: string;
  voiceOver: string;
};

type OutputData = {
  prompt: string;
  headline?: string;
  overlay?: string;
  caption: string;
  cta?: string;
  script?: string;
  sceneBreakdown?: string;
  voiceOver?: string;
};

const platforms: Platform[] = ["Instagram", "TikTok", "YouTube", "LinkedIn", "Custom"];
const ratios: AspectRatio[] = ["1:1", "4:5", "9:16", "16:9", "Custom"];
const studioStyles: StudioStyle[] = ["Professional", "Friendly", "Bold", "Luxury", "Gen Z"];
const imagePurposes: ImagePurpose[] = ["Social post", "Poster", "Thumbnail", "Banner", "Product visual"];
const visualStyles: VisualStyle[] = ["Clean corporate", "Bold colorful", "Minimal luxury", "Lifestyle", "Futuristic AI"];
const videoGoals: VideoGoal[] = ["TikTok/Reels", "Shorts", "Ads", "Product demo"];
const videoDurations: VideoDuration[] = ["6s", "10s", "15s", "30s", "60s"];
const videoStyles: VideoStyle[] = ["Fast-paced", "Storytelling", "UGC", "Cinematic"];

const mockDraft: DraftData = {
  hook: "POV: your skincare routine finally adapts to your real skin condition.",
  caption: "Meet GlowRoutine AI. It checks your daily skin signals and builds the right routine every day.",
  cta: "Try GlowRoutine AI for free today.",
  platform: "Instagram",
  audience: "Urban Gen Z shoppers (18-25)",
  topic: "AI Personalization for Beauty Ecommerce",
  goal: "Awareness",
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function aspectClass(ratio: AspectRatio) {
  if (ratio === "1:1") return "aspect-square";
  if (ratio === "4:5") return "aspect-[4/5]";
  if (ratio === "9:16") return "aspect-[9/16]";
  if (ratio === "16:9") return "aspect-video";
  return "aspect-[4/5]";
}

function readDraft() {
  try {
    const raw = localStorage.getItem("aiContentDashboard.marketingDraft");
    if (!raw) return { hasDraft: false, data: mockDraft };
    const parsed = JSON.parse(raw) as any;
    return {
      hasDraft: true,
      data: {
        hook: parsed?.draft?.hooks?.[0]?.text ?? mockDraft.hook,
        caption: parsed?.draft?.captions?.primary ?? mockDraft.caption,
        cta: parsed?.draft?.ctas?.[0] ?? mockDraft.cta,
        platform: parsed?.campaign?.platform ?? mockDraft.platform,
        audience: parsed?.importedInsight?.targetAudience ?? mockDraft.audience,
        topic: parsed?.importedInsight?.trendTopic ?? mockDraft.topic,
        goal: parsed?.campaign?.goal ?? mockDraft.goal,
      } as DraftData,
    };
  } catch {
    return { hasDraft: false, data: mockDraft };
  }
}

export default function ContentPage({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const [mode, setMode] = useState<Mode>("manual");
  const [hasImportedDraft, setHasImportedDraft] = useState(false);
  const [draftData, setDraftData] = useState<DraftData>(mockDraft);

  const [contentType, setContentType] = useState<ContentType>("image");
  const [platform, setPlatform] = useState<Platform>("Instagram");
  const [ratio, setRatio] = useState<AspectRatio>("9:16");
  const [customSize, setCustomSize] = useState({ width: 1080, height: 1350 });
  const [style, setStyle] = useState<StudioStyle>("Professional");

  const [manualInput, setManualInput] = useState<ManualInput>({
    topic: "",
    audience: "",
    goal: "",
    keyMessage: "",
    style: "Professional",
    additionalInstructions: "",
  });

  const [imagePurpose, setImagePurpose] = useState<ImagePurpose>("Social post");
  const [visualStyle, setVisualStyle] = useState<VisualStyle>("Clean corporate");
  const [videoGoal, setVideoGoal] = useState<VideoGoal>("TikTok/Reels");
  const [videoDuration, setVideoDuration] = useState<VideoDuration>("15s");
  const [videoStyle, setVideoStyle] = useState<VideoStyle>("Fast-paced");
  const [scenes, setScenes] = useState<Scene[]>([]);

  const [assets, setAssets] = useState<UploadedAsset[]>([]);
  const [imagePrompt, setImagePrompt] = useState("");
  const [videoPrompt, setVideoPrompt] = useState("");

  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<OutputData | null>(null);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [sent, setSent] = useState(false);

  const uploadRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const { hasDraft, data } = readDraft();
    setHasImportedDraft(hasDraft);
    setDraftData(data);
    setMode(hasDraft ? "draft" : "manual");
    setPlatform(data.platform);
    setManualInput(prev => ({
      ...prev,
      topic: prev.topic || data.topic,
      audience: prev.audience || data.audience,
      goal: prev.goal || data.goal,
      keyMessage: prev.keyMessage || data.hook,
    }));
    setScenes([
      {
        id: `scene-${Date.now()}`,
        title: "Hook scene",
        duration: "0-4s",
        visualDirection: "Fast close-up shots with text pop animation.",
        textOverlay: data.hook,
        voiceOver: "Start with a bold hook and a visual pattern interrupt.",
      },
      {
        id: `scene-${Date.now() + 1}`,
        title: "Solution scene",
        duration: "4-11s",
        visualDirection: "Show product in action with split-screen before/after.",
        textOverlay: "Smarter routine, better results.",
        voiceOver: "Explain the solution in one short sentence.",
      },
      {
        id: `scene-${Date.now() + 2}`,
        title: "CTA scene",
        duration: "11-15s",
        visualDirection: "Clean end card, logo, and CTA button style.",
        textOverlay: data.cta,
        voiceOver: "Close with a clear CTA and brand lockup.",
      },
    ]);
  }, []);

  const sourceTopic = mode === "draft" ? draftData.topic : manualInput.topic;
  const sourceAudience = mode === "draft" ? draftData.audience : manualInput.audience;
  const sourceGoal = mode === "draft" ? draftData.goal : manualInput.goal;
  const sourceHook = mode === "draft" ? draftData.hook : manualInput.keyMessage;
  const sourceCaption = mode === "draft" ? draftData.caption : manualInput.additionalInstructions || `${manualInput.keyMessage}.`;
  const sourceCTA = mode === "draft" ? draftData.cta : "Learn more today.";

  const defaultPrompt = useMemo(() => {
    const size = ratio === "Custom" ? `${customSize.width}x${customSize.height}` : ratio;
    const base = [
      `Topic: ${sourceTopic || "N/A"}`,
      `Audience: ${sourceAudience || "N/A"}`,
      `Goal: ${sourceGoal || "N/A"}`,
      `Platform: ${platform}`,
      `Content type: ${contentType}`,
      `Format: ${size}`,
      `Tone: ${style}`,
      `Core message: ${sourceHook || "N/A"}`,
    ].join("\n");
    if (contentType === "image") {
      return `${base}\nImage purpose: ${imagePurpose}\nVisual style: ${visualStyle}\nCreate a publish-ready visual concept with headline, overlay, and caption.`;
    }
    return `${base}\nVideo goal: ${videoGoal}\nDuration: ${videoDuration}\nVideo style: ${videoStyle}\nCreate script, scenes, and voice-over for short-form video.`;
  }, [contentType, customSize.height, customSize.width, imagePurpose, platform, ratio, sourceAudience, sourceGoal, sourceHook, sourceTopic, style, videoDuration, videoGoal, videoStyle, visualStyle]);

  useEffect(() => {
    if (!imagePrompt) setImagePrompt(defaultPrompt);
    if (!videoPrompt) setVideoPrompt(defaultPrompt);
  }, [defaultPrompt, imagePrompt, videoPrompt]);

  useEffect(() => {
    return () => {
      assets.forEach(asset => URL.revokeObjectURL(asset.url));
    };
  }, [assets]);

  const emptyStateText = mode === "draft" ? "Import a draft to generate content." : "Fill in the form to create your content.";
  const activePrompt = contentType === "image" ? imagePrompt : videoPrompt;

  const createOutput = (): OutputData => {
    if (contentType === "image") {
      return {
        prompt: activePrompt,
        headline: `${sourceTopic} for ${platform}`,
        overlay: `${sourceHook}\n${sourceCTA}`,
        caption: `${sourceCaption}\n\n${sourceCTA}`,
        cta: sourceCTA,
      };
    }
    return {
      prompt: activePrompt,
      caption: `${sourceCaption}\n\n${sourceCTA}`,
      script: `Hook: ${sourceHook}\nCore Value: ${sourceTopic}\nCTA: ${sourceCTA}`,
      sceneBreakdown: scenes.map((scene, idx) => `Scene ${idx + 1} - ${scene.title}\nDuration: ${scene.duration}\nVisual: ${scene.visualDirection}\nText: ${scene.textOverlay}`).join("\n\n"),
      voiceOver: scenes.map((scene, idx) => `Scene ${idx + 1}: ${scene.voiceOver}`).join("\n"),
    };
  };

  const handleGenerate = () => {
    setLoading(true);
    setOutput(null);
    setCopied(false);
    setSaved(false);
    setDownloaded(false);
    setSent(false);
    setTimeout(() => {
      setLoading(false);
      setOutput(createOutput());
    }, 1400);
  };

  const handleCopy = () => {
    if (!output) return;
    const text = contentType === "image" ? `${output.headline}\n${output.overlay}\n${output.caption}\n\nPrompt:\n${output.prompt}` : `${output.script}\n\n${output.sceneBreakdown}\n\n${output.voiceOver}\n\nPrompt:\n${output.prompt}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const handleDownload = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 1500);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const handleSendToDashboard = () => {
    setSent(true);
    setTimeout(() => setSent(false), 1200);
    onNavigate?.("dashboard");
  };

  const onModeChange = (nextMode: Mode) => {
    if (mode === "draft" && nextMode === "manual") {
      setManualInput(prev => ({
        ...prev,
        topic: prev.topic || draftData.topic,
        audience: prev.audience || draftData.audience,
        goal: prev.goal || draftData.goal,
        keyMessage: prev.keyMessage || draftData.hook,
      }));
    }
    setMode(nextMode);
  };

  const addScene = () => {
    setScenes(prev => [
      ...prev,
      {
        id: `scene-${Date.now()}-${prev.length}`,
        title: `Scene ${prev.length + 1}`,
        duration: "3-5s",
        visualDirection: "",
        textOverlay: "",
        voiceOver: "",
      },
    ]);
  };

  const removeScene = (id: string) => setScenes(prev => prev.filter(scene => scene.id !== id));

  const addAssets = (files: FileList | null) => {
    if (!files) return;
    const nextAssets: UploadedAsset[] = [];
    Array.from(files).forEach(file => {
      if (!file.type.startsWith("image/")) return;
      nextAssets.push({
        id: `${file.name}-${file.size}-${file.lastModified}`,
        name: file.name,
        url: URL.createObjectURL(file),
        type: "Upload images",
        useAsReference: true,
      });
    });
    setAssets(prev => [...prev, ...nextAssets].slice(0, 12));
  };

  return (
    <div className="pb-24 space-y-6 fade-in bg-[#F8FAFC] dark:bg-slate-950">
      <header className="rounded-3xl bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 shadow-sm p-5 md:p-7">
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
          <span className="rounded-full border border-[#E2E8F0] dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1 text-slate-600 dark:text-slate-300">Step 3 of 3: Create</span>
        </div>
        <h1 className="mt-3 text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">Content Generation</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Create ready-to-publish image or video content using AI.</p>
      </header>

      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 p-2 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            onClick={() => onModeChange("draft")}
            className={cn(
              "rounded-2xl px-4 py-3 text-sm font-semibold transition-all min-h-[56px]",
              mode === "draft"
                ? "bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white shadow"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800",
            )}
          >
            <span className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2">
              Use Marketing Draft
              <span className="rounded-full bg-white/20 sm:bg-white/20 px-2 py-0.5 text-[10px]">Recommended</span>
            </span>
          </button>
          <button
            onClick={() => onModeChange("manual")}
            className={cn(
              "rounded-2xl px-4 py-3 text-sm font-semibold transition-all min-h-[56px]",
              mode === "manual"
                ? "bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white shadow"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800",
            )}
          >
            Start from Scratch
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
        <aside className="lg:col-span-3 space-y-5">
          {mode === "draft" ? (
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 p-5 shadow-sm space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Source Draft</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Imported from Marketing Draft</p>
                </div>
                <Sparkles className="w-4 h-4 text-blue-600" />
              </div>
              <InfoRow label="Hook" value={draftData.hook} />
              <InfoRow label="Caption" value={draftData.caption} clamp />
              <InfoRow label="CTA" value={draftData.cta} />
              <InfoRow label="Platform" value={draftData.platform} />
              <InfoRow label="Audience" value={draftData.audience} />
              <button onClick={() => onNavigate?.("draft")} className="w-full rounded-xl border border-[#E2E8F0] dark:border-slate-700 px-3 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
                Change Draft
              </button>
            </div>
          ) : (
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Manual Input</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">No draft required. Build your creative from scratch.</p>
            </div>
          )}
        </aside>

        <section className="lg:col-span-5 space-y-5">
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 p-5 shadow-sm space-y-4">
            {mode === "manual" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InputField label="Topic / Product Name" value={manualInput.topic} onChange={v => setManualInput(prev => ({ ...prev, topic: v }))} />
                <InputField label="Target audience" value={manualInput.audience} onChange={v => setManualInput(prev => ({ ...prev, audience: v }))} />
                <InputField label="Content goal" value={manualInput.goal} onChange={v => setManualInput(prev => ({ ...prev, goal: v }))} />
                <SelectField label="Platform" value={platform} options={platforms} onChange={setPlatform} />
                <SelectField label="Content Type" value={contentType} options={["image", "video"]} onChange={setContentType} />
                <InputField label="Key message" value={manualInput.keyMessage} onChange={v => setManualInput(prev => ({ ...prev, keyMessage: v }))} />
                <SelectField label="Tone / style" value={style} options={studioStyles} onChange={v => {
                  setStyle(v);
                  setManualInput(prev => ({ ...prev, style: v }));
                }} />
                <TextAreaField label="Additional instructions" value={manualInput.additionalInstructions} onChange={v => setManualInput(prev => ({ ...prev, additionalInstructions: v }))} rows={4} />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <SelectField label="Content Type" value={contentType} options={["image", "video"]} onChange={setContentType} />
                <SelectField label="Platform" value={platform} options={platforms} onChange={setPlatform} />
                <SelectField label="Format size" value={ratio} options={ratios} onChange={setRatio} />
                <SelectField label="Style / tone" value={style} options={studioStyles} onChange={setStyle} />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <SelectField label="Platform Selector" value={platform} options={platforms} onChange={setPlatform} />
              <SelectField label="Format / Aspect Ratio" value={ratio} options={ratios} onChange={setRatio} />
              <SelectField label="Style Selector" value={style} options={studioStyles} onChange={setStyle} />
              {ratio === "Custom" ? (
                <div className="grid grid-cols-2 gap-2">
                  <InputField label="W" value={String(customSize.width)} onChange={v => setCustomSize(prev => ({ ...prev, width: Number(v) || 0 }))} />
                  <InputField label="H" value={String(customSize.height)} onChange={v => setCustomSize(prev => ({ ...prev, height: Number(v) || 0 }))} />
                </div>
              ) : null}
            </div>
          </div>

          {contentType === "image" ? (
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 p-5 shadow-sm space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <SelectField label="Image Purpose" value={imagePurpose} options={imagePurposes} onChange={setImagePurpose} />
                <SelectField label="Visual Style" value={visualStyle} options={visualStyles} onChange={setVisualStyle} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Manual Asset Upload</p>
                  <button onClick={() => uploadRef.current?.click()} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 text-white px-3 py-2 text-xs font-semibold">
                    <Upload className="w-4 h-4" />
                    Upload
                  </button>
                </div>
                <input ref={uploadRef} type="file" multiple accept="image/*" className="hidden" onChange={e => addAssets(e.target.files)} />
                <div className="rounded-2xl border border-dashed border-[#E2E8F0] dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4 text-xs text-slate-600 dark:text-slate-300">Upload images, logos, product photos, and references.</div>
                <div className="mt-3 space-y-2">
                  {assets.map(asset => (
                    <div key={asset.id} className="rounded-2xl border border-[#E2E8F0] dark:border-slate-700 bg-white dark:bg-slate-900 p-3 flex items-start gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={asset.url} alt={asset.name} className="h-12 w-12 rounded-xl object-cover border border-[#E2E8F0] dark:border-slate-700" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">{asset.name}</p>
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <select value={asset.type} onChange={e => setAssets(prev => prev.map(item => (item.id === asset.id ? { ...item, type: e.target.value as UploadedAsset["type"] } : item)))} className="rounded-xl border border-[#E2E8F0] dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-1.5 text-xs text-slate-700 dark:text-slate-200">
                            {["Upload images", "Add logo", "Add product photos", "Add references"].map(option => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                          <label className="inline-flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                            <input type="checkbox" checked={asset.useAsReference} onChange={e => setAssets(prev => prev.map(item => (item.id === asset.id ? { ...item, useAsReference: e.target.checked } : item)))} />
                            Use as reference
                          </label>
                        </div>
                      </div>
                      <button onClick={() => setAssets(prev => prev.filter(item => item.id !== asset.id))} className="rounded-lg border border-[#E2E8F0] dark:border-slate-700 p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800">
                        <Trash2 className="h-4 w-4 text-slate-500 dark:text-slate-300" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <TextAreaField label="Image AI Prompt" value={imagePrompt} onChange={setImagePrompt} rows={6} />
            </div>
          ) : (
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 p-5 shadow-sm space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <SelectField label="Video Goal" value={videoGoal} options={videoGoals} onChange={setVideoGoal} />
                <SelectField label="Duration" value={videoDuration} options={videoDurations} onChange={setVideoDuration} />
                <SelectField label="Style" value={videoStyle} options={videoStyles} onChange={setVideoStyle} />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Scene Builder</p>
                  <button onClick={addScene} className="rounded-xl bg-slate-900 text-white text-xs font-semibold px-3 py-2">
                    Add Scene
                  </button>
                </div>
                {scenes.map((scene, index) => (
                  <div key={scene.id} className="rounded-2xl border border-[#E2E8F0] dark:border-slate-700 p-3 bg-white dark:bg-slate-900 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">Scene {index + 1}</p>
                      <button onClick={() => removeScene(scene.id)} className="text-xs text-slate-500 dark:text-slate-400">
                        Remove
                      </button>
                    </div>
                    <InputField label="Scene title" value={scene.title} onChange={v => setScenes(prev => prev.map(item => (item.id === scene.id ? { ...item, title: v } : item)))} />
                    <InputField label="Duration" value={scene.duration} onChange={v => setScenes(prev => prev.map(item => (item.id === scene.id ? { ...item, duration: v } : item)))} />
                    <TextAreaField label="Visual direction" value={scene.visualDirection} onChange={v => setScenes(prev => prev.map(item => (item.id === scene.id ? { ...item, visualDirection: v } : item)))} rows={2} />
                    <TextAreaField label="Text overlay" value={scene.textOverlay} onChange={v => setScenes(prev => prev.map(item => (item.id === scene.id ? { ...item, textOverlay: v } : item)))} rows={2} />
                    <TextAreaField label="Voice-over" value={scene.voiceOver} onChange={v => setScenes(prev => prev.map(item => (item.id === scene.id ? { ...item, voiceOver: v } : item)))} rows={2} />
                  </div>
                ))}
              </div>
              <TextAreaField label="Video AI Prompt" value={videoPrompt} onChange={setVideoPrompt} rows={6} />
            </div>
          )}
        </section>

        <section className="md:col-span-2 lg:col-span-4 space-y-5">
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Output Panel</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{platform} · {ratio === "Custom" ? `${customSize.width}x${customSize.height}` : ratio} · {style}</p>
              </div>
              {contentType === "image" ? <ImageIcon className="w-4 h-4 text-blue-600" /> : <Film className="w-4 h-4 text-blue-600" />}
            </div>

            <button onClick={handleGenerate} disabled={loading} className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#7C3AED] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-70">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
              Generate Creative
            </button>

            {!loading && !output ? (
              <div className="rounded-2xl border border-dashed border-[#E2E8F0] dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-6 text-center">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{emptyStateText}</p>
              </div>
            ) : null}

            {loading ? (
              <div className="space-y-3">
                <div className={cn("rounded-2xl border border-[#E2E8F0] dark:border-slate-700 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-slate-800 dark:to-slate-700 animate-pulse", aspectClass(ratio))} />
                {[80, 95, 65].map(width => (
                  <div key={width} className="h-3 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" style={{ width: `${width}%` }} />
                ))}
              </div>
            ) : null}

            {output ? (
              <div className="space-y-3">
                <div className={cn("rounded-2xl border border-[#E2E8F0] dark:border-slate-700 relative overflow-hidden", aspectClass(ratio))}>
                  <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB] to-[#7C3AED]" />
                  <div className="absolute inset-0 p-4 text-white">
                    <p className="text-xs font-semibold">{contentType === "image" ? "Image preview (mock)" : "Video preview (mock)"}</p>
                  </div>
                </div>
                {contentType === "image" ? (
                  <div className="space-y-2">
                    <OutputRow label="Headline text" value={output.headline ?? "-"} />
                    <OutputRow label="Overlay text" value={output.overlay ?? "-"} pre />
                    <OutputRow label="Caption" value={output.caption} pre />
                    <OutputRow label="CTA" value={output.cta ?? "-"} />
                    <OutputRow label="Prompt" value={output.prompt} pre />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <OutputRow label="Script" value={output.script ?? "-"} pre />
                    <OutputRow label="Scene breakdown" value={output.sceneBreakdown ?? "-"} pre />
                    <OutputRow label="Voice-over" value={output.voiceOver ?? "-"} pre />
                    <OutputRow label="Caption" value={output.caption} pre />
                    <OutputRow label="Prompt" value={output.prompt} pre />
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  <button onClick={handleGenerate} className="rounded-xl border border-[#E2E8F0] dark:border-slate-700 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200">Regenerate</button>
                  <button onClick={handleCopy} className="rounded-xl border border-[#E2E8F0] dark:border-slate-700 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 inline-flex items-center gap-1">
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                  <button onClick={handleDownload} className="rounded-xl border border-[#E2E8F0] dark:border-slate-700 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 inline-flex items-center gap-1">
                    {downloaded ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
                    {downloaded ? "Downloaded" : "Download"}
                  </button>
                  <button onClick={handleSave} className="rounded-xl bg-blue-50 dark:bg-blue-900/30 px-3 py-2 text-xs font-semibold text-blue-700 dark:text-blue-300 inline-flex items-center gap-1">
                    {saved ? <Check className="w-3.5 h-3.5" /> : <BookmarkPlus className="w-3.5 h-3.5" />}
                    {saved ? "Saved" : "Save Creative"}
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </div>

      <div className="fixed bottom-4 left-4 right-4 lg:left-[calc(var(--sidebar-width)+1rem)] lg:right-6 z-30">
        <div className="rounded-2xl border border-[#E2E8F0] dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm p-4 shadow-lg flex flex-col sm:flex-row sm:items-center gap-3">
          <p className="text-xs text-slate-600 dark:text-slate-300 flex-1">This content is generated from your draft or manual input.</p>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => onNavigate?.("draft")} className="inline-flex items-center gap-2 rounded-xl border border-[#E2E8F0] dark:border-slate-700 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
              <ArrowLeft className="w-4 h-4" />
              Back to Draft
            </button>
            <button onClick={handleSave} className="rounded-xl border border-[#E2E8F0] dark:border-slate-700 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200">Save</button>
            <button onClick={handleSendToDashboard} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#7C3AED] px-3 py-2 text-xs font-semibold text-white">
              {sent ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              {sent ? "Sent" : "Send to Dashboard"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-[#E2E8F0] dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500/30"
      />
    </div>
  );
}

function SelectField<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: readonly T[]; onChange: (value: T) => void }) {
  return (
    <div>
      <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value as T)}
        className="mt-1 w-full rounded-xl border border-[#E2E8F0] dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500/30"
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

function TextAreaField({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <div className="sm:col-span-2">
      <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={rows}
        className="mt-1 w-full rounded-xl border border-[#E2E8F0] dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500/30 resize-none"
      />
    </div>
  );
}

function InfoRow({ label, value, clamp }: { label: string; value: string; clamp?: boolean }) {
  return (
    <div className="rounded-xl border border-[#E2E8F0] dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
      <p className={cn("mt-1 text-xs text-slate-700 dark:text-slate-200 leading-relaxed", clamp && "line-clamp-3")}>{value}</p>
    </div>
  );
}

function OutputRow({ label, value, pre }: { label: string; value: string; pre?: boolean }) {
  return (
    <div className="rounded-xl border border-[#E2E8F0] dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
      <p className={cn("mt-1 text-xs text-slate-700 dark:text-slate-200 leading-relaxed", pre && "whitespace-pre-line")}>{value}</p>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";

type TourStep = {
  targetId: string;
  title: string;
  description: string;
};

type GuidedTourProps = {
  isOpen: boolean;
  steps: TourStep[];
  accentClassName?: string;
  onClose: (completed: boolean) => void;
};

type Rect = { top: number; left: number; width: number; height: number };

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export default function GuidedTour({ isOpen, steps, accentClassName = "from-blue-600 to-purple-600", onClose }: GuidedTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);

  const activeStep = steps[currentStep];

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      setRect(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !activeStep) return;

    const updateRect = () => {
      const element = document.getElementById(activeStep.targetId);
      if (!element) {
        setRect(null);
        return;
      }
      const box = element.getBoundingClientRect();
      const padding = 8;
      setRect({
        top: Math.max(8, box.top - padding),
        left: Math.max(8, box.left - padding),
        width: box.width + padding * 2,
        height: box.height + padding * 2,
      });
    };

    const target = document.getElementById(activeStep.targetId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
    }

    updateRect();
    const delayed = window.setTimeout(updateRect, 260);
    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, true);
    return () => {
      window.clearTimeout(delayed);
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect, true);
    };
  }, [activeStep, isOpen]);

  const tooltipStyle = useMemo(() => {
    if (!rect) return { top: 80, left: 16 };
    if (typeof window === "undefined") return { top: rect.top + rect.height + 14, left: rect.left, width: 320 };
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;
    const isMobile = viewportW < 768;
    const cardWidth = isMobile ? viewportW - 32 : 320;
    const cardHeightEstimate = 220;
    const preferredTop = rect.top + rect.height + 14;
    const fallbackTop = rect.top - cardHeightEstimate - 14;
    const topUnclamped = preferredTop + cardHeightEstimate > viewportH ? fallbackTop : preferredTop;
    const top = clamp(topUnclamped, 12, Math.max(12, viewportH - cardHeightEstimate - 12));
    const left = isMobile ? 16 : clamp(rect.left, 16, viewportW - cardWidth - 16);
    return { top, left, width: cardWidth };
  }, [rect]);

  if (!isOpen || !activeStep) return null;

  const total = steps.length;
  const isLast = currentStep === total - 1;

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-slate-950/70 transition-opacity duration-300" />

      {rect ? (
        <div
          className="absolute rounded-2xl border-2 border-blue-400/90 shadow-[0_0_0_9999px_rgba(2,6,23,0.65)] transition-all duration-300 pointer-events-none"
          style={{ top: rect.top, left: rect.left, width: rect.width, height: rect.height }}
        />
      ) : null}

      <div
        className="absolute rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl p-4 w-[320px] max-w-[calc(100vw-2rem)] transition-all duration-300"
        style={tooltipStyle}
      >
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className={`inline-flex items-center rounded-full bg-gradient-to-r ${accentClassName} text-white text-[11px] font-semibold px-2.5 py-1`}>
            {currentStep + 1}/{total}
          </span>
          <button
            type="button"
            onClick={() => onClose(false)}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          >
            Lewati
          </button>
        </div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{activeStep.title}</h3>
        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{activeStep.description}</p>

        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => onClose(false)}
            className="rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Lewati
          </button>
          <button
            type="button"
            onClick={() => {
              if (isLast) {
                onClose(true);
                return;
              }
              setCurrentStep((prev) => prev + 1);
            }}
            className={`rounded-xl bg-gradient-to-r ${accentClassName} px-3 py-2 text-xs font-semibold text-white`}
          >
            {isLast ? "Selesai" : "Lanjut"}
          </button>
        </div>
      </div>
    </div>
  );
}

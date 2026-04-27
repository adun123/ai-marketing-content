"use client";
import { useState } from "react";
import { Save, Key, Moon, Sun, Building, Users, Palette, Check } from "lucide-react";

const tones = ["Professional", "Casual", "Bold", "Inspiring", "Playful"];
const industries = ["E-Commerce", "SaaS / Tech", "Fashion & Lifestyle", "Health & Wellness", "Finance", "Education", "Food & Beverage", "Real Estate"];

export default function SettingsPage() {
  const [brand, setBrand] = useState({ name: "Acme Corp", industry: "SaaS / Tech", tone: "Professional", audience: "B2B professionals and decision makers, ages 28–45" });
  const [darkMode, setDarkMode] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 fade-in max-w-3xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Configure your brand profile and AI preferences</p>
      </div>

      {/* Brand Profile */}
      <div className="bg-white dark:bg-slate-900/70 rounded-2xl p-6 card-shadow border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
            <Building className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-800 dark:text-slate-100">Brand Profile</h2>
            <p className="text-xs text-slate-400 dark:text-slate-500">This information helps AI generate on-brand content</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Company Name</label>
            <input
              type="text"
              value={brand.name}
              onChange={e => setBrand({...brand, name: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 rounded-xl text-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-400/30 focus:bg-white dark:focus:bg-slate-800 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Industry</label>
            <select
              value={brand.industry}
              onChange={e => setBrand({...brand, industry: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 rounded-xl text-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-400/30 transition-all appearance-none"
            >
              {industries.map(i => <option key={i}>{i}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wide">Brand Tone</label>
            <div className="flex flex-wrap gap-2">
              {tones.map(t => (
                <button key={t} onClick={() => setBrand({...brand, tone: t})}
                  className={`text-xs font-medium px-3.5 py-1.5 rounded-xl border transition-all ${brand.tone === t ? "gradient-bg text-white border-transparent" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600"}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Target Audience</label>
            <textarea
              value={brand.audience}
              onChange={e => setBrand({...brand, audience: e.target.value})}
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 rounded-xl text-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-400/30 focus:bg-white dark:focus:bg-slate-800 transition-all resize-none"
            />
          </div>
        </div>
      </div>

      {/* AI Settings */}
      <div className="bg-white dark:bg-slate-900/70 rounded-2xl p-6 card-shadow border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
            <Key className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-800 dark:text-slate-100">AI Settings</h2>
            <p className="text-xs text-slate-400 dark:text-slate-500">Configure your AI model preferences</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">API Key</label>
              <span className="text-xs font-medium bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 px-2.5 py-0.5 rounded-full">Coming soon with backend</span>
            </div>
            <input
              type="password"
              disabled
              placeholder="••••••••••••••••••••••••••••••"
              className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
            />
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">Connect your API key to enable real AI generation. Backend integration coming soon.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">AI Model</label>
              <select disabled className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed appearance-none">
                <option>Claude 3.5 Sonnet (coming soon)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Language</label>
              <select className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 rounded-xl text-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-400/30 transition-all appearance-none">
                <option>English</option>
                <option>Bahasa Indonesia</option>
                <option>Spanish</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Theme */}
      <div className="bg-white dark:bg-slate-900/70 rounded-2xl p-6 card-shadow border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <Palette className="w-4 h-4 text-slate-600 dark:text-slate-300" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-800 dark:text-slate-100">Theme Settings</h2>
            <p className="text-xs text-slate-400 dark:text-slate-500">Customize your workspace appearance</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {darkMode ? <Moon className="w-5 h-5 text-slate-600 dark:text-slate-300" /> : <Sun className="w-5 h-5 text-amber-500" />}
            <div>
              <div className="text-sm font-medium text-slate-800 dark:text-slate-100">{darkMode ? "Dark Mode" : "Light Mode"}</div>
              <div className="text-xs text-slate-400 dark:text-slate-500">{darkMode ? "Easy on the eyes in low light" : "Clean, bright workspace"}</div>
            </div>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`relative w-12 h-6 rounded-full transition-colors ${darkMode ? "gradient-bg" : "bg-slate-200"}`}
          >
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${darkMode ? "translate-x-6" : "translate-x-0.5"}`}></span>
          </button>
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end gap-3">
        <button className="text-sm font-medium text-slate-600 dark:text-slate-300 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all">
          Cancel
        </button>
        <button onClick={handleSave} className="btn-gradient flex items-center gap-2 text-white text-sm font-semibold px-6 py-2.5 rounded-xl">
          {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

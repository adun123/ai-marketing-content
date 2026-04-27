"use client";
import { TrendingUp, FileEdit, Sparkles, BarChart3, ArrowRight, FileText, Target, Hash, Activity, Clock, CheckCircle, Zap } from "lucide-react";

interface OverviewPageProps {
  onNavigate: (page: string) => void;
}

const features = [
  { id: "trends", icon: TrendingUp, title: "Trend & Social Insight", desc: "Discover what's trending across platforms and get AI-powered content angles.", bg: "bg-blue-50 dark:bg-blue-500/15", iconColor: "text-blue-600 dark:text-blue-300" },
  { id: "draft", icon: FileEdit, title: "Marketing Draft Generator", desc: "Generate hooks, captions, CTAs, and hashtags tailored to your campaign.", bg: "bg-violet-50 dark:bg-violet-500/15", iconColor: "text-violet-600 dark:text-violet-300" },
  { id: "content", icon: Sparkles, title: "Content Generation", desc: "Create ready-to-publish content for Instagram, TikTok, LinkedIn, and more.", bg: "bg-emerald-50 dark:bg-emerald-500/15", iconColor: "text-emerald-600 dark:text-emerald-300" },
  { id: "dashboard", icon: BarChart3, title: "Marketing Dashboard", desc: "Monitor performance metrics, engagement, and campaign analytics in real-time.", bg: "bg-orange-50 dark:bg-orange-500/15", iconColor: "text-orange-600 dark:text-orange-300" },
];

const stats = [
  { label: "Content Generated", value: "1,284", icon: FileText, change: "+12% this week", up: true },
  { label: "Active Campaigns", value: "8", icon: Target, change: "2 ending soon", up: null },
  { label: "Trending Topics", value: "47", icon: Hash, change: "+5 new today", up: true },
  { label: "Avg Engagement", value: "6.4%", icon: Activity, change: "+0.8% vs last week", up: true },
];

const activities = [
  { icon: Sparkles, text: "Instagram caption generated for 'Summer Sale'", time: "2 min ago", type: "generate" },
  { icon: TrendingUp, text: "New trend detected: #SustainableFashion growing 340%", time: "15 min ago", type: "trend" },
  { icon: FileEdit, text: "Marketing draft created for Q3 campaign", time: "1 hr ago", type: "draft" },
  { icon: CheckCircle, text: "Campaign 'Brand Launch' published to all channels", time: "3 hr ago", type: "publish" },
  { icon: BarChart3, text: "Weekly performance report ready for review", time: "Yesterday", type: "report" },
];

export default function OverviewPage({ onNavigate }: OverviewPageProps) {
  return (
    <div className="space-y-8 fade-in">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 p-6 sm:p-8 text-white border border-white/10 dark:border-white/5 shadow-lg shadow-blue-900/20">
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1.5 bg-white/20 dark:bg-white/10 rounded-full px-3 py-1 border border-white/20 dark:border-white/10">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
              <span className="text-xs font-medium">AI-Powered</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 leading-tight">
            AI Content Marketing<br />Command Center
          </h1>
          <p className="text-blue-100/95 dark:text-blue-100/80 text-sm sm:text-base max-w-xl mb-6">
            Discover trends, generate content, and track performance in one unified workspace built for modern marketing teams.
          </p>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => onNavigate("content")} className="bg-white text-blue-700 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-blue-50 transition-colors flex items-center gap-2 shadow-sm shadow-blue-900/10">
              <Zap className="w-4 h-4" /> Generate Content
            </button>
            <button onClick={() => onNavigate("trends")} className="bg-white/20 dark:bg-white/10 text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-white/30 dark:hover:bg-white/20 transition-colors border border-white/20 dark:border-white/10">
              Explore Trends →
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/70 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                </div>
                {stat.up !== null && (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-300">↑</span>
                )}
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-0.5">{stat.value}</div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">{stat.label}</div>
              <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">{stat.change}</div>
            </div>
          );
        })}
      </div>

      {/* Feature Cards */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.id} className="rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/70 shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-blue-500/40 transition-all group cursor-pointer" onClick={() => onNavigate(f.id)}>
                <div className={`w-11 h-11 rounded-xl ${f.bg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-5 h-5 ${f.iconColor}`} />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm mb-2">{f.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">{f.desc}</p>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-300 group-hover:gap-2.5 transition-all">
                  Open <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Recent Activity</h2>
          <button className="text-xs font-medium text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-200 transition-colors">View all</button>
        </div>
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/70 shadow-sm divide-y divide-slate-100 dark:divide-slate-800">
          {activities.map((a, i) => {
            const Icon = a.icon;
            const colors: Record<string, string> = {
              generate: "bg-purple-50 dark:bg-purple-500/15 text-purple-500 dark:text-purple-300",
              trend: "bg-blue-50 dark:bg-blue-500/15 text-blue-500 dark:text-blue-300",
              draft: "bg-amber-50 dark:bg-amber-500/15 text-amber-500 dark:text-amber-300",
              publish: "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-500 dark:text-emerald-300",
              report: "bg-slate-100 dark:bg-slate-700/60 text-slate-500 dark:text-slate-300",
            };
            return (
              <div key={i} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${colors[a.type]}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 dark:text-slate-200 truncate">{a.text}</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 flex-shrink-0">
                  <Clock className="w-3 h-3" />
                  {a.time}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

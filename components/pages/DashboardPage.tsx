"use client";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Users, TrendingUp, FileText, Target, Lightbulb, ArrowUp, ArrowDown, Minus } from "lucide-react";

const engagementData = [
  { day: "Mon", engagement: 4.2, reach: 12000 },
  { day: "Tue", engagement: 5.8, reach: 18500 },
  { day: "Wed", engagement: 4.9, reach: 15200 },
  { day: "Thu", engagement: 7.2, reach: 24000 },
  { day: "Fri", engagement: 6.8, reach: 22000 },
  { day: "Sat", engagement: 8.4, reach: 28500 },
  { day: "Sun", engagement: 7.1, reach: 23800 },
];

const channelData = [
  { channel: "Instagram", posts: 24, reach: 45200, eng: 7.8 },
  { channel: "TikTok", posts: 18, reach: 89400, eng: 11.2 },
  { channel: "LinkedIn", posts: 12, reach: 18700, eng: 4.9 },
  { channel: "X/Twitter", posts: 31, reach: 22100, eng: 3.4 },
  { channel: "YouTube", posts: 6, reach: 34800, eng: 8.6 },
];

const contentPerf = [
  { title: "Summer Sale Launch Reel", platform: "Instagram", reach: "48.2K", engagement: "9.4%", status: "top" },
  { title: "How We Built This From Zero", platform: "TikTok", reach: "124.5K", engagement: "14.2%", status: "top" },
  { title: "5 Productivity Hacks for 2024", platform: "LinkedIn", reach: "22.8K", engagement: "6.1%", status: "good" },
  { title: "Behind the Scenes - Office Tour", platform: "YouTube", reach: "31.4K", engagement: "8.9%", status: "good" },
  { title: "Weekly Thread: Lessons Learned", platform: "X/Twitter", reach: "11.2K", engagement: "3.2%", status: "avg" },
  { title: "Product Update Announcement", platform: "LinkedIn", reach: "15.6K", engagement: "4.8%", status: "avg" },
];

const recommendations = [
  { text: "Post more short-form videos — TikTok & Reels drive 3x more reach than static posts this week.", icon: "📹", priority: "high" },
  { text: "Use stronger CTAs — posts with direct calls-to-action get 28% more engagement on average.", icon: "💬", priority: "high" },
  { text: "Instagram content performs significantly better this week — consider increasing post frequency.", icon: "📸", priority: "medium" },
  { text: "Your best posting window is Saturday 10–11 AM based on 30-day engagement history.", icon: "⏰", priority: "medium" },
];

const statusColors: Record<string, string> = {
  top: "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300",
  good: "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300",
  avg: "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300",
};

const statusLabels: Record<string, string> = { top: "Top Performer", good: "Good", avg: "Average" };

export default function DashboardPage() {
  const stats = [
    { label: "Total Reach", value: "210.4K", change: "+18.2%", icon: Users, up: true },
    { label: "Engagement Rate", value: "6.8%", change: "+1.2%", icon: TrendingUp, up: true },
    { label: "Content Published", value: "91", change: "+14 this month", icon: FileText, up: true },
    { label: "Conversion Rate", value: "3.4%", change: "-0.3%", icon: Target, up: false },
  ];

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">Marketing Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Track your content performance and campaign analytics</p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white dark:bg-slate-900/70 rounded-2xl p-4 card-shadow border border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                </div>
                <span className={`flex items-center gap-0.5 text-xs font-semibold ${s.up ? "text-emerald-600" : "text-red-500"}`}>
                  {s.up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                  {s.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-0.5">{s.value}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{s.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Engagement chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900/70 rounded-2xl p-5 card-shadow border border-slate-100 dark:border-slate-800">
          <h2 className="font-semibold text-slate-800 dark:text-slate-100 mb-1">Engagement Over Time</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last 7 days · Engagement rate %</p>
          <div className="overflow-x-auto">
            <div style={{minWidth: 300}}>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={engagementData}>
                  <defs>
                    <linearGradient id="engGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0", fontSize: 12 }} />
                  <Area type="monotone" dataKey="engagement" stroke="#2563EB" strokeWidth={2} fill="url(#engGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white dark:bg-slate-900/70 rounded-2xl p-5 card-shadow border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-amber-500" />
            </div>
            <h2 className="font-semibold text-slate-800 dark:text-slate-100">AI Recommendations</h2>
          </div>
          <div className="space-y-3">
            {recommendations.map((r, i) => (
              <div key={i} className={`p-3 rounded-xl border ${r.priority === "high" ? "border-blue-200 dark:border-blue-500/40 bg-blue-50 dark:bg-blue-500/10" : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60"}`}>
                <div className="flex gap-2.5">
                  <span className="text-base">{r.icon}</span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{r.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Channel Performance */}
      <div className="bg-white dark:bg-slate-900/70 rounded-2xl p-5 card-shadow border border-slate-100 dark:border-slate-800">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100 mb-1">Channel Performance</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Reach by platform this month</p>
        <div className="overflow-x-auto">
          <div style={{minWidth: 300}}>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={channelData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="channel" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0", fontSize: 12 }} />
                <Bar dataKey="reach" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7C3AED" />
                    <stop offset="100%" stopColor="#2563EB" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Content Performance Table */}
      <div className="bg-white dark:bg-slate-900/70 rounded-2xl p-5 card-shadow border border-slate-100 dark:border-slate-800">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100 mb-4">Recent Content Performance</h2>
        <div className="overflow-x-auto">
          <table className="w-full" style={{minWidth: 560}}>
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                {["Content Title", "Platform", "Reach", "Engagement", "Status"].map(h => (
                  <th key={h} className="text-xs font-semibold text-slate-500 dark:text-slate-400 text-left pb-3 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {contentPerf.map((row, i) => (
                <tr key={i} className="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 pr-4 text-sm font-medium text-slate-800 dark:text-slate-200 max-w-xs truncate">{row.title}</td>
                  <td className="py-3 pr-4 text-xs text-slate-500 dark:text-slate-400">{row.platform}</td>
                  <td className="py-3 pr-4 text-sm font-semibold text-slate-800 dark:text-slate-200">{row.reach}</td>
                  <td className="py-3 pr-4 text-sm font-semibold text-slate-800 dark:text-slate-200">{row.engagement}</td>
                  <td className="py-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[row.status]}`}>
                      {statusLabels[row.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

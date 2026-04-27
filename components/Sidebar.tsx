"use client";
import { useState } from "react";
import { LayoutDashboard, TrendingUp, FileEdit, Sparkles, BarChart3, Settings, Zap, X, Menu, ChevronRight } from "lucide-react";

const navItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "trends", label: "Trend & Social Insight", icon: TrendingUp },
  { id: "draft", label: "Marketing Draft", icon: FileEdit },
  { id: "content", label: "Content Generation", icon: Sparkles },
  { id: "dashboard", label: "Marketing Dashboard", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export default function Sidebar({ currentPage, onNavigate, collapsed, onCollapsedChange }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const isCollapsed = collapsed ?? internalCollapsed;

  const setCollapsed = (next: boolean) => {
    if (onCollapsedChange) onCollapsedChange(next);
    else setInternalCollapsed(next);
  };

  const NavContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`border-b border-slate-200 dark:border-white/10 ${isCollapsed ? "px-3 py-4" : "px-5 py-6"}`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl btn-gradient flex items-center justify-center shadow-lg">
            <Zap className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <div className="text-slate-900 dark:text-white font-bold text-sm leading-tight">ContentAI</div>
              <div className="text-slate-500 dark:text-slate-400 text-xs">Marketing Suite</div>
            </div>
          )}

          {/* Desktop collapse toggle */}
          <button
            type="button"
            className={`ml-auto hidden lg:inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-white/10 transition-all ${isCollapsed ? "rotate-180" : ""}`}
            onClick={() => setCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {!isCollapsed && (
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-widest px-3 mb-3">Main Menu</div>
        )}
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { onNavigate(item.id); setMobileOpen(false); }}
              title={item.label}
              className={`nav-item w-full flex items-center ${isCollapsed ? "justify-center" : "gap-3"} px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? "active text-white dark:text-white bg-slate-800 dark:bg-slate-800"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-blue-300 dark:text-blue-400" : "text-slate-500 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300"}`} />
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {isActive && <ChevronRight className="w-3 h-3 text-blue-300 dark:text-blue-400" />}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-4 py-4 border-t border-slate-200 dark:border-white/10">
        {isCollapsed ? (
          <button
            type="button"
            className="w-full rounded-xl border border-blue-200 dark:border-white/10 bg-gradient-to-r from-blue-500/15 to-purple-500/15 dark:from-blue-600/20 dark:to-purple-600/20 p-3 text-left text-xs font-semibold text-blue-700 dark:text-white hover:border-blue-300 dark:hover:border-white/20 transition-all"
            title="Upgrade to Pro"
          >
            Upgrade
          </button>
        ) : (
          <div className="bg-gradient-to-r from-blue-500/15 to-purple-500/15 dark:from-blue-600/20 dark:to-purple-600/20 rounded-xl p-3 border border-blue-200 dark:border-white/10">
            <div className="text-xs font-semibold text-slate-900 dark:text-white mb-1">Upgrade to Pro</div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mb-2">Unlock unlimited AI generations</div>
            <button className="w-full btn-gradient text-white text-xs font-semibold py-1.5 rounded-lg">Upgrade Now</button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center text-slate-800 dark:text-white shadow-lg"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`lg:hidden fixed left-0 top-0 h-full w-72 z-50 bg-white dark:bg-slate-900 transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <NavContent />
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col fixed left-0 top-0 h-full z-30 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 sidebar-shadow transition-[width] duration-300 ${isCollapsed ? "w-20" : "w-64"}`}
      >
        <NavContent />
      </aside>
    </>
  );
}

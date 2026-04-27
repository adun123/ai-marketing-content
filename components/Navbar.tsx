"use client";
import { Search, Bell, Plus, User, ChevronDown, CircleHelp } from "lucide-react";

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  sidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
  onStartTour?: () => void;
}

const pageTitles: Record<string, string> = {
  overview: "Overview",
  trends: "Trend & Social Insight",
  draft: "Marketing Draft Generator",
  content: "Content Generation",
  dashboard: "Marketing Dashboard",
  settings: "Settings",
};

export default function Navbar({ currentPage, onNavigate, sidebarCollapsed, onToggleSidebar, onStartTour }: NavbarProps) {
  return (
    <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-4 lg:px-6 py-3 transition-colors">
      <div className="flex items-center gap-3">
        {/* Desktop sidebar toggle */}
       

        {/* Page title - hidden on mobile to give space */}
        <div className="hidden sm:block min-w-0">
          <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100 truncate">{pageTitles[currentPage]}</h2>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md ml-11 sm:ml-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search anything..."
              className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-900 rounded-xl text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 border border-transparent dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-400/30 focus:bg-white dark:focus:bg-slate-900 transition-all"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Notification */}
          <button
            className="relative w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-colors"
            aria-label="Help tour"
            onClick={onStartTour}
          >
            <CircleHelp className="w-4 h-4 text-slate-600 dark:text-slate-300" />
          </button>

          <button className="relative w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-colors" aria-label="Notifications">
            <Bell className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full"></span>
          </button>

          {/* Create */}
          <button
            onClick={() => onNavigate("content")}
            className="btn-gradient hidden sm:flex items-center gap-2 text-white text-xs font-semibold px-3 py-2 rounded-xl"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Content</span>
          </button>

          {/* Mobile create */}
          <button
            onClick={() => onNavigate("content")}
            className="btn-gradient sm:hidden w-9 h-9 rounded-xl flex items-center justify-center"
            aria-label="Create content"
          >
            <Plus className="w-4 h-4 text-white" />
          </button>

          {/* Profile */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
            <div className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="hidden md:block">
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-100">Alex Johnson</div>
              <div className="text-xs text-slate-400 dark:text-slate-500">Pro Plan</div>
            </div>
            <ChevronDown className="hidden md:block w-3 h-3 text-slate-400 dark:text-slate-500" />
          </div>
        </div>
      </div>
    </header>
  );
}

"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import OverviewPage from "@/components/pages/OverviewPage";
import TrendsPage from "@/components/pages/TrendsPage";
import DraftPage from "@/components/pages/DraftPage";
import ContentPage from "@/components/pages/ContentPage";
import DashboardPage from "@/components/pages/DashboardPage";
import SettingsPage from "@/components/pages/SettingsPage";

export default function Home() {
  const [currentPage, setCurrentPage] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case "overview": return <OverviewPage onNavigate={setCurrentPage} />;
      case "trends": return <TrendsPage onNavigate={setCurrentPage} />;
      case "draft": return <DraftPage onNavigate={setCurrentPage} />;
      case "content": return <ContentPage onNavigate={setCurrentPage} />;
      case "dashboard": return <DashboardPage />;
      case "settings": return <SettingsPage />;
      default: return <OverviewPage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />
      <div
        className="lg:pl-[var(--sidebar-width)]"
        style={{
          ["--sidebar-width" as never]: sidebarCollapsed ? "5rem" : "16rem",
        }}
      >
        <Navbar
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
        />
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

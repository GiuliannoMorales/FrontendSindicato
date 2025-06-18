import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import "./Layout.css";
import { Outlet } from "react-router-dom";

interface LayoutProps {
  showSidebar?: boolean;
}

export default function Layout({ showSidebar = true }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="layout">
      <Header
        onMenuClick={() => setSidebarOpen((prev) => !prev)}
        sidebarOpen={sidebarOpen}
      />

      {showSidebar && (
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}

      <main className="contenido">
        <div className="lineaAzul"></div>
        <Outlet />
      </main>
    </div>
  );
}

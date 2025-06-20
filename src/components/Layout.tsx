import { useEffect, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import "./Layout.css";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { selectCurrentToken } from "../features/auth/authSlice";

interface LayoutProps {
  showSidebar?: boolean;
}

export default function Layout({ showSidebar = true }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const token = useAppSelector(selectCurrentToken);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [token, navigate]);
  
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

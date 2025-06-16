import React, { useState } from "react";
import { ArrowDownIcon } from "../assets/icons/ArrowIcon";
import { CashInHandIcon } from "../assets/icons/CashInHandIcon";
import { PaidParkinIcon } from "../assets/icons/PaidParkingIcon";
import { SettingsIcon } from "../assets/icons/SettingsIcon";
import { ArrowUpIcon } from "../assets/icons/ArrowUpIcon";
import Header from "./Header";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import "./Layout.css";
import { NavLink, Outlet, useLocation } from "react-router-dom";

interface LayoutProps {
  showSidebar?: boolean;
}

export default function Layout({ showSidebar = true }: LayoutProps) {
  const [groupOpen, setGroupOpen] = useState(false);
  const [cobrosOpen, setCobrosOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const handlerOpen = () => {
    setGroupOpen(!groupOpen);
  };

  const toggleCobros = () => {
    setCobrosOpen(!cobrosOpen);
  };

  return (
    <div className="layout">
      <Header onMenuClick={() => setSidebarOpen((prev) => !prev)} sidebarOpen={sidebarOpen} />

      {showSidebar && (
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)}>
          <ul className="sidebar__group">
            <div className="sidebar__group-header" onClick={handlerOpen}>
              <div className="sidebar__group-container">
                <PaidParkinIcon />
                Tarifas
              </div>
              <div>{groupOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}</div>
            </div>

            {groupOpen && (
              <div>
                <li className={`sidebar__item ${location.pathname === '/tarifas/configuracion' ? 'sidebar__item-active' : ''}`}>
                  <SettingsIcon />
                  <NavLink to="/tarifas/configuracion" className="sidebar__item-link">
                    Configuración
                  </NavLink>
                </li>
                <li className={`sidebar__item ${location.pathname === '/tarifas/historial' ? 'sidebar__item-active' : ''}`}>
                  <CashInHandIcon />
                  <NavLink to="/tarifas/historial" className="sidebar__item-link">
                    Ver Tarifas
                  </NavLink>
                </li>
              </div>
            )}
          </ul>

          <ul className="sidebar__group">
            <div className="sidebar__group-header" onClick={toggleCobros}>
              <div className="sidebar__group-container">
                <img src="/src/assets/icons/Pay.svg" alt="Cobros" className="sidebar__icon" />
                Cobros
              </div>
              <div>{cobrosOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}</div>
            </div>

            {cobrosOpen && (
              <div>
                <li className={`sidebar__item ${location.pathname === '/cobros/realizarCobros' ? 'sidebar__item-active' : ''}`}>
                  <img src="/src/assets/icons/Coin in Hand.svg" alt="Cobros" className="sidebar__icon" />
                  <NavLink to="/cobros/realizarCobros" className="sidebar__item-link">
                    Realizar Cobros
                  </NavLink>
                </li>
                <li className={`sidebar__item ${location.pathname === '/cobros/realizarCobros' ? 'sidebar__item-active' : ''}`}>
                  <img src="/src/assets/icons/Time Machine.svg" alt="Cobros" className="sidebar__icon" />
                  <NavLink to="/cobros/realizarCobros" className="sidebar__item-link">
                    Ver Historial
                  </NavLink>
                </li>
              </div>
            )}
          </ul>
        </Sidebar>
      )}

      <main className="contenido">
        <div className="lineaAzul"></div>
        <Outlet />
      </main>
    </div>
  );
}

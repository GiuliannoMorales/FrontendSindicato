// import React, {ReactNode} from 'react';
import { useState } from "react";
import { ArrowDownIcon } from "../assets/icons/ArrowIcon";
import { CashInHandIcon } from "../assets/icons/CashInHandIcon";
import { PaidParkinIcon } from "../assets/icons/PaidParkingIcon";
import { SettingsIcon } from "../assets/icons/SettingsIcon";
import "./Layout.css";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { ArrowUpIcon } from "../assets/icons/ArrowUpIcon";
import { PeopleIcon } from "../assets/icons/PeopleIcon";
import { UserAddIcon } from "../assets/icons/UserAddIcon";
import { UserIcon } from "../assets/icons/UserIcon";
import { PayIcon } from "../assets/icons/PayIcon";
import { CoinInHandIcon } from "../assets/icons/CoinInHand";

// interface LayoutProps {
//   children: ReactNode;
// }

export default function Layout() {
  const [groupOpen, setGroupOpen] = useState(false);
  const [userGroupOpen, setUserGroupOpen] = useState(false);
  const [cuentaGroupOpen, setCuentaGroupOpen] = useState(false);
  const location = useLocation();

  const handlerOpen = () => {
    setGroupOpen(!groupOpen);
  };

  const toggleUserGroup = () => {
    setUserGroupOpen(!userGroupOpen);
  };

  const toggleCuentagroup = () => {
    setCuentaGroupOpen(!cuentaGroupOpen);
  };

  return (
    <div className="layout">
      <header>
        <div className="headerLogo">
          <img
            src="/Logo_umss.png"
            alt="Logo UMSS"
            height={"100%"}
            style={{ objectFit: "contain" }}
          />
        </div>
        <div className="headerTitulo">
          <h1 className="titulo">SISTEMA DE GESTION DEL PARQUEO</h1>
          <div className="lineaRoja"></div>
        </div>
      </header>
      <aside>
        <ul className="sidebar__group">
          <div className="sidebar__group-header" onClick={handlerOpen}>
            <div className="sidebar__group-container">
              <PaidParkinIcon />
              Tarifas
            </div>
            <div>{groupOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}</div>
          </div>

          {groupOpen
            ? (
              <div>
                <li
                  className={`sidebar__item ${
                    location.pathname === "/tarifas/configuracion"
                      ? "sidebar__item-active"
                      : ""
                  }`}
                >
                  <SettingsIcon />
                  <NavLink
                    to={"/tarifas/configuracion"}
                    className={"sidebar__item-link"}
                  >
                    Configuración
                  </NavLink>
                </li>
                <li
                  className={`sidebar__item ${
                    location.pathname === "/tarifas/historial"
                      ? "sidebar__item-active"
                      : ""
                  }`}
                >
                  <CashInHandIcon />
                  <NavLink
                    to={"/tarifas/historial"}
                    className={"sidebar__item-link"}
                  >
                    Ver Tarifas
                  </NavLink>
                </li>
              </div>
            )
            : <></>}
        </ul>

        <ul className="sidebar__group">
          <div className="sidebar__group-header" onClick={toggleUserGroup}>
            <div className="sidebar__group-container">
              <PeopleIcon />
              Usuarios
            </div>
            <div>{userGroupOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}</div>
          </div>

          {userGroupOpen
            ? (
              <div>
                <li
                  className={`sidebar__item ${
                    location.pathname === "/registrar/usuario"
                      ? "sidebar__item-active"
                      : ""
                  }`}
                >
                  <UserAddIcon />
                  <NavLink
                    to={"/registrar/usuario"}
                    className={"sidebar__item-link"}
                  >
                    Crear Usuario
                  </NavLink>
                </li>
                <li
                  className={`sidebar__item ${
                    location.pathname === "/ver/usuario"
                      ? "sidebar__item-active"
                      : ""
                  }`}
                >
                  <UserIcon />
                  <NavLink
                    to={"/ver/usuario"}
                    className={"sidebar__item-link"}
                  >
                    Ver Usuarios
                  </NavLink>
                </li>
              </div>
            )
            : <></>}
        </ul>

        <ul className="sidebar__group">
          <div className="sidebar__group-header" onClick={toggleCuentagroup}>
            <div className="sidebar__group-container">
              <PayIcon />
              Mi Cuenta
            </div>
            <div>{cuentaGroupOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}</div>
          </div>

          {cuentaGroupOpen
            ? (
              <div>
                <li
                  className={`sidebar__item ${
                    location.pathname === "/cuenta/estado"
                      ? "sidebar__item-active"
                      : ""
                  }`}
                >
                  <CoinInHandIcon />
                  <NavLink
                    to={"/cuenta/estado"}
                    className={"sidebar__item-link"}
                  >
                    Ver Estado
                  </NavLink>
                </li>
              </div>
            )
            : <></>}
        </ul>
      </aside>
      <main className="contenido">
        <div className="lineaAzul"></div>
        <Outlet />
      </main>
    </div>
  );
}

import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { ArrowDownIcon } from "../assets/icons/ArrowIcon";
import { ArrowUpIcon } from "../assets/icons/ArrowUpIcon";
import { PaidParkinIcon } from "../assets/icons/PaidParkingIcon";
import { CashInHandIcon } from "../assets/icons/CashInHandIcon";
import { SettingsIcon } from "../assets/icons/SettingsIcon";
import { PeopleIcon } from "../assets/icons/PeopleIcon";
import { UserAddIcon } from "../assets/icons/UserAddIcon";
import { UserIcon } from "../assets/icons/UserIcon";
import { PayIcon } from "../assets/icons/PayIcon";
import { CoinInHandIcon } from "../assets/icons/CoinInHand";
import { useState } from "react";
import "./Layout.css";
import { LogUserIcon } from "../assets/icons/LogUserIcon";
import api from "../api/axios";
import { logOut, selectCurrentRoles } from "../features/auth/authSlice";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../app/hooks";

export default function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [groupOpen, setGroupOpen] = useState(false);
  const [userGroupOpen, setUserGroupOpen] = useState(false);
  const [cuentaGroupOpen, setCuentaGroupOpen] = useState(false);
  const [logGroupOpen, setLogGroupOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const roles = useAppSelector(selectCurrentRoles);
  const isAdmin = roles.includes("ADMINISTRADOR");
  const isCajero = roles.includes("CAJERO");
  const isCliente = roles.includes("CLIENTE");

  const handleLogout = async () => {
    try {
      await api.get("/auth/logout");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      dispatch(logOut());
      navigate("/login");
    }
  };
  return (
    <>
      {open && <div className="sidebar-backdrop" onClick={onClose} />}
      <aside className={open ? "sidebar open" : "sidebar"}>
        {isAdmin && (
          <>
            <ul className="sidebar__group">
              <div
                className="sidebar__group-header"
                onClick={() => setGroupOpen(!groupOpen)}
              >
                <div className="sidebar__group-container">
                  <PaidParkinIcon />
                  Tarifas
                </div>
                <div>{groupOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}</div>
              </div>
              {groupOpen && (
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
              )}
            </ul>
            <ul className="sidebar__group">
              <div
                className="sidebar__group-header"
                onClick={() => setUserGroupOpen(!userGroupOpen)}
              >
                <div className="sidebar__group-container">
                  <PeopleIcon />
                  Usuarios
                </div>
                <div>{userGroupOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}</div>
              </div>
              {userGroupOpen && (
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
                      location.pathname === "/ver/usuarios"
                        ? "sidebar__item-active"
                        : ""
                    }`}
                  >
                    <UserIcon />
                    <NavLink
                      to={"/ver/usuarios"}
                      className={"sidebar__item-link"}
                    >
                      Ver Usuarios
                    </NavLink>
                  </li>
                </div>
              )}
            </ul>
          </>
        )}
        {isCajero && <></>}

        {isCliente && (
          <>
            <ul className="sidebar__group">
              <div
                className="sidebar__group-header"
                onClick={() => setCuentaGroupOpen(!cuentaGroupOpen)}
              >
                <div className="sidebar__group-container">
                  <PayIcon />
                  Mi Cuenta
                </div>
                <div>
                  {cuentaGroupOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}
                </div>
              </div>
              {cuentaGroupOpen && (
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
              )}
            </ul>
          </>
        )}

        <ul className="sidebar__logout">
          {logGroupOpen && (
            <div>
              <li className={`sidebar__item`} onClick={handleLogout}>
                Cerrar sesión
              </li>
            </div>
          )}
          <div
            className="sidebar__group-header"
            onClick={() => setLogGroupOpen(!logGroupOpen)}
          >
            <div className="sidebar__group-container">
              <LogUserIcon />
              {roles[0].toLowerCase()}
            </div>
            <div>{logGroupOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}</div>
          </div>
        </ul>
      </aside>
    </>
  );
}

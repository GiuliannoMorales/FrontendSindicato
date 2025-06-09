import React, { useEffect, useState } from "react";
// import api from "../../api/axios";
import "./Usuarios.css";
import type { Usuario } from "./UsuariosModelo.ts";
import { FilterIcon } from "../../assets/icons/FilterIcon.tsx";

const mockUsuarios: Usuario[] = [
  {
    id: 1,
    nombre: "JUAN MARTIN",
    apellido: "MARTINES RAMIREZ",
    ci: "111111",
    rol: "Administrativo",
    imagenUrl: "",
    bloqueado: false,
    activo: true,
  },
  {
    id: 2,
    nombre: "MARGARITA",
    apellido: "ROMERO LUCERO",
    ci: "222222",
    rol: "Docente Tiempo Hora",
    imagenUrl: "",
    bloqueado: true,
    activo: false,
  },
  {
    id: 3,
    nombre: "RITHA JUANA",
    apellido: "ROJAS ROJAS",
    ci: "333333",
    rol: "Administrativo",
    imagenUrl: "",
    bloqueado: true,
    activo: true,
  },
  {
    id: 4,
    nombre: "ROSA",
    apellido: "ROJA ESPINOZA",
    ci: "444444",
    rol: "Docente Tiempo Exclusivo",
    imagenUrl: "",
    bloqueado: false,
    activo: true,
  },
  {
    id: 5,
    nombre: "LUCAS PABLO",
    apellido: "POZO",
    ci: "555555",
    rol: "Administrativo",
    imagenUrl: "",
    bloqueado: true,
    activo: true,
  },
  {
    id: 6,
    nombre: "KEVIN",
    apellido: "PEREZ RIOJA",
    ci: "666666",
    rol: "Administrativo",
    imagenUrl: "",
    bloqueado: false,
    activo: false,
  },
];

const rolesDisponibles = [
  { label: "Administrativos", value: "Administrativo" },
  { label: "Docentes T. Hora", value: "Docente Tiempo Hora" },
  { label: "Docentes T. Exclusivo", value: "Docente Tiempo Exclusivo" },
];

const tiposDisponibles = [
  { label: "Usuarios activos", value: "activos" },
  { label: "Usuarios inactivos", value: "inactivos" },
  { label: "Usuarios bloqueados", value: "bloqueados" },
];

const Usuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarFiltro, setMostrarFiltro] = useState(false);
  const [filtroRoles, setFiltroRoles] = useState<string[]>([]);
  const [filtroTipos, setFiltroTipos] = useState<string[]>([]);
  const [filtroMeses, setFiltroMeses] = useState(1);

  useEffect(() => {
    setUsuarios(mockUsuarios);
    // api.get("/usuarios").then((res) => setUsuarios(res.data));
  }, []);

  const usuariosFiltrados = usuarios.filter((u) => {
    const coincideBusqueda =
      u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.ci.includes(busqueda);

    const coincideRol = filtroRoles.length === 0 || filtroRoles.includes(u.rol);

    const coincideTipo = filtroTipos.length === 0 ||
      (filtroTipos.includes("activos") && u.activo) ||
      (filtroTipos.includes("inactivos") && !u.activo) ||
      (filtroTipos.includes("bloqueados") && u.bloqueado);

    // Aquí puedes agregar el filtro de meses si tienes esa lógica
    return coincideBusqueda && coincideRol && coincideTipo;
  });

  const handleFiltroRol = (rol: string) => {
    setFiltroRoles((prev) =>
      prev.includes(rol) ? prev.filter((r) => r !== rol) : [...prev, rol]
    );
  };

  const handleFiltroTipo = (tipo: string) => {
    setFiltroTipos((prev) =>
      prev.includes(tipo) ? prev.filter((t) => t !== tipo) : [...prev, tipo]
    );
  };

  const handleFiltroMeses = (delta: number) => {
    setFiltroMeses((prev) => Math.max(1, prev + delta));
  };

  const handleFiltrar = () => {
    setMostrarFiltro(false);
  };

  const handleReset = () => {
    setFiltroRoles([]);
    setFiltroTipos([]);
    setFiltroMeses(2);
    setMostrarFiltro(false);
  };

  return (
    <div className="container">
      <h2>LISTA DE USUARIOS REGISTRADOS</h2>
      <div className="control">
        <label>
          Buscar por Nombre o C.I.:
          <input
            type="text"
            className="buscador"
            placeholder="Buscar por Nombre o C.I...."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </label>
        <a className="btnFiltro" onClick={() => setMostrarFiltro(true)}>
          <FilterIcon />
        </a>
      </div>
      {mostrarFiltro && (
        <div
          className="modalFiltroBackdrop"
          onClick={() => setMostrarFiltro(false)}
        >
          <div className="modalFiltro" onClick={(e) => e.stopPropagation()}>
            <div className="modalFiltroTitulo">Filtrar por:</div>
            <hr />
            <div className="modalChecks">
              <div>
                <div>
                  <b>Roles:</b>
                </div>
                {rolesDisponibles.map((rol) => (
                  <div key={rol.value}>
                    <label className="filtroCheckbox">
                      <input
                        type="checkbox"
                        checked={filtroRoles.includes(rol.value)}
                        onChange={() => handleFiltroRol(rol.value)}
                      />
                      {rol.label}
                    </label>
                  </div>
                ))}
              </div>
              <div>
                <div>
                  <b>Tipos:</b>
                </div>
                {tiposDisponibles.map((tipo) => (
                  <div key={tipo.value}>
                    <label className="filtroCheckbox">
                      <input
                        type="checkbox"
                        checked={filtroTipos.includes(tipo.value)}
                        onChange={() => handleFiltroTipo(tipo.value)}
                      />
                      {tipo.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="modalMes" style={{ marginTop: "1rem" }}>
              <div>
                <b>Usuarios adeudados por:</b>
              </div>
              <div className="filtroMeses">
                Meses:
                <button
                  className="btnMes"
                  onClick={() => handleFiltroMeses(-1)}
                >
                  -
                </button>
                <input
                  type="number"
                  className="inputMes"
                  value={filtroMeses}
                  min={1}
                  readOnly
                />
                <button className="btnMes" onClick={() => handleFiltroMeses(1)}>
                  +
                </button>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
                marginTop: "1.5rem",
              }}
            >
              <button className="btnFiltrar" onClick={handleFiltrar}>
                FILTRAR
              </button>
              <button className="btnReset" onClick={handleReset}>
                REESTABLECER
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="lista">
        {usuariosFiltrados.map((usuario) => (
          <div
            className={`usrCard ` +
              (usuario.bloqueado
                ? "bloqueado"
                : usuario.activo
                ? "activo"
                : "inactivo")}
            key={usuario.id}
          >
            <img
              className="usrImg"
              src={usuario.imagenUrl || "/userPlaceholder.svg"}
              alt={usuario.nombre}
            />
            <div className="usrInfo">
              <div className="usrName">
                {usuario.nombre} {usuario.apellido}
              </div>
              <div className="usrRol">
                {usuario.rol}
              </div>
            </div>
          </div>
        ))}
        {usuariosFiltrados.length === 0 && (
          <div className="usrEmpty">No se encontraron usuarios.</div>
        )}
      </div>
    </div>
  );
};

export default Usuarios;

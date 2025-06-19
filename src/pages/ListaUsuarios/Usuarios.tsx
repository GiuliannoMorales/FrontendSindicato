import React, { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.ts";
import "./Usuarios.css";
import type { Usuario } from "./UsuariosModelo.ts";
import { FilterIcon } from "../../assets/icons/FilterIcon.tsx";
import { UserMenu } from "./components/UserMenu.tsx";

const mapApiUsuario = (apiUsuario: any): Usuario => ({
  id: apiUsuario.id,
  nombre: apiUsuario.nombre,
  apellido: apiUsuario.apellido,
  tipoCliente: apiUsuario.tipoCliente,
  imagenUrl: apiUsuario.foto
    ? `data:image/png;base64,${apiUsuario.foto}`
    : "/userPlaceholder.svg",
  estado: apiUsuario.estado,
  roles: apiUsuario.roles || [],
  cantidadMesesDeuda: apiUsuario.cantidadMesesDeuda,
  ci: apiUsuario.ci,
});

const rolesDisponibles = [
  { label: "Administrativo", value: "Administrativo" },
  {
    label: "Docente a dedicación exclusiva",
    value: "Docente a dedicación exclusiva",
  },
  { label: "Docente a tiempo horario", value: "Docente a tiempo horario" },
  { label: "Administrador", value: "ADMINISTRADOR" },
  { label: "Cajero", value: "CAJERO" },
];

const tiposDisponibles = [
  { label: "Usuarios activos", value: "Activos" },
  { label: "Usuarios inactivos", value: "Inactivos" },
  { label: "Usuarios bloqueados", value: "Bloqueados" },
];

const Usuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarFiltro, setMostrarFiltro] = useState(false);
  const [filtroRoles, setFiltroRoles] = useState<string[]>([]);
  const [filtroTipos, setFiltroTipos] = useState<string[]>([]);
  const [filtroMeses, setFiltroMeses] = useState(0);

  const [tmpFiltroRoles, setTmpFiltroRoles] = useState<string[]>([]);
  const [tmpFiltroTipos, setTmpFiltroTipos] = useState<string[]>([]);
  const [tmpFiltroMeses, setTmpFiltroMeses] = useState(0);
  const [mensajeError, setMensajeError] = useState<string | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [exitoVisible, setExitoVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchUsuarios = async () => {
      setLoading(true);
      try {
        const res = await axiosPrivate.get("/usuario/vista", {
          withCredentials: true,
        });
        const usuariosAdaptados = res.data.map(mapApiUsuario);
        setUsuarios(usuariosAdaptados);
      } catch (err) {
        console.error("Error al obtener usuarios", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsuarios();
  }, [axiosPrivate]);

  const usuariosFiltrados = usuarios.filter((u) => {
    const coincideBusqueda =
      u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
      (u.ci && u.ci.toLowerCase().includes(busqueda.toLowerCase()));

    const tipoClienteRoles = [
      "Administrativo",
      "Docente a dedicación exclusiva",
      "Docente a tiempo horario",
    ];
    const sistemaRoles = ["ADMINISTRADOR", "CAJERO"];

    let coincideRol = true;
    if (filtroRoles.length > 0) {
      const coincideTipoCliente = filtroRoles
        .filter((r) => tipoClienteRoles.includes(r))
        .some((r) => u.tipoCliente === r);

      const coincideSistemaRol = filtroRoles
        .filter((r) => sistemaRoles.includes(r))
        .some((r) => u.roles?.includes(r));

      coincideRol = coincideTipoCliente || coincideSistemaRol;
    }

    const coincideTipo = filtroTipos.length === 0 ||
      (filtroTipos.includes("Activos") && u.estado === "Activo") ||
      (filtroTipos.includes("Inactivos") && u.estado === "Inactivo") ||
      (filtroTipos.includes("Bloqueados") && u.estado === "Bloqueado");

    const coincideMeses = filtroMeses === 0 ||
      (typeof u.cantidadMesesDeuda === "number" &&
        u.cantidadMesesDeuda >= filtroMeses);

    return coincideBusqueda && coincideRol && coincideTipo && coincideMeses;
  });

  const openFiltroModal = () => {
    setTmpFiltroRoles(filtroRoles);
    setTmpFiltroTipos(filtroTipos);
    setTmpFiltroMeses(filtroMeses);
    setMostrarFiltro(true);
  };

  const handleTmpFiltroRol = (rol: string) => {
    setTmpFiltroRoles((prev) =>
      prev.includes(rol) ? prev.filter((r) => r !== rol) : [...prev, rol]
    );
  };

  const handleTmpFiltroTipo = (tipo: string) => {
    setTmpFiltroTipos((prev) =>
      prev.includes(tipo) ? prev.filter((t) => t !== tipo) : [...prev, tipo]
    );
  };

  const handleTmpFiltroMeses = (delta: number) => {
    setTmpFiltroMeses((prev) => Math.max(0, prev + delta));
  };

  const handleFiltrar = () => {
    setFiltroRoles(tmpFiltroRoles);
    setFiltroTipos(tmpFiltroTipos);
    setFiltroMeses(tmpFiltroMeses);
    setMostrarFiltro(false);
  };

  const handleReset = () => {
    setTmpFiltroRoles([]);
    setTmpFiltroTipos([]);
    setTmpFiltroMeses(0);
  };

  const mostrarMensajeExito = (msg: string) => {
    setMensajeExito(msg);
    setTimeout(() => setExitoVisible(true), 10);
    setTimeout(() => setExitoVisible(false), 2100);
    setTimeout(() => setMensajeExito(null), 2500);
  };

  const handleChangeEstado = async (
    id: string,
    nuevoEstado: "Activo" | "Inactivo" | "Bloqueado",
    motivo?: string,
  ) => {
    try {
      let res;
      if (nuevoEstado === "Activo") {
        res = await axiosPrivate.post("/admin/activar", { usuarioId: id });
      } else if (nuevoEstado === "Bloqueado") {
        res = await axiosPrivate.post("/admin/bloquear", {
          usuarioId: id,
          motivo,
        });
      } else if (nuevoEstado === "Inactivo") {
        res = await axiosPrivate.post("/admin/inactivar", {
          usuarioId: id,
          motivo,
        });
      }
      if (res?.data.status === "success") {
        setUsuarios((prev) =>
          prev.map((u) => u.id === id ? { ...u, estado: nuevoEstado } : u)
        );
        setMensajeError(null);
        let msg = "";
        if (nuevoEstado === "Activo") msg = "Usuario activado correctamente.";
        else if (nuevoEstado === "Bloqueado") {
          msg = "Usuario bloqueado correctamente.";
        } else if (nuevoEstado === "Inactivo") {
          msg = "Usuario inactivado correctamente.";
        }
        mostrarMensajeExito(msg);
      } else {
        setMensajeError(
          res?.data.message || "Error al cambiar el estado del usuario.",
        );
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        setMensajeError(error.response.data.message);
      } else {
        console.error("Error al cambiar estado del usuario.");
      }
    }
  };

  return (
    <div className="container">
      <h2>LISTA DE USUARIOS REGISTRADOS</h2>
      <div className="control">
        <label className="labelBuscador">
          Buscar por Nombre, Apellido o CI:
          <input
            type="text"
            id="idBuscador"
            className="buscador"
            placeholder="Buscar por Nombre, Apellido o CI..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </label>
        <a className="btnFiltro" onClick={openFiltroModal}>
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
                        checked={tmpFiltroRoles.includes(rol.value)}
                        onChange={() => handleTmpFiltroRol(rol.value)}
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
                        checked={tmpFiltroTipos.includes(tipo.value)}
                        onChange={() => handleTmpFiltroTipo(tipo.value)}
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
                  onClick={() => handleTmpFiltroMeses(-1)}
                >
                  -
                </button>
                <input
                  type="number"
                  className="inputMes"
                  value={tmpFiltroMeses}
                  min={0}
                  readOnly
                />
                <button
                  className="btnMes"
                  onClick={() => handleTmpFiltroMeses(1)}
                >
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
      {mensajeExito && (
        <div
          className={`exito${exitoVisible && mensajeExito ? " mostrar" : ""}`}
        >
          {mensajeExito}
        </div>
      )}
      {mensajeError && (
        <div className="error">
          {mensajeError}
        </div>
      )}
      <div className="indicadorEstados">
        <span className="indicadorItem">
          <span className="estadoEsfera activo"></span> Activo
        </span>
        <span className="indicadorItem">
          <span className="estadoEsfera inactivo"></span> Inactivo
        </span>
        <span className="indicadorItem">
          <span className="estadoEsfera bloqueado"></span> Bloqueado
        </span>
      </div>
      <div className="lista">
        {loading
          ? <div className="usrEmpty">Cargando usuarios...</div>
          : usuariosFiltrados.length === 0
          ? <div className="usrEmpty">No se encontraron usuarios.</div>
          : (
            usuariosFiltrados.map((usuario) => (
              <div
                className={`usrCard ${usuario.estado}`}
                key={usuario.id}
              >
                <UserMenu
                  usuario={usuario}
                  onChangeEstado={handleChangeEstado}
                />
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
                    {usuario.tipoCliente || "—"}
                  </div>
                </div>
              </div>
            ))
          )}
      </div>
    </div>
  );
};

export default Usuarios;

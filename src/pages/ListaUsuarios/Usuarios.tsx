import React, { useEffect, useState } from "react";
// import api from "../../api/axios";
import "./Usuarios.css";
import type { Usuario } from "./UsuariosModelo.ts";

const mockUsuarios: Usuario[] = [
  {
    id: 1,
    nombre: "JUAN MARTIN",
    apellido: "MARTINES RAMIREZ",
    ci: "111111",
    rol: "Administrativo",
    imagenUrl: "",
    habilitado: true,
  },
  {
    id: 2,
    nombre: "MARGARITA",
    apellido: "ROMERO LUCERO",
    ci: "222222",
    rol: "Docente Tiempo Hora",
    imagenUrl: "",
    habilitado: true,
  },
  {
    id: 3,
    nombre: "RITHA JUANA",
    apellido: "ROJAS ROJAS",
    ci: "333333",
    rol: "Administrativo",
    imagenUrl: "",
    habilitado: true,
  },
  {
    id: 4,
    nombre: "ROSA",
    apellido: "ROJA ESPINOZA",
    ci: "444444",
    rol: "Docente Tiempo Hora",
    imagenUrl: "",
    habilitado: false,
  },
  {
    id: 5,
    nombre: "LUCAS PABLO",
    apellido: "POZO",
    ci: "555555",
    rol: "Administrativo",
    imagenUrl: "",
    habilitado: false,
  },
  {
    id: 6,
    nombre: "KEVIN",
    apellido: "PEREZ RIOJA",
    ci: "666666",
    rol: "Administrativo",
    imagenUrl: "",
    habilitado: true,
  },
];

const Usuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    setUsuarios(mockUsuarios);
    // api.get("/usuarios").then((res) => setUsuarios(res.data));
  }, []);

  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.ci.includes(busqueda),
  );

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
      </div>
      <div className="lista">
        {usuariosFiltrados.map((usuario) => (
          <div
            className={`usrCard ${
              usuario.rol.replace(/\s+/g, "-").toLowerCase()
            }${!usuario.habilitado ? " deshabilitado" : ""}`}
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

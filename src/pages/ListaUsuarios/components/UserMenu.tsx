import { useState } from "react";
import type { Usuario } from "../UsuariosModelo";

export const UserMenu: React.FC<{
  usuario: Usuario;
  onChangeEstado: (
    id: string,
    nuevoEstado: "Activo" | "Inactivo" | "Bloqueado",
    motivo?: string,
  ) => void;
}> = ({ usuario, onChangeEstado }) => {
  const [open, setOpen] = useState(false);
  const [modalAccion, setModalAccion] = useState<
    null | "Bloqueado" | "Inactivo"
  >(null);
  const [motivo, setMotivo] = useState("");

  const handleBloquear = () => {
    setModalAccion("Bloqueado");
    setOpen(false);
    setMotivo("");
  };

  const handleInactivar = () => {
    setModalAccion("Inactivo");
    setOpen(false);
    setMotivo("");
  };

  const opciones = [
    {
      label: "Ver información",
      //En lugar del alert iria a la vista del usuario
      action: () => alert(`Ver info de ${usuario.nombre}`),
    },
    ...(usuario.estado !== "Activo"
      ? [{
        label: "Activar usuario",
        action: () => onChangeEstado(usuario.id, "Activo"),
      }]
      : []),
    ...(usuario.estado !== "Inactivo"
      ? [{
        label: "Inactivar usuario",
        action: handleInactivar,
      }]
      : []),
    ...(usuario.estado !== "Bloqueado"
      ? [{
        label: "Bloquear usuario",
        action: handleBloquear,
      }]
      : []),
  ];

  const modalMsg = modalAccion === "Bloqueado"
    ? "¿Está seguro de bloquear al usuario"
    : "¿Está seguro de inactivar al usuario";

  const modalBtn = modalAccion === "Bloqueado" ? "Bloquear" : "Inactivar";

  return (
    <div className="usrMenuWrapper">
      <button className="usrMenuBtn" onClick={() => setOpen((v) => !v)}>
        <span className="usrMenuDots">⋮</span>
      </button>
      {open && (
        <div
          className="usrMenuDropdown"
          onMouseLeave={() => setOpen(false)}
        >
          {opciones.map((op, i) => (
            <div
              key={i}
              className="usrMenuItem"
              onClick={() => {
                op.action();
                setOpen(false);
              }}
            >
              {op.label}
            </div>
          ))}
        </div>
      )}
      {modalAccion && (
        <div
          className="modalConfirmBackdrop"
          onClick={() => setModalAccion(null)}
        >
          <div className="modalConfirmMsg" onClick={(e) => e.stopPropagation()}>
            <div>
              {modalMsg} <br />
              <b>{usuario.nombre} {usuario.apellido}</b>?
            </div>
            <div className="modalMotivo">
              <textarea
                className="inputMotivo"
                placeholder="Motivo (obligatorio)"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                rows={3}
              />
            </div>
            <div className="modalConfirmBtns">
              <button
                className="modalConfirmBtn btnNo"
                onClick={() => setModalAccion(null)}
              >
                Cancelar
              </button>
              <button
                className="modalConfirmBtn btnSi"
                disabled={!motivo.trim()}
                onClick={() => {
                  onChangeEstado(usuario.id, modalAccion, motivo.trim());
                  setModalAccion(null);
                }}
              >
                {modalBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

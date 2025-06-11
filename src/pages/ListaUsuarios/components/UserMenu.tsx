import { useState } from "react";
import type { Usuario } from "../UsuariosModelo";

export const UserMenu: React.FC<{
  usuario: Usuario;
  onChangeEstado: (
    id: number,
    nuevoEstado: "activo" | "inactivo" | "bloqueado",
  ) => void;
}> = ({ usuario, onChangeEstado }) => {
  const [open, setOpen] = useState(false);
  const [confirmarBloqueo, setConfirmarBloqueo] = useState(false);

  const handleBloquear = () => {
    setConfirmarBloqueo(true);
    setOpen(false);
  };

  const opciones = [
    {
      label: "Ver información",
      //En lugar del alert iria a la vista del usuario
      action: () => alert(`Ver info de ${usuario.nombre}`),
    },
    ...(usuario.estado !== "activo"
      ? [{
        label: "Activar usuario",
        action: () => onChangeEstado(usuario.id, "activo"),
      }]
      : []),
    ...(usuario.estado !== "inactivo"
      ? [{
        label: "Inactivar usuario",
        action: () => onChangeEstado(usuario.id, "inactivo"),
      }]
      : []),
    ...(usuario.estado !== "bloqueado"
      ? [{
        label: "Bloquear usuario",
        action: handleBloquear,
      }]
      : []),
  ];

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
      {confirmarBloqueo && (
        <div
          className="modalConfirmBackdrop"
          onClick={() => setConfirmarBloqueo(false)}
        >
          <div className="modalConfirmMsg" onClick={(e) => e.stopPropagation()}>
            <div>
              ¿Está seguro de bloquear al usuario<br />
              <b>{usuario.nombre} {usuario.apellido}</b>?
            </div>
            <div className="modalConfirmBtns">
              <button
                className="modalConfirmBtn btnNo"
                onClick={() => setConfirmarBloqueo(false)}
              >
                NO
              </button>
              <button
                className="modalConfirmBtn btnSi"
                onClick={() => {
                  onChangeEstado(usuario.id, "bloqueado");
                  setConfirmarBloqueo(false);
                }}
              >
                SI
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

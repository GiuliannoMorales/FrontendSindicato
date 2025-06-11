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
        action: () => onChangeEstado(usuario.id, "bloqueado"),
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
    </div>
  );
};

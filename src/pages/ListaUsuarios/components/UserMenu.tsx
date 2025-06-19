import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Usuario } from "../UsuariosModelo";
import { useAppSelector } from "../../../app/hooks";
import { selectCurrentRoles } from "../../../features/auth/authSlice";

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
  const navigate = useNavigate();

  const roles = useAppSelector(selectCurrentRoles);
  const isAdmin = roles.includes("ADMINISTRADOR");
  const isTargetAdmin = usuario.roles?.includes("ADMINISTRADOR");
  const isTargetCajero = usuario.roles?.includes("CAJERO");

  const isTargetCliente = !isTargetAdmin && !isTargetCajero;

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
      action: () => navigate(`/Datos/${usuario.id}`),
    },
    ...(isAdmin
      ? [
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
        ...(
          isTargetCliente && usuario.estado !== "Bloqueado"
            ? [{
              label: "Bloquear usuario",
              action: handleBloquear,
            }]
            : []
        ),
      ]
      : []),
  ];

  const modalMsg = modalAccion === "Bloqueado"
    ? "Por favor, indique el motivo de bloqueo del usuario"
    : "Por favor, indique el motivo de inactivar al usuario";

  const modalBtn = modalAccion === "Bloqueado" ? "Bloquear" : "Inactivar";

  const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;

  const motivoValido = motivo.length >= 20 &&
    /[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(motivo) &&
    !emojiRegex.test(motivo);

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
              <b>{usuario.nombre} {usuario.apellido}</b>
            </div>
            <div className="modalMotivo">
              <textarea
                className="inputMotivo"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                minLength={20}
                required
                placeholder="Motivo (obligatorio minimo 20 caracteres)"
                rows={3}
              />
            </div>
            {motivo.length > 0 && (!motivoValido) && (
              <div style={{ color: "red" }}>
                El motivo debe tener al menos 20 caracteres, contener letras y
                no puede incluir emojis.
              </div>
            )}
            <div className="modalConfirmBtns">
              <button
                className="modalConfirmBtn btnNo"
                onClick={() => setModalAccion(null)}
              >
                Cancelar
              </button>
              <button
                className="modalConfirmBtn btnSi"
                disabled={!motivoValido}
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

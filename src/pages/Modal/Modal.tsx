
import './Modal.css';

const Modal = ({
  visible,
  onClose,
  onConfirm,
  mensajeFinal,
  mostrandoResultado,
}: {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  mensajeFinal?: string;
  mostrandoResultado?: boolean;
}) => {
  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-contenido">
        {!mostrandoResultado ? (
          <>
            <p>Está a punto de procesar el cobro.<br />¿Desea continuar?</p>
            <div className="modal-botones">
              <button className="boton-no" onClick={onClose}>NO</button>
              <button className="boton-si" onClick={onConfirm}>SÍ</button>
            </div>
          </>
        ) : (
          <>
            <p>{mensajeFinal}</p>
            <div className="modal-botones">
              <button className="boton-si" onClick={onClose}>Cerrar</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Modal;

import React from 'react';
import './Modal.css';

const Modal = ({ visible, onClose, onConfirm }: {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-contenido">
        <p>Está a punto de procesar el cobro.<br />¿Desea continuar?</p>
        <div className="modal-botones">
          <button className="boton-no" onClick={onClose}>NO</button>
          <button className="boton-si" onClick={onConfirm}>SÍ</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;

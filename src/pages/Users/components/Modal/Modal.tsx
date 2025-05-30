import React from "react";
import "./Modal.css";

interface CancelModalProps {
    onClose: () => void;
    onConfirm: () => void;
}

interface ErrorModalProps {
    onClose: () => void;
}

interface SuccessModalProps {
    onClose: () => void;
}

interface GeneralErrorModalProps {
    message: string;
    onClose: () => void;
}

const CancelModal: React.FC<CancelModalProps> = ({ onClose, onConfirm }) => (
    <div className="modal-overlay">
        <div className="modal-content">
            <p>¿Estás seguro de cancelar?</p>
            <div className="modal-buttons">
                <button onClick={onClose} className="cancel">No</button>
                <button onClick={onConfirm} className="confirm">Sí</button>
            </div>
        </div>
    </div>
);

const ErrorModal: React.FC<ErrorModalProps> = ({ onClose }) => (
    <div className="modal-overlay">
        <div className="modal-content">
            <p>Ocurrió un error al guardar los datos. Por favor, intente nuevamente.</p>
            <div className="modal-buttons">
                <button onClick={onClose} className="confirm">Aceptar</button>
            </div>
        </div>
    </div>
);

const SuccessModal: React.FC<SuccessModalProps> = ({ onClose }) => (
    <div className="modal-overlay">
        <div className="modal-content">
            <p>Registro exitoso.</p>
            <div className="modal-buttons">
                <button onClick={onClose} className="confirm">Aceptar</button>
            </div>
        </div>
    </div>
);

const GeneralErrorModal: React.FC<GeneralErrorModalProps> = ({ message, onClose }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <p>{message}</p>
                <div className="modal-buttons">
                    <button onClick={onClose} className="confirm"> Cerrar </button>
                </div>
            </div>
        </div>
    );
};

export { CancelModal, ErrorModal, SuccessModal, GeneralErrorModal };

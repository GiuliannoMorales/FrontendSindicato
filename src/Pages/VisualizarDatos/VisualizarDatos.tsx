import React from 'react';
import './VisualizarDatos.css';

const VisualizarDatos = () => {
  return (
    <div className="container">
      <h2>Margarita Romero Lucero</h2>
      <div className="content">
        <div className="form-section">
          <form>
            <div className="section-title">Datos Personales:</div>
            <div className="form-row">
              <label htmlFor="ci">C.I.:</label>
              <input id="ci" type="text" value="9447854" readOnly />
            </div>
            <div className="form-row">
              <label htmlFor="nombres">Nombre(s):</label>
              <input id="nombres" type="text" value="MARGARITA" readOnly />
            </div>
            <div className="form-row">
              <label htmlFor="apellidos">Apellido(s):</label>
              <input id="apellidos" type="text" value="ROMERO LUCERO" readOnly />
            </div>
            <div className="form-row">
              <label htmlFor="correo">Correo Electrónico:</label>
              <input id="correo" type="email" value="maruj@gmail.com" readOnly />
            </div>
            <div className="form-row">
              <label htmlFor="telefono">Teléfono:</label>
              <input id="telefono" type="text" value="69865427" readOnly />
            </div>
            <div className="section-title">Datos Cuenta:</div>
            <div className="form-row">
              <label htmlFor="rol">Asignar rol:</label>
              <input id="rol" type="text" value="Docente Tiempo Hora" readOnly />
            </div>
            <div className="form-row">
              <label htmlFor="contrasenia">Contraseña:</label>
              <input id="contrasenia" type="password" value="********" readOnly />
            </div>
            <div className="form-row">
              <label htmlFor="estado">Estado:</label>
              <input id="estado" type="text" value="Activo" readOnly />
            </div>
          </form>
        </div>
        <div className="image-section">
          <img src="foto-perfil.png" alt="Foto de perfil" />
          <div className="vehicles">
            <div className="form-row">
              <label>Vehículo(s):</label>
              <p>Automóvil - RJC101</p>
              <p>Motocicleta - 25481U</p>
            </div>
          </div>
          <button className="back-button">Atrás</button>
        </div>
      </div>
    </div>
  );
};

export default VisualizarDatos;

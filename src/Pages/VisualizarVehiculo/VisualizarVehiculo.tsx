import React from 'react';
import './VisualizarVehiculo.css';

const VisualizarVehiculo = () => {
  return (
    <div className="container">
      <h2>Vehículo</h2>
      <div className="content">
        <div className="form-section">
          <form>
            <div className="form-row">
              <label htmlFor="ci">Tipo Vehículo.:</label>
              <input id="ci" type="text" value="automovil" readOnly />
            </div>
            <div className="form-row">
              <label htmlFor="nombres">Placa:</label>
              <input id="nombres" type="text" value="M123213" readOnly />
            </div>
            <div className="form-row">
              <label htmlFor="apellidos">Marca:</label>
              <input id="apellidos" type="text" value="ROMERO " readOnly />
            </div>
            <div className="form-row">
              <label htmlFor="correo">Modelo:</label>
              <input id="apellidos" type="text" value="ROMERO " readOnly />
            </div>
            <div className="form-row">
              <label htmlFor="telefono">Color:</label>
              <input id="apellidos" type="text" value="ROMERO " readOnly />
            </div>
          </form>
        </div>
        <div className="image-section">
            <div className="form-row">
             <label htmlFor="telefono">Foto Vehículo Delantera:</label>
              <img src="foto-perfil.png"/>
            </div>
          <div className="form-row">
             <label htmlFor="telefono">Foto Vehículo Trasera:</label>
              <img src="foto-perfil.png" />
            </div>
        </div>
      </div>
      <button className="back-button">Atrás</button>
    </div>
  );
};

export default VisualizarVehiculo;

// ResulCI.tsx
import React from "react";
import "./ResulCI.css";
import { useLocation } from "react-router-dom";
interface Cliente {
  idCliente: string;
  nombre: string;
  apellido: string;
  tipo: string;
}

const ResulCI: React.FC = () => {
  const location = useLocation();
  const cliente = location.state?.cliente as Cliente | undefined;

  if (!cliente) {
        return <p>No se ha proporcionado un cliente.</p>;
  }

  return (
<div  className="contenido">
<div className="titulo">
        <h1>REALIZAR COBRO</h1>
      </div>
      
 <div className="resulci-container">
      <div className="resulci-datos">
        <h2>{cliente.nombre.toUpperCase()} {cliente.apellido.toUpperCase()}</h2>
        <p className="resulci-rol">{cliente.tipo}</p>
      </div>

      <div className="resulci-select">
        <label htmlFor="vehiculo">Selecciona un vehículo:</label>
        <select id="vehiculo">
          <option>Seleccione un vehículo</option>
        </select>
      </div>
    </div>

</div>

   
  );
};

export default ResulCI;

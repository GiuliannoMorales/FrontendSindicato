import { formatISODateToReadable } from "../../../../utils/formatDate";
import type { Tarifa } from "../../models/TarifasModel";
import './TarifasTable.css'

interface TarifasTableProps {
  data: Array<Tarifa>;
  fullView: boolean;
}

const TarifasTable = ({ data, fullView }: TarifasTableProps) => {
  if (data.length === 0) {
    return <div className="tarifas-table__empty">No se encontraron resultados</div>;
  }
  
  return (
    <div className="tarifas__tablecontainer">
      <table className="tarifas__table">
        <thead>
          <tr>
            {fullView && <th>Tarifa</th>}
            <th className="borde-derecho">Usuario</th>
            <th className="borde-derecho">Tipo Espacio</th>
            <th className="borde-derecho">Monto (Bs)</th>
            <th>Modificado en...</th>
            {fullView && <th>Modificado por...</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((fila, index) => (
            <tr key={index}>
              {fullView && <td className="borde-derecho">{`Tarifa #${index + 1}`}</td>}
              <td className="borde-derecho">{fila.tipoCliente}</td>
              <td className="borde-derecho">Esp. {fila.tipoVehiculo}</td>
              <td className="borde-derecho">{fila.monto}</td>
              <td className="borde-derecho">{formatISODateToReadable(fila.fechaInicio)}</td>
              {fullView && <td className="borde-derecho">{fila.nombreCompleto}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TarifasTable;

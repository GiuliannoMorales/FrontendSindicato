import type { Tarifa } from "../../TarifasHistoPage/TarifasModel";
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
            <th className="borde-derecho">Usuario</th>
            <th className="borde-derecho">Vehículo</th>
            <th className="borde-derecho">Tarifa (Bs)</th>
            <th>Modificado en...</th>
            {fullView && <th>Modificado por...</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((fila, index) => (
            <tr key={index}>
              <td className="borde-derecho">{fila.usuario}</td>
              <td className="borde-derecho">{fila.vehiculo}</td>
              <td className="borde-derecho">{fila.tarifa}</td>
              <td>{fila.fechaModificado}</td>
              {fullView && <td>{fila.modificadoPor}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TarifasTable;

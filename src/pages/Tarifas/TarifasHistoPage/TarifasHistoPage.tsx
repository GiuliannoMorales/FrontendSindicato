import { useState } from "react";
import TarifasTable from "../components/TarifasTable/TarifasTable";
import FilterTarifas from "../components/FilterTarifas/FilterTarifas";
import './TarifasHistoPage.css'

const tarifasData = [
  {
    usuario: "Administrat.",
    vehiculo: "Automóvil",
    tarifa: "3,50",
    fechaModificado: "14:50:14 - 04/05/2025",
    modificadoPor: "Julieta",
  },
  {
    usuario: "Administrat.",
    vehiculo: "Motocicleta",
    tarifa: "2,50",
    fechaModificado: "11:21:54 - 02/05/2025",
    modificadoPor: "Julieta",
  },
  {
    usuario: "Docente T. H.",
    vehiculo: "Motocicleta",
    tarifa: "3,00",
    fechaModificado: "08:24:19 - 24/04/2025",
    modificadoPor: "Julieta",
  },
  {
    usuario: "Docente D. E.",
    vehiculo: "Automóvil",
    tarifa: "3.00",
    modificadoPor: "Julieta",
    fechaModificado: "15:16:03 - 15/04/2025",
  },
];

const TarifasHistoPage = () => {
  const [filteredData, setFilteredData] = useState(tarifasData);

  return (
    <section className="tarifasHistorial__container">
      <h2 className="tarifas__title">HISTORIAL TARIFAS REGISTRADAS</h2>

      <FilterTarifas data={tarifasData} onFilter={() => setFilteredData(filteredData)}/>
      <TarifasTable data={tarifasData} fullView={true}/>
    </section>
  );
};

export default TarifasHistoPage;

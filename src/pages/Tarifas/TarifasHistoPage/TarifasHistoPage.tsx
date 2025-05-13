import TarifasTable from "../components/TarifasTable/TarifasTable";
import './TarifasHistoPage.css'

const filtersData = [
  { name: "Tipo Usuario", value: "tipoUsuario" },
  { name: "Tipo de Vehículos", value: "tipoUsuario" },
  { name: "Rangos de fechas", value: "tipoUsuario" },
];

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
  return (
    <section className="tarifasHistorial__container">
      <h2 className="tarifas__title">CONFIGURACIÓN DE TARIFAS</h2>
      <label htmlFor="tarifasFilter">Filtrar por:</label>
      <select name="tarifasFilter" id="tarifasFilter" className="tarifas__input">
        {}
      </select>
      <TarifasTable data={tarifasData} fullView={true}/>
    </section>
  );
};

export default TarifasHistoPage;

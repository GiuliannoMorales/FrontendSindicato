import TarifasTable from "./TarifasTable";

const filtersData = [
  { name: "Tipo Usuario", value: "tipoUsuario" },
  { name: "Tipo de Vehículos", value: "tipoUsuario" },
  { name: "Rangos de fechas", value: "tipoUsuario" },
];

const TarifasHistoPage = () => {
  return (
    <section className="tarifasHistorial__container">
      <h2 className="tarifas__title">CONFIGURACIÓN DE TARIFAS</h2>
      <label htmlFor="tarifasFilter">Filtrar por:</label>
      <select name="tarifasFilter" id="tarifasFilter">
        {}
      </select>
      <TarifasTable/>
      <div className="tarifas__buttonsContainer">
        <button className="btn-secondary">CANCELAR</button>
        <button className="btn-primary">GUARDAR</button>
      </div>
    </section>
  );
};

export default TarifasHistoPage;

import "./TarifasConfigPage.css";

const vehiclesTypes = ["Automovil", "Motocicleta"];

const clientsTypes = ["Administrativo", "Docente"];

const tarifasData = [
  {
    usuario: "Administrat.",
    vehiculo: "Automóvil",
    tarifa: "3,50",
    modificado: "14:50:14 - 04/05/2025",
  },
  {
    usuario: "Administrat.",
    vehiculo: "Motocicleta",
    tarifa: "2,50",
    modificado: "11:21:54 - 02/05/2025",
  },
  {
    usuario: "Docente T. H.",
    vehiculo: "Motocicleta",
    tarifa: "3,00",
    modificado: "08:24:19 - 24/04/2025",
  },
  {
    usuario: "Docente D. E.",
    vehiculo: "Automóvil",
    tarifa: "3.00",
    modificado: "15:16:03 - 15/04/2025",
  },
];

const TarifasPage = () => {
  return (
    <section className="tarifas">
      <h2 className="tarifas__title">CONFIGURACIÓN DE TARIFAS</h2>
      <div className="tarifas__configContainer">
        <div className="tarifas__configCol">
          <h3 className="tarifas__subtitle">Modificar Tarifa</h3>
          <form action="" className="tarifas__form">
            <div className="tarifas__formRow">
              <label htmlFor="clients">
                Tipo Cliente: <span style={{color: 'red'}}>*</span>
              </label>
              <select name="clients" id="" className="tarifas__input">
                {clientsTypes.map((vehicle, index) => (
                  <option value={vehicle} key={index}>
                    {vehicle}
                  </option>
                ))}
              </select>
            </div>
            <div className="tarifas__formRow">
              <label htmlFor="vehicles">
                Tipo Vehículo: <span style={{color: 'red'}}>*</span>
              </label>
              <select name="vehicles" id="" className="tarifas__input">
                {vehiclesTypes.map((vehicle, index) => (
                  <option value={vehicle} key={index}>
                    {vehicle}
                  </option>
                ))}
              </select>
            </div>
            <div className="tarifas__formRow">
              <label htmlFor="newTarifa">
                Nueva Tarifa (Bs.): <span style={{color: 'red'}}>*</span>
              </label>
              <input
                type="number"
                name="newTarifa"
                className="tarifas__input"
              />
            </div>
          </form>
        </div>
        <div className="tarifas__tableCol">
          <h3 className="tarifas__subtitle">Tarifas Registradas</h3>
          <table className="tarifas__table">
            <thead>
              <tr>
                <th className="borde-derecho">Usuario</th>
                <th className="borde-derecho">Vehículo</th>
                <th className="borde-derecho">Tarifa (Bs)</th>
                <th>Modificado en...</th>
              </tr>
            </thead>
            <tbody>
              {tarifasData.map((fila, index) => (
                <tr key={index}>
                  <td className="borde-derecho">{fila.usuario}</td>
                  <td className="borde-derecho">{fila.vehiculo}</td>
                  <td className="borde-derecho">{fila.tarifa}</td>
                  <td>{fila.modificado}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <button className="tarifas__button">Ver historial completo</button>
          </div>
        </div>
      </div>
      <div className="tarifas__buttonsContainer">
        <button className="btn-secondary">CANCELAR</button>
        <button className="btn-primary">GUARDAR</button>
      </div>
    </section>
  );
};

export default TarifasPage;

import { useEffect, useState } from "react";
import FilterTarifas from "../components/FilterTarifas/FilterTarifas";
import "./TarifasHistoPage.css";
import type { Tarifa } from "../models/TarifasModel";
import { getTarifasHistorial } from "../services/tarifas.service";

const TarifasHistoPage = () => {
  const [tarifas, setTarifas] = useState<Array<Tarifa>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTarifas = async () => {
    try {
      setLoading(true);
      const response = await getTarifasHistorial();
      if (response.data) {
        setTarifas(response.data);
      } else {
        setError("No se pudieron cargar las tarifas");
      }
    } catch (error) {
      console.error("Error al cargar tarifas:", error);
      setError("Error al cargar el historial de tarifas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTarifas();
  }, []);

  return (
    <section className="tarifasHistorial__container">
      <h2 className="tarifas__title">HISTORIAL TARIFAS REGISTRADAS</h2>

      {loading ? (
        <div className="loading-message">Cargando historial de tarifas...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <FilterTarifas initialData={tarifas} />
      )}
    </section>
  );
};

export default TarifasHistoPage;

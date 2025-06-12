import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ResulCI.css";
import { useLocation, useNavigate } from "react-router-dom";

type Cliente = {
  id: string;
  ci: string;
  nombre: string;
  apellido: string;
  tipo: string;
};

type Vehiculo = {
  id: string;
  tipo: string;
  placa: string;
};

type FechaInicioPago = {
  anio: number;
  mes: number;
};

const ResultCI = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const cliente = state?.cliente as Cliente | undefined;

  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [tarifa, setTarifa] = useState(0);
  const [fechaInicioPago, setFechaInicioPago] = useState<FechaInicioPago | null>(null);
  const [meses, setMeses] = useState(0);
  const [anios, setAnios] = useState(0);
  const [fechasPago, setFechasPago] = useState<Date[]>([]);

  useEffect(() => {
    if (!cliente) {
      navigate("/cobros");
      return;
    }

    const fetchDatos = async () => {
      try {
        const resVehiculos = await axios.get(
          "https://backendproyectoparqueoumss.onrender.com/api/vehiculo/activos",
          { params: { idCliente: cliente.id } }
        );
        setVehiculos(resVehiculos.data);

        const resFecha = await axios.get(
          "https://backendproyectoparqueoumss.onrender.com/api/pago-parqueo/fecha-correspondiente-pago-parqueo",
          { params: { idCliente: cliente.id } }
        );
        setFechaInicioPago(resFecha.data);

        if (resVehiculos.data.length > 0) {
          const vehiculo = resVehiculos.data[0];
          const resTarifa = await axios.get(
            "https://backendproyectoparqueoumss.onrender.com/api/tarifa/vigente",
            {
              params: {
                idVehiculo: vehiculo.id,
                tipoCliente: cliente.tipo,
              },
            }
          );
          console.log("Vehículos recuperados:", resVehiculos.data);
          setTarifa(resTarifa.data.monto || 0);
        }
      } catch (err) {
        console.error("Error al obtener datos:", err);
      }
    };

    fetchDatos();
  }, [cliente, navigate]);

  const actualizarFechasPago = (nuevoMeses: number, nuevoAnios: number) => {
    const totalMeses = nuevoMeses + nuevoAnios * 12;
    if (totalMeses > 48) return; // Máximo 4 años

    setMeses(nuevoMeses);
    setAnios(nuevoAnios);

    if (!fechaInicioPago || tarifa === 0) return;

    const nuevasFechas: Date[] = [];
    const inicio = new Date(fechaInicioPago.anio, fechaInicioPago.mes - 1);

    for (let i = 0; i < totalMeses; i++) {
      const fecha = new Date(inicio);
      fecha.setMonth(inicio.getMonth() + i);
      nuevasFechas.push(fecha);
    }

    setFechasPago(nuevasFechas);
  };

  const sumarMeses = () => actualizarFechasPago(meses + 1, anios);
  const restarMeses = () => actualizarFechasPago(Math.max(0, meses - 1), anios);
  const sumarAnios = () => actualizarFechasPago(meses, anios + 1);
  const restarAnios = () => actualizarFechasPago(meses, Math.max(0, anios - 1));

  const formatearFecha = (fecha: Date) =>
    fecha.toLocaleDateString("es-BO", {
      month: "long",
      year: "numeric",
    });

  const confirmarCobro = async () => {
    if (!cliente || vehiculos.length === 0 || fechasPago.length === 0) {
      alert("Faltan datos para realizar el cobro.");
      return;
    }

    const payload = {
      idCliente: cliente.id,
      idVehiculo: vehiculos[0].id,
      fechas: fechasPago.map((fecha) => fecha.toISOString().split("T")[0]),
    };

    try {
      await axios.post(
        "https://backendproyectoparqueoumss.onrender.com/api/pago-parqueo",
        payload
      );
      alert("Cobro realizado exitosamente.");
      navigate("/cobros");
    } catch (err: any) {
      console.error("Error al realizar el cobro:", err);
      alert(
        err?.response?.data?.message ||
          "Ocurrió un error al intentar realizar el cobro."
      );
    }
  };

  return (
    <div className="container">
      <h2 className="title">REALIZAR COBRO</h2>

      <div className="info">
        <p>
          <strong>Nombre:</strong> {cliente?.nombre} {cliente?.apellido}
        </p>
        <p>
          <strong>Tipo de Usuario:</strong> {cliente?.tipo}
        </p>
        <p>
          <strong>Tipo de Vehículo:</strong>{" "}
          {vehiculos[0]?.tipo || "No encontrado"}
        </p>
      </div>

      <div className="section">
        <h3>1. Cantidad de meses o años a pagar</h3>
        <div className="input-group centered">
          <div className="input-control">
            <label>Meses:</label>
            <button onClick={restarMeses}>-</button>
            <input type="text" value={meses} readOnly />
            <button onClick={sumarMeses}>+</button>
          </div>
          <div className="input-control">
            <label>Años:</label>
            <button onClick={restarAnios}>-</button>
            <input type="text" value={anios} readOnly />
            <button onClick={sumarAnios}>+</button>
          </div>
        </div>
      </div>

      <div className="section">
        <h3>2. Detalles del Pago</h3>
        <div className="payment-section">
          <table className="payment-table">
            <thead>
              <tr>
                <th>Vehículo</th>
                <th>Mes</th>
                <th>Tarifa</th>
              </tr>
            </thead>
            <tbody>
              {fechasPago.map((fecha, index) => (
                <tr key={index}>
                  <td>
                    {vehiculos[0]?.tipo} - {vehiculos[0]?.placa}
                  </td>
                  <td>{formatearFecha(fecha)}</td>
                  <td>{tarifa} Bs.</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="payment-summary-box">
            <div className="payment-summary">
              <p>Monto Total: {fechasPago.length * tarifa} Bs.</p>
              <p>
                Fecha de Pago:{" "}
                {new Date().toLocaleDateString("es-BO", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </p>
            </div>
            <button className="confirm-button" onClick={confirmarCobro}>
              CONFIRMAR COBRO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCI;

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Modal from "../Modal/Modal";
import "./VistaUsuario.css";
import axios from "axios";

interface Cliente {
  idCliente: string;
  nombre: string;
  apellido: string;
  tipo: string;
}

interface Vehiculo {
  idVehiculo: string;
  tipo: string;
  placa: string;
  idCliente: string;
  idParqueo?: string;
}

const VistaUsuario: React.FC = () => {
  const location = useLocation();
  const cliente = location.state?.cliente as Cliente | undefined;

  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [tarifa, setTarifa] = useState<number>(0);
  const [fechaInicioPago, setFechaInicioPago] = useState<string>("");
  const [meses, setMeses] = useState<number>(0);
  const [anios, setAnios] = useState<number>(0);
  const [mostrarModal, setMostrarModal] = useState<boolean>(false);

  const idCajero = "CAJERO_123";

  if (!cliente) {
    return (
      <div>
        No se recibió información del cliente. Por favor, vuelva a buscar el CI.
      </div>
    );
  }

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const resVehiculos = await axios.post(
          "https://backendproyectoparqueoumss.onrender.com/api/vehiculo/activos",
          { id: cliente.id },
          { headers: { "Content-Type": "application/json" } }
        );

        const vehiculosCliente: Vehiculo[] = resVehiculos.data.data.filter(
          (v: Vehiculo) => String(v.idCliente) === String(cliente.idCliente)
        );
        setVehiculos(vehiculosCliente);

        if (vehiculosCliente.length > 0) {
          const resFecha = await axios.post(
            "https://backendproyectoparqueoumss.onrender.com/api/pago-parqueo/fecha-correspondiente-pago-parqueo",
            {
              idCajero: "55555555-5555-5555-5555-555555555555",
              idParqueo: vehiculosCliente[0].idParqueo,
            },
            { headers: { "Content-Type": "application/json" } }
          );

          setFechaInicioPago(resFecha.data.data?.fecha || "");
        }
      } catch (error) {
        console.error("Error al obtener vehículos o fecha:", error);
      }
    };

    obtenerDatos();
  }, [cliente]);


  useEffect(() => {
    const obtenerTarifa = async () => {
      try {
        const resTarifa = await axios.get(
          `https://backendproyectoparqueoumss.onrender.com/api/tarifa/vigente`,
          {
            params: {
              tipoCliente: cliente.tipo,
              tipoVehiculo: vehiculos[0].tipo,
            },
          }
        );

        setTarifa(resTarifa.data.data.monto);
      } catch (error) {
        console.error("Error al obtener tarifa:", error);
      }
    };

    if (vehiculos.length > 0) {
      obtenerTarifa();
    }
  }, [vehiculos, cliente]);

  const obtenerMesesPermitidos = (): number => {
    if (!fechaInicioPago) return 0;

    const inicio = new Date(fechaInicioPago);
    const ahora = new Date();
    inicio.setHours(0, 0, 0, 0);
    ahora.setHours(0, 0, 0, 0);

    if (inicio >= new Date(ahora.getFullYear(), ahora.getMonth(), 1)) {
      return 0;
    }

    const diffMeses =
      (ahora.getFullYear() - inicio.getFullYear()) * 12 +
      (ahora.getMonth() - inicio.getMonth());

    return diffMeses;
  };

 const cambiarValor = (tipo: "meses" | "anios", delta: number) => {
  const totalPermitido = obtenerMesesPermitidos();
  const totalActual = meses + anios * 12;

  console.log("Ejecutando cambiarValor", tipo, delta);
  console.log("Total permitido:", totalPermitido);
  console.log("Total actual:", totalActual);

  if (tipo === "meses") {
    const nuevoMeses = meses + delta;
    const nuevoTotal = nuevoMeses + anios * 12;
    if (nuevoMeses >= 0 && nuevoTotal <= totalPermitido) {
      setMeses(nuevoMeses);
    }
  }

  if (tipo === "anios") {
    const nuevoAnios = anios + delta;
    const nuevoTotal = meses + nuevoAnios * 12;
    if (nuevoAnios >= 0 && nuevoTotal <= totalPermitido) {
      setAnios(nuevoAnios);
    }
  }
};


  const generarMesesPago = (): string[] => {
    if (!fechaInicioPago || isNaN(new Date(fechaInicioPago).getTime())) return [];

    const fecha = new Date(fechaInicioPago);
    const totalSolicitado = meses + anios * 12;
    const maxMeses = obtenerMesesPermitidos();
    const totalFinal = Math.min(totalSolicitado, maxMeses);
    const resultado: string[] = [];

    for (let i = 0; i < totalFinal; i++) {
      const nuevaFecha = new Date(fecha);
      nuevaFecha.setMonth(fecha.getMonth() + i);
      const anio = nuevaFecha.getFullYear();
      const mes = String(nuevaFecha.getMonth() + 1).padStart(2, "0");
      resultado.push(`${anio}-${mes}-01`);
    }

    return resultado;
  };

  const confirmarCobro = async () => {
    setMostrarModal(false);

    try {
      if (cliente.idCliente === idCajero) {
        alert("El cajero no puede cobrarse a sí mismo.");
        return;
      }

      if (!vehiculos[0]) {
        alert("No se ha seleccionado un vehículo válido.");
        return;
      }

      const mesesPago = generarMesesPago();

      if (mesesPago.length === 0) {
        alert("Debe seleccionar al menos un mes o año para pagar.");
        return;
      }

      const montoTotal = mesesPago.length * tarifa;

      const payload = {
        idCliente: cliente.idCliente,
        idVehiculo: vehiculos[0].idVehiculo,
        meses: mesesPago,
        monto: montoTotal,
        idCajero,
      };

      const response = await axios.post(
        "https://backendproyectoparqueoumss.onrender.com/api/pago-parqueo",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      alert("Pago procesado exitosamente");
    } catch (error: any) {
      console.error(error);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  // ⬇️ Esto se recalcula cada render
  const pagos = generarMesesPago().map((fechaCompleta) => {
    const [anio, mes] = fechaCompleta.split("-");
    const fechaValida = new Date(`${anio}-${mes}-01`);
    const nombreMes = fechaValida.toLocaleString("es-ES", { month: "long" });

    return {
      vehiculo: `${vehiculos[0]?.tipo || ""} - ${vehiculos[0]?.placa || ""}`,
      mes: `${nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1)} - ${anio}`,
      tarifa: `${tarifa} Bs.`,
    };
  });

  const montoTotal = pagos.length * tarifa;


console.log("Render VistaUsuario");
console.log("meses:", meses, "años:", anios);
console.log("Pagos:", generarMesesPago());

  return (
    <div>
      <h1>REALIZAR COBRO</h1>

      <div className="info-container">
        <div className="info-left">
          <ul className="info-list">
            <li>
              <span className="info-label">Nombre:</span> {cliente.nombre} {cliente.apellido}
            </li>
            <li>
              <span className="info-label">Tipo de Usuario:</span> {cliente.tipo}
            </li>
          </ul>
        </div>

        <div className="info-right">
          <ul className="info-list">
            <li>
              <span className="info-label">Tipo de Vehículo:</span>{" "}
              {vehiculos[0]?.tipo || "Sin vehículo"}
            </li>
          </ul>
        </div>
      </div>

     <h3 className="res">1. Cantidad de meses o años a pagar</h3>
<p>
  Meses:
  <span className="contador">
    <button onClick={() => cambiarValor("meses", -1)} className="bot">-</button>
    <input type="number" value={meses} readOnly />
    <button onClick={() => cambiarValor("meses", 1)} className="bot">+</button>
  </span>
</p>

<p>
  Años:
  <span className="contador">
    <button onClick={() => cambiarValor("anios", -1)} className="bot">-</button>
    <input type="number" value={anios} readOnly />
    <button onClick={() => cambiarValor("anios", 1)} className="bot">+</button>
  </span>
</p>


      <h3 className="res">2. Detalles del Pago</h3>

      <div className="contenedor-pago">
        <table>
          <thead>
            <tr className="titul">
              <th>Vehículo</th>
              <th>Mes</th>
              <th>Tarifa</th>
            </tr>
          </thead>
          <tbody>
            {pagos.map((pago, index) => (
              <tr key={index}>
                <td>{pago.vehiculo}</td>
                <td>{pago.mes}</td>
                <td>{pago.tarifa}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="info-pago">
          <p>
            <strong>Monto Total:</strong> {montoTotal} Bs.
          </p>
          <p>
            <strong>Fecha de Inicio del Pago:</strong> {fechaInicioPago}
          </p>
          <button className="boton" onClick={() => setMostrarModal(true)}>
            CONFIRMAR COBRO
          </button>
        </div>
      </div>

      <Modal
        visible={mostrarModal}
        onClose={() => setMostrarModal(false)}
        onConfirm={confirmarCobro}
      />
    </div>
  );
};

export default VistaUsuario;

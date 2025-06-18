import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './VisualizarVehiculo.css';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

const VisualizarVehiculo = () => {
  const { id, idParqueo } = useParams();
  const [vehiculo, setVehiculo] = useState<any>(null);
 const axiosPrivate = useAxiosPrivate();
  useEffect(() => {
    const fetchVehiculo = async () => {
      try {
        const res = await axiosPrivate.get(`/usuario/${id}`);
        const usuario = Array.isArray(res.data) ? res.data[0] : res.data;
        console.log('Usuario recibido:', usuario);
      console.log('ID Parqueo desde URL:', idParqueo);

        const vehiculoEncontrado = usuario.vehiculos.find((v: any) => String(v.idParqueo) === String(idParqueo));
        console.log('Vehículo encontrado:', vehiculoEncontrado);
        if (vehiculoEncontrado) {
          setVehiculo(vehiculoEncontrado);
        } else {
          console.warn('Vehículo no encontrado.');
        }
      } catch (err) {
        console.error('Error al obtener datos del vehículo:', err);
      }
    };

    if (id && idParqueo) fetchVehiculo();
  }, [id, idParqueo]);

  if (!vehiculo) return <div>Cargando datos del vehículo...</div>;

  return (
    <div className="container">
      <h2>Vehículo</h2>
      <div className="content">
        <div className="form-section">
          <form>
            <div className="form-row">
              <label>Tipo Vehículo:</label>
              <input type="text" value={vehiculo.tipo || ''} readOnly />
            </div>
            <div className="form-row">
              <label>Placa:</label>
              <input type="text" value={vehiculo.placa || ''} readOnly />
            </div>
            <div className="form-row">
              <label>Marca:</label>
              <input type="text" value={vehiculo.marca || ''} readOnly />
            </div>
            <div className="form-row">
              <label>Modelo:</label>
              <input type="text" value={vehiculo.modelo || ''} readOnly />
            </div>
          </form>
        </div>
        <div className="image-section">
          <div className="form-row">
            <label>Foto Vehículo Delantera:</label>
            <img src={`data:image/png;base64,${vehiculo.fotoDelantera}`} alt="Delantera" />
          </div>
          <div className="form-row">
            <label>Foto Vehículo Trasera:</label>
            <img src={`data:image/png;base64,${vehiculo.fotoTrasera}`} alt="Trasera" />
          </div>
        </div>
      </div>
      <button className="back-button" onClick={() => window.history.back()}>Atrás</button>
    </div>
  );
};

export default VisualizarVehiculo;

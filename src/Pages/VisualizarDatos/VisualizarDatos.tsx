import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom'; 
import api from "../../api/axios";
import './VisualizarDatos.css';

const VisualizarDatos = () => {
  const { id } = useParams();
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await api.get(
          `/usuario/${id}`
        );

        if (Array.isArray(response.data) && response.data.length > 0) {
          setUsuario(response.data[0]);
        } else {
          console.warn('No se encontró usuario en la respuesta.');
        }
      } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
      }
    };

    if (id) fetchUsuario();
  }, [id]);

  if (!usuario) return <div>Cargando datos...</div>;

  return (
    <div className="container">
      <h2>{usuario.nombre} {usuario.apellido}</h2>
      <div className="content">
        <div className="form-section">
          <form>
            <div className="section-title">Datos Personales:</div>
            <div className="form-row">
              <label htmlFor="ci">C.I.:</label>
              <input id="ci" type="text" value={usuario.ci || ''} readOnly />
            </div>
            <div className="form-row">
              <label htmlFor="nombre">Nombre(s):</label>
              <input id="nombre" type="text" value={usuario.nombre || ''} readOnly />
            </div>
            <div className="form-row">
              <label htmlFor="apellido">Apellido(s):</label>
              <input id="apellido" type="text" value={usuario.apellido || ''} readOnly />
            </div>
            <div className="form-row">
              <label htmlFor="correo">Correo Electrónico:</label>
              <input id="correo" type="email" value={usuario.correo || ''} readOnly />
            </div>
            <div className="form-row">
              <label htmlFor="telefono">Teléfono:</label>
              <input id="telefono" type="text" value={usuario.nroCelular || ''} readOnly />
            </div>
            <div className="section-title">Datos Cuenta:</div>
            <div className="form-row">
              <label htmlFor="rol">Asignar rol:</label>
              <input id="rol" type="text" value={usuario.rolAsignado || ''} readOnly />
            </div>
            <div className="form-row">
              <label htmlFor="contrasenia">Contraseña:</label>
              <input id="contrasenia" type="password" value="********" readOnly />
            </div>
            <div className="form-row">
              <label htmlFor="estado">Estado:</label>
              <input id="estado" type="text" value={usuario.estadoParqueo || ''} readOnly />
            </div>
          </form>
        </div>
        <div className="image-section">
          <img
            src={`data:image/png;base64,${usuario.fotoUsuario}`}
            alt="Foto de perfil"
            className="imagen-perfil"
          />
          <div className="vehicles">
  <div className="form-row">
    <label>Vehículo(s):</label>
    {usuario.vehiculos?.map((v: any, index: number) => (
      <p key={index}>
        <Link to={`/vehiculo/${id}/${v.idParqueo}`}>
          {v.tipo} - {v.placa}
        </Link>
      </p>
    ))}
  </div>
</div>
          <button className="back-button">Atrás</button>
        </div>
      </div>
    </div>
  );
};

export default VisualizarDatos;

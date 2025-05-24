import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ResulCI.css';

const ResulCI = () => {
  const [ci, setCi] = useState('');
  const [cliente, setCliente] = useState<any>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // 👈 AÑADIR

  const buscarCliente = async () => {
    try {
      setError('');
      const res = await fetch('https://backendproyectoparqueoumss.onrender.com/api/cliente/activos');
      const data = await res.json();
      const clientes = data.data;
      const encontrado = clientes.find((c: any) => c.ci === ci);

      if (encontrado) {
        setCliente(encontrado);
      } else {
        setCliente(null);
        setError('Cliente no encontrado');
      }
    } catch (err) {
      console.error(err);
      setError('Error al buscar cliente');
    }
  };

  const getNombreCompleto = (cliente: any): string => {
    return `${cliente.nombre ?? ''} ${cliente.apellido ?? ''}`.trim();
  };

  const irAVistaUsuario = () => {
    navigate('/cobros/Formulario', { state: { cliente } }); // 👈 ENVÍA CLIENTE POR `state`
  };

  return (
    <div className='contenido'>
      <div className='titulo'>
        <h1>REALIZAR COBRO</h1>
      </div>

      <div className='buscar-contenido'>
        <label htmlFor='BuscadorCI'>Buscar por C.I: </label>
        <div className='input-con-icono'>
          <input
            type='text'
            className='BuscadorCI'
            id='BuscadorCI'
            placeholder='Buscar...'
            value={ci}
            onChange={e => setCi(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && buscarCliente()}
          />
          <img src='/src/assets/icons/Search.svg' alt="Buscar" className="icono-lupa" />
        </div>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {cliente && (
        <div className='resultado'>
          <p className='res'>Resultado(s):</p>
          <div className='tarjeta-usuario' onClick={irAVistaUsuario} style={{ cursor: 'pointer' }}>
            <table className='tabla'>
              <tbody>
                <tr>
                  <td className='icono-usuario'>
                    <img src='/icons/user.png' alt='Usuario' className='imagen-usuario' />
                  </td>
                  <td>
                    <div><b>{getNombreCompleto(cliente)}</b></div>
                    <div><small>{cliente.tipo}</small></div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResulCI;

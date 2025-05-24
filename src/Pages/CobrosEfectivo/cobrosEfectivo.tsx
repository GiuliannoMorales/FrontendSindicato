 import React, { useEffect, useState } from 'react';
import './cobrosEfectivo.css';

type Cliente = {
  id: string;
  ci: string;
  nombre: string;
  apellido: string;
  tipo: string;
};

const CobrosEfectivo: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [busquedaNombre, setBusquedaNombre] = useState('');
  const [busquedaCi, setBusquedaCi] = useState('');
  const [resultados, setResultados] = useState<Cliente[]>([]);

  useEffect(() => {
    const obtenerClientes = async () => {
      try {
        const res = await fetch('https://backendproyectoparqueoumss.onrender.com/api/cliente/activos');
        const data = await res.json();

        if (Array.isArray(data.data)) {
          setClientes(data.data);
        } else {
          console.error('La respuesta no contiene un array de clientes en "data"');
        }
      } catch (err) {
        console.error('Error al obtener clientes:', err);
      }
    };

    obtenerClientes();
  }, []);

  useEffect(() => {
    let filtrados: Cliente[] = [];

    if (busquedaNombre) {
      filtrados = clientes.filter(cliente =>
        `${cliente.nombre} ${cliente.apellido}`.toLowerCase().includes(busquedaNombre.toLowerCase())
      );
    } else if (busquedaCi) {
      filtrados = clientes.filter(cliente =>
        cliente.ci.toLowerCase().includes(busquedaCi.toLowerCase())
      );
    }

    setResultados(filtrados);
  }, [busquedaNombre, busquedaCi, clientes]);

  return (
    <div className='contenido'>
      <div className='titulo'>
        <h1>REALIZAR COBRO</h1>
      </div>

      <div className='buscar-contenido'>
        <label className='etiqueta'>Buscar por nombre:</label>
        <div className='input-con-icono'>
          <img src='/src/assets/icons/Search.svg' alt="Buscar" className="icono-lupa" />
          <input
            type='text'
            className='BuscadorNombre'
            placeholder='Buscar...'
            value={busquedaNombre}
            onChange={e => {
              setBusquedaNombre(e.target.value);
              setBusquedaCi('');
            }}
          />
        </div>
      </div>

      <div><p>o</p></div>

      <div className='buscar-contenido'>
        <label className='etiqueta'>Buscar por C.I.:</label>
        <div className='input-con-icono'>
          <img src='/src/assets/icons/Search.svg' alt="Buscar" className="icono-lupa" />
          <input
            type='text'
            className='BuscadorCi'
            placeholder='Buscar...'
            value={busquedaCi}
            onChange={e => {
              setBusquedaCi(e.target.value);
              setBusquedaNombre('');
            }}
          />
        </div>
      </div>

      {(busquedaNombre || busquedaCi) && (
        <div className='resultados'>
          <h3>Resultados:</h3>
          {resultados.length > 0 ? (
            <ul>
              {resultados.map(cliente => (
                <li key={cliente.id}>
                  {cliente.nombre} {cliente.apellido} - C.I. {cliente.ci} - {cliente.tipo}
                </li>
              ))}
            </ul>
          ) : (
            <p>No se encontraron resultados.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CobrosEfectivo;

import React from 'react'
import Layout from '../../components/Layout'
import './ResulCI.css';

const ResulCI = () => {
  return (
    <Layout>
      <div className='contenido'>
        <div className='titulo'>
          <h1>REALIZAR COBRO</h1>
        </div>

        <div className='buscar-contenido'>
          <label htmlFor='BuscadorCI'>Buscar por C.I: </label>
          <input type='text' className='BuscadorCI' id='BuscadorCI' placeholder='Buscar...'
          />
        </div>
        <div className='resultado'> 
            <p className='res'>Resultado(s):</p>
          <div className='tarjeta-usuario'>
            <table className='tabla'>
              <tbody>
                <tr>
                  <td className='icono-usuario'>
                    <img
                      src='/src/assets/react.svg'  alt='Usuario' className='imagen-usuario'
                    />
                  </td>
                  <td>
                    <div><b>JUAN MARTÍN MARTÍNEZ RAMÍREZ</b></div>
                    <div><small>Administrativo</small></div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ResulCI

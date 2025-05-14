import React from 'react'
import Layout from '../../components/Layout'
import './Resultado.css';

const ResultadoCI = () => {
  return (
    <Layout>
       <div className='contenido'>
        <div className='titulo'>
            <h1>REALIZAR COBRO</h1>
        </div>
        <div className='buscar-contenido'>
            <p>Buscar por C.I:  </p>
            <input type='text' className='BuscadorCI' id='BuscadorCI' placeholder='Buscar... ' />
        </div>
        <div>
            <p>Resultado(s):</p>
        </div>
        <div>
                  <table className='tabla'>
                      <tr>
                        <td>
                          <img src='https://www.gravatar.com/avatar/?d=mp&s=50' alt='Foto de perfil'> </img>
                        </td>
                        <td>
                          <div><b>JUAN MARTÍN MARTÍNEZ RAMÍREZ</b></div>
                          <div><small>Administrativo</small></div>
                        </td>
                      </tr>
          </table>
        </div>
    </div>
    </Layout>

  )
}

export default ResultadoCI

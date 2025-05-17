
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'

import EstadoCuenta from './Pages/EstadoCuenta';
import Inicio from './Pages/Inicio';
import CobrosEfectivo from './Pages/CobrosEfectivo/cobrosEfectivo';
import ResulCI from './Pages/ResulCI/ResulCI';
import VistaUsuario from './Pages/VistaUsuario/VistaUsuario';


const App: React.FC = () => {
  return (
		<Router>
			<Routes>
				<Route path='/' element={<Inicio />} />
				<Route path="/cuenta/estado" element={<EstadoCuenta />} />
				<Route path="/cobros/realizarCobros" element={<CobrosEfectivo />} />
				<Route path="/cobros/ResultadoCI" element={<ResulCI/>} />
				<Route path="/cobros/Formulario" element={<VistaUsuario/>} />
			</Routes>
		</Router>
	);
}

export default App


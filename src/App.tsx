
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'

import EstadoCuenta from './Pages/EstadoCuenta';
import Inicio from './Pages/Inicio';
import CobrosEfectivo from './Pages/CobrosEfectivo/cobrosEfectivo';
import ResulCI from './Pages/ResulCI/ResulCI';
import VistaUsuario from './Pages/VistaUsuario/VistaUsuario';
import TarifasHistoPage from './Pages/Tarifas/TarifasHistoPage/TarifasHistoPage';
import TarifasPage from './Pages/Tarifas/TarifasConfigPage/TarifasConfigPage';
import Layout from './components/Layout';


const App: React.FC = () => {
  return (
		<Router>
			<Routes>
				<Route path='/' element={<Layout/>}>
					<Route index element={<Inicio />}></Route>
					<Route path="/cuenta/estado" element={<EstadoCuenta />} />
					<Route path="/tarifas/historial" element={<TarifasHistoPage />} />
					<Route path="/tarifas/configuracion" element={<TarifasPage />} />
					<Route path="/cobros/realizarCobros" element={<CobrosEfectivo />} />
				    <Route path="/cobros/ResultadoCI" element={<ResulCI/>} />
				    <Route path="/cobros/Formulario/:id" element={<VistaUsuario />} />

				</Route>
			</Routes>
		</Router>
	);
}

export default App


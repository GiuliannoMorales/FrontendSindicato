
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'

import EstadoCuenta from './pages/EstadoCuenta';
import Inicio from './pages/Inicio';
import TarifasHistoPage from './pages/Tarifas/TarifasHistoPage/TarifasHistoPage';
import TarifasPage from './pages/Tarifas/TarifasConfigPage/TarifasConfigPage';
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

				</Route>
			</Routes>
		</Router>
	);

}

export default App

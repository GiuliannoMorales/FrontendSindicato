import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";

import EstadoCuenta from "./pages/EstadoCuenta/EstadoCuenta";
import Inicio from "./pages/Inicio";
import TarifasHistoPage from "./pages/Tarifas/TarifasHistoPage/TarifasHistoPage";
import TarifasPage from "./pages/Tarifas/TarifasConfigPage/TarifasConfigPage";
import User from "./pages/Users/User";
import Usuarios from "./pages/ListaUsuarios/Usuarios";
import RegistrarVehiculo from "./pages/RegistrarVehiculo/RegistrarVehiculo";
import Layout from "./components/Layout";
import LoginPage from "./pages/Login/LoginPage";
import RequireAuth from "./features/auth/RequireAuth";
import Unauthorized from "./pages/Unauthorized/Unauthorized";

const ROLES = {
  ADMIN: "ADMINISTRADOR",
  CAJERO: "CAJERO",
  CLIENTE: "CLIENTE",
};

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/unauthorized" element={<Unauthorized />}></Route>

        {/* protected routes  */}
        <Route element={<RequireAuth allowedRoles={[ROLES.ADMIN]}/>}>
          <Route path="/cuenta/estado" element={<EstadoCuenta />} />
          <Route path="/tarifas/historial" element={<TarifasHistoPage />} />
          <Route path="/tarifas/configuracion" element={<TarifasPage />} />
          <Route path="/registrar/usuario" element={<User />} />
          <Route path="/ver/usuarios" element={<Usuarios />} />
          <Route path="/registrar/vehiculo" element={<RegistrarVehiculo />} />
        </Route>
        <Route index element={<Inicio />}></Route>
      </Route>
    </Routes>
  );
};

export default App;

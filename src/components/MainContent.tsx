import { Outlet } from "react-router-dom";
import "./Layout.css";

export default function MainContent() {
  return (
    <main className="contenido">
      <div className="lineaAzul"></div>
      <Outlet />
    </main>
  );
}
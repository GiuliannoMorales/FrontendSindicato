import React, {ReactNode} from 'react';
import './Layout.css';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({children}: LayoutProps) {
  return (
    <div className="layout">
      <header>
        <div className="headerLogo">
          <img src="/Logo_umss.png" alt="Logo UMSS" height={'100%'} style={{objectFit: 'contain'}}/>
        </div>
        <div className="headerTitulo">
          <h1 className="titulo">SISTEMA DE GESTION DEL PARQUEO</h1>
          <div className="lineaRoja"></div>
        </div>
      </header>
      <aside></aside>
      <main className="contenido">
        <div className="lineaAzul"></div>
        {children}
      </main>
    </div>
  );
}

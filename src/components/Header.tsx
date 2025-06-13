import "./Layout.css";

export default function Header(
  { onMenuClick, sidebarOpen }: {
    onMenuClick: () => void;
    sidebarOpen: boolean;
  },
) {
  return (
    <header>
      <div className="headerLogo">
        <picture>
          <source srcSet="/Escudo_umss.png" media="(max-width: 768px)" />
          <img
            src="/Logo_umss.png"
            alt="Logo UMSS"
            style={{ objectFit: "cover" }}
          />
        </picture>
      </div>
      <div className="headerTitulo">
        <h1 className="titulo">SISTEMA DE GESTION DEL PARQUEO</h1>
        <div className="lineaRoja"></div>
      </div>
      <button
        className={`hamburguer${sidebarOpen ? " open" : ""}`}
        onClick={onMenuClick}
        aria-label="Abrir menu"
      >
        <span />
        <span />
        <span />
      </button>
    </header>
  );
}

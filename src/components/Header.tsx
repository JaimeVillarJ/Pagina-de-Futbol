import "../styles/header.css";
import { Link } from 'react-router-dom';

type Props = {
  categoria: string | null
}

export const Header = ({categoria}: Props) => {
  

  function handleLogout() {
    localStorage.removeItem("usuario");
    localStorage.removeItem("categoria");
    window.location.href = "/"; // redirigir al inicio
  }

  return (
    <>
    <header className="header">
        <div className="subHeader">
            <h1 className="logo">
              <img src="/images/logo10.png" alt="logo" height={50} width={100}/>
              <span className="blanco">LIGA </span>
              <span className="bogota">BOGOTA</span>
            </h1>
            <nav className="nav">
                <ul className="nav-list">
                <li><Link to="/">Noticias</Link></li>
                <li><Link to="/Calendario">Calendario</Link></li>
                <li><Link to="/Posiciones">Tabla de Posiciones</Link></li>
                <li><a href="#">Contacto</a></li>
                {categoria !== "admin" ? <li><Link to="/Login">Autenticar</Link></li> : null}
                {categoria === "admin" ? <li className="cerrar-sesion" onClick={handleLogout} style={{ cursor: "pointer" }}>Cerrar sesion</li> : null}
                </ul>
            </nav>
        </div>
      <div className="titulo-header">
        <h1>LA MEJOR LIGA DE BOGOTA <br /> THE BEST BOGOTA'S LIGUE </h1>
        {/*<img className="imagen" src="/images/logo10.png" alt="logo" height={220} width={390} /> */}
      </div>
    </header>
    </>
  );
};
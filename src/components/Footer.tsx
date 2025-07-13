
export const Footer = () => {
  return (
    <footer className="footer">
    <h1 className="logo">
        <img src="/images/logo10.png" alt="logo" height={50} width={100}/>
        <span className="blanco">LIGA </span>
        <span className="bogota">BOGOTA</span>
    </h1>
    <div className="informacion">
    <div className="Mira nuestro contenido en redes">
        <h1>Contactanos:</h1>
        <a>Instagram: @LigaBogota</a>
        <p>X: @LigaBogota</p>
        <p>Facebook: Liga Bogota</p>
    </div>
    <div className="contactos">
        <h1>Contactanos:</h1>
        <p>Correo: LigaBogota@gmail.com</p>
        <p>Telefono: (601) 555 5555</p>
    </div>
    <div className="Explora">
        <h1>Explora</h1>
        <p>¿Quienes Somos?</p>
        <p>¿En que sedes jugamos?</p>
        <p>¿En que temporadas hay torneos?</p>
        <p>¿Como inscribirte a los torneos?</p>
    </div>    
    </div>
    <p>© 2025 LIGA BOGOTÁ. Todos los derechos reservados.</p>
</footer>
  )
}

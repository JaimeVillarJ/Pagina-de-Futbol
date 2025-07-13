import { useState } from "react"
import "../styles/login.css";

export const Login = () => {

  const [usuario, setUsuario] = useState("");
  const [contrasena, setContraseña] = useState("");

  function handleChangeUsuario(e: React.ChangeEvent<HTMLInputElement>){
      setUsuario(e.target.value);
  }

  function handleChangeContraseña(e: React.ChangeEvent<HTMLInputElement>){
    setContraseña(e.target.value);
  }

  async function handleSubmit() {
    try {
      const res = await fetch('http://localhost:3000/api/Usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, contrasena })
      });

      const data = await res.json();

      if (res.ok) {
        alert(`Bienvenido ${data.usuario} (${data.categoria})`);
        // Guardar en localStorage
        localStorage.setItem("usuario", data.usuario);
        localStorage.setItem("categoria", data.categoria);

  // Opcional: redirigir a la página principal
  window.location.href = "/";
      } else {
        alert(`❌ ${data.mensaje}`);
      }
    } catch (error) {
      console.error('Error al hacer login:', error);
    }

    setUsuario('');
    setContraseña('');
  }


  return (
    <>
        <div className="contenedor-login">
            <div className="contenedor-formulario">
                <h1>Iniciar Sesión</h1>
                <p>Usuario</p>
                <input type="text" placeholder="Usuario" value={usuario} onChange={handleChangeUsuario}/>
                <p>Contraseña</p>
                <input type="password" placeholder="Contraseña" value={contrasena} onChange={handleChangeContraseña}/>
                <br />
                <button type="submit" onClick={handleSubmit}>Ingresar</button>
            </div>
            <p>¿Eres nuevo? <a id="link" href="#">Click Aqui</a></p>
            <p>¿Olvido su contraseña? <a id="link" href="#">Click Aqui</a></p>
        </div>
    </>
  )
}



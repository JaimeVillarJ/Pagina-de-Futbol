import "../styles/general.css";
import "../styles/calendario.css";
import { useEffect, useState } from "react";
import axios from "axios";
import type { partidos } from "../types/types";

export const Calendario = () => {

  const [equipo1, setEquipo1] = useState("");
  const [equipo2, setEquipo2] = useState("");
  const [marcador1, setMarcador1] = useState<number>();
  const [marcador2, setMarcador2] = useState<number>();
  const [dia, setDia] = useState("");
  const [lugar, setLugar] = useState("");
  const [hora, setHora] = useState("");

  const [partidos, setPartidos] = useState<partidos[]>([]);
  const [cargarPartidos, setCargarPartidos] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3000/api/partidos')
    .then(response => {
        setPartidos(response.data);
        setCargarPartidos(false);
    })
    .catch(() => {
      alert("❌ error al cargar los partidos");
      setCargarPartidos(false);
    })
  })

  async function handleSubmit() {
    try {
      const response = await axios.post('http://localhost:3000/api/partidos', {
        equipo1, equipo2, marcador1, marcador2, dia, lugar, hora
      });
      setPartidos((prev) => [...prev, response.data]);
      
      setEquipo1("");
      setEquipo2("");
      setMarcador1(-1);
      setMarcador2(-1);
      setDia("");
      setLugar("");
      setHora("");
      alert("✅ Partido subido correctamente");
    } catch (err) {
      alert("❌ Error al insertar la este partido");
      console.log(equipo1, equipo2, marcador1, marcador2, dia, lugar, hora);
      
    }
  }

  return (
    <>
        <div className="contenedor-calendario">
            <h1 className="titulo-general">Calendario de Partidos</h1>
            <div className="contenedor-inputs">
              <h1>Datos del partido</h1>
              <h3>Ingresa los equipos</h3>
              <input type="text" value={equipo1} onChange={(e) => setEquipo1(e.target.value)}/>
              <input type="text" value={equipo2} onChange={(e) => setEquipo2(e.target.value)}/>
              <h3>Ingrese marcador (si ya se dio el partido)</h3>
              <input type="text" value={marcador1} onChange={(e) => setMarcador1(Number(e.target.value))}/>
              <input type="text" value={marcador2} onChange={(e) => setMarcador2(Number(e.target.value))}/>
              <h3>Ingresa el dia</h3>
              <input type="text" value={dia} onChange={(e) => setDia(e.target.value)}/>
              <h3>Ingresa el lugar</h3>
              <input type="text" value={lugar} onChange={(e) => setLugar(e.target.value)}/>
              <h3>Ingresa la hora</h3>
              <input type="text" value={hora} onChange={(e) => setHora(e.target.value)}/>
              <br />
              <button type="submit" className="boton-subir-partidos" onClick={handleSubmit}>Subir</button>
            </div>
            <div className="partidos">
              {partidos.map((item) => (
                <div key={item.id}>
                  <p>{ item.equipo1 }</p>
                  <p>{ item.marcador1 }</p>
                  <p>{ item.marcador2 }</p>
                  <p>{ item.equipo2 }</p>
                  <p>{ item.dia }</p>
                  <p>{ item.lugar }</p>
                  <p>{ item.hora }</p>
                </div>
              ))}
            </div>
        </div>
        
    </>
  )
}

import { useEffect, useState } from "react";
import type { posicion } from "../types/types";
import axios from "axios";
import '../styles/posiciones.css';

export const Posiciones = () => {
  
  const [posicion, setPosicion] = useState<posicion[]>();

  useEffect(() => {
        axios.get('http://localhost:3000/api/posiciones')
        .then(response => {
            setPosicion(response.data);
        })
        .catch(error => {
            console.error('Error al obtener el inventario:', error);
        });
    }, []);
  
  console.log(">>>", posicion);

  return (
    <>
      <div className="container-noticia">
          <h1 className="titulo-general">Tabla de Posiciones</h1>
          <div>
            {posicion?.map((item) => (
              <>
                <div className="posicion" key={item.id}>
                  <p>{item.Equipo}</p>
                  <p>{item["partidos jugados"]}</p>
                  <p>{item["Partidos Ganados"]}</p>
                  <p>{item["Partidos Perdidos"]}</p>
                  <p>{item["Partidos Empatados"]}</p>
                  <p>{item["Goles Favor"]}</p>
                  <p>{item["Goles Contra"]}</p>
                  <p>{item.Diferencia}</p>
                  <p>{item.Amarillas}</p>
                  <p>{item.Rojas}</p>
                  <p>{item.FairPlay}</p>
                  <p>{item.Puntos}</p>
                </div>
              </>
            ))}
          </div>
      </div>
      
    </>
  )
}

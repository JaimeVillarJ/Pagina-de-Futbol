import { useEffect, useState } from "react";
import type { posicion } from "../types/types";
import axios from "axios";
import '../styles/posiciones.css';

export const Posiciones = () => {
  
  const [posicion, setPosicion] = useState<posicion[]>();

  const API_LINK = process.env.VITE_API_LINK;

  useEffect(() => {
        axios.get(`${API_LINK}/api/posiciones`)
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

          <div className="contenedor-tabla">
            <div className="cabecera-posiciones">
              <div className="equipo-header">Equipo</div>
              <div className="stats-header">
                <span>PJ</span>
                <span>PG</span>
                <span>PP</span>
                <span>PE</span>
                <span>GF</span>
                <span>GC</span>
                <span>DIF</span>
                <span>FP</span>
                <span>PTS</span>
              </div>
            </div>

            {posicion?.sort((a, b) => {
              if (b.Puntos !== a.Puntos) {
                return b.Puntos - a.Puntos;
              }

              if (b.FairPlay !== a.FairPlay) {
                return b.FairPlay - a.FairPlay;
              }

              return b.Diferencia - a.Diferencia;
            }).map((item) => (
              <>
                <div className="posicion">
                  <div className="equipo">{item.Equipo}</div>
                  <div className="stats">
                    <span>{item["partidos jugados"]}</span>
                    <span>{item["Partidos Ganados"]}</span>
                    <span>{item["Partidos Perdidos"]}</span>
                    <span>{item["Partidos Empatados"]}</span>
                    <span>{item["Goles Favor"]}</span>
                    <span>{item["Goles Contra"]}</span>
                    <span>{item.Diferencia}</span>
                    <span>{item.FairPlay}</span>
                    <span>{item.Puntos}</span>
                  </div>
                </div>
              </>
            ))}
          </div>
      </div>
      
    </>
  )
}

import "../styles/general.css";
import "../styles/calendario.css";
import { useEffect, useState } from "react";
import axios from "axios";
import type { partidos, escudos } from "../types/types";

type Props = {
    categoria : string | null
}

export const Calendario = ({categoria} : Props) => {
  const [equipo1, setEquipo1] = useState("");
  const [equipo2, setEquipo2] = useState("");
  const [marcador1, setMarcador1] = useState<number>();
  const [marcador2, setMarcador2] = useState<number>();
  const [dia, setDia] = useState("");
  const [lugar, setLugar] = useState("");
  const [hora, setHora] = useState("");

  const [editar, setEditar] = useState(false);
  const [id, setId] = useState(0);

  const [partidos, setPartidos] = useState<partidos[]>([]);
  const [escudos, setEscudos] = useState<escudos[]>([]);
  const [cargarPartidos, setCargarPartidos] = useState(true);

  // ✅ Solo se ejecuta una vez al montar
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/partidos")
      .then((response) => {
        setPartidos(response.data);
        setCargarPartidos(false);
      })
      .catch(() => {
        alert("❌ Error al cargar los partidos");
        setCargarPartidos(false);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/escudos")
      .then((response) => {
        setEscudos(response.data);
      })
      .catch(() => {
        alert("❌ Error al cargar los escudos");
      });
  }, []);

  async function handleSubmit() {
    try {
      const response = await axios.post("http://localhost:3000/api/partidos", {
        equipo1,
        equipo2,
        marcador1,
        marcador2,
        dia,
        lugar,
        hora,
      });
      setPartidos((prev) => [...prev, response.data]);

      // Reiniciar campos
      setEquipo1("");
      setEquipo2("");
      setMarcador1(undefined);
      setMarcador2(undefined);
      setDia("");
      setLugar("");
      setHora("");

      alert("✅ Partido subido correctamente");
    } catch (err) {
      alert("❌ Error al insertar este partido");
      console.log(equipo1, equipo2, marcador1, marcador2, dia, lugar, hora);
    }
  }

  const editarPartido = async (id: number, nuevoTitulo : string, nuevoLink : string, nuevoTexto : string) => {
        try {
            const response = await axios.put(`http://localhost:3000/api/Noticias/${id}`, {
                titulo : nuevoTitulo,
                link: nuevoLink,
                texto : nuevoTexto
            });
            setEditar(false);
            setId(0);
            console.log('✅ Imagen actualizada:', response.data);
        } catch (error) {
            console.error('❌ Error al actualizar:', error);
        }
    };

    const eliminarPartido = async (id: number) => {
        const confirmar = window.confirm("¿Estás seguro de que deseas eliminar esta noticia?");
        if (!confirmar) return;

        try {
            const response = await axios.delete(`http://localhost:3000/api/Noticias/${id}`);
            console.log(response.data.mensaje);

            // Quitar la noticia eliminada del estado
            setPartidos(partidos.filter((n) => n.id !== id));
        } catch (error) {
            console.error('❌ Error al eliminar la noticia:', error);
        }
    };

  return (
    <>
      <div className="contenedor-calendario">
        <h1 className="titulo-general">Calendario de Partidos</h1>

        {
          categoria === "admin" ? 
          <div className="contenedor-inputs">
            <h1>Datos del partido</h1>

            <h3>Ingresa los equipos</h3>
            <input type="text" value={equipo1} onChange={(e) => setEquipo1(e.target.value)} />
            <input type="text" value={equipo2} onChange={(e) => setEquipo2(e.target.value)} />

            <h3>Ingrese marcador (si ya se dio el partido)</h3>
            <input type="number" value={marcador1 ?? ''} onChange={(e) => setMarcador1(Number(e.target.value))} />
            <input type="number" value={marcador2 ?? ''} onChange={(e) => setMarcador2(Number(e.target.value))} />

            <h3>Ingresa el día</h3>
            <input type="text" value={dia} onChange={(e) => setDia(e.target.value)} />

            <h3>Ingresa el lugar</h3>
            <input type="text" value={lugar} onChange={(e) => setLugar(e.target.value)} />

            <h3>Ingresa la hora</h3>
            <input type="text" value={hora} onChange={(e) => setHora(e.target.value)} />

            <br />
            <button type="submit" className="boton-subir-partidos" onClick={handleSubmit}>
              Subir
            </button>
          </div>
          : null
        }
        

        <div className="partidos">
          {partidos.map((item) => {
            const escudoEquipo1 = escudos.find((e) => e.nombre === item.equipo1);
            const escudoEquipo2 = escudos.find((e) => e.nombre === item.equipo2);

            return (
              <div key={item.id} className="lista-partidos">
                <div className="datos-patido">
                  <p>{item.dia}</p>
                  <p>{item.lugar}</p>
                  <p>{item.hora}</p>
                </div>

                <div className="equipos-partido">
                  {escudoEquipo1 && (
                    <img className="escudo" src={escudoEquipo1.escudoURL} alt={`Escudo de ${item.equipo1}`} />
                  )}

                  {item.marcador1 === -1 ? (
                    <h1 className="vs">VS</h1>
                  ) : (
                    <>
                      <h1>{item.marcador1}</h1>
                      <p>-</p>
                      <h1>{item.marcador2}</h1>
                    </>
                  )}
                  {escudoEquipo2 && (
                    <img className="escudo" src={escudoEquipo2.escudoURL} alt={`Escudo de ${item.equipo2}`} />
                  )}
                </div>
                <button onClick={() => editarPartido}>Editar</button>
                <button>Borrar</button>
              </div>
            );
          } 
          )}
        </div>
      </div>
    </>
  );
};

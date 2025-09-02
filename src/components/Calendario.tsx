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

  const [id, setId] = useState(0);

  const [idFairplay, setIdFairplay] = useState(0);
  const [amarillas1, setAmarillas1] = useState(0);
  const [rojas1, setRojas1] = useState(0);
  const [amarillas2, setAmarillas2] = useState(0);
  const [rojas2, setRojas2] = useState(0);

  const [partidos, setPartidos] = useState<partidos[]>([]);
  const [escudos, setEscudos] = useState<escudos[]>([]);
  const [cargarPartidos, setCargarPartidos] = useState(true);

  // ✅ Solo se ejecuta una vez al montar
  const API_LINK = process.env.REACT_APP_API_LINK;
  useEffect(() => {
    axios
      .get(`${API_LINK}/api/partidos`)
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
      .get(`${API_LINK}/api/escudos`)
      .then((response) => {
        setEscudos(response.data);
      })
      .catch(() => {
        alert("❌ Error al cargar los escudos");
      });
  }, []);

  async function handleSubmit() {
    try {
      const response = await axios.post(`${API_LINK}/api/partidos`, {
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

  const handleEditar = (item : partidos) => {
    setId(item.id);
    setEquipo1(item.equipo1);
    setEquipo2(item.equipo2);
    setMarcador1(item.marcador1);
    setMarcador2(item.marcador2);
    setDia(item.dia);
    setLugar(item.lugar);
    setHora(item.hora);
  }

  const handleCancelar = () => {
    setId(0);
  }

  const editarPartido = async (id: number, nuevoEquipo1 : string, nuevoEquipo2: string, nuevoMarcador1: number, nuevoMarcador2: number, nuevoDia: string, nuevoLugar: string, nuevaHora: string) => {
        try {
            const response = await axios.put(`${API_LINK}/api/partidos/${id}`, {
                equipo1 : nuevoEquipo1,
                equipo2 : nuevoEquipo2,
                marcador1 : nuevoMarcador1,
                marcador2 : nuevoMarcador2,
                dia : nuevoDia,
                lugar : nuevoLugar,
                hora : nuevaHora
            });
            setId(0);
            setEquipo1("");
            setEquipo2("");
            setMarcador1(undefined);
            setMarcador2(undefined);
            setDia("");
            setLugar("");
            setHora("");
            console.log('✅ Partido actualizado:', response.data);
        } catch (error) {
            console.error('❌ Error al actualizar:', error);
        }
    };

    const eliminarPartido = async (id: number) => {
        const confirmar = window.confirm("¿Estás seguro de que deseas eliminar esta noticia?");
        if (!confirmar) return;

        try {
            const response = await axios.delete(`${API_LINK}/api/partidos/${id}`);
            console.log(response.data.mensaje);
            setPartidos(partidos.filter((n) => n.id !== id));
            alert("✅ Partido eliminado corectamente");
        } catch (error) {
            console.error('❌ Error al eliminar el partido:', error);
            alert('❌ Error al eliminar el partido');
        }
    };

    const subir = async (equipo1 : string, equipo2 : string, marcador1 : number, marcador2 : number) => {
        if ( marcador1 > marcador2) {
            await axios.put(`${API_LINK}/api/posiciones/${id}`, {
              equipo : equipo1,
              definicionPartido : "ganado",
              golesFavor : marcador1,
              golesContra : marcador2
            });
            await axios.put(`${API_LINK}/api/posiciones/${id}`, {
              equipo : equipo2,
              definicionPartido : "perdido",
              golesFavor : marcador2,
              golesContra : marcador1
            });
            console.log(1);
            
        } 

        if ( marcador1 < marcador2) {
            await axios.put(`${API_LINK}/api/posiciones/${id}`, {
              equipo : equipo1,
              definicionPartido : "perdido",
              golesFavor : marcador1,
              golesContra : marcador2
            });
            await axios.put(`${API_LINK}/api/posiciones/${id}`, {
              equipo : equipo2,
              definicionPartido : "ganado",
              golesFavor : marcador2,
              golesContra : marcador1
            });
            console.log(2);
            
        } 

        if ( marcador1 === marcador2) {
            await axios.put(`${API_LINK}/api/posiciones/${id}`, {
              equipo : equipo1,
              definicionPartido : "empatado",
              golesFavor : marcador1,
              golesContra : marcador2
            });
            await axios.put(`${API_LINK}/api/posiciones/${id}`, {
              equipo : equipo2,
              definicionPartido : "empatado",
              golesFavor : marcador2,
              golesContra : marcador1
            });
            console.log(3);
            
        } 

        console.log(equipo1, equipo2, marcador1, marcador2);
        
        alert("✅ Partido subido correctamente")

    }

    const actualizarFairPlay = async (equipo1 : string, equipo2 : string, amarillas1 : number, amarillas2 : number, rojas1 : number, rojas2 : number) => {

        try {
          await Promise.allSettled([
            axios.put(`${API_LINK}/api/posiciones/fairplay/${equipo1}`, {
              equipo: equipo1,
              amarillas: amarillas1,
              rojas: rojas1
            }),
            axios.put(`${API_LINK}/api/posiciones/fairplay/${equipo2}`, {
              equipo: equipo2,
              amarillas: amarillas2,
              rojas: rojas2
            }),
          ]);
        } catch (error) {
          console.error("❌ Error al actualizar FairPlay:", error);
          alert("❌ Hubo un problema actualizando FairPlay");
        }
        

        alert("✅ FairPlay actualizado correctamente");
        
    } 

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
        
        {cargarPartidos ? (
          <p className="cargando">Cargando partidos...</p>
        ) : (
        <div className="partidos">
          {partidos.sort((a, b) => a.id - b.id).map((item) => {
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
                {
                  item.id === id ?

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
                        <button type="submit" className="boton-subir-partidos" onClick={ () => editarPartido(item.id, equipo1, equipo2, marcador1!, marcador2!, dia, lugar, hora) }>
                          Subir
                        </button>
                        <button className="boton-subir-partidos" onClick={() => handleCancelar()}>
                          Cancelar
                        </button>
                      </div>
                    : null
                }
                {
                  item.id === idFairplay ?
                  
                  <div className="contenedor-inputs">

                    <h3>Ingrese amarillas (Llenar todos lso campos)</h3>
                    <input type="number" onChange={(e) => setAmarillas1(Number(e.target.value))} />
                    <input type="number" onChange={(e) => setAmarillas2(Number(e.target.value))} />

                    <h3>Ingrese rojas (Llenar todos los campos)</h3>
                    <input type="number" onChange={(e) => setRojas1(Number(e.target.value))} />
                    <input type="number" onChange={(e) => setRojas2(Number(e.target.value))} />
                
                    <button onClick={() => actualizarFairPlay(item.equipo1,item.equipo2,amarillas1,amarillas2,rojas1,rojas2)}>Subir</button>

                  </div>
                  : null
                }
                {categoria === "admin" ?
                  <>
                    <button onClick={() => handleEditar(item)}>Editar</button>
                    <button onClick={() => eliminarPartido(item.id)}>Borrar</button>
                    <button onClick={() => subir(item.equipo1, item.equipo2, item.marcador1, item.marcador2)}>Subir</button>
                    <button onClick={() => setIdFairplay(item.id)}>FairPlay</button>
                  </>
                : null
                }
              </div>
            );
          } 
          )}
        </div>
        )}
      </div>
    </>
  );
};

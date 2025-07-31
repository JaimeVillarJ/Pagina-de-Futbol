import axios from "axios";
import { useEffect, useState } from "react"
import type { goleador } from "../types/types";
import '../styles/goleadores.css';

type Props = {
    categoria : string | null
}

export const Goleadores = ({categoria} : Props) => {

    const [lista, setLista] = useState<goleador[]>([]);

    const [equipo, setEquipo] = useState("");
    const [nombre, setNombre] = useState("");
    const [goles, setGoles] = useState(0);

    useEffect(() => {
        axios.get('http://localhost:3000/api/Goleadores')
        .then(response => {
            setLista(response.data);
        })
        .catch(error => {
            console.error('Error al obtener el inventario:', error);
        });
    }, []);

    const subir = async (Equipo : string, Nombre : string, Goles : number) => {
        try {
            await axios.post("http://localhost:3000/api/Goleadores", {
            Equipo : Equipo,
            Nombre : Nombre,
            Goles : Goles
        });
            setEquipo("");
            setNombre("");
            setGoles(0);

            alert("✅ Se subieron los datos correctamente");

        } catch (error) {
            alert("❌ Error al insertar este partido");
            console.log(error);
        }
        
    }

    return (
        <div className="contenedor-calendario">
        
            <div className="titulo-general">Tabla de Goleadores</div>
            <>
                {categoria === "admin" ?
                    <div className="contenedor-inputs">

                        <h3>Diligencia los datos (Equipo, Jugador, Goles)</h3>
                        <input type="text" onChange={(e) => setEquipo(e.target.value)} />
                        <input type="text" onChange={(e) => setNombre(e.target.value)} />
                        <input type="number" onChange={(e) => setGoles(Number(e.target.value))} />

                        <button onClick={() => subir(equipo, nombre, goles)}>Subir</button>

                    </div>
                    : null
                }
            </>

            <div className="contenedor-goleadores">
                <div className="goleadores">
                            <span className="cabecera">Equipo</span>
                            <span className="cabecera">Nombre</span>
                            <span className="cabecera">Goles</span>
                        </div>
                {lista.sort((a, b) => b.Goles- a.Goles).map((item) => (
                        <div className="goleadores">
                            <span>{item.Equipo}</span>
                            <span>{item.Nombre}</span>
                            <span>{item.Goles}</span>
                        </div>
                ))}
            </div>

        </div>
    )
}

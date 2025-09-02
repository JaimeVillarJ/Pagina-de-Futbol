import { useState, useEffect } from "react"
import type { noticia } from "../types/types";
import "../styles/noticias.css";
import "../styles/general.css";
import axios from "axios";

//Para acceder al storage de supabase
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_KEY);

type Props = {
    categoria : string | null
}

// Aqui ya empieza el componente
export const Noticias = ({categoria} : Props) => {

    const [titulo, setTitulo] = useState<string>("");
    const [imagen, setImagen] =useState<File | null>(null);
    const [texto, setTexto] = useState<string>("");
    const [uploading, setUploading] = useState(false);
    const [imagenUrl, setImagenUrl] = useState("");
    const [editar, setEditar] = useState(false);
    const [id, setId] = useState(0);

    const [noticias, setNoticias] = useState<noticia[]>([]);
    const [cargandoNoticias, setCargandoNoticias] = useState(true);

    const API_LINK = import.meta.env.VITE_API_LINK;

    useEffect(() => {
        axios.get(`${API_LINK}/api/Noticias`)
        .then(response => {
            setNoticias(response.data);
            setCargandoNoticias(false);
        })
        .catch(error => {
            console.error('Error al obtener el inventario:', error);
            setCargandoNoticias(false);
        });
    }, []);

    // Mostrar mensaje de carga hasta que ambos estén listos
    if (cargandoNoticias) {
        return <p>Cargando datos...</p>;
    }
  
    const handleEditar = (id : number) => {
        setId(id);
        setEditar(true);
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
        if (file) {
        setImagen(file);
        }
    };

    // Sube la imagen a Supabase Storage
    const uploadImage = async () => {
        if (!imagen) {
            alert("Selecciona una imagen primero");
            return;
        }

        try {
            setUploading(true);

            const fileName = `${Date.now()}_${imagen.name}`;

            const { error: uploadError } = await supabase.storage
            .from("imagenes") // Bucket
            .upload(`noticias/${fileName}`, imagen, { // Ruta en el bucket
                cacheControl: "3600",
                upsert: false,
                contentType: imagen.type,
            });

            if (uploadError) {
            throw uploadError;
            }

            // Obtener URL pública de la imagen
            const { data } = supabase
            .storage
            .from("imagenes")
            .getPublicUrl(`noticias/${fileName}`);

            const publicURL = data.publicUrl;
            setImagenUrl(publicURL);
            console.log("Id: " + id);
            console.log("Titulo: " + titulo);
            console.log("ImagenUrl: " + imagenUrl);
            console.log("Texto: " + texto);
            
            editar === false ? await handleSubmit(titulo, publicURL, texto) : actualizarImagen(id, titulo, imagenUrl, texto);
            alert("Imagen subida correctamente!");
        } catch (error: any) {
            alert("Error subiendo la imagen: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (titulo : string, link : string, texto : string) => {
        
        try {
        const response = await axios.post(`${API_LINK}/api/Noticias`, {
            titulo, link, texto
        });

        // Agregar la nueva noticia al estado
        setNoticias((prev) => [...prev, response.data]);

        // Limpiar los campos
        setTitulo("");
        setTexto("");
        setImagen(null);
        } catch (error) {
            console.error('❌ Error al insertar la imagen:', error);
        }
    };

    const actualizarImagen = async (id: number, nuevoTitulo : string, nuevoLink : string, nuevoTexto : string) => {
        try {
            const response = await axios.put(`${API_LINK}/api/Noticias/${id}`, {
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

    const eliminarNoticia = async (id: number) => {
        const confirmar = window.confirm("¿Estás seguro de que deseas eliminar esta noticia?");
        if (!confirmar) return;

        try {
            const response = await axios.delete(`${API_LINK}/api/Noticias/${id}`);
            console.log(response.data.mensaje);

            // Quitar la noticia eliminada del estado
            setNoticias(noticias.filter((n) => n.id !== id));
        } catch (error) {
            console.error('❌ Error al eliminar la noticia:', error);
        }
    };


    return (
        <div className="container">
            {editar === false ? 
                <>
                    {categoria === "admin" ? 
                        <div className="cuadro-publicar">
                            <h1>INGRESAR NOTICIA</h1>
                            <div className="input">
                                <input name="titulo" type="text" value={titulo} placeholder="Ingrese Titulo" onChange={(e) => {setTitulo(e.target.value)}}/>
                                <div className="subir">
                                    <p>Subir Imagen:</p>
                                    <input type="file" accept="imagenes/*" onChange={handleFileChange}/>
                                </div>
                                <textarea className="input-texto" name="texto" value={texto} placeholder="Ingrese texto(complete todo el campo)" onChange={(e) => {setTexto(e.target.value)}}/>
                            </div>
                            <div className="boton">
                                <button onClick={uploadImage}>{uploading ? "Publicando..." : "Publicar"}</button>
                            </div>
                        </div>
                    : null }
                </>
            : null }
            <div className="container-noticia">
                <h1 className="titulo-general">NOVEDADES DE LA SEMANA</h1>
                {noticias.map((item) => (
                    <div className="contenido-noticia" key={item.id}>
                        {(item.id % 2) === (1) ? 
                            <>
                                { item.id !== id ? (
                                    <>
                                        <img className="imagen-noticia" src={`${item.link}`} alt="imagen"/>
                                        <div className="contenedor-texto">
                                            <h1 className="titulo">{item.titulo}</h1>
                                            <p className="texto">{item.texto}</p>
                                        </div>
                                    </>
                                    ) : null
                                }
                            </>
                            :
                            <>
                                { item.id !== id ? (
                                    <>
                                        <div className="contenedor-texto-izquierda">
                                            <h1 className="titulo-izquierda">{item.titulo}</h1>
                                            <p className="texto-izquierda">{item.texto}</p>
                                        </div>
                                        <img className="imagen-noticia-izquierda" src={`${item.link}`} alt="imagen"/>
                                    </>
                                    ) : null
                                }
                            </>
                        }
                        
                        {item.id === id ? (
                            <div className="input" key={item.id}>
                                <input name="titulo" type="text" value={titulo} placeholder="Ingrese Titulo" onChange={(e) => setTitulo(e.target.value)} />
                                <div className="subir">
                                    <p>Subir Imagen:</p>
                                    <input type="file" accept="imagenes/*" onChange={handleFileChange}/>
                                </div>
                                <textarea className="input-texto" name="texto" value={texto} placeholder="Ingrese texto" onChange={(e) => setTexto(e.target.value)} />
                                <button className="boton-editar" onClick={uploadImage}>Guardar</button>
                            </div>
                        ) : (
                            categoria === "admin" ? <div className="botones-edicion">
                                <button className="boton-editar" onClick={() => handleEditar(item.id)}>Editar</button>
                                <button className="boton-editar" onClick={() => eliminarNoticia(item.id)}>Borrar</button>
                            </div> : null
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

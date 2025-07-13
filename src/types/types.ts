export interface inventario {
    id : number,
    nombre : string,
    tipo : string
}

export interface imagenes {
    id : number,
    link : string
}

export interface noticia {
    id : number,
    titulo : string,
    texto : string,
    link : string
}

export interface partidos {
    id : number,
    equipo1 : string,
    equipo2 : string,
    marcador1 : number,
    marcador2 : number,
    dia : string,
    lugar : string,
    hora : string
}

export interface escudos {
    id : number,
    nombre : string,
    escudoURL : string
}
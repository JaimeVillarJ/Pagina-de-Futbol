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

export interface posicion {
    id : number,
    Equipo : string,
    "partidos jugados" : number,
    "Partidos Ganados" : number,
    "Partidos Perdidos" : number,
    "Partidos Empatados" : number,
    "Goles Favor" : number,
    "Goles Contra" : number,
    Diferencia : number,
    Amarillas : number,
    Rojas : number,
    FairPlay : number,
    Puntos : number
}

export interface goleador {
    Equipo : string,
    Nombre : string,
    Goles : number
}
export interface Personaje {  // Cambié "Miniature" a "Personaje"
    id: string;
    name: string;
    image: string;
    units: number;
    strength: number;
    animeName: string;  // Agregué el campo "animeName" según el formulario
    genre: string;      // Agregué el campo "genre" según el formulario
}

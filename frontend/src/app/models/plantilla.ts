export interface Plantilla {
  id?: number;
  nombre: string;
  identificador: string;
}

export interface ContenidoPlantilla {
  id?: number;
  id_cat: number;
  id_plantilla: number;
  titulo: string;
  body?: string; // JSON string
  fecha_pub: Date;
}

export interface Contenido {
  id?: number;
  id_cat: number;
  id_plantilla: number;
  titulo: string;
  body?: string;
  fecha_pub: Date;
}

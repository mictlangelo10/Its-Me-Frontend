export interface Categoria {
  id?: number;
  id_usuario: number;
  titulo: string;
  descripcion: string;
  fecha_pub: Date;
  hasContent?: boolean; // Propiedad para indicar si la categoría tiene contenido
}

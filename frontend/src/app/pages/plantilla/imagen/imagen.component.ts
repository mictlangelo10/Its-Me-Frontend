import { Component } from '@angular/core';

@Component({
  selector: 'app-imagen',
  templateUrl: './imagen.component.html',
  styleUrl: './imagen.component.css'
})
export class ImagenComponent {
  titulo: string = '';
  descripcion: string = '';
  imagenUrl: string | ArrayBuffer | null = null;

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagenUrl = e.target?.result;
      };
      reader.readAsDataURL(file);
    }
  }

  guardar(): void {
    console.log('Título:', this.titulo);
    console.log('Descripción:', this.descripcion);
    console.log('Imagen URL:', this.imagenUrl);
  }

}

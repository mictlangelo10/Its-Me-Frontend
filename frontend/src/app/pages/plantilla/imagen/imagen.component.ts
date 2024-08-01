// imagen.component.ts
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-imagen',
  templateUrl: './imagen.component.html',
  styleUrls: ['./imagen.component.css'],
})
export class ImagenComponent {
  @Output() imagenCambiada = new EventEmitter<string>();
  titulo: string = '';
  descripcion: string = '';
  imagenUrl: string | ArrayBuffer | null = null;

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagenUrl = e.target?.result;
        this.onChange();
      };
      reader.readAsDataURL(file);
    }
  }

  onChange(): void {
    const jsonBody = JSON.stringify({
      titulo: this.titulo,
      descripcion: this.descripcion,
      imagenUrl: this.imagenUrl,
    });
    this.imagenCambiada.emit(jsonBody);
  }
}

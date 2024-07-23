import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-imgtext',
  templateUrl: './imgtext.component.html',
  styleUrl: './imgtext.component.css'
  
})
export class ImgtextComponent {
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

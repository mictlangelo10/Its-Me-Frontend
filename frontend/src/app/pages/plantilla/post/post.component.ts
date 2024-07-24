import { Component, Output, EventEmitter  } from '@angular/core';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent {
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  
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
    // Implementa la lógica para guardar los datos
    const contenido = {
      titulo: this.titulo,
      descripcion: this.descripcion,
      imagenUrl: this.imagenUrl
    };
    this.closeModal.emit(contenido);
  }

}

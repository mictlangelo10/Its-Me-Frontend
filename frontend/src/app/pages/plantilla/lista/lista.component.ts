import { Component } from '@angular/core';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrl: './lista.component.css'
})
export class ListaComponent {
  listTitle: string;
  items: string[] = ['', '', '']; // Iniciar con tres elementos obligatorios

  agregarElemento(): void {
    this.items.push('');
  }

  eliminarElemento(index: number): void {
    if (this.items.length > 3) {
      this.items.splice(index, 1);
    } else {
      alert('La lista debe tener al menos tres elementos.');
    }
  }

  guardar(): void {
    // Implementa la lógica para guardar los datos
    console.log('Título de la Lista:', this.listTitle);
    console.log('Elementos de la Lista:', this.items);
  }

}

import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css'],
})
export class ListaComponent {
  @Output() listaCambiada = new EventEmitter<string>();
  listTitle: string = '';
  items: string[] = ['', '', ''];

  agregarElemento(): void {
    this.listTitle;
    this.items = [...this.items, '']; // Copia del array con el nuevo elemento
    //console.log('Items', this.items);
    this.onChange();
  }

  eliminarElemento(index: number): void {
    if (this.items.length > 3) {
      this.items = this.items.filter((_, i) => i !== index); // Copia del array sin el elemento eliminado
      this.onChange();
    } else {
      alert('La lista debe tener al menos tres elementos.');
    }
  }

  onChange(): void {
    const jsonBody = JSON.stringify({ elementos: this.items });
    //console.log(jsonBody);
    this.listaCambiada.emit(jsonBody);
  }

  trackByFn(index: number, item: any): number {
    return index; // o cualquier propiedad única de los items
  }
}

import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-listacomparativa',
  templateUrl: './listacomparativa.component.html',
  styleUrls: ['./listacomparativa.component.css'],
})
export class ListacomparativaComponent {
  @Output() comparativaCambiada = new EventEmitter<string>();
  comparativaTitulo: string = '';
  columna1Titulo: string = '';
  columna2Titulo: string = '';
  columna1Rows: string[] = [];
  columna2Rows: string[] = [];

  agregarFilaColumna1(): void {
    this.columna1Rows = [...this.columna1Rows, ''];
    this.onChange();
  }

  agregarFilaColumna2(): void {
    this.columna2Rows = [...this.columna2Rows, ''];
    this.onChange();
  }

  eliminarFilaColumna1(index: number): void {
    this.columna1Rows = this.columna1Rows.filter((_, i) => i !== index);
    this.onChange();
  }

  eliminarFilaColumna2(index: number): void {
    this.columna2Rows = this.columna2Rows.filter((_, i) => i !== index);
    this.onChange();
  }

  onChange(): void {
    const jsonBody = JSON.stringify({
      columna1: {
        titulo: this.columna1Titulo,
        filas: this.columna1Rows,
      },
      columna2: {
        titulo: this.columna2Titulo,
        filas: this.columna2Rows,
      },
    });
    this.comparativaCambiada.emit(jsonBody);
  }

  trackByFn(index: number): number {
    return index; // o cualquier propiedad única de los items
  }
}

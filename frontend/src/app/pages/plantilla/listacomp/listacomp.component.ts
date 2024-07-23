import { Component } from '@angular/core';

@Component({
  selector: 'app-listacomp',
  templateUrl: './listacomp.component.html',
  styleUrl: './listacomp.component.css'
})
export class ListacompComponent {
  comparativaTitulo: string;
  columna1Titulo: string;
  columna2Titulo: string;
  columna1Rows: string[] = [];
  columna2Rows: string[] = [];

  agregarFilaColumna1(): void {
    this.columna1Rows.push('');
  }

  agregarFilaColumna2(): void {
    this.columna2Rows.push('');
  }

  eliminarFilaColumna1(index: number): void {
    this.columna1Rows.splice(index, 1);
  }

  eliminarFilaColumna2(index: number): void {
    this.columna2Rows.splice(index, 1);
  }

  guardar(): void {
    // Implementa la lógica para guardar los datos
    console.log('Título Comparativa:', this.comparativaTitulo);
    console.log('Título Columna 1:', this.columna1Titulo);
    console.log('Título Columna 2:', this.columna2Titulo);
    console.log('Filas Columna 1:', this.columna1Rows);
    console.log('Filas Columna 2:', this.columna2Rows);
  }

}

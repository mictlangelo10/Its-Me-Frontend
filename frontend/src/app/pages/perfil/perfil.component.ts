import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css',
})
export class PerfilComponent {
  contenidoGuardado: any = null;

  constructor(private modalService: NgbModal) {}

  abrirModal(): void {
    const modalRef = this.modalService.open(PostComponent);
    modalRef.result.then((result) => {
      if (result) {
        this.contenidoGuardado = result;
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  verContenido(): void {
    // Lógica para mostrar el contenido guardado
  }
}

import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css',
})
export class PerfilComponent {
  hasContent: boolean = false;
  contentData: any;
  showModal: boolean = false;

  openModal() {
    this.showModal = true;
    console.log(this.showModal)
  }

  closeModal() {
    this.showModal = false;
  }

  saveContent(data: any) {
    this.hasContent = true;
    this.contentData = data;
    this.closeModal();
  }
}

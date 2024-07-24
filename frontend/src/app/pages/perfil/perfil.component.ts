import { Component } from '@angular/core';

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

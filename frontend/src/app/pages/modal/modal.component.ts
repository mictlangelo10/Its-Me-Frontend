import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ListaComponent } from '../plantilla/lista/lista.component';
import { ListacomparativaComponent } from '../plantilla/listacomparativa/listacomparativa.component';
import { ImagenComponent } from '../plantilla/imagen/imagen.component';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  @Input() contentData: any;
  @Output() save = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  selectedTemplate: string;
  templates = {
    template1: ListaComponent,
    template2: ListacomparativaComponent,
    template3: ImagenComponent
  };

  onSave() {
    this.save.emit(this.contentData);
  }

  onClose() {
    this.close.emit();
  }

}

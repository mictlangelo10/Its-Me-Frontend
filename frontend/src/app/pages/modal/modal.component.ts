import {
  Component,
  EventEmitter,
  Injector,
  Input,
  Output,
} from '@angular/core';
import { ListaComponent } from '../plantilla/lista/lista.component';
import { ListacomparativaComponent } from '../plantilla/listacomparativa/listacomparativa.component';
import { ImagenComponent } from '../plantilla/imagen/imagen.component';
import { Categoria } from '../../models/categoria';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent {
  @Input() contentData: any;
  @Input() selectedCategory: Categoria | null; // Aceptar categoría como input
  @Output() save = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  selectedTemplate: string = 'template1'; // Default to "Lista"
  templates = {
    ListaComponent,
    ListacomparativaComponent,
    ImagenComponent,
  };

  constructor(private injector: Injector) {}

  get componentInjector() {
    return Injector.create({
      providers: [
        { provide: 'contentData', useValue: this.contentData },
        { provide: 'selectedCategory', useValue: this.selectedCategory },
      ],
      parent: this.injector,
    });
  }

  onSave() {
    this.save.emit(this.contentData);
  }

  onClose() {
    this.close.emit();
  }
}

import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ListaComponent } from '../plantilla/lista/lista.component';
import { Usuario } from '../../models/usuario';
import { UsuarioService } from '../../services/usuario.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { CategoriaService } from '../../services/categoria.service';
import { Categoria } from '../../models/categoria';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PlantillaService } from '../../services/plantilla.service';
import { ContenidoPlantilla, Plantilla } from '../../models/plantilla';
import { Router } from '@angular/router';
import { ListacomparativaComponent } from '../plantilla/listacomparativa/listacomparativa.component';
import { ImagenComponent } from '../plantilla/imagen/imagen.component';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css',
})
export class PerfilComponent implements OnInit {
  @ViewChild(ListaComponent, { static: false }) listaComponent: ListaComponent;
  @ViewChild(ListacomparativaComponent)
  comparativaComponent: ListacomparativaComponent;

  @ViewChild(ImagenComponent) imagenComponent: ImagenComponent;

  hasContent: boolean = false;
  currentContent: ContenidoPlantilla | null = null;
  contentData: any;
  showModal: boolean = false;
  showModalCategory: boolean = false;
  usuario: Usuario | null = null;
  editMode: boolean = false;
  profileForm: FormGroup;
  categoryForm: FormGroup;
  usernameExists: boolean = false;
  usernameActual: String;
  categorias: Categoria[] = [];
  selectedCategory: Categoria | null = null;
  selectedTemplate: Plantilla | null = null;
  plantillas: any[] = [];
  showContentModal: boolean = false;
  showComparativaModal: boolean = false;
  showPublicacionModal: boolean = false;
  listElements: string[] = [];

  // Añadido: Propiedades para almacenar datos de las plantillas
  comparativaTitulo: string = '';
  columna1Titulo: string = '';
  columna1Rows: string[] = [];
  columna2Titulo: string = '';
  columna2Rows: string[] = [];
  publicacionTitulo: string = '';
  publicacionDescripcion: string = '';
  imagenUrl: string = '';

  contenidoPlantilla: ContenidoPlantilla = {
    id_cat: 0, // Asignar el ID de la categoría correspondiente
    id_plantilla: 0, // Asignar el ID de la plantilla seleccionada
    titulo: '', // Este título se establecerá desde el `listTitle` en `app-lista`
    body: '',
    fecha_pub: new Date(),
  };

  constructor(
    private usuarioService: UsuarioService,
    private categoriaService: CategoriaService,
    private plantillaService: PlantillaService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(20)]],
      username: ['', Validators.required],
      descripcion: [''],
    });
    this.categoryForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: [''],
    });
  }

  get nombre() {
    return this.profileForm.get('nombre');
  }

  get username() {
    return this.profileForm.get('username');
  }

  ngOnInit(): void {
    this.loadUserData();
    this.loadPlantillasData();
    this.subscribeToTemplateChanges();
  }

  loadPlantillasData(): void {
    this.plantillaService.getPlantillas().subscribe((data) => {
      this.plantillas = data;
    });
  }

  loadUserData(): void {
    this.usuarioService.getUserInfo().subscribe(
      (user) => {
        this.usuario = user;
        this.usernameActual = this.profileForm.value.username;
        this.loadCategorias();
      },
      (error) => {
        console.error('Error al cargar la información del usuario', error);
      }
    );
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
    this.loadUserData();
  }

  checkUpdate(): void {
    if (this.usuario) {
      const newUsername = this.profileForm.value.username;
      if (newUsername !== this.usernameActual) {
        this.usuarioService.checkUsername(newUsername).subscribe(
          (response) => {
            if (response.exists) {
              this.toastr.error(
                'El username no está disponible',
                'Error de actualización'
              );
            } else {
              this.updateUsuario();
            }
          },
          (error) => {
            console.error('Error checking username', error);
          }
        );
      } else {
        this.updateUsuario();
      }
    } else {
      console.error('No hay usuario para actualizar');
    }
  }

  private updateUsuario(): void {
    if (this.usuario) {
      this.usuarioService
        .updateUsuario(this.usuario.id, this.usuario)
        .subscribe(
          (updatedUser) => {
            this.usuario = updatedUser;
            this.toastr.success('Usuario actualizado exitosamente', 'Éxito');
            this.toggleEditMode();
          },
          (error) => {
            console.error('Error al actualizar el usuario', error);
          }
        );
    }
  }

  // Método para abrir el modal y decidir si mostrar contenido existente o permitir la edición
  openModal(categoria: Categoria): void {
    this.selectedCategory = categoria;
    if (categoria.hasContent) {
      this.loadExistingContent(categoria.id!);
    } else {
      this.showModal = true;
    }
  }

  closeModal(): void {
    this.showModal = false;
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (this.usuario) {
          this.usuario.foto = reader.result as string; // Asigna el resultado a la propiedad de la foto del usuario
        }
      };
      reader.readAsDataURL(file);
    }
  }

  onUsernameChange(username: string): void {
    this.usuarioService.checkUsername(username).subscribe(
      (response) => {
        this.usernameExists = response.exists;
      },
      (error) => {
        console.error('Error checking username', error);
      }
    );
  }

  removePhoto(): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esto',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminarla',
      cancelButtonText: 'No, cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuario.foto = ''; // Establece el campo de foto como vacío
        this.updateUsuario(); // Llama al método para actualizar el usuario
      }
    });
  }

  openCategoryModal(categoria: Categoria | null = null): void {
    this.selectedCategory = categoria;
    this.categoryForm.patchValue({
      titulo: categoria?.titulo || '',
      descripcion: categoria?.descripcion || '',
    });
    this.showModalCategory = true; // Asegúrate de que esta línea está presente
  }

  closeCategoryModal(): void {
    this.showModalCategory = false;
    this.selectedCategory = null;
    this.categoryForm.reset();
  }

  saveCategory(): void {
    if (this.categoryForm.invalid) {
      this.toastr.error(
        'El formulario es inválido. Por favor, completa todos los campos requeridos.',
        'Error'
      );
      return;
    }

    const categoriaData = {
      id_usuario: this.usuario?.id || 0,
      titulo: this.categoryForm.value.titulo,
      descripcion: this.categoryForm.value.descripcion,
      fecha_pub: new Date(),
    };

    if (this.selectedCategory) {
      // Actualizar categoría existente
      this.categoriaService
        .updateCategoria(this.selectedCategory.id!, categoriaData)
        .subscribe(
          (response) => {
            this.toastr.success('Categoría actualizada exitosamente', 'Éxito');
            this.closeCategoryModal();
            this.loadCategorias();
          },
          (error) => {
            console.error('Error al actualizar la categoría', error);
            this.toastr.error('Error al actualizar la categoría', 'Error');
          }
        );
    } else {
      // Crear nueva categoría
      this.categoriaService.createCategoria(categoriaData).subscribe(
        (response) => {
          this.toastr.success('Categoría creada exitosamente', 'Éxito');
          this.closeCategoryModal();
          this.loadCategorias();
        },
        (error) => {
          console.error('Error al crear la categoría', error);
          this.toastr.error('Error al crear la categoría', 'Error');
        }
      );
    }
  }

  loadCategorias(): void {
    if (this.usuario) {
      this.categoriaService.getCategoriasByUser(this.usuario.id).subscribe(
        (categorias) => {
          this.categorias = categorias;
          this.categorias.forEach((categoria) => {
            this.checkForExistingContent(categoria.id!);
          });
        },
        (error) => {
          console.error('Error al cargar las categorías', error);
        }
      );
    }
  }

  deleteCategory(categoria: Categoria): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esto',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminarla',
      cancelButtonText: 'No, cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoriaService.deleteCategoria(categoria.id!).subscribe(
          (response) => {
            this.toastr.success('Categoría eliminada exitosamente', 'Éxito');
            this.loadCategorias();
          },
          (error) => {
            console.error('Error al eliminar la categoría', error);
            this.toastr.error('Error al eliminar la categoría', 'Error');
          }
        );
      }
    });
  }

  subscribeToTemplateChanges(): void {
    if (this.listaComponent) {
      this.listaComponent.listaCambiada.subscribe((jsonBody: string) => {
        console.log('Recibiendo lista cambiada en PerfilComponent:', jsonBody); // <-- Añadir log
        this.handleListaCambiada(jsonBody);
      });
    }
  }

  handleListaCambiada(jsonBody: string): void {
    this.contenidoPlantilla.body = jsonBody;
  }

  onTemplateSelect(template: Plantilla): void {
    this.selectedTemplate = template;
  }

  saveContent(): void {
    if (this.selectedCategory) {
      this.contenidoPlantilla.id_cat = this.selectedCategory.id!;
      this.contenidoPlantilla.id_plantilla = this.selectedTemplate?.id || 0;
      this.contenidoPlantilla.fecha_pub = new Date();

      if (this.listaComponent) {
        // Datos de la lista numerada
        this.contenidoPlantilla.titulo = this.listaComponent.listTitle;
        this.contenidoPlantilla.body = JSON.stringify({
          elementos: this.listaComponent.items,
        });
      } else if (this.comparativaComponent) {
        // Datos de la lista comparativa
        this.contenidoPlantilla.titulo =
          this.comparativaComponent.comparativaTitulo;
        this.contenidoPlantilla.body = JSON.stringify({
          columna1Titulo: this.comparativaComponent.columna1Titulo,
          columna1: this.comparativaComponent.columna1Rows,
          columna2Titulo: this.comparativaComponent.columna2Titulo,
          columna2: this.comparativaComponent.columna2Rows,
        });
      } else if (this.imagenComponent) {
        // Datos de la imagen y descripción
        this.contenidoPlantilla.titulo = this.imagenComponent.titulo;
        this.contenidoPlantilla.body = JSON.stringify({
          descripcion: this.imagenComponent.descripcion,
          imagenUrl: this.imagenComponent.imagenUrl,
        });
      }

      // Verificar si ya existe contenido para la categoría seleccionada
      this.plantillaService
        .getContentByCategory(this.selectedCategory.id!)
        .subscribe(
          (contents) => {
            if (contents.length > 0) {
              // Actualizar contenido existente
              this.plantillaService
                .updateContent(this.contenidoPlantilla)
                .subscribe(
                  (response) => {
                    this.toastr.success(
                      'Contenido actualizado exitosamente',
                      'Éxito'
                    );
                    this.loadCategorias();
                    this.closeModal();
                  },
                  (error) => {
                    console.error('Error al actualizar el contenido:', error);
                    this.toastr.error(
                      'Error al actualizar el contenido',
                      'Error'
                    );
                  }
                );
            } else {
              // Crear nuevo contenido
              this.plantillaService
                .createContent(this.contenidoPlantilla)
                .subscribe(
                  (response) => {
                    this.toastr.success(
                      'Contenido guardado exitosamente',
                      'Éxito'
                    );
                    this.loadCategorias();
                    this.closeModal();
                  },
                  (error) => {
                    console.error('Error al guardar el contenido:', error);
                    this.toastr.error('Error al guardar el contenido', 'Error');
                  }
                );
            }
          },
          (error) => {
            console.error('Error al verificar el contenido existente:', error);
            this.toastr.error(
              'Error al verificar el contenido existente',
              'Error'
            );
          }
        );
    } else {
      this.toastr.error('Debe seleccionar una categoría primero', 'Error');
    }
  }

  handleComparativaCambiada(jsonBody: string): void {
    this.contenidoPlantilla.body = jsonBody;
  }

  handleImagenCambiada(jsonBody: string): void {
    this.contenidoPlantilla.body = jsonBody;
  }

  deleteProfile(): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esto',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar perfil',
      cancelButtonText: 'No, cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.usuario) {
          this.usuarioService.deleteUsuario(this.usuario.id).subscribe(
            () => {
              this.toastr.success('Perfil eliminado exitosamente', 'Éxito');
              sessionStorage.removeItem('token');
              this.router.navigate(['/register']);
            },
            (error) => {
              console.error('Error al eliminar el perfil', error);
              this.toastr.error('Error al eliminar el perfil', 'Error');
            }
          );
        }
      }
    });
  }

  // Método para verificar la existencia de contenido y actualizar la categoría con el estado
  checkForExistingContent(id_cat: number): void {
    this.plantillaService.checkContentExistence(id_cat).subscribe(
      (response) => {
        const category = this.categorias.find((cat) => cat.id === id_cat);
        if (category) {
          category.hasContent = response.contentExists;
        }
      },
      (error) => {
        console.error('Error al verificar la existencia del contenido:', error);
        this.toastr.error(
          'Error al verificar la existencia del contenido',
          'Error'
        );
      }
    );
  }

  openContentModal(): void {
    this.showContentModal = true;
  }

  closeContentModal(): void {
    this.showContentModal = false;
  }

  openComparativaModal(): void {
    this.showComparativaModal = true;
  }

  closeComparativaModal(): void {
    this.showComparativaModal = false;
  }

  openPublicacionModal(): void {
    this.showPublicacionModal = true;
  }

  closePublicacionModal(): void {
    this.showPublicacionModal = false;
  }

  // Método para cargar el contenido existente
  /*loadExistingContent(id_cat: number): void {
    this.plantillaService.getContentByCategory(id_cat).subscribe(
      (content) => {
        if (content.length > 0) {
          console.log(content);
          this.currentContent = content[0];
          console.log(this.currentContent);
          this.selectedTemplate = this.plantillas.find(
            (plantilla) => plantilla.id === this.currentContent.id_plantilla
          );
          console.log(this.selectedTemplate);
          const data = this.currentContent.body
            ? JSON.parse(this.currentContent.body)
            : {};

          console.log(data);

          // Deshabilitar cambio de plantilla y mostrar contenido
          //      this.selectedTemplate = null;

          this.showModal = true;

          if (this.currentContent.id_plantilla === 1) {
            console.log('asas', this.currentContent);
            // Asumiendo '1' para listas numeradas
            if (this.listaComponent) {
              this.listaComponent.listTitle = this.currentContent.titulo;
              this.listaComponent.items = data.elementos || [];
            } else {
              console.log('Test', this.listaComponent);
              console.error('ListaComponent no inicializado');
            }
          } else if (this.currentContent.id_plantilla === 2) {
            // Asumiendo '2' para listas comparativas
            if (this.comparativaComponent) {
              this.comparativaComponent.comparativaTitulo =
                this.currentContent.titulo;
              this.comparativaComponent.columna1Titulo =
                data.columna1Titulo || '';
              this.comparativaComponent.columna1Rows = data.columna1 || [];
              this.comparativaComponent.columna2Titulo =
                data.columna2Titulo || '';
              this.comparativaComponent.columna2Rows = data.columna2 || [];
            } else {
              console.error('ListacomparativaComponent no inicializado');
              console.log(this.comparativaComponent);
            }
          } else if (this.currentContent.id_plantilla === 3) {
            // Asumiendo '3' para imagen
            if (this.imagenComponent) {
              this.imagenComponent.titulo = this.currentContent.titulo;
              this.imagenComponent.descripcion = data.descripcion || '';
              this.imagenComponent.imagenUrl = data.imagenUrl || '';
            } else {
              console.log(this.comparativaComponent);
              console.error('ImagenComponent no inicializado');
            }
          }
        }
      },
      (error) => {
        console.error('Error al cargar el contenido existente:', error);
        this.toastr.error('Error al cargar el contenido existente', 'Error');
      }
    );
  }*/
  loadExistingContent(id_cat: number): void {
    this.plantillaService.getContentByCategory(id_cat).subscribe(
      (content) => {
        if (content.length > 0) {
          this.currentContent = content[0];
          const data = this.currentContent.body
            ? JSON.parse(this.currentContent.body)
            : {};

          if (this.currentContent.id_plantilla === 1) {
            this.listElements = data.elementos || [];
            this.openContentModal();
          } else if (this.currentContent.id_plantilla === 2) {
            // Lista Comparativa
            this.comparativaTitulo = this.currentContent.titulo;
            this.columna1Titulo = data.columna1Titulo || '';
            this.columna1Rows = data.columna1 || [];
            this.columna2Titulo = data.columna2Titulo || '';
            this.columna2Rows = data.columna2 || [];
            this.openComparativaModal();
          } else if (this.currentContent.id_plantilla === 3) {
            // Publicación
            this.publicacionTitulo = this.currentContent.titulo;
            this.publicacionDescripcion = data.descripcion || '';
            this.imagenUrl = data.imagenUrl || '';
            this.openPublicacionModal();
          }
        }
      },
      (error) => {
        console.error('Error al cargar el contenido existente:', error);
        this.toastr.error('Error al cargar el contenido existente', 'Error');
      }
    );
  }
}

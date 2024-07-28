import { Component } from '@angular/core';
import { Usuario } from '../../models/usuario';
import { UsuarioService } from '../../services/usuario.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { CategoriaService } from '../../services/categoria.service';
import { Categoria } from '../../models/categoria';
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
  showModalCategory: boolean = false;
  usuario: Usuario | null = null;
  editMode: boolean = false;
  profileForm: FormGroup;
  categoryForm: FormGroup;
  usernameExists: boolean = false;
  usernameActual: String;
  categorias: Categoria[] = [];
  selectedCategory: Categoria | null = null;
  selectedTemplate: string = 'template1'; // Default template

  constructor(
    private usuarioService: UsuarioService,
    private categoriaService: CategoriaService,
    private fb: FormBuilder,
    private toastr: ToastrService
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

  openModal(categoria: Categoria): void {
    this.selectedCategory = categoria;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveContent(): void {
    this.toastr.success('Contenido guardado exitosamente', 'Éxito');
    this.closeModal();
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
    this.showModalCategory = true;
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
}

import { ChangeDetectorRef, Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Usuario } from '../../models/usuario';
import { UsuarioService } from '../../services/usuario.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css',
})
export class PerfilComponent {
  hasContent: boolean = false;
  contentData: any;
  showModal: boolean = false;
  usuario: Usuario | null = null;
  editMode: boolean = false;
  profileForm: FormGroup;
  usernameExists: boolean = false;
  usernameActual: String;

  constructor(
    private usuarioService: UsuarioService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.profileForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(20)]],
      username: ['', Validators.required],
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

  openModal() {
    this.showModal = true;
    console.log(this.showModal);
  }

  closeModal() {
    this.showModal = false;
  }

  saveContent(data: any) {
    this.hasContent = true;
    this.contentData = data;
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
}

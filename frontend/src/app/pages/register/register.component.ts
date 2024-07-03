import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Usuario } from '../../models/usuario';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  usuario: Usuario;

  constructor(private fb: FormBuilder, private usuarioService: UsuarioService) {
    this.registerForm = this.fb.group(
      {
        nombre: ['', [Validators.required, Validators.minLength(20)]],
        username: ['', [Validators.required]],
        edad: ['', [Validators.required, Validators.min(15)]],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            this.passwordStrengthValidator,
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.usuario = {
        nombre: this.registerForm.value.nombre,
        username: this.registerForm.value.username,
        edad: this.registerForm.value.edad,
        email: this.registerForm.value.email,
        contraseña: this.registerForm.value.password,
        descripcion: '', // Puedes agregar un campo de descripción en el formulario si es necesario
        foto: '', // Puedes agregar un campo de foto en el formulario si es necesario
      };
      this.usuarioService.createUsuario(this.usuario).subscribe(
        (response) => {
          console.log('Usuario registrado correctamente', response);
        },
        (error) => {
          console.error('Error al registrar el usuario', error);
        }
      );
    } else {
      // Manejar errores de validación
      console.log('Formulario no válido');
    }
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else {
      confirmPassword.setErrors(null);
    }
    return null;
  }

  passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return null;
    }

    const hasUpperCase = /[A-Z]/.test(value);
    const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const hasNumber = /\d/.test(value);

    const passwordValid = hasUpperCase && hasSpecialCharacter && hasNumber;

    if (!passwordValid) {
      return { passwordStrength: true };
    }
    return null;
  }

  get nombre() {
    return this.registerForm.get('nombre');
  }

  get username() {
    return this.registerForm.get('username');
  }

  get edad() {
    return this.registerForm.get('edad');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }
}

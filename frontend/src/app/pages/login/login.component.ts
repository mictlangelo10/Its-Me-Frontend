import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      contraseña: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, contraseña } = this.loginForm.value;
      this.usuarioService.login(email, contraseña).subscribe(
        (response) => {
          this.toastr.success('Login exitoso');
          sessionStorage.setItem('token', response.token); // Guarda el token
          this.router.navigate(['/perfil']); // Redirige al perfil u otra ruta
        },
        (error) => {
          this.toastr.error(
            error.error.message || 'Error al iniciar sesión',
            'Error de login'
          );
        }
      );
    }
  }
}

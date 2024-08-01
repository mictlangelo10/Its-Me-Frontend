import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = sessionStorage.getItem('token');
    if (token) {
      // Si el usuario está autenticado, permite el acceso
      return true;
    } else {
      // Si el usuario no está autenticado, redirige al login
      this.router.navigate(['/']);
      return false;
    }
  }
}

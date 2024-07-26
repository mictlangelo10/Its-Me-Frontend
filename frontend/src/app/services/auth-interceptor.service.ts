// auth.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Define las rutas que no necesitan autenticación
    const nonAuthRoutes = ['/usuarios/register'];

    // Verifica si la URL de la solicitud coincide con las rutas que no necesitan autenticación
    if (nonAuthRoutes.some((route) => req.url.includes(route))) {
      return next.handle(req);
    }

    const token = sessionStorage.getItem('token'); // Obtén el token del almacenamiento de sesión

    if (token) {
      // Clona la solicitud para añadir el nuevo encabezado
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`),
      });
      return next.handle(cloned);
    } else {
      return next.handle(req);
    }
  }
}

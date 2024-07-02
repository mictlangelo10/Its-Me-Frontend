import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contenido } from '../models/contenido';

@Injectable({
  providedIn: 'root',
})
export class ContenidoService {
  private apiUrl = 'http://your-api-url/contenidos';

  constructor(private http: HttpClient) {}

  getContenidos(): Observable<Contenido[]> {
    return this.http.get<Contenido[]>(this.apiUrl);
  }

  getContenido(id: number): Observable<Contenido> {
    return this.http.get<Contenido>(`${this.apiUrl}/${id}`);
  }

  createContenido(contenido: Contenido): Observable<Contenido> {
    return this.http.post<Contenido>(this.apiUrl, contenido);
  }

  updateContenido(id: number, contenido: Contenido): Observable<Contenido> {
    return this.http.put<Contenido>(`${this.apiUrl}/${id}`, contenido);
  }

  deleteContenido(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

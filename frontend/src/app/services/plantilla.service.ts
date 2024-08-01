import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContenidoPlantilla, Plantilla } from '../models/plantilla';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PlantillaService {
  private apiUrl = `${environment.apiUrl}/plantillas`;
  private apiUrlContenido = `${environment.apiUrl}/contenido`;

  constructor(private http: HttpClient) {}

  getPlantillas(): Observable<Plantilla[]> {
    return this.http.get<Plantilla[]>(this.apiUrl);
  }
  // Crear contenido
  createContent(contenido: ContenidoPlantilla): Observable<ContenidoPlantilla> {
    return this.http.post<ContenidoPlantilla>(this.apiUrlContenido, contenido);
  }

  // Obtener contenido por categoría
  getContentByCategory(id_cat: number): Observable<ContenidoPlantilla[]> {
    return this.http.get<ContenidoPlantilla[]>(
      `${this.apiUrlContenido}/${id_cat}`
    );
  }

  checkContentExistence(
    id_cat: number
  ): Observable<{ contentExists: boolean }> {
    return this.http.get<{ contentExists: boolean }>(
      `${this.apiUrlContenido}/existencia/${id_cat}`
    );
  }

  // Actualizar contenido existente
  updateContent(contenido: ContenidoPlantilla): Observable<ContenidoPlantilla> {
    return this.http.put<ContenidoPlantilla>(
      `${this.apiUrlContenido}/${contenido.id}`,
      contenido
    );
  }
}

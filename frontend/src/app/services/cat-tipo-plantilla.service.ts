import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CatTipoPlantilla } from '../models/cat-tipo-plantilla';

@Injectable({
  providedIn: 'root',
})
export class CatTipoPlantillaService {
  private apiUrl = 'http://your-api-url/cat-tipo-plantilla';

  constructor(private http: HttpClient) {}

  getTiposPlantilla(): Observable<CatTipoPlantilla[]> {
    return this.http.get<CatTipoPlantilla[]>(this.apiUrl);
  }

  getTipoPlantilla(id: number): Observable<CatTipoPlantilla> {
    return this.http.get<CatTipoPlantilla>(`${this.apiUrl}/${id}`);
  }

  createTipoPlantilla(
    tipoPlantilla: CatTipoPlantilla
  ): Observable<CatTipoPlantilla> {
    return this.http.post<CatTipoPlantilla>(this.apiUrl, tipoPlantilla);
  }

  updateTipoPlantilla(
    id: number,
    tipoPlantilla: CatTipoPlantilla
  ): Observable<CatTipoPlantilla> {
    return this.http.put<CatTipoPlantilla>(
      `${this.apiUrl}/${id}`,
      tipoPlantilla
    );
  }

  deleteTipoPlantilla(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

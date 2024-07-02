import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Plantilla } from '../models/plantilla';

@Injectable({
  providedIn: 'root',
})
export class PlantillaService {
  private apiUrl = 'http://your-api-url/plantillas';

  constructor(private http: HttpClient) {}

  getPlantillas(): Observable<Plantilla[]> {
    return this.http.get<Plantilla[]>(this.apiUrl);
  }

  getPlantilla(id: number): Observable<Plantilla> {
    return this.http.get<Plantilla>(`${this.apiUrl}/${id}`);
  }

  createPlantilla(plantilla: Plantilla): Observable<Plantilla> {
    return this.http.post<Plantilla>(this.apiUrl, plantilla);
  }

  updatePlantilla(id: number, plantilla: Plantilla): Observable<Plantilla> {
    return this.http.put<Plantilla>(`${this.apiUrl}/${id}`, plantilla);
  }

  deletePlantilla(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

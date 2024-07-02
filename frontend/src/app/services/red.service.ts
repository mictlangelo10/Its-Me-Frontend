import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Red } from '../models/red';

@Injectable({
  providedIn: 'root',
})
export class RedService {
  private apiUrl = 'http://your-api-url/redes';

  constructor(private http: HttpClient) {}

  getRedes(): Observable<Red[]> {
    return this.http.get<Red[]>(this.apiUrl);
  }

  getRed(id: number): Observable<Red> {
    return this.http.get<Red>(`${this.apiUrl}/${id}`);
  }

  createRed(red: Red): Observable<Red> {
    return this.http.post<Red>(this.apiUrl, red);
  }

  updateRed(id: number, red: Red): Observable<Red> {
    return this.http.put<Red>(`${this.apiUrl}/${id}`, red);
  }

  deleteRed(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

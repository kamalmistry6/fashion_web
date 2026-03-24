import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MaterialService {
  private baseUrl = `${environment.apiBaseUrl}/materials`;

  constructor(private http: HttpClient) {}

  getMaterials(params?: HttpParams): Observable<any> {
    return this.http.get(this.baseUrl, { params });
  }

  getMaterialById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  createMaterial(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

  updateMaterial(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  deleteMaterial(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
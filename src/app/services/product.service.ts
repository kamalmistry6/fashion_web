import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = 'http://localhost:5000/api/products';
  constructor(private http: HttpClient) {}

  getProducts(params?: HttpParams): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.baseUrl, { params });
  }
}

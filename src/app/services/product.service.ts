import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ApiResponse,
  ProductDetailResponse,
} from '../models/product.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = `${environment.apiBaseUrl}/products`;
  constructor(private http: HttpClient) {}

  getProducts(params?: HttpParams): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.baseUrl, { params });
  }

  getProductBySlug(slug: string): Observable<ProductDetailResponse> {
    return this.http.get<ProductDetailResponse>(`${this.baseUrl}/${slug}`);
  }

  createProduct(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

  updateProduct(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  uploadImages(files: File[]): Observable<any> {
    const formData = new FormData();
    for (const file of files) {
      formData.append('images', file);
    }
    return this.http.post(`${this.baseUrl}/upload`, formData);
  }
}

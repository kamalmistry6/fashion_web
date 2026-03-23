import { Component, OnInit } from '@angular/core';
import {
  ApiResponse,
  Product,
  ProductListData,
} from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-product',
  standalone: false,
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent implements OnInit {
  allProducts: Product[] = [];
  isLoading = false;

  currentPage = 1;
  pageSize = 10;

  total = 0;
  totalPages = 0;
  hasNext = false;
  pageSizeOptions = [5, 10, 20, 50];

  category?: '';
  material?: '';
  search?: '';
  minPrice?: number;
  maxPrice?: number;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  getFilterParams(): HttpParams {
    let params = new HttpParams();

    if (this.category) params = params.set('category', this.category);
    if (this.material) params = params.set('material', this.material);
    if (this.search) params = params.set('search', this.search);

    if (this.minPrice != null) params = params.set('minPrice', this.minPrice);
    if (this.maxPrice != null) params = params.set('maxPrice', this.maxPrice);

    // 👉 ADD PAGINATION
    params = params.set('page', this.currentPage);
    params = params.set('limit', this.pageSize);

    return params;
  }

  loadProducts(): void {
    this.isLoading = true;
    const params = this.getFilterParams();

    this.productService.getProducts(params).subscribe(
      (res: ApiResponse) => {
        const data = res.data;

        this.allProducts = data.products;
        this.total = data.total;
        this.totalPages = data.totalPages;
        this.hasNext = data.hasNext;

        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching product data:', error);
        alert('Failed to fetch product data');
        this.isLoading = false;
      },
    );
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadProducts();
    }
  }

  goToPrevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadProducts();
    }
  }

  changePageSize(size: number) {
    this.pageSize = size;
    this.currentPage = 1; // reset
    this.loadProducts();
  }

  onFiltersChange(): void {
    this.currentPage = 1;
    this.loadProducts();
  }

  get startItem(): number {
    if (this.total === 0) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }
  get endItem(): number {
    const end = this.currentPage * this.pageSize;
    return end > this.total ? this.total : end;
  }
}

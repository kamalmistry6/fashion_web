import { Component, OnInit } from '@angular/core';
import {
  ApiResponse,
  Category,
  Material,
  Product,
} from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { MaterialService } from '../../services/material.service';
import { HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToasterService } from '../../shared/toaster/toaster.service';

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
  pageSizeOptions = [5, 10, 20, 50];

  category = '';
  material = '';
  search = '';
  minPrice?: number;
  maxPrice?: number;

  categories: Category[] = [];
  materials: Material[] = [];

  private readonly backendUrl = 'http://localhost:5000';

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private materialService: MaterialService,
    private router: Router,
    private toaster: ToasterService,
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadMaterials();
    this.loadProducts();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(
      (response: any) => {
        if (response.data) {
          this.categories = response.data;
        }
      },
      () => {
        this.toaster.error('Failed to fetch categories');
      },
    );
  }

  loadMaterials(): void {
    this.materialService.getMaterials().subscribe(
      (response: any) => {
        if (response.data) {
          this.materials = response.data;
        }
      },
      () => {
        this.toaster.error('Failed to fetch materials');
      },
    );
  }

  getImageSrc(imageUrl: string | null): string {
    if (!imageUrl) return 'https://placehold.co/80x80?text=No+Image';
    if (imageUrl.startsWith('http')) return imageUrl;
    return this.backendUrl + imageUrl;
  }

  getFilterParams(): HttpParams {
    let params = new HttpParams();

    if (this.category) params = params.set('category', this.category);
    if (this.material) params = params.set('material', this.material);
    if (this.search) params = params.set('search', this.search);

    if (this.minPrice != null) params = params.set('minPrice', this.minPrice);
    if (this.maxPrice != null) params = params.set('maxPrice', this.maxPrice);

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

        this.isLoading = false;
      },
      () => {
        this.toaster.error('Failed to fetch products');
        this.isLoading = false;
      },
    );
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadProducts();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
    this.loadProducts();
  }

  onFiltersChange(): void {
    this.currentPage = 1;
    this.loadProducts();
  }

  get paginationStartItem(): number {
    if (this.total === 0) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }
  get paginationEndItem(): number {
    const end = this.currentPage * this.pageSize;
    return end > this.total ? this.total : end;
  }

  onEdit(slug: string) {
    this.router.navigate(['admin/products/edit', slug]);
  }
  onAdd() {
    this.router.navigate(['admin/products/add']);
  }
}

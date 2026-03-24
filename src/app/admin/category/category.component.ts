import { Component, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { ToasterService } from '../../shared/toaster/toaster.service';

@Component({
  selector: 'app-category',
  standalone: false,
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
})
export class CategoryComponent implements OnInit {
  categories: any[] = [];
  isLoading = false;

  currentPage = 1;
  pageSize = 10;
  total = 0;
  totalPages = 0;
  pageSizeOptions = [5, 10, 20, 50];

  search = '';

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private toaster: ToasterService,
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  getFilterParams(): HttpParams {
    let params = new HttpParams();
    if (this.search) params = params.set('search', this.search);
    params = params.set('page', this.currentPage);
    params = params.set('limit', this.pageSize);
    return params;
  }

  loadCategories(): void {
    this.isLoading = true;
    const params = this.getFilterParams();

    this.categoryService.getCategories(params).subscribe(
      (res: any) => {
        this.categories = res.data || [];
        this.isLoading = false;
      },
      () => {
        this.toaster.error('Failed to fetch categories');
        this.isLoading = false;
      },
    );
  }

  onFiltersChange(): void {
    this.currentPage = 1;
    this.loadCategories();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadCategories();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
    this.loadCategories();
  }

  get paginationStartItem(): number {
    if (this.total === 0) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get paginationEndItem(): number {
    const end = this.currentPage * this.pageSize;
    return end > this.total ? this.total : end;
  }

  onAdd(): void {
    this.router.navigate(['admin/categories/add']);
  }

  onEdit(id: number): void {
    this.router.navigate(['admin/categories/edit', id]);
  }

  onDelete(id: number): void {
    if (!confirm('Are you sure you want to delete this category?')) return;

    this.categoryService.deleteCategory(id).subscribe(
      () => {
        this.toaster.success('Category deleted successfully');
        this.loadCategories();
      },
      () => {
        this.toaster.error('Failed to delete category');
      },
    );
  }
}
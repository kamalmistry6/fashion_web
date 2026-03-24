import { Component, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { MaterialService } from '../../services/material.service';
import { ToasterService } from '../../shared/toaster/toaster.service';

@Component({
  selector: 'app-material',
  standalone: false,
  templateUrl: './material.component.html',
  styleUrl: './material.component.scss',
})
export class MaterialComponent implements OnInit {
  materials: any[] = [];
  isLoading = false;

  currentPage = 1;
  pageSize = 10;
  total = 0;
  totalPages = 0;
  pageSizeOptions = [5, 10, 20, 50];

  search = '';

  constructor(
    private materialService: MaterialService,
    private router: Router,
    private toaster: ToasterService,
  ) {}

  ngOnInit(): void {
    this.loadMaterials();
  }

  getFilterParams(): HttpParams {
    let params = new HttpParams();
    if (this.search) params = params.set('search', this.search);
    params = params.set('page', this.currentPage);
    params = params.set('limit', this.pageSize);
    return params;
  }

  loadMaterials(): void {
    this.isLoading = true;
    const params = this.getFilterParams();

    this.materialService.getMaterials(params).subscribe(
      (res: any) => {
        this.materials = res.data || [];
        this.isLoading = false;
      },
      () => {
        this.toaster.error('Failed to fetch materials');
        this.isLoading = false;
      },
    );
  }

  onFiltersChange(): void {
    this.currentPage = 1;
    this.loadMaterials();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadMaterials();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
    this.loadMaterials();
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
    this.router.navigate(['admin/materials/add']);
  }

  onEdit(id: number): void {
    this.router.navigate(['admin/materials/edit', id]);
  }

  onDelete(id: number): void {
    if (!confirm('Are you sure you want to delete this material?')) return;

    this.materialService.deleteMaterial(id).subscribe(
      () => {
        this.toaster.success('Material deleted successfully');
        this.loadMaterials();
      },
      () => {
        this.toaster.error('Failed to delete material');
      },
    );
  }
}
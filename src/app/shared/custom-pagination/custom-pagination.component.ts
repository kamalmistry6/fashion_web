import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-custom-pagination',
  standalone: false,
  templateUrl: './custom-pagination.component.html',
  styleUrl: './custom-pagination.component.scss',
})
export class CustomPaginationComponent {
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Input() pageSize = 10;
  @Input() total = 0;
  @Input() pageSizeOptions: number[] = [5, 10, 20, 50];

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  get startItem(): number {
    if (this.total === 0) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endItem(): number {
    const end = this.currentPage * this.pageSize;
    return end > this.total ? this.total : end;
  }

  goToPrevPage(): void {
    if (this.currentPage > 1) {
      this.pageChange.emit(this.currentPage - 1);
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.pageChange.emit(this.currentPage + 1);
    }
  }

  onPageSizeChange(size: number): void {
    this.pageSizeChange.emit(+size);
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../../services/category.service';
import { ToasterService } from '../../../shared/toaster/toaster.service';

@Component({
  selector: 'app-add-category',
  standalone: false,
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.scss',
})
export class AddCategoryComponent implements OnInit {
  categoryForm!: FormGroup;
  isEditMode = false;
  categoryId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private toaster: ToasterService,
  ) {}

  ngOnInit(): void {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      slug: [''],
      description: [''],
      status: [true],
    });

    this.categoryForm.get('name')?.valueChanges.subscribe((name: string) => {
      if (!this.isEditMode) {
        const slug = name
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-');
        this.categoryForm.patchValue({ slug }, { emitEvent: false });
      }
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.categoryId = +id;
      this.loadCategory(this.categoryId);
    }
  }

  loadCategory(id: number): void {
    this.categoryService.getCategoryById(id).subscribe({
      next: (res) => {
        const c = res.data;
        this.categoryForm.patchValue({
          name: c.name,
          slug: c.slug,
          description: c.description,
          status: !!c.status,
        });
      },
      error: () => {
        this.toaster.error('Failed to load category');
        this.router.navigate(['/admin/categories']);
      },
    });
  }

  discard(): void {
    this.router.navigate(['/admin/categories']);
  }

  submit(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    const formValue = this.categoryForm.getRawValue();
    const payload = {
      name: formValue.name,
      slug: formValue.slug,
      description: formValue.description,
      status: formValue.status ? 1 : 0,
    };

    if (this.isEditMode && this.categoryId) {
      this.categoryService.updateCategory(this.categoryId, payload).subscribe({
        next: () => {
          this.toaster.success('Category updated successfully');
          this.router.navigate(['/admin/categories']);
        },
        error: () => this.toaster.error('Failed to update category'),
      });
    } else {
      this.categoryService.createCategory(payload).subscribe({
        next: () => {
          this.toaster.success('Category created successfully');
          this.router.navigate(['/admin/categories']);
        },
        error: () => this.toaster.error('Failed to create category'),
      });
    }
  }
}
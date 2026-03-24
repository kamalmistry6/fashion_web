import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialService } from '../../../services/material.service';
import { ToasterService } from '../../../shared/toaster/toaster.service';

@Component({
  selector: 'app-add-material',
  standalone: false,
  templateUrl: './add-material.component.html',
  styleUrl: './add-material.component.scss',
})
export class AddMaterialComponent implements OnInit {
  materialForm!: FormGroup;
  isEditMode = false;
  materialId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private materialService: MaterialService,
    private toaster: ToasterService,
  ) {}

  ngOnInit(): void {
    this.materialForm = this.fb.group({
      name: ['', Validators.required],
      slug: [''],
      status: [true],
    });

    this.materialForm.get('name')?.valueChanges.subscribe((name: string) => {
      if (!this.isEditMode) {
        const slug = name
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-');
        this.materialForm.patchValue({ slug }, { emitEvent: false });
      }
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.materialId = +id;
      this.loadMaterial(this.materialId);
    }
  }

  loadMaterial(id: number): void {
    this.materialService.getMaterialById(id).subscribe({
      next: (res) => {
        const m = res.data;
        this.materialForm.patchValue({
          name: m.name,
          slug: m.slug,
          status: !!m.status,
        });
      },
      error: () => {
        this.toaster.error('Failed to load material');
        this.router.navigate(['/admin/materials']);
      },
    });
  }

  discard(): void {
    this.router.navigate(['/admin/materials']);
  }

  submit(): void {
    if (this.materialForm.invalid) {
      this.materialForm.markAllAsTouched();
      return;
    }

    const formValue = this.materialForm.getRawValue();
    const payload = {
      name: formValue.name,
      slug: formValue.slug,
      status: formValue.status ? 1 : 0,
    };

    if (this.isEditMode && this.materialId) {
      this.materialService.updateMaterial(this.materialId, payload).subscribe({
        next: () => {
          this.toaster.success('Material updated successfully');
          this.router.navigate(['/admin/materials']);
        },
        error: () => this.toaster.error('Failed to update material'),
      });
    } else {
      this.materialService.createMaterial(payload).subscribe({
        next: () => {
          this.toaster.success('Material created successfully');
          this.router.navigate(['/admin/materials']);
        },
        error: () => this.toaster.error('Failed to create material'),
      });
    }
  }
}
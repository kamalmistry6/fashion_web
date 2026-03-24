import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { MaterialService } from '../../../services/material.service';
import { ToasterService } from '../../../shared/toaster/toaster.service';
import { Category, Material } from '../../../models/product.model';

interface UploadedImage {
  image_url: string;
  is_primary: boolean;
}

@Component({
  selector: 'app-add-product',
  standalone: false,
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss',
})
export class AddProductComponent implements OnInit {
  productForm!: FormGroup;
  uploadedImages: UploadedImage[] = [];
  isUploading = false;
  isLoading = false;

  isEditMode = false;
  productId: number | null = null;
  slug: string | null = null;

  categories: Category[] = [];
  materials: Material[] = [];

  private readonly backendUrl = 'http://localhost:5000';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private categoryService: CategoryService,
    private materialService: MaterialService,
    private toaster: ToasterService,
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadMaterials();

    this.productForm = this.fb.group({
      name: ['', Validators.required],
      slug: [''],
      description: [''],

      category_id: ['', Validators.required],
      material_id: ['', Validators.required],

      price: [null, Validators.required],
      discount_price: [null],

      is_featured: [false],
      is_trending: [false],
      status: [true],

      tags: [[]],

      variants: this.fb.array([]),
    });

    // Auto-generate slug from name
    this.productForm.get('name')?.valueChanges.subscribe((name: string) => {
      if (!this.isEditMode) {
        const slug = name
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-');
        this.productForm.patchValue({ slug }, { emitEvent: false });
      }
    });

    // Check if edit mode
    this.slug = this.route.snapshot.paramMap.get('slug');
    if (this.slug) {
      this.isEditMode = true;
      this.loadProduct(this.slug);
    } else {
      this.addVariant();
    }
  }

  loadCategories(): void {
    this.isLoading = true;

    this.categoryService.getCategories().subscribe(
      (response: any) => {
        if (response.data) {
          this.categories = response.data;
        }
        this.isLoading = false;
      },
      () => {
        this.toaster.error('Failed to fetch categories');
        this.isLoading = false;
      },
    );
  }

  loadMaterials(): void {
    this.isLoading = true;

    this.materialService.getMaterials().subscribe(
      (response: any) => {
        if (response.data) {
          this.materials = response.data;
        }
        this.isLoading = false;
      },
      () => {
        this.toaster.error('Failed to fetch materials');
        this.isLoading = false;
      },
    );
  }

  get variants(): FormArray {
    return this.productForm.get('variants') as FormArray;
  }

  get discountPercent(): number {
    const price = this.productForm.get('price')?.value;
    const discount = this.productForm.get('discount_price')?.value;
    if (!price || !discount || discount >= price) return 0;
    return Math.round(((price - discount) / price) * 100);
  }

  // --- Variants ---

  addVariant() {
    this.variants.push(
      this.fb.group({
        size: [''],
        color: [''],
        stock: [0],
      }),
    );
  }

  removeVariant(index: number) {
    this.variants.removeAt(index);
  }

  // --- Images ---

  getImageSrc(img: UploadedImage): string {
    if (img.image_url.startsWith('http')) {
      return img.image_url;
    }
    return this.backendUrl + img.image_url;
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const files = Array.from(input.files);
    const remaining = 5 - this.uploadedImages.length;
    if (remaining <= 0) return;

    const toUpload = files.slice(0, remaining);
    this.isUploading = true;

    this.productService.uploadImages(toUpload).subscribe({
      next: (res) => {
        const newImages: UploadedImage[] = res.data.map((img: any) => ({
          image_url: img.image_url,
          is_primary: false,
        }));

        // Auto-set first image as primary if none exists
        if (this.uploadedImages.length === 0 && newImages.length > 0) {
          newImages[0].is_primary = true;
        }

        this.uploadedImages.push(...newImages);
        this.isUploading = false;
      },
      error: () => {
        this.toaster.error('Image upload failed');
        this.isUploading = false;
      },
    });

    // Reset input so same file can be selected again
    input.value = '';
  }

  setPrimary(index: number) {
    this.uploadedImages.forEach((img, i) => {
      img.is_primary = i === index;
    });
  }

  removeImage(index: number) {
    const wasPrimary = this.uploadedImages[index].is_primary;
    this.uploadedImages.splice(index, 1);

    // If removed image was primary, assign primary to first remaining
    if (wasPrimary && this.uploadedImages.length > 0) {
      this.uploadedImages[0].is_primary = true;
    }
  }

  // --- Toggles ---

  toggleSwitch(controlName: string) {
    const currentValue = this.productForm.get(controlName)?.value;
    this.productForm.patchValue({
      [controlName]: !currentValue,
    });
  }

  discard() {
    this.router.navigate(['/admin/products']);
  }

  // --- Load (edit mode) ---

  loadProduct(slug: string) {
    this.productService.getProductBySlug(slug).subscribe({
      next: (res) => {
        const p = res.data;
        this.productId = p.id;
        console.log(p.status);

        this.productForm.patchValue({
          name: p.name,
          slug: p.slug,
          description: p.description,
          category_id: p.category_id ?? '',
          material_id: p.material_id ?? '',
          price: p.price,
          discount_price: p.discount_price,
          is_featured: p.is_featured,
          is_trending: p.is_trending,
          status: !!p.status,
        });

        // Populate variants
        this.variants.clear();
        if (p.variants?.length) {
          for (const v of p.variants) {
            this.variants.push(
              this.fb.group({
                size: [v.size],
                color: [v.color],
                stock: [v.stock],
              }),
            );
          }
        }

        // Populate uploaded images
        if (p.images?.length) {
          this.uploadedImages = p.images.map((img) => ({
            image_url: img.image_url,
            is_primary: img.is_primary,
          }));
        }
      },
      error: () => {
        this.toaster.error('Failed to load product');
        this.router.navigate(['/admin/products']);
      },
    });
  }

  // --- Submit ---

  submit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    if (this.uploadedImages.length === 0) {
      this.toaster.warning('At least one image is required');
      return;
    }

    const formValue = this.productForm.getRawValue();

    const payload = {
      name: formValue.name,
      slug: formValue.slug,
      description: formValue.description,
      category_id: formValue.category_id,
      material_id: formValue.material_id,
      price: formValue.price,
      discount_price: formValue.discount_price,
      is_featured: formValue.is_featured,
      is_trending: formValue.is_trending,
      status: formValue.status ? 1 : 0,
      variants: formValue.variants,
      images: this.uploadedImages,
    };

    if (this.isEditMode && this.productId) {
      this.productService.updateProduct(this.productId, payload).subscribe({
        next: () => {
          this.toaster.success('Product updated successfully');
          this.router.navigate(['/admin/products']);
        },
        error: () => this.toaster.error('Failed to update product'),
      });
    } else {
      this.productService.createProduct(payload).subscribe({
        next: () => {
          this.toaster.success('Product created successfully');
          this.router.navigate(['/admin/products']);
        },
        error: () => this.toaster.error('Failed to create product'),
      });
    }
  }
}

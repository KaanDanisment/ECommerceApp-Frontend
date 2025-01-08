import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CategoryService } from '../../../../../services/CategoryService/category.service';
import { Category } from '../../../../../models/category.model';
import { catchError, delay, Observable, of } from 'rxjs';
import { SubcategoryService } from '../../../../../services/SubcategoryService/subcategory.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Subcategory } from '../../../../../models/subcategory.model';
import { ProductService } from '../../../../../services/ProductService/product.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.css',
})
export class CreateProductComponent {
  productForm!: FormGroup;
  categories$: Observable<Category[]> | null = null;
  subcategories$: Observable<Subcategory[]> | null = null;
  selectedCategoryId!: number;
  selectedImages: File[] = [];
  previewUrls: string[] = [];
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private subcategoryService: SubcategoryService,
    private productService: ProductService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    this.createProductForm();
    this.loadCategories();
  }
  createProductForm() {
    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      color: ['', Validators.required],
      size: [''],
      price: ['', [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
      stock: ['', [Validators.required, Validators.min(0)]],
      categoryId: ['', Validators.required],
      subcategoryId: ['', Validators.required],
    });
  }

  loadCategories() {
    this.categories$ = this.categoryService.getCategories().pipe(
      delay(5000),
      catchError((error) => {
        this.toastr.error(error.message);
        return of([]);
      })
    );
  }

  onCategoryChange(event: any) {
    const categoryId = parseInt(event.target.value);
    this.selectedCategoryId = categoryId;
    if (this.selectedCategoryId) {
      this.subcategories$ = this.subcategoryService
        .getSubcategoriesByCategoryId(this.selectedCategoryId)
        .pipe(
          catchError((error) => {
            this.toastr.error(error.message);
            return of([]);
          })
        );
    } else {
      this.subcategories$ = null;
    }
  }

  onFileSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      for (let i = 0; i < input.files.length; i++) {
        const file = input.files[i];
        this.selectedImages.push(file);

        // Resim önizlemesi
        const reader = new FileReader();
        reader.onload = () => {
          this.previewUrls.push(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  }
  removeImage(index: number) {
    this.previewUrls.splice(index, 1);
    this.selectedImages.splice(index, 1);
  }

  onSubmit() {
    if (this.productForm.valid && this.selectedImages.length > 0) {
      const formData = new FormData();

      Object.entries(this.productForm.value).forEach(([key, value]) => {
        if (value !== null && value !== '') {
          formData.append(key, value as string);
        }
      });

      this.selectedImages.forEach((image) => {
        formData.append('images', image);
      });

      this.isLoading = true;
      this.productService
        .createProduct(formData)
        .pipe(delay(5000))
        .subscribe({
          next: () => {
            this.isLoading = false;
            this.toastr.success('Ürün başarıyla eklendi');
            this.router.navigateByUrl('/admin/products');
          },
          error: (err) => {
            this.isLoading = false;
            console.error(err.message, err.error);
            this.toastr.error(`${err.message}`);
          },
        });
    } else {
      this.toastr.error('Lütfen tüm " * " ile işaretlenmiş alanları doldurun');
    }
  }
}

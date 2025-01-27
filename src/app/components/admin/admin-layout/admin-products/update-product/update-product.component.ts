import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../../../../services/ProductService/product.service';
import { Product } from '../../../../../models/product.model';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../../../../services/CategoryService/category.service';
import { SubcategoryService } from '../../../../../services/SubcategoryService/subcategory.service';
import { Category } from '../../../../../models/category.model';
import { catchError, delay, Observable, of } from 'rxjs';
import { Subcategory } from '../../../../../models/subcategory.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-product',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './update-product.component.html',
  styleUrl: './update-product.component.css',
})
export class UpdateProductComponent {
  productForm!: FormGroup;
  selectedImages: File[] = [];
  previewUrls: string[] = [];
  categories$: Observable<Category[]> | null = null;
  subcategories$: Observable<Subcategory[]> | null = null;
  isLoading = false;
  product!: Product;
  areImagesRemoved = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private productService: ProductService,
    private categoryService: CategoryService,
    private subcategoryService: SubcategoryService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const productId = params['id'];
      if (productId) {
        this.loadProductById(productId);
      }
    });
    this.createProductForm();
    this.loadCategories();
  }
  onSubmit() {
    // prettier-ignore
    const condition = this.productForm.valid && (this.selectedImages.length != 0 || this.previewUrls.length != 0)

    if (condition) {
      this.isLoading = true;
      const formData = new FormData();

      formData.append('id', this.product.id.toString());
      Object.entries(this.productForm.value).forEach(([key, value]) => {
        if (value !== null && value !== '') {
          formData.append(key, value as string);
        }
      });

      if (this.selectedImages.length > 0) {
        for (let i = 0; i < this.selectedImages.length; i++) {
          formData.append(
            'images',
            this.selectedImages[i],
            this.selectedImages[i].name
          );
        }
      } else {
        formData.append('images', new Blob([], { type: 'application/json' }));
      }

      this.productService.updateProduct(formData).subscribe({
        next: () => {
          this.productService.productsSubject.next([]);
          this.router.navigate(['/admin/products']);
          this.toastr.success('Ürün başarıyla güncellendi');
          this.isLoading = false;
        },
        error: (error) => {
          this.toastr.error(error.message);
          this.isLoading = false;
        },
      });
    } else {
      this.toastr.error('Lütfen tüm " * " ile işaretlenmiş alanları doldurun');
    }
  }

  loadProductById(productId: number) {
    this.productService.getProductById(productId).subscribe({
      next: (product: Product) => {
        this.product = product;
        this.productForm.patchValue(product);
        this.previewUrls = product.imageUrls;
        console.log(this.previewUrls);
        this.loadSubcategoriesByCategoryId(product.categoryId);
      },
    });
  }

  loadCategories() {
    this.categories$ = this.categoryService.getCategories().pipe(
      delay(1000),
      catchError((error) => {
        this.toastr.error(error.message);
        return of([]);
      })
    );
  }

  loadSubcategoriesByCategoryId(id: number) {
    this.subcategories$ = this.subcategoryService
      .getSubcategoriesByCategoryId(id)
      .pipe(
        catchError((error) => {
          this.toastr.error(error.message);
          return of([]);
        })
      );
  }

  onCategoryChange(event: any) {
    const categoryId = parseInt(event.target.value);
    if (categoryId) {
      this.subcategories$ = this.subcategoryService
        .getSubcategoriesByCategoryId(categoryId)
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

        //Resim önizleme
        const reader = new FileReader();
        reader.onload = () => {
          this.previewUrls.push(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  }
  imageControl() {
    if (this.previewUrls.length > 0 && this.selectedImages.length == 0) {
      const confirm = window.confirm(
        'Yeni resimler eklemek istediğinizde ürünün mevcut resimleri silinecek. Bütün resimleri tekrar eklemeniz gerekecek. Onaylıyor musunuz?'
      );
      if (confirm) {
        this.previewUrls = [];
        this.selectedImages = [];
        this.areImagesRemoved = true;
      }
    }
  }
  removeAllImages() {
    this.previewUrls = [];
    this.selectedImages = [];
    this.areImagesRemoved = true;
  }
  removeImage(index: number) {
    this.previewUrls.splice(index, 1);
    this.selectedImages.splice(index, 1);
  }
  createProductForm() {
    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      color: ['', Validators.required],
      size: [''],
      price: ['', Validators.required],
      description: ['', Validators.required],
      stock: ['', Validators.required],
      categoryId: ['', Validators.required],
      subcategoryId: ['', Validators.required],
    });
  }
}

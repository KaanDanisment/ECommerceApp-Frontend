import { Component } from '@angular/core';
import { CategoryService } from '../../../../../services/CategoryService/category.service';
import { SubcategoryService } from '../../../../../services/SubcategoryService/subcategory.service';
import { ToastRef, ToastrService } from 'ngx-toastr';
import { catchError, delay, Observable } from 'rxjs';
import { Category } from '../../../../../models/category.model';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-category',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './create-category.component.html',
  styleUrl: './create-category.component.css',
})
export class CreateCategoryComponent {
  categories$: Observable<Category[]> | null = null;
  subcategoryForm!: FormGroup;
  selectedImage: File | null = null;
  previewUrl: string | null = null;
  isLoading = false;

  constructor(
    private categoryService: CategoryService,
    private subcategoryService: SubcategoryService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subcategoryForm = this.formBuilder.group({
      name: ['', Validators.required],
      categoryId: ['', Validators.required],
    });

    this.categories$ = this.categoryService.getCategories().pipe(
      delay(1000),
      catchError((error) => {
        this.toastr.error(error.message);
        return [];
      })
    );
  }
  onFileSelected(event: any) {
    const file = event.target.files[0];
    console.log(file);
    this.selectedImage = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
  removeImage() {
    this.previewUrl = null;
    this.selectedImage = null;
  }

  onSubmit() {
    if (this.subcategoryForm.valid) {
      const formData = new FormData();

      Object.entries(this.subcategoryForm.value).forEach(([key, value]) => {
        if (value !== null && value !== '') {
          formData.append(key, value as string);
        }
      });

      if (this.selectedImage) {
        formData.append('image', this.selectedImage);
      }

      this.isLoading = true;
      this.subcategoryService
        .createSubcategory(formData)
        .pipe(delay(1000))
        .subscribe({
          next: () => {
            this.isLoading = false;
            this.toastr.success('Kategori başarıyla eklendi');
            this.router.navigateByUrl('/admin/categories');
            this.subcategoryService.getSubcategories(true).subscribe();
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

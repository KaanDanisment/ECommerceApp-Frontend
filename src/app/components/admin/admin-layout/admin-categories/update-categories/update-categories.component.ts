import { Component } from '@angular/core';
import { catchError, delay, Observable } from 'rxjs';
import { Category } from '../../../../../models/category.model';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CategoryService } from '../../../../../services/CategoryService/category.service';
import { SubcategoryService } from '../../../../../services/SubcategoryService/subcategory.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subcategory } from '../../../../../models/subcategory.model';

@Component({
  selector: 'app-update-categories',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './update-categories.component.html',
  styleUrl: './update-categories.component.css',
})
export class UpdateCategoriesComponent {
  categories$: Observable<Category[]> | null = null;
  subcategoryForm!: FormGroup;
  selectedImage: File | null = null;
  previewUrl: string | null = null;
  isLoading = false;
  subcategory!: Subcategory;

  constructor(
    private categoryService: CategoryService,
    private subcategoryService: SubcategoryService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
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

    this.route.queryParams.subscribe((params) => {
      const subcategoryId = params['id'];
      if (subcategoryId) {
        this.loadSubcategory(subcategoryId);
      }
    });
  }

  loadSubcategory(id: number): void {
    this.subcategoryService.getSubcategoryById(id).subscribe((data) => {
      this.subcategoryForm.patchValue(data);
      this.subcategory = data;
      if (data.imageUrl) {
        this.previewUrl = data.imageUrl;
      }
      console.log(data);
      console.log(this.previewUrl);
    });
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

      formData.append('id', this.subcategory.id.toString());
      Object.entries(this.subcategoryForm.value).forEach(([key, value]) => {
        if (value !== null && value !== '') {
          formData.append(key, value as string);
        }
      });

      if (this.selectedImage) {
        formData.append('image', this.selectedImage);
      }
      if (this.previewUrl === null) {
        formData.append('image', new Blob([], { type: 'application/json' }));
      }

      this.isLoading = true;
      this.subcategoryService
        .updateSubcategory(formData)
        .pipe(delay(1000))
        .subscribe({
          next: () => {
            this.isLoading = false;
            this.toastr.success('Kategori başarıyla güncellendi');
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

import { Component } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { Category } from '../../../../models/category.model';
import { CategoryService } from '../../../../services/CategoryService/category.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SubcategoryService } from '../../../../services/SubcategoryService/subcategory.service';
import { Subcategory } from '../../../../models/subcategory.model';
import { ProductService } from '../../../../services/ProductService/product.service';
import { Product } from '../../../../models/product.model';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-categories.component.html',
  styleUrl: './admin-categories.component.css',
})
export class AdminCategoriesComponent {
  categories$: Observable<Category[]> | null = null;
  subcategories$!: Observable<Subcategory[] | null>;
  isLoading = false;
  selectedSubcategory!: Subcategory;
  products$: Observable<Product[]> | null = null;

  constructor(
    private categoryService: CategoryService,
    private subcategoryService: SubcategoryService,
    private toastr: ToastrService,
    private router: Router,
    private productsService: ProductService
  ) {}

  ngOnInit() {
    this.loadSubcategories();
    this.loadCategories();
  }

  loadSubcategories(): void {
    this.subcategoryService.getSubcategories(false).subscribe({
      next: () => {
        this.subcategories$ = this.subcategoryService.subcategories$;
      },
      error: (err) => {
        console.error(err.message, err.error);
        this.toastr.error(`${err.message}`);
        return [];
      },
    });
  }

  subcategorySelected(subcategory: Subcategory) {
    this.selectedSubcategory = subcategory;
    console.log(this.selectedSubcategory);
  }

  loadCategories(): void {
    this.categories$ = this.categoryService.getCategories().pipe(
      catchError((error) => {
        this.toastr.error(error.message);
        return [];
      })
    );
  }

  editSubcategory(subcategory: Subcategory) {
    this.router.navigate(['/admin/categories/update'], {
      queryParams: { id: subcategory.id },
    });
  }

  deleteSubcategory(id: number) {
    const confirmed = window.confirm(
      'Alt kategori silinirse bunun altındaki tüm ürünler de silinecektir. Onaylıyor musunuz?'
    );
    if (confirmed) {
      this.isLoading = true;
      this.subcategoryService.deleteSubcategory(id).subscribe({
        next: () => {
          this.isLoading = false;
          this.toastr.success('Alt kategori silindi');
          this.loadSubcategories();
          this.subcategoryService.getSubcategories(true).subscribe();
        },
        error: (err) => {
          this.isLoading = false;
          console.error(err.message, err.error);
          this.toastr.error(`${err.message}`);
        },
      });
    }
  }

  loadProductsBySubcategoryId(subcategoryId: number) {
    this.productsService.getProductsBySubcategoryId(subcategoryId).subscribe({
      next: () => {
        this.products$ = this.productsService.products$;
      },
      error: (err) => {
        console.error(err.message, err.error);
        this.toastr.error(`${err.message}`);
        return [];
      },
    });
  }
}

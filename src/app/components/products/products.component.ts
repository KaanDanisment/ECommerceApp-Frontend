import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/ProductService/product.service';
import { BehaviorSubject, catchError, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SubcategoryService } from '../../services/SubcategoryService/subcategory.service';
import { Subcategory } from '../../models/subcategory.model';
import { ToastrService } from 'ngx-toastr';
import { GroupedProductDto } from '../../models/Dtos/groupedProductDto.model';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { UniqueByPipe } from '../../pipes/unique-by.pipe';
declare var bootstrap: any;

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UniqueByPipe,
    RouterModule,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent {
  private productsSubject = new BehaviorSubject<GroupedProductDto[]>([]);
  products$ = this.productsSubject.asObservable();

  subcategoryId!: number;
  categoryId!: number;
  subcategory$: Observable<Subcategory> | null = null;
  searchTerm: string = '';
  filterForm!: FormGroup;
  sizes!: string[];
  isFiltered = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private subcategoryService: SubcategoryService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['subcategoryId']) {
        if (this.subcategoryId != Number(params['subcategoryId'])) {
          this.productService.groupedProductsSubject.next([]);
          this.sizes = [];
          if (this.isFiltered) {
            this.removeFilters();
          }
        }
        this.categoryId = 0;
        this.subcategoryId = Number(params['subcategoryId']);
        this.loadProductsBySubcategoryId(this.subcategoryId);
        this.loadSubcategoryImageBySubcategoryId(this.subcategoryId);
      } else if (params['categoryId']) {
        if (this.categoryId != Number(params['categoryId'])) {
          this.productService.groupedProductsSubject.next([]);
          this.sizes = [];
          if (this.isFiltered) {
            this.removeFilters();
          }
        }
        this.subcategoryId = 0;
        this.categoryId = Number(params['categoryId']);
        this.loadProductsByCategoryId(this.categoryId);
        this.subcategory$ = null;
      } else {
        this.router.navigate(['/']);
      }
    });
    this.createFilterForm();
  }

  loadSubcategoryImageBySubcategoryId(subcategoryId: number): void {
    this.subcategory$ = this.subcategoryService
      .getSubcategoryById(subcategoryId)
      .pipe(
        catchError((error) => {
          console.error('Subcategory Image error', error);
          throw error;
        })
      );
  }

  //prettier-ignore
  loadProductsBySubcategoryId(subcategoryId: number): void {
    this.productService
      .getGroupedProductsBySubcategoryId(subcategoryId)
      .subscribe({
        next: () => {
          this.productsSubject.next(this.productService.groupedProductsSubject.value);
           for (let i = 0; i < this.productsSubject.value.length; i++) {
             for (let j = 0;j < this.productsSubject.value[i].sizes.length;j++) {
               const newSize = this.productsSubject.value[i].sizes[j];
               if (!this.sizes.includes(newSize)) {
                 this.sizes.push(newSize);
               }
             }
           }
        },
        error: (error) => {
          console.log(error);
          this.toastr.error('Error', error);
        },
      });
  }

  //prettier-ignore
  loadProductsByCategoryId(categoryId: number): void {
    this.productService
      .getGroupedProductsByCategoryId(categoryId)
      .subscribe({
        next: () => {
          this.productsSubject.next(this.productService.groupedProductsSubject.value);
          for (let i = 0; i < this.productsSubject.value.length; i++) {
            for (let j = 0; j < this.productsSubject.value[i].sizes.length; j++) {
               const newSize = this.productsSubject.value[i].sizes[j];
               if (!this.sizes.includes(newSize)) {
                 this.sizes.push(newSize);
               }
            }
          }
        },
        error: (error) => {
          console.log(error);
          this.toastr.error('Error', error);
        },
      });
  }

  onSearch(): void {
    if (!this.searchTerm || this.searchTerm.trim().length === 0) {
      this.productService.groupedProductsSubject.next([]);
      if (this.categoryId != 0) {
        this.loadProductsByCategoryId(this.categoryId);
      } else {
        this.loadProductsBySubcategoryId(this.subcategoryId);
      }
    } else {
      const currentProducts = this.productsSubject.value;
      const searchTermLower = this.searchTerm.trim().toLowerCase();

      const filteredProducts = currentProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTermLower) ||
          product.color.toLowerCase().includes(searchTermLower)
      );

      this.productsSubject.next(filteredProducts);
    }
  }

  openFilterModal() {
    const modal = new bootstrap.Modal(document.getElementById('filterModal'));
    modal.show();
  }

  createFilterForm() {
    this.filterForm = this.formBuilder.group({
      minPrice: [''],
      maxPrice: [''],
      stock: [''],
      color: [''],
      size: [''],
    });
  }

  filterProducts() {
    this.isFiltered = true;
    const { minPrice, maxPrice, stock, color, size } = this.filterForm.value;
    const currentProducts = this.productsSubject.getValue() || [];

    let filteredProducts = currentProducts;

    if (minPrice) {
      filteredProducts = filteredProducts.filter((p) => p.price >= +minPrice);
    }
    if (maxPrice) {
      filteredProducts = filteredProducts.filter((p) => p.price <= +maxPrice);
    }
    if (color) {
      filteredProducts = filteredProducts.filter((p) => p.color === color);
    }
    if (size) {
      filteredProducts = filteredProducts.filter((p) => p.sizes.includes(size));
    }

    this.productsSubject.next(filteredProducts);
    console.log(filteredProducts);
  }

  removeFilters() {
    this.isFiltered = false;
    this.filterForm.reset();
    this.productsSubject.next(this.productService.groupedProductsSubject.value);
  }
}

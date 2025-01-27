import { ChangeDetectorRef, Component } from '@angular/core';
import { ProductService } from '../../../../services/ProductService/product.service';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  switchMap,
  take,
} from 'rxjs';
import { Product } from '../../../../models/product.model';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Category } from '../../../../models/category.model';
import { CategoryService } from '../../../../services/CategoryService/category.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SubcategoryService } from '../../../../services/SubcategoryService/subcategory.service';
import { UniqueByPipe } from '../../../../pipes/unique-by.pipe';

declare var bootstrap: any;

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
    FormsModule,
    UniqueByPipe,
  ],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.css',
})
export class AdminProductsComponent {
  private productsSubject = new BehaviorSubject<Product[]>([]);
  products$ = this.productsSubject.asObservable();

  categories$: Observable<Category[]> | null = null;
  subcategories$: Observable<Category[]> | null = null;
  filterForm!: FormGroup;
  isFiltered = false;
  searchedProducts: Product[] = [];
  searchTerm: string = '';
  allProducts: Product[] = [];
  page: number = 1;
  allLoaded: boolean = false;
  totalProducts!: number;
  totalFiltredProducts!: number;
  totalPages!: number;
  deleting = false;
  noSorting = false;

  // Sorting
  sortProducts = false;
  condition: string = '';
  ascendingId = false;
  descendingId = false;
  ascendingPrice = false;
  descendingPrice = false;
  ascendingStock = false;
  descendingStock = false;
  ascendingDate = false;
  descendingDate = false;

  constructor(
    private productService: ProductService,
    private toastr: ToastrService,
    private categoryService: CategoryService,
    private subcategoryService: SubcategoryService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.createFilterForm();
  }

  loadProducts() {
    this.productService.getProducts(false, this.page).subscribe({
      next: (products) => {
        this.productsSubject.next(products);
        console.log(this.productsSubject.value.length);

        // prettier-ignore
        this.productService.totalProducts.pipe(take(1)).subscribe((totalProducts) => {
            this.totalProducts = totalProducts;
            console.log(this.totalProducts);
          });

        this.productService.totalPages.pipe(take(1)).subscribe((totalPages) => {
          this.totalPages = totalPages;
        });

        if (this.productsSubject.value.length == this.totalProducts) {
          this.allLoaded = true;
        }
      },
      error: (err) => {
        console.error(err.message, err.error);
        this.toastr.error(`${err.message}`);
      },
    });
  }

  loadMore() {
    if (this.page == 1 && this.productsSubject.value.length / 20 > 1) {
      this.page = this.productsSubject.value.length / 20;
    }
    this.page++;
    if (!this.isFiltered) {
      if (this.sortProducts) {
        this.productService.sortProducts(this.condition, this.page).subscribe({
          next: () => {
            this.productsSubject.next(
              this.productService.productsSubject.value
            );
            this.products$ = this.productService.products$;
            console.log(this.productsSubject.value.length);
            if (this.productsSubject.value.length == this.totalProducts) {
              this.allLoaded = true;
              console.log(this.totalProducts);
            }
          },
          error: (err) => {
            console.error(err.message, err.error);
            this.toastr.error(`${err.message}`);
          },
        });
      } else {
        this.productService.getProducts(true, this.page).subscribe({
          next: () => {
            this.productsSubject.next(
              this.productService.productsSubject.value
            );
            this.products$ = this.productService.products$;
            console.log(this.productsSubject.value.length);

            if (this.productsSubject.value.length == this.totalProducts) {
              this.allLoaded = true;
            }
            console.log(this.totalProducts);
          },
          error: (err) => {
            console.error(err.message, err.error);
            this.toastr.error(`${err.message}`);
          },
        });
      }
    }
  }

  onSearch() {
    if (!this.searchTerm || this.searchTerm.trim().length === 0) {
      this.noSorting = false;
      this.allLoaded = false;
      this.productService.getProducts(false).subscribe({
        next: (allProducts) => {
          this.productsSubject.next(allProducts);
          this.products$ = of(allProducts);
        },
        error: (err) => {
          console.error(err.message, err.error);
          this.toastr.error(`${err.message}`);
        },
      });
    } else {
      this.allLoaded = true;
      this.noSorting = true;
      this.productService.getProducts(true).subscribe({
        next: (allProducts) => {
          const filtered = allProducts.filter(
            (p) =>
              p.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
              p.id.toString().includes(this.searchTerm)
          );
          this.productsSubject.next(filtered);
          this.products$ = of(filtered);
        },
        error: (err) => {
          console.error(err.message, err.error);
          this.toastr.error(`${err.message}`);
        },
      });
    }
  }

  deleteProduct(id: number) {
    const confirmed = window.confirm('Ürünü silmek istediğinize emin misiniz?');
    if (confirmed) {
      this.deleting = true;
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.deleting = false;
          this.toastr.success('Ürün başarıyla silindi');
          const updatedProducts = this.productsSubject.value.filter(
            (product) => product.id !== id
          );
          this.productsSubject.next(updatedProducts);
          this.products$ = of(updatedProducts);
        },
        error: (err) => {
          console.error(err.message, err.error);
          this.toastr.error(`${err.message}`);
        },
      });
    }
  }

  editProduct(product: Product) {
    this.router.navigate(['/admin/products/update'], {
      queryParams: { id: product.id },
    });
  }

  loadCategories() {
    this.categories$ = this.categoryService.getCategories().pipe(
      catchError((error) => {
        this.toastr.error(error.message);
        return of([]);
      })
    );
  }
  loadSubcategories() {
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

  filterProducts() {
    this.allLoaded = true;
    // prettier-ignore
    const {categoryId,subcategoryId,minPrice,maxPrice,stock,color,size,} = this.filterForm.value;
    this.isFiltered = true;
    if (subcategoryId) {
      this.productService
        .getProductsBySubcategoryId(subcategoryId)
        .pipe(
          switchMap((products) =>
            of(products).pipe(
              map((products) => {
                if (minPrice) {
                  products = products.filter((p) => p.price >= minPrice);
                }
                if (maxPrice) {
                  products = products.filter((p) => p.price <= maxPrice);
                }
                if (stock) {
                  if (stock == 1) {
                    products = products.filter((p) => p.stock > 0);
                  } else {
                    products = products.filter((p) => p.stock == 0);
                  }
                }
                if (color) {
                  products = products.filter((p) => p.color == color);
                }
                if (size) {
                  products = products.filter((p) => p.size == size);
                }
                if (minPrice || maxPrice || stock || color || size) {
                  this.noSorting = true;
                } else {
                  this.noSorting = false;
                }
                this.totalFiltredProducts = products.length;
                return products;
              })
            )
          )
        )
        .subscribe({
          next: (filteredProducts) => {
            this.products$ = of(filteredProducts);
          },
          error: (err) => {
            console.error(err.message, err.error);
            this.toastr.error(err.message);
          },
        });
    } else if (categoryId) {
      this.productService
        .getProductsByCategoryId(categoryId)
        .pipe(
          switchMap((products) =>
            of(products).pipe(
              map((products) => {
                if (minPrice) {
                  products = products.filter((p) => p.price >= minPrice);
                }
                if (maxPrice) {
                  products = products.filter((p) => p.price <= maxPrice);
                }
                if (stock) {
                  if (stock == 1) {
                    products = products.filter((p) => p.stock > 0);
                  } else {
                    products = products.filter((p) => p.stock == 0);
                  }
                }
                if (color) {
                  products = products.filter((p) => p.color == color);
                }
                if (size) {
                  products = products.filter((p) => p.size == size);
                }
                if (minPrice || maxPrice || stock || color || size) {
                  this.noSorting = true;
                } else {
                  this.noSorting = false;
                }
                this.totalFiltredProducts = products.length;
                return products;
              })
            )
          )
        )
        .subscribe({
          next: (filteredProducts) => {
            this.products$ = of(filteredProducts);
          },
          error: (err) => {
            console.error(err.message, err.error);
            this.toastr.error(err.message);
          },
        });
    } else {
      this.noSorting = true;
      this.productService
        .getProducts(true)
        .pipe(
          switchMap((products) =>
            of(products).pipe(
              map((products) => {
                if (minPrice) {
                  products = products.filter((p) => p.price >= minPrice);
                }
                if (maxPrice) {
                  products = products.filter((p) => p.price <= maxPrice);
                }
                if (stock) {
                  if (stock == 1) {
                    products = products.filter((p) => p.stock > 0);
                  } else {
                    products = products.filter((p) => p.stock == 0);
                  }
                }
                if (color) {
                  products = products.filter((p) => p.color == color);
                }
                if (size) {
                  products = products.filter((p) => p.size == size);
                }
                this.totalFiltredProducts = products.length;
                return products;
              })
            )
          )
        )
        .subscribe({
          next: (filteredProducts) => {
            this.products$ = of(filteredProducts);
          },
          error: (err) => {
            console.error(err.message, err.error);
            this.toastr.error(err.message);
          },
        });
    }
  }
  sortBy(condition: string) {
    this.condition = condition;
    this.sortProducts = true;
    switch (condition) {
      case 'id_ascending':
        this.ascendingId = true;
        this.descendingId = false;
        this.ascendingPrice = false;
        this.descendingPrice = false;
        this.ascendingStock = false;
        this.descendingStock = false;
        this.ascendingDate = false;
        this.descendingDate = false;
        break;
      case 'id_descending':
        this.ascendingId = false;
        this.descendingId = true;
        this.ascendingPrice = false;
        this.descendingPrice = false;
        this.ascendingStock = false;
        this.descendingStock = false;
        this.ascendingDate = false;
        this.descendingDate = false;
        break;

      case 'price_ascending':
        this.ascendingId = false;
        this.descendingId = false;
        this.ascendingPrice = true;
        this.descendingPrice = false;
        this.ascendingStock = false;
        this.descendingStock = false;
        this.ascendingDate = false;
        this.descendingDate = false;
        break;

      case 'price_descending':
        this.ascendingId = false;
        this.descendingId = false;
        this.ascendingPrice = false;
        this.descendingPrice = true;
        this.ascendingStock = false;
        this.descendingStock = false;
        this.ascendingDate = false;
        this.descendingDate = false;
        break;

      case 'stock_ascending':
        this.ascendingId = false;
        this.descendingId = false;
        this.ascendingPrice = false;
        this.descendingPrice = false;
        this.ascendingStock = true;
        this.descendingStock = false;
        this.ascendingDate = false;
        this.descendingDate = false;
        break;

      case 'stock_descending':
        this.ascendingId = false;
        this.descendingId = false;
        this.ascendingPrice = false;
        this.descendingPrice = false;
        this.ascendingStock = false;
        this.descendingStock = true;
        this.ascendingDate = false;
        this.descendingDate = false;
        break;

      case 'date_ascending':
        this.ascendingId = false;
        this.descendingId = false;
        this.ascendingPrice = false;
        this.descendingPrice = false;
        this.ascendingStock = false;
        this.descendingStock = false;
        this.ascendingDate = true;
        this.descendingDate = false;
        break;

      case 'date_descending':
        this.ascendingId = false;
        this.descendingId = false;
        this.ascendingPrice = false;
        this.descendingPrice = false;
        this.ascendingStock = false;
        this.descendingStock = false;
        this.ascendingDate = false;
        this.descendingDate = true;
    }
    this.allLoaded = false;
    if (!this.isFiltered) {
      this.productService.productsSubject.next([]);
      this.productsSubject.next([]);
      this.page = 1;

      this.productService.sortProducts(condition, this.page).subscribe({
        next: () => {
          this.products$ = this.productService.products$;
        },
        error: (err) => {
          console.error(err.message, err.error);
          this.toastr.error(err.message);
        },
      });
    } else {
      this.allLoaded = true;
      if (this.filterForm.value.subcategoryId) {
        //prettier-ignore
        this.productService
          .sortProductsBySubcategory(condition,this.filterForm.value.subcategoryId)
          .subscribe({
            next: (products) => {
              this.products$ = of(products);
            },
            error: (err) => {
              console.error(err.message, err.error);
              this.toastr.error(err.message);
            },
          });
      } else if (this.filterForm.value.categoryId) {
        this.filterForm.value.categoryId;
        this.productService
          .sortProductsByCategory(condition, this.filterForm.value.categoryId)
          .subscribe({
            next: (products) => {
              this.products$ = of(products);
            },
            error: (err) => {
              console.error(err.message, err.error);
              this.toastr.error(err.message);
            },
          });
      } else {
        this.productService.sortProducts(condition).subscribe({
          next: (products) => {
            this.products$ = of(products);
          },
          error: (err) => {
            console.error(err.message, err.error);
            this.toastr.error(err.message);
          },
        });
      }
    }
  }

  removeFilters() {
    this.noSorting = false;
    if (this.productsSubject.value.length != this.totalProducts) {
      this.allLoaded = false;
    }
    this.products$ = this.productService.products$;
    this.filterForm.reset({
      categoryId: '',
      subcategoryId: '',
      minPrice: '',
      maxPrice: '',
      stock: '',
      color: '',
      size: '',
    });
    this.isFiltered = false;
  }

  createFilterForm() {
    this.filterForm = this.formBuilder.group({
      categoryId: [''],
      subcategoryId: [''],
      minPrice: [''],
      maxPrice: [''],
      stock: [''],
      color: [''],
      size: [''],
    });
  }
  openFilterModal() {
    this.loadCategories();
    this.loadSubcategories();
    const modal = new bootstrap.Modal(document.getElementById('filterModal'));
    modal.show();
  }
}

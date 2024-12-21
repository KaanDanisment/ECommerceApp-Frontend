import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/ProductService/product.service';
import { Product } from '../../models/product.model';
import { catchError, delay, Observable, of, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SubcategoryService } from '../../services/SubcategoryService/subcategory.service';
import { Subcategory } from '../../models/subcategory.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent {
  subcategoryId!: number;
  categoryId!: number;
  subcategoryImage$: Observable<Subcategory> | null = null;
  products$: Observable<Product[]> | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private subcategoryService: SubcategoryService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['subcategoryId']) {
        this.subcategoryId = Number(params['subcategoryId']);
        this.loadProductsBySubcategoryId(this.subcategoryId);
        this.loadSubcategoryImageBySubcategoryId(this.subcategoryId);
      } else if (params['categoryId']) {
        this.categoryId = Number(params['categoryId']);
        this.loadProductsByCategoryId(this.categoryId);
        this.subcategoryImage$ = null;
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  loadSubcategoryImageBySubcategoryId(subcategoryId: number): void {
    this.subcategoryImage$ = this.subcategoryService
      .getSubcategoryById(subcategoryId)
      .pipe(
        catchError((error) => {
          console.error('Subcategory Image error', error);
          throw error;
        })
      );
  }

  loadProductsBySubcategoryId(subcategoryId: number): void {
    this.products$ = this.productService
      .getProductsBySubcategoryId(subcategoryId)
      .pipe(
        delay(1000),
        catchError((error) => {
          this.toastr.error(error.message);
          return of([]);
        })
      );
  }

  loadProductsByCategoryId(categoryId: number): void {
    this.products$ = this.productService
      .getProductsByCategoryId(categoryId)
      .pipe(
        delay(1000),
        tap((products) => console.log(products)),
        catchError((error) => {
          this.toastr.error(error.message);
          return of([]);
        })
      );
  }
}

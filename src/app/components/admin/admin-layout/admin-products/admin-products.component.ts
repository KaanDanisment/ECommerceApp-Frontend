import { Component } from '@angular/core';
import { ProductService } from '../../../../services/ProductService/product.service';
import { catchError, delay, Observable, of, tap } from 'rxjs';
import { Product } from '../../../../models/product.model';
import { ToastrService } from 'ngx-toastr';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.css',
})
export class AdminProductsComponent {
  products$: Observable<Product[]> | null = null;

  constructor(
    private productService: ProductService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadAllProducts();
  }

  loadAllProducts() {
    this.products$ = this.productService.getAllProducts().pipe(
      delay(1000),
      catchError((error) => {
        this.toastr.error(error.message);
        return of([]);
      })
    );
  }
}

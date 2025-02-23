import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, delay, map, Observable, of, tap } from 'rxjs';
import { GroupedProductDto } from '../../../models/Dtos/groupedProductDto.model';
import { ProductService } from '../../../services/ProductService/product.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductDto } from '../../../models/Dtos/productDto.model';
import { CartService } from '../../../services/CartService/cart.service';
import { CartItemCreateDto } from '../../../models/Dtos/cartItemCreateDto.model';

@Component({
  selector: 'app-single-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './single-product.component.html',
  styleUrl: './single-product.component.css',
})
export class SingleProductComponent {
  product$!: Observable<GroupedProductDto>;
  quantity: number = 1;

  selectedProduct!: ProductDto;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private toastrService: ToastrService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadProducts(this.route.snapshot.params['id']);
  }

  loadProducts(id: number): void {
    //prettier-ignore
    this.product$ = this.productService.getSingleGroupedProductById(id).pipe(
      tap((product) => {
        this.selectedProduct = product.products[0];
      }),
      catchError((error) => {
        this.toastrService.error(error.message);
        console.error(error);
        return of();
      })
    );
  }
  selectProduct(product: ProductDto): void {
    this.selectedProduct = product;
    console.log(this.selectedProduct);
  }
  increaseQuantity(): void {
    if (this.quantity < 5) {
      this.quantity++;
    }
  }
  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    const cartItemCreateDto: CartItemCreateDto = {
      productId: this.selectedProduct.id,
      quantity: this.quantity,
    };
    this.cartService
      .addCartItemToCart(cartItemCreateDto)
      .pipe(
        tap(() => {
          this.toastrService.success('Ürün sepete eklendi');
        }),
        catchError((error) => {
          this.toastrService.error(error.message);
          console.error(error);
          return of();
        })
      )
      .subscribe();
  }
}

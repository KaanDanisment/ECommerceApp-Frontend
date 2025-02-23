import { Component } from '@angular/core';
import { CartService } from '../../services/CartService/cart.service';
import { Observable } from 'rxjs';
import { Cart } from '../../models/cart.model';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  cart$!: Observable<Cart | null>;

  constructor(
    private cartService: CartService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  removeCartItem(cartItemId: string): void {
    this.cartService.removeCartItemFromCart(cartItemId).subscribe({
      next: () => {
        this.loadCart();
      },
      error: (error) => {
        this.toastr.error('Ürün sepetten kaldırılamadı.');
        console.log('Error in removeCartItem:', error);
      },
    });
  }

  loadCart(): void {
    this.cart$ = this.cartService.getCart();
  }
}

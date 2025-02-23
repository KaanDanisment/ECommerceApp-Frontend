import { CartItem } from './cartItem.model';
import { CartDto } from './Dtos/cartDto.model';

export class Cart {
  id: string;
  userId: string;
  totalPrice: string;
  cartItems: CartItem[];
  createdAt: Date;
  lastUpdatedAt: Date;

  constructor(cartDto: CartDto) {
    this.id = cartDto.id;
    this.userId = cartDto.userId;
    this.totalPrice = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(cartDto.totalPrice);
    this.cartItems = cartDto.cartItems.map(
      (cartItemDto) => new CartItem(cartItemDto)
    );
    this.createdAt = cartDto.createdAt;
    this.lastUpdatedAt = cartDto.lastUpdatedAt;
  }
}

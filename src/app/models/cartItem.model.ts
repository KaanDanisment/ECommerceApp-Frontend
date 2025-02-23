import { CartItemDto } from './Dtos/cartItemDto.model';
import { Product } from './product.model';

export class CartItem {
  id: string;
  quantity: number;
  productId: number;
  cartId: string;
  unitPrice: number;
  product: Product;
  createdAt: Date;
  lastUpdatedAt: Date;

  constructor(cartItemDto: CartItemDto) {
    this.id = cartItemDto.id;
    this.quantity = cartItemDto.quantity;
    this.productId = cartItemDto.productId;
    this.cartId = cartItemDto.cartId;
    this.unitPrice = cartItemDto.unitPrice;
    this.product = new Product(cartItemDto.productDto);
    this.createdAt = cartItemDto.createdAt;
    this.lastUpdatedAt = cartItemDto.lastUpdatedAt;
  }
}

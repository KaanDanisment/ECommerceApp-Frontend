import { CartItemDto } from './cartItemDto.model';

export interface CartDto {
  id: string;
  userId: string;
  totalPrice: number;
  cartItems: CartItemDto[];
  createdAt: Date;
  lastUpdatedAt: Date;
}

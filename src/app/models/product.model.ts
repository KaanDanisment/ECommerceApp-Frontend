export interface Product {
  id: number;
  name: string;
  color: string;
  size: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
  createdAt: Date;
  subcategoryId: number;
  imageUrls: string[];
}

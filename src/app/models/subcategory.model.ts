import { SubcategoryDto } from './Dtos/subcategoryDto.model';

export class Subcategory {
  id: number;
  name: string;
  categoryId: number;
  imageUrl: string;

  constructor(subcategoryDto: SubcategoryDto) {
    this.id = subcategoryDto.id;
    this.name = subcategoryDto.name;
    this.categoryId = subcategoryDto.categoryId;
    this.imageUrl = subcategoryDto.imageUrl;
  }
}

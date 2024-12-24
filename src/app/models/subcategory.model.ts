export class Subcategory {
  id: number;
  name: string;
  categoryId: number;
  imageUrl: number[];

  constructor(subcategoryDto: Subcategory) {
    this.id = subcategoryDto.id;
    this.name = subcategoryDto.name;
    this.categoryId = subcategoryDto.categoryId;
    this.imageUrl = subcategoryDto.imageUrl;
  }
}

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Product } from '../../models/product.model';
import { ProductDto } from '../../models/Dtos/productDto.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'https://localhost:7281/api/product';
  constructor(private http: HttpClient) {}

  getProductsByCategoryId(categoryId: number): Observable<Product[]> {
    return this.http
      .get<ProductDto[]>(this.apiUrl + '/getbycategoryid/' + categoryId)
      .pipe(
        map((response: ProductDto[]) =>
          response.map((dto) => new Product(dto))
        ),
        catchError(this.handleError)
      );
  }

  getProductsBySubcategoryId(subcategoryId: number): Observable<Product[]> {
    return this.http
      .get<ProductDto[]>(this.apiUrl + '/getbysubcategoryid/' + subcategoryId)
      .pipe(
        map((response: ProductDto[]) =>
          response.map((dto) => new Product(dto))
        ),
        catchError(this.handleError)
      );
  }

  getLatestProducts(): Observable<Product[]> {
    return this.http.get<ProductDto[]>(this.apiUrl + '/getlatestproducts').pipe(
      map((response: ProductDto[]) => response.map((dto) => new Product(dto))),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage: string;

    // Ağ veya istemci kaynaklı hatalar
    if (error.error instanceof ErrorEvent) {
      errorMessage = `İstemci hatası: ${error.error.message}`;
      console.error('İstemci hatası:', error.error);
      return throwError(() => new Error(errorMessage));
    }

    // Sunucu kaynaklı hatalar
    switch (error.status) {
      case 400:
        errorMessage = error.error.message || 'Geçersiz istek';
        break;
      case 401:
        errorMessage = 'Oturum süreniz doldu. Lütfen tekrar giriş yapın.';
        break;
      case 403:
        errorMessage = 'Bu işlem için yetkiniz bulunmuyor.';
        break;
      case 404:
        errorMessage = error.error.message;
        break;
      case 429:
        errorMessage = 'Çok fazla istek gönderildi. Lütfen biraz bekleyin.';
        break;
      case 500:
        errorMessage = 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.';
        break;
      case 503:
        errorMessage =
          'Servis şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.';
        break;
      case 0:
        errorMessage =
          'Sunucuya bağlanılamıyor. İnternet bağlantınızı kontrol edin.';
        break;
      default:
        errorMessage = 'Beklenmeyen bir hata oluştu.';
        break;
    }

    // Hata loglaması
    console.error('HTTP Hata Detayı:', {
      statusCode: error.status,
      message: errorMessage,
      timestamp: new Date().toISOString(),
      url: error.url,
      errorDetail: error.error,
    });

    return throwError(() => new Error(errorMessage));
  }
}

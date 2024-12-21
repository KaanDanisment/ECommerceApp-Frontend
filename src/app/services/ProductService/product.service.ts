import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Product } from '../../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'https://localhost:7281/api/product';
  constructor(private http: HttpClient) {}

  getProductsByCategoryId(categoryId: number): Observable<Product[]> {
    return this.http
      .get<Product[]>(this.apiUrl + '/getbycategoryid/' + categoryId)
      .pipe(
        map((response) => response),
        catchError(this.handleError)
      );
  }

  getProductsBySubcategoryId(subcategoryId: number): Observable<Product[]> {
    return this.http
      .get<Product[]>(this.apiUrl + '/getbysubcategoryid/' + subcategoryId)
      .pipe(
        map((response) => response),
        catchError(this.handleError)
      );
  }

  getLatestProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl + '/getlatestproducts').pipe(
      map((response) => response),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage =
      'Bilinmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `İstemci tarafı hata: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 400:
          errorMessage = error.error.message;
          break;
        case 404:
          errorMessage = error.error.message;
          break;
        case 500:
          errorMessage = 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.';
          break;

        default:
          errorMessage = `Hata ${error.status}: ${error.message}`;
          break;
      }
    }
    return throwError(() => new Error(errorMessage));
  }
}

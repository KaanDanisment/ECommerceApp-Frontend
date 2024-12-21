import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Subcategory } from '../../models/subcategory.model';

@Injectable({
  providedIn: 'root',
})
export class SubcategoryService {
  private apiUrl = 'https://localhost:7281/api/subcategory';
  constructor(private http: HttpClient) {}

  getSubcategories(): Observable<Subcategory[]> {
    return this.http.get<Subcategory[]>(this.apiUrl).pipe(
      map((response) => response),
      catchError(this.handleError)
    );
  }

  getSubcategoryById(id: number): Observable<Subcategory> {
    return this.http.get<Subcategory>(this.apiUrl + '/' + id).pipe(
      map((response) => response),
      catchError(this.handleError)
    );
  }

  getSubcategoriesByCategoryId(categoryId: number): Observable<Subcategory[]> {
    return this.http
      .get<Subcategory[]>(this.apiUrl + 'getbycategoryId' + categoryId)
      .pipe(
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

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  tap,
  throwError,
} from 'rxjs';
import { Subcategory } from '../../models/subcategory.model';
import { SubcategoryDto } from '../../models/Dtos/subcategoryDto.model';

@Injectable({
  providedIn: 'root',
})
export class SubcategoryService {
  private apiUrl = 'https://localhost:7281/api/subcategory';

  private subcategoriesSubject = new BehaviorSubject<Subcategory[]>([]);
  subcategories$ = this.subcategoriesSubject.asObservable();

  constructor(private http: HttpClient) {}

  getSubcategories(forceRefresh: boolean): Observable<Subcategory[]> {
    // Force refresh veya cache boş ise API'den çek
    if (forceRefresh || this.subcategoriesSubject.value.length === 0) {
      console.log('Subcategories fetched from API');
      return this.refreshSubcategories();
    }
    console.log('Subcategories fetched from cache');
    return this.subcategories$;
  }
  private refreshSubcategories(): Observable<Subcategory[]> {
    return this.http.get<SubcategoryDto[]>(this.apiUrl).pipe(
      map((subcategoryDto: SubcategoryDto[]) =>
        subcategoryDto.map((dto) => new Subcategory(dto))
      ),
      tap((response) => this.subcategoriesSubject.next(response)),
      catchError(this.handleError)
    );
  }

  getSubcategoryById(id: number): Observable<Subcategory> {
    return this.http.get<SubcategoryDto>(this.apiUrl + '/' + id).pipe(
      map((response: SubcategoryDto) => (response = new Subcategory(response))),
      catchError(this.handleError)
    );
  }

  getSubcategoriesByCategoryId(categoryId: number): Observable<Subcategory[]> {
    return this.http
      .get<SubcategoryDto[]>(this.apiUrl + '/getbycategoryId/' + categoryId)
      .pipe(
        map((response: SubcategoryDto[]) =>
          response.map((dto) => new Subcategory(dto))
        ),
        catchError(this.handleError)
      );
  }

  createSubcategory(formData: FormData) {
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });
    return this.http.post(this.apiUrl, formData).pipe(
      tap(() => this.refreshSubcategories),
      catchError(this.handleError)
    );
  }

  updateSubcategory(formData: FormData) {
    formData.forEach((value, key) => {
      if (value instanceof File) {
        console.log(
          `File - ${key}: ${value.name}, size: ${value.size}, type: ${value.type}`
        );
      } else {
        console.log(`${key}: ${value}`);
      }
    });
    return this.http.put(this.apiUrl, formData).pipe(
      tap(() => this.refreshSubcategories),
      catchError(this.handleError)
    );
  }

  deleteSubcategory(id: number) {
    return this.http.delete(this.apiUrl + '/' + id).pipe(
      tap(() => this.refreshSubcategories),
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
        errorMessage = 'İstenen kaynak bulunamadı.';
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

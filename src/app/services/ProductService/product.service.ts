import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  tap,
  throwError,
} from 'rxjs';
import { Product } from '../../models/product.model';
import { ProductDto } from '../../models/Dtos/productDto.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'https://localhost:7281/api/product';

  productsSubject = new BehaviorSubject<Product[]>([]);
  products$ = this.productsSubject.asObservable();

  totalPages!: Observable<number>;
  totalProducts!: Observable<number>;

  constructor(private http: HttpClient) {}

  getProducts(forceRefresh: boolean, page?: number): Observable<Product[]> {
    if (forceRefresh || this.productsSubject.value.length === 0) {
      console.log('Products fetched from API');
      return this.refreshProducts(page);
    }
    console.log('Products fetched from cache');
    return this.products$;
  }

  private refreshProducts(page?: number): Observable<Product[]> {
    const url = page
      ? this.apiUrl + `/getall?page=${page}`
      : this.apiUrl + '/getall';

    return this.http.get<any>(url).pipe(
      map((response) => {
        this.totalPages = of(response.totalPages);
        this.totalProducts = of(response.totalItems);
        return response.items.map((dto: ProductDto) => new Product(dto));
      }),
      tap((products) => {
        if (url == this.apiUrl + '/getall') {
          return products;
        } else {
          if (this.productsSubject.value.length == 0) {
            console.log(products);
            this.productsSubject.next(products);
          } else {
            console.log(products);
            this.productsSubject.next([
              ...this.productsSubject.value,
              ...products,
            ]);
          }
        }
      }),
      catchError(this.handleError)
    );
  }

  sortProducts(sortBy: string, page?: number): Observable<Product[]> {
    const url = page
      ? this.apiUrl + `/getall?page=${page}&sortBy=${sortBy}`
      : this.apiUrl + `/getall?sortBy=${sortBy}`;

    return this.http.get<any>(url).pipe(
      map((response) =>
        response.items.map((dto: ProductDto) => new Product(dto))
      ),
      tap((products) => {
        if (url == this.apiUrl + `/getall?sortBy=${sortBy}`) {
          return products;
        } else {
          console.log(products);
          this.productsSubject.next([
            ...this.productsSubject.value,
            ...products,
          ]);
        }
      }),
      catchError(this.handleError)
    );
  }

  //prettier-ignore
  sortProductsByCategory(sortBy: string, categoryId: number): Observable<Product[]> {
    return this.http
      .get<ProductDto[]>(
        this.apiUrl + `/getbycategoryid/${categoryId}?sortBy=${sortBy}`
      )
      .pipe(
        map((response: ProductDto[]) =>
          response.map((dto: ProductDto) => new Product(dto))
        ),
        tap((products) => {
          console.log(products);
          return products;
        }),
        catchError(this.handleError)
      );
  }

  //prettier-ignore
  sortProductsBySubcategory(sortBy: string, subcategoryId: number): Observable<Product[]> {
    return this.http
      .get<ProductDto[]>(
        this.apiUrl + `/getbysubcategoryid/${subcategoryId}?sortBy=${sortBy}`
      )
      .pipe(
        map((response: ProductDto[]) =>
          response.map((dto: ProductDto) => new Product(dto))
        ),
        tap((products) => {
          console.log(products);
          return products;
        }),
        catchError(this.handleError)
      );
  }

  getProductsByCategoryId(categoryId: number): Observable<Product[]> {
    return this.http
      .get<ProductDto[]>(this.apiUrl + '/getbycategoryid/' + categoryId)
      .pipe(
        map((response: ProductDto[]) =>
          response.map((dto: ProductDto) => new Product(dto))
        ),
        tap((products) => {
          console.log(products);
          return products;
        }),
        catchError(this.handleError)
      );
  }

  getProductsBySubcategoryId(subcategoryId: number): Observable<Product[]> {
    return this.http
      .get<ProductDto[]>(this.apiUrl + '/getbysubcategoryid/' + subcategoryId)
      .pipe(
        map((response: ProductDto[]) =>
          response.map((dto: ProductDto) => new Product(dto))
        ),
        tap((products) => {
          console.log(products);
          return products;
        }),
        catchError(this.handleError)
      );
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<ProductDto>(this.apiUrl + '/' + id).pipe(
      map((response: ProductDto) => new Product(response)),
      catchError(this.handleError)
    );
  }

  getLatestProducts(): Observable<Product[]> {
    return this.http.get<ProductDto[]>(this.apiUrl + '/getlatestproducts').pipe(
      map((response: ProductDto[]) => response.map((dto) => new Product(dto))),
      catchError(this.handleError)
    );
  }

  createProduct(formData: FormData) {
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });
    return this.http
      .post(this.apiUrl, formData)
      .pipe(catchError(this.handleError));
  }

  updateProduct(formData: FormData) {
    formData.forEach((value, key) => {
      if (value instanceof File) {
        console.log(
          `File - ${key}: ${value.name}, size: ${value.size}, type: ${value.type}`
        );
      } else {
        console.log(`${key}: ${value}`);
      }
    });
    return this.http
      .put(this.apiUrl, formData)
      .pipe(catchError(this.handleError));
  }

  deleteProduct(id: number) {
    return this.http
      .delete(this.apiUrl + '/' + id)
      .pipe(catchError(this.handleError));
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

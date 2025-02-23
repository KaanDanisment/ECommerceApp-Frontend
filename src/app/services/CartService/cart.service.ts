import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { Cart } from '../../models/cart.model';
import { CartDto } from '../../models/Dtos/cartDto.model';
import { CartItemCreateDto } from '../../models/Dtos/cartItemCreateDto.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = 'https://localhost:7281/api/cart';

  constructor(private http: HttpClient) {}

  getCart(): Observable<Cart | null> {
    return this.http.get<CartDto>(this.apiUrl + '/getCart').pipe(
      map((cartDto: CartDto) => {
        if (cartDto.cartItems == null) {
          return null;
        }
        const cart = new Cart(cartDto);
        return cart;
      }),
      tap((cart) => console.log(cart)),
      catchError((error) => {
        console.log('Error in getCart:', error); // Hatayı logla
        return this.handleError(error);
      })
    );
  }
  removeCartItemFromCart(cartItemId: string) {
    return this.http
      .delete(this.apiUrl + '/removeCartItem/' + cartItemId)
      .pipe(catchError(this.handleError));
  }
  addCartItemToCart(cartItemCreateDto: CartItemCreateDto) {
    return this.http
      .post(this.apiUrl + '/addToCart', cartItemCreateDto)
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

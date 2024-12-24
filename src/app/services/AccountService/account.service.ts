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
import { UserDto } from '../../models/Dtos/userDto.model';
import { User } from '../../models/user.model';
import { AddressDto } from '../../models/Dtos/addressDto.model';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private apiUrl = 'https://localhost:7281/api/account';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  getUserInfo(): void {
    this.http
      .get<UserDto>(this.apiUrl + '/getuserinfos', { withCredentials: true })
      .pipe(
        map((userDto) => {
          console.log('UserDto:', userDto); // Log raw DTO
          const user = new User(userDto);
          console.log('Mapped User:', user); // Log mapped user
          return user;
        }),
        tap((user) => this.currentUserSubject.next(user)),
        catchError(this.handleError)
      )
      .subscribe();
  }
  updateUser(userDto: UserDto) {
    const body = JSON.stringify(userDto);
    return this.http
      .put(this.apiUrl + '/updateuser', body, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      })
      .pipe(catchError(this.handleError));
  }
  createAddress(addressDto: AddressDto) {
    const body = JSON.stringify(addressDto);
    return this.http
      .post(this.apiUrl + '/createaddress', body, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      })
      .pipe(catchError(this.handleError));
  }
  deleteAddress(addressDto: AddressDto) {
    return this.http
      .delete(this.apiUrl + '/deleteaddress', {
        headers: { 'Content-Type': 'application/json' },
        body: addressDto,
        withCredentials: true,
      })
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

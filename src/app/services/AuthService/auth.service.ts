import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserRegisterDto } from '../../models/Dtos/userRegisterDto.model';
import { UserLoginDto } from '../../models/Dtos/userLoginDto.model';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  tap,
  throwError,
} from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://localhost:7281/api/auth';
  private isAuthenticatedSubject = new BehaviorSubject<boolean | null>(null);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  userRegister(userRegister: UserRegisterDto) {
    const body = JSON.stringify(userRegister);
    return this.http
      .post(this.apiUrl + '/register', body, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      })
      .pipe(catchError(this.handleError));
  }
  userLogin(userLogin: UserLoginDto) {
    const body = JSON.stringify(userLogin);
    return this.http
      .post(this.apiUrl + '/login', body, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        tap(() => {
          this.isAuthenticatedSubject.next(true);
          this.router.navigate(['/']);
        }),
        catchError(this.handleError)
      );
  }
  refreshAccessToken(): Observable<string> {
    return this.http
      .post<string>(
        this.apiUrl + '/refresh-token',
        {},
        { withCredentials: true }
      )
      .pipe(catchError(this.handleError));
  }
  logout(): void {
    this.http
      .post<void>(this.apiUrl + '/logout', {}, { withCredentials: true })
      .subscribe({
        next: () => {
          this.router.navigate(['/']);
          this.isAuthenticatedSubject.next(false);
        },
        error: (err) => {
          console.error(err.message, err.error);
        },
      });
  }

  isAuthenticated(): Observable<boolean> {
    return this.http
      .get<boolean>(this.apiUrl + '/isAuthenticated', { withCredentials: true })
      .pipe(
        tap((data) => {
          console.log(data);
          this.isAuthenticatedSubject.next(data);
        }),
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

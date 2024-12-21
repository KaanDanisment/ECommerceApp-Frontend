import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserRegisterDto } from '../../models/Dtos/userRegisterDto.model';
import { UserLoginDto } from '../../models/Dtos/userLoginDto.model';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { UserDto } from '../../models/Dtos/userDto.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://localhost:7281/api/auth';
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
      .pipe(catchError(this.handleError));
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
        },
      });
  }

  isAuthenticated(): Observable<boolean> {
    return this.http
      .get<boolean>(this.apiUrl + '/isAuthenticated', { withCredentials: true })
      .pipe(
        map((data) => data),
        tap((response) => console.log(response)),
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
        case 401:
          errorMessage = error.error.message;
          break;
        case 403:
          errorMessage =
            'Yasaklanmış işlem. Bu işlemi gerçekleştirmek için yetkiniz yok.';
          break;
        case 404:
          errorMessage = 'İstenen kaynak bulunamadı.';
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

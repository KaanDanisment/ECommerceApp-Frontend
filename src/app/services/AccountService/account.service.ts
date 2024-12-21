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
import { AddressDto } from '../../models/Dtos/AddressDto.model';

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
        map((userDto) => new User(userDto)),
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

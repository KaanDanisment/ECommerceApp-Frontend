import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/AuthService/auth.service';
import { catchError, map, Observable, of } from 'rxjs';

export const authGuard: CanActivateFn = (
  route,
  state
): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated().pipe(
    map((isAuth: boolean) => {
      if (isAuth) {
        return true;
      } else {
        return router.createUrlTree(['/account/login']);
      }
    }),
    catchError((error) => {
      console.error('Auth Guard Error:', error);
      // Hata durumunda login sayfasına yönlendir
      return of(router.createUrlTree(['/account/login']));
    })
  );
};

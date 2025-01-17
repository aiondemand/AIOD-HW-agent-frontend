import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

export interface ICustomHttpErrorRes {
  status: number;
  message: string;
}

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<ICustomHttpErrorRes>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => {
          return {
            status: error.status,
            message: error.error.message,
          } as ICustomHttpErrorRes;
        });
      })
    );
  }
}

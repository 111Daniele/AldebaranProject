import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, exhaustMap, take } from 'rxjs';
import { AuthService } from './auth.service';


export class AuthInterceptorService implements HttpInterceptor{

  constructor() { }

  auth: AuthService= inject(AuthService)

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
     return this.auth.user.pipe(take(1), exhaustMap(user => {
      if (!user) return next.handle(req);
      let modifiedRequest= req.clone({params: new HttpParams().set("auth", user.token)});
      return next.handle(modifiedRequest)
    }))
}
}

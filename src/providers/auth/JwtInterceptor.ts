// JWT interceptor
import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Storage} from "@ionic/storage";


@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private storage: Storage) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let ref = this;
    ref.storage.get(`Token`).then(function (token) {
      if (token) {
        const headers = {
          'Authorization': `Bearer ${token}`,
        };
        if (request.responseType === 'json') {
          headers['Content-Type'] = 'application/json';
        }
        request = request.clone({
          setHeaders: headers
        });
      }

    });
    return next.handle(request);
  }
}

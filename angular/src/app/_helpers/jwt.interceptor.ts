import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { GetApiurl, baseURL } from '../parameters'


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add auth header with jwt if user is logged in and request is to api url
        const currentUser = this.authenticationService.currentUserValue;
        const isLoggedIn = currentUser && currentUser.token;
        const isApiUrl = request.url.startsWith(baseURL);
        if (isLoggedIn && isApiUrl) {
            request = request.clone({
                setHeaders: {
                    
                    Authorization: `Bearer ${currentUser.token}`,
                    'content-type' : 'application/json'
                    
                },
                
                
            });
        }

        return next.handle(request);
    }
}
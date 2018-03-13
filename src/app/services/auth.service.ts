import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { CookieService} from 'ngx-cookie-service';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { Token } from '../models/token';
import 'rxjs/add/operator/map';
@Injectable()
export class AuthService {
  baseUrl = 'http://localhost:8000/';
  authOtions;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  user: User = {
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    phone: ''
  };
  // authChange = new Observable( this.onAuthChange());
  isLoginSubject = new BehaviorSubject<boolean>(this.hasToken());
  currentUserSubject = new BehaviorSubject<string>(this.getUser());
  constructor(
    private router: Router,
    private cookieService: CookieService,
    private http: HttpClient
  ) { }
  checkAuthChange() {}
  onAuthChange() {
    return this.isLoggedIn;
  }
  isLoggedIn(): Observable<boolean> {
    return this.isLoginSubject.asObservable();
  }
  loggedInUser(): Observable<string> {
    return this.currentUserSubject.asObservable();
  }
  loginSuccess() {
    this.isLoginSubject.next(true);
    this.currentUserSubject.next(this.getUser());
  }
  login(user: string, password: string): Observable<any> {
    const body = JSON.stringify({
      username: user,
      password: password
    });
    // this.setToken('token');
    return this.http.post(this.baseUrl + 'retro/user/login/', body, this.httpOptions);
  }
  logout() {
    this.http.get(this.baseUrl + 'retro/user/logout');
    this.deleteToken();
    this.isLoginSubject.next(false);
  }
  refreshToken() {
    if (this.getToken() !== null) {
        const body = {
          token: this.getToken()
        };
        const refreshToken =  this.http.post(this.baseUrl + 'api-token-refresh/', body, this.httpOptions);
        refreshToken.subscribe((data: Token) => {
            if ( data.token) {
              this.setToken(data.token);
            } else {
                this.router.navigate(['login']);
            }
          },
          (err: HttpErrorResponse) => {
            this.router.navigate(['login']);
          }
        );
    } else {
      this.router.navigate(['login']);
    }
  }
  hasToken() {
    return !!localStorage.getItem('token');
  }

  getUser(): string {
    return localStorage.getItem('user');
  }
  getToken(): string {
    return localStorage.getItem('token');
  }

  deleteToken() {
    localStorage.clear();
    console.log('localStorage cleard');
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  isAuthenticated() {
    if ( this.getToken() !== null) {
      const body = {
        token: this.getToken()
      };
      const refreshToken =  this.http.post(this.baseUrl + 'api-token-verify/', body, this.httpOptions);
      return refreshToken.map( (action: Token) => {
        if ( action instanceof Object ) {
          return action.token === body.token;
        } else {
          return false;
        }
      });
    } else {
      return new Observable( observe => observe.next(false));
    }
  }

  getAuthOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.getToken()
      })
    };
  }

}

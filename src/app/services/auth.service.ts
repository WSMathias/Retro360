import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { Token } from '../models/token';
import 'rxjs/add/operator/map';
import { ToastrService } from 'ngx-toastr';
import { DataService } from './data.service';
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
  isLoginSubject = new BehaviorSubject<boolean>(this.hasToken());
  currentUserSubject = new BehaviorSubject<string>(this.getUser());
  constructor(
    private toastrService: ToastrService,
    private router: Router,
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
  needLogin() {
    this.deleteToken();
    this.isLoginSubject.next(false);
    this.router.navigate(['login']);
  }
  login(username: string, password) {
    const body = JSON.stringify({
      username: username,
      password: password
    });
    this.http.post(this.baseUrl + 'api-token-auth/', body, this.httpOptions).subscribe(
      (data: any) => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', username);
        this.toastrService.success('Succesfully loged in');
        this.loginSuccess();
        this.router.navigate(['/']);
      },
        (err: HttpErrorResponse) => {
        if ( err.status !== 400 ) {
          this.toastrService.error(err.message, 'error');
        } else {
          this.toastrService.error('inalid credentials');
        }
    });
  }
  logout() {
    this.http.get(this.baseUrl + 'logout');
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

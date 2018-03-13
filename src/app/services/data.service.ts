import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Router, Route } from '@angular/router';
import { Board } from '../models/board';
import { Feedback } from '../models/feedback';
import { User } from '../models/user';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
@Injectable()
export class DataService {
  private users: User[];
  private baseUrl = 'http://localhost:8000/';
  private board: Board;
  private boards: Board[];
  private feedback: Feedback;
  private feedbacks: Feedback[];
  userSubject: BehaviorSubject<any> = new BehaviorSubject('');
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) { }

  register(user) {
    console.log(user);
    const body = {
      username: user.username,
      first_name: user.firstname,
      last_name: user.lastname,
      email: user.email,
      password: user.password,
      boards: []
    };
    const url = this.baseUrl + 'retro/user/';
    const response =  this.http.post(url, body, this.httpOptions);
    return response;
  }
  getBoards() {
    const url = this.baseUrl + 'retro/board/';
    const httpOptions = this.authService.getAuthOptions();
    const response =  this.http.get(url, httpOptions);
    return response;
  }
  getBoard(id: number) {
    const url = this.baseUrl + 'retro/board/' + id + '/';
    const httpOptions = this.authService.getAuthOptions();
    const response =  this.http.get(url, httpOptions);
    return response;
  }
  updateBoard(id: number, board: Board) {
    const url = this.baseUrl + 'retro/board/' + id + '/';
    const body = board;
    const httpOptions = this.authService.getAuthOptions();
    const response =  this.http.put(url, body, httpOptions);
    return response;
  }
  deleteBoard(id: number) {
    const url = this.baseUrl + 'retro/board/' + id + '/';
    const httpOptions = this.authService.getAuthOptions();
    const response =  this.http.get(url, httpOptions);
    return response;
  }
  getFeedbacks(id: number) {
    const url = this.baseUrl + 'retro/board/' + id + '/feedbacks';
    const httpOptions = this.authService.getAuthOptions();
    const response =  this.http.get(url, httpOptions);
    return response;
  }

  getUsers(): Observable<any> {
    const url = this.baseUrl + 'retro/user/';
    const httpOptions = this.authService.getAuthOptions();
    const response =  this.http.get(url, httpOptions);
    return response;
  }
  storeUsers(users: User[]) {
      this.users = users;
      console.log('users saved');
  }
  getUserDetailById(id: number): User {
    if (!this.users) {
      console.log('no users');
      return {};
    }
    return this.users.find( user => user.id === id);
  }
  getUserDetailByUserName(username: string): User {
    if (!this.users) {
      console.log('no users');
      return {};
    }
    return this.users.find( user => user.username === username);
  }
  getUserDetailByEmail(email: string): User {
    if (!this.users) {
      console.log('no users');
      return {};
    }
    return this.users.find( user => user.email === email );
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Router, Route } from '@angular/router';
import { Board } from '../models/board';
import { Feedback } from '../models/feedback';
import { User } from '../models/user';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/catch';
@Injectable()
export class DataService {
  private users: User[];
  private baseUrl = 'http://localhost:8000/retro/';
  private board: Board;
  private boards: Board[];
  private feedback: Feedback;
  private feedbacks: Feedback[];
  private userSubject: BehaviorSubject<any> = new BehaviorSubject('');
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

  handelErrorOnResponse = (err: HttpErrorResponse) => {
    console.log('error Handeled');
    if (err.status === 401) {
      this.authService.needLogin();
    }
    return err;
  }
  register(user) {
    const body = {
      username: user.username,
      first_name: user.firstname,
      last_name: user.lastname,
      email: user.email,
      password: user.password,
      boards: []
    };
    const url = `${this.baseUrl}user/`;
    return this.http.post(url, body, this.httpOptions);
  }
  getBoards() {
    const url = `${this.baseUrl}board/`;
    const httpOptions = this.authService.getAuthOptions();
    return this.http.get(url, httpOptions);
  }
  getBoard(id: number) {
    const url = `${this.baseUrl}board/${id}/`;
    const httpOptions = this.authService.getAuthOptions();
    const response =  this.http.get(url, httpOptions);
    return response;
  }
  updateBoard(id: number, board: Board) {
    const url = `${this.baseUrl}board/${id}/`;
    const body = board;
    const httpOptions = this.authService.getAuthOptions();
    return this.http.put(url, body, httpOptions);
  }
  deleteBoard(id: number) {
    const url = `${this.baseUrl}board/${id}/`;
    const httpOptions = this.authService.getAuthOptions();
    return this.http.delete(url, httpOptions);
  }
  getFeedbacks(id: number) {
    const url = `${this.baseUrl}board/${id}/feedbacks/`;
    const httpOptions = this.authService.getAuthOptions();
    return this.http.get(url, httpOptions);
  }

  postFeedback(feedback: Feedback) {
    const url = `${this.baseUrl}feedback/`;
    const body = feedback;
    const httpOptions = this.authService.getAuthOptions();
    return this.http.post(url, body, httpOptions);
  }

  createBoard(board: Board) {
    const url = `${this.baseUrl}board/`;
    const body = board;
    const httpOptions = this.authService.getAuthOptions();
    return this.http.post(url, body, httpOptions);
  }
  getUsers(): Observable<any> {
    const url = `${this.baseUrl}user/`;
    const httpOptions = this.authService.getAuthOptions();
    return this.http.get(url, httpOptions).map(
      (res: User[]) => {
        this.storeUsers(res);
        return res;
      },
      this.handelErrorOnResponse
    );
  }
  storeUsers(users: User[]) {
      this.users = users;
  }
  getUserDetailById(id: number): User {
    if (!this.users) {
      return {};
    }
    return this.users.find( user => user.id === id);
  }
  getUserDetailByUserName(username: string): User {
    if (!this.users) {
      return {};
    }
    return this.users.find( user => user.username === username);
  }
  getUserDetailByEmail(email: string): User {
    if (!this.users) {
      return {};
    }
    return this.users.find( user => user.email === email );
  }
}

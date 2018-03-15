import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { Observable } from 'rxjs/Observable';
import { Board } from '../../models/board';
import { Feedback } from '../..//models/feedback';
import { User } from '../../models/user';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private boards: Board[];
  private users: User[];
  private isLoggedIn: Observable<boolean>;
  private loggedInUser: Observable<string>;
  private isStaff: boolean;

  constructor(
    private authservice: AuthService,
    private dataService: DataService
  ) {
    this.isLoggedIn = this.authservice.isLoggedIn();
    this.loggedInUser = this.authservice.loggedInUser();
  }

  ngOnInit() {

  }
  onGetBoardsClick() {
    this.dataService.getBoards().subscribe( (boards: Board[]) => {
      this.boards = boards;
    });
  }
  onGetUsersClick() {
    this.dataService.getUsers().subscribe( (users: User[]) => {
      this.users = users;
    });
  }

}

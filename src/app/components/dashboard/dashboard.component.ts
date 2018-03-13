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
  boards: Board[];
  users: User[];
  isLoggedIn: Observable<boolean>;
  loggedInUser: Observable<string>;

  constructor(
    private authservice: AuthService,
    private dataService: DataService
  ) {
    this.isLoggedIn = this.authservice.isLoggedIn();
    this.loggedInUser = this.authservice.loggedInUser();
  }

  ngOnInit() {
    // this.isLoggedIn.subscribe( status => {
    //   if (status) {
    //     this.dataService.getUsers().subscribe( (users: User[]) => {
    //       this.dataService.storeUsers(users);
    //     });
    //   }
    // });
  }
  onGetBoardsClick() {
    this.dataService.getBoards().subscribe( (boards: Board[]) => {
      console.log(boards);
      this.boards = boards;
    });
  }
  onGetUsersClick() {
    this.dataService.getUsers().subscribe( (users: User[]) => {
      console.log(users);
      this.users = users;
    });
  }

}

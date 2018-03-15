import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  private users: User[];

  constructor(
    private dataService: DataService,
  ) { }

  ngOnInit() {
  }
  onGetUsersClick() {
    this.dataService.getUsers().subscribe( (users: User[]) => {
      this.users = users;
    });
  }
}

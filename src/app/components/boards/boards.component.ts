import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params, Data } from '@angular/router';
import { DataService } from '../../services/data.service';
import { Board } from '../../models/board';
import { User } from '../../models/user';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.css']
})
export class BoardsComponent implements OnInit {
  boards: Board[];
  users: User[];
  constructor(
    private dataservice: DataService
   ) { }

  ngOnInit() {
        this.dataservice.getUsers().subscribe( (userData: User[]) => {
          this.users = userData;
          this.dataservice.storeUsers(userData);
          const mapAdminToBoard = (board) => {
              board.admin = this.users.find( user => user.id === board.board_admin);
              board.name = board.board_name;
              board.admin.firstname = board.admin.first_name;
              board.admin.lastrname = board.admin.last_name;
              // console.log(board);
              return board;
          };
          this.dataservice.getBoards().subscribe( (data: Board[]) => {
            this.boards = data.map(mapAdminToBoard);
          });
        });
      }

}

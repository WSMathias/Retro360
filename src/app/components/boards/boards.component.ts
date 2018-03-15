import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params, Data } from '@angular/router';
import { DataService } from '../../services/data.service';
import { Board } from '../../models/board';
import { User } from '../../models/user';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.css']
})
export class BoardsComponent implements OnInit {
  private boards: Board[];
  private users: User[];
  private loggedInUser: User;
  constructor(
    private router: Router,
    private toastrService: ToastrService,
    private dataservice: DataService,
    private authService: AuthService
   ) { }
  newBoardAdded( newBoard: boolean) {
    this.loadBoards();
    console.log(newBoard);
  }
  onDeleteBoard(board: Board) {
    this.dataservice.deleteBoard(board.id).subscribe(
      (res) => {
        this.boards.splice(this.boards.indexOf(board), 1);
        this.toastrService.success('Board Deleted');
      },
      (err: HttpErrorResponse) => {
        this.toastrService.error(err.statusText);
      }
    );
  }
  ngOnInit() {
    this.loadBoards();
  }

  loadBoards() {
    this.dataservice.getUsers().subscribe( (userData: User[]) => {
      this.users = userData;
      this.dataservice.storeUsers(userData);
      this.loggedInUser = this.dataservice.getUserDetailByUserName(this.authService.getUser());
      const mapAdminToBoard = (board) => {
          board.admin = this.users.find( user => user.id === board.board_admin);
          board.name = board.board_name;
          board.admin.firstname = board.admin.first_name;
          board.admin.lastrname = board.admin.last_name;
          board.iamIn = (board.board_members.indexOf(this.loggedInUser.id) > 0);
          return board;
        };
      const amIonBoard = (board) => {
        if (board.board_admin === this.loggedInUser.id) {
          return true;
        }
        return  board.board_members.indexOf(this.loggedInUser.id) > 0;
      };
        this.dataservice.getBoards().subscribe( (data: Board[]) => {
          this.boards = data.filter( amIonBoard).map(mapAdminToBoard);
        });
      },
      (err: HttpErrorResponse) => {
        if (err.status === 401) {
          this.toastrService.info('Session expired');
          this.router.navigate(['login']);
        }
      }
    );
  }
}

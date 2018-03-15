import { Component, OnInit, OnChanges } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { DataService } from '../../services/data.service';
import { Board } from '../../models/board';
import { User } from '../../models/user';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, OnChanges {
  private id: number;
  private board: Board;
  private boardAdmin: string;
  private boardName: String;
  private boardNewName: String;
  private boardMembers: User[];
  private userObserver: Observable<Array<User>>;
  private boardObserver: Observable<Array<Board>>;
  private isReadyToLoad: boolean;
  private hasMembers: boolean;
  private feedbackTo: User;
  private isEditBoardName: boolean;
  private isWriteFeedback: boolean;
  private isAddMembers: boolean;
  private isBoardAdmin: boolean;
  constructor(
    private router: Router,
    private toastrService: ToastrService,
    private dataService: DataService,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.isReadyToLoad = false;
    this.hasMembers = false;
    this.isWriteFeedback = false;
    this.userObserver = dataService.getUsers();
  }

  ngOnInit() {
    this.isEditBoardName = false;
    this.isAddMembers = false;
    this.id = this.route.snapshot.params['id'];
    this.loadBoardData();
  }
  editBoardNameClick() {
    this.boardNewName = this.board.board_name;
    console.log(this.boardName);
    this.isEditBoardName = true;
  }
  ngOnChanges() {
    this.loadBoardData();
    this.toastrService.info('CHANGED');

  }

  setFeedbackTo(fbto) {
    this.feedbackTo = fbto;
  }
  onNewMembers(members: User[]= []) {
    this.isAddMembers = false;
    this.boardMembers = members;
    this.loadBoardData();
  }

  loadBoardData() {
    this.userObserver.pipe(take(1)).subscribe( (users: User[]) => {
      this.dataService.storeUsers(users);
      this.dataService.getBoard(this.id).subscribe( (data: Board) => {
        this.board = data;
        this.isBoardAdmin = data.board_admin === this.dataService.getUserDetailByUserName(this.authService.getUser()).id;
        this.board.admin = this.dataService.getUserDetailById(data.board_admin);
        if (!this.board.board_members.length) {
          this.isReadyToLoad = true;
          this.hasMembers = false;
        } else {
          this.boardMembers = [];
          for (let i = 0; i < this.board.board_members.length; i++ ) {
            this.board.board_members[i] = this.dataService.getUserDetailById(data.board_members[i]);
            this.boardMembers.push(this.dataService.getUserDetailById(data.board_members[i]));
            this.isReadyToLoad = true;
            this.hasMembers = true;
          }
        }
      });

    });
  }
  onDeleteClick(id: number) {
   let membersId = this.board.board_members.map(mermer => mermer.id);
   membersId = membersId.filter(item => item !== id);
   const newBoard: Board = {
    board_name: this.board.board_name,
    board_admin: this.board.admin.id,
    board_members: membersId
  };
  this.dataService.updateBoard(this.id, newBoard).subscribe( res => {
    this.toastrService.success('Member deleted');
    this.loadBoardData();
  },
(err: HttpErrorResponse) => {
    this.toastrService.success(err.message);
});
  }
  onUpdateBoardName() {
    const newBoard = {
      board_name: this.board.board_name,
      board_admin: this.board.admin.id,
      board_members: this.boardMembers
    };
    this.dataService.updateBoard(this.id, newBoard).subscribe( res => {
      this.toastrService.success('Board Name Updated');
      this.isEditBoardName = false;
    },
  (err: HttpErrorResponse) => {
      this.toastrService.success('error on updating');
  });
  }
}

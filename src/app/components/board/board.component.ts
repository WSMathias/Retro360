import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { DataService } from '../../services/data.service';
import { Board } from '../../models/board';
import { User } from '../../models/user';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  id: number;
  board: Board;
  boardAdmin: string;
  boardName: String;
  boardMembers: string[];
  private userObserver: Observable<Array<User>>;
  private boardObserver: Observable<Array<Board>>;
  private isReadyToLoad: boolean;
  private hasMembers: boolean;
  constructor(
    private router: Router,
    private toastrService: ToastrService,
    private dataService: DataService,
    private route: ActivatedRoute,
  ) {
    this.isReadyToLoad = false;
    this.hasMembers = false;
    this.userObserver = dataService.getUsers();
  }

  ngOnInit() {
    this.loadBoardData();
  }

  ngOnChange() {
    this.loadBoardData();
    this.toastrService.info('CHANGED');
  }
  loadBoardData() {
    this.id = this.route.snapshot.params['id'];
    this.userObserver.pipe(take(1)).subscribe( (users: User[]) => {
      this.dataService.storeUsers(users);
      this.dataService.getBoard(this.id).subscribe( (data: Board) => {
        this.board = data;
        this.board.admin = this.dataService.getUserDetailById(data.board_admin);
        // console.log(this.board);
        // console.log(this.isReadyToLoad);
        // console.log(this.board.board_members);
        if (!this.board.board_members.length) {
          this.isReadyToLoad = true;
          this.hasMembers = false;
          // console.log(this.isReadyToLoad);
        } else {
          for (let i = 0; i < this.board.board_members.length; i++ ) {

            this.board.board_members[i] = this.dataService.getUserDetailById(data.board_members[i]);
            // console.log(this.board.board_members[i]);
            this.isReadyToLoad = true;
            this.hasMembers = true;
            // console.log(this.isReadyToLoad);

          }
        }
      });

    });
  }
  onDeleteClick(id: number) {
  //  console.log('old members:', this.board.board_members);
  //  console.log(' member id to be deleted', id);
   let membersId = this.board.board_members.map(mermer => mermer.id);
  //  console.log('old members id:', membersId);
  //  console.log('index of user id to be deleted', membersId.indexOf(id));
   membersId = membersId.filter(item => item !== id);
  //  console.log('new members id list', membersId);
   const newBoard: Board = {
    board_name: this.board.board_name,
    board_admin: this.board.admin.id,
    board_members: membersId
  };
  this.dataService.updateBoard(this.id, newBoard).subscribe( res => {
    // console.log('reponse from server:', res);
    this.toastrService.success('Member deleted');
    // this.boardMembers = [];
    // this.isReadyToLoad = false;
    this.loadBoardData();
    // this.router.navigate([`board/${this.id}`]);
  },
(err: HttpErrorResponse) => {
    console.log(err.statusText);
    this.toastrService.success(err.message);
});
  }

  // onDeleteClick(id: number) {
  //   console.log(`delete ${id}`);
  //   this.dataService.deleteBoard(id).subscribe( res => {
  //     console.log(res);
  //     this.toastrService.success('Board Deleted');
  //     this.router.navigate([`board/${this.id}`]);
  //   },
  // (err: HttpErrorResponse) => {
  //     console.log(err.statusText);
  //     this.toastrService.success('error on delete');
  // });
  // }

  // onSubmitClick() {
  //   const newBoard = {
  //     board_name: this.board.board_name,
  //     board_admin: this.board.admin.id,
  //     board_members: this.getMemberId()
  //   };
  //   this.dataService.updateBoard(this.id, newBoard).subscribe( res => {
  //     console.log(res);
  //     this.toastrService.success('New members added');
  //     this.router.navigate([`board/${this.id}`]);
  //   },
  // (err: HttpErrorResponse) => {
  //     console.log(err.statusText);
  //     this.toastrService.success('error on updating');
  // });
  // }
}

import { Component, OnInit, Input, Output, EventEmitter, OnChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { Board } from '../../models/board';
import { HttpErrorResponse } from '@angular/common/http';
import { not } from '@angular/compiler/src/output/output_ast';
declare var jQuery: any;
@Component({
  selector: 'app-add-members',
  templateUrl: './add-members.component.html',
  styleUrls: ['./add-members.component.css']
})
export class AddMembersComponent implements OnInit, OnChanges {
  @Input() toBoard: number;
  @Output() newMembers: EventEmitter<any> = new EventEmitter<any>();
  private members: User[];
  private boardMembesrId: number[];
  private users: User[];
  private user: User;
  private id: number;
  private hasMembers: boolean;
  private isReadyToLoad: boolean;
  private board: Board;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private authService: AuthService,
    private router: Router
  ) { }
  ngOnInit() {
    this.id = this.toBoard;
    this.members = [];
    jQuery('#addMembers').modal('show');
    this.loadBoardData();
  }

  ngOnChanges() {
  }

  loadBoardData() {
    this.isReadyToLoad = false;
    this.hasMembers = false;
    this.dataService.getUsers().subscribe( (users: User[]) => {
      this.dataService.storeUsers(users);
      this.users = users;
      this.dataService.getBoard(this.id).subscribe( (data: Board) => {
        this.board = data;
        // TODO filter users already member of board
        this.board.admin = this.dataService.getUserDetailById(data.board_admin);
        this.boardMembesrId = data.board_members;
        if (!this.board.board_members.length) {
          this.isReadyToLoad = true;
          this.hasMembers = false;
        } else {
          for (let i = 0; i < this.board.board_members.length; i++ ) {
            this.board.board_members[i] = this.dataService.getUserDetailById(data.board_members[i]);
            this.isReadyToLoad = true;
            this.hasMembers = true;
          }
        }
      });

    });
  }
  onCheckClick(member: User, event) {
    if (!this.members) {
      this.members = [member];
    } else {
      this.members.push(member);
    }
  }
  getMemberId() {
    let members = this.board.board_members.concat(this.members);
    members = members.filter( (id, index) => {
      return members.indexOf(id) === index;
    }).map(mem => mem.id);
    return members;
  }
  onCloseClick() {
    this.newMembers.emit(false);
  }
  onSubmitClick() {
    this.isReadyToLoad = false;
    const newBoard: Board = {
      board_name: this.board.board_name,
      board_admin: this.board.admin.id,
      board_members: this.getMemberId()
    };
    this.dataService.updateBoard(this.id, newBoard).subscribe(
      res => {
        this.newMembers.emit(true);
        jQuery('#addMembers').modal('hide');
      },
      (err: HttpErrorResponse) => {
        this.newMembers.emit(false);
      });
  }

}

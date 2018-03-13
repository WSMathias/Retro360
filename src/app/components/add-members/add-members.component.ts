import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { Board } from '../../models/board';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-members',
  templateUrl: './add-members.component.html',
  styleUrls: ['./add-members.component.css']
})
export class AddMembersComponent implements OnInit {
  private members: User[];
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
    this.isReadyToLoad = false;
    this.hasMembers = false;
    this.id = this.route.snapshot.params['id'];
    this.dataService.getUsers().subscribe( (users: User[]) => {
      this.dataService.storeUsers(users);
      this.users = users;
      this.dataService.getBoard(this.id).subscribe( (data: Board) => {
        this.board = data;
        this.board.admin = this.dataService.getUserDetailById(data.board_admin);
        if (!this.board.board_members.length) {
          this.isReadyToLoad = true;
          this.hasMembers = false;
          console.log(this.isReadyToLoad);
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
  onCheckClick(member: User, event) {
    console.log(event);
    console.log(member);
    if (!this.members) {
      this.members = [member];
    } else {
      this.members.push(member);
    }
  }
  getMemberId() {
    const member = this.board.board_members.concat(this.members);
    return member.filter( (id, index) => {
      return member.indexOf(id) === index;
    }).map(mem => mem.id);
  }
  onSubmitClick() {
    const newBoard: Board = {
      board_name: this.board.board_name,
      board_admin: this.board.admin.id,
      board_members: this.getMemberId()
    };
    console.log(newBoard);
    this.dataService.updateBoard(this.id, newBoard).subscribe( res => {
      console.log(res);
    },
  (err: HttpErrorResponse) => {
      console.log(err.statusText);
  });
    this.router.navigate([`board/${this.id}`]);
  }

}

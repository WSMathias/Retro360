import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
declare var jQuery: any;
@Component({
  selector: 'app-create-board',
  templateUrl: './create-board.component.html',
  styleUrls: ['./create-board.component.css']
})
export class CreateBoardComponent implements OnInit {
  @Output() boardCreated: EventEmitter<any> = new EventEmitter<any>();
  private boardName: string;
  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private toastrService: ToastrService
  ) { }

  ngOnInit() {
    this.boardName = '';
  }
  onClose() {
    this.boardName = '';
  }
  onCreate() {
    const board = {
      board_name: this.boardName,
      board_admin: this.dataService.getUserDetailByUserName(this.authService.getUser()).id,
      board_members: []
    };
    this.dataService.createBoard(board).subscribe(
      (res) => {
        this.boardName = '';
        this.toastrService.success('Board created');
        this.boardCreated.emit(res);
        jQuery('#createBoard').modal('hide');
      },
      (err: HttpErrorResponse) => {
        this.toastrService.success(err.statusText);
      }
    );
    jQuery('#createBoard').modal('hide');
  }
}

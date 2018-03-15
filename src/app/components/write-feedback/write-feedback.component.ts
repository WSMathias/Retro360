import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Board } from '../../models/board';
import { DataService } from '../../services/data.service';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../models/user';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
declare var jQuery: any;
@Component({
  selector: 'app-write-feedback',
  templateUrl: './write-feedback.component.html',
  styleUrls: ['./write-feedback.component.css']
})
export class WriteFeedbackComponent implements OnInit, OnChanges {
  @Input() toBoard: Board;
  @Input() feedbackTo: User;
  private fromUser: User;
  private toUser: User;
  private content: string;
  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private toastrService: ToastrService,
  ) { }

  ngOnInit() {
    this.content = '';
  }
  ngOnChanges() {

  }
  onClose() {
    this.content = '';
  }
  onSave() {
    const feedback = {
      feedback_from:  this.dataService.getUserDetailByUserName(this.authService.getUser()).id,
      feedback_to: this.feedbackTo.id,
      board: this.toBoard.id,
      content: this.content
    };
    this.dataService.postFeedback(feedback).subscribe((res) => {
      jQuery('#writeFeedback').modal('hide');
      this.toastrService.success('Feedback sent');
      this.content = '';
    },
    (err: HttpErrorResponse) => {
        this.toastrService.error(err.message);
    });
  }

}

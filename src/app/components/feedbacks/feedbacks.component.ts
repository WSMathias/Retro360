import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { Board } from '../../models/board';
import { Feedback } from '../../models/feedback';

@Component({
  selector: 'app-feedbacks',
  templateUrl: './feedbacks.component.html',
  styleUrls: ['./feedbacks.component.css']
})
export class FeedbacksComponent implements OnInit {
  private users: User[];
  private user: User;
  private id: number;
  private receiverId: number;
  private receiver: User;
  private isReadyToLoad: boolean;
  private board: Board;
  private feedbacks: any[];
  // private noFeedback
  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.isReadyToLoad = false;
    this.id = this.route.snapshot.params['id'];
    this.receiverId = this.route.snapshot.params['receiver'];
    console.log('board id:', this.id);
    console.log('receiver id:', this.receiverId);
    this.loadBoardData();
  }

  loadBoardData() {
    this.isReadyToLoad = false;
    this.dataService.getUsers().subscribe( (users: User[]) => {
      this.users = users;
      this.dataService.storeUsers(users);
      this.dataService.getBoard(this.id).subscribe( (data: Board) => {
        this.board = data;
        this.board.admin = this.dataService.getUserDetailById(data.board_admin);
        // this.receiver = this.dataService.getUserDetailById(this.receiverId);
        this.receiver = this.users.find( (user: User) => user.id == this.receiverId );
        // console.log(this.users[0].id, this.receiverId, this.id);
        // console.log(this.receiver);
        // console.log(this.board);
        // for (let i = 0; i < this.board.board_members.length; i++ ) {
        //       this.board.board_members[i] = this.dataService.getUserDetailById(data.board_members[i]);
        //       // console.log(this.board.board_members[i]);
        //       this.readyToLoad = true;
        // }
        this.loadFeedbacks(this.id);
      });

    });
  }

  loadFeedbacks(board_id: number) {
    // console.log('loading feedbacks');
    this.dataService.getFeedbacks(board_id).subscribe( (data: Feedback[]) => {
      this.isReadyToLoad = true;
      // console.log(data);
      this.feedbacks = data
      .filter( (feedback: Feedback) => {
        // console.log(feedback);
        return feedback.feedback_to === this.receiver;
      })
      .map( (feedback: Feedback) => {
        return this.dataService.getUserDetailById(feedback.feedback_from);
      }
      );
      // console.log(this.feedbacks);
    });

  }

}

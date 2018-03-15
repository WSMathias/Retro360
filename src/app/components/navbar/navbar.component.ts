import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs/Observable';
import { DataService } from '../../services/data.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  private isLoggedIn: Observable<boolean>;
  private loggedInUser: string;
  constructor(
    private toastrService: ToastrService,
    private dataService: DataService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.authService.loggedInUser().subscribe((username) => {
      this.loggedInUser = username;
    });
   }
  onLogoutClick() {
    this.authService.logout();
    this.toastrService.info('your logged Out');
  }

}

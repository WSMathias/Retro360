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
  isLoggedIn: Observable<boolean>;
  loggedInUser: string;
  constructor(
    private toastrService: ToastrService,
    private dataService: DataService,
    private authService: AuthService
  ) {
    this.isLoggedIn = authService.isLoggedIn();
    authService.loggedInUser().subscribe((username) => {
      this.loggedInUser = username;
    });
   }

  ngOnInit() {
   }
  onLogoutClick() {
    this.authService.logout();
    this.toastrService.info('your logged Out');
  }

}

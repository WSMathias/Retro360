import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private username: string;
  constructor(
    private router: Router,
    private toastrService: ToastrService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.deleteToken();
  }

  onSubmit({value, valid}: {value: string, valid: boolean}) {
    if (!valid) {
      this.toastrService.error('inalid credentials', 'error', { timeOut: 3000});
    } else {
      this.username = value['username'];
      const password = value['password'];
      this.authService.login(this.username, password);
      this.authService.login(this.username, password);
    }
  }
}

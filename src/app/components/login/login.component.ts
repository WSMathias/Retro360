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
  username: string;
  constructor(
    private router: Router,
    private toasterService: ToastrService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.deleteToken();
  }

  onSubmit({value, valid}: {value: string, valid: boolean}) {
    if (!valid) {
      this.toasterService.error('inalid credentials', 'error', { timeOut: 3000});
    } else {
      this.username = value['username'];
      const password = value['password'];
      this.authService.login(this.username, password).subscribe( (data: any) => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', this.username);
        this.toasterService.success('Succesfully loged in');
        this.authService.loginSuccess();
        this.router.navigate(['/']);
      },
    (err: HttpErrorResponse) => {
      if ( err.status !== 400 ) {
        this.toasterService.error(err.message, 'error');
      } else {
        this.toasterService.error('inalid credentials');
      }
    });

    }


  }

}

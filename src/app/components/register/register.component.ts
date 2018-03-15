import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { DataService } from '../../services/data.service';
import { ToastrService } from 'ngx-toastr';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  private isPasswordConfirmed: boolean;
  private user: User = {
    firstname: '',
    lastname: '',
    email: '',
    username: '',
    phone: '',
    password: ''
  };
  constructor(
    private router: Router,
    private dataService: DataService,
    private toastrService: ToastrService
  ) { }

  ngOnInit() {
  }

  onSubmit({value, valid}: {value: User, valid: boolean}) {
    if (!valid) {
      this.toastrService.error('Inavalid form data');
    } else {
      this.dataService.register(value).subscribe( res => {
        this.toastrService.success('Registration success');
        this.router.navigate(['login']);
      },
      (err: HttpErrorResponse) => {
        console.log(err.message);
        this.toastrService.error(err.statusText);
      }
    );
    }

  }

}

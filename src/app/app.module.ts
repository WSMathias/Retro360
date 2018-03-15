import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
// Toastr imports
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

// component imports
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { BoardComponent } from './components/board/board.component';
import { BoardsComponent } from './components/boards/boards.component';
import { FeedbacksComponent } from './components/feedbacks/feedbacks.component';

// service imports
import { AuthService } from './services/auth.service';
import { DataService } from './services/data.service';
import { ProfileComponent } from './components/profile/profile.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { AddMembersComponent } from './components/add-members/add-members.component';
import { WriteFeedbackComponent } from './components/write-feedback/write-feedback.component';
import { FooterComponent } from './components/footer/footer.component';
import { CreateBoardComponent } from './components/create-board/create-board.component';
import { UsersComponent } from './components/users/users.component';

const appRoutes = [
  {path: '', component: DashboardComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'board/:id', component: BoardComponent},
  {path: 'profile/:username', component: ProfileComponent},
  {path: 'boards', component: BoardsComponent},
  {path: 'members/:id', component: AddMembersComponent},
  {path: 'board/:id/feedbacks/:receiver', component: FeedbacksComponent}
];
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    NavbarComponent,
    BoardComponent,
    BoardsComponent,
    FeedbacksComponent,
    ProfileComponent,
    WelcomeComponent,
    AddMembersComponent,
    WriteFeedbackComponent,
    FooterComponent,
    CreateBoardComponent,
    UsersComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    })

  ],
  providers: [
    AuthService,
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { FlashMessagesModule } from 'ngx-flash-messages';

import { AppComponent } from './app.component';
import { DataService } from './data.service';
import { UserService } from './user.service'
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { HomeComponent } from './home/home.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { AppRoutingModule, onlySignedInUsersGuard, NotSignedInUsersGuard } from './app-routing.module';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    SignUpComponent,
    HomeComponent,
    ForgetPasswordComponent,
	ProfileComponent,
  ],
  imports: [
	BrowserModule,
	HttpModule,
	AppRoutingModule,
	ReactiveFormsModule,
	FormsModule,
	FlashMessagesModule,
  ],
  providers: [
	  DataService, 
	  UserService, 
	  onlySignedInUsersGuard, 
	  NotSignedInUsersGuard
	],
  bootstrap: [AppComponent]
})
export class AppModule { }

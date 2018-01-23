import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SignInComponent } from 'app/sign-in/sign-in.component';
import { SignUpComponent } from 'app/sign-up/sign-up.component';
import { HomeComponent } from 'app/home/home.component';
import { ForgetPasswordComponent } from 'app/forget-password/forget-password.component';
import { ProfileComponent } from 'app/profile/profile.component';

const routes: Routes = [
	{ path: '', component: HomeComponent },
	{ path: 'signIn', component: SignInComponent },
	{ path: 'signUp', component: SignUpComponent },
	{ path: 'forgetPassword', component: ForgetPasswordComponent },
	{ path: 'profile', component: ProfileComponent },
];

@NgModule({
	exports: [RouterModule],
	
  imports: [
	RouterModule.forRoot(routes)
  ],
  declarations: []
})
export class AppRoutingModule { }

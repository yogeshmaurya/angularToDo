import { NgModule, Injectable } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';

import { SignInComponent } from 'app/sign-in/sign-in.component';
import { SignUpComponent } from 'app/sign-up/sign-up.component';
import { HomeComponent } from 'app/home/home.component';
import { ForgetPasswordComponent } from 'app/forget-password/forget-password.component';
import { ProfileComponent } from 'app/profile/profile.component';
import { CanActivate } from '@angular/router/src/interfaces';
import { UserService } from 'app/user.service';

@Injectable()
export class onlySignedInUsersGuard implements CanActivate {
	canActivate() {
		if(this.userService.isUserAuthenticated()){
			return true;
		}
		else{
			this.router.navigate(['/signIn']);
			return false;
		}
	}
	constructor(private userService: UserService, private router: Router){ }
}

@Injectable()
export class NotSignedInUsersGuard implements CanActivate {
	canActivate() {
		if(!this.userService.isUserAuthenticated()){
			return true;
		}
		else{
			this.router.navigate(['/']);
			return false;
		}
	}
	constructor(private userService: UserService, private router: Router){ }
}

const routes: Routes = [
	{ path: '', component: HomeComponent },
	{ path: 'signIn', component: SignInComponent, canActivate: [NotSignedInUsersGuard] },
	{ path: 'signUp', component: SignUpComponent, canActivate: [NotSignedInUsersGuard] },
	{ path: 'forgetPassword', component: ForgetPasswordComponent, canActivate: [NotSignedInUsersGuard] },
	{ path: 'profile', component: ProfileComponent, canActivate: [onlySignedInUsersGuard] },
];

@NgModule({
	exports: [RouterModule],
	
  imports: [
	RouterModule.forRoot(routes)
  ],
  declarations: []
})
export class AppRoutingModule { }



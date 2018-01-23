import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'ngx-flash-messages';

import { UserService } from 'app/user.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

	public isUser: boolean;

	goToSignIn() {
		this.router.navigate(['/signIn'])
	}

	signOut() {
		this.isUser = false;
		this.userService.signOut()
		this.router.navigate(['/signIn']);
		this.flashMessagesService.show('Successfully logged out!', {timeout:5000, classes: ['message']});

	}
	
	constructor(private userService: UserService, private router: Router, private flashMessagesService: FlashMessagesService) { 
		this.isUser = this.userService.isUserAuthenticated();
		userService.getLoggedInEvent().subscribe(loginStatus => {
			this.isUser = loginStatus;
		})
	}
	
 }
 


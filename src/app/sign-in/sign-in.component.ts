import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'ngx-flash-messages'; 

import { UserService } from 'app/user.service'

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

	signInForm: FormGroup;
	emailAlert = 'Enter an valid e-mail ID.';
	passwordAlert = 'Password must be between 8-20 characters.';

	signIn(signInForm){
		let userData = signInForm.value;
		this.userService.signInUser(userData)
			.subscribe( response => {
				if(response.success){
					this.userService.storeUserData(response.token, response.user);
					this.router.navigate(['/']);
					this.flashMessagesService.show(response.msg, {timeout:3500, classes: ['message']});
				}
				else{
					this.router.navigate(['/signIn']);
					this.flashMessagesService.show(response.msg, {timeout:3500, classes: ['message']});
				}
			})
	}

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router,private flashMessagesService: FlashMessagesService) {
	  this.signInForm = fb.group({
		  'email': ['', Validators.compose([Validators.required, 
			Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		)])],
		'password': ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(20)])]
	  });
   }

  ngOnInit() {
  }

}

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FlashMessagesService } from 'ngx-flash-messages';

import { UserService } from 'app/user.service'
import { User } from 'app/user'
import { PasswordValidation } from 'app/password-validation';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import { Routes } from '@angular/router/src/config';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
	
	signUpForm: FormGroup;
	requiredAlert = 'This field is required!'
	emailAlert = 'Enter an valid e-mail ID.';
	passwordAlert = 'Password must be between 8-20 characters.';
	confirmPasswordAlert = 'Password does not match!';
	
	register(signUpform){
		let userdata = signUpform.value
		this.userService.registerUser(userdata)
			.subscribe((response) => {
				if(response.success){
					this.router.navigate(['/']);
					this.flashMessagesService.show(response.msg, {timeout:4000, classes: ['message']});
				}
				else{
					this.router.navigate(['/signUp']);
					this.flashMessagesService.show(response.msg,{timeout:4000, classes: ['message']});
				}
			});
	};

	constructor(fb: FormBuilder, private userService: UserService, private router: Router,private flashMessagesService: FlashMessagesService) {
		this.signUpForm = fb.group({
			"name": ["", Validators.required],
			"email": ["", Validators.compose([Validators.required, 
				Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			)])],
			"password": ["", Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(20)])],
			"confirmPassword": ["", Validators.required],
		},{
			validator: PasswordValidation.MatchPassword
		});
	}
	
  ngOnInit(){ }

}

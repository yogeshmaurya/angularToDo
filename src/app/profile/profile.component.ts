import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

import { UserService } from 'app/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

	user: Object;
	editingName: boolean = false;
	editingEmail: boolean = false;
	updateNameForm: FormGroup;
	updateEmailForm: FormGroup;

	changeName() {
		this.editingName = true;
	}

	changeEmail() {
		this.editingEmail = true;
	}

	updateName(e) {
		console.log(e);
		this.editingName = false;
	}

	updateEmail(e) {
		console.log(e);
		this.editingEmail = false;
	}
 
  constructor(private userService: UserService, private router:Router, private fb: FormBuilder) {
		this.userService.getProfile()
		.subscribe( response => {
			if(response.success){
				return this.user = response.user;
			}
			this.router.navigate(['/signIn'])
		});

		this.updateNameForm = fb.group({
			'name': ['', Validators.required]
		})

		this.updateEmailForm = fb.group({
			'email': ['', Validators.compose([Validators.required,
				Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)])]
		})
   }

  ngOnInit() {
	
  }

}

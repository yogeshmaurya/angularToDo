import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FlashMessagesService } from 'ngx-flash-messages';

import { UserService } from 'app/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

	user: any = {id:'', name: '', email: ''};
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

	updateName(data) {
		this.userService.update(data)
			.subscribe((response) => {
				if(response.success){
					this.user.name = data.name;
					this.flashMessagesService.show(response.msg, {timeout:3000, classes: ['message']});
					this.editingName = false;
				}
			});
	}

	updateEmail(data) {
		this.userService.update(data)
			.subscribe((response) => {
				if(response.success){
					this.user.email = data.email;
					this.flashMessagesService.show(response.msg, {timeout:3500, classes: ['message']});
					this.userService.signOut()
					this.router.navigate(['/signIn']);
					this.editingEmail = false;
				}
			});
	}
 
  constructor(private userService: UserService, private router:Router, private fb: FormBuilder, private flashMessagesService: FlashMessagesService) {
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
			'email': ['', Validators.required]
		})
   }

  ngOnInit() {
	
  }

}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'ngx-flash-messages'

import { UserService } from 'app/user.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {

	forgetPasswordForm: FormGroup;
	emailAlert = 'Enter an valid e-mail ID.';
	
	submit(forgetPasswordForm){
		let userData = forgetPasswordForm.value;
		this.userService.forgetPassword(userData)
			.subscribe( response => {
				if(response.success){
					this.router.navigate(['/signIn']);
					this.flashMessagesService.show(response.msg, {timeout:5000, classes: ['message']});
				}
				else{
					this.router.navigate(['/forgetPassword']);
					this.flashMessagesService.show(response.msg, {timeout:5000, classes: ['message']});
				}
			})
	}

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router, private flashMessagesService: FlashMessagesService) {
	  this.forgetPasswordForm = fb.group({
		  'email': ['', Validators.compose([Validators.required, 
			Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		)])]		
	  });
   }


  ngOnInit() {
  }

}

import { Component, ViewEncapsulation, OnInit } from '@angular/core';

import { DataService } from 'app/data.service';
import { UserService } from 'app/user.service';
import { Task } from 'app/task'

@Component({
  selector: 'app-home',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

	title = 'Todo app';
	private tasks: Task[] = []; 
	private listItem: any;
	private today = new Date().toDateString();
	private update: boolean = false;
	private tempData: any = '';
	private status: string = '';
	public quote
	public isUser: boolean;
	public userInfo
	
	add (event) {
		event.preventDefault();
		let newTask = { 
			text: this.listItem, 
			creationTime: new Date(), 
			updateTime: new Date(),
			user: this.userInfo.id
		};
		this.dataService.addTask(newTask)
			.subscribe(task => {
				this.tasks.push(task);
				this.listItem = '';
			}) 
	}

	delete (id) {
		this.dataService.deleteTask(id)
			.subscribe( data => {
				if(data.n == 1) {
					this.tasks.forEach( (task, index) => { 
						if(id == task._id) {
							this.tasks.splice(index, 1);
						}
					})	 
				}
			})
	}

	changeStatus (task) {
		let updatedStatusObj = { 
			_id:task._id, 
			text: task.text, 
			completed: !task.completed, 
			creationTime: task.creationTime,
			updateTime: new Date(),
			user: task.user 
		}
		this.dataService.updateTask(updatedStatusObj)
			.subscribe( data => {
				if(data){
					this.tasks.forEach( (Item, index) => { 
						if(task.text === Item.text) {
							Item.completed = !Item.completed;
						}
					})
				}
			})
	}

	edit (task) {
		this.listItem = task.text;
		this.update = true;
		this.tempData = task;
	}
	
	updateTask (value: any) {
		let oldTask = this.tempData;
		let updatedTaskObj = { 
			_id:oldTask._id, 
			text: value, 
			completed:oldTask.completed, 
			creationTime: oldTask.creationTime,
			updateTime: new Date(),
			user: oldTask.user
		}
		
		this.dataService.updateTask(updatedTaskObj)
			.subscribe( data => {
				if(data){
					this.tasks.forEach( (Item, index) => { 
						if(this.tempData.text === Item.text) {
							Item.text = value;
						}
					});
					this.listItem = '';
					this.update = false;
					this.tempData = '';
				}
			})
	}
	
	constructor(private dataService: DataService, private userService: UserService) {
		
	}
	
  	ngOnInit(){
		this.isUser = this.userService.isUserAuthenticated();
		if(this.isUser){
			this.dataService.getTasks()
				.subscribe(response => { 
					response.forEach(element => {
						this.tasks.push(element)
					});
				})
		}
		this.userInfo = JSON.parse(this.userService.getUser());	
		this.userService.getLoggedInEvent().subscribe( loginStatus => {
			this.isUser = loginStatus;
		});
		this.dataService.getQuote()
			.subscribe(response => {
				if(response.success){
					this.quote = response.quote;
				}
			})
	}

}

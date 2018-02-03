import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

import { Task } from './task'
import { UserService } from 'app/user.service';

@Injectable()
export class DataService {

	private host: string = 'http://localhost:8080';

	 constructor(private http: Http, private userService: UserService) { }

	getTasks() {
		let headers = new Headers;
		headers.append('Authorization', this.userService.loadToken());
		return this.http.get(`${this.host}/api/tasks`, {headers: headers})
			.map( result => result.json() )
	};

	addTask(newTask) {
		let headers = new Headers;
		headers.append('Content-Type', 'application/json');
		return this.http.post(`${this.host}/api/tasks`, newTask, {headers: headers})
			.map(result => result.json())
	};

	deleteTask(id) {
		return this.http.delete(`${this.host}/api/tasks/${id}`)
			.map(result => result.json())
	};

	updateTask(obj) {
		let headers = new Headers;
		headers.append('Content-Type', 'application/json');
		return this.http.put(`${this.host}/api/tasks`, obj, {headers: headers})
			.map(result => result.json())
	};

	getQuote() {
		return this.http.get(`${this.host}/api/quote`)
			.map( result => result.json() )
	}

}

import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

import { Task } from './task'

@Injectable()
export class DataService {

	 constructor(private http: Http) { }

	getTasks() {
		return this.http.get('/api/tasks')
			.map( result => result.json() )
	};

	addTask(newTask) {
		let headers = new Headers;
		headers.append('Content-Type', 'application/json');
		return this.http.post('/api/tasks', newTask, {headers: headers})
			.map(result => result.json())
	};

	deleteTask(id) {
		return this.http.delete(`/api/tasks/${id}`)
			.map(result => result.json())
	};

	updateTask(obj) {
		let headers = new Headers;
		headers.append('Content-Type', 'application/json');
		return this.http.put('api/tasks', obj, {headers: headers})
			.map(result => result.json())
	};

}

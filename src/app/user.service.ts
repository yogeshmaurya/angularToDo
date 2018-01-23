import { Injectable, EventEmitter } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http'


@Injectable()
export class UserService {
	
	private authenticated : boolean = false;
	private authToken
	private userInfo : object = {};	
	private loggedIn: EventEmitter<boolean> = new EventEmitter();
	private host: string = 'http://localhost:8080';

  constructor(private http: Http) {
	  this.authToken = localStorage.getItem('id_token');
	  this.userInfo = JSON.parse(localStorage.getItem('user'));
	  if(this.authToken !== null && this.userInfo !== null) {
		  this.authenticated = true;
	  }
   }

  registerUser(userData) {
	let headers = new Headers;
	headers.append('Content-Type', 'application/json');  
	return this.http.post(`${this.host}/api/user/register`, userData, {headers: headers})
		.map( result => result.json() )
  }

  signInUser(userData) {
	let headers = new Headers;
	headers.append('Content-Type', 'application/json');  
	return this.http.post(`${this.host}/api/user/signIn`, userData, {headers: headers})
		.map( result => result.json() )
  }

  storeUserData(token, user) {
	localStorage.setItem('id_token', token);
	localStorage.setItem('user', JSON.stringify(user));
	this.userInfo = user;
	this.authenticated = true;
	this.loggedIn.emit(true);
  }

  getProfile(){
	  let headers = new Headers;
	  headers.append('Authorization', this.loadToken());
	  headers.append('Content-Type', 'application/json');  		
	  return this.http.get(`${this.host}/api/user/profile`,{headers: headers})
	  	.map(res => res.json());
  }	

  loadToken(){
	  return this.authToken = localStorage.getItem('id_token');
  }

  isUserAuthenticated() {
	  return this.authenticated;
  }

  signOut() {
	  localStorage.clear();
	  this.authToken = '';
	  this.userInfo = {};
	  this.authenticated = false;
	  this.loggedIn.emit(false);
  }

  getLoggedInEvent() {
	  return this.loggedIn;
  }

  forgetPassword(userData){
	let headers = new Headers;
	headers.append('Content-Type', 'application/json');  
	return this.http.put(`${this.host}/api/user/forgetPassword`, userData, {headers: headers})
		.map( result => result.json() )
  }

  changePassword(passwordData){
	let headers = new Headers;
	headers.append('Content-Type', 'application/json');  
	return this.http.put(`${this.host}/api/user/resetPassword`, passwordData, {headers: headers})
		.map( result => result.json() )
  }

}

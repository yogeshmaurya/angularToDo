export class User {
	constructor(
		 public name: string, 
		 public email: string,
		 public password: string,
		 public confirmed: boolean,
		 public creationTime: Date,
		 public roll: string,
		 public token: string,
		) { }
}

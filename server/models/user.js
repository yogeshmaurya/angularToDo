const mongoose	= require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = Schema({
	name: String, 
	email: {type:String, unique:true},
	password: String,
	emailVerified: {type: Boolean, default: false},
	creationTime: Date,
	roll: {type:String, default: 'user'},
	confirmEmailtoken: String,
	confirmEmailExpires: Date,
	resetPasswordToken: {type:String, default:null},
	resetPasswordExpires: {type:Date, default:null}
});

const User = module.exports = mongoose.model('User', UserSchema);


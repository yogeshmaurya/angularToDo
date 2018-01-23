const mongoose	= require('mongoose');

const Schema = mongoose.Schema

const UserSchema = Schema({
	name: String, 
	email: String,
	password: String,
	emailVerified: {type: Boolean, default: false},
	creationTime: Date,
	roll: String,
	confirmEmailtoken: String,
	confirmEmailExpires: Date,
	resetPasswordToken: String,
	resetPasswordExpires: Date
});

const User = module.exports = mongoose.model('User', UserSchema);
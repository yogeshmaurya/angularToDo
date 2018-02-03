const express	= require('express');
const bcrypt	= require('bcrypt');
const mongoose	= require('mongoose');
const passport  = require('passport');
const jwt		= require('jsonwebtoken');
const ejs		= require('ejs');
const path 		= require('path');

const User		= require('../models/user');
const config	= require('../config/config');
const readFile	= require('../config/mail').readFile;
const sendEMail	= require('../config/mail').sendEMail;

const router 	= express.Router();

//Register new User
router.post('/register', (request, response, next) => {
	let data = request.body;
	if(data.name !== undefined || data.email !== undefined || data.password !== undefined){
		User.findOne({email: data.email.toLowerCase()}, (err, res) => {
			if(err) response.json({success: false, msg: err});
			if(res) response.json({success: false ,msg: 'User already exists!!!!' });
			if(!res){
				bcrypt.hash(data.password, 10, (error, hash) => {
					bcrypt.hash(data.email, 10, (er, token) => {
						newUser = new User({ name: data.name, 
							email: data.email.toLowerCase(),
							password: hash,
							creationTime: new Date(),
							confirmEmailtoken: encodeURIComponent(token),
							confirmEmailExpires: Date.now() + 1000 * 86400,
						})
						
						newUser.save(newUser, (e, r) => {
							if(e) throw e;
							if(r){ 
								const subject =  'Verify your email address',
									  textMailContent = readFile('./server/mailTemplates/confirmEmail.txt'),
									  link = 'http://localhost:8080/api/user/confirmEmail?token=' + r.confirmEmailtoken;
								ejs.renderFile('./server/mailTemplates/confirmEmail.ejs',{Link: link}, (err, htmlMailContent)=>{
									sendEMail(r.email, subject, textMailContent, htmlMailContent);
								});
								const message = `${r.email} suceessfully registered, Please verify your email address to activate account.`
								response.json({success: true, msg: message});
							}
						})
					});
				})
			}
		})
	}
	else{
		response.status(400).send('Incomplete user data received');
	}
});

//SignIn user
router.post('/signIn', (request, response, next) => {
	const info = request.body;
	if(info.email !== undefined || info.password !== undefined) {
		User.findOne({email: info.email.toLowerCase()}, (error, result ) => {
			if(error) response.json({success: false, msg: error});
			if(!result){
				response.json({success: false, msg: 'Incorrect email or password!!'});
			};
			if(result) {
				bcrypt.compare(info.password, result.password, (err, res) => {
					if(err) throw err;
					if(!res) response.json({success: false, msg: 'Incorrect email or password!!'});
					if(res){
						if(result.emailVerified){
							const jsToken = jwt.sign({ _id: result._id }, config.secret,{ expiresIn: 3600 });
							response.json({success: true, msg: 'Successfully signed In.', token: 'JWT ' +jsToken, user: {
								id: result._id,
								name:result.name,
								email: result.email,
								emailVerified: result.emailVerified,
								roll: result.roll 
							}});
						}
						else if(result.confirmEmailExpires > Date.now()){
							response.json({success: false, msg: 'Please confirm your email address to activate account.'});
						}
						else{
							bcrypt.hash(result.email, 10, (err, hash) => {
								if(err) throw err;
								updateUser = {confirmEmailtoken: encodeURIComponent(hash), confirmEmailExpires: Date.now() + 1000*86400 }
								User.findOneAndUpdate({email: result.email}, updateUser, (e, r) => {
									if(e) throw e;
									if(!r) { response.json({success: false, msg: 'Something went wrong!!'}) }
									if(r) {
										const subject =  'Verify your email address'
										const textMailContent = readFile('./server/mailTemplates/confirmEmail.txt');
										const link = 'http://localhost:8080/api/user/confirmEmail?token=' + encodeURIComponent(hash);
										ejs.renderFile('./server/mailTemplates/confirmEmail.ejs',{Link: link}, (err, htmlMailContent)=>{
											sendEMail(result.email, subject, textMailContent, htmlMailContent);
										});
										const message = `A email has been sent to ${result.email}, Please verify your email address to activate account.`
										response.json({success: false, msg: message});
									}
								});
							});
						}
					}
				})
			};
		});
	}
	else{
		response.json({success: false, msg: 'Bad data received!!'})
	}
});

//Confirm E-mail address of user
router.get('/confirmEmail', (request,response,next) => {
	token = encodeURIComponent(request.query.token);
	User.findOne({confirmEmailtoken: token, confirmEmailExpires: {$gt: Date.now()}}, (error, result) => {
		if(error) response.json({success: false, msg: error});
		if(!result) response.sendFile(path.resolve('./server/Templates/linkInvalid.html'));
		if(result){
			User.update({_id: result._id},{confirmEmailtoken: null, confirmEmailExpires: null, emailVerified: true}, (err, res) => {
				if(err) throw err;
				if(res.nModified !== 0){
					let link = 'http://localhost:4200';
					ejs.renderFile('./server/Templates/emailVerified.ejs',{Link: link}, (e, renderedContent)=>{
						response.send(renderedContent);
					}); 
				};
			})
		}
	});
});

//Forget Password request from user
router.put('/forgetPassword', (request, response, next) => {
	let email = request.body.email
	if(email !== undefined){
		User.findOne({email: email}, (error, result) => {
			if(error) response.json({success: false, msg: error});
			if(!result){
				response.json({success: false, msg: 'User does not exist!!'});
			}
			if(result) {
				bcrypt.hash(result.email, 10, (err, hash) => {
					if(err) throw err;
					updateUser = {resetPasswordToken: encodeURIComponent(hash), resetPasswordExpires: Date.now() + 1000*3600 }
					User.update({email: result.email}, updateUser, (e, r) => {
						if(e) throw e;
						if(r.nModified === 0) { response.json({success: false, msg: 'Something went wrong!!'}) }
						if(r.nModified !== 0) {
							const subject =  'Reset password.';
							const textMailContent = readFile('./server/mailTemplates/resetPassword.txt');
							const link = 'http://localhost:8080/api/user/resetPassword/' + encodeURIComponent(hash);
							ejs.renderFile('./server/mailTemplates/resetPassword.ejs',{Link: link}, function(err, htmlMailContent){
								sendEMail(result.email, subject, textMailContent, htmlMailContent);
							});
							response.json({success: true, msg: 'A mail has been sent to ' + result.email + ' with further instructions.'});
						}
					});
				});
			}
		});
	}
	else{
		response.json({success: false, msg: 'Please provide your email address.'});
	}
});

//Send reset password page
router.get('/resetPassword/:token', (request, response, next) => {
	let token = encodeURIComponent(request.params.token);	
	User.findOne({resetPasswordToken: token, resetPasswordExpires:{$gt:Date.now()}}, (error,result)=>{
		if(error) throw error;
		if(!result){
			response.sendFile(path.resolve('./server/Templates/linkInvalid.html'));
		}
		if(result){
			let link = 'http://localhost:8080'+ request.originalUrl;
			ejs.renderFile('./server/Templates/resetPassword.ejs',{Link: link}, (err, renderedContent)=>{
				response.send(renderedContent);
			});
		}
	});
});

//Reset user password
router.post('/resetPassword/:token', (request, response, next) => {
	const newInfo = {password: request.body.password, token: encodeURIComponent(request.params.token)}
	
	if(newInfo.password !== undefined){
		User.findOne({resetPasswordToken: newInfo.token, resetPasswordExpires:{$gt:Date.now()}}, (error,result)=>{
			if(error) response.json({success: false, msg: error});
			if(!result) response.sendFile(path.resolve('./server/Templates/linkInvalid.html'));
			if(result){
				bcrypt.hash(newInfo.password, 10, (err, hash) =>{
					if(err) throw err;
					if(hash){
						const updateData = {password:hash, resetPasswordToken: null,resetPasswordExpires: null};
						User.findOneAndUpdate({email: result.email}, updateData, (e,r) => {
							if(e) throw e;
							if(r){
								const subject =  'Password successfully changed.'
								const textMailContent = readFile('./server/mailTemplates/passwordChanged.txt');
								const email = result.email
								ejs.renderFile('./server/mailTemplates/passwordChanged.ejs',{email: email}, function(err, htmlMailContent){
									sendEMail(email, subject, textMailContent, htmlMailContent);
								});
								ejs.renderFile('./server/Templates/passwordChanged.ejs',{email: email, link: 'http://localhost:4200'}, function(err, renderedContent){
									response.send(renderedContent);
								});
							}
						});
					}
				});
			}
		});
	}
	else{
		response.json({success: false, msg: 'Empty field can not be set to a password.'});
	}
});


//User Profile 
router.get('/profile', passport.authenticate('jwt', { session: false }), (request, response, next)=>{
	let user = {
		id: request.user._id,
		name:request.user.name,
		email: request.user.email,
	}
	if(user){
		response.json({success: true, user: user});
	}
	if(!user){
		response.json({success: false});
	}
});

//Update profile
router.post('/update/:fieldName', passport.authenticate('jwt', { session: false }), (request,response,next) => {
	fieldName = request.params.fieldName;
	if(request.user != undefined){
		if(fieldName === 'email'){
			bcrypt.hash(request.body.email, 10, (error, hash)=>{
				let updateData = {emailVerified:false, confirmEmailtoken: encodeURIComponent(hash), confirmEmailExpires: Date.now() +1000*86400}; 
				updateData[fieldName] = request.body.email;
				User.findOneAndUpdate({_id: request.user._id}, updateData, (err ,res) =>{
					if(err) throw err;
					if(res){
						const subject =  'Verify your email address';
						const textMailContent = readFile('./server/mailTemplates/confirmEmail.txt');
						const link = 'http://localhost:8080/api/user/confirmEmail?token=' + encodeURIComponent(hash);
						ejs.renderFile('./server/mailTemplates/confirmEmail.ejs',{Link: link}, (err, htmlMailContent)=>{
							sendEMail(request.body.email, subject, textMailContent, htmlMailContent);
						});
						response.json({success: true, msg:`${fieldName} successfully updated. Confirm email address to activate account .`});
					}
					if(!res){
						response.json({success: false, msg: `Something went wrong.`});
					}
				});		
			})	
		}
		else{
			let updateData = {}; 
			updateData[fieldName] = request.body[fieldName];
			User.findOneAndUpdate({_id: request.user._id}, updateData, (err ,res) =>{
				if(err) throw err;
				if(res){
					response.json({success: true, msg: `${fieldName} successfully updated.`});
				}
				if(!res){
					response.json({success: false, msg: `Something went wrong.`});
				}
			});
		}
	}
	else{
		response.json({success: false, msg: `Something went wrong.`});
	}
});

module.exports = router;
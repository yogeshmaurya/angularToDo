const express 	= require('express');
const Task 		= require('../models/task');
const passport  = require('passport');
const jwt		= require('jsonwebtoken');

const router 	= express.Router();

//Get all tasks
router.get('/', passport.authenticate('jwt', { session: false }), (request, response, next) => {
	Task.find({user: request.user._id},(err, res)=>{
		if(err) throw err;
		response.status(200).json(res);
	});
});

//Add new task
router.post('/', (request, response, next)=>{
	let newTask = request.body;
	if(newTask.text === '' || newTask.creationTime === undefined) {
		response.status(400).send("Ohh!!! Bad data received!!")
	}
	else{
		newTask = new Task(newTask);
		newTask.save(newTask,(error, result)=>{
			if(error) throw error;
			response.json(result);
		})
	}
});

//Delete task
router.delete('/:id', (request, response, next)=>{
	Task.remove({_id: request.params.id}, (err, res)=>{
		if(err) throw err;
		response.status(200).json(res);
	});
});

//Update task
router.put('/', (request, response, next)=>{
	let updatedTask = {
		_id: request.body._id,
		text: request.body.text,
		completed: request.body.completed,
		creationTime: request.body.creationTime,
		updateTime: request.body.updateTime
	}

	Task.update({_id: request.body._id},updatedTask,{}, (error, result)=>{
			if(error) throw error;
			response.json(result);
		})
});

module.exports = router;

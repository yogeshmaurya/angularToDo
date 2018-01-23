const express 	= require('express');
const mongoose 	= require('mongoose');

const router 	= express.Router();

//Get all tasks
router.get('/tasks', function(request, response, next) {
	db.tasks.find(function(err, res){
		if(err) throw err;
		response.status(200).json(res);
	});
});

//Add new task
router.post('/tasks', function(request, response, next){
	let newTask = request.body;
	if(newTask.text === '' || newTask.completed === undefined) {
		response.status(400).send("Ohh!!! Bad data received!!")
	}
	else{
		db.tasks.save(newTask, function(error, result){
			if(error) throw error;
			response.json(result);
		})
	}
});

//Delete task
router.delete('/tasks/:id', function(request, response, next){
	let id = request.params.id;
	db.tasks.remove({_id: mongojs.ObjectId(id)}, function(err, res){
		if(err) throw err;
		response.status(200).json(res);
	});
});

//Update task
router.put('/tasks', function(request, response, next){
	let id = request.body._id;
	let updatedTask = {
		_id: mongojs.ObjectId(id),
		text: request.body.text,
		completed: request.body.completed,
		createTime: request.body.createTime,
		updateTime: request.body.updateTime
	}

	db.tasks.update({_id: mongojs.ObjectId(id)},updatedTask,{}, function(error, result){
			if(error) throw error;
			response.json(result);
		})
});

module.exports = router;

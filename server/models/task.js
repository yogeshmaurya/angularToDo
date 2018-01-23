const mongoose	= require('mongoose');

const TaskSchema = mongoose.Schema({
	text: String,
	completed: Boolean,
	time: Date
});

const Task = module.exports = mongoose.model('User', TaskSchema);

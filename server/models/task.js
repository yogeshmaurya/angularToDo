const mongoose	= require('mongoose');

const Schema 	= mongoose.Schema;

const TaskSchema = Schema({
	text: String,
	completed: {type: Boolean, default: false},
	creationTime: Date,
	updateTime: Date,
	user: {type: Schema.Types.ObjectId, ref: 'User', required: true}
});

const Task = module.exports = mongoose.model('Task', TaskSchema);

const mongoose 	= require('mongoose'),

	  Schema 	= mongoose.Schema;

const quoteSchema = Schema({
	quote	: String,
	writer	: String
}),

	Quote = module.exports = mongoose.model('Quote', quoteSchema);
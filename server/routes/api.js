const express 	= require('express');
const Quote		= require('../models/quote');
const router 	= express.Router();

router.get('/', (request, response, next)=>{
	Quote.find((error, result)=>{
		let errorMsg = 'Something went wrong while fetching quote!!';
		if(error) response.json({success:false, msg: errorMsg});
		if(result.length === 0) response.json({success:false, msg: 'No quote found!!'});	
		if(result.length !== 0) {
			const randomQuote = result[Math.floor( Math.random() * result.length )];
			response.json({success:true, quote: randomQuote});
		}	
	});
});

module.exports = router;

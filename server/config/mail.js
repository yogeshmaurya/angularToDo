const nodemailer = require('nodemailer');
const fs = require('fs');

exports.readFile = function(path) {
	const content = fs.readFileSync(path, 'utf8');
	return content;
}

exports.sendEMail = function(emailID, subject, text, html ) {
	
	const transport = nodemailer.createTransport({
		host: "smtp.mailtrap.io",
 		port: 2525,
 		auth: {
    	user: "150e3002211631",
		pass: "feb3c70070c7d5"
		}
	});

	const mailOptions = {
		from: 'yogeshmaurya10@gmail.com',
		to: emailID,
		subject: subject,
		text: text,
		html: html
		};
							
	transport.sendMail(mailOptions, function(error, info){
		if(error) throw error;
		if(info){
		console.log('E-mail Sent:'+ info.response);
		}
	})
}

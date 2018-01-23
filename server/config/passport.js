const passport 		= require('passport');
const JwtStrategy 	= require('passport-jwt').Strategy,
	  ExtractJwt 	= require('passport-jwt').ExtractJwt;

const User			= require('../models/user');
const config 		= require('./config');	

module.exports = function(){
	let opts = {}
	opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt')
	opts.secretOrKey = config.secret;
	passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
		User.findOne({_id: jwt_payload._id}, (err, user) => {
			if (err) {
				return done(err, false);
			}
			if (user) {
				return done(null, user);
			} else {
				return done(null, false);
			}
		});
	}));
}

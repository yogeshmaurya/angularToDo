const express 	 = require('express');
const bodyParser = require('body-parser');
const mongoose 	 = require('mongoose');
const path 		 = require('path');
const passport	 = require('passport');
const cors		 = require('cors');	

const api 		 = require('./server/routes/api');
const user 		 = require('./server/routes/user');
const task		 = require('./server/routes/task');
const config	 = require('./server/config/config');

const app = express();
let port = 8080;

//Database connection
mongoose.connect(config.database, { useMongoClient: true });
mongoose.Promise = global.Promise; 
mongoose.connection.on('error', function (err) {
    console.log('database error', err)
});
mongoose.connection.on('connect', function () {
    console.log('Connected to database...')
});

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//Passport initalization
app.use(passport.initialize());
app.use(passport.session());

require('./server/config/passport')(passport);

app.use('/api/quote', api);
app.use('/api/tasks', task);
app.use('/api/user', user);

app.get('/', (req, res) => {
    res.send('send');
});

//Starting server
app.listen(port, function(){
	console.log(`Listening to port ${port}...`)
});


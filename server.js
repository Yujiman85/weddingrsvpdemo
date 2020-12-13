//Module imports
const knex = require('knex');
const express = require('express');
const session = require('express-session');
const redis = require('redis');
const url = require('url');
const RedisStore = require('connect-redis')(session);
const bodyParser = require('body-parser');
const ejs = require('ejs');
const dotenv = require('dotenv').config();
const nodemailer = require('nodemailer');
const { check, validationResult } = require('express-validator');
const fs = require('fs');
const sgTransport = require('nodemailer-sendgrid-transport');
const sgMail = require('@sendgrid/mail')

//Importing external functions
const functions = require('./functions.js');

//bodyParser
const urlencodedParser = bodyParser.urlencoded({extended: false});

//Call Express, store it in app and set port number
const app = express();
const port = 3306; 

//Set view engine
app.set('view engine', 'html');
app.set('views', __dirname + '/public');
app.engine('html', ejs.renderFile);

//Open port
app.listen(process.env.PORT || port, () => {
	console.log("app is working on port " + port);
});

//Set session
const redisURL = url.parse(process.env.REDISTOGO_URL);
const client = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});
client.auth(redisURL.auth.split(":")[1]);
app.use(session({
  	resave: false,
  	saveUninitialized: true,
  	secret: 'asl84CxXZoIL93ame391',
  	store: new RedisStore({client: client})
}));

//MySql database connection
const db = knex({
  client: 'mysql',
  connection: {
 	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_DB
  }
 });

//Root route
app.get('/', function (req, res) {
	const date = functions.checkDate();
	if (date === 'Date is in the past.') {
		res.render('formclosed.html');
	} else {
		res.render('index', { session });
	}
});

//Route to confirm information before being submitted
app.post('/confirm', urlencodedParser, function (req, res) {
	let session = req.session;
	session.firstName = req.body.firstName;
	session.lastName = req.body.lastName;
	session.email = req.body.email;

	const fieldArray = [session.firstName, session.lastName, session.email]

	//Checking to see if any of the fields are empty (spaces don't count)
	const inputCheck = functions.inputCheck(fieldArray);
	if (inputCheck === 'Something is empty!') {
		const message = "Hey, something isn't filled in! Please go back and fill in all the appropriate information. Thanks!";
		res.render('oops', { message: message });
		return;
	}

	//Checks to see if email is formatted properly
	const validEmail = functions.validEmail(session.email);
	if (validEmail === false) {
		const message = "Your email address was not formatted properly! Please go back and check it!";
		res.render('oops', { message: message });
		return;
	}

	res.render('confirm', { session });
})

//Sends info to database then displays thank you page
app.post('/rsvp', urlencodedParser, function(req, res) {
	let session = req.session;
	if (req.body.confirm === 'yes') {
		const fullName = session.firstName + " " + session.lastName;
		const email = session.email;

		db('rsvps').insert(
		{
			name: fullName, 
			email: email
		}).then(()=>{});

		functions.sendEmail(session.email, session);
		res.render('thankyou', { session });
		session = null;

	} else if (req.body.confirm === 'no') {
		res.render('index', { session });
	}
});

//Route for list of people who RSVP'd for the wedding
app.get('/list', function (req, res) {
	db.select('name').from('rsvps').then((people) => {
		res.render('attendees', { people })
	});
})

app.use(express.static(__dirname + '/public'));
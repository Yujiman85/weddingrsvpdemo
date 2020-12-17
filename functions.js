const express = require('express');
const nodemailer = require('nodemailer');
const fs = require('fs');
const ejs = require('ejs');
const sgMail = require('@sendgrid/mail');

//Checks to see if cut-off date has passed.
const checkDate = () => {
	var today = new Date();
	var idate = new Date('2022-01-01'); //Cutoff date
	idate.setHours(today.getHours());
	idate.setMinutes(today.getMinutes());
	idate.setSeconds(today.getSeconds());
	idate.setMilliseconds(today.getMilliseconds());

	// Parsing the date objects.
	today = Date.parse(today);
	idate = Date.parse(idate);

	// Comparisons.
	if (idate == today) {
		timeCheck = 'Date is today.';
		return timeCheck;
	}
	else if (idate < today) {
		const timeCheck =  'Date is in the past.';
		return timeCheck;
	}
	else if (idate > today) {
		const timeCheck =  'Date is in the future.';
		return timeCheck;
	}
};

//Checks to see if input field is empty and notifies user accordingly
const inputCheck = (field) => {
	for (let i = 0; i < field.length; i++) {
		field[i] = field[i].trim();
		if (!field[i].length) {
			const check = 'Something is empty!';
			return check;
		}
	}
}

//Checks to see if email is properly formatted
const validEmail = (email) => {
	const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	email = email.trim();
	return regex.test(email);
}

//Sends email to person who just RSVP'd
const sendEmail = (recipient, session) => {

	ejs.renderFile(__dirname + '/public/email.html', { session }, function (err, html) {
		if (err) {
			console.log(err);
		} else {
			sgMail.setApiKey(process.env.SENDGRID_API_KEY);
			const msg = {
				from: process.env.senderEmail, // sender address
				to: recipient, // list of receivers
				subject: "Jason and Margaret - 07.08.2020", // Subject line
				html: html, // The email that is sent
			};
			sgMail.send(msg);
		};
	});
};

//Functions exported for use
module.exports = {
	checkDate,
	inputCheck,
	validEmail,
	sendEmail
}
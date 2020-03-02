# Wedding RSVP Demo Site!
RSVP for a wedding!
This is the repository.
The site is hosted at https://weddingrsvpdemo.herokuapp.com/

Welcome to the RSVP site I've built on my own! I built it as a way to gauge myself in terms of my coding ability using Javascript.

1) Enter your first name, last name, and email address. (If any of the fields are empty it will return an error. Likewise, if your email is not formatted properly it will do the same.)
2) Then it will ask you to confirm your information, this is so you can double check it before submitting.
3) Once you've confirmed your info it will submit it to a database on the back-end and give you a congrats message.
4) You can then see a list of all the people that are registered for the wedding. This page can also be viewed at /list

The site itself is not very involved but I built it from the ground up and I am very proud of it! I was able to use Node, HTML, and CSS as well as Node dependencies for some of the functionailty. It's also responsive and can be viewed on a mobile device!

Dependencies:
1) Knex - Database connectivity
2) Express - Routing
3) EJS - Embedded Javascript for parsing in HTML
4) nodemailer - Sends an email through an API
5) Redis - Stores info for use across multiple routes

This app's Github is connected to Heroku. When I commit any changes to this repository it will automatically deploy any updates to Heroku. The only changes that need to be made on Heroku specifically are environmental variables.

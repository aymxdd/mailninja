const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer')
const config = require('./config.json')

function validateEmail(email) {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email)
}

function sendThatBitch(fromEmail, toEmail, subject, message) {
	return new Promise((resolve, reject) => {
		let transporter = nodemailer.createTransport({sendmail: true})
		transporter.sendMail({
			from: fromEmail,
			to: toEmail,
			subject: subject,
			text: message
		}, (err) => {
			if (err) {
				reject(err)
			} else {
				resolve("MESSAGE_SENT")
			}
		})
	})
}

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*")
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
	next()
})
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.post('/sendmail', function(req, res) {
	var fromEmail = req.body.fromEmail,
		toEmail = req.body.toEmail,
		subject = req.body.subject,
		message = req.body.message

	if (req.body.fromEmail !== '' && req.body.toEmail !== '' && req.body.subject !== '' && req.body.message !== '') {
		if (req.body.fromEmail.includes('@aymericm.fr') || req.body.toEmail.includes('@aymericm.fr')) {
			res.send({error: true, res: 'Haha nice try, but nope. :)'})
		} else {
			if (validateEmail(req.body.toEmail) && validateEmail(req.body.fromEmail)) {
				sendThatBitch(fromEmail, toEmail, subject, message).then((value) => {
					res.send({error: false, res: 'MSG_SENT'})
				}).catch((err) => {
					res.send({error: true, res: 'Unknown error.'})
				})
			} else {
				res.send({error: true, res: 'Invalid email address.'})
			}
		}
	} else {
		res.send({error: true, res: 'Empty request.'})
	}
})

app.listen(config.APP_PORT, () => {
	console.log(`Server listening on ${config.APP_PORT}`);
})

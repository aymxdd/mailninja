import React, {Component} from 'react'
import axios from 'axios'
import styles from '../sass/main.sass'
import config from '../config.json'

export default class Main extends Component {
	constructor(props) {
		super(props)
		this.state = config.startState

		this.handleChange = this.handleChange.bind(this)
		this.sendMail = this.sendMail.bind(this)
		this.resetState = this.resetState.bind(this)
	}

	resetState() {
		this.setState(config.startState)
	}

	sendMail = () => {
		if (this.state.toEmail !== "" && this.state.fromEmail !== "" && this.state.subject !== "" && this.state.message !== "") {
			this.setState(config.resetErrorState)
			axios.post(`${config.url}:${config.port}/sendmail`, {
				fromEmail: this.state.fromEmail,
				toEmail: this.state.toEmail,
				subject: this.state.subject,
				message: this.state.message
			}).then((response) => {
				console.log(response);
				if (response.data.error === true) {
					this.setState({
						'appState': {
							'error': true,
							'errorMsg': response.data.res,
							'busy': false
						}
					})
				} else if (response.data.error === false && response.data.res === "MSG_SENT") {
					this.resetState()
					alert('Message sent !')
				}
			}).catch((error) => {
				console.log(error)
				this.setState({
					'appState': {
						'error': true,
						'errorMsg': 'Networking error. Please check your connection or try again later.',
						'busy': false
					}
				})
			})
		}
	}

	handleChange(event) {
		if (event.target.name === 'fromEmail') {
			this.setState({fromEmail: event.target.value})
		} else if (event.target.name === 'toEmail') {
			this.setState({toEmail: event.target.value})
		} else if (event.target.name === 'subject') {
			this.setState({subject: event.target.value})
		} else {
			this.setState({message: event.target.value})
		}
	}

	render() {
		return (<div className={styles.container}>
			<h1 className={styles.title}>MAIL NINJA</h1>
			<div className={styles.error} disabled={this.state.appState.error}>Error: {this.state.appState.errorMsg}</div>
			<input type="email" name="fromEmail" placeholder="From (ex: sender@example.com)" value={this.state.fromEmail} onChange={this.handleChange} disabled={this.state.appState.busy}></input>
			<input type="email" name="toEmail" placeholder="To (ex: receiver@example.com)" value={this.state.toEmail} onChange={this.handleChange} disabled={this.state.appState.busy}></input>
			<input type="text" name="subject" placeholder="Subject" value={this.state.subject} onChange={this.handleChange} disabled={this.state.appState.busy}></input>
			<textarea type="text" placeholder="Your message" resizable="false" value={this.state.message} onChange={this.handleChange} disabled={this.state.appState.busy}/>
			<div className={styles.buttons}>
				<div className={styles.btnReset} onClick={this.resetState} disabled={this.state.appState.busy}>Reset</div>
				<div className={styles.btnSend} onClick={this.sendMail} disabled={this.state.appState.busy}>Send</div>
			</div>
		</div>)
	}
}

import React, { Component } from 'react'

export class App extends Component {
	constructor () {
		super()

		this.words = 'That is the standard against which the government has been testing cladding. A government spokesperson said "a test failure means that the cladding does not meet the requirements for limited combustibility in current Building Regulations". That is to say, a failure means a breach of the official rulebook.'.split(' ')
	}

	render () {

		let words = this.words.map(word => {
			return Object.assign({}, {word: word}, { speakerNo: Math.floor(Math.random()*3) })
		})

		return (
			<div style={styles.container}>
				{words.map((word, i) => {
					return (
						<div 
							key={i}
							style={Object.assign({}, { marginTop: `${word.speakerNo * 40}px`}, styles.one)}
							>{word.word} </div>
					)
				})}
			</div>
		)
	}
}

const styles = {
	container: {
		position: 'relative',
		width: '3000px',
		marginLeft: '20px',
		marginTop: '20px'
	},
	one: {
		float: 'left',
		marginLeft: '20px'
	}
}

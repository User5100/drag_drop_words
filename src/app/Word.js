import React, { Component } from 'react'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/fromEvent'
import 'rxjs/add/operator/switchMap'
import 'rxjs/add/operator/takeUntil'
import 'rxjs/add/operator/do'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/startWith'
import { Motion, spring } from 'react-motion'

export class Word extends Component {
  
  constructor () {
    super()

    this.state = {
      clientY: 0
    }
  }

  componentDidMount () {
    this.mouseMove$ = Observable.fromEvent(document, 'mousemove')
    
    this.mouseUp$ = Observable.fromEvent(document, 'mouseup')
              
    Observable.fromEvent(this.ball, 'mousedown')
              .switchMap(() => this.mouseMove$.takeUntil(this.mouseUp$))
              .do(debug => console.log(debug))
              .map(event => event.pageY)
              .startWith(0)
              .subscribe(clientY => {
                
                this.setState({ clientY: clientY })
                console.log(this.state.clientY, clientY)
              })
  }

  render () {

    let highlight
    
    if(this.props.props.word this.props.props.currentTime) {
      
    }

    return (
      <div
        style={Object.assign({}, styles.wordContainer)}>
       
        <Motion style={{ y: spring(this.state.clientY) }}>
          {
            ({y}) => {
              return (
                <div 
                  ref={(ball) => { this.ball = ball }}
                  style={{ marginTop: `${this.props.word.speakerNo * 50}px`}} 
                >
                  <div
                    className='word'
                    style={Object.assign({}, styles.word, { marginTop: `${y}px` })}>
                    {this.props.word.word}
                  </div>
                </div>
              )
            }
          }
        </Motion>
      </div>
    )
  }
}

const styles = {

  word: { 
		width: 'auto',
		height: '24px',
		borderRadius: '30%',
		backgroundColor: 'black',
    color: '#FFF',
    padding: '4px',
    display: 'block',
    float: 'left'
	},
  wordContainer: {
    width: '4000px',
    position: 'relative',
    display: 'block',
    marginTop: '10px'
  }
}
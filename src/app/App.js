import React, { Component } from 'react'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/of'
import 'rxjs/add/observable/fromEvent'
import 'rxjs/add/operator/combineLatest'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/distinctUntilChanged'
import { Motion, spring } from 'react-motion'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import * as faker from 'faker'
import { Element, animateScroll, Events, Link, scrollSpy } from 'react-scroll'

import { Word } from './Word'
import { Player } from './Player'

export class App extends Component {
	constructor () {
		super()

    this.state = {
      probability: 1,
      showPlayer: true,
      percentagePlayed: 0,
      percentageBuffered: 0,
      currentTime: 0,
      duration: 0,
      isPlaying: false
    }

		this.words = 'That is the standard against which the government has been testing cladding. A government spokesperson said "a test failure means that the cladding does not meet the requirements for limited combustibility in current Building Regulations". That is to say, a failure means a breach of the official rulebook.'.split(' ')
	
    this.handleIncreaseProbability = this.handleIncreaseProbability.bind(this)
    this.handleDecreaseProbability = this.handleDecreaseProbability.bind(this)
    this.handleClickFilteredWord = this.handleClickFilteredWord.bind(this)
    this.handlePlayClick = this.handlePlayClick.bind(this)
    this.handlePauseClick = this.handlePauseClick.bind(this)
    this.handleSeekHeadClick = this.handleSeekHeadClick.bind(this)
    this.getVisibleState = this.getVisibleState.bind(this)
    this.handlePlayBackRate = this.handlePlayBackRate.bind(this)
    this.handleAudioTimeUpdate = this.handleAudioTimeUpdate.bind(this)

  }

  handleIncreaseProbability () {
    if(this.state.probability < 1) {
      this.setState({ probability: this.state.probability + 0.25 })
    }
  }

  handleDecreaseProbability () {
    if(this.state.probability > 0) {
      this.setState({ probability: this.state.probability - 0.25 })
    }
  }

  handleClickFilteredWord (timestamp) {
    //console.log(this.transcriptContainer.scrollTo)
    //this.transcriptContainer.scrollLeft(timestamp * 10)

    animateScroll.scrollTo(100, 0)
  }

  handleAudioTimeUpdate () {
    this.setState({ percentagePlayed: (this.audio.currentTime / this.audio.duration * 100).toFixed(2) })
    if (this.audio.buffered.length) {
      this.setState({ duration: this.audio.duration.toFixed(2)})
      this.setState({ percentageBuffered: (this.audio.buffered.end(0) / this.audio.duration * 100).toFixed(0) })
    }

    this.setState({ currentTime: this.audio.currentTime.toFixed(2) })
  }

  handlePlayClick () {
    this.setState({ isPlaying: true })
    this.audio.play()
  }

  handlePauseClick () {
    this.setState({ isPlaying: false })
    this.audio.pause()
  }

  handleSeekHeadClick (event, seek) {
    let { left, right } = seek.getBoundingClientRect()
    let percentagePlayed = ((event.clientX - left) / (right - left) * 100).toFixed(2)
    this.setState({ percentagePlayed })
    this.audio.currentTime = this.audio.duration * (percentagePlayed / 100)
  }

  getVisibleState () {
    if(this.state.showPlayer) {
      return 0
    } else {
      return 100
    }
  }

  handlePlayBackRate (rate) {
    this.audio.playbackRate = rate
  }

  componentDidMount () {

    Events.scrollEvent.register('begin', function(to, element) {
      console.log("begin", arguments);
    });

    Events.scrollEvent.register('end', function(to, element) {
      console.log("end", arguments);
    });

    scrollSpy.update();

    //Implement trigger show/hide player
    Observable.fromEvent(document, 'mousemove')
              .map(mousemove => {
                let { clientY } = mousemove

                if (clientY > 600) {
                  return true
                } else {
                  return false
                }
              })
              .distinctUntilChanged()
              .subscribe(show => {
                //show is boolean
                this.setState({ showPlayer: show })
              })

    //Transform words to an array of objects          
    this.words = this.words.map(word => {

			return Object.assign(
        {}, 
        {word: word}, 
        { speakerNo: Math.floor(Math.random()*3), 
          score: Math.random(),
          timestamp: Math.random() * 120,
          alternativeWords: [faker.name.firstName(), faker.name.firstName(), faker.name.firstName()]
        })
		})
  }

	render () {

    let filteredWords = []

    let probability$ = Observable.of(this.state.probability)

    Observable.of(this.words)
              .combineLatest(probability$, (_words, _probability) => {
                return _words.filter(_word => _word.score <= _probability)
              })
              .subscribe(_filteredWords => filteredWords = _filteredWords)


		return (
      <MuiThemeProvider>
        <div 
          style={styles.container}>

          <div   
            style={styles.transcriptContainer}
            ref={transcriptContainer => this.transcriptContainer = transcriptContainer}>
            <div
              className='speakers'
              style={styles.speakers}>
              <div style={styles.speakerName}>Speaker 1</div>
              <div style={styles.speakerName}>Speaker 2</div>
              <div style={styles.speakerName}>Speaker 3</div>
            </div>
            
            <div style={{ marginLeft: '100px' }}>
            {this.words.map((word, i) => {
              return (
                <Element
                  key={i}
                  name={`${word.timestamp}`}>
                  <Word
                    props={Object.assign({}, { currentTime: this.state.currentTime })}
                    word={word}
                  />
                </Element>
              )
            })}
            </div>
          </div>

          <div style={styles.probabilityContainer}>
            <h3>Filter Probability</h3>
            <h4>Probability: {this.state.probability}</h4>
            <button onClick={this.handleIncreaseProbability}>Increase</button>
            <button onClick={this.handleDecreaseProbability}>Decrease</button>

              <div 
                style={styles.probabilityWordsContainer}>
                {filteredWords.map((filteredWord, i) => {
                  return (
                    <Link 
                      key={i}
                      to={`${filteredWord.timestamp}`}
                      spy={true} smooth={true} offset={50} duration={500} >
                      <span
                        className='filtered-word'
                        style={Object.assign({}, { fontSize: `${(1 - filteredWord.score) * 48}px` }, styles.filteredWord)}
                        >  
                        {filteredWord.word} {}
                      </span>
                    </Link>
                  )
                })}
              </div>

              <div
                style={styles.alternativeContainer}>
                <h3>Alternative words container</h3>
                <div style={styles.alternativeWordsContainer}>
                  {this.words.map(wordsObject => {

                    if(wordsObject.alternativeWords) {
                      return wordsObject.alternativeWords.map(alternativeWord => {
                        return <div>{alternativeWord}</div>
                      })
                    }
                  })}
                </div>
              </div>
          </div>

          <Player
            props={Object.assign({}, this.state, { handlePlayClick: this.handlePlayClick, handlePauseClick: this.handlePauseClick, handleSeekHeadClick: this.handleSeekHeadClick, getVisibleState: this.getVisibleState, handlePlayBackRate: this.handlePlayBackRate, audio: this.audio })} 
          />

          <audio
            ref={audio => this.audio = audio}
            onEnded={this.handleAudioEnded}
            onTimeUpdate={this.handleAudioTimeUpdate}
            src='http://k003.kiwi6.com/hotlink/5p87y9ftzg/LOCAL_FEED_JULY_8kHz.wav' />

        </div>
      </MuiThemeProvider>
		)
	}
}

const styles = {
	container: {
		display: 'block',
    position: 'relative'
	},
  speakers: {
    position: 'absolute',
    float: 'left',
    userSelect: 'none'
  },
  speakerName: {
    marginBottom: '40px'
  },
  transcriptContainer: {
    display: 'block',
    position: 'relative',
    left: 0,
    top: 0,
		width: '90%',
    height: '200px',
		marginLeft: '20px',
		marginTop: '20px',
    overflowX: 'scroll'
  },
  probabilityContainer: {
    position: 'absolute',
    top: '200px',
    width: '600px'
  },
  probabilityWordsContainer: { 
    marginLeft: '100px',
    minHeight: '140px',
    height: '250px',
    width: '100%',
    overflowY: 'scroll' 
  },
  filteredWord: {
	  float: 'right'
  },
  alternativeContainer: {
    position: 'absolute',
    left: '140%',
    top: 0,
    width: '500px',
    height: '350px',
    display: 'block',
    overflowY: 'scroll'
  },
  alternativeWordsContainer: {
    position: 'absolute',
    width: '300px',
    height: '100px',
    display: 'block'
  }
}

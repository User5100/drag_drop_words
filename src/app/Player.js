import React, { Component } from 'react'
import AvPlayCircleOutline from 'material-ui/svg-icons/av/play-circle-outline'
import AvPauseCircleOutline from 'material-ui/svg-icons/av/pause-circle-outline'
import {BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation'
import PropTypes from 'prop-types'
import { Motion, spring } from 'react-motion'

export class Player extends Component {
    constructor() {
      super()

      this.state = {
        rate: 1
      }

      this.handlePlayClick = this.handlePlayClick.bind(this)
      this.handlePauseClick = this.handlePauseClick.bind(this)
      this.handleSeekHeadClick = this.handleSeekHeadClick.bind(this)
      this.getVisibleState = this.getVisibleState.bind(this)
      this.handlePlayBackRate = this.handlePlayBackRate.bind(this)

    }

    handlePlayClick () {
    this.props.props.handlePlayClick()
  }

  handlePauseClick () {
    this.props.props.handlePauseClick()
  }

  handleSeekHeadClick (event) {
    this.props.props.handleSeekHeadClick(event, this.seek)
  }

  getVisibleState () {
    return this.props.props.getVisibleState()
  }

  handlePlayBackRate () {
    
    if(this.state.rate < 2) {
      this.setState({ rate: this.state.rate + 0.25 }, () => {
        this.props.props.handlePlayBackRate(this.state.rate) 
      })
    } else {
      this.setState({ rate: 0.50 }, () => {
        this.props.props.handlePlayBackRate(this.state.rate) 
      })
    }
  }

    render () {

      let button

      if (!this.props.props.isPlaying) {
        button = <AvPlayCircleOutline onClick={this.handlePlayClick} style={styles.iconStyles} />
      } else {
        button = <AvPauseCircleOutline onClick={this.handlePauseClick} style={styles.iconStyles} />
      }

      let playWidth = `${this.props.props.percentagePlayed}%`
      let bufferWidth = `${this.props.props.percentageBuffered}%`

      return (
        <Motion style={{ y: spring(this.getVisibleState()) }}>
          { ({y}) => {
              return (
                <div style={Object.assign( { transform: `translate3d(0, ${y}px, 0)` }, styles.container )} >
                  <BottomNavigation>
                    <div
                      className='play-head'
                      style={Object.assign({}, styles.playHead, { width: playWidth })} />

                    <div
                      className='buffer-head'
                      style={Object.assign({}, styles.bufferHead, { width: bufferWidth })} />

                    <div
                      className='seek-head'
                      ref={seek => this.seek = seek}
                      onClick={this.handleSeekHeadClick}
                      style={styles.seekHead} />

                    <div
                      className='controls'
                      style={styles.controls} >
                      {button}
                      <div
                        style={styles.speed}
                        onClick={this.handlePlayBackRate}>
                        {this.state.rate}x
                      </div>
                      <div style={styles.timer}> {this.props.props.currentTime} : {this.props.props.duration}</div>
                    </div>
                  </BottomNavigation>
                </div>
              )
            }
          }
        </Motion> 
      )
    }
}

const styles = {
  container: {
    height: '60px',
    position: 'fixed',
    bottom: 0
  },
  playHead: {
    height: '20px',
    width: '0%',
    transition: 'width 0.1s',
    background: '#8ED4E0',
    position: 'absolute',
    left: 0,
    top: 0
  },
  bufferHead: {
    height: '20px',
    width: '0%',
    transition: 'width 0.1s',
    background: '#8ED4E0',
    opacity: 0.4,
    position: 'absolute',
    left: 0,
    top: 0,
    display: 'block'
  },
  seekHead: {
    height: '20px',
    width: '100%',
    background: '#363940',
    opacity: 0.1,
    position: 'absolute',
    left: 0,
    top: 0,
    ':hover': {
      cursor: 'pointer',
      background: 'red'
    }
  },
  controls: {
    position: 'absolute',
    left: '20px'
  },
  timer: {
    position: 'absolute',
    display: 'inline',
    marginLeft: '28px',
    width: '200px',
    top: '30px',
    left: '80px'
  },
  'iconStyles': {
    cursor: 'pointer',
    marginTop: '26px'
  },
  speed: {
    position: 'absolute',
    top: '30px',
    display: 'inline',
    minWidth: '40px',
    width: '40px',
    left: '50px'
  }
}
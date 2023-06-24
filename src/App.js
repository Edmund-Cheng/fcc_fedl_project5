import React from 'react';
import './App.css';
import beep01a from './beep-01a.mp3';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breakLength: 5,
      sessionLength: 25,
      sessionMinutes: 25,
      sessionSeconds: "00",
      timerIsOn: false,
      timerInBreak: false,
      session: "Session",
      intervalId: null
    };
  }
  //Decrement Break Length
  decrementBreak() {
    if (this.state.breakLength > 1 && this.state.timerIsOn === false) {
      this.setState({
        breakLength: this.state.breakLength - 1,
      });
    }
  };
  //Increment Break Length
  incrementBreak() {
    if (this.state.breakLength < 60 && this.state.timerIsOn === false) {
      this.setState({
        breakLength: this.state.breakLength + 1,
      });
    }
  };
  
  //Decrement Session Length
  decrementSession() {
    if (
      this.state.sessionLength > 1 && this.state.timerIsOn === false
    ) {
      const newMinutes = this.state.sessionLength - 1 < 10 ? "0" + (this.state.sessionMinutes - 1): this.state.sessionMinutes - 1; 
      this.setState({
        sessionLength: this.state.sessionLength - 1,
        sessionMinutes: newMinutes,
        sessionSeconds: "00",
      });
    }
  };
  //Increment Session Length
  incrementSession() {
    if (
      this.state.sessionLength < 60 && this.state.timerIsOn === false
    ) {
      const newMinutes = this.state.sessionLength + 1 < 10 ? "0" + (parseInt(this.state.sessionLength) + 1) : this.state.sessionLength + 1;  
      this.setState({
        sessionLength: this.state.sessionLength + 1,
        sessionMinutes: newMinutes,
        sessionSeconds: "00",
      });
    }
  };
  
  //Start count down 
  startCountdown(seconds) {

    //let seconds = this.state.sessionMinutes * 60 + parseInt(this.state.sessionSeconds);
    const now = Date.now();
    const countSec = now + seconds * 1000;
    
    const intervalId = setInterval(() => {
      
      const secondsLeft = Math.round((countSec - Date.now()) / 1000);
      if (this.state.sessionMinutes === "00" && this.state.sessionSeconds === "00") {
          document.getElementById("beep").play();
      }
    
      // stop it when the count down is finished
      if (secondsLeft < 0) {
        clearInterval(intervalId);
        if (this.state.timerInBreak === false) {
          this.break();
        } else {
          this.afterBreak();
        }
        return;
      }

      // display session time
      this.displayTime(secondsLeft, intervalId);
    }, 1000);
  };

  //Play or stop the countdown
  timer() {
    if (this.state.timerIsOn === false) {
        this.setState({
          timerIsOn: true
        })
      const seconds = this.state.sessionMinutes * 60 + parseInt(this.state.sessionSeconds);
      this.startCountdown(seconds);
    } else {
      clearInterval(this.state.intervalId);
      const minuteToPause = this.state.sessionMinutes;
      const secondsToPause = this.state.sessionSeconds;
      this.setState({
        timerIsOn: false,
        sessionMinutes: minuteToPause,
        sessionSeconds: secondsToPause,
      });
    }
  };

  //Display the time
  displayTime(totalSeconds, currentId) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    this.setState({
      sessionMinutes: minutes < 10 ? "0" + minutes : minutes,
      sessionSeconds: seconds < 10 ? "0" + seconds : seconds,
      intervalId: currentId,
    })
  };

  //Break start
  break() {
    const breakMinutes = this.state.breakLength + 1 < 10 ? "0" + this.state.breakLength : this.state.breakLength;
    this.setState({
      session: "Break",
      //sessionMinutes: breakMinutes,
      //sessionSeconds: "00",
      timerIsOn: true,
      timerInBreak: true,
    })
    const seconds = this.state.breakLength * 60;
    this.startCountdown(seconds);
  };

  //Session restart after break end
  afterBreak() {
    const sessionMinutes = this.state.sessionLength + 1 < 10 ? "0" + this.state.sessionLength : this.state.sessionLength;
    this.setState({
      session: "Session",
      timerIsOn: true,
      timerInBreak: false,
    })
    const seconds = this.state.sessionLength * 60;
    this.startCountdown(seconds);
  };
  
  //Reset Timer
  resetTime = () => {
    clearInterval(this.state.intervalId);
    this.setState({
      breakLength: 5,
      sessionLength: 25,
      sessionMinutes: 25,
      sessionSeconds: "00",
      timerIsOn: false,
      timerInBreak: false,
      session: "Session",
    });
    document.getElementById("beep").currentTime = 0;
    document.getElementById("beep").pause();
  };


  render() {
    return (
      <div id="container">
        <div id="clock">
          <div id="title">
            <h2>25 + 5 Clock</h2>
          </div>
          <div id="buttons">
            <div id="break-label">
              Break Length
              <div id="break">
                <button id="break-decrement" onClick={() => this.decrementBreak()}>-</button>
                <div id="break-length">{this.state.breakLength}</div>
                <button id="break-increment" onClick={() => this.incrementBreak()}>+</button>
              </div>
            </div>
            <div id="session-label">
              Session Length
              <div id="session">
                <button id="session-decrement" onClick={() => this.decrementSession()}>-</button>
                <div id="session-length">{this.state.sessionLength}</div>
                <button id="session-increment" onClick={() => this.incrementSession()}>+</button>
              </div>
            </div>
          </div>
          <div id="timer-label">
            {this.state.session}
            <div id="time-left">
              <audio id="beep" src={beep01a} type="audio/mp3"></audio>
              {this.state.sessionMinutes}:{this.state.sessionSeconds}
            </div>
            <div id="button-timer">
              <button id="start_stop" className="material-icons" onClick={() => this.timer()}>
                play_circle_filled
              </button>
              <button id="reset" className="material-icons" onClick={() => this.resetTime()}>
                replay
              </button>            
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

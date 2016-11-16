import React from 'react';

import Player from './Player.jsx';

class Screening extends React.Component {
  constructor (props) {
    super(props);
    if ( this.props.settings.previd ) {
      switch ( this.props.settings.previd.activity ) {
      case 'Draw':
        this.imgUrl = 'public/img/drawing.jpg';
        break;
      case 'Eat Snack':
        this.imgUrl = 'public/img/snack-time.jpg';
        break;
      case 'Francis':
        this.imgUrl = 'public/img/francis.jpg';
        break;
      case 'Schedule':
        this.imgUrl = 'public/img/schedule.jpeg';
        break;
      default:
        break;
      }
      this.state = { section: 'previd' };
    } else {
      this.state = { section: 'playing' };
    }
  }

  countDownToPlay () {
    setTimeout(
      this.setState.bind(this, {section: 'playing'}),
      this.props.settings.previd.duration * 60000
    );
  }

  countDownToPostvid () {
    switch ( this.props.settings.postvid.activity ) {
    case 'Draw':
      this.imgUrl = 'public/img/drawing.jpg';
      break;
    case 'Eat Snack':
      this.imgUrl = 'public/img/snack-time.jpg';
      break;
    case 'Go Home':
      this.imgUrl = 'public/img/go-home.jpg';
      break;
    case 'Francis':
      this.imgUrl = 'public/img/francis.jpg';
      break;
    case 'Schedule':
      this.imgUrl = 'public/img/schedule.jpeg';
      break;
    default:
      this.imgUrl = 'public/img/go-home.jpg';
      break;
    }
    setTimeout(
      this.setState.bind(this, {section: 'postvid'}),
      this.props.settings.playDuration * 60000
    );
  }

  render () {
    if ( this.state.section === 'previd' ) {
      this.countDownToPlay();
      return <img className="img-responsive centered" src={this.imgUrl} />;
    } else if ( this.state.section === 'playing' ) {
      return (
        <Player
          videoId={this.props.playing}
          countDownToPostvid={this.countDownToPostvid.bind(this)}
          />
      );
    } else if ( this.state.section === 'postvid' ) {
      return <img className="img-responsive centered" src={this.imgUrl} />;
    }
  }
}

export default Screening;

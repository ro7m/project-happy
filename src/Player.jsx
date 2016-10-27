import React from 'react';
import Grid from 'react-bootstrap/lib/Grid';

class Player extends React.Component {
  constructor (props) {
    super(props);
  }

  componentDidMount () {
    this.player =  new YT.Player('video-screening', {
      videoId: this.props.videoId,
      playerVars: {autoplay: 1, loop: 1, playlist: this.props.videoId},
      events: {
          'onReady': this.props.countDownToPostvid.bind(this)
      }
    });
  }

  render () {
    return (
      <Grid fluid>
        <Grid fluid id="video-screening" />
      </Grid>
    );
  }
}

export default Player;

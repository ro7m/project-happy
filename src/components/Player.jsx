/*global YT:true */
import React from 'react';
import Grid from 'react-bootstrap/lib/Grid';

class Player extends React.Component {
  componentDidMount () {
    this.player =  new YT.Player('video-screening', {
      videoId: this.props.videoId,
      playerVars: {autoplay: 0, loop: 0, playlist: this.props.videoId}
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

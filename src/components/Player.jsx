import React from 'react';
import Grid from 'react-bootstrap/lib/Grid';

class Player extends React.Component {
  componentDidMount () {
    this.player = new YT.Player('video-screening', {
      videoId: this.props.videoId,
      playerVars: {
        autoplay: 0,
        loop: 0,
        playlist: this.props.videoId,
        // Disable elements that could redirect to YouTube
        modestbranding: 1,    // Minimal YouTube branding
        rel: 0,              // Disable related videos
        controls: 1,         // Show video controls
        showinfo: 0,         // Hide video title and uploader info
        fs: 1,              // Disable fullscreen button
        iv_load_policy: 3,   // Disable video annotations
        disablekb: 1,       // Disable keyboard controls
        enablejsapi: 1,      // Enable JavaScript API
        origin: window.location.origin // Specify origin for added security
      },
      events: {
        onStateChange: (event) => {
          // Prevent video from ending in YouTube redirect
          if (event.data === YT.PlayerState.ENDED) {
            this.player.stopVideo();
          }
        }
      }
    });
  }

  render () {
    return (
      <Grid>
        <div className="video-container">
          <div id="video-screening"></div>
        </div>
      </Grid>
    );
  }
}

export default Player;

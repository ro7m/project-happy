import React from 'react';
import Grid from 'react-bootstrap/lib/Grid';

class Player extends React.Component {
  componentDidMount() {
    // Initialize the player
    this.player = new YT.Player('video-screening', {
      videoId: this.props.videoId,
      playerVars: {
        autoplay: 0,
        loop: 1,  // Enable loop to prevent end screen
        playlist: this.props.videoId, // Required for loop to work
        modestbranding: 1,
        rel: 0,
        controls: 1,
        showinfo: 0,
        fs: 0,
        iv_load_policy: 3,
        disablekb: 1,
        enablejsapi: 1,
        origin: window.location.origin,
        // Additional parameters to restrict YouTube features
        playsinline: 1,     // Force inline playing
        cc_load_policy: 0,  // Disable closed captions by default
        widget_referrer: window.location.origin,
        embedOptions: {
          modestBranding: true
        }
      },
      events: {
        onReady: (event) => {
          // Add click interceptor when player is ready
          this.addClickInterceptor();
        },
        onStateChange: (event) => {
          // Prevent end screen suggestions
          if (event.data === YT.PlayerState.ENDED) {
            // Restart the video instead of showing end screen
            this.player.playVideo();
            // Or alternatively:
            // this.player.seekTo(0);
          }
        }
      }
    });
  }

  addClickInterceptor() {
  // Select the player element and create an overlay for play/pause functionality
  const playerElement = document.getElementById('video-screening');
  if (playerElement) {
    const iframe = playerElement.querySelector('iframe');
    if (iframe) {
      // Create overlay container
      const overlayContainer = document.createElement('div');
      overlayContainer.style.position = 'absolute';
      overlayContainer.style.top = '0';
      overlayContainer.style.left = '0';
      overlayContainer.style.width = '100%';
      overlayContainer.style.height = '100%';
      overlayContainer.style.zIndex = '10';
      overlayContainer.style.cursor = 'pointer';

      // Click handler for play/pause
      overlayContainer.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (this.player.getPlayerState() === YT.PlayerState.PLAYING) {
          this.player.pauseVideo();
        } else {
          this.player.playVideo();
        }
      };

      // Insert overlay above iframe to intercept clicks for play/pause
      iframe.parentNode.insertBefore(overlayContainer, iframe);
    }
  }
}


  componentWillUnmount() {
    if (this.player) {
      this.player.destroy();
    }
  }

  render() {
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

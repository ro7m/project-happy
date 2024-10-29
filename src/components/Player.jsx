import React from 'react';
import Grid from 'react-bootstrap/lib/Grid';

class Player extends React.Component {
  componentDidMount() {
    // Initialize the player
    this.player = new YT.Player('video-screening', {
      videoId: this.props.videoId,
      playerVars: {
        autoplay: 1,
        loop: 1,  // Enable loop to prevent end screen
        playlist: this.props.videoId, // Required for loop to work
        modestbranding: 1,
        rel: 0,
        controls: 1,
        showinfo: 0,
        fs: 1,
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
  const playerElement = document.getElementById('video-screening');
  if (playerElement) {
    const iframe = playerElement.querySelector('iframe');
    if (iframe) {
      // Create overlay div for exclusive play/pause functionality
      const overlay = document.createElement('div');
      overlay.style.position = 'absolute';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.zIndex = '10';
      overlay.style.cursor = 'pointer';
      overlay.style.pointerEvents = 'auto'; // Allow clicks on overlay

      // Play/pause toggle on overlay click
      overlay.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const playerState = this.player.getPlayerState();
        if (playerState === YT.PlayerState.PLAYING) {
          this.player.pauseVideo();
        } else if (playerState === YT.PlayerState.PAUSED) {
          this.player.playVideo();
        }
      };

      // Insert overlay to intercept clicks
      iframe.parentNode.insertBefore(overlay, iframe);
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

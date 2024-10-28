import React from 'react';
import Grid from 'react-bootstrap/lib/Grid';

class Player extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentVideoIndex: 0,
      playlist: [this.props.videoId],
      relatedVideos: [],
      loading: true,
      error: null
    };

    // Bind methods
    this.addYouTubeLogoStyle = this.addYouTubeLogoStyle.bind(this);
    this.addYouTubeLogoBlocker = this.addYouTubeLogoBlocker.bind(this);
    this.addClickInterceptor = this.addClickInterceptor.bind(this);
    this.fetchRelatedVideos = this.fetchRelatedVideos.bind(this);
    this.getRandomVideos = this.getRandomVideos.bind(this);
    this.playNextVideo = this.playNextVideo.bind(this);
    this.formatDuration = this.formatDuration.bind(this);
  }

  async componentDidMount() {
    await this.fetchRelatedVideos(this.props.videoId);
    
    // First create a div that will host our player
    const playerDiv = document.getElementById('video-screening');
    playerDiv.innerHTML = `
      <div class="video-wrapper">
        <div class="player-mask-top"></div>
        <div class="player-mask-left"></div>
        <div class="player-mask-right"></div>
        <div id="actual-player"></div>
      </div>
    `;

    this.player = new YT.Player('actual-player', {
      videoId: this.props.videoId,
      playerVars: {
        autoplay: 0,
        modestbranding: 1,
        rel: 0,
        controls: 1,
        showinfo: 0,
        fs: 0,
        iv_load_policy: 3,
        disablekb: 1,
        enablejsapi: 1,
        origin: window.location.origin,
        playsinline: 1,
        cc_load_policy: 0
      },
      events: {
        onReady: (event) => {
          this.addClickInterceptor();
          this.addYouTubeLogoBlocker();
        },
        onStateChange: (event) => {
          if (event.data === YT.PlayerState.ENDED) {
            this.playNextVideo();
          }
        }
      }
    });

    // Add style to hide YouTube logo
    this.addYouTubeLogoStyle();
  }

  addYouTubeLogoStyle() {
    const style = document.createElement('style');
    style.textContent = `
      .ytp-chrome-top-buttons,
      .ytp-youtube-button,
      .ytp-watermark,
      .ytp-show-cards-title,
      .ytp-pause-overlay,
      .ytp-expand-pause-overlay,
      .ytp-chrome-top,
      .ytp-cards-button,
      .ytp-cards-teaser,
      .ytp-related-videos-container {
        display: none !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }
      
      .player-mask-top {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 40px;
        z-index: 10;
        pointer-events: none;
      }
      
      .player-mask-left,
      .player-mask-right {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 40px;
        z-index: 10;
        pointer-events: none;
      }
      
      .player-mask-left {
        left: 0;
      }
      
      .player-mask-right {
        right: 0;
      }
      
      .video-wrapper {
        position: relative;
        width: 100%;
        height: 100%;
      }

      .video-container {
        position: relative;
        padding-bottom: 56.25%;
        height: 0;
        overflow: hidden;
        margin-bottom: 20px;
      }
      
      .video-container #video-screening {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
      
      .video-container iframe {
        width: 100%;
        height: 100%;
        border: none;
        pointer-events: none !important;
      }

      .playlist-container {
        max-height: 400px;
        overflow-y: auto;
      }
      
      .playlist-item {
        transition: background-color 0.2s ease;
        border-bottom: 1px solid #e5e7eb;
      }
      
      .playlist-item:hover {
        background-color: #f3f4f6;
      }
      
      .playlist-item:last-child {
        border-bottom: none;
      }
    `;
    document.head.appendChild(style);
  }

  addYouTubeLogoBlocker() {
    const iframe = document.querySelector('#actual-player');
    if (iframe) {
      const observer = new MutationObserver((mutations) => {
        const ytpButton = iframe.contentDocument?.querySelector('.ytp-youtube-button');
        if (ytpButton) {
          ytpButton.style.display = 'none';
          ytpButton.style.pointerEvents = 'none';
        }
      });

      try {
        if (iframe.contentDocument) {
          observer.observe(iframe.contentDocument, {
            childList: true,
            subtree: true
          });
        }
      } catch (e) {
        console.log('Cannot access iframe content due to same-origin policy');
      }
    }
  }

  addClickInterceptor() {
    const playerElement = document.getElementById('video-screening');
    if (playerElement) {
      const iframe = playerElement.querySelector('iframe');
      if (iframe) {
        const overlayContainer = document.createElement('div');
        overlayContainer.style.position = 'absolute';
        overlayContainer.style.top = '0';
        overlayContainer.style.left = '0';
        overlayContainer.style.width = '100%';
        overlayContainer.style.height = '100%';
        overlayContainer.style.zIndex = '9';
        overlayContainer.style.cursor = 'pointer';

        const cornerBlockers = ['top-left', 'top-right', 'bottom-left', 'bottom-right'].map(corner => {
          const blocker = document.createElement('div');
          blocker.style.position = 'absolute';
          blocker.style.width = '40px';
          blocker.style.height = '40px';
          blocker.style.background = 'transparent';
          blocker.style.zIndex = '11';
          blocker.style.pointerEvents = 'all';
          
          switch(corner) {
            case 'top-left':
              blocker.style.top = '0';
              blocker.style.left = '0';
              break;
            case 'top-right':
              blocker.style.top = '0';
              blocker.style.right = '0';
              break;
            case 'bottom-left':
              blocker.style.bottom = '0';
              blocker.style.left = '0';
              break;
            case 'bottom-right':
              blocker.style.bottom = '0';
              blocker.style.right = '0';
              break;
          }
          
          blocker.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
          };
          
          return blocker;
        });

        overlayContainer.onclick = (e) => {
          const rect = overlayContainer.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const clickY = e.clientY - rect.top;
          
          if ((clickX < 40 && clickY < 40) || 
              (clickX > rect.width - 40 && clickY < 40) || 
              (clickX < 40 && clickY > rect.height - 40) || 
              (clickX > rect.width - 40 && clickY > rect.height - 40)) {
            e.preventDefault();
            e.stopPropagation();
            return false;
          }
          
          if (this.player.getPlayerState() === YT.PlayerState.PLAYING) {
            this.player.pauseVideo();
          } else {
            this.player.playVideo();
          }
        };

        cornerBlockers.forEach(blocker => overlayContainer.appendChild(blocker));
        iframe.parentNode.insertBefore(overlayContainer, iframe);
      }
    }
  }

  async fetchRelatedVideos(videoId) {
    try {
      this.setState({ loading: true, error: null });
      
      const response = await fetch(`https://pipedapi.kavin.rocks/streams/${videoId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch related videos');
      }
      
      const data = await response.json();
      const randomVideos = this.getRandomVideos(data.relatedStreams, 3);
      
      this.setState(prevState => ({
        playlist: [...prevState.playlist, ...randomVideos.map(video => video.id)],
        relatedVideos: randomVideos,
        loading: false
      }));
    } catch (error) {
      console.error('Error fetching related videos:', error);
      this.setState({ 
        error: 'Failed to load related videos',
        loading: false 
      });
    }
  }

  getRandomVideos(videos, count) {
    const shuffled = [...videos].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  playNextVideo() {
    const { currentVideoIndex, playlist } = this.state;
    const nextIndex = (currentVideoIndex + 1) % playlist.length;
    
    this.setState({ currentVideoIndex: nextIndex }, () => {
      this.player.loadVideoById(playlist[nextIndex]);
    });
  }

  formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  componentWillUnmount() {
    if (this.player) {
      this.player.destroy();
    }
  }

  render() {
    const { relatedVideos, currentVideoIndex, playlist, loading, error } = this.state;

    return (
      <Grid>
        <div className="video-container">
          <div id="video-screening"></div>
        </div>
        
        <div className="playlist-container mt-4">
          <h3 className="text-xl font-bold mb-2">Up Next</h3>
          
          {loading && <div className="text-gray-600">Loading related videos...</div>}
          
          {error && <div className="text-red-500">{error}</div>}
          
          {!loading && !error && (
            <div className="playlist-items">
              {relatedVideos.map((video, index) => (
                <div 
                  key={video.id}
                  className={`playlist-item p-2 cursor-pointer ${
                    playlist[currentVideoIndex] === video.id ? 'bg-gray-200' : ''
                  }`}
                  onClick={() => {
                    this.setState({ currentVideoIndex: index + 1 }, () => {
                      this.player.loadVideoById(video.id);
                    });
                  }}
                >
                  <div className="flex items-center">
                    <div className="relative">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title}
                        className="w-24 h-16 object-cover mr-2"
                      />
                      {video.duration && (
                        <div className="absolute bottom-1 right-3 bg-black bg-opacity-75 text-white text-xs px-1 rounded">
                          {this.formatDuration(video.duration)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{video.title}</h4>
                      <p className="text-xs text-gray-600">{video.uploaderName}</p>
                      <p className="text-xs text-gray-500">
                        {video.views.toLocaleString()} views
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Grid>
    );
  }
}

export default Player;

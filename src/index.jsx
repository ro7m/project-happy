import React from 'react';
import { render } from 'react-dom';

import NavigationBar from './NavigationBar.jsx';
import SearchResult from './SearchResult.jsx';
import Screening from './Screening.jsx';

class App extends React.Component {
  constructor () {
    super();
    this.state = {};
    if ( localStorage.settings ) this.state.settings = JSON.parse(localStorage.settings);
    else {
      this.state.settings = {
        previd: null,
        playDuration: 2,
        postvid: {
          activity: 'Go Home'
        },
        lastQuery: null
      }
      localStorage.setItem('settings', JSON.stringify(this.state.settings));
    }
    this.state.playing = null;
  }

  updateSettings (newSettings) {
    this.setState({ settings: newSettings });
    localStorage.setItem('settings', JSON.stringify(newSettings));
  }

  startPlaying (videoId) {
    this.setState({ playing: videoId })
  }

  render () {
    if ( this.state.playing ) return <Screening {...this.state} />;
    return (
      <div>
        <NavigationBar {...this.state.settings} updateSettings={this.updateSettings.bind(this)} />
        <SearchResult lastQuery={this.state.settings.lastQuery} startPlaying={this.startPlaying.bind(this)} />
      </div>
    )
  }
}

render(<App />, document.getElementById('application'));

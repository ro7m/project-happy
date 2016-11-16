import React from 'react';

import NavigationBar from './NavigationBar.jsx';
import SearchResult from './SearchResult.jsx';
import Screening from './Screening.jsx';

class Main extends React.Component {
  updateSettings (newSettings) {
    this.setState({ settings: newSettings });
    localStorage.setItem('settings', JSON.stringify(newSettings));
  }

  startPlaying (videoId) {
    this.setState({ playing: videoId });
  }

  render () {
    if ( this.props.playing ) return <Screening {...this.state} />;
    return (
      <div>
        <NavigationBar {...this.props.settings} updateSettings={this.updateSettings.bind(this)} />
        <SearchResult lastQuery={this.props.settings.lastQuery} startPlaying={this.startPlaying.bind(this)} />
      </div>
    );
  }
}

export default Main;

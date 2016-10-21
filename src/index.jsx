import React from 'react';
import { render } from 'react-dom';

import NavigationBar from './NavigationBar.jsx';

class App extends React.Component {
  constructor () {
    super();
    if ( localStorage.settings ) this.state = JSON.parse(localStorage.settings);
    else {
      this.state = {
        previd: null,
        playDuration: 120000,
        postvid: {
          activity: 'Drawing'
        },
        lastQuery: null
      }
      localStorage.setItem('settings', JSON.stringify(this.state));
    }
  }

  render () {
    return (
      <NavigationBar />
    )
  }
}

render(<App />, document.getElementById('application'));

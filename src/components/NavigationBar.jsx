import React from 'react';
import Navbar from 'react-bootstrap/lib/Navbar';

import SearchBox from './SearchBox.jsx';
import SettingsPopUp from './SettingsPopUp.jsx';

class NavigationBar extends React.Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <Navbar fluid={true}>
        <Navbar.Header>
          <a href="/"><img className="navbar-img img-responsive" src="public/img/logo.jpeg" /></a>
        </Navbar.Header>
        <SearchBox {...this.props} />
        <SettingsPopUp {...this.props} />
      </Navbar>
    );
  }
}

export default NavigationBar;

import React from 'react';
import { Navbar, Nav, NavItem, InputGroup, FormGroup, FormControl, Glyphicon, Button } from 'react-bootstrap';
import SettingsPopUp from './SettingsPopUp.jsx'

class NavigationBar extends React.Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <Navbar fluid={true}>
        <Navbar.Header>
          <a href="/"><img className="navbar-img img-responsive" src="public/img/logo.jpeg" /></a>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Navbar.Form pullLeft>
            <FormGroup>
              <InputGroup>
                <FormControl type="text" placeholder="Search for videos..." />
                <InputGroup.Button>
                  <Button type="submit"><Glyphicon glyph="search" /> Search</Button>
                </InputGroup.Button>
              </InputGroup>
            </FormGroup>
          </Navbar.Form>
          <SettingsPopUp />
        </Navbar.Collapse>
      </Navbar>
    )
  }
}

export default NavigationBar;

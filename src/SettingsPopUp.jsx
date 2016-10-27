import React from 'react';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import Checkbox from 'react-bootstrap/lib/Checkbox';
import Radio from 'react-bootstrap/lib/Radio';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';

class SettingsPopUp extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      showModal: false,
      showPrevid: this.props.previd !== null,
      settings: this.props
    };
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.showPrevid = this.showPrevid.bind(this);
  }

  close () {
    this.setState({ showModal: false });
  }

  open () {
    this.setState({ showModal: true });
  }

  showPrevid () {
    if ( this.state.showPrevid ) {
      this.setState({ showPrevid: false });
    } else {
      let newSettings = JSON.parse(JSON.stringify(this.state.settings));
      newSettings.previd = {
        activity: 'Draw',
        duration: 120000
      }
      this.setState({
        showPrevid: true,
        settings: newSettings
       });
    }
  }

  render () {
    return (
      <div>
        <Nav pullRight>
          <NavItem onClick={this.open}><Glyphicon glyph="cog" /> Settings</NavItem>
        </Nav>
        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>Settings</Modal.Title>
          </Modal.Header>
          <form  id="timer">
            <Modal.Body>
              <FormGroup>
                <Checkbox id="prevideo-activity"
                  onClick={this.showPrevid}
                  checked={this.state.showPrevid}>
                  <span>Enable prevideo activity suggestions</span>
                </Checkbox>
              </FormGroup>
              {
                (() => {
                  if ( this.state.showPrevid ) {
                    return (
                      <div>
                        <FormGroup>
                          <Radio
                            inline name="prevideo-activity"
                            value="Draw"
                            defaultChecked={this.state.settings.previd.activity === 'Draw'}>
                            <span className="btn btn-default">Draw</span>
                          </Radio>
                          <Radio
                            inline name="prevideo-activity"
                            value="Eat Snack"
                            defaultChecked={this.state.settings.previd.activity === 'Eat Snack'}>
                            <span className="btn btn-default">Eat Snack</span>
                          </Radio>
                        </FormGroup>
                        <FormGroup>
                          <ControlLabel>Duration for prevideo activity</ControlLabel>
                          <FormControl
                            type="number"
                            name="prevideo-duration"
                            placeholder="this will be in minutes, default to 2 mins..."
                            defaultValue={this.state.settings.previd.duration/60000} />
                        </FormGroup>
                      </div>
                    );
                  } else {
                    return "";
                  }
                })()
              }
              <FormGroup>
                <ControlLabel>Set Timer</ControlLabel>
                <FormControl
                  type="number"
                  name="duration"
                  placeholder="this will be in minutes, default to 2 mins..."
                  defaultValue={this.state.settings.playDuration/60000} />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Directed Action</ControlLabel>
                <br/>
                <Radio inline
                  value="Go Home"
                  name="directed-action"
                  defaultChecked={this.state.settings.postvid.activity === 'Go Home'}>
                  <span className="btn btn-default">Go Home</span>
                </Radio>
                <Radio inline
                  value="Eat Snack"
                  name="directed-action"
                  defaultChecked={this.state.settings.postvid.activity === 'Eat Snack'}>
                  <span  className="btn btn-default">Eat Snack</span>
                </Radio>
                <Radio inline
                  value="Draw"
                  name="directed-action"
                  defaultChecked={this.state.settings.postvid.activity === 'Draw'}>
                  <span className="btn btn-default">Draw</span>
                </Radio>
              </FormGroup>
            </Modal.Body>
            <Modal.Footer>
              <Button type="submit" ><Glyphicon glyph="ok" />  Save</Button>
              <Button type="button" onClick={this.close}><Glyphicon glyph="remove" />  Cancel</Button>
            </Modal.Footer>
          </form>
        </Modal>
      </div>
    )
  }
}

export default SettingsPopUp;

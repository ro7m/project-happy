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
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      showPrevid: this.props.settings.previd !== null,
      settings: JSON.parse(JSON.stringify(props.settings))
    };
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.showPrevid = this.showPrevid.bind(this);
    this.onPlayDurationChange = this.onPlayDurationChange.bind(this);
    this.onPrevidActivityChange = this.onPrevidActivityChange.bind(this);
    this.onPrevidDurationChange = this.onPrevidDurationChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  close () {
    this.setState({
      showModal: false,
      showPrevid: this.props.settings.previd !== null,
      settings: JSON.parse(JSON.stringify(this.props.settings))
    });
  }

  open () {
    this.setState({
      showModal: true,
    });
  }

  showPrevid () {
    if ( this.state.showPrevid ) {
      let newSettings = JSON.parse(JSON.stringify(this.state.settings));
      newSettings.previd = null;
      this.setState({
        showPrevid: false,
        settings: newSettings
      });
    } else {
      let newSettings = JSON.parse(JSON.stringify(this.state.settings));
      newSettings.previd = {
        activity: 'Draw',
        duration: 2
      };
      this.setState({
        showPrevid: true,
        settings: newSettings
      });
    }
  }

  onPrevidActivityChange (newActivity) {
    let newSettings = JSON.parse(JSON.stringify(this.state.settings));
    newSettings.previd.activity = newActivity;
    this.setState({ settings: newSettings });
  }

  onPrevidDurationChange (event) {
    let newSettings = JSON.parse(JSON.stringify(this.state.settings));
    newSettings.previd.duration = event.target.value;
    this.setState({ settings: newSettings });
  }

  onPlayDurationChange (event) {
    let newSettings = JSON.parse(JSON.stringify(this.state.settings));
    newSettings.playDuration = event.target.value;
    this.setState({ settings: newSettings });
  }

  onPostvidActivityChange (newActivity) {
    let newSettings = JSON.parse(JSON.stringify(this.state.settings));
    newSettings.postvid.activity = newActivity;
    this.setState({ settings: newSettings });
  }

  handleSubmit (event) {
    event.preventDefault();
    if ( this.state.settings.previd ) this.state.settings.previd.duration = this.state.settings.previd.duration || 2;
    this.state.settings.playDuration = this.state.settings.playDuration || 2;
    this.props.updateSettings(this.state.settings);
    this.setState({ showModal:false });
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
          <form  id="timer" onSubmit={this.handleSubmit}>
            <Modal.Body>
              <FormGroup>
                <Checkbox id="prevideo-activity"
                  checked={this.state.showPrevid}
                  onChange={this.showPrevid}>
                  <span>Enable prevideo activity suggestions</span>
                </Checkbox>
              </FormGroup>
              {
                (() => {
                  if ( this.state.showPrevid ) {
                    return (
                      <div>
                        <FormGroup>
                          <Radio inline
                            name="prevideo-activity"
                            value="Draw"
                            checked={this.state.settings.previd.activity === 'Draw'}
                            onChange={() => this.onPrevidActivityChange('Draw')} >
                            <span className="btn btn-default">Draw</span>
                          </Radio>
                          <Radio inline
                            name="prevideo-activity"
                            value="Eat Snack"
                            checked={this.state.settings.previd.activity === 'Eat Snack'}
                            onChange={() => this.onPrevidActivityChange('Eat Snack')} >
                            <span className="btn btn-default">Eat Snack</span>
                          </Radio>
                          <Radio inline
                            name="prevideo-activity"
                            value="Francis"
                            checked={this.state.settings.previd.activity === 'Francis'}
                            onChange={() => this.onPrevidActivityChange('Francis')} >
                            <span className="btn btn-default">Francis</span>
                          </Radio>
                          <Radio inline
                            name="prevideo-activity"
                            value="Schedule"
                            checked={this.state.settings.previd.activity === 'Schedule'}
                            onChange={() => this.onPrevidActivityChange('Schedule')} >
                            <span className="btn btn-default">Schedule</span>
                          </Radio>
                        </FormGroup>
                        <FormGroup>
                          <ControlLabel>Duration for prevideo activity</ControlLabel>
                          <FormControl
                            type="number"
                            name="prevideo-duration"
                            placeholder="this will be in minutes, default to 2 mins..."
                            value={this.state.settings.previd.duration}
                            onChange={this.onPrevidDurationChange} />
                        </FormGroup>
                      </div>
                    );
                  } else {
                    return '';
                  }
                })()
              }
              <FormGroup>
                <ControlLabel>Set Timer</ControlLabel>
                <FormControl
                  type="number"
                  name="duration"
                  placeholder="this will be in minutes, default to 2 mins..."
                  value={this.state.settings.playDuration}
                  onChange={this.onPlayDurationChange} />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Directed Action</ControlLabel>
                <br/>
                <Radio inline
                  value="Go Home"
                  name="directed-action"
                  checked={this.state.settings.postvid.activity === 'Go Home'}
                  onChange={() => this.onPostvidActivityChange('Go Home')} >
                  <span className="btn btn-default">Go Home</span>
                </Radio>
                <Radio inline
                  value="Eat Snack"
                  name="directed-action"
                  checked={this.state.settings.postvid.activity === 'Eat Snack'}
                  onChange={() => this.onPostvidActivityChange('Eat Snack')} >
                  <span  className="btn btn-default">Eat Snack</span>
                </Radio>
                <Radio inline
                  value="Draw"
                  name="directed-action"
                  checked={this.state.settings.postvid.activity === 'Draw'}
                  onChange={() => this.onPostvidActivityChange('Draw')} >
                  <span className="btn btn-default">Draw</span>
                </Radio>
                <Radio inline
                  value="Francis"
                  name="directed-action"
                  checked={this.state.settings.postvid.activity === 'Francis'}
                  onChange={() => this.onPostvidActivityChange('Francis')} >
                  <span className="btn btn-default">Francis</span>
                </Radio>
                <Radio inline
                  value="Schedule"
                  name="directed-action"
                  checked={this.state.settings.postvid.activity === 'Schedule'}
                  onChange={() => this.onPostvidActivityChange('Schedule')} >
                  <span className="btn btn-default">Schedule</span>
                </Radio>
              </FormGroup>
            </Modal.Body>
            <Modal.Footer>
              <Button type="submit"><Glyphicon glyph="ok" />  Save</Button>
              <Button type="button" onClick={this.close}><Glyphicon glyph="remove" />  Cancel</Button>
            </Modal.Footer>
          </form>
        </Modal>
      </div>
    );
  }
}

export default SettingsPopUp;

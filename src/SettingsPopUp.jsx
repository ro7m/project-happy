import React from 'react';
import { Nav, NavItem, FormGroup, ControlLabel, FormControl, Checkbox, Radio, Glyphicon, Button, Modal } from 'react-bootstrap';

class SettingsPopUp extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      showModal: false,
      showPrevid: false,
    };
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.previd = this.previd.bind(this);
  }

  close () {
    this.setState({ showModal: false });
  }

  open () {
    this.setState({ showModal: true });
  }

  previd () {
    this.setState({ showPrevid: !this.state.showPrevid });
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
                <Checkbox id="prevideo-activity" onClick={this.previd}>
                  <span>Enable prevideo activity suggestions</span>
                </Checkbox>
              </FormGroup>
              { (() => {
                  if ( this.state.showPrevid ) {
                    return (
                      <div>
                        <FormGroup>
                          <Radio inline defaultChecked name="prevideo-activity" value="Draw">
                            <span className="btn btn-default">Draw</span>
                          </Radio>
                          <Radio inline name="prevideo-activity" value="Eat Snack">
                            <span className="btn btn-default">Eat Snack</span>
                          </Radio>
                        </FormGroup>
                        <FormGroup>
                          <ControlLabel>Duration for prevideo activity</ControlLabel>
                          <FormControl
                            type="number"
                            name="prevideo-duration"
                            placeholder="this will be in minutes, default to 2 mins..." />
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
                  placeholder="this will be in minutes, default to 2 mins..." />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Directed Action</ControlLabel>
                <br/>
                <Radio inline defaultChecked value="Go Home" name="directed-action">
                  <span className="btn btn-default">Go Home</span>
                </Radio>
                <Radio inline value="Eat Snack" name="directed-action">
                  <span  className="btn btn-default">Eat Snack</span>
                </Radio>
                <Radio inline value="Draw" name="directed-action">
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

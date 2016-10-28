import React from 'react';
import Navbar from 'react-bootstrap/lib/Navbar';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import InputGroup from 'react-bootstrap/lib/InputGroup';
import Button from 'react-bootstrap/lib/Button';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

class SearchBox extends React.Component {
  constructor (props) {
    super(props);
    this.state = { query: '' };
    this.onQueryChange = this.onQueryChange.bind(this);
    this.onSearchSubmission = this.onSearchSubmission.bind(this);
  }

  onQueryChange (event) {
    this.setState({ query: event.target.value });
  }

  onSearchSubmission (event) {
    event.preventDefault();
    if ( this.state.query === '' ) return;
    let newSettings = JSON.parse( JSON.stringify(this.props) );
    newSettings.lastQuery = this.state.query;
    this.props.updateSettings(newSettings);
  }

  render () {
    return (
      <Navbar.Form pullLeft>
        <form onSubmit={this.onSearchSubmission}>
        <FormGroup>
          <InputGroup>
              <FormControl
                type="text"
                placeholder="Search for videos..."
                value={this.state.query}
                onChange={this.onQueryChange} />
              <InputGroup.Button>
                <Button type="submit" >
                  <Glyphicon glyph="search" /> Search
                </Button>
              </InputGroup.Button>
          </InputGroup>
        </FormGroup>
        </form>
      </Navbar.Form>
    )
  }
}

export default SearchBox;

import React from 'react';
import Grid from 'react-bootstrap/lib/Grid';
import Button from 'react-bootstrap/lib/Button';
import axios from 'axios';

import Spinner from './Spinner.jsx';
import SearchResultItem from './SearchResultItem.jsx';

class SearchResult extends React.Component {
  constructor (props) {
    super(props);
    this.state = { results: null };
    this.loadMoreResults = this.loadMoreResults.bind(this);
    this.data = {
      key: 'AIzaSyDZYAKp1cVowIRmnV4jXh_C2x0vDVLHvYU',
      part: 'snippet',
      type: 'video',
      q: this.props.lastQuery,
      videoDimension: '2d',
      videoEmbeddable: 'true'
    };
  }

  componentWillReceiveProps (nextProps) {
    if ( this.props.lastQuery === nextProps.lastQuery ) return;
    this.data.q = nextProps.lastQuery;
    this.data.pageToken = null;
    this.setState({ results: null });
    this.performSearch();
  }

  componentDidMount () {
    if ( !this.props.lastQuery ) return;
    this.performSearch();
  }

  performSearch () {
    axios({
      url: 'https://www.googleapis.com/youtube/v3/search',
      method: 'get',
      params: this.data
    }).then( (res) => {
      res = res.data;
      this.data.pageToken = res.nextPageToken;
      this.setState({
        loading: false,
        results: res.items
      });
    }).catch( () => {
      this.setState({
        loading: false,
        results: 'error'
      });
    });
  }

  loadMoreResults () {
    this.setState({ loading: true });
    axios({
      url: 'https://www.googleapis.com/youtube/v3/search',
      method: 'get',
      params: this.data
    }).then( (res) => {
      res = res.data;
      this.data.pageToken = res.nextPageToken;
      this.setState({
        loading: false,
        results: this.state.results.concat(res.items)
      });
    }).catch( () => {
      this.setState({
        loading: false,
        results: this.state.results
      });
    });
  }

  render () {
    if ( !this.props.lastQuery ) return (<h4 className="text-center">Start by searching for videos</h4>);
    else if ( !this.state.results ) return <Spinner />;
    else if ( this.state.results === 'error' ) return (<h4 className="text-center">There was an error! Please try again</h4>);
    return (
      <Grid id="results">
        {
          this.state.results.map( (item) => {
            return (
              <SearchResultItem
                key={item.id.videoId}
                id={item.id.videoId}
                {...item.snippet}
                startPlaying={this.props.startPlaying.bind(this, item.id.videoId)}
                />
            );
          })
        }
        {( this.state.loading ) ? (<Spinner />) : <Button className="center-block" onClick={this.loadMoreResults}>Load More Videos...</Button>}
      </Grid>
    );
  }
}

export default SearchResult;

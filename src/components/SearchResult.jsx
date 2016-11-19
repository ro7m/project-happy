import React from 'react';
import Grid from 'react-bootstrap/lib/Grid';
import Button from 'react-bootstrap/lib/Button';

import Spinner from './Spinner.jsx';
import SearchResultItem from './SearchResultItem.jsx';

class SearchResult extends React.Component {
  constructor (props) {
    super(props);
  }

  componentDidMount () {
    if ( !localStorage.lastQuery ) return;
    else this.props.searchVideos(localStorage.lastQuery);
  }

  render () {
    let { status, error, results } = this.props.search;

    if ( status === 'new' ) return (<h4 className="text-center">Start by searching for videos</h4>);
    else if ( status === 'loading' ) return <Spinner />;
    else if ( status === 'error' ) return (<h4 className="text-center">{error.toString()}! Please try again</h4>);
    return (
      <Grid id="results">
        {
          results.items.map( (item) => {
            return (
              <SearchResultItem
                key={item.id.videoId}
                id={item.id.videoId}
                {...item.snippet}
                startScreening={() => this.props.startScreening(item.id.videoId)}
                />
            );
          })
        }
        {
          ( status === 'load-more' ) ?
          <Spinner /> :
          <Button className="center-block" onClick={this.props.loadMoreVideos}>Load More Videos...</Button>
        }
      </Grid>
    );
  }
}

export default SearchResult;

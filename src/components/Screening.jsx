import React from 'react';

import Player from './Player.jsx';

class Screening extends React.Component {
  render () {
    const { status, url, id } = this.props.screening;

    if ( status === 'image' ) {
      return <img className="img-responsive centered" src={url} />;
    } else if ( status === 'playing' ) {
      return (
        <Player videoId={id} />
      );
    }
  }
}

export default Screening;

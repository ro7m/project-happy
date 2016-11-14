import React from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Image from 'react-bootstrap/lib/Image';

class SearchResultItem extends React.Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <Row className="result" onClick={this.props.startPlaying}>
        <Col xs={12} sm={3}>
          <Image responsive src={this.props.thumbnails.medium.url} />
        </Col>
        <Col xs={12} sm={9}>
          <h4>{this.props.title}</h4>
          <p className="text-muted">{this.props.channelTitle}</p>
          <p>{this.props.description}</p>
        </Col>
      </Row>
    );
  }
}

export default SearchResultItem;

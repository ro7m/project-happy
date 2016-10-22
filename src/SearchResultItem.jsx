import React from 'react';
import { Row, Col, Image } from 'react-bootstrap';

class SearchResultItem extends React.Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <Row className="result">
        <Col xs={12} sm={3}>
          <Image responsive src={this.props.thumbnails.medium.url} />
        </Col>
        <Col xs={12} sm={9}>
          <h4>{this.props.title}</h4>
          <p className="text-muted">{this.props.channelTitle}</p>
          <p>{this.props.description}</p>
        </Col>
      </Row>
    )
  }
}

export default SearchResultItem;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col } from 'react-grid-system';

import IconButton from 'SharedComponents/icon-button';
import MwambaKeyValueList from 'Utils/mwamba-key-value-list';

export default class KeyValueList extends Component {
  static propTypes = {
    data: PropTypes.object,
    width: PropTypes.number,
    title: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.state = {
      defaultDisplay: 10,
      display: 10,
      show: 'less',
    };

    this.showMore = this.showMore.bind(this);
    this.showLess = this.showLess.bind(this);
  }

  showMore() {
    const { data } = this.props;
    this.setState({ show: 'more', display: Object.keys(data).length });
  }

  showLess() {
    const { defaultDisplay } = this.state;
    this.setState({ show: 'less', display: defaultDisplay });
  }

  render() {
    const { data, title, width } = this.props;
    const { display, show } = this.state;
    const keys = data ? Object.keys(data) : [];
    const list = keys.sort((a, b) => {
      if (parseFloat(data[a], 10) < parseFloat(data[b], 10)) {
        return 1;
      }
      if (parseFloat(data[a], 10) > parseFloat(data[b], 10)) {
        return -1;
      }
      return 0;
    }).slice(0, display).map((key) => ({ key, value: data[key] }));
    return (
      <Col xl={6} lg={6} md={6} sm={12} xs={12} style={{ padding: '0 10px 0 10px', borderRadius: 8 }}>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, boxShadow: 'rgba(67, 70, 86, 0.1) 0 0px 10px 5px', marginBottom: 20, marginTop: 10, minHeight: 'calc(100% - 20px)' }}>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#6d6e71', width: '100%', padding: '10px 0 20px 0' }}>
            {title}
          </div>
          <MwambaKeyValueList list={list} />
          {
            list ? (
              <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', marginTop: 10 }}>
                {
                  show === 'less' && keys.length > display ? (
                    <IconButton icon="expand_more" onClick={this.showMore} />
                  ) : null
                }
                {
                  show === 'more' ? (
                    <IconButton icon="expand_less" onClick={this.showLess} />
                  ) : null
                }
              </div>
            ) : null
          }
        </div>
      </Col>
    );
  }
}

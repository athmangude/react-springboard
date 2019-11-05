/* eslint-disable object-curly-newline */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Hashids from 'hashids';

import CustomerSegment from './CustomerSegment';
import { createDummySegments } from '../../../components/DummyData'
import Title from 'Modules/analytics/containers/components/Title';

export default class CustomerSegments extends Component {
  static propTypes = {
    customerAnalyticsActions: PropTypes.object,
    EventHandler: PropTypes.object,
    demoMode: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.fetchSegments = this.fetchSegments.bind(this);
    this.createDummySegments = this.createDummySegments.bind(this);
    this.onViewSegment = this.onViewSegment.bind(this);
    this.encodeSegmentId = this.encodeSegmentId.bind(this);

    this.state = {
      isLoadingSegments: false,
      segments: [],
      limit: 12,
    };
  }

  componentDidMount() {
    const { demoMode } = this.props;

    if(!demoMode) {
      this.fetchSegments();
    } else {
      this.createDummySegments(true);
    }
  }

  createDummySegments() {
    this.setState({ isLoadingSegments: true });

    setTimeout(() => {
      this.setState({ segments: createDummySegments(), isLoadingSegments: false });
    }, 1000)
  }

  encodeSegmentId(segmentId) {
    const hashids = new Hashids('&%^%#$&^(*^&&^$%@#%@', 15);
    return hashids.encode(segmentId);
  }

  onViewSegment(segment) {
    const { context } = this.props;
    const { router } = context;
    router.history.push(`/segment/${this.encodeSegmentId(segment.id)}`);
  }

  async fetchSegments() {
    const { customerAnalyticsActions, EventHandler } = this.props;
    const { limit, currentPage } = this.state;
    this.setState({ isLoadingSegments: true });
    try {
      const fetchSegmentsResult = await customerAnalyticsActions.fetchSegments(limit, 0);
      this.setState({ segments: fetchSegmentsResult.data.Data });
    } catch (exception) {
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isLoadingSegments: false });
    }
  }

  render() {
    const { segments, isLoadingSegments } = this.state;

    return(
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', width: '100%', padding: 10, backgroundColor: 'rgb(236, 236, 236)', alignItems: 'center', justifyContent: 'space-between' }}>
          <Title title="Segments" subtitle="Which other segments does my customer belong to?" loading={isLoadingSegments} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', padding: 5 }}>
          <div className="grid-item" style={{ width: '100%', padding: '0px 10px 10px' }}>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', borderRadius: 2, marginBottom: 20, marginTop: 10, minHeight: 'calc(100% - 20px)' }}>
              <div style={{ width: '100%' }}>
                {
                  isLoadingSegments ? (
                    <CustomerSegment loading={isLoadingSegments} />
                  ) : (
                    segments.map((segment) => (
                      <CustomerSegment segment={segment} viewSegment={this.onViewSegment} />
                    ))
                  )
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// const CustomerSegments = ({ segments, isLoading, onViewSegment }) => (

// );

// CustomerSegments.propTypes = {
//   segments: PropTypes.array,
//   isLoading: PropTypes.bool,
// };

// export default CustomerSegments;

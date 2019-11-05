import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { createFakeHighestSpenders } from '../../../components/DummyData';
import ActionButton from 'SharedComponents/action-button-styled'
import themes from 'SharedComponents/themes';

const { primaryColor, lightPrimaryColor } = themes.light;

function getFilter(filter) {
  if (filter.filterType === 'RANGE') {
    return (
      <span>
        <strong>
          {`${sentenseCase(filter.name)}`}
        &nbsp;between
        </strong>
      &nbsp;
        {filter.minValue}
      &nbsp;and&nbsp;
        {filter.maxValue}
      </span>
    );
  }
  return (
    <span>
      <strong>{`${sentenseCase(filter.name)}`}</strong>
      &nbsp;
      {stringifyFilterOptions(filter.options)}
    </span>
  );
}

function sentenseCase(value) {
  const newWord = value.replace(/([A-Z]+)/g, ' $1').replace(/([A-Z][a-z])/g, ' $1');
  return newWord.charAt(0).toUpperCase() + newWord.slice(1);
}

function stringifyFilterOptions(options) {
  const data = [];

  options.forEach((option, index) => (
    (index === 0) ? data.push(option) : data.push(`, ${option}`)
  ));

  return data;
}

export default class Activity extends Component {
  static propTypes = {
    segmentId: PropTypes.number,
    customerAnalyticsActions: PropTypes.object,
    EventHandler: PropTypes.object,
    demoMode: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      activities: [],
      limit: 10,
      offset: 0,
      startTime: moment().subtract(2, 'years').format('YYYY-MM-DD HH:mm:ss'),
      endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
    };

    this.onPaginationNextPageChange = this.onPaginationNextPageChange.bind(this);
    this.fetchSegmentActivities = this.fetchSegmentActivities.bind(this);
  }

  componentDidMount() {
    const {demoMode} = this.props;
        
    if(!demoMode) {
      this.fetchSegmentActivities(this.props);
    } else {
    }
  }

  onPaginationNextPageChange() {
    const { limit, offset, activities } = this.state;

    this.setState({ offset: activities.length }, () => {
      this.fetchSegmentActivities();
    });
  }

  async fetchSegmentActivities() {
    const { customerAnalyticsActions, EventHandler, segmentId } = this.props;
    const { limit, startTime, offset, endTime, activities } = this.state;

    this.setState({ isLoading: true });

    try {
      const fetchSegmentActivitiesResult = await customerAnalyticsActions.fetchSegmentActivities(limit, offset, {startTime, endTime}, segmentId);    
      
      this.setState({ isLoading: false });

      fetchSegmentActivitiesResult.data.Data.forEach((item) => {

        const payload = JSON.parse(item.payload);
        let displayComponent = null;

        switch (item.eventType) {
          case 'SEGMENT_CREATED':
            break;
          case 'SEGMENT_UPDATED':
            //both segment and filters changed
            if(payload.details.oldSegmentName != payload.details.newSegmentName && payload.details.newFilters != payload.details.oldFilters) {
              displayComponent = (
                <div style={{ display: 'flex' }}>
                  <span style={{ fontSize: 12, fontWeight: 'bold', margin: '0 3px', display: 'flex', alignItems: 'center' }}>{`Segment name changed from ${payload.details.oldSegmentName} to ${payload.details.newSegmentName} and filters changed from`}</span>
                  {
                    JSON.parse(payload.details.oldFilters).map((filter) => (
                      <div className="rule-configuration" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fce8e6', padding: 15, margin: '5px 2px 5px 2px', borderRadius: 30, height: 30 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', flexWrap: 'wrap' }}>
                          <span style={{ color: '#d93024', fontSize: 12 }}>{getFilter(filter)}</span>
                        </div>
                      </div>
                    ))
                  }
                  <span style={{ fontSize: 12, fontWeight: 'bold', margin: '0 3px', display: 'flex', alignItems: 'center' }}>to</span>
                  {
                    JSON.parse(payload.details.newFilters).map((filter) => (
                      <div className="rule-configuration" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: lightPrimaryColor, padding: 15, margin: '5px 2px 5px 2px', borderRadius: 30, height: 30 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', flexWrap: 'wrap' }}>
                          <span style={{ color: primaryColor, fontSize: 12 }}>{getFilter(filter)}</span>
                        </div>
                    </div>  
                    ))
                  }               
                </div>
              );
            } else if(payload.details.oldSegmentName != payload.details.newSegmentName) { 
              // only segment name changed
              displayComponent = (
                <div style={{ display: 'flex' }}>
                  <span style={{ fontSize: 12, fontWeight: 'bold', margin: '0 3px', display: 'flex', alignItems: 'center' }}>{`Segment name changed from ${payload.details.oldSegmentName} to ${payload.details.newSegmentName}`}</span>           
                </div>
              );
            } else if(payload.details.newFilters && payload.details.newFilters != payload.details.oldFilters) {
              // only segment filters changed
              displayComponent = (
                <div style={{ display: 'flex' }}>
                  <span style={{ fontSize: 12, fontWeight: 'bold', margin: '0 3px', display: 'flex', alignItems: 'center' }}>Segment filters changed from </span>
                  {
                    JSON.parse(payload.details.oldFilters).map((filter) => (
                      <div className="rule-configuration" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fce8e6', padding: 15, margin: '5px 2px 5px 2px', borderRadius: 30, height: 30 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', flexWrap: 'wrap' }}>
                          <span style={{ color: '#d93024', fontSize: 12 }}>{getFilter(filter)}</span>
                        </div>
                      </div>
                    ))
                  }
                  <span style={{ fontSize: 12, fontWeight: 'bold', margin: '0 3px', display: 'flex', alignItems: 'center' }}>to</span>
                  {
                    JSON.parse(payload.details.newFilters).map((filter) => (
                      <div className="rule-configuration" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: lightPrimaryColor, padding: 15, margin: '5px 2px 5px 2px', borderRadius: 30, height: 30 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', flexWrap: 'wrap' }}>
                          <span style={{ color: primaryColor, fontSize: 12 }}>{getFilter(filter)}</span>
                        </div>
                    </div>  
                    ))
                  }               
                </div>
              );
            } else {
              displayComponent = (
                <span style={{ fontSize: 12, fontWeight: 'bold', margin: '0 3px', display: 'flex', alignItems: 'center' }}>{(typeof payload.details === 'object') ? payload.details.comment : payload.details}</span>
              );
            }
        
            activities.push({
              icon: 'edit',
              date: moment(item.createDate),
              user: `${item.user.firstName} ${item.user.lastName}`,
              displayComponent,
            });
            break;
          case 'SURVEY_SEND_OUT':
            break;
          case 'PARTICIPANT_DOWNLOADED':
            break
          default:
        }
      });

      this.setState({activities});
    } catch (exception) {
      EventHandler.handleException(exception);
      this.setState({ isLoading: false});
    } finally {
      this.setState({ isLoading: false});
    } 
  }

  render() {
    const { activities, isLoading } = this.state;

    return (
      <div style={{width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: '#ffffff', borderRadius: 2, marginBottom: 20, marginTop: 10, minHeight: 'calc(100% - 20px)' }}>
        <div style={{ borderLeft: 'solid 3px #d8d8d8', margin: '20px 0 20px 20px', width: 'calc(100% - 20)' }}>
          {
            activities.map((activity) => (
              <div
                className="activity-event"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', marginLeft: -20, backgroundColor: 'transparent', width: '100%', marginTop: 20,
                }}
              >
                <div
                  style={{
                    height: 40, width: 40, borderRadius: 20, boxShadow: 'rgba(67, 70, 86, 0.1) 1px 4px 5px 2px', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <i className="material-icons" style={{ color: '#d9d9d9', fontSize: 20 }}>{activity.icon}</i>
                </div>
                <div
                  style={{
                    display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', flex: 1,
                  }}
                >
                  <div
                    style={{
                      display: 'flex', flexDirection: 'column', padding: 10, justifyContent: 'center'
                    }}
                  >
                    <span style={{ color: '#808285', fontSize: 10 }}>{activity.date.format('H:mm A')}</span>
                    <span style={{ color: '#3d4553', fontSize: 10 }}>{activity.date.format('DD MMM YYYY')}</span>
                  </div>
                  <div
                    style={{
                      display: 'flex', flexDirection: 'column', padding: 10, boxShadow: 'rgb(232, 234, 237) 0px 0px 0px 2px', borderRadius: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      {
                        activity.displayComponent
                      }
                    </div>
                    <div>
                      <span style={{ color: '#808285', fontSize: 11 }}>
                      Done by: {activity.user}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          }
          <div style={{ flex: 1, flexDirection: 'row', display: 'flex', justifyContent: 'center' }}>
            <ActionButton text="Load More" loading={isLoading}  onClick={this.onPaginationNextPageChange} disabled={false} style={{ borderRadius: 15, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0px 20px', marginTop: 10, backgroundColor: primaryColor, color: '#fff' }} />
          </div>
        </div>
    </div>
    );
  }
}

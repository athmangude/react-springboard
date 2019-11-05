/* eslint-disable no-nested-ternary */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { Button } from 'semantic-ui-react';
import Spinner from 'react-spinner-material';
import styled from 'styled-components';

import IconButton from 'SharedComponents/icon-button';
import LogItem from './LogItem';

import * as activityLogsActions from './flux/actions';
import SideActivityLogPreloader from './components/SideActivityLogPreloader';
import styles from './SideBarActivityLogStyles';

const SideBarActivityLogWrapper = styled.div`${styles}`;

@connect(() => ({}), (dispatch) => ({
  activityLogsActions: bindActionCreators(activityLogsActions, dispatch),
  dispatch,
}))
export default class SideBarActivityLog extends Component {
  static propTypes = {
    EventHandler: PropTypes.object.isRequired,
    collaborators: PropTypes.array.isRequired,
    activityLogs: PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props);
    this.onFetchActivityLogs = this.onFetchActivityLogs.bind(this);
    this.onLoadMore = this.onLoadMore.bind(this);
  }

  state = {
    isFetchingActivityLogs: false,
    limit: 40,
  }

  componentDidMount() {
    this.onFetchActivityLogs();
  }

  async onFetchActivityLogs() {
    this.setState({ isFetchingActivityLogs: true });

    try {
      const onFetchActivityLogsResult = await this.props.activityLogsActions.fetchActivityLogs(this.state.limit, this.props.activityLogs.items.length, ['SURVEY_CREATED', 'SURVEY_DELETED', 'SURVEY_SENT', 'SURVEY_ACTIVATED', 'SURVEY_UPDATED', 'SURVEY_RESPONSE', 'SURVEY_NOTES', 'TICKET', 'SURVEY_COMMENTS', 'USER_CREATED', 'USER_UPDATED', 'PANEL_CREATED', 'SURVEY_DEACTIVATED', 'SURVEY_DUPLICATED', 'ADMIN_LOGIN', 'ACCOUNT_CREATED', 'REMINDER', 'SURVEY_SENDOUT', 'RE_INVITE', 'DATA_DOWNLOAD', 'AUDIENCE_UPLOAD']);
      const activityLogs = onFetchActivityLogsResult.data.Data.map((item) => {
        item.uiSortDate = moment(item.createDate); // eslint-disable-line no-param-reassign
        return item;
      });
      this.props.activityLogsActions.addActivityLogs(activityLogs);
    } catch (exception) {
      this.props.EventHandler.handleException(exception);
    } finally {
      this.setState({ isFetchingActivityLogs: false });
    }
  }

  onLoadMore() {
    this.onFetchActivityLogs();
  }

  render() {
    const activityLogsItems = this.props.activityLogs.items;

    const timeline = {};
    let currentUISortdate;

    if (activityLogsItems.length) {
      timeline[`${activityLogsItems[0].uiSortDate.format('YYYY-MM-DD')}`] = [];
      currentUISortdate = `${activityLogsItems[0].uiSortDate.format('YYYY-MM-DD')}`;
    }

    activityLogsItems.forEach((notification) => {
      if (Object.keys(timeline).includes(notification.uiSortDate.format('YYYY-MM-DD'))) {
        timeline[currentUISortdate].push(notification);
      } else {
        currentUISortdate = notification.uiSortDate.format('YYYY-MM-DD');
        timeline[currentUISortdate] = [];
        timeline[currentUISortdate].push(notification);
      }
    });

    return (
      <SideBarActivityLogWrapper>
        {
          this.state.isFetchingActivityLogs && !this.props.activityLogs.items.length ? (
            <SideActivityLogPreloader />
          ) : !this.props.activityLogs.items.length ? (
            <div
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 10, flexDirection: 'column', marginTop: 20,
              }}
            >
              <span style={{ textAlign: 'center' }}>
We could not find any activity logs in your account.
                <br />
Please try again
              </span>
              <div
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px 0', padding: '10px 0',
                }}
              >
                <Button
                  onClick={this.onFetchActivityLogs}
                  disabled={false}
                  className="mwamba-primary-button"
                  style={{
                    borderRadius: 15, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0px 20px', marginTop: 10,
                  }}
                >
                  <span>Try Again</span>
                </Button>
              </div>
            </div>
          ) : (
            <div style={{ width: '100%' }}>
              {
                Object.keys(timeline).sort((a, b) => moment(b) - moment(a)).map((date) => (
                  <div
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column',
                    }}
                    key={date}
                  >
                    <div
                      style={{
                        width: '100%', padding: 10, backgroundColor: '#ececec', position: 'sticky', top: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      }}
                    >
                      <span>{moment(date).format('MMM. Do, YYYY')}</span>
                      {
                        this.props.windowDimensions.width <= 1024 ? (
                          <div
                            style={{
                              width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}
                          >
                            <IconButton icon="chevron_right" style={{ margin: 0, padding: 0, color: '#000' }} onClick={this.props.onToggleRightDrawer} />
                          </div>
                        ) : null
                      }
                    </div>
                    <div
                      key={date}
                      style={{
                        backgroundColor: '#fff', margin: 0, borderRadius: 0, border: 'none', width: '100%',
                      }}
                    >
                      {
                        timeline[date].sort((a, b) => b.uiSortDate - a.uiSortDate).map((notification) => (
                          <LogItem item={notification} key={notification.id} />
                        ))
                      }
                    </div>
                  </div>
                ))
              }
            </div>
          )
        }
        {
          this.props.activityLogs.items.length ? (
            <div
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 0, height: 40,
              }}
            >
              {
                !this.props.activityLogs.items.length ? null : !this.state.isFetchingActivityLogs ? ( // eslint-disable-line no-nested-ternary
                  <Button
                    onClick={this.onLoadMore}
                    disabled={false}
                    className="mwamba-primary-button"
                    style={{
                      borderRadius: 0, height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0px 20px', margin: 0,
                    }}
                  >
                    <span>Load More</span>
                  </Button>
                ) : (
                  <div style={{ margin: '5px 0' }}>
                    <Spinner spinnerColor="#487db3" size={30} spinnerWidth={3} />
                  </div>
                )
              }
            </div>
          ) : null
        }
      </SideBarActivityLogWrapper>
    );
  }
}

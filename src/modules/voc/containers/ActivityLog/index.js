/* eslint-disable jsx-a11y/href-no-hash, no-nested-ternary, no-shadow, object-curly-newline */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container } from 'react-grid-system';
import moment from 'moment';
import { Button } from 'semantic-ui-react';
import Spinner from 'react-spinner-material';
import { extractInitials, stringToHexColor } from 'Utils/UtilFunctions';

// import TopBarLayout from 'Layouts/top-bar';
import SimpleLayoutExtended from 'Layouts/simple-layout-extended';
import ActivityLogPreloader from './components/ActivityLogPreloader';
import withAuthentication from 'Utils/withAuthentication';
import * as activityLogsActions from './flux/actions';

@connect((state) => ({
  collaborators: state.collaborators,
  activityLogs: state.activityLogs,
}),
(dispatch) => ({
  activityLogsActions: bindActionCreators(activityLogsActions, dispatch),
  dispatch,
}))
class ActivityLog extends Component {
  static propTypes = {
    activityLogs: PropTypes.object.isRequired,
    collaborators: PropTypes.array.isRequired,
    EventHandler: PropTypes.object.isRequired,
    activityLogsActions: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.fetchActivityLogs = this.fetchActivityLogs.bind(this);
    this.onLoadMore = this.onLoadMore.bind(this);
  }

  state = {
    isFetchingActivityLogs: false,
    limit: 20,
    offset: 0,
  }

  componentDidMount() {
    this.fetchActivityLogs();
  }

  onLoadMore() {
    const { offset, limit } = this.state;
    this.setState({ offset: offset + limit }, () => {
      this.fetchActivityLogs();
    });
  }

  async fetchActivityLogs() {
    const { activityLogsActions, EventHandler } = this.props;
    const { limit, offset } = this.state;
    this.setState({ isFetchingActivityLogs: true });

    try {
      const fetchActivityLogsResult = await activityLogsActions.fetchActivityLogs(limit, offset, ['SURVEY_CREATED', 'SURVEY_DELETED', 'SURVEY_SENT', 'SURVEY_ACTIVATED', 'SURVEY_UPDATED', 'SURVEY_RESPONSE', 'SURVEY_NOTES', 'TICKET', 'SURVEY_COMMENTS', 'USER_CREATED', 'USER_UPDATED', 'PANEL_CREATED', 'SURVEY_DEACTIVATED', 'SURVEY_DUPLICATED', 'ADMIN_LOGIN', 'ACCOUNT_CREATED', 'REMINDER', 'SURVEY_SENDOUT', 'RE_INVITE', 'DATA_DOWNLOAD', 'AUDIENCE_UPLOAD']);
      const activityLogs = fetchActivityLogsResult.data.Data.map((item) => {
        item.uiSortDate = moment(item.createDate); // eslint-disable-line no-param-reassign
        return item;
      });
      activityLogsActions.addActivityLogs(activityLogs);
    } catch (exception) {
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isFetchingActivityLogs: false });
    }
  }

  render() {
    const { activityLogs, collaborators } = this.props;
    const activityLogsItems = activityLogs.items;

    const { isFetchingActivityLogs } = this.state;

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
      <SimpleLayoutExtended>
        <Container>
          <div style={{ display: 'flex', width: '100%', flexDirection: 'column' }}>
            <div
              style={{
                width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0', flexWrap: 'wrap',
              }}
            >
              <div
                style={{
                  padding: '10px 0', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', height: '100%',
                }}
              >
                <h4 style={{ margin: 0 }}>ACTIVITY LOG</h4>
              </div>
            </div>
          </div>
          {
            isFetchingActivityLogs && !activityLogs.items.length ? (
              <ActivityLogPreloader />
            ) : !activityLogs.items.length ? (
              <div
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', border: 'solid 2px #d9d9d9', borderRadius: 8, padding: 10, flexDirection: 'column',
                }}
              >
                <h1>¯\_(ツ)_/¯</h1>
                <span style={{ textAlign: 'center' }}>
We could not find any activity logs in your account.
                  <br />
Please try again later
                </span>
                <div
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px 0', padding: '10px 0',
                  }}
                >
                  <Button
                    onClick={this.fetchActivityLogs}
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
              <div
                style={{
                  width: '100%', borderLeft: 'solid 5px #d9d9d9', position: 'relative', left: 120,
                }}
              >
                {
                  Object.keys(timeline).sort((a, b) => moment(b) - moment(a)).map((date) => (
                    <div
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 'auto', position: 'relative', left: -117,
                      }}
                    >
                      <div
                        style={{
                          width: 120, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', color: '#808285', fontSize: 12,
                        }}
                      >
                        {moment(date).format('MMM. Do, YYYY')}
                      </div>
                      <div
                        style={{
                          width: 50, height: '100%', minHeight: 50, display: 'flex', alignItems: 'center', justifyContent: 'flex-start',
                        }}
                      >
                        <div
                          style={{
                            width: 14, height: 14, borderRadius: 7, border: 'solid 3px #4a4f57', backgroundColor: '#fafafa', position: 'relative', left: -9,
                          }}
                        />
                      </div>
                      <div
                        key={date}
                        style={{
                          backgroundColor: '#fff', margin: '10px 10px', borderRadius: 8, border: 'solid 1px #d9d9d9', width: 'calc(100% - 170px)',
                        }}
                      >
                        {
                          timeline[date].sort((a, b) => b.uiSortDate - a.uiSortDate).map((notification, i) => {
                            const actor = collaborators.find((collaborator) => notification.userId === collaborator.id);
                            const initials = extractInitials(actor ? `${actor.firstName} ${actor.lastName}` : 'Account Collaborator');
                            const colorMix = stringToHexColor(actor ? `${actor.firstName} ${actor.lastName}` : 'Account Collaborator');

                            return (
                              <div key={notification.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', borderBottom: (i + 1 === timeline[date].length) ? 'none' : 'solid 1px #d9d9d9', padding: 10 }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: 'calc(100% - 60px)' }}>
                                  <div style={{ textTransform: 'uppercase', backgroundColor: colorMix.backgroundColor, height: 30, width: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 12, margin: '0 10px 0 0', color: colorMix.color }}>{initials}</div>
                                  <span style={{ fontSize: 11, color: '#808285', fontWeight: 'bold', width: 'calc(100% - 40px)' }}>
                                    <b style={{ fontSize: 11, color: '#3d4553', textTransform: 'capitalize' }}>{actor ? `${actor.firstName} ${actor.lastName}` : 'Account Collaborator'}</b>
                                    &nbsp;–&nbsp;
                                    {JSON.parse(notification.payload).details || `${notification.eventType.toLowerCase().split('_').map((word) => word.replace(word[0], word[0].toUpperCase())).join(' ')} ${JSON.parse(notification.payload).fileName}`}
                                  </span>
                                </div>
                                <div
                                  style={{
                                    width: 60, justifyContent: 'flex-end', alignItems: 'flex-start', alignSelf: 'flex-start', textAlign: 'right',
                                  }}
                                >
                                  <span style={{ fontSize: 10, color: '#c4c4c4' }}>{notification.uiSortDate.format('hh:mm a')}</span>
                                </div>
                              </div>
                            );
                          })
                        }
                      </div>
                    </div>
                  ))
                }
              </div>
            )
          }
          <div
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px 0', padding: '10px 0', paddingLeft: 150,
            }}
          >
            {
              !activityLogs.items.length ? null : !isFetchingActivityLogs ? ( // eslint-disable-line no-nested-ternary
                <Button
                  onClick={this.onLoadMore}
                  disabled={false}
                  className="mwamba-primary-button"
                  style={{
                    borderRadius: 15, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0px 20px', marginTop: 10,
                  }}
                >
                  <span>Load More</span>
                </Button>
              ) : (
                <div style={{ marginTop: 10 }}>
                  <Spinner spinnerColor="#4a4f57" size={30} spinnerWidth={3} />
                </div>
              )
            }
          </div>
        </Container>
      </SimpleLayoutExtended>
    );
  }
}

export default withAuthentication(ActivityLog);

import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import moment from 'moment';
import Switch from 'react-switch';
import numeral from 'numeral';

import { extractInitials, stringToHexColor } from 'Utils/UtilFunctions';

import themes from 'SharedComponents/themes';

const { primaryColor, lightPrimaryColor } = themes.light;

import styles from './LogItem.css';

const LogItemWrapper = styled.div`${styles}`;

const LogItem = ({ item }) => {
  const { user } = item;
  const initials = extractInitials(`${user.firstName} ${user.lastName}`);
  const colorMix = stringToHexColor(`${user.firstName} ${user.lastName}`);

  let action = null;
  let description = null;
  let displayComponent = null;

  const payload = JSON.parse(item.payload);

  switch (item.eventType) {
    case 'USER_LOGIN':
      action = 'Logged In';
      break;
    case 'SURVEY_UPDATED':
      action = 'Updated Survey';
      description = (typeof payload.details === 'object') ? payload.details.comment : payload.details;
    case 'DELAYED_SURVEY_SENDOUT':
      action = 'Delayed survey sendout';
      description = 'Sending of a survey was delayed';
    case 'RE_INVITE':
      action = 'Re-invite sent';
      description = 'A survey reinvite was sent';
    // case 'SEGMENT_UPDATED':
      // action = "Segment Updated";
      // description = payload.details.comment;
    case 'SURVEY_SENDOUT':
      action = 'Sent a survey';
      description = typeof payload.details === 'string' ? payload.details : `${payload.details && payload.details.surveyName ? payload.details.surveyName : 'A survey'} was sent to audience`;
      if (typeof payload.details === 'object') {
        displayComponent = (
          <div className="info-container list">
            {
              Object.keys(payload.details).filter((aKey) => aKey !== 'comment' && aKey !== 'panelId' && aKey !== 'surveyName').map((key) => {
                let label = key;
                let value = payload.details[key];
                if (key === 'activePendingParticipantsCount') {
                  label = 'already active participants';
                  value = numeral(value).format('0,0');
                }

                if (key === 'retakeCount') {
                  label = 'retaken';
                  value = numeral(value).format('0,0');
                }

                if (key === 'sentCount') {
                  label = 'received';
                  value = numeral(value).format('0,0');
                }

                if (key === 'target') {
                  label = 'target';
                  value = numeral(value).format('0,0');
                }

                return (
                  <div className="list-item apart">
                    <span className="label">{label}</span>
                    <span className="value">{value}</span>
                  </div>
                )
              })
            }
          </div>
        )
      }
      break;
    case 'DAILY_PASSIVE':
      action = 'Passive Report Sent';
      description = 'Daily passives report has been sent to:';
      displayComponent = (
        <div className="info-container list">
          {
            payload.to.split(',').map((email) => (
              <div className="list-item">
                <i className="material-icons">email</i>
                <span className="email">{email}</span>
              </div>
            ))
          }
        </div>
      );
      break;
    case 'DAILY_DETRACTOR':
      action = 'Detractor Report Sent';
      description = 'Daily passives report has been sent to:';
      displayComponent = (
        <div className="info-container list">
          {
            payload.to.split(',').map((email) => (
              <div className="list-item">
                <i className="material-icons">email</i>
                <span className="email">{email}</span>
              </div>
            ))
          }
        </div>
      );
      break;
    case 'DATA_DOWNLOAD':
      action = 'Downloaded Data';
      description = 'Data was downloaded data using the following filters';
      displayComponent = (
        <div className="info-container list filters">
          {
            payload.npsFilters && payload.npsFilters.length ? (
              <div className="list-group">
                <span className="list-title">NPS Filters</span>
                {
                  payload.npsFilters.map((filter) => {
                    if ('promoters' in filter) {
                      return { label: 'Promoters', value: true, isBoolean: true };
                    }

                    if ('passives' in filter) {
                      return { label: 'Passives', value: true, isBoolean: true };
                    }

                    if ('detractors' in filter) {
                      return { label: 'Detractors', value: true, isBoolean: true };
                    }
                  }).map((aFilter) => (
                    <div className="list-item">
                      <span>{aFilter.label}</span>
                      {
                        aFilter.isBoolean ? (
                          <Switch
                            disabled
                            checked={aFilter.value}
                            onColor={lightPrimaryColor}
                            onHandleColor={primaryColor}
                            handleDiameter={15}
                            uncheckedIcon={false}
                            checkedIcon={false}
                            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                            activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                            height={10}
                            width={24}
                            className="react-switch"
                            id="material-switch"
                          />
                        ) : (
                          <span>{aFilter.value}</span>
                        )
                      }
                    </div>
                  ))
                }
              </div>
            ) : null
          }
          <div className="list-group">
            <span className="list-title">Survey Filters</span>
            {
              payload.filters && payload.filters.length ? (
                payload.filters.map(((filter) => {
                  if ('status' in filter) {
                    return { label: filter.status.toLowerCase(), value: true, isBoolean: true };
                  }

                  if ('startdate' in filter) {
                    return { label: 'From', value: moment(filter.startDate).format('Do MMM, YYYY') };
                  }

                  if ('enddate' in filter) {
                    return { label: 'To', value: moment(filter.endDate).format('Do MMM, YYYY') };
                  }

                  return filter;
                })).map((aFilter) => (
                  <div className="list-item">
                    <span>{aFilter.label}</span>
                    {
                      aFilter.isBoolean ? (
                        <Switch
                          disabled
                          checked={aFilter.value}
                          onColor={lightPrimaryColor}
                          onHandleColor={primaryColor}
                          handleDiameter={15}
                          uncheckedIcon={false}
                          checkedIcon={false}
                          boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                          activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                          height={10}
                          width={24}
                          className="react-switch"
                          id="material-switch"
                        />
                      ) : (
                        <span>{aFilter.value}</span>
                      )
                    }
                  </div>
                ))
              ) : null
            }
          </div>
        </div>
      );
      break;
    default:
      description = (typeof payload.details === 'string') ? payload.details : (typeof payload.details === 'object') ? payload.details.comment : 'Undescribed event';
  }

  return (
    <LogItemWrapper key={item.id} colorMix={colorMix}>
      <div className="header">
        <div className="avatar">{initials}</div>
        <span className="name">
          <b>{`${user.firstName} ${user.lastName}`}</b>
          {
            action && (
              <span>{` – ${action}`}</span>
            )
          }
          {
            // JSON.parse(item.payload).details || `${item.eventType.toLowerCase().split('_').map((word) => word.replace(word[0], word[0].toUpperCase())).join(' ')} ${JSON.parse(item.payload).fileName}`
          }
        </span>
      </div>
      {
        description && (
          <div className="body">
            <span>{description}</span>
            {displayComponent}
          </div>
        )
      }
      <span className="footer">
        {item.uiSortDate.format('hh:mm a')}
      </span>
    </LogItemWrapper>
  );
};

LogItem.propTypes = {
  item: PropTypes.object.isRequired,
};

export default LogItem;

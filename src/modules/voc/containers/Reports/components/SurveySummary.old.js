/* eslint-disable no-mixed-operators */

import React from 'react';
import PropTypes from 'prop-types';
import { Col } from 'react-grid-system';
import numeral from 'numeral';
import { Popup } from 'semantic-ui-react';

const SurveySummary = (props) => {
  let survey;

  if (Object.keys(props.aodReport).includes(props.surveyId)) {
    survey = props.aodReport[props.surveyId];
  }

  if (props.isFetchingData || !survey) {
    return null;
  }

  return (
    <Col xl={12} lg={12} md={12} sm={12} xs={12}>
      {        
        props.width > 600 ? (
          <div style={{ width: '100%', height: 100, borderRadius: 8, backgroundColor: '#fff', margin: '0px 0px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', boxShadow: '0 8px 20px 0 rgba(67, 70, 86, 0.1)' }}>
            <div style={{ borderRight: 'solid 1px #d9d9d9', height: '100%', display: 'flex', flexDirection: 'column', flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 10 }}>
              <div style={{ margin: '0px 0px 10px' }}>
                <span style={{ color: '#6d6e71', fontSize: 12 }}>Total Participants</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                <i className="material-icons" style={{ fontSize: 30, color: '#d9d9d9' }}>people_outline</i>
                <span style={{ fontSize: 40, color: '#6d6e71' }}>{survey.contacted > 1000 ? numeral(survey.contacted).format('0.0 a') : numeral(survey.contacted).format('0 a')}</span>
              </div>
            </div>
            <div style={{ borderRight: 'solid 1px #d9d9d9', height: '100%', display: 'flex', flexDirection: 'column', flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 10 }}>
              <div style={{ margin: '0px 0px 10px' }}>
                <span style={{ color: '#6d6e71', fontSize: 12 }}>Responded</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                <i className="material-icons" style={{ fontSize: 40, color: '#d9d9d9' }}>call_received</i>
                <span style={{ fontSize: 40, color: '#6d6e71' }}>{survey.responded > 1000 ? numeral(survey.responded).format('0.0 a') : numeral(survey.responded).format('0 a')}</span>
                <Popup
                  trigger={<span style={{ backgroundColor: '#487db3', padding: '3px 8px', margin: '0px 10px', color: '#fff', borderRadius: 3 }}>{survey.responded === 0 ? '0' : (survey.responded / survey.contacted * 100).toFixed(1)}%</span>}
                  content={<span>Total responded / Total contacted</span>}
                  basic
                  inverted
                  hoverable
                  style={{ padding: '2px 5px', backgroundColor: '#58595b' }}
                />
              </div>
            </div>
            <div style={{ borderRight: 'solid 1px #d9d9d9', height: '100%', display: 'flex', flexDirection: 'column', flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 10 }}>
              <div style={{ margin: '0px 0px 10px' }}>
                <span style={{ color: '#6d6e71', fontSize: 12 }}>Completed</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                <i className="material-icons" style={{ fontSize: 40, color: '#d9d9d9' }}>chat_bubble_outline</i>
                <span style={{ fontSize: 40, color: '#6d6e71' }}>{survey.finished > 1000 ? numeral(survey.finished).format('0.0 a') : numeral(survey.finished).format('0 a')}</span>
                <Popup
                  trigger={<span style={{ backgroundColor: '#487db3', padding: '3px 8px', margin: '0px 10px', color: '#fff', borderRadius: 3 }}>{survey.finished === 0 ? '0' : (survey.finished / survey.responded * 100).toFixed(1)}%</span>}
                  content={<span>Total completed / Total responded</span>}
                  basic
                  inverted
                  hoverable
                  style={{ padding: '2px 5px', backgroundColor: '#58595b' }}
                />
              </div>
            </div>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 10 }}>
              <div style={{ margin: '0px 0px 10px' }}>
                <span style={{ color: '#6d6e71', fontSize: 12 }}>In Progress</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                <i className="material-icons" style={{ fontSize: 40, color: '#d9d9d9' }}>timelapse</i>
                <span style={{ fontSize: 40, color: '#6d6e71' }}>{survey.activeInSurvey > 1000 ? numeral(survey.activeInSurvey).format('0.0 a') : numeral(survey.activeInSurvey).format('0 a')}</span>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ width: '100%', minHeight: 100, borderRadius: 8, backgroundColor: '#fff', margin: '0px 0px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'column', boxShadow: '0 8px 20px 0 rgba(67, 70, 86, 0.1)' }}>
            <div style={{ borderBottom: 'solid 1px #d9d9d9', width: '100%', height: 100, display: 'flex', flexDirection: 'column', flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 10 }}>
              <div style={{ margin: '0px 0px 10px' }}>
                <span style={{ color: '#6d6e71', fontSize: 12 }}>Total Participants</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                <i className="material-icons" style={{ fontSize: 30, color: '#d9d9d9' }}>people_outline</i>
                <span style={{ fontSize: 40, color: '#6d6e71' }}>{survey.contacted > 1000 ? numeral(survey.contacted).format('0.0 a') : numeral(survey.contacted).format('0 a')}</span>
              </div>
            </div>
            <div style={{ borderBottom: 'solid 1px #d9d9d9', width: '100%', height: 100, display: 'flex', flexDirection: 'column', flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 10 }}>
              <div style={{ margin: '0px 0px 10px' }}>
                <span style={{ color: '#6d6e71', fontSize: 12 }}>Responded</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                <i className="material-icons" style={{ fontSize: 40, color: '#d9d9d9' }}>call_received</i>
                <span style={{ fontSize: 40, color: '#6d6e71' }}>{survey.responded > 1000 ? numeral(survey.responded).format('0.0 a') : numeral(survey.responded).format('0 a')}</span>
                <Popup
                  trigger={<span style={{ backgroundColor: '#487db3', padding: '3px 8px', margin: '0px 10px', color: '#fff', borderRadius: 3 }}>{survey.responded === 0 ? '0' : (survey.responded / survey.contacted * 100).toFixed(1)}%</span>}
                  content={<span>Total responded / Total contacted</span>}
                  basic
                  inverted
                  hoverable
                  style={{ padding: '2px 5px', backgroundColor: '#58595b' }}
                />
              </div>
            </div>
            <div style={{ borderBottom: 'solid 1px #d9d9d9', width: '100%', height: 100, display: 'flex', flexDirection: 'column', flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 10 }}>
              <div style={{ margin: '0px 0px 10px' }}>
                <span style={{ color: '#6d6e71', fontSize: 12 }}>Completed</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                <i className="material-icons" style={{ fontSize: 40, color: '#d9d9d9' }}>chat_bubble_outline</i>
                <span style={{ fontSize: 40, color: '#6d6e71' }}>{survey.finished ? numeral(survey.finished).format('0.0 a') : numeral(survey.finished).format('0 a')}</span>
                <Popup
                  trigger={<span style={{ backgroundColor: '#487db3', padding: '3px 8px', margin: '0px 10px', color: '#fff', borderRadius: 3 }}>{survey.finished === 0 ? '0' : (survey.finished / survey.responded * 100).toFixed(1)}%</span>}
                  content={<span>Total completed / Total responded</span>}
                  basic
                  inverted
                  hoverable
                  style={{ padding: '2px 5px', backgroundColor: '#58595b' }}
                />
              </div>
            </div>
            <div style={{ height: 100, width: '100%', display: 'flex', flexDirection: 'column', flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 10 }}>
              <div style={{ margin: '0px 0px 10px' }}>
                <span style={{ color: '#6d6e71', fontSize: 12 }}>In Progress</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                <i className="material-icons" style={{ fontSize: 40, color: '#d9d9d9' }}>timelapse</i>
                <span style={{ fontSize: 40, color: '#6d6e71' }}>{survey.activeInSurvey > 1000 ? numeral(survey.activeInSurvey).format('0.0 a') : numeral(survey.activeInSurvey).format('0 a')}</span>
              </div>
            </div>
          </div>
        )
      }
    </Col>
  );
};

export default SurveySummary;

SurveySummary.propTypes = {
  surveyId: PropTypes.string.isRequired,
  isFetchingData: PropTypes.bool.isRequired,
  aodReport: PropTypes.object.isRequired,
  width: PropTypes.number,
};

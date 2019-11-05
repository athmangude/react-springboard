/* eslint-disable jsx-a11y/href-no-hash, no-mixed-operators, object-curly-newline, no-nested-ternary */
import React from 'react';
import { Row, Col } from 'react-grid-system';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import ReactPlaceholder from 'react-placeholder';
import { RectShape } from 'react-placeholder/lib/placeholders';

/**
 *
durationEnd: null
durationStart: null
finished: 2
kickedOut: 0
pending: 0
responded: 2
 */
const SurveySummary = ({ surveyResults, isFetchingData, width }) => {
  if (isFetchingData || !surveyResults) {
    return (
      <div style={{ width: '100%' }}>
        <Row style={{ width: '100%', margin: 0, padding: 0 }}>
          <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ padding: '0 10px 0 10px', borderRadius: 8 }}>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginBottom: 20, marginTop: 10 }}>
              <div style={{ width: '100%', padding: '15px 0 0 0' }}>
                <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}><RectShape color="#d9d9d9" style={{ width: 200, height: 25 }} /></div>} />
                <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%' }}><RectShape color="#d9d9d9" style={{ width: '100%', height: 25 }} /></div>} />
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  }

  return (
    <Row style={{ width: '100%', margin: 0, padding: 0 }}>
      {
        width > 768 ? (
          <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ padding: '0 10px 0 10px', borderRadius: 8 }}>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgb(74, 79, 87)', color: '#ffffff', padding: 10, borderRadius: 8, marginBottom: 20, marginTop: 10 }}>
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid #ffffff', padding: 10 }}>
                <div style={{ fontSize: 24 }}>{surveyResults.contacted > 999 ? numeral(surveyResults.contacted).format('0.0 a') : surveyResults.contacted}</div>
                <div style={{ textTransform: 'uppercase', fontWeight: 400, fontSize: 12, textAlign: 'center' }}>Total</div>
              </div>
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid #ffffff', padding: 10 }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                  <div style={{ fontSize: 24 }}>{surveyResults.responded > 999 ? numeral(surveyResults.responded).format('0.0 a') : surveyResults.responded}</div>
                  <span style={{ backgroundColor: '#ffffff', padding: '0 4px', margin: '0px 10px', color: 'rgb(74, 79, 87)', borderRadius: 4, fontSize: 12 }}>
                    {!surveyResults.responded || !surveyResults.contacted ? 0 : (surveyResults.responded / surveyResults.contacted * 100).toFixed(1)}
                    %
                  </span>
                </div>
                <div style={{ textTransform: 'uppercase', fontWeight: 400, fontSize: 12, textAlign: 'center' }}>Responded</div>
              </div>
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid #ffffff', padding: 10 }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                  <div style={{ fontSize: 24 }}>{surveyResults.optout > 999 ? numeral(surveyResults.optout).format('0.0 a') : surveyResults.optout}</div>
                  <span style={{ backgroundColor: '#ffffff', padding: '0 4px', margin: '0px 10px', color: 'rgb(74, 79, 87)', borderRadius: 4, fontSize: 12 }}>
                    {!surveyResults.optout || !surveyResults.contacted ? 0 : (surveyResults.optout / surveyResults.contacted * 100).toFixed(1)}
                    %
                  </span>
                </div>
                <div style={{ textTransform: 'uppercase', fontWeight: 400, fontSize: 12, textAlign: 'center' }}>Opted Out</div>
              </div>
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid #ffffff', padding: 10 }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                  <div style={{ fontSize: 24 }}>{surveyResults.pending > 999 ? numeral(surveyResults.pending).format('0.0 a') : surveyResults.pending}</div>
                  <span style={{ backgroundColor: '#ffffff', padding: '0 4px', margin: '0px 10px', color: 'rgb(74, 79, 87)', borderRadius: 4, fontSize: 12 }}>
                    {!surveyResults.pending || !surveyResults.contacted ? 0 : (surveyResults.pending / surveyResults.contacted * 100).toFixed(1)}
                    %
                  </span>
                </div>
                <div style={{ textTransform: 'uppercase', fontWeight: 400, fontSize: 12, textAlign: 'center' }}>Pending</div>
              </div>
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid #ffffff', padding: 10 }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                  <div style={{ fontSize: 24 }}>{surveyResults.finished > 999 ? numeral(surveyResults.finished).format('0.0 a') : surveyResults.finished}</div>
                  <span style={{ backgroundColor: '#ffffff', padding: '0 4px', margin: '0px 10px', color: 'rgb(74, 79, 87)', borderRadius: 4, fontSize: 12 }}>
                    {!surveyResults.finished || !surveyResults.responded ? 0 : (surveyResults.finished / surveyResults.responded * 100).toFixed(1)}
                    %
                  </span>
                </div>
                <div style={{ textTransform: 'uppercase', fontWeight: 400, fontSize: 12, textAlign: 'center' }}>Completed</div>
              </div>
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 10 }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                  <div style={{ fontSize: 24 }}>{surveyResults.activeInSurvey > 999 ? numeral(surveyResults.activeInSurvey).format('0.0 a') : surveyResults.activeInSurvey}</div>
                  <span style={{ backgroundColor: '#ffffff', padding: '0 4px', margin: '0px 10px', color: 'rgb(74, 79, 87)', borderRadius: 4, fontSize: 12 }}>
                    {surveyResults.activeInSurvey || !surveyResults.responded ? '0' : (surveyResults.activeInSurvey / surveyResults.responded * 100).toFixed(1)}
                    %
                  </span>
                </div>
                <div style={{ textTransform: 'uppercase', fontWeight: 400, fontSize: 12, textAlign: 'center' }}>In Progress</div>
              </div>
            </div>
          </Col>
        ) : width > 425 ? (
          <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ padding: '0 10px 0 10px', borderRadius: 8 }}>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgb(74, 79, 87)', color: '#ffffff', padding: 10, borderRadius: 8, marginBottom: 20, marginTop: 10 }}>
              <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid #ffffff' }}>
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid #ffffff', padding: 10 }}>
                  <div style={{ fontSize: 24 }}>{surveyResults.contacted > 999 ? numeral(surveyResults.contacted).format('0.0 a') : surveyResults.contacted}</div>
                  <div style={{ textTransform: 'uppercase', fontWeight: 400, fontSize: 12, textAlign: 'center' }}>Total</div>
                </div>
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid #ffffff', padding: 10 }}>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                    <div style={{ fontSize: 24 }}>{surveyResults.responded > 999 ? numeral(surveyResults.responded).format('0.0 a') : surveyResults.responded}</div>
                    <span style={{ backgroundColor: '#ffffff', padding: '0 4px', margin: '0px 10px', color: 'rgb(74, 79, 87)', borderRadius: 4, fontSize: 12 }}>
                      {!surveyResults.responded || !surveyResults.contacted ? 0 : (surveyResults.responded / surveyResults.contacted * 100).toFixed(1)}
                      %
                    </span>
                  </div>
                  <div style={{ textTransform: 'uppercase', fontWeight: 400, fontSize: 12, textAlign: 'center' }}>Responded</div>
                </div>
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 10 }}>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                    <div style={{ fontSize: 24 }}>{surveyResults.optout > 999 ? numeral(surveyResults.optout).format('0.0 a') : surveyResults.optout}</div>
                    <span style={{ backgroundColor: '#ffffff', padding: '0 4px', margin: '0px 10px', color: 'rgb(74, 79, 87)', borderRadius: 4, fontSize: 12 }}>
                      {!surveyResults.optout || !surveyResults.contacted ? 0 : (surveyResults.optout / surveyResults.contacted * 100).toFixed(1)}
                      %
                    </span>
                  </div>
                  <div style={{ textTransform: 'uppercase', fontWeight: 400, fontSize: 12, textAlign: 'center' }}>Opted Out</div>
                </div>
              </div>
              <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid #ffffff', padding: 10 }}>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                    <div style={{ fontSize: 24 }}>{surveyResults.pending > 999 ? numeral(surveyResults.pending).format('0.0 a') : surveyResults.pending}</div>
                    <span style={{ backgroundColor: '#ffffff', padding: '0 4px', margin: '0px 10px', color: 'rgb(74, 79, 87)', borderRadius: 4, fontSize: 12 }}>
                      {!surveyResults.pending || !surveyResults.contacted ? 0 : (surveyResults.pending / surveyResults.contacted * 100).toFixed(1)}
                      %
                    </span>
                  </div>
                  <div style={{ textTransform: 'uppercase', fontWeight: 400, fontSize: 12, textAlign: 'center' }}>Pending</div>
                </div>
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid #ffffff', padding: 10 }}>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                    <div style={{ fontSize: 24 }}>{surveyResults.finished > 999 ? numeral(surveyResults.finished).format('0.0 a') : surveyResults.finished}</div>
                    <span style={{ backgroundColor: '#ffffff', padding: '0 4px', margin: '0px 10px', color: 'rgb(74, 79, 87)', borderRadius: 4, fontSize: 12 }}>
                      {!surveyResults.finished || !surveyResults.responded ? 0 : (surveyResults.finished / surveyResults.responded * 100).toFixed(1)}
                      %
                    </span>
                  </div>
                  <div style={{ textTransform: 'uppercase', fontWeight: 400, fontSize: 12, textAlign: 'center' }}>Completed</div>
                </div>
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 10 }}>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                    <div style={{ fontSize: 24 }}>{surveyResults.activeInSurvey > 999 ? numeral(surveyResults.activeInSurvey).format('0.0 a') : surveyResults.activeInSurvey}</div>
                    <span style={{ backgroundColor: '#ffffff', padding: '0 4px', margin: '0px 10px', color: 'rgb(74, 79, 87)', borderRadius: 4, fontSize: 12 }}>
                      {surveyResults.activeInSurvey || !surveyResults.responded ? '0' : (surveyResults.activeInSurvey / surveyResults.responded * 100).toFixed(1)}
                      %
                    </span>
                  </div>
                  <div style={{ textTransform: 'uppercase', fontWeight: 400, fontSize: 12, textAlign: 'center' }}>In Progress</div>
                </div>
              </div>
            </div>
          </Col>
        ) : (
          <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ padding: '0 10px 0 10px', borderRadius: 8 }}>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgb(74, 79, 87)', color: '#ffffff', padding: 10, borderRadius: 8, marginBottom: 20, marginTop: 10 }}>
              <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #ffffff', padding: 10 }}>
                <div style={{ fontSize: 24 }}>{surveyResults.contacted > 999 ? numeral(surveyResults.contacted).format('0.0 a') : surveyResults.contacted}</div>
                <div style={{ textTransform: 'uppercase', fontWeight: 400, fontSize: 12, textAlign: 'center' }}>Total</div>
              </div>
              <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #ffffff', padding: 10 }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
                  <div style={{ fontSize: 24 }}>{surveyResults.responded > 999 ? numeral(surveyResults.responded).format('0.0 a') : surveyResults.responded}</div>
                  <span style={{ backgroundColor: '#ffffff', padding: '0 4px', margin: '0px 10px', color: 'rgb(74, 79, 87)', borderRadius: 4, fontSize: 12 }}>
                    {!surveyResults.responded || !surveyResults.contacted ? 0 : (surveyResults.responded / surveyResults.contacted * 100).toFixed(1)}
                    %
                  </span>
                </div>
                <div style={{ textTransform: 'uppercase', fontWeight: 400, fontSize: 12, textAlign: 'right', width: '100%' }}>Responded</div>
              </div>
              <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #ffffff', padding: 10 }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
                  <div style={{ fontSize: 24 }}>{surveyResults.optout > 999 ? numeral(surveyResults.optout).format('0.0 a') : surveyResults.optout}</div>
                  <span style={{ backgroundColor: '#ffffff', padding: '0 4px', margin: '0px 10px', color: 'rgb(74, 79, 87)', borderRadius: 4, fontSize: 12 }}>
                    {!surveyResults.optout || !surveyResults.contacted ? 0 : (surveyResults.optout / surveyResults.contacted * 100).toFixed(1)}
                    %
                  </span>
                </div>
                <div style={{ textTransform: 'uppercase', fontWeight: 400, fontSize: 12, textAlign: 'right', width: '100%' }}>Opted Out</div>
              </div>
              <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #ffffff', padding: 10 }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
                  <div style={{ fontSize: 24 }}>{surveyResults.pending > 999 ? numeral(surveyResults.pending).format('0.0 a') : surveyResults.pending}</div>
                  <span style={{ backgroundColor: '#ffffff', padding: '0 4px', margin: '0px 10px', color: 'rgb(74, 79, 87)', borderRadius: 4, fontSize: 12 }}>
                    {!surveyResults.pending || !surveyResults.contacted ? 0 : (surveyResults.pending / surveyResults.contacted * 100).toFixed(1)}
                    %
                  </span>
                </div>
                <div style={{ textTransform: 'uppercase', fontWeight: 400, fontSize: 12, textAlign: 'right', width: '100%' }}>Pending</div>
              </div>
              <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #ffffff', padding: 10 }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
                  <div style={{ fontSize: 24 }}>{surveyResults.finished > 999 ? numeral(surveyResults.finished).format('0.0 a') : surveyResults.finished}</div>
                  <span style={{ backgroundColor: '#ffffff', padding: '0 4px', margin: '0px 10px', color: 'rgb(74, 79, 87)', borderRadius: 4, fontSize: 12 }}>
                    {!surveyResults.finished || !surveyResults.responded ? 0 : (surveyResults.finished / surveyResults.responded * 100).toFixed(1)}
                    %
                  </span>
                </div>
                <div style={{ textTransform: 'uppercase', fontWeight: 400, fontSize: 12, textAlign: 'right', width: '100%' }}>Completed</div>
              </div>
              <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10 }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
                  <div style={{ fontSize: 24 }}>{surveyResults.activeInSurvey > 999 ? numeral(surveyResults.activeInSurvey).format('0.0 a') : surveyResults.activeInSurvey}</div>
                  <span style={{ backgroundColor: '#ffffff', padding: '0 4px', margin: '0px 10px', color: 'rgb(74, 79, 87)', borderRadius: 4, fontSize: 12 }}>
                    {surveyResults.activeInSurvey || !surveyResults.responded ? '0' : (surveyResults.activeInSurvey / surveyResults.responded * 100).toFixed(1)}
                    %
                  </span>
                </div>
                <div style={{ textTransform: 'uppercase', fontWeight: 400, fontSize: 12, textAlign: 'right', width: '100%' }}>In Progress</div>
              </div>
            </div>
          </Col>
        )
      }
    </Row>
  );
};

SurveySummary.propTypes = {
  surveyResults: PropTypes.object,
  isFetchingData: PropTypes.bool,
  width: PropTypes.number,
};

export default SurveySummary;

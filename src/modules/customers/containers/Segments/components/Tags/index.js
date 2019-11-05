/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/href-no-hash, no-shadow, no-nested-ternary, object-curly-newline */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactPlaceholder from 'react-placeholder';
import { RectShape } from 'react-placeholder/lib/placeholders';
import numeral from 'numeral';
import Hashids from 'hashids';

import IconButton from 'SharedComponents/icon-button';
import { createDummySegments } from '../../../components/DummyData'; 
import HorizontalContentScroller from 'SharedComponents/horizontal-content-scroller';
import * as customerAnalyticsActions from 'Modules/analytics/containers/flux/actions';
import './index.css';

const tags = ({ isLoadingSegments, segments, totalCustomersCount, onViewAllSegments, onCreateSegment, onSelectSegment, demoMode, configurations }) => {
  if(isLoadingSegments) {
    return (
      <div style={{ height: 100, width: '100%', marginBottom: 0, marginTop: 15 }}>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', overflowX: 'auto', marginBottom: 20, padding: '1px 0px 1px 3px' }} className="segments-scrollable-view hide-scrollbars">
          {
            [1, 2, 3, 4, 5].map((segment) => (
              <div key={segment} style={{ padding: '0 10px 0 10px', borderRadius: 8, width: '100%' }}>
                <div style={{ width: 250, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, boxShadow: 'rgba(67, 70, 86, 0.1) 0 0px 0px 4px', marginBottom: 20, marginTop: 10 }}>
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', color: '#8898aa', fontSize: '.8125rem' }}>
                    <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%', marginBottom: 5 }}><RectShape color="#d9d9d9" style={{ height: 15, width: 100 }} /></div>} />
                  </div>
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', fontWeight: 600, color: '#525f7f', fontSize: '1.25rem' }}>
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                      <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%' }}><RectShape color="#d9d9d9" style={{ height: 30, width: 50 }} /></div>} />
                    </div>
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
                      <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%', marginBottom: 5, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}><RectShape color="#d9d9d9" style={{ height: 15, width: 50, marginRight: 0 }} /></div>} />
                      </div>
                      <div style={{ color: '#525f7f', fontWeight: 300, fontSize: 10, width: '100%', textAlign: 'right' }}>
                        <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}><RectShape color="#d9d9d9" style={{ height: 15, width: 100, marginRight: 0 }} /></div>} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    );
  }
  
  if(configurations && !configurations.features.customerAnalytics && !demoMode) {
    return(
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', marginBottom: 0, marginTop: 15, position: 'relative' }}>
        <HorizontalContentScroller>
          {
            segments.items.map((segment) => (
              <div onClick={() => onSelectSegment(segment.id)} key={segment.id} style={{ padding: '0 10px 0 10px', borderRadius: 8, cursor: 'pointer' }}>
                <div style={{ width: 250, height: 75, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, boxShadow: 'rgba(67, 70, 86, 0.1) 0 0px 0px 4px' }}>
                  <span style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', color: '#8898aa', fontSize: 14, padding: 0 }}>{segment.name}</span>
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', fontWeight: 600, color: '#525f7f', fontSize: '1.25rem' }}>
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                      {numeral(segment.count).format('0.0 a').replace(' ', '')}
                    </div>
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
                      <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <i className="material-icons" style={{ color: '#2dce89', fontWeight: 300, fontSize: '.875rem' }}>trending_up</i>
                        &nbsp;
                        <span style={{ color: '#2dce89', fontWeight: 300, fontSize: '.875rem', marginRight: '.5rem' }}>3.48%</span>
                      </div>
                      <div style={{ color: '#525f7f', fontWeight: 300, fontSize: 10, width: '100%', textAlign: 'right' }}>Since last month</div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          }
          <div style={{ padding: '0 10px 0 10px', borderRadius: 8 }}>
            <div onClick={() => onCreateSegment(false)} style={{ width: 250, height: 75, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', cursor: 'pointer', padding: 10, borderRadius: 8, boxShadow: 'rgba(67, 70, 86, 0.1) 0 0px 0px 4px' }}>
              <span style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', color: '#8898aa', fontSize: 14, padding: 0 }}>
                <i className="material-icons" style={{ fontSize: 30 }}>add_circle_outline</i>
                &nbsp;
                <span>Create a segment</span>
              </span>
            </div>
          </div>
          <div style={{ padding: '0 10px 0 10px', borderRadius: 8 }}>
            <div onClick={onViewAllSegments} style={{ width: 250, height: 75, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', cursor: 'pointer', padding: 10, borderRadius: 8, boxShadow: 'rgba(67, 70, 86, 0.1) 0 0px 0px 4px' }}>
              <span style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', color: '#8898aa', fontSize: 14, padding: 0 }}>
                <i className="material-icons" style={{ fontSize: 18 }}>visibility</i>
                &nbsp;
                <span>View All Segments</span>
              </span>
            </div>
          </div>
        </HorizontalContentScroller>
      </div>
    );
  }

  if(!segments.items.length && totalCustomersCount > 0) {
    return(
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', marginBottom: 0, marginTop: 15, position: 'relative' }}>
        <div style={{ padding: '0 10px 0 10px', borderRadius: 8 }}>
          <div onClick={() => onCreateSegment(false)} style={{ width: 250, height: 75, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', cursor: 'pointer', padding: 10, borderRadius: 8, boxShadow: 'rgba(67, 70, 86, 0.1) 0 0px 0px 4px' }}>
            <span style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', color: '#8898aa', fontSize: 14, padding: 0 }}>
              <i className="material-icons" style={{ fontSize: 30 }}>add_circle_outline</i>
              &nbsp;
              <span>Create a segment</span>
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (!segments.items.length) {
    return (
      <div style={{ width: '100%', marginBottom: 20, marginTop: 10 }}>
        <div style={{ minWidth: '100%', height: 40, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', overflowX: 'auto', marginBottom: 20, paddingLeft: 3 }} className="segments-scrollable-view hide-scrollbars">
          <div style={{ width: 200, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
            <div>You do no have any segments</div>
          </div>
        </div>
      </div>
    );
  }
    
  return (
    <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', marginBottom: 0, marginTop: 15, position: 'relative' }}>
      <HorizontalContentScroller>
        {
          demoMode ? (
              createDummySegments().map((segment) => (
                <div onClick={() => onSelectSegment(segment.id)} key={segment.id} style={{ padding: '0 10px 0 10px', borderRadius: 8, cursor: 'pointer' }}>
                  <div style={{ width: 250, height: 75, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, boxShadow: 'rgba(67, 70, 86, 0.1) 0 0px 0px 4px' }}>
                    <span style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', color: '#8898aa', fontSize: 14, padding: 0 }}>{segment.name}</span>
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', fontWeight: 600, color: '#525f7f', fontSize: '1.25rem' }}>
                      <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                        {numeral(segment.count).format('0.0 a').replace(' ', '')}
                      </div>
                      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                          <i className="material-icons" style={{ color: '#2dce89', fontWeight: 300, fontSize: '.875rem' }}>trending_up</i>
                          &nbsp;
                          <span style={{ color: '#2dce89', fontWeight: 300, fontSize: '.875rem', marginRight: '.5rem' }}>3.48%</span>
                        </div>
                        <div style={{ color: '#525f7f', fontWeight: 300, fontSize: 10, width: '100%', textAlign: 'right' }}>Since last month</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
          ) : (
            segments.items.slice(0, 7).map((segment) => (
              <div onClick={() => onSelectSegment(segment.id)} key={segment.id} style={{ padding: '0 10px 0 10px', borderRadius: 8, cursor: 'pointer' }}>
                <div style={{ width: 250, height: 75, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, boxShadow: 'rgba(67, 70, 86, 0.1) 0 0px 0px 4px' }}>
                  <span style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', color: '#8898aa', fontSize: 14, padding: 0 }}>{segment.name}</span>
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', fontWeight: 600, color: '#525f7f', fontSize: '1.25rem' }}>
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                      {numeral(segment.count).format('0.0 a').replace(' ', '')}
                    </div>
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
                      <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <i className="material-icons" style={{ color: '#2dce89', fontWeight: 300, fontSize: '.875rem' }}>trending_up</i>
                        &nbsp;
                        <span style={{ color: '#2dce89', fontWeight: 300, fontSize: '.875rem', marginRight: '.5rem' }}>3.48%</span>
                      </div>
                      <div style={{ color: '#525f7f', fontWeight: 300, fontSize: 10, width: '100%', textAlign: 'right' }}>Since last month</div>
                    </div>
                  </div>
                </div>
              </div>
          ))
          )
        }
        <div style={{ padding: '0 10px 0 10px', borderRadius: 8 }}>
          <div onClick={onViewAllSegments} style={{ width: 250, height: 75, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', cursor: 'pointer', padding: 10, borderRadius: 8, boxShadow: 'rgba(67, 70, 86, 0.1) 0 0px 0px 4px' }}>
            <span style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', color: '#8898aa', fontSize: 14, padding: 0 }}>
              <i className="material-icons" style={{ fontSize: 18 }}>visibility</i>
              &nbsp;
              <span>View All Segments</span>
            </span>
          </div>
        </div>
      </HorizontalContentScroller>
    </div>
  );
}

export default tags;
import React from 'react';
import PropTypes from 'prop-types';
import { Popup } from 'semantic-ui-react';
import ReactPlaceholder from 'react-placeholder';
import { RectShape } from 'react-placeholder/lib/placeholders';
import numeral from 'numeral';

const HorizontalBarChart = ({ data, loading, bars = 4 }) => {
  if (loading) {
    return (
      <div style={{ backgroundColor: '#FFF', width: '100%', position: 'relative', textAlign: 'right' }}>
        {
          Array.from(new Array(bars), (val, index) => index + 1).map((bar) => (
            <div style={{ display: 'flex', alignItems: 'space-between', height: 20, margin: '5px 0 5px' }} key={`${bar}-bar`}>
              <div style={{ width: '35%', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', paddingRight: 5 }}>
                <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%' }}><RectShape color="#d9d9d9" style={{ width: '100%', height: 15 }} /></div>} />
              </div>
              <div style={{ width: '50%', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', paddingLeft: 5, paddingRight: 5 }}>
                <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%' }}><RectShape color="#d9d9d9" style={{ width: '100%', height: 15 }} /></div>} />
              </div>
              <div style={{ width: '15%', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingLeft: 5 }}>
                <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%' }}><RectShape color="#d9d9d9" style={{ width: '100%', height: 15 }} /></div>} />
              </div>
            </div>
          ))
        }
      </div>
    );
  }

  if (!data || !data.length) {
    return (
      <div style={{ width: '100%', fontSize: 12, lineHeight: 2.92, color: '#6d6e71', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <div>No data to display</div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#FFF', width: '100%', position: 'relative', textAlign: 'right' }}>
      {
        data.map((row) => (
          <div style={{ display: 'flex', alignItems: 'space-between', height: 20, margin: '5px 0 5px' }} key={row.name.replace(' ', '-')}>
            <div style={{ width: '35%', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', padding: 10 }}>
              <Popup
                trigger={<span style={{ fontSize: 11, color: '#6d6e71', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textTransform: 'capitalize' }}>{row.name}</span>}
                content={`${row.name} (${row.count < 1000 ? numeral(row.count).format('0 a') : numeral(row.count).format('0.0 a')})`}
                basic
                inverted
                hoverable
                style={{ padding: '2px 5px', backgroundColor: '#58595b' }}
              />
            </div>
            <div style={{ width: '50%', margin: 0, backgroundColor: '#f7f7f7' }}>
              <div style={{ width: `${row.percentage}%`, backgroundImage: 'linear-gradient(98deg, #2574a6, #c86dd7)', height: '100%', WebkitTransition: 'width 1s', transition: 'width 1s', borderBottomRightRadius: 10, borderTopRightRadius: 10 }}></div>
            </div>
            <div style={{ width: '15%', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', fontSize: 11, color: '#6d6e71' }}>{`${isNaN(row.percentage) ? 0 : row.percentage}%`}</div>
          </div>
        ))
      }
    </div>
  );
};

HorizontalBarChart.propTypes = {
  data: PropTypes.array,
  loading: PropTypes.bool,
  bars: PropTypes.number,
};

export default HorizontalBarChart;

/* eslint-disable jsx-a11y/href-no-hash, object-curly-newline */
import React from 'react';
import PropTypes from 'prop-types';
import { Popup } from 'semantic-ui-react';

const yScaleArray = [100, 75, 50, 25, 0];
const xScaleArray = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

const RewardsAndPenaltiesGraph = ({ data, themes, colors, width }) => (
  <div style={{ backgroundColor: '#FFF', width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ width: 20, writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)', fontSize: 12, letterSpacing: 0.5, fontWeight: 'bold', color: '#888888' }}>Percentage Promoters</div>
    <div style={{ width: 'calc(100% - 20px)', position: 'relative', textAlign: 'right' }}>
      {
        yScaleArray.map((item) => (
          <div key={item} style={{ width: '100%', marginBottom: 2, backgroundColor: '#ffffff', height: 35, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', fontSize: 12, letterSpacing: 0.5, fontWeight: 'bold', color: '#888888' }}>
            <div style={{ width: 50, height: '100%', display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center' }}>{item}</div>
            <div style={{ width: 'calc(100% - 50px)', backgroundColor: '#f7f7f7', height: '100%' }}></div>
          </div>
        ))
      }
      <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 50 }}></div>
        <div style={{ width: 'calc(100% - 50px)', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '100%', height: '100%', position: 'relative', background: 'linear-gradient(to left top, rgba(255, 255, 255, 0) calc(50% - 1px), rgb(170, 170, 170), rgba(255, 255, 255, 0) calc(50% + 1px))' }}>
            {
              themes.map((theme, index) => {
                if (!data.length) {
                  return null;
                }
                const point = data.find((record) => record.theme === theme);
                const totalCustomers = point ? parseInt(point.promoters, 10) + parseInt(point.passives, 10) + parseInt(point.detractors, 10) : 0;
                const percentagePromoters = totalCustomers > 0 ? (parseInt(point.promoters, 10) / totalCustomers) * 100 : 0;
                const percentageDetractors = totalCustomers > 0 ? (parseInt(point.detractors, 10) / totalCustomers) * 100 : 0;
                return (
                  <Popup
                    trigger={<span style={{ position: 'absolute', backgroundColor: colors[index], width: 20, height: 20, borderRadius: 10, border: '1px solid #ffffff', bottom: `calc(${percentagePromoters}% - 10px)`, left: `calc(${percentageDetractors}% - 10px)` }} />}
                    content={`${point.theme}: ${percentagePromoters.toFixed(1)}% / ${percentageDetractors.toFixed(1)}%`}
                    basic
                    inverted
                    hoverable
                    style={{ padding: '2px 5px', backgroundColor: '#58595b' }}
                  />
                );
              })
            }
          </div>
          <div style={{ width: '100%', height: 65 }}></div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <div style={{ width: 55 }}></div>
        <div style={{ width: 'calc(100% - 55px)', margin: 0, backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, letterSpacing: 0.5, fontWeight: 'bold', color: '#888888' }}>
            {
              xScaleArray.map((item) => {
                if (width <= 425 && item % 20 !== 0) {
                  return null;
                }
                return (
                  <div key={item}>{item}</div>
                );
              })
            }
          </div>
          <div style={{ width: '100%', fontSize: 12, letterSpacing: 0.5, fontWeight: 'bold', color: '#888888', marginTop: 10, textAlign: 'center' }}>Percentage Detractors</div>
        </div>
      </div>
    </div>
  </div>
);

RewardsAndPenaltiesGraph.propTypes = {
  data: PropTypes.array,
  themes: PropTypes.array,
  colors: PropTypes.array,
  width: PropTypes.number,
};

export default RewardsAndPenaltiesGraph;

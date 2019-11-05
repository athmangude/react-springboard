/* eslint-disable jsx-a11y/href-no-hash, object-curly-newline */
import React from 'react';
import PropTypes from 'prop-types';
import { Popup } from 'semantic-ui-react';
import numeral from 'numeral';

const yScaleSize = 4;
const xScaleArray = [-1, -0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75, 1];

const KeyDriverAnalysisGraph = ({ data, themes, colors }) => {
  const frequencies = data.map((record) => record.frequency);
  const maxFrequency = Math.max(...frequencies);
  const base = maxFrequency.toString().length === 1 ? 10 : 100;
  const upperLimit = Math.ceil(maxFrequency / base) * base; // To the nearest base
  const interval = upperLimit / yScaleSize;
  const yScaleArray = [upperLimit];
  Array.from(new Array(yScaleSize), (val, index) => index).reverse().map((i) => yScaleArray.push(i * interval));

  return (
    <div style={{ backgroundColor: '#FFF', width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 20, writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)', fontSize: 12, letterSpacing: 0.5, fontWeight: 'bold', color: '#888888' }}>Frequency</div>
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
            <div style={{ width: '100%', height: '100%', position: 'relative', background: 'linear-gradient(to top, rgba(255, 255, 255, 0) calc(50% - 1px), rgb(170, 170, 170), rgba(255, 255, 255, 0) calc(50% + 1px)), linear-gradient(to right, rgba(255, 255, 255, 0) calc(50% - 1px), rgb(170, 170, 170), rgba(255, 255, 255, 0) calc(50% + 1px))' }}>
              {
                themes.map((theme, index) => {
                  if (!data.length) {
                    return null;
                  }
                  const point = data.find((record) => record.theme === theme);
                  const percentageFrequency = point.frequency ? (point.frequency / upperLimit) * 100 : 0;
                  const percentageImportance = point.importance ? (1 + point.importance) / 2 * 100 : 0;
                  return (
                    <Popup
                      trigger={<span style={{ position: 'absolute', backgroundColor: colors[index], width: 20, height: 20, borderRadius: 10, border: '1px solid #ffffff', bottom: `calc(${percentageFrequency}% - 10px)`, left: `calc(${percentageImportance}% - 10px)` }} />}
                      content={`${point.theme}: ${point.frequency > 999 ? numeral(point.frequency).format('0.0 a') : point.frequency}/ ${point.importance.toFixed(2)}`}
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
          <div style={{ width: 40 }}></div>
          <div style={{ width: 'calc(100% - 40px)', margin: 0, backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, letterSpacing: 0.5, fontWeight: 'bold', color: '#888888' }}>
              {
                xScaleArray.map((item) => (
                  <div key={item}>{item}</div>
                ))
              }
            </div>
            <div style={{ width: '100%', fontSize: 12, letterSpacing: 0.5, fontWeight: 'bold', color: '#888888', marginTop: 10, textAlign: 'center' }}>Importance</div>
          </div>
        </div>
      </div>
    </div>
  );
};

KeyDriverAnalysisGraph.propTypes = {
  data: PropTypes.array,
  themes: PropTypes.array,
  colors: PropTypes.array,
  width: PropTypes.number,
};

export default KeyDriverAnalysisGraph;

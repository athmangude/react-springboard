/* eslint-disable jsx-a11y/href-no-hash, object-curly-newline, no-plusplus */
import React from 'react';
import PropTypes from 'prop-types';
import { Popup } from 'semantic-ui-react';

const npsColors = {
  promoter: '#a3d39c',
  detractor: '#f46800',
};

const ImpactGraph = ({ data, themes, colors, width }) => {
  const percentages = data.map((record) => record.percentage);
  const upperLimit = Math.max(...percentages);
  const lowerLimit = Math.min(...percentages);
  const boundary = Math.abs(upperLimit > lowerLimit ? upperLimit : lowerLimit);
  const scale = 100 / boundary;
  const increment = boundary / (width > 425 ? 4 : 2);

  const range = [];
  for (let i = -1 * boundary; i < 0; i += increment) {
    range.push(i);
  }
  for (let i = 0; i <= boundary; i += increment) {
    range.push(i);
  }

  return (
    <div style={{ backgroundColor: '#FFF', width: '100%', position: 'relative', textAlign: 'right', marginBottom: 20 }}>
      {
        themes.map((theme, index) => {
          if (!data.length) {
            return null;
          }
          const row = data.find((record) => record.name === theme);
          return (
            <div style={{ display: 'flex', alignItems: 'space-between', height: 35, marginBottom: 2 }} key={`${row}-bar`}>
              <div style={{ width: 90, margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: 10 }}>
                <Popup
                  trigger={<span style={{ fontSize: 11, color: colors[index], whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.name}</span>}
                  content={row.name}
                  basic
                  inverted
                  hoverable
                  style={{ padding: '2px 5px', backgroundColor: '#58595b' }}
                />
              </div>
              <div style={{ width: 'calc(100% - 90px)', margin: 0, backgroundColor: '#f7f7f7', height: '100%' }}>
                {
                  row.percentage < 0 ? (
                    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: '50%', height: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: `${100 - Math.abs(row.percentage)}%`, backgroundColor: 'inherit', height: '100%', WebkitTransition: 'width 1s', transition: 'width 1s' }}></div>
                        <Popup
                          trigger={(<div style={{ width: `${Math.abs(row.percentage * scale)}%`, backgroundColor: row.percentage < 0 ? npsColors.detractor : npsColors.promoter, height: '100%', WebkitTransition: 'width 1s', transition: 'width 1s' }}></div>)}
                          content={`Impact: ${row.percentage.toFixed(1)}`}
                          basic
                          inverted
                          hoverable
                          style={{ padding: '2px 5px', backgroundColor: '#58595b' }}
                        />
                      </div>
                      <div style={{ width: '50%', height: '100%' }}></div>
                    </div>
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: '50%', height: '100%' }}></div>
                      <div style={{ width: '50%', height: '100%' }}>
                        <Popup
                          trigger={(<div style={{ width: `${row.percentage * scale}%`, backgroundColor: row.percentage < 0 ? npsColors.detractor : npsColors.promoter, height: '100%', WebkitTransition: 'width 1s', transition: 'width 1s' }}></div>)}
                          content={`Impact: ${row.percentage.toFixed(1)}`}
                          basic
                          inverted
                          hoverable
                          style={{ padding: '2px 5px', backgroundColor: '#58595b' }}
                        />
                      </div>
                    </div>
                  )
                }
              </div>
            </div>
          );
        })
      }
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 90 }}></div>
        <div style={{ width: 'calc(100% - 90px)', margin: 0, backgroundColor: '#ffffff', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, letterSpacing: 0.5, fontWeight: 'bold', color: '#888888' }}>
          {
            range.map((item) => (<div key={item}>{item}</div>))
          }
        </div>
      </div>
    </div>
  );
};

ImpactGraph.propTypes = {
  data: PropTypes.array,
  themes: PropTypes.array,
  colors: PropTypes.array,
  width: PropTypes.number,
};

export default ImpactGraph;

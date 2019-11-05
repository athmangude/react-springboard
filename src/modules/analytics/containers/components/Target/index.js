/* eslint-disable jsx-a11y/href-no-hash, object-curly-newline, no-nested-ternary */
import React from 'react';
import numeral from 'numeral';
import { PieChart, Pie, ResponsiveContainer, Cell } from 'recharts';
import PropTypes from 'prop-types';

import Title from '../Title';
import MonthPicker from '../MonthPicker';
import IconButton from 'SharedComponents/icon-button';
import './index.css';

const npsColorScale = {
  detractor: '#fd9681',
  passive: '#fbc027',
  promoter: '#80c582',
};

const Target = ({ metric, data }) => {
  const performance = (metric.raised / metric.value) * 100;
  const color = performance < 50 ? npsColorScale.detractor : performance < 100 ? npsColorScale.passive : npsColorScale.promoter;
  return (
    <div className="grid-item" style={{ width: '100%', padding: '0 10px 10px 10px' }}>
      <Title title={metric.title} subtitle={metric.subtitle} />
      <div className="target-card" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', backgroundColor: '#ffffff', borderRadius: 2, boxShadow: '0 1px 3px 0 rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 2px 1px -1px rgba(0,0,0,.12)', marginBottom: 20, marginTop: 10 }}>
        <div style={{ width: '100%' }}>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', padding: 10 }}>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-start' }}>
              {
                metric.valueContextLeft ? (
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end', color: '#4a4a4a', font: '300 14px/14px Roboto,sans-serif', letterSpacing: 0, margin: '0 5px 5px 0', textAlign: 'right' }}>{metric.valueContextLeft}</div>
                ) : null
              }
              <div style={{ color: '#4a4a4a', font: '300 30px Roboto,sans-serif', letterSpacing: 0, textAlign: 'right' }}>{metric.value > 999 ? numeral(metric.value).format('0.0 a').toUpperCase().replace(' ', '') : metric.value}</div>
              <IconButton icon="edit" toolTipText="Edit Target" style={{ marginBottom: -5 }} />
            </div>
            <div style={{ color: '#4a4a4a', font: '300 14px/14px Roboto,sans-serif', letterSpacing: 0, marginBottom: 5, display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end', lineHeight: 1.4 }}>
              <span style={{ marginRight: 10 }}>{metric.name}</span>
              <i className="material-icons" style={{ fontSize: 25, marginBottom: -5 }}>{metric.icon}</i>
            </div>
          </div>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10, borderTop: '1px solid #dddddd' }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', margin: 0, height: 50, width: 50, font: '300 12px/14px Roboto,sans-serif', letterSpacing: 0.01, position: 'relative' }}>
              <span style={{ color, position: 'absolute', width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>{`${performance.toFixed(0)}%`}</span>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={data} innerRadius={20} outerRadius={25} stroke="none" fill="#ffffff" startAngle={90} endAngle={450} dataKey="amount">
                    {
                      data.map((entry) => {
                        if (entry.name === 'raised') {
                          return (<Cell fill={color} />);
                        }
                        return (<Cell fill="#ffffff" />);
                      })
                    }
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
              <MonthPicker />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Target.propTypes = {
  metric: PropTypes.object,
  data: PropTypes.array,
};

export default Target;

// /* eslint-disable jsx-a11y/href-no-hash, no-shadow, object-curly-newline, no-nested-ternary */
// import React from 'react';
// // import PropTypes from 'prop-types';
// import { PieChart, Pie, ResponsiveContainer, Cell, Legend } from 'recharts';
// import numeral from 'numeral';

// const TARGET = 10000000;
// const RAISED = 9000000;
// const data = [
//   { name: 'raised', amount: RAISED, fill: '#8884d8' },
//   { name: 'remaining', amount: TARGET - RAISED, fill: '#83a6ed' },
// ];

// const Target = () => (
//   <div className="grid-item" style={{ width: '100%', padding: '0 10px 10px 10px' }}>
//     <div style={{ height: 18, margin: '16px 0 8px 0', color: '#4a4a4a', font: '300 18px/14px Roboto,sans-serif', letterSpacing: 0 }}>Financial Target</div>
//     <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', backgroundColor: '#154E89', borderRadius: 2, boxShadow: '0 1px 3px 0 rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 2px 1px -1px rgba(0,0,0,.12)', marginBottom: 20, marginTop: 10 }}>
//       <div style={{ width: '100%', padding: '20px 10px 0px 10px' }}>
//         <div style={{ color: '#ffffff', font: '400 14px/10px Roboto,sans-serif', letterSpacing: 0, marginBottom: 10, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
//           <i className="material-icons">gps_fixed</i>
//           <span>Target</span>
//         </div>
//         <div style={{ color: '#ffffff', font: '300 30px Roboto,sans-serif', letterSpacing: 0, margin: '0 auto', textAlign: 'center' }}>{TARGET > 999 ? numeral(TARGET).format('0.0 a').toUpperCase().replace(' ', '') : TARGET}</div>
//       </div>
//       <div style={{ width: '100%', height: 200, position: 'relative', marginBottom: 20 }}>
//         <div style={{ position: 'absolute', width: '100%', height: 200 }}>
//           <div style={{ height: 200, right: 20, top: 35, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#ffffff', font: '300 30px Roboto,sans-serif', letterSpacing: 0, margin: '-15px auto' }}>
//             <div>90%</div>
//             <div style={{ fontSize: 14 }}>{RAISED > 999 ? numeral(RAISED).format('0.0 a').toUpperCase().replace(' ', '') : RAISED}</div>
//           </div>
//         </div>
//         <ResponsiveContainer>
//           <PieChart>
//             <Pie data={data} innerRadius={55} outerRadius={65} stroke="none" fill="rgba(72, 125, 179, 0.5)" startAngle={90} endAngle={450} dataKey="amount">
//               {
//                 data.map((entry) => {
//                   if (entry.name === 'raised') {
//                     return (<Cell fill="#487CB3" />);
//                   }
//                   return (<Cell fill="#2D65A0" />);
//                 })
//               }
//             </Pie>
//             <Legend iconSize={10} layout="vertical" verticalAlign="bottom" wrapperStyle={{ color: '#ffffff' }} />
//           </PieChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   </div>
// );

// export default Target;

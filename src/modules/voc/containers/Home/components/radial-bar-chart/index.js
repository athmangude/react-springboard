import React from 'react';
import { Divider } from 'semantic-ui-react';
import Chart from './chart';

const RadialBarChart = () => (
  <div style={{ width: '100%', border: 'solid 1px #d9d9d9', margin: '10px 0', backgroundColor: '#fafafa', padding: 15 }}>
    <div><b style={{ color: '#3d4553' }}>Safaricom | mpesa feeling | </b><span style={{ color: '#808285', fontWeight: 100 }}>Nov. 24, 2017, KE</span></div>
    <div style={{ border: 'solid 1px #d9d9d9', backgroundColor: '#FFF', padding: 10, margin: '10px 0' }}>
      <Chart />
    </div>
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
      <b style={{ color: '#808285' }}>21 Views</b>
      <b style={{ color: '#808285' }}>10 Comments</b>
    </div>
    <Divider />
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
      {
        [{ action: 'Reply', icon: 'reply' }, { action: 'Notes', icon: 'insert_drive_file' }, { action: 'Edit Tags', icon: 'local_offer' }].map((item, i) => (
          <div key={i} style={{ border: 'solid 1px #d9d9d9', borderRadius: 17, display: 'flex', flexDirection: 'row', alignItems: 'center', margin: '2px 3px', padding: '0px 15px', fontSize: 9, color: '#808285' }}>
            <i className="material-icons" style={{ color: '#808285', fontSize: 15, margin: 3, direction: 'rtl' }}>{item.icon}</i> {item.action}
          </div>
        ))
      }
    </div>
  </div>
);

export default RadialBarChart;

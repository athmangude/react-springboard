import React from 'react';

const Bar = (props) => (
  <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'center', flexDirection: 'column', width: '100%' }}>
    <span style={{ color: '#808285', fontSize: 12 }}>{props.label}</span>
    <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ width: 'calc(100% - 100px)', height: 10, backgroundColor: '#d9d9d9', borderRadius: 5 }}>
        <div style={{ backgroundColor: '#487db3', width: props.percentage, height: '100%', WebkitTransition: 'width 1s', transition: 'width 1s', borderRadius: 5 }}>
        </div>
      </div>
      <div style={{ width: 100, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        <span style={{ color: '#808285', fontSize: 12 }}>{`${props.percentage} (${props.value})`}</span>
      </div>
    </div>
  </div>
);

export default Bar;
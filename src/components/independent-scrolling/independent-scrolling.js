import React from 'react';

const independentScrolling =(props)=> {

    const style = {
        position: 'sticky',
        top: 0,
        // width: '25%', 
        padding: 10,
        overflowY: 'auto',
        height: 'calc(100vh)',
    };

    return (
    <div style={style} className={'hide-scrollbars'}>
        {props.children}
    </div>
    );
};

export default independentScrolling;